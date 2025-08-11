import { useNavigate } from "react-router-dom";

function HomeButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/detect-mood")}
      className="cursor-pointer lg:px-[20px] px-[10px] py-[5px] lg:w-[300px] md:w-[250px] lg:py-[10px] flex flex-row items-center justify-center gap-[10px] glass bg-indigo-secondary/10 backdrop-blur-lg border-[0.5px] border-amber-50/10 rounded-full hover:bg-indigo-secondary/20 transition-colors duration-200">
      Experience Funkiats
      <img src="/playback.svg" className="lg:w-[25px] w-[15px] aspect-square" />
    </button>
  );
}

export default HomeButton;
