import React, { useEffect, useState } from "react";
import Logo_nav from "../components/Logo_nav";
import { http } from "../services/http.js";
import { useLocation, useNavigate } from "react-router-dom";
import { protectedRoute } from "../services/auth.js";
import DisplayPlaylist from "../components/DisplayPlaylist";
import { getPlaylist } from "../services/playlist.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmile } from '@fortawesome/free-regular-svg-icons'


const Suggestion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState("/logo.svg");
  const [heading, setHeading] = useState("Music suggested for your mood");
  const [openPlaylist, setOpenPlaylist] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [history, setHistory] = useState([]);
  const state = useLocation()?.state || {};

  useEffect(() => {
    if (state?.playlistData?.data) {
      setRecommendations(state.playlistData.data);
    }
  }, [state]);

  const navigate = useNavigate();
  useEffect(() => {
    const authenticationCheck = async () => {
      try {
        const response = await protectedRoute();
      } catch (error) {
        if (error?.response?.status === 401) {
          // console.log("suggestion page::User is not authenticated....");
          navigate("/connect");
        }
      }
    }
    authenticationCheck();

    const stateCheck = () => {
      if (!state.playlistData) {
        navigate("/detect-mood");
      }
    }
    stateCheck();
  }, []);

  useEffect(() => {
    if (recommendations) {
      if (recommendations.playlistTitle) {
        setHeading(recommendations.playlistTitle);
      }
      if (recommendations.background) {
        setBackgroundUrl(recommendations.background);
      } else {
        setBackgroundUrl("/default_bg.jpg");
      }
      if (recommendations.suggestions) {
        setSuggestions(recommendations.suggestions);
      }
    }
  }, [recommendations]);

  const handlePlaylistClick = (id) => {
    setOpenPlaylist(id);
  }

  const handlePlaylistClose = () => {
    setOpenPlaylist(null);
  }

  const handleBackClick = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setRecommendations(previousState.recommendations);
      setHeading(previousState.heading);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const handleNewSuggestion = (suggestion) => {
    if (isLoading) return;

    setIsLoading(true);
    const fetchPlaylist = async () => {
      try {
        const params = new URLSearchParams({
          q: suggestion,
          limit: 15,
          type: JSON.stringify(["playlist", "track", "album", "show"])
        });

        setHistory(prev => [...prev, {
          recommendations: { ...recommendations },
          heading: heading
        }]);

        const response = await getPlaylist(params);
        // console.log("response::", response);
        setRecommendations(response.data);
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  };

  return (
    <div className="relative md:p-[30px] p-[10px] bg-[image:--gradient-primary] h-full w-full flex flex-col gap-[10px]">
      <div className="flex items-center justify-between w-full">
        <Logo_nav />
        <button
          onClick={() => navigate("/detect-mood")}
          className="bg-indigo-secondary/10 backdrop-blur-2xl border-[0.5px] border-text-primary/10 rounded-2xl px-[20px] py-[10px] font-manrope font-semibold flex gap-[5px] items-center justify-center
         hover:bg-indigo-secondary/20 hover:font-bold hover:scale-105 cursor-pointer transition-all duration-300 ease-in-out">
          <FontAwesomeIcon icon={faSmile} className="w-[20px] h-[20px] text-indigo-secondary" />
          Detect your mood</button>
      </div>
      <div className="content flex lg:flex-row flex-col gap-[5px] ">
        <div className="left  overflow-hidden w-full bg-cover bg-no-repeat backdrop-blur-2xl shadow-[1_0_0_0.5px_rgba(0,250,246,0.2)] rounded-[20px] py-4 px-2 flex flex-col gap-[20px] disabled:opacity-10"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
          }}
          disabled={isLoading}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="heading flex flex-row gap-[10px] z-[100] px-[20px] items-center">
            {/* <div className="subheading font-manrope text-[#0b669a] text-[25px]/[30px] font-semibold">
              Music suggested for mood
            </div> */}
            {history.length > 0 && (
              <button
                onClick={handleBackClick}
                className="bg-indigo-secondary/10  h-[20px] w-[20px] md:h-[40px] md:w-[40px] hover:bg-indigo-secondary/20 backdrop-blur-2xl border border-text-primary/10 rounded-full transition-colors flex items-center justify-center"
                aria-label="Go back to previous search"
              >
                <img src="back-svgrepo-com.svg" alt="back" className="w-[10px] h-[10px] md:w-[20px] md:h-[20px]  object-contain lg:text-lg text-[10px] rounded-full" />
              </button>
            )}
            <div className="flex items-center gap-4 w-fit">
              <h1 className="uppercase font-bold xl:text-[40px]/[50px] md:text-[30px]/[40px] text-[20px]/[30px] font-helvetica gradient-text-primary">
                {heading}
              </h1>
            </div>
          </div>
          <div className="music-listing grid xl:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] grid-cols-[repeat(auto-fit,minmax(120px,1fr))] justify-items-center gap-[20px] lg:px-[20px] md:px-[15px] px-[10px]">
            {recommendations?.items?.map((item, idx) => item.name && (
              <div
                key={item.id || idx}
                onClick={() => {
                  handlePlaylistClick(item.id);
                }}
                className="card bg-indigo-secondary/10 backdrop-blur-2xl border-[0.5px] border-text-primary/10 
                 xl:w-[180px] xl:h-[250px] lg:w-[140px] lg:h-[200px]  w-[120px] h-[180px] flex flex-col gap-[10px] rounded-[10px] cursor-pointer 
                   overflow-hidden relative 
                 transition-transform duration-300 ease-in-out 
                 hover:scale-110 hover:-translate-y-1 hover:z-20 
                 hover:shadow-[0_30px_30px_rgba(0,0,0,0.5)] 
                 hover:bg-indigo-secondary/20"
              >
                <div className="cover w-full aspect-square">
                  <img className="w-full h-full object-cover aspect-square" src={item.images ? item.images[0].url : "/logo.png"} alt={item.name} />
                </div>
                <div className="cardDetails px-[10px]">
                  <div className="card-title lg:text-[18px]/[25px] text-[14px]/[20px] font-manrope line-clamp-2 overflow-hidden text-ellipsis font-medium ">{item.name}</div>
                  {item.description && (
                    <div className="card-description md:text-[14px]/[16px] text-[12px]/[14px] font-manrope line-clamp-2 overflow-hidden text-ellipsis">{item.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="right  flex flex-col gap-[15px] md:w-[500px] w-full">
          {/* <div className="categories bg-indigo-secondary/10 backdrop-blur-2xl border-[0.5px] border-text-primary/10 rounded-[20px] p-4 flex flex-row flex-wrap justify-center items-center gap-[20px]">
            <div className="album bg-indigo-secondary/10 backdrop-blur-2xl border-[0.5px] border-text-primary/10 rounded-[15px] p-4 flex flex-row gap-[5px] items-center justify-center">
              <img src="/playback.svg" className="w-[20px] aspect-square" />
              Album
            </div>
            <div className="song bg-indigo-secondary/10 backdrop-blur-2xl border-[0.5px] border-text-primary/10 rounded-[15px] p-4 flex flex-row gap-[5px] items-center justify-center">
              <img src="/playback.svg" className="w-[20px] aspect-square" />
              Song
            </div>
            <div className="mood bg-indigo-secondary/10 backdrop-blur-2xl border-[0.5px] border-text-primary/10 rounded-[15px] p-4 flex flex-row gap-[5px] items-center justify-center">
              <img src="/playback.svg" className="w-[20px] aspect-square" />
              Mood
            </div>
            <div className="playlist bg-indigo-secondary/10 backdrop-blur-2xl border-[0.5px] border-text-primary/10 rounded-[15px] p-4 flex flex-row gap-[5px] items-center justify-center">
              <img src="/playback.svg" className="w-[20px] aspect-square" />
              Playlist
            </div>
          </div> */}

          <div className="suggestions  bg-indigo-secondary/10 backdrop-blur-2xl border-[0.5px] border-text-primary/5 rounded-[20px] p-4 flex flex-col gap-[15px] ">
            <h2 className="heading font-semibold md:text-[25px]/[40px] text-[20px]/[30px] font-helvetica text-center border-b-[0.5px] border-text-primary/5 text-zinc-200">
              Suggested moods
            </h2>
            <div className="options flex flex-wrap gap-[10px] w-full justify-center items-center ">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNewSuggestion(suggestion)}
                  className="capitalize w-fit  bg-indigo-secondary/10 border-[0.5px] border-text-primary/10 rounded-[15px] px-4 py-2 disabled:opacity-50 hover:scale-105 hover:-translate-y-0.5 hover:z-20 
                 text-zinc-300 hover:text-text-primary
                  hover:shadow-[0_0px_10px_rgba(0,0,0,0.5)] 
                 hover:bg-indigo-secondary/20 transition-transform duration-300 ease-in-out cursor-pointer md:text-[16px]/[20px] text-[14px]/[20px] "
                  disabled={isLoading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {openPlaylist && (
        <div
          className="fixed inset-0 bg-black/20 z-[100] flex justify-center p-[20px]"
          onClick={handlePlaylistClose}
        >
          {/* Stop background click from closing */}
          <div onClick={(e) => e.stopPropagation()}>
            <DisplayPlaylist id={openPlaylist} handlePlaylistClose={handlePlaylistClose} />
          </div>
        </div>
      )
      }

    </div >
  );
};

export default Suggestion;
