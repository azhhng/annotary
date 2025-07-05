import { useState } from "react";
import Settings from "./Settings";
import Achievements from "../components/Achievements";

function More() {
  const [activeSection, setActiveSection] = useState("settings");

  return (
    <div className="container more-layout">
      <div className="more-sidebar">
        <button
          onClick={() => setActiveSection("settings")}
          className={`btn btn-secondary ${activeSection === "settings" ? "btn-primary" : ""}`}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveSection("achievements")}
          className={`btn btn-secondary ${activeSection === "achievements" ? "btn-primary" : ""}`}
        >
          Achievements
        </button>
      </div>

      <div className="more-content">
        {activeSection === "settings" && <Settings />}
        {activeSection === "achievements" && <Achievements />}
      </div>
    </div>
  );
}

export default More;