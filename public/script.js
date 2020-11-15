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
            window.location = data.url;
          } else {
            elmButton.removeAttribute("disabled");
            elmButton.textContent = "<Something went wrong>";
            console.log("data", data);
          }
        });
    },
    false
  );
}

async function access(){
  try{
    var sellerRef = firebase.firestore().collection("sellers");

console.log(sellerRef.id);
var sellerRes = await sellerRef.where('authSellerId', '==', 'EwIRGQvsEGebULc1gysEYMPrQuW2').get();
if(sellerRes.empty){
  console.log('no matching results');
  return;
}
sellerRes.forEach(doc => {
  console.log(doc.id, '=>', doc.data());
})
}
catch(error){
console.log(error);
}
  }

  function checkIfLoggedIn(){
                  firebase.auth().onAuthStateChanged(function(user){
                      if(user){
                          console.log('user signed in');
                          console.log(user);
                          document.getElementById('user-email-text').innerHTML += user.email;
                          
                      }
                      else{
                          console.log('user not signed in');
                          window.location = '/';
                      }
                  })
              }
    window.onload = function(){
    checkIfLoggedIn();}
    

    function signOut(){
      firebase.auth().signOut();
    }