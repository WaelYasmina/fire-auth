const mergeWithGoogle = document.getElementById('mergeWithGoogle');
const mergeWithFacebook = document.getElementById('mergeWithFacebook');
const mergeWithTwitter = document.getElementById('mergeWithTwitter');
const successModal = document.querySelector('.success');
const failureModal = document.querySelector('.failure');
const back = document.getElementById('back');

//Go to profile page
back.addEventListener('click', () => {
    window.location.assign('./profile');
});