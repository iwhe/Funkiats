import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import Logo_nav from "../components/Logo_nav";
import { http } from "../services/http.js";
import { protectedRoute } from "../services/auth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRepeat } from "@fortawesome/free-solid-svg-icons";
import { faCamera } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";

const MoodDetection = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [emotionLoading, setEmotionLoading] = useState(false);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCameraReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Debug: Track cookie changes
  useEffect(() => {
    const authenticationCheck = async () => {
      try {
        const response = await protectedRoute();
        if (response?.statusCode === 401) {
          navigate("/connect");
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          navigate("/connect");
        }
        setError(error.message);
      }
    }
    authenticationCheck();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const videoConstraints = {
    width: 600,
    height: 400,
    facingMode: "user", // 'environment' for back camera on mobile
  };

  // Handler for webcam ready
  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  // Function to capture image from webcam
  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    analyzeEmotion(imageSrc);
  }, [webcamRef]);

  // Function to analyze emotion from base64 image
  const analyzeEmotion = async (imageData) => {
    setEmotionLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_EMOTION_DETECTION_API_URL}/detect-emotion`, { image: imageData });

      const data = await response.data;

      if (data.success) {
        setResults(data);
        setError(null);
      } else {
        setError(data.error || "Analysis failed");
      }
    } catch (err) {
      setError("Connection error: " + err.message);
    } finally {
      setEmotionLoading(false);
    }
  };

  // Function to reset and take new photo
  const resetCapture = () => {
    setCapturedImage(null);
    setResults(null);
    setError(null);
  };

  // emotions: [{happy, sad, angry}, {angry, surprised, neutral}]
  const filterPayload = (payload) => {
    return payload.map((face) => {
      return face.emotions;
    });
  };

  const recommendMusic = async () => {
    if (!results || results.faces_detected === 0) {
      setError("No faces detected. Please try again.");
      return;
    }

    setRecommendLoading(true);
    setError(null);
    const payload = filterPayload(results.results);
    const params = new URLSearchParams({
      emotions: JSON.stringify(payload),
      limit: 15,
      type: JSON.stringify(["playlist", "track", "album", "show"])
    });
    const query = params.toString();

    try {
      const response = await http.get("/playlist/search?" + query);
      const data = await response.data;

      if (response.status === 200) {
        navigate("/suggestion", {
          state: {
            playlistData: data,
          }
        });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setRecommendLoading(false);
    }
  };

  return (
    <div className="p-[30px] min-h-screen bg-(image:--gradient-primary)">
      <Logo_nav />
      <div className="content flex flex-col justify-center items-center h-full mt-[50px]">
        {!(results && results.results && results.results.length > 0) && (
          <div className="heading mb-6 flex flex-col items-center gap-[10px]">
            <h2 className="text-2xl font-bold text-center w-fit gradient-text-primary">
              Capture a moment.
            </h2>
            <h2 className="text-md text-center">
              For best results, center your face in the frame and ensure you’re in good lighting.          </h2>
          </div>
        )}

        {results && results.results && results.results.length > 0 && (
          <div className="heading mb-6 flex flex-col items-center gap-[5px]">
            <h2 className="text-2xl font-bold text-center w-fit gradient-text-primary">
              Emotion Analysis
            </h2>
            <p className="text-center ">
              Faces Detected: {results.faces_detected}
            </p>
          </div>
        )}
        <div className="flex sm:flex-row flex-col gap-4 justify-center items-center">
          <div className="container relative border md:max-w-[600px] max-w-[300px] bg-black/50 aspect-3/2 rounded-[30px] border-amber-50 overflow-hidden flex items-center justify-center">
            {!capturedImage ? (
              <>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  mirrored={true}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-full object-cover rounded-[30px]"
                  onUserMedia={handleCameraReady}
                />
                {isCameraReady && (
                  <button
                    onClick={captureImage}
                    disabled={emotionLoading}
                    className="absolute z-[1] bottom-2 border-[0.3px] border-text-primary bg-primary/10 backdrop-blur-2xl px-4 py-2 rounded-full hover:bg-primary active:bg-black disabled:opacity-50"
                  >
                    {emotionLoading ? "📸 Analyzing..." :
                      <div className="flex gap-[5px] items-center">
                        <FontAwesomeIcon icon={faCamera} />
                        Capture this frame</div>}
                  </button>
                )}
              </>
            ) : (
              <>
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover rounded-[30px]"
                />
                <button
                  onClick={resetCapture}
                  className="absolute z-[1] bottom-2 left-2 border-[0.5px] border-text-primary bg-indigo-secondary/10 backdrop-blur-2xl md:px-4 md:py-2 px-2 py-1 text-xs rounded-full hover:bg-indigo-secondary/20 active:bg-black flex gap-[5px] items-center cursor-pointer"
                >
                  <FontAwesomeIcon icon={faRepeat} />
                  Take New Photo
                </button>
              </>
            )}
          </div>

          {/* Results Display */}
          {results && results.results && results.results.length > 0 && (
            <div className="flex flex-col items-center">
              {/* <div className=" backdrop-blur-lg rounded-2xl px-6 py-4 border-[0.5px] border-white/20 flex flex-col items-center gap-[10px]"> */}

              <div className="flex gap-2">
                {results.results.map((face, index) => (
                  <div
                    key={index}
                    className="p-4 bg-indigo-secondary/10 backdrop-blur-lg rounded-xl border border-white/10 w-max"
                  >
                    <h4 className="font-semibold mb-2 text-center border-b-[0.5px] border-white/5">
                      Face {index + 1}
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Position: ({face.face_coordinates.x},{" "}
                      {face.face_coordinates.y})
                    </p>

                    <div className="space-y-2">
                      <h5 className="font-medium">Top Emotions:</h5>
                      {face.emotions.map((emotion, emotionIndex) => (
                        <div
                          key={emotionIndex}
                          className={`flex justify-between items-center gap-4 p-3 rounded-lg w-full ${emotionIndex === 0
                            ? "bg-green-500/20 border border-green-500/30"
                            : "bg-white/5 border border-white/10"
                            }`}
                        >
                          <span
                            className={`font-medium ${emotionIndex === 0
                              ? "text-green-300"
                              : "text-gray-300"
                              }`}
                          >
                            {emotionIndex + 1}. {emotion.emotion}
                          </span>
                          <span
                            className={`font-bold ${emotionIndex === 0
                              ? "text-green-300"
                              : "text-gray-300"
                              }`}
                          >
                            {emotion.confidence.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            // </div>
          )}
        </div>

        {results && results.results && results.results.length > 0 && (
          <button
            onClick={() => recommendMusic()}
            className=" cursor-pointer submit rounded-full px-4 py-2 bg-indigo-secondary/10 backdrop-blur-lg border-[0.5px] border-amber-50/10 mt-4 hover:bg-indigo-secondary/20 active:bg-indigo-secondary/30 transition-colors"
          >
            Proceed
          </button>
        )}
        {/* Loading Indicator */}
        {recommendLoading && (
          <div className="flex items-center justify-center absolute w-full h-full bg-primary/10 backdrop-blur-sm z-50 overflow-hidden">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Processing recommendations...</span>
          </div>
        )}

        {emotionLoading && (
          <div className="flex items-center justify-center absolute w-full h-full bg-primary/10 backdrop-blur-sm z-50 overflow-hidden">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Analyzing emotions...</span>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className=" slide-down shadow-lg mt-4 p-4 absolute top-[20px] bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md flex flex-row items-center justify-between">
            <div>
              {error}
            </div>
            <button
              className="ml-4 text-xl font-bold text-red-700 hover:text-red-900 transition-colors"
              onClick={() => setError(null)}
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        )}

        {/* No faces detected */}
        {results && results.faces_detected === 0 && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg max-w-md text-center">
            <strong>No faces detected</strong>
            <br />
            Try adjusting your position or lighting
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodDetection;
