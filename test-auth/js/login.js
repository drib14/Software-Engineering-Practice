/**
 * ==============================================================================
 * LOGIN AUTHENTICATION SIMULATION
 * Handles credentials verification, session storage, and profile redirection.
 * ==============================================================================
 */

'use strict';

// Predefined Demo Accounts Database
const MOCK_USERS_DATABASE = [
    {
        username: 'admin',
        password: 'password123',
        fullName: 'Alexander Wright',
        role: 'System Administrator',
        department: 'Infrastructure & Security',
        email: 'alexander.wright@company.org',
        location: 'San Francisco, CA',
        joinedDate: 'October 2022',
        bio: 'Overseeing authentication gateways, cloud infrastructure, and enterprise data security.',
        avatarInitials: 'AW',
        stats: {
            projects: 38,
            reviews: 142,
            rating: 4.9
        }
    },
    {
        username: 'jhondoe',
        password: 'password123',
        fullName: 'Jhon Doe',
        role: 'Senior Frontend Engineer',
        department: 'Design Systems & Web Architecture',
        email: 'jhon.doe@devteam.io',
        location: 'Tokyo, Japan',
        joinedDate: 'January 2023',
        bio: 'Focused on clean vanilla JavaScript, accessible component architecture, and modern neutral aesthetics.',
        avatarInitials: 'JD',
        stats: {
            projects: 26,
            reviews: 94,
            rating: 4.8
        }
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('remember-me');
    const loginBtn = document.getElementById('login-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const loginAlert = document.getElementById('login-alert');
    const alertText = document.getElementById('alert-text');
    const alertIcon = document.getElementById('alert-icon');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const eyeIcon = document.getElementById('eye-icon');
    const demoChips = document.querySelectorAll('.demo-chip');
    const forgotPasswordLink = document.getElementById('forgot-password-link');

    // Restore remembered username if available
    const savedUser = localStorage.getItem('remembered_username');
    if (savedUser && usernameInput) {
        usernameInput.value = savedUser;
        if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
        if (passwordInput) passwordInput.focus();
    }

    // Toggle Password Visibility
    if (togglePasswordBtn && passwordInput && eyeIcon) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            eyeIcon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
        });
    }

    // Demo Chips Click to Pre-Fill
    demoChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const user = chip.dataset.user;
            const pass = chip.dataset.pass;
            usernameInput.value = user;
            passwordInput.value = pass;
            hideAlert();
            passwordInput.focus();
        });
    });

    // Forgot Password Click Handler
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAlert('Use demo password: "password123" for any account.', 'info');
        });
    }

    // Form Submission Handling
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // 1. Basic Field Validation
        if (!username || !password) {
            showAlert('Please enter both your username and password.', 'error');
            triggerShake();
            return;
        }

        // 2. Set Button Loading State
        setLoadingState(true);

        try {
            // 3. Simulate asynchronous network authentication delay (650ms)
            await new Promise(resolve => setTimeout(resolve, 650));

            // 4. Validate credentials against database
            const matchedUser = MOCK_USERS_DATABASE.find(
                u => u.username.toLowerCase() === username.toLowerCase()
            );

            let authenticatedProfile = null;

            if (matchedUser) {
                if (matchedUser.password !== password) {
                    throw new Error('Incorrect password. Please verify and try again.');
                }
                authenticatedProfile = matchedUser;
            } else {
                // Flexible demo fallback: allow any username if password matches demo standard
                if (password !== 'password123') {
                    throw new Error('Invalid credentials. Hint: use password "password123"');
                }

                // Generate dynamic profile for entered username
                const capitalized = username.charAt(0).toUpperCase() + username.slice(1);
                authenticatedProfile = {
                    username: username,
                    password: password,
                    fullName: `${capitalized} User`,
                    role: 'Product Specialist',
                    department: 'Technology & Development',
                    email: `${username.toLowerCase()}@workspace.io`,
                    location: 'San Francisco, CA',
                    joinedDate: 'Joined Recently',
                    bio: 'Authenticated member exploring the modern neutral dashboard interface.',
                    avatarInitials: username.slice(0, 2).toUpperCase(),
                    stats: {
                        projects: 12,
                        reviews: 45,
                        rating: 5.0
                    }
                };
            }

            // 5. Success Flow: Handle Remember Me & Session Storage
            if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                localStorage.setItem('remembered_username', username);
            } else {
                localStorage.removeItem('remembered_username');
            }

            // Store authenticated session in sessionStorage
            sessionStorage.setItem('authenticated_user', JSON.stringify(authenticatedProfile));

            // 6. Visual Feedback
            showAlert(`Welcome back, ${authenticatedProfile.fullName}! Redirecting...`, 'success');
            btnText.textContent = 'Redirecting...';
            btnIcon.className = 'fa-solid fa-check';

            // 7. Redirect to Profile Card Page
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 600);

        } catch (error) {
            setLoadingState(false);
            showAlert(error.message, 'error');
            triggerShake();
        }
    });

    /**
     * Toggles button loading state.
     */
    function setLoadingState(isLoading) {
        if (isLoading) {
            loginBtn.disabled = true;
            btnText.textContent = 'Signing in...';
            btnIcon.className = 'fa-solid fa-spinner fa-spin';
        } else {
            loginBtn.disabled = false;
            btnText.textContent = 'Login';
            btnIcon.className = 'fa-solid fa-arrow-right';
        }
    }

    /**
     * Shows notification alert inside the card.
     */
    function showAlert(message, type = 'error') {
        alertText.textContent = message;
        loginAlert.className = `login-alert alert-${type}`;

        if (type === 'error') {
            alertIcon.className = 'fa-solid fa-circle-exclamation';
        } else if (type === 'success') {
            alertIcon.className = 'fa-solid fa-circle-check';
        } else {
            alertIcon.className = 'fa-solid fa-circle-info';
        }

        loginAlert.classList.remove('hidden');
    }

    /**
     * Hides the alert.
     */
    function hideAlert() {
        loginAlert.classList.add('hidden');
    }

    /**
     * Triggers a subtle shake animation on the card for invalid input.
     */
    function triggerShake() {
        loginForm.classList.remove('shake');
        void loginForm.offsetWidth; // Force DOM reflow
        loginForm.classList.add('shake');
    }
});
