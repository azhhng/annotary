import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import UserJournal from "./pages/UserJournal";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/:username" element={<UserJournal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
