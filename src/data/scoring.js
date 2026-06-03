// Pointberegning for VM 2026 betting

// Korrekt 1/X/2 = 1 point
// Korrekt vinder = 5 point
// Korrekt runner-up = 3 point
// Korrekt 3. plads = 2 point

export function beregnPoint(entry, kampResultater, finaleResultater) {
  let total = 0;
  const detaljer = {};

  // Gruppekampe
  Object.entries(kampResultater || {}).forEach(([kampId, resultat]) => {
    const pick = entry?.picks?.[kampId];
    if (pick && resultat && pick === resultat) {
      total += 1;
      detaljer[kampId] = 1;
    } else {
      detaljer[kampId] = 0;
    }
  });

  // Finale-picks
  if (finaleResultater?.vinder && entry?.finale?.vinder === finaleResultater.vinder) {
    total += 5;
    detaljer["vinder"] = 5;
  }
  if (finaleResultater?.runner_up && entry?.finale?.runner_up === finaleResultater.runner_up) {
    total += 3;
    detaljer["runner_up"] = 3;
  }
  if (finaleResultater?.tredje_plads && entry?.finale?.tredje_plads === finaleResultater.tredje_plads) {
    total += 2;
    detaljer["tredje_plads"] = 2;
  }

  return { total, detaljer };
}

export function beregnStilling(entries, kampResultater, finaleResultater) {
  return entries
    .map((entry) => {
      const { total, detaljer } = beregnPoint(entry, kampResultater, finaleResultater);
      return { ...entry, point: total, detaljer };
    })
    .sort((a, b) => b.point - a.point);
}

export function tælKorrekte(entry, kampResultater) {
  let korrekte = 0;
  let besvaret = 0;
  Object.entries(kampResultater || {}).forEach(([kampId, resultat]) => {
    if (resultat) {
      besvaret++;
      if (entry?.picks?.[kampId] === resultat) korrekte++;
    }
  });
  return { korrekte, besvaret };
}
