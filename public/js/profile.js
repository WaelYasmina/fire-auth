const logOut = document.getElementById('logOut');
const mergeAccounts = document.getElementById('mergeAccounts');
const modifyAccount = document.getElementById('modifyAccount');
const displayNameHolder = document.getElementById('displayNameHolder');
const photoHolder = document.getElementById('photoHolder');

const auth = firebase.auth();

logOut.addEventListener('click', () => {
    //signOut() is a built in firebase function responsible for signing a user out
    auth.signOut()
    .then(() => {
        window.location.assign('../');
    })
    .catch(error => {
        console.error(error);
    })
})

auth.onAuthStateChanged(user => {
    console.log(user);
    //display the displayName and photoURL of the user on the page
    if(user.displayName)
        displayNameHolder.innerText = user.displayName;
    if(user.photoURL)
        photoHolder.setAttribute('src', user.photoURL);
})

//Go to modification page
modifyAccount.addEventListener('click', () => {
    window.location.assign('../edit');
});

//Go to merge accounts page
mergeAccounts.addEventListener('click', () => {
    window.location.assign('../merge');
});
