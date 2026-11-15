import { useAppContext } from "../context/AppContext";
import TopBarLeft from "./TopBarLeft";
import TopBarCenter from "./TopBarCenter";
import TopBarRight from "./TopBarRight";

const Statusbar = () => {
  const app = useAppContext();

  const darkMode = app.theme === "dark";

  return (
    <div
      className={`${
        darkMode ? "bg-[#0C0C0C]/70 text-white" : "bg-[#f5f6f8]/50 text-black"
      } w-full h-8 px-4 flex items-center justify-between border-b border-zinc-500/30 select-none backdrop-blur-3xl`}
    >
      <TopBarLeft />
      <TopBarCenter />
      <TopBarRight />
    </div>
  );
};

export default Statusbar;
