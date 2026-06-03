import { useState } from "react";
import Tilmelding from "./components/Tilmelding";
import Stilling from "./components/Stilling";
import Admin from "./components/Admin";

function App() {
  const [fane, setFane] = useState("tilmelding");
  const [toast, setToast] = useState(null);

  function visToast(besked) {
    setToast(besked);
    setTimeout(() => setToast(null), 2800);
  }

  return (
    <>
      <nav className="topbar">
        <div className="topbar-logo">
          VM<span>2026</span>
        </div>
        <div className="nav-tabs">
          <button
            className={`nav-tab ${fane === "tilmelding" ? "aktiv" : ""}`}
            onClick={() => setFane("tilmelding")}
          >
            ⚽ Tip
          </button>
          <button
            className={`nav-tab ${fane === "stilling" ? "aktiv" : ""}`}
            onClick={() => setFane("stilling")}
          >
            🏆 Stilling
          </button>
          <button
            className={`nav-tab ${fane === "admin" ? "aktiv" : ""}`}
            onClick={() => setFane("admin")}
          >
            ⚙️ Admin
          </button>
        </div>
      </nav>

      {fane === "tilmelding" && <Tilmelding visToast={visToast} />}
      {fane === "stilling" && <Stilling visToast={visToast} />}
      {fane === "admin" && <Admin visToast={visToast} />}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

export default App;
