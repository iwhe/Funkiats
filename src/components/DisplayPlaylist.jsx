import { getPlaylistDetail } from "../services/playlist";
import { useEffect, useState } from "react";

const DisplayPlaylist = ({ id, handlePlaylistClose }) => {
    const [playlistsDetail, setPlaylistsDetail] = useState(null);
    useEffect(() => {
        const handlePlaylistClick = async (id) => {
            const playlistDetail = await getPlaylistDetail(id);
            console.log(playlistDetail);
            setPlaylistsDetail(playlistDetail?.data);
        }
        handlePlaylistClick(id);
    }, [])
    return (
        playlistsDetail && (
            <div className="flex flex-col max-w-[700px] h-full overflow-hidden  bg-indigo-secondary/10 backdrop-blur-2xl border-[0.5px] border-text-primary/10 rounded-[20px]  ">
                <div className="heading flex flex-row justify-between items-end gap-[10px] border-b-[0.5px] border-text-primary/40">
                    <div className="flex flex-row items-center gap-[10px]">
                        {playlistsDetail?.image && (
                            <div className="relative group"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(playlistsDetail?.external_urls?.spotify, "_blank");
                                }}>
                                <div className="w-[150px] h-[150px] overflow-hidden">
                                    <img src={playlistsDetail?.image} alt={playlistsDetail?.name} className=" w-full h-full object-cover group-hover:opacity-70 transition-opacity duration-200" />
                                </div>
                                <div
                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    <div className="rounded-full p-2 hover:scale-110 transform transition-transform duration-200 w-15 h-15 flex items-center justify-center">
                                        <img
                                            src="/playback.svg"
                                            alt="Play on Spotify"
                                            className="w-10 h-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col gap-[10px] justify-between pr-[40px]">
                            <h2
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(playlistsDetail?.external_urls?.spotify, "_blank");
                                }}
                                className="text-[30px]/[40px] font-helvetica font-bold w-full  cursor-pointer hover:text-indigo-secondary transition-colors duration-200">{playlistsDetail?.name}</h2>
                            <p onClick={() => window.open(playlistsDetail?.owner?.external_urls?.spotify, "_blank")} className="text-text-primary text-xs w-fit">{playlistsDetail?.owner?.display_name}</p>
                        </div>

                    </div>

                    {/* <p onClick={() => window.open(playlistsDetail?.owner?.external_urls?.spotify, "_blank")} className="text-text-primary text-xs w-fit p-4">{playlistsDetail?.owner?.display_name}</p> */}
                </div>

                <div className=" flex flex-col overflow-y-scroll   custom-scrollbar">

                    {playlistsDetail?.tracks?.items?.map((track) => (
                        <div key={track?.id}
                            // onClick={(e) => {
                            //     e.stopPropagation();
                            //     window.open(track?.external_urls?.spotify || track?.album?.external_urls?.spotify, "_blank");
                            // }}
                            className="group relative flex flex-row justify-between w-full items-center gap-[10px] hover:bg-secondary/10 cursor-pointer py-[10px] px-[10px] rounded-[10px] border-b-[0.5px] border-text-primary/10 transition-all duration-300 ease-in-out">
                            <div className="flex flex-row items-start gap-[10px] w-full">
                                <div className="relative">
                                    {track?.album?.images?.[0]?.url && (
                                        <>
                                            <img
                                                src={track?.album?.images?.[0]?.url || "/logo.png"}
                                                alt={track?.name}
                                                className="w-[50px] h-[50px] rounded-[10px] group-hover:opacity-70 transition-opacity duration-200"
                                            />
                                            <div
                                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            >
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(track?.external_urls?.spotify || track?.album?.external_urls?.spotify, "_blank");
                                                    }}
                                                    className="rounded-full p-2 hover:scale-110 transform transition-transform duration-200 w-10 h-10 flex items-center justify-center">
                                                    <img
                                                        src="/playback.svg"
                                                        alt="Play on Spotify"
                                                        className="w-6 h-6"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <h2 className="text-[20px] font-[550] group-hover:font-bold transition-colors duration-200">{track?.name}</h2>
                            </div>

                            <p className="w-fit text-right">
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(track?.external_urls?.spotify || track?.album?.external_urls?.spotify, "_blank");
                                    }}
                                    className="text-text-primary text-sm w-full text-right hover:text-indigo-400 transition-colors duration-200"
                                >
                                    {track?.artists?.map((artist) => artist?.name).join(", ")}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>

                <div className="absolute top-2 right-2 cursor-pointer bg-red-500/10 hover:bg-red-500/20 backdrop-blur-lg px-2 py-1 rounded-full text-text-primary font-bold text-xs z-[1000]">
                    <button onClick={handlePlaylistClose} className="text-text-primary">X</button>
                </div>
            </div>
        )
    );
};

export default DisplayPlaylist;