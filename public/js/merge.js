const mergeWithGoogle = document.getElementById('mergeWithGoogle');
const mergeWithFacebook = document.getElementById('mergeWithFacebook');
const mergeWithTwitter = document.getElementById('mergeWithTwitter');
const successModal = document.querySelector('.success');
const failureModal = document.querySelector('.failure');
const back = document.getElementById('back');

const auth = firebase.auth();

const mergeWithGoogleFunction = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    auth.currentUser.linkWithPopup(googleProvider)
    .then(() => {
        console.log('Linked To your Google Account Successfully !');
    })
    .catch(error => {
        console.error(error);
    })
}

mergeWithGoogle.addEventListener('click', mergeWithGoogleFunction);

const mergeWithTwitterFunction = () => {
    const previousUser = auth.currentUser;
    const twitterProvider = new firebase.auth.TwitterAuthProvider();
    auth.signInWithPopup(twitterProvider)
    .then(user => {
        const secondAccountCred = user.credential;
        auth.currentUser.delete()
        .then(() => {
            return previousUser.linkWithCredential(secondAccountCred);
        })
        .then(() => {
            auth.signInWithCredential(secondAccountCred);
        })
   });
}

mergeWithFacebook.addEventListener('click', () =>{ 
    auth.currentUser.unlink(auth.currentUser.providerData[0].providerId).then(function() {
        console.log('success')
      }).catch(function(error) {
        console.error(error)
      });
}); 

mergeWithTwitter.addEventListener('click', mergeWithTwitterFunction);

//Go to profile page
back.addEventListener('click', () => {
    window.location.assign('../profile');
});