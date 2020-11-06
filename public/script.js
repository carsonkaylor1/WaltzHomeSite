

// let txtButton = document.querySelector("#txt")

// txtButton.addEventListener('click', send, false);

// function send() {
//   fetch('/success', {
//     method: 'post',
//     headers: {
//       'Content-type': 'application/json'
//     },
//     body: JSON.stringify({number: to, text: text})
//   })
//   .then(function(res){
//     console.log(res);
//   })
//   .catch(function(err){
//     console.log(err);
//   })
// }

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