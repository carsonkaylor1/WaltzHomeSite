// Replace if using a different env file or config
require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const { resolve } = require("path");
const session = require("express-session");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Nexmo = require("nexmo");
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

const app = express();
const port = process.env.PORT || 4242;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "waltz-c694e.firebaseapp.com",
  databaseURL: "https://waltz-c694e.firebaseio.com",
  projectId: "waltz-c694e",
  storageBucket: "waltz-c694e.appspot.com",
  messagingSenderId: "305484219833",
  appId: "1:305484219833:web:94f6a94a90b502b31f6268",
  measurementId: "G-WN91ZDZW31"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var MemoryStore = require('memorystore')(session)
app.use(express.static(__dirname + '/public', {index: 'login.html'})); 
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: true,
    secret: 'keyboard cat'
}))

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

//List connected accounts
app.post("/get-accounts", async (req, res) => {
  const accounts = await stripe.accounts.list({
    limit: 1
  });
  console.log(accounts.data[0].id);
  res.send({
    result: accounts.data[0].id
  })
})

// app.post("/accounts", async (req, res) => {
//   const account = awaite stripe.accounts.
// })

app.post("/onboard-user", async (req, res) => {
  try {
    console.log('!!' + req.session.accountID)
    const account = await stripe.accounts.create({type: "standard"});
    req.session.accountID = account.id;
    console.log('??' + req.session.accountID)
    console.log('req is ' + account);
    const origin = `${req.headers.origin}`;
    const accountLinkURL = await generateAccountLink(account.id, origin);
    console.log('!!??' + accountLinkURL)
    res.send({ url: accountLinkURL });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
});

app.get("/onboard-user/refresh", async (req, res) => {
  
  // console.log('refresh +' + req.session.accountID)
  if (!req.session.accountID) {
    res.redirect("/");
    return;
  }
  try {
    const { accountID } = req.session;
    const origin = `${req.secure ? "https://" : "https://"}${req.headers.host}`;

    const accountLinkURL = await generateAccountLink(accountID, origin);
    res.redirect(accountLinkURL);
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
});

async function generateAccountLink(accountID, origin) {
  const account = await stripe.accounts.retrieve(
    accountID
  );
  console.log('account info ' + account.requirements.currently_due);
  if(account.requirements.currently_due){
    console.log('account info 2 ' + account.requirements.currently_due);
    return stripe.accountLinks
    .create({
      type: "account_onboarding",
      account: accountID,
      refresh_url: `${origin}/onboard-user/refresh`,
      return_url: `${origin}/index.html`,
    })
    .then((link) => link.url);
  }
  else{
    return stripe.accountLinks
    .create({
      type: "account_onboarding",
      account: accountID,
      refresh_url: `${origin}/onboard-user/refresh`,
      return_url: `${origin}/success.html`,
    })
    .then((link) => link.url);
  }
  
}

// Match the raw body to content type application/json
app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  let event;

  try {
    event = JSON.parse(request.body);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'account.updated':
      const accountIntent = event.data.object;
      console.log('account Intent: ' + accountIntent);
      window.location = '/success.html'
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      console.log('payment method: ' + paymentMethod);
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
});

app.listen(8000, () => console.log('Running on port 8000'));

app.listen(port, () => console.log(`Node server listening on port ${port}!`));

