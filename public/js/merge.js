const mergeWithGoogleButton = document.getElementById('mergeWithGoogle');
const mergeWithFacebookButton = document.getElementById('mergeWithFacebook');
const mergeWithTwitterButton = document.getElementById('mergeWithTwitter');
const successModal = document.querySelector('.success');
const failureModal = document.querySelector('.failure');
const back = document.getElementById('back');

//Go to profile page
back.addEventListener('click', () => {
    window.location.assign('../profile');
});