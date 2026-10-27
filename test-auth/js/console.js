// Login Auth Simulation
// See js/login.js for active browser DOM controller.

console.log('--- TEST-AUTH: LOGIN AUTH SIMULATION LOADED ---');

// Mock user verification test function for devtools console
function verifyCredentials(username, password) {
    console.log(`Authenticating user: "${username}"...`);
    if (password === 'password123') {
        console.log(`%c[SUCCESS] Authentication passed for ${username}. Redirecting to profile.html`, 'color: #15803d; font-weight: bold;');
        return true;
    } else {
        console.warn(`[FAILED] Authentication rejected for ${username}. Invalid password.`);
        return false;
    }
}
