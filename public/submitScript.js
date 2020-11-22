let myAccount = sessionStorage.getItem('account');

if(!myAccount){
      window.location = './home';
}
else{
      checkAccountID();
}

firebase.auth().onAuthStateChanged(function(user){
      if(!user){
            window.location = './signinerror';
      }
    });


function checkAccountID(){
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
}
