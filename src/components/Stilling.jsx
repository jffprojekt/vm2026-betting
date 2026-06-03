import { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabaseClient";
import { beregnStilling, tælKorrekte } from "../data/scoring";
import { ALLE_KAMPE } from "../data/matches";

function Stilling({ visToast }) {
  const [entries, setEntries] = useState([]);
  const [kampResultater, setKampResultater] = useState({});
  const [finaleResultater, setFinaleResultater] = useState({});
  const [loading, setLoading] = useState(true);
  const [valgtEntry, setValgtEntry] = useState(null);

  useEffect(() => {
    hentData();
    // Realtidsopdatering
    const kanal = supabase
      .channel("live-opdatering")
      .on("postgres_changes", { event: "*", schema: "public", table: "match_results" }, hentData)
      .on("postgres_changes", { event: "*", schema: "public", table: "final_results" }, hentData)
      .on("postgres_changes", { event: "*", schema: "public", table: "entries" }, hentData)
      .subscribe();

    return () => supabase.removeChannel(kanal);
  }, []);

  async function hentData() {
    setLoading(true);
    try {
      const [{ data: entriesData }, { data: resultaterData }, { data: finaleData }] =
        await Promise.all([
          supabase.from("entries").select("*").order("oprettet", { ascending: true }),
          supabase.from("match_results").select("*"),
          supabase.from("final_results").select("*").single(),
        ]);

      setEntries(entriesData || []);

      const resultaterMap = {};
      (resultaterData || []).forEach((r) => {
        resultaterMap[r.kamp_id] = r.resultat;
      });
      setKampResultater(resultaterMap);
      setFinaleResultater(finaleData || {});
    } catch (err) {
      visToast("Fejl ved hentning af data");
    } finally {
      setLoading(false);
    }
  }

  const stilling = useMemo(
    () => beregnStilling(entries, kampResultater, finaleResultater),
    [entries, kampResultater, finaleResultater]
  );

  const antalAfgjorte = Object.values(kampResultater).filter(Boolean).length;

  function rangBadge(index) {
    const tal = index + 1;
    const cls = tal <= 3 ? `rang-${tal}` : "rang-n";
    return <span className={`rang-badge ${cls}`}>{tal}</span>;
  }

  if (loading) {
    return (
      <div className="side" style={{ textAlign: "center", paddingTop: 80 }}>
        <div style={{ color: "var(--tekst-dæmpet)", fontSize: 15 }}>Henter stilling…</div>
      </div>
    );
  }

  if (stilling.length === 0) {
    return (
      <div className="side" style={{ textAlign: "center", paddingTop: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🕐</div>
        <h2 style={{ color: "var(--tekst)" }}>Ingen tilmeldinger endnu</h2>
        <p style={{ color: "var(--tekst-dæmpet)", marginTop: 8 }}>
          Vær den første til at indskrive dine picks!
        </p>
      </div>
    );
  }

  // Detaljevisning for én deltager
  if (valgtEntry) {
    const { korrekte, besvaret } = tælKorrekte(valgtEntry, kampResultater);
    return (
      <div className="side">
        <button
          className="btn btn-sekundær btn-lille"
          onClick={() => setValgtEntry(null)}
          style={{ marginBottom: 24 }}
        >
          ← Tilbage til stilling
        </button>
        <h1>
          <span className="accent">{valgtEntry.navn}</span>
        </h1>
        <div style={{ display: "flex", gap: 12, marginTop: 16, marginBottom: 28, flexWrap: "wrap" }}>
          <span className="badge badge-grøn">⚽ {valgtEntry.point} point</span>
          <span className="badge badge-guld">{korrekte}/{besvaret} korrekte</span>
          {valgtEntry.finale?.vinder && (
            <span className="badge badge-grå">🏆 {valgtEntry.finale.vinder}</span>
          )}
        </div>

        {/* Finale-picks */}
        <div className="kort" style={{ marginBottom: 24 }}>
          <h2>Finalegæt</h2>
          {[
            { felt: "vinder", label: "🥇 Verdensmester", pointFelt: "vinder", maxPt: 5 },
            { felt: "runner_up", label: "🥈 Runner-up", pointFelt: "runner_up", maxPt: 3 },
            { felt: "tredje_plads", label: "🥉 3. plads", pointFelt: "tredje_plads", maxPt: 2 },
          ].map(({ felt, label, pointFelt, maxPt }) => {
            const pick = valgtEntry.finale?.[felt];
            const korrekt = finaleResultater?.[pointFelt];
            const erKorrekt = korrekt && pick === korrekt;
            const erAfgjort = !!korrekt;
            return (
              <div key={felt} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--kant2)" }}>
                <span style={{ fontSize: 14, color: "var(--tekst-dæmpet)" }}>{label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{pick || "—"}</span>
                  {erAfgjort && (
                    <span className={`badge ${erKorrekt ? "badge-grøn" : "badge-rød"}`}>
                      {erKorrekt ? `+${maxPt} pt` : "0 pt"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Kamp-picks per gruppe */}
        {Object.entries(
          ALLE_KAMPE.reduce((acc, k) => { (acc[k.gruppe] = acc[k.gruppe] || []).push(k); return acc; }, {})
        ).map(([gruppe, kampe]) => (
          <div key={gruppe} className="kort" style={{ marginBottom: 12 }}>
            <div className="gruppe-header">
              <span className="gruppe-badge">GRUPPE {gruppe}</span>
            </div>
            {kampe.map((kamp) => {
              const pick = valgtEntry.picks?.[kamp.id];
              const resultat = kampResultater[kamp.id];
              const erKorrekt = resultat && pick === resultat;
              const erForkert = resultat && pick !== resultat;
              return (
                <div key={kamp.id} className="kamp-row">
                  <div className="kamp-holds">
                    <span className="hold-navn">{kamp.hjemmehold}</span>
                    <span className="kamp-vs">VS</span>
                    <span className="hold-navn højre">{kamp.udehold}</span>
                  </div>
                  <div className="udfald-gruppe">
                    <button
                      className={`udfald-knap ${
                        !resultat ? "ikke-afgjort" : erKorrekt ? "korrekt" : "forkert"
                      }`}
                    >
                      {pick || "—"}
                    </button>
                    {resultat && (
                      <button className="udfald-knap korrekt">{resultat}</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="side">
      <div className="stilling-hero">
        <h1>
          <span className="accent">Stilling</span>
        </h1>
        <p style={{ color: "var(--tekst-dæmpet)", marginTop: 8, fontSize: 14 }}>
          {antalAfgjorte} af {ALLE_KAMPE.length} gruppekampe afgjort &nbsp;·&nbsp; {stilling.length} deltagere
        </p>
        <div className="fremgang-bar" style={{ maxWidth: 300, margin: "16px auto 0" }}>
          <div className="fremgang-fill" style={{ width: `${(antalAfgjorte / ALLE_KAMPE.length) * 100}%` }} />
        </div>
      </div>

      <div className="kort" style={{ padding: 0, overflow: "hidden" }}>
        <table className="stilling-tabel">
          <thead>
            <tr>
              <th>#</th>
              <th>Navn</th>
              <th>Korrekte</th>
              <th>Point</th>
            </tr>
          </thead>
          <tbody>
            {stilling.map((entry, i) => {
              const { korrekte, besvaret } = tælKorrekte(entry, kampResultater);
              return (
                <tr
                  key={entry.id}
                  className="stilling-row"
                  style={{ cursor: "pointer" }}
                  onClick={() => setValgtEntry(entry)}
                >
                  <td>{rangBadge(i)}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{entry.navn}</div>
                    {entry.finale?.vinder && (
                      <div style={{ fontSize: 12, color: "var(--tekst-dæmpet)", marginTop: 2 }}>
                        🏆 {entry.finale.vinder}
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: 13, color: "var(--tekst-dæmpet)" }}>
                      {besvaret > 0 ? `${korrekte}/${besvaret}` : "—"}
                    </span>
                  </td>
                  <td>
                    <div className="point-tal">{entry.point}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Stilling;
