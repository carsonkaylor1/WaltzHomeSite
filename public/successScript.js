const from = '19122251516';
const to = '12404572278';
const text = 'Hello from Vonage SMS API';

// window.onload = send();

let txtButton = document.querySelector("#txt")

txtButton.addEventListener('click', send, false);

function send() {
  fetch('public/success.html', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({number: to, text: text})
  })
  .then(function(res){
    console.log(res);
  })
  .catch(function(err){
    console.log(err);
  })
}

function send() {
    fetch('/success.html', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({number: to, text: text})
    })
    .then(function(res){
      console.log(res);
    })
    .catch(function(err){
      console.log(err);
    })
  }