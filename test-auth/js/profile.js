/**
 * ==============================================================================
 * PROFILE CARD CONTROLLER
 * Loads user session data, populates profile attributes, and manages sign out.
 * ==============================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const avatarInitials = document.getElementById('avatar-initials');
    const profileName = document.getElementById('profile-name');
    const profileBadge = document.getElementById('profile-badge');
    const profileHandle = document.getElementById('profile-handle');
    const profileDepartment = document.getElementById('profile-department');
    const profileBio = document.getElementById('profile-bio');
    const profileEmail = document.getElementById('profile-email');
    const profileLocation = document.getElementById('profile-location');
    const profileJoined = document.getElementById('profile-joined');
    const statProjects = document.getElementById('stat-projects');
    const statReviews = document.getElementById('stat-reviews');
    const statRating = document.getElementById('stat-rating');
    const sessionIdEl = document.getElementById('session-id');
    const logoutBtn = document.getElementById('logout-btn');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileToast = document.getElementById('profile-toast');
    const toastMessage = document.getElementById('toast-message');

    // Retrieve authenticated user from session
    const rawUserData = sessionStorage.getItem('authenticated_user');
    let user = null;

    if (rawUserData) {
        try {
            user = JSON.parse(rawUserData);
        } catch (e) {
            console.error('Failed to parse user session data:', e);
        }
    }

    // Default fallback if visited directly without logging in
    if (!user) {
        user = {
            username: 'admin',
            fullName: 'Alexander Wright',
            role: 'System Administrator',
            department: 'Core Infrastructure & Security',
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
        };
    }

    // Populate Profile Card
    if (avatarInitials) avatarInitials.textContent = user.avatarInitials || user.fullName.slice(0, 2).toUpperCase();
    if (profileName) profileName.textContent = user.fullName;
    if (profileBadge) profileBadge.textContent = user.role;
    if (profileHandle) profileHandle.textContent = `@${user.username}`;
    if (profileDepartment) profileDepartment.textContent = user.department || 'Technology Team';
    if (profileBio) profileBio.textContent = user.bio || 'Active team member.';
    if (profileEmail) profileEmail.textContent = user.email;
    if (profileLocation) profileLocation.textContent = user.location;
    if (profileJoined) profileJoined.textContent = user.joinedDate;

    if (user.stats) {
        if (statProjects) statProjects.textContent = user.stats.projects;
        if (statReviews) statReviews.textContent = user.stats.reviews;
        if (statRating) statRating.textContent = user.stats.rating;
    }

    // Random Session ID for realism
    if (sessionIdEl) {
        sessionIdEl.textContent = Math.floor(10000 + Math.random() * 90000);
    }

    // Sign Out Handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear session data
            sessionStorage.removeItem('authenticated_user');
            showToast('Signing out... Redirecting to login.');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        });
    }

    // Edit Profile Click Handler
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            showToast('Profile editing is enabled in production settings.');
        });
    }

    /**
     * Shows a brief toast alert.
     */
    function showToast(msg) {
        if (!profileToast || !toastMessage) return;
        toastMessage.textContent = msg;
        profileToast.classList.remove('hidden');

        setTimeout(() => {
            profileToast.classList.add('hidden');
        }, 2500);
    }
});
