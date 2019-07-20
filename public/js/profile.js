const logOut = document.getElementById('logOut');
const mergeAccounts = document.getElementById('mergeAccounts');
const modifyAccount = document.getElementById('modifyAccount');
const displayNameHolder = document.getElementById('displayNameHolder');
const photoHolder = document.getElementById('photoHolder');

//Go to modification page
modifyAccount.addEventListener('click', () => {
    window.location.assign('./edit');
});

//Go to merge accounts page
mergeAccounts.addEventListener('click', () => {
    window.location.assign('./merge');
});
