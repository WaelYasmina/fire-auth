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
    //the user constant takes a bit of time to get the auth.current user value
    //which means if the user clicks sooner at the button the functions using that constant
    //might generate problems, that said we need to make sure it's filled before running any
    //treatment thus using it in an if statement.
    if(user) {
        //providerIndex checks if the current account is linked with a provider (twitter.com)
        //in this case. If the providerId exists then the checkIfLinked will return the index
        //of the providerId for the unlink function to work. It also helps to know which function
        //should be triggered (merge or unmerge).
        const providerIndex = checkIfLinked(user, 'twitter.com');
        if(providerIndex != -1)
            unmerge(user, providerIndex);
        else
            merge(user, twitterProvider);
    }
}

// Same code as above except it's for merging with a Google account
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
    // provider can be "google.com" or "twitter.com" etc..
    // We're basically signing in the user a second time with the social media account
    // that they want it to be merged with the current one.
    auth.signInWithPopup(provider)
    .then(user => {
        const secondAccountCred = user.credential;
        // Then we're deleting the current social media provider to prevent any conflicts in case it's used to connect to another account on your app.
        // The current user here means the one he just signed in with clicking on the merge button.
        auth.currentUser.delete()
        .then(() => {
            // Now we're connecting the previousUser which represents the provider account that the user used to 
            // sign in to the app at the very beginning.
            return previousUser.linkWithCredential(secondAccountCred);
        })
        .then(() => {
            // Reconnecting to the app.
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
    //provider Data is an array that contains the providers linked to their account
    // "google.com", "twitter.com", etc..
    const userProviders = user.providerData;
    let providerIndex = -1;
    for(let i = 0; i < userProviders.length; i++) {
        if(userProviders[i].providerId === providerId)
            providerIndex = i;
    }
    //-1 if the provider doesn't exist
    return providerIndex;
}

mergeWithTwitterButton.addEventListener('click', mergeAndUnmergeWithTwitter);

mergeWithGoogleButton.addEventListener('click', mergeAndUnmergeWithGoogle);

//Go to profile page
back.addEventListener('click', () => {
    window.location.assign('../profile');
});
