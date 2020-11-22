                function checkIfLoggedIn(){
                    firebase.auth().onAuthStateChanged(function(user){
                        if(user){
                            window.location.href = '/home';
                        }
                        else{
                            // window.location.href = '/signinerror';
                        }
                    })
                }

                function signIn(){
                    
                    firebase.auth().signInWithEmailAndPassword(document.getElementById("username").value, document.getElementById("password").value).then
                    (function(data){
                        
                    })
                    .catch(function(error){
                        document.getElementById("error-message").innerText = error.message;
                    });
               
                }

                function signOut(){
                    firebase.auth().signOut();
                }

                window.onload = function(){
                    checkIfLoggedIn();
                }