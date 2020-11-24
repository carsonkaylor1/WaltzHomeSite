let elmButton = document.querySelector("#submit");
if (elmButton) {
  elmButton.addEventListener(
    "click",
    e => {
      elmButton.setAttribute("disabled", "disabled");
      elmButton.textContent = "Opening...";

      fetch("/onboard-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.url) {
            sessionStorage.setItem('account', data.acctID);
            window.location = data.url;
          } else {
            elmButton.removeAttribute("disabled");
            elmButton.textContent = "<Something went wrong>";
          }
        });
    },
    false
  );
}

function checkIfLoggedIn(){
  const firebasePromise = new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        document.getElementById('user-email-text').innerHTML += user.email;
          resolve(user.email);
      }
      else{
        window.location = '/';
      }
    })
  })
  
  firebasePromise.then((email) => {
    var sellerRef = firebase.firestore().collection("sellers");
    sellerRef.where('email', '==', email).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        var sellerConnectedAccountIDValue = doc.data().connectedAccountId;
        if (sellerConnectedAccountIDValue){
          window.location = '/submiterror'
        }            
      });
    })
  })
}

window.onload = function(){
  checkIfLoggedIn();}
    
function signOut(){
      firebase.auth().signOut();
}