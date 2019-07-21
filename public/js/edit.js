const mailField = document.getElementById('mail');
const passwordField = document.getElementById('password');
const displayNameField = document.getElementById('displayName');
const photoField = document.getElementById('photo');
const labels = document.getElementsByTagName('label');
const editButton = document.getElementById('edit');
const deleteButton = document.getElementById('delete');

const auth = firebase.auth();

const editInformation = () => {
    //Holdes all of the information about the current signed in user
    const user = auth.currentUser;
    setDisplayName(user);
    setPhotoUrl(user);

    //Creates creadential to re-sign in to update crtitical information
    //such as changing password or the user's email
    //not necessary for changing photoURL or displayName
    const password = prompt('password');
    const credential = firebase.auth.EmailAuthProvider.credential(
        auth.currentUser.email,
        password
    );

    //Reauthenticating to update the password and email
    user.reauthenticateWithCredential(credential)
    .then( ()=> {
        setPassword(user);
        setEmail(user);
    })
    .catch(error => {
        console.error(error);
    })
}

const deleteAccount = () => {
    const user = auth.currentUser;
    const password = prompt('password');
    const credential = firebase.auth.EmailAuthProvider.credential(
        auth.currentUser.email,
        password
    );

    user.reauthenticateWithCredential(credential)
    .then( ()=> {
        deleteAccountFunction(user);
    })
    .catch(error => {
        console.error(error);
    })
}

const deleteAccountFunction = user => {
    user.delete()
    .then(() => {
        window.location.assign('../');
    })
    .catch(error => {
        console.error(error);
    })
}

deleteButton.addEventListener('click', deleteAccount);

const setEmail = user => {
    const newEmail = mailField.value;
    if(newEmail)
        user.updateEmail(newEmail)
        .then(() => {
            windowsd.location.assign('../profile');
        })
        .catch(error => {
            console.error(error);
        })
}


const setPassword = user => {
    const newPassword = passwordField.value;
    if(newPassword)
        user.updatePassword(newPassword)
        .then(() => {
            window.location.assign('../profile');
        })
        .catch(error => {
            console.error(error);
        })
}

const setDisplayName = user => {
    const displayName = displayNameField.value;
    if(displayName)
        user.updateProfile({
            displayName: displayName
        })
        .then(() => {
            window.location.assign('../profile');
        })
        .catch(error => {
            console.error(error);
        })
}

const setPhotoUrl = user => {
    const photo = photoField.value;
    if(photo)
        user.updateProfile({
            photoURL: photo
        })
        .then(() => {
            window.location.assign('../profile');
        })
        .catch(error => {
            console.error(error);
        })
}

editButton.addEventListener('click', editInformation);

//Animations
mailField.addEventListener('focus', () => {
    labels.item(0).className = "focused-field";
});

passwordField.addEventListener('focus', () => {
    labels.item(1).className = "focused-field";
});

mailField.addEventListener('blur', () => {
    if(!mailField.value)
        labels.item(0).className = "unfocused-field";
});

passwordField.addEventListener('blur', () => {
    if(!passwordField.value)
        labels.item(1).className = "unfocused-field";
});

displayNameField.addEventListener('focus', () => {
    labels.item(2).className = "focused-field";
});

photoField.addEventListener('focus', () => {
    labels.item(3).className = "focused-field";
});

displayNameField.addEventListener('blur', () => {
    if(!displayNameField.value)
        labels.item(2).className = "unfocused-field";
});

photoField.addEventListener('blur', () => {
    if(!photoField.value)
        labels.item(3).className = "unfocused-field";
});