import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleAuthCallback } from '../services/authToken';

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuth = async () => {
            const result = handleAuthCallback();
            if (result.success) {
                // Get the original URL or default to home
                const redirectTo = "/connect"
                navigate(redirectTo);
            } else {
                navigate('/connect', { state: { error: result.error } });
            }
        };

        handleAuth();
    }, [navigate]);

    return <div>Logging in...</div>;
};

export default Callback;