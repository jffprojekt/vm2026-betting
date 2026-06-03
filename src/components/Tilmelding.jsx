import { useState, useMemo } from "react";
import { supabase } from "../supabaseClient";
import { ALLE_KAMPE, GROUPS, ALLE_HOLD } from "../data/matches";

function Kvittering({ navn, picks, finale, tidspunkt, onNyTilmelding }) {
  const grupperMedKampe = useMemo(() => {
    const grupperet = {};
    ALLE_KAMPE.forEach((kamp) => {
      if (!grupperet[kamp.gruppe]) grupperet[kamp.gruppe] = [];
      grupperet[kamp.gruppe].push(kamp);
    });
    return grupperet;
  }, []);

  function udskriv() {
    window.print();
  }

  return (
    <>
      {/* Print-specifik styling */}
      <style>{`
        @media print {
          .topbar, .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .kvittering-side { padding: 0 !important; }
          .kvittering-header { background: #f5f5f5 !important; border: 1px solid #ccc !important; color: black !important; }
          .kvit-kort { background: white !important; border: 1px solid #ddd !important; page-break-inside: avoid; }
          .gruppe-badge { background: #eee !important; color: #333 !important; border: 1px solid #ccc !important; }
          .kvit-kamp-row { border-bottom: 1px solid #eee !important; }
          .kvit-pick { background: #e8f5e9 !important; color: #1b5e20 !important; border: 1px solid #a5d6a7 !important; }
          .kvit-finale-rad { border-bottom: 1px solid #eee !important; }
          * { color: black !important; }
          .kvit-pick { color: #1b5e20 !important; }
        }
      `}</style>

      <div className="side kvittering-side">
        {/* Header */}
        <div className="kvittering-header kort" style={{
          background: "linear-gradient(135deg, rgba(0,200,83,0.08), rgba(0,200,83,0.03))",
          border: "1px solid var(--grøn)",
          marginBottom: 24,
          textAlign: "center",
          padding: "28px 24px"
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <h1 style={{ marginBottom: 8 }}>
            <span className="accent">Picks gemt,</span> {navn}!
          </h1>
          <p style={{ color: "var(--tekst-dæmpet)", fontSize: 14, marginTop: 8 }}>
            Gemt {tidspunkt} &nbsp;·&nbsp; {ALLE_KAMPE.length} gruppekampe &nbsp;·&nbsp; 3 finalepladser
          </p>
          <p style={{ color: "var(--tekst-dæmpet)", fontSize: 13, marginTop: 6 }}>
            Gem denne side som screenshot eller print den som backup.
          </p>
        </div>

        {/* Knapper */}
        <div className="no-print" style={{ display: "flex", gap: 10, marginBottom: 28, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn btn-primær" onClick={udskriv}>
            🖨️ Print / Gem som PDF
          </button>
          <button className="btn btn-sekundær" onClick={onNyTilmelding}>
            Ny tilmelding
          </button>
        </div>

        {/* Finalepicks */}
        <div className="kvit-kort kort" style={{ marginBottom: 16 }}>
          <h2>🏆 Finalegæt</h2>
          {[
            { felt: "vinder",      label: "🥇 Verdensmester", pt: "5 pt" },
            { felt: "runner_up",   label: "🥈 Runner-up",     pt: "3 pt" },
            { felt: "tredje_plads",label: "🥉 3. plads",      pt: "2 pt" },
          ].map(({ felt, label, pt }) => (
            <div key={felt} className="kvit-finale-rad" style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderBottom: "1px solid var(--kant2)"
            }}>
              <span style={{ fontSize: 14, color: "var(--tekst-dæmpet)" }}>{label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{finale[felt] || "—"}</span>
                <span className="badge badge-grå">{pt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Alle gruppekampe */}
        {Object.entries(grupperMedKampe).map(([gruppe, kampe]) => (
          <div key={gruppe} className="kvit-kort kort" style={{ marginBottom: 12 }}>
            <div className="gruppe-header">
              <span className="gruppe-badge">GRUPPE {gruppe}</span>
              <span style={{ fontSize: 12, color: "var(--tekst-dæmpet)" }}>
                {GROUPS[gruppe].holds.join(" · ")}
              </span>
            </div>
            {kampe.map((kamp) => {
              const pick = picks[kamp.id];
              return (
                <div key={kamp.id} className="kvit-kamp-row kamp-row">
                  <div className="kamp-holds" style={{ fontSize: 13 }}>
                    <span className="hold-navn">{kamp.hjemmehold}</span>
                    <span className="kamp-vs">VS</span>
                    <span className="hold-navn højre">{kamp.udehold}</span>
                  </div>
                  <span className={`kvit-pick udfald-knap valgt-${pick}`} style={{ pointerEvents: "none" }}>
                    {pick || "—"}
                  </span>
                </div>
              );
            })}
          </div>
        ))}

        <div className="no-print" style={{ textAlign: "center", marginTop: 24 }}>
          <button className="btn btn-sekundær" onClick={onNyTilmelding}>
            Ny tilmelding
          </button>
        </div>
      </div>
    </>
  );
}

function Tilmelding({ visToast }) {
  const [navn, setNavn] = useState("");
  const [picks, setPicks] = useState({});
  const [finale, setFinale] = useState({ vinder: "", runner_up: "", tredje_plads: "" });
  const [sender, setSender] = useState(false);
  const [kvittering, setKvittering] = useState(null);

  const grupperMedKampe = useMemo(() => {
    const grupperet = {};
    ALLE_KAMPE.forEach((kamp) => {
      if (!grupperet[kamp.gruppe]) grupperet[kamp.gruppe] = [];
      grupperet[kamp.gruppe].push(kamp);
    });
    return grupperet;
  }, []);

  const antalBesvaret = Object.values(picks).filter(Boolean).length;
  const antalKampe = ALLE_KAMPE.length;
  const finaleKomplet = finale.vinder && finale.runner_up && finale.tredje_plads;
  const klar = navn.trim() && antalBesvaret === antalKampe && finaleKomplet;

  function vælgUdfald(kampId, udfald) {
    setPicks((prev) =>
      prev[kampId] === udfald ? { ...prev, [kampId]: undefined } : { ...prev, [kampId]: udfald }
    );
  }

  function vælgFinale(felt, hold) {
    setFinale((prev) => ({ ...prev, [felt]: prev[felt] === hold ? "" : hold }));
  }

  async function indsend() {
    if (!klar) return;
    setSender(true);
    const tidspunkt = new Date().toLocaleString("da-DK", {
      day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"
    });
    try {
      const { error } = await supabase.from("entries").insert([
        {
          navn: navn.trim(),
          picks,
          finale,
          oprettet: new Date().toISOString(),
        },
      ]);
      if (error) throw error;
      visToast("✅ Dine picks er gemt!");
      setKvittering({ navn: navn.trim(), picks: { ...picks }, finale: { ...finale }, tidspunkt });
    } catch (err) {
      visToast("❌ Fejl: " + err.message);
    } finally {
      setSender(false);
    }
  }

  if (kvittering) {
    return (
      <Kvittering
        {...kvittering}
        onNyTilmelding={() => {
          setKvittering(null);
          setNavn("");
          setPicks({});
          setFinale({ vinder: "", runner_up: "", tredje_plads: "" });
        }}
      />
    );
  }

  return (
    <div className="side">
      <div style={{ marginBottom: 32 }}>
        <h1>VM 2026 <span className="accent">Tipning</span></h1>
        <p style={{ color: "var(--tekst-dæmpet)", marginTop: 8, fontSize: 15 }}>
          Vælg udfald for alle {antalKampe} gruppekampe + gæt finaleplaceringerne.
        </p>
      </div>

      <div className="info-boks">
        <strong>Pointsystem:</strong> Korrekt 1/X/2 = <strong>1 pt</strong> &nbsp;·&nbsp;
        Korrekt vinder = <strong>5 pt</strong> &nbsp;·&nbsp;
        Runner-up = <strong>3 pt</strong> &nbsp;·&nbsp;
        3. plads = <strong>2 pt</strong>
      </div>

      {/* Navn */}
      <div className="kort form-sektion">
        <label>Dit navn</label>
        <input
          type="text"
          placeholder="Hvad hedder du?"
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
          maxLength={40}
        />
      </div>

      {/* Fremgang */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "var(--tekst-dæmpet)" }}>
          <span>Gruppekampe besvaret</span>
          <span style={{ color: antalBesvaret === antalKampe ? "var(--grøn)" : "var(--tekst-dæmpet)" }}>
            {antalBesvaret} / {antalKampe}
          </span>
        </div>
        <div className="fremgang-bar">
          <div className="fremgang-fill" style={{ width: `${(antalBesvaret / antalKampe) * 100}%` }} />
        </div>
      </div>

      {/* Gruppekampe */}
      {Object.entries(grupperMedKampe).map(([gruppe, kampe]) => (
        <div key={gruppe} className="kort form-sektion">
          <div className="gruppe-header">
            <span className="gruppe-badge">GRUPPE {gruppe}</span>
            <span style={{ fontSize: 13, color: "var(--tekst-dæmpet)" }}>
              {GROUPS[gruppe].holds.join(" · ")}
            </span>
          </div>
          {kampe.map((kamp) => (
            <div key={kamp.id} className="kamp-row">
              <div className="kamp-holds">
                <span className="hold-navn">{kamp.hjemmehold}</span>
                <span className="kamp-vs">VS</span>
                <span className="hold-navn højre">{kamp.udehold}</span>
              </div>
              <div className="udfald-gruppe">
                {["1", "X", "2"].map((u) => (
                  <button
                    key={u}
                    className={`udfald-knap${picks[kamp.id] === u ? ` valgt-${u}` : ""}`}
                    onClick={() => vælgUdfald(kamp.id, u)}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Finale-picks */}
      <div className="kort form-sektion">
        <h2>🏆 Finaleplaceringer</h2>
        <p style={{ fontSize: 14, color: "var(--tekst-dæmpet)", marginBottom: 20 }}>
          Hvem ender i top 3? Vælg ét hold per placering.
        </p>

        {[
          { felt: "vinder",      label: "🥇 Verdensmester (5 pt)", farve: "var(--guld)" },
          { felt: "runner_up",   label: "🥈 Runner-up (3 pt)",     farve: "#aaa" },
          { felt: "tredje_plads",label: "🥉 3. plads (2 pt)",      farve: "#cd7f32" },
        ].map(({ felt, label, farve }) => (
          <div key={felt} style={{ marginBottom: 24 }}>
            <h3 style={{ color: farve }}>{label}</h3>
            <div className="hold-grid">
              {ALLE_HOLD.map((hold) => {
                const valgEnAnden = Object.entries(finale).some(([k, v]) => k !== felt && v === hold);
                return (
                  <button
                    key={hold}
                    className={`hold-knap ${finale[felt] === hold ? "valgt" : ""}`}
                    onClick={() => vælgFinale(felt, hold)}
                    disabled={valgEnAnden}
                    style={valgEnAnden ? { opacity: 0.3, cursor: "not-allowed" } : {}}
                  >
                    {hold}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="sticky-bund">
        <button
          className="btn btn-primær"
          onClick={indsend}
          disabled={!klar || sender}
        >
          {sender
            ? "Gemmer..."
            : !navn.trim()
            ? "Indtast dit navn"
            : antalBesvaret < antalKampe
            ? `Besvar alle kampe (${antalKampe - antalBesvaret} mangler)`
            : !finaleKomplet
            ? "Vælg alle 3 finalepladser"
            : "Gem mine picks ⚽"}
        </button>
      </div>
    </div>
  );
}

export default Tilmelding;
