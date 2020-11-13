let loginButton = document.querySelector("#login");

if(loginButton){
    loginButton.addEventListener(
        'click',
        e => {
            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            console.log(username);
            console.log(password);
            console.log('clicked');
            login();


        }
    )
}

function login(){
    fetch('/login', {
        method: "POST",
        headers: {
                'Content-type': 'application/json'
              },
      })
}