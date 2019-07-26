const mergeWithGoogleButton = document.getElementById('mergeWithGoogle');
const mergeWithFacebookButton = document.getElementById('mergeWithFacebook');
const mergeWithTwitterButton = document.getElementById('mergeWithTwitter');
const successModal = document.querySelector('.success');
const failureModal = document.querySelector('.failure');
const back = document.getElementById('back');

const auth = firebase.auth();

const twitterProvider = new firebase.auth.TwitterAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();

const mergeAndUnmergeWithTwitter = () => {
    const user = auth.currentUser;
    if(user) {
        const providerIndex = checkIfLinked(user, 'twitter.com');
        if(providerIndex != -1)
            unmerge(user, providerIndex);
        else
            merge(user, twitterProvider);
    }
}


const mergeAndUnmergeWithGoogle = () => {
    const user = auth.currentUser;
    if(user) {
        const providerIndex = checkIfLinked(user, 'google.com');
        if(providerIndex != -1)
            unmerge(user, providerIndex);
        else
            merge(user, googleProvider);
    }
}



const merge = (previousUser, provider) => {
    auth.signInWithPopup(provider)
    .then(user => {
        const secondAccountCred = user.credential;
        auth.currentUser.delete()
        .then(() => {
            return previousUser.linkWithCredential(secondAccountCred);
        })
        .then(() => {
            auth.signInWithCredential(secondAccountCred);
            console.log('Accounts linked successfully!');
        })
    })
}


const unmerge = (user, providerIndex) => {
    user.unlink(user.providerData[providerIndex].providerId)
    .then(() => {
        console.log('Unlinked successfully!');
    })
    .catch(error => {
        console.error(error);
    })
}


const checkIfLinked = (user, providerId) => {
    const userProviders = user.providerData;
    let providerIndex = -1;
    for(let i = 0; i < userProviders.length; i++) {
        if(userProviders[i].providerId === providerId)
            providerIndex = i;
    }
    return providerIndex;
}



mergeWithTwitterButton.addEventListener('click', mergeAndUnmergeWithTwitter);

mergeWithGoogleButton.addEventListener('click', mergeAndUnmergeWithGoogle);

//Go to profile page
back.addEventListener('click', () => {
    window.location.assign('../profile');
});