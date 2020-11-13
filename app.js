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

const firestore = firebase.firestore();
const auth = firebase.auth();

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

// app.use(express.static(process.env.STATIC_DIR))


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

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
  // console.log(res);
  // bodyParser.json(accounts);
  // console.log(accounts);
//   try{
//   var sellerRef = firestore.collection("sellers");
//   console.log(sellerRef.id);
//   var sellerRes = await sellerRef.where('authSellerId', '==', 'EwIRGQvsEGebULc1gysEYMPrQuW2').get();
//   if(sellerRes.empty){
//     console.log('no matching results');
//     return;
//   }
//   sellerRes.forEach(doc => {
//     console.log(doc.id, '=>', doc.data());
//   })
// }
// catch(error){
//   console.log(error);
// }
  
  
})

app.get("/users", async (req, res) => {
  try {
      const userQuerySnapshot = await db.collection(userCollection).get();
     
      userQuerySnapshot.forEach(
          (doc)=>{
              console.log(doc);
          }
      );
      res.status(200).json(users);
  } catch (error) {
      res.status(500).send(error);
  }
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
