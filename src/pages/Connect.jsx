import React, { useEffect, useState } from 'react';
import Logo_nav from '../components/Logo_nav';
import { useNavigate } from 'react-router-dom';
import { protectedRoute } from '../services/auth.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'

const Connect = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const auth = await protectedRoute();
      if (auth) {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/detect-mood");
    }
  }, [isAuthenticated]);

  const connectSpotify = (e) => {
    e.preventDefault();
    console.log('🎵 Connecting to Spotify...');
    setIsConnecting(true);

    const currentPage = window.location.href
    console.log("Current Page::", currentPage);
    const authenticationPage = `${import.meta.env.VITE_BACKEND_URL}/api/auth/authenticate?state=${encodeURIComponent(
      currentPage
    )}`;

    window.location.href = authenticationPage;

  };

  if (isAuthenticated) {
    return (
      <div className="p-[30px] bg-(image:--gradient-primary) h-screen w-full flex flex-col gap-[10px]">
        <Logo_nav />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            {/* <h2 className="text-3xl font-bold mb-4">✅ Connected to Spotify!</h2>
            <p className="text-lg mb-6">You're all set to get music recommendations based on your emotions.</p> */}
            <a
              onClick={() => navigate("/detect-mood")}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold transition-colors"
            >
              Start Emotion Detection
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-[30px] bg-(image:--gradient-primary) h-screen w-full flex flex-col gap-[10px]">
      <Logo_nav />
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center flex flex-col items-center justify-center w-full">
          <h2 className="text-3xl font-bold mb-4 gradient-text-primary w-fit text-center">Connect</h2>
          <p className="text-lg mb-6">
            Connect your Spotify account to get personalized music recommendations based on your emotions.
          </p>

          <button
            onClick={connectSpotify}
            // onClick={() => console.log("hiy...")}
            disabled={isConnecting}
            className="bg-indigo-secondary/10 backdrop-blur-lg border-[0.5px] border-text-primary/10 hover:bg-indigo-secondary/20 cursor-pointer transition-colors duration-200 disabled:bg-gray-400 text-white px-8 py-4 rounded-full text-xl font-semibold transition-colors flex items-center gap-3 mx-auto"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Connecting...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSpotify} />
                Connect with Spotify
              </>
            )}
          </button>

          <div className="mt-8 text-sm text-gray-300">
            <p>Funkiats does not store your any of your data.</p>
            <p>Feel free to connect with us</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;