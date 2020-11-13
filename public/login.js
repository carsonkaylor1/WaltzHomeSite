
                function checkIfLoggedIn(){
                    firebase.auth().onAuthStateChanged(function(user){
                        if(user){
                            console.log('user signed in');
                            console.log(user);
                            window.location = '/index.html'
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
                        console.log(error);
                    });
               
                }

                function signOut(){
                    firebase.auth().signOut();
                }

                window.onload = function(){
                    checkIfLoggedIn();
                }