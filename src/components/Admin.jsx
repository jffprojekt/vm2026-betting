import { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabaseClient";
import { ALLE_KAMPE, ALLE_HOLD } from "../data/matches";

const ADMIN_KODE = process.env.REACT_APP_ADMIN_KODE || "vm2026";

function Admin({ visToast }) {
  const [loggetInd, setLoggetInd] = useState(false);
  const [kodeInput, setKodeInput] = useState("");
  const [kampResultater, setKampResultater] = useState({});
  const [finaleResultater, setFinaleResultater] = useState({});
  const [gemmer, setGemmer] = useState(null);
  const [gruppeFilter, setGruppeFilter] = useState("A");

  useEffect(() => {
    if (loggetInd) hentResultater();
  }, [loggetInd]);

  async function hentResultater() {
    const [{ data: kamp }, { data: finale }] = await Promise.all([
      supabase.from("match_results").select("*"),
      supabase.from("final_results").select("*").single(),
    ]);
    const map = {};
    (kamp || []).forEach((r) => { map[r.kamp_id] = r.resultat; });
    setKampResultater(map);
    setFinaleResultater(finale || {});
  }

  function logInd() {
    if (kodeInput === ADMIN_KODE) {
      setLoggetInd(true);
    } else {
      visToast("❌ Forkert kode");
    }
  }

  async function opdaterKamp(kampId, resultat) {
    setGemmer(kampId);
    try {
      const { error } = await supabase.from("match_results").upsert(
        { kamp_id: kampId, resultat },
        { onConflict: "kamp_id" }
      );
      if (error) throw error;
      setKampResultater((prev) => ({ ...prev, [kampId]: resultat }));
      visToast(`✅ ${kampId}: ${resultat} gemt`);
    } catch (err) {
      visToast("❌ " + err.message);
    } finally {
      setGemmer(null);
    }
  }

  async function opdaterFinale(felt, hold) {
    const opdateret = { ...finaleResultater, [felt]: hold };
    try {
      await supabase.from("final_results").upsert(
        { id: 1, ...opdateret },
        { onConflict: "id" }
      );
      setFinaleResultater(opdateret);
      visToast(`✅ ${felt}: ${hold} gemt`);
    } catch (err) {
      visToast("❌ " + err.message);
    }
  }

  const kampeIGruppe = useMemo(
    () => ALLE_KAMPE.filter((k) => k.gruppe === gruppeFilter),
    [gruppeFilter]
  );

  const grupper = [...new Set(ALLE_KAMPE.map((k) => k.gruppe))];
  const antalAfgjorte = Object.values(kampResultater).filter(Boolean).length;

  if (!loggetInd) {
    return (
      <div className="side" style={{ maxWidth: 400 }}>
        <h1>
          <span className="accent">Admin</span>
        </h1>
        <p style={{ color: "var(--tekst-dæmpet)", margin: "12px 0 28px" }}>
          Kun for turneringsadmin.
        </p>
        <div className="kort">
          <label>Adgangskode</label>
          <input
            type="password"
            placeholder="Kode..."
            value={kodeInput}
            onChange={(e) => setKodeInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && logInd()}
          />
          <button
            className="btn btn-primær"
            style={{ marginTop: 16, width: "100%" }}
            onClick={logInd}
          >
            Log ind
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="side">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1><span className="accent">Resultater</span></h1>
          <p style={{ color: "var(--tekst-dæmpet)", marginTop: 6, fontSize: 14 }}>
            {antalAfgjorte} / {ALLE_KAMPE.length} kampe afgjort
          </p>
        </div>
        <button className="btn btn-sekundær btn-lille" onClick={() => setLoggetInd(false)}>
          Log ud
        </button>
      </div>

      {/* Finale-resultater */}
      <div className="kort" style={{ marginBottom: 24 }}>
        <h2>🏆 Finaleplaceringer</h2>
        {[
          { felt: "vinder", label: "🥇 Verdensmester" },
          { felt: "runner_up", label: "🥈 Runner-up" },
          { felt: "tredje_plads", label: "🥉 3. plads" },
        ].map(({ felt, label }) => (
          <div key={felt} style={{ marginBottom: 20 }}>
            <h3>{label}</h3>
            <div className="hold-grid">
              {ALLE_HOLD.map((hold) => {
                const valgt = finaleResultater[felt] === hold;
                const valgtAnden = Object.entries(finaleResultater).some(
                  ([k, v]) => k !== felt && v === hold
                );
                return (
                  <button
                    key={hold}
                    className={`hold-knap ${valgt ? "valgt" : ""}`}
                    onClick={() => opdaterFinale(felt, valgt ? "" : hold)}
                    disabled={valgtAnden}
                    style={valgtAnden ? { opacity: 0.3 } : {}}
                  >
                    {hold}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Gruppe-vælger */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {grupper.map((g) => {
          const antalIGruppe = ALLE_KAMPE.filter((k) => k.gruppe === g).length;
          const afgjorteIGruppe = ALLE_KAMPE.filter(
            (k) => k.gruppe === g && kampResultater[k.id]
          ).length;
          const komplet = afgjorteIGruppe === antalIGruppe;
          return (
            <button
              key={g}
              className={`btn btn-lille ${gruppeFilter === g ? "btn-primær" : "btn-sekundær"}`}
              onClick={() => setGruppeFilter(g)}
              style={{ position: "relative" }}
            >
              Gruppe {g}
              {komplet && (
                <span style={{
                  position: "absolute", top: -5, right: -5,
                  width: 10, height: 10, borderRadius: "50%",
                  background: "var(--grøn)", border: "2px solid var(--mørk)"
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Kampe i valgt gruppe */}
      <div className="kort">
        <div className="gruppe-header">
          <span className="gruppe-badge">GRUPPE {gruppeFilter}</span>
          <span style={{ fontSize: 13, color: "var(--tekst-dæmpet)" }}>
            {kampeIGruppe.filter((k) => kampResultater[k.id]).length}/{kampeIGruppe.length} afgjort
          </span>
        </div>

        {kampeIGruppe.map((kamp) => {
          const nuværende = kampResultater[kamp.id];
          const erGemmer = gemmer === kamp.id;
          return (
            <div key={kamp.id} className="admin-kamp-row">
              <div className="admin-kamp-info">
                <div className="kampid">{kamp.id}</div>
                <div>
                  <strong>{kamp.hjemmehold}</strong>{" "}
                  <span style={{ color: "var(--tekst-dæmpet)" }}>vs</span>{" "}
                  <strong>{kamp.udehold}</strong>
                </div>
              </div>
              <div className="udfald-gruppe">
                {["1", "X", "2"].map((u) => (
                  <button
                    key={u}
                    className={`udfald-knap${nuværende === u ? ` valgt-${u}` : ""}`}
                    onClick={() => opdaterKamp(kamp.id, nuværende === u ? null : u)}
                    disabled={erGemmer}
                    style={erGemmer ? { opacity: 0.5 } : {}}
                  >
                    {u}
                  </button>
                ))}
              </div>
              {nuværende && (
                <span className="badge badge-grøn">{nuværende}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Admin;
