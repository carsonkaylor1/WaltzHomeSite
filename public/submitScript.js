let myAccount = sessionStorage.getItem('account');

if(!myAccount){
      window.location = './home';
}
else{
      checkIfLoggedIn();
}

function checkIfLoggedIn(){
      const firebasePromise = new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(function(user){
            if(user){
                  resolve(user.email)
            }
            else{
                  reject('./signinerror');
            }
          });
      }).catch(e => window.location = e );
}


firebasePromise.then((email) => {
      var sellerRef = firebase.firestore().collection("sellers");
      sellerRef.where('email', '==', email).get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            var sellerConnectedAccountIDValue = doc.data().connectedAccountId;
            
            if (!sellerConnectedAccountIDValue){
                  window.location = '/submiterrorb'
            }
            
        });
      })
})


      

