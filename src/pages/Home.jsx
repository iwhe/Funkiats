import HomeButton from "../components/Button1";
import Nav from "../components/Nav";

const Home = () => {
  return (
    <div className="app text-text-primary bg-(image:--gradient-primary) h-full min-h-[100dvh]  bg-cover lg:text-xl flex flex-col items-start justify-start md:p-[50px] p-[20px] font-manrope">
      <Nav className="hidden" />
      <div className="body flex flex-col mt-[50px] items-start  gap-[60px] h-full max-w-[1200px] ">
        <div className="flex flex-col gap-[30px]">
          <h2 className="heading lg:text-[80px]/[80px] md:text-[60px]/[60px] text-[40px]/[40px] font-helvetica font-bold">
            We <span className="text-indigo-secondary">care</span> about your{" "}
            <span className="text-orange-secondary">mood</span> while listening
            music.
          </h2>
          <p className="font-manrope text-[20px] md:text-[30px]">
            {" "}
            Funkiats detects your mood in real-time by capturing your facial
            features and recommends playlist based on your current mood.
          </p>
        </div>
        <HomeButton />
      </div>
    </div>
  );
};

export default Home;
