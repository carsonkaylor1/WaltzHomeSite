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
            let myAccount = sessionStorage.getItem('account');
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
                  firebase.auth().onAuthStateChanged(function(user){
                      if(user){
                          document.getElementById('user-email-text').innerHTML += user.email;
                          
                      }
                      else{
                          window.location = '/';
                      }
                  })
              }
    window.onload = function(){
    checkIfLoggedIn();}
    

    function signOut(){
      firebase.auth().signOut();
    }