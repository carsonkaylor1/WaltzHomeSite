let userEmail;

const stripeAccountPromise = new Promise((resolve, reject) => {
  fetch('/get-accounts', {
    method: "POST",
    headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
  }).then(res =>  res.json())
  .then(data => {
    console.log('data is' + data.details)
    const{
      result, details
    } = data;
    console.log('result is ' + result + details);
    if(result && details){
      resolve(result);
    }
    else{
    reject('/index.html');
    }
  });
}).catch(e => window.location = e );

stripeAccountPromise.then((accountID) => {
  const firebasePromise = new Promise((resolve, reject) => {

    firebase.auth().onAuthStateChanged(function(user){
      if(user){
          console.log('user signed in');
          console.log(user.email);
          resolve(user.email);
      }
      else{
          console.log('user not signed in');
          reject('no email')
      }
    });
  });
  
  firebasePromise.then((email) => {
    console.log(email);    
    var sellerRef = firebase.firestore().collection("sellers");
    sellerRef.where('email', '==', email).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          console.log(doc.id);
          var sellerDoc = sellerRef.doc(doc.id);
          var sellerConnectedAccountIDValue = doc.data().connectedAccountId;
          console.log('value is ' + sellerConnectedAccountIDValue);
          if(!sellerConnectedAccountIDValue){
            sellerDoc.update({
              connectedAccountId: accountID
            })
          }
          else{
            console.log('Already Connected Account ID');
          }
          
          
      });
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
    
  }).then(function(){
    console.log('success!')
    window.location = './submit.html'
  }

  )


 })


// function send(){
//     return fetch('/get-accounts', {
//       method: "GET",
//       headers: {
//               'Accept': 'application/json',
//               'Content-type': 'application/json'
//             },
//     }).then((response) => response.json())
//     .then((responseData) => {
//       console.log(responseData);
//       return responseData;
//     })
//     .catch(error => consolewarn(error));
    
//   }

//   send().then(response => {
//     console.log(response);
//     console.log('hi');
//   });  













  async function addUserToDB(email){
    console.log('email is ' + email);
    var sellerRef = firebase.firestore().collection("sellers");
  console.log(sellerRef.id);
  var sellerRes = await sellerRef.where('email', '==', 'eakeyson2@gmail.com').get();
  var sellerDoc = sellerRef.doc('EwIRGQvsEGebULc1gysEYMPrQuW2');
  sellerDoc.update({
    connectedAccountId: 'testID'
  })
  if(sellerRes.empty){
    console.log('no matching results');
    return;
  }
  sellerRes.forEach(doc => {
    console.log(doc.id, '=>', doc.id);
  })
  }

  async function getUserEmail(){
    let v;
    try{
      return v = await Promise.resolve(checkIfLoggedIn());
      console.log('v is ' + v);
    }
    catch(e){
      console.log('error');
    }
    return addUserToDB(v);
  }


  async function checkIfLoggedIn(){
   await Promise.resolve(firebase.auth().onAuthStateChanged(function(user){
        if(user){
            console.log('user signed in');
            console.log(user.email);
            // userEmail = user.email;
            userEmail = 'eakeyson2@gmail.com';
            return userEmail;
        }
        else{
            console.log('user not signed in');
            return 'nothing';
        }
    })).then( v => {
      console.log(v);
    })
}

// function checkIfLoggedIn(){
//   firebase.auth().onAuthStateChanged(function(user){
//       if(user){
//           console.log('user signed in');
//           console.log(user.email);
//           // userEmail = user.email;
//           userEmail = 'eakeyson2@gmail.com';
//           return (userEmail);
//       }
//       else{
//           console.log('user not signed in');
//       }
//   })
// .catch(e => {
//   console.log("Error" + e);
// })
// .then( userEmail => {
//   console.log(userEmail);
//   addUserToDB(userEmail);
// })

// }
  