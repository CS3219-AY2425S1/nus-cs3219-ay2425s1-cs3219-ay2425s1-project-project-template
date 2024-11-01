export function isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(username);
}

export default {
    isValidUsername,
};