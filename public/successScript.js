let userEmail;
let myAccount = sessionStorage.getItem('account');
console.log("my account " + myAccount)

const stripeAccountPromise = new Promise((resolve, reject) => {
  fetch('/get-accounts', {
    method: "POST",
    headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
  }).then(res =>  res.json())
  .then(data => {
    const{
      result, details
    } = data;
    if(result && details){
      resolve();
    }
    else{
    reject('/home');
    }
  });
}).catch(e => window.location = e );

stripeAccountPromise.then(() => {
  const firebasePromise = new Promise((resolve, reject) => {

    firebase.auth().onAuthStateChanged(function(user){
      if(user){
          resolve(user.email);
      }
      else{
          reject()
      }
    });
  });
  
  firebasePromise.then((email) => {
    var sellerRef = firebase.firestore().collection("sellers");
    sellerRef.where('email', '==', email).get()
    .then(function(querySnapshot) {
      const successPromise = new Promise((resolve, reject) => {
        querySnapshot.forEach(function(doc) {
          var sellerDoc = sellerRef.doc(doc.id);
          var sellerConnectedAccountIDValue = doc.data().connectedAccountId;
          if(!sellerConnectedAccountIDValue){ //Check if there is already a value fore connectedAccountId in firebase
            sellerDoc.update({
              connectedAccountId: myAccount
            }).then(function() {
              resolve();
            })
            
          }
          else{
            reject();
          }
          
          
      });
      })
      successPromise.then(() => {
        window.location = './submit';
      })
      .catch(function() {
        window.location = './submiterror';
      })
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
    
  })
  .catch(function(){
    window.location = './signinerror';
  })

  

 })
  