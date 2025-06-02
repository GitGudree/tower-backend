import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { logoutUser, getUserData } from './auth-service.js';

// Cookie management functions
const setCookie = (name, value, days = 7) => {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
};

const deleteCookie = (name) => {
    setCookie(name, '', -1);
};


export const initAuthState = () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            
            const result = await getUserData(user.uid);
            if (result.success) {
                const userData = result.data;
                setCookie('userLoggedIn', 'true');
                setCookie('userEmail', user.email);
                setCookie('username', userData.username);
                setCookie('nationality', userData.nationality);
                updateUserInterface(userData);
            }
        } else {
            deleteCookie('userLoggedIn');
            deleteCookie('userEmail');
            deleteCookie('username');
            deleteCookie('nationality');
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = '/auth/login.html';
            }
        }
    });
};

export const handleLogout = async () => {
    try {
        const result = await logoutUser();
        if (result.success) {
            deleteCookie('userLoggedIn');
            deleteCookie('userEmail');
            deleteCookie('username');
            deleteCookie('nationality');
            window.location.href = '/auth/login.html';
        } else {
            console.error('Logout failed:', result.error);
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
};

export const isUserLoggedIn = () => {
    return getCookie('userLoggedIn') === 'true';
};

export const getCurrentUserData = () => {
    return {
        email: getCookie('userEmail'),
        username: getCookie('username'),
        nationality: getCookie('nationality')
    };
};


export const initAuthUI = () => {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    const userData = getCurrentUserData();
    if (userData.username) {
        updateUserInterface(userData);
    }
};


const updateUserInterface = (userData) => {
    const userInfoElement = document.getElementById('userEmail');
    if (userInfoElement) {
        const countryCode = userData.nationality.toLowerCase();
        userInfoElement.innerHTML = `
            <a href="/auth/profile.html" class="user-profile-link">
                <img src="https://flagcdn.com/w20/${countryCode}.png" 
                     alt="${countryCode.toUpperCase()}" 
                     class="user-flag">
                <span>${userData.username}</span>
            </a>
        `;
    }
}; 