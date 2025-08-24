// import {http} from './http';

// Store token in memory
let authToken = null;

export const setAuthToken = (token) => {
    authToken = token;
    // Store in localStorage for persistence across sessions
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
};

// Get token from localStorage on initial load
if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
        setAuthToken(token);
    }
}

// Login function - Updated to handle token from URL
export const handleAuthCallback = () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        // const expiresIn = params.get('expires_in');

        if (token) {
            // Store the token
            setAuthToken(token);

            // Optionally store expiration time if needed
            // if (expiresIn) {
            //     const expiryTime = Date.now() + parseInt(expiresIn);
            //     localStorage.setItem('tokenExpiry', expiryTime.toString());
            // }

            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
            return { success: true };
        }
        return { success: false, error: 'No token found' };
    } catch (error) {
        console.error('Auth callback error:', error);
        return { success: false, error: error.message };
    }
};

// Logout function
export const logout = () => {
    // Clear all auth-related data
    authToken = null;
    localStorage.removeItem('authToken');
    // localStorage.removeItem('tokenExpiry');
    window.location.href = '/connect';
};

// Check if user is authenticated
export const isAuthenticated = () => {
    // Check if token exists and is not expired
    const expiryTime = localStorage.getItem('tokenExpiry');
    if (expiryTime && Date.now() > parseInt(expiryTime)) {
        logout(); // Auto-logout if token is expired
        return false;
    }
    return !!authToken;
};

// Get auth header for API requests
export const getAuthHeader = () => {
    return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

// Check if token is expired
// export const isTokenExpired = () => {
//     const expiryTime = localStorage.getItem('tokenExpiry');
//     return expiryTime ? Date.now() > parseInt(expiryTime) : true;
// };