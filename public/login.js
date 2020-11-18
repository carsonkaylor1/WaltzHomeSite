
                function checkIfLoggedIn(){
                    firebase.auth().onAuthStateChanged(function(user){
                        if(user){
                            console.log('user signed in');
                            console.log(user);
                            window.location.href = '/index.html'
                        }
                        else{
                            console.log('user not signed in');
                        }
                    })
                }

                function signIn(){
                    
                    firebase.auth().signInWithEmailAndPassword(document.getElementById("username").value, document.getElementById("password").value).then
                    (function(data){
                        console.log(data);
                        console.log('current user' + firebase.auth().currentUser);
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