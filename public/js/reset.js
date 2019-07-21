const mailField = document.getElementById('mail');
const labels = document.getElementsByTagName('label');
const resetPassword = document.getElementById('resetPassword');
const successModal = document.querySelector('.success');
const failureModal = document.querySelector('.failure');

const auth = firebase.auth();

resetPasswordFunction = () => {
    const email = mailField.value;
    auth.sendPasswordResetEmail(email)
    .then(() => {
        console.log('Email Sent !');
    })
    .catch(error => {
        console.error(error);
    })
}


resetPassword.addEventListener('click', resetPasswordFunction);

//Animations
mailField.addEventListener('focus', () => {
    labels.item(0).className = "focused-field";
});

mailField.addEventListener('blur', () => {
    if(!mailField.value)
        labels.item(0).className = "unfocused-field";
});