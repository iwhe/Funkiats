import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Suggestion from "./pages/Suggestion";
import MoodDetection from "./pages/MoodDetection";
import Connect from "./pages/Connect";
import DisplayPlaylist from "./components/DisplayPlaylist";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/suggestion" element={<Suggestion />} />
      <Route path="/connect" element={<Connect />} />
      <Route path="/detect-mood" element={<MoodDetection />} />
      <Route path="/display-playlist" element={<DisplayPlaylist />} />
    </Routes>
  );
};

export default App;
