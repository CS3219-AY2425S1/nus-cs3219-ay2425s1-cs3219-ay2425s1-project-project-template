const alphanumericUsernameRegex = /^[a-zA-Z0-9]+$/;

function isValidUsername(username) {
    return alphanumericUsernameRegex.test(username);
}

module.exports = { isValidUsername };