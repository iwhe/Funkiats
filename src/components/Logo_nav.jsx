import { useNavigate } from "react-router-dom";

const Logo_nav = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/")}
      className="cursor-pointer px-[40px] bg-indigo-secondary/10 rounded-full w-fit flex flex-row justify-between items-center gap-[10px]">
      <div className="h-[30px] w-[30px] rounded-full overflow-hidden">
        <img src="logo.png" alt="logo" />
      </div>
      <div className="logo gradient-brand text-[30px] text-text-primary backdrop-blur-lg font-helvetica  font-bold">
        funkiats.
      </div>
    </div>
  );
};

export default Logo_nav;