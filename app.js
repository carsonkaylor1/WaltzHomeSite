// Replace if using a different env file or config
require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const { resolve } = require("path");
const session = require("express-session");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Nexmo = require("nexmo");
// const socketio = require("socket.io");

const app = express();
const port = process.env.PORT || 4242;

//Init Nexmo
// const nexmo = new Nexmo({
//   apiKey: process.env.NEXMO_API_KEY,
//   apiSecret: process.env.NEXMO_SECRET_KEY,
// }, {debug: true});


const from = '19122251516';
const to = '12404572278';
const text = 'Hello from Vonage SMS API';

// let txtButton = document.querySelector("#txt");

// if (txtButton) {
//   console.log('hello')
//   txtButton.addEventListener(
//     "click", e => {
//       console.log('clicked');
//       nexmo.message.sendSms(from, to, text);
//     }
//   )
// }

var MemoryStore = require('memorystore')(session)
app.use(express.static(__dirname + '/public')); 
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: true,
    secret: 'keyboard cat'
}))

// app.use(express.static(process.env.STATIC_DIR));
// app.use(
//   session({
//     secret: "Set this to a random string that is kept secure",
//     resave: false,
//     saveUninitialized: true,
//   })
// );


// app.use(express.static(process.env.STATIC_DIR))


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// app.use(express.static(process.env.STATIC_DIR));
// app.use(
//   session({
//     secret: "Set this to a random string that is kept secure",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

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

app.post("/onboard-user", async (req, res) => {
  try {
    const account = await stripe.accounts.create({type: "standard"});
    req.session.accountID = account.id;

    const origin = `${req.headers.origin}`;
    const accountLinkURL = await generateAccountLink(account.id, origin);
    res.send({ url: accountLinkURL });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
});

app.get("/onboard-user/refresh", async (req, res) => {
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

//Catch send text
app.post('/public/success.html', (req, res) => {
  // res.send(req.body);
  // console.log(req.body);
  // const number = req.body.number;
  // const text = req.body.text;
  console.log('sent');
  nexmo.message.sendSms(from, to, text)
  ;
})

function generateAccountLink(accountID, origin) {
  return stripe.accountLinks
    .create({
      type: "account_onboarding",
      account: accountID,
      refresh_url: `${origin}/onboard-user/refresh`,
      return_url: `${origin}/success.html`,
    })
    .then((link) => link.url);
}

app.listen(port, () => console.log(`Node server listening on port ${port}!`));
