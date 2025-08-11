import HomeButton from "./Button1";

const Nav = () => {
  return (
    <div className="lg:px-[40px] px-[20px] bg-indigo-secondary/10 rounded-full w-full flex flex-row justify-between items-center sm:gap-[20px]">
      <div className="logo text-[30px] lg:text-[50px] text-text-primary/10 backdrop-blur-lg font-helvetica  font-bold">
        funkiats.
      </div>
      <div className="navitems text-[12px] sm:text-[15px] lg:text-[20px] lg:justify-center justify-evenly w-full flex flex-row lg:gap-[50px]">
        <a href="#" className="home">
          Home
        </a>
        <a href="#" className="about_us">
          About us
        </a>
        <a href="#" className="contact">
          Contact
        </a>
      </div>
      <div className="w-auto md:block hidden">
        <HomeButton />
      </div>
    </div>
  );
};

export default Nav;
