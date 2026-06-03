// VM 2026 - Alle 72 gruppekampe
// Kilde: tipsbladet.dk/vm/kampprogram (opdateret maj 2026)

export const GROUPS = {
  A: { holds: ["Mexico", "Sydafrika", "Sydkorea", "Tjekkiet"] },
  B: { holds: ["Canada", "Bosnien-Hercegovina", "Qatar", "Schweiz"] },
  C: { holds: ["Brasilien", "Marokko", "Haiti", "Skotland"] },
  D: { holds: ["USA", "Paraguay", "Australien", "Tyrkiet"] },
  E: { holds: ["Tyskland", "Curacao", "Elfenbenskysten", "Ecuador"] },
  F: { holds: ["Holland", "Japan", "Sverige", "Tunesien"] },
  G: { holds: ["Belgien", "Egypten", "Iran", "New Zealand"] },
  H: { holds: ["Spanien", "Kap Verde", "Saudi-Arabien", "Uruguay"] },
  I: { holds: ["Frankrig", "Senegal", "Irak", "Norge"] },
  J: { holds: ["Argentina", "Algeriet", "Østrig", "Jordan"] },
  K: { holds: ["Portugal", "DR Congo", "Usbekistan", "Colombia"] },
  L: { holds: ["England", "Kroatien", "Ghana", "Panama"] },
};

// Alle 72 gruppekampe fra det officielle kampprogram
export const ALLE_KAMPE = [
  // GRUPPE A
  { id: "G01", gruppe: "A", hjemmehold: "Mexico",      udehold: "Sydafrika",  dato: "11. jun", tid: "21:00" },
  { id: "G02", gruppe: "A", hjemmehold: "Sydkorea",    udehold: "Tjekkiet",   dato: "12. jun", tid: "04:00" },
  { id: "G03", gruppe: "A", hjemmehold: "Mexico",      udehold: "Sydkorea",   dato: "19. jun", tid: "03:00" },
  { id: "G04", gruppe: "A", hjemmehold: "Tjekkiet",    udehold: "Sydafrika",  dato: "18. jun", tid: "18:00" },
  { id: "G05", gruppe: "A", hjemmehold: "Tjekkiet",    udehold: "Mexico",     dato: "25. jun", tid: "03:00" },
  { id: "G06", gruppe: "A", hjemmehold: "Sydafrika",   udehold: "Sydkorea",   dato: "25. jun", tid: "03:00" },

  // GRUPPE B
  { id: "G07", gruppe: "B", hjemmehold: "Canada",              udehold: "Bosnien-Hercegovina", dato: "12. jun", tid: "21:00" },
  { id: "G08", gruppe: "B", hjemmehold: "Qatar",               udehold: "Schweiz",             dato: "13. jun", tid: "21:00" },
  { id: "G09", gruppe: "B", hjemmehold: "Canada",              udehold: "Qatar",               dato: "19. jun", tid: "00:00" },
  { id: "G10", gruppe: "B", hjemmehold: "Schweiz",             udehold: "Bosnien-Hercegovina", dato: "18. jun", tid: "21:00" },
  { id: "G11", gruppe: "B", hjemmehold: "Schweiz",             udehold: "Canada",              dato: "24. jun", tid: "21:00" },
  { id: "G12", gruppe: "B", hjemmehold: "Bosnien-Hercegovina", udehold: "Qatar",               dato: "24. jun", tid: "21:00" },

  // GRUPPE C
  { id: "G13", gruppe: "C", hjemmehold: "Brasilien", udehold: "Marokko",  dato: "14. jun", tid: "00:00" },
  { id: "G14", gruppe: "C", hjemmehold: "Haiti",     udehold: "Skotland", dato: "14. jun", tid: "03:00" },
  { id: "G15", gruppe: "C", hjemmehold: "Brasilien", udehold: "Haiti",    dato: "20. jun", tid: "03:00" },
  { id: "G16", gruppe: "C", hjemmehold: "Skotland",  udehold: "Marokko",  dato: "20. jun", tid: "00:00" },
  { id: "G17", gruppe: "C", hjemmehold: "Skotland",  udehold: "Brasilien",dato: "25. jun", tid: "00:00" },
  { id: "G18", gruppe: "C", hjemmehold: "Marokko",   udehold: "Haiti",    dato: "25. jun", tid: "00:00" },

  // GRUPPE D
  { id: "G19", gruppe: "D", hjemmehold: "USA",       udehold: "Paraguay",  dato: "13. jun", tid: "03:00" },
  { id: "G20", gruppe: "D", hjemmehold: "Australien",udehold: "Tyrkiet",   dato: "14. jun", tid: "06:00" },
  { id: "G21", gruppe: "D", hjemmehold: "USA",       udehold: "Australien",dato: "19. jun", tid: "21:00" },
  { id: "G22", gruppe: "D", hjemmehold: "Tyrkiet",   udehold: "Paraguay",  dato: "20. jun", tid: "06:00" },
  { id: "G23", gruppe: "D", hjemmehold: "Tyrkiet",   udehold: "USA",       dato: "26. jun", tid: "04:00" },
  { id: "G24", gruppe: "D", hjemmehold: "Paraguay",  udehold: "Australien",dato: "26. jun", tid: "04:00" },

  // GRUPPE E
  { id: "G25", gruppe: "E", hjemmehold: "Tyskland",        udehold: "Curacao",         dato: "14. jun", tid: "19:00" },
  { id: "G26", gruppe: "E", hjemmehold: "Elfenbenskysten", udehold: "Ecuador",         dato: "15. jun", tid: "01:00" },
  { id: "G27", gruppe: "E", hjemmehold: "Tyskland",        udehold: "Elfenbenskysten", dato: "20. jun", tid: "22:00" },
  { id: "G28", gruppe: "E", hjemmehold: "Ecuador",         udehold: "Curacao",         dato: "21. jun", tid: "02:00" },
  { id: "G29", gruppe: "E", hjemmehold: "Curacao",         udehold: "Elfenbenskysten", dato: "25. jun", tid: "22:00" },
  { id: "G30", gruppe: "E", hjemmehold: "Ecuador",         udehold: "Tyskland",        dato: "25. jun", tid: "22:00" },

  // GRUPPE F
  { id: "G31", gruppe: "F", hjemmehold: "Holland",  udehold: "Japan",    dato: "14. jun", tid: "22:00" },
  { id: "G32", gruppe: "F", hjemmehold: "Sverige",  udehold: "Tunesien", dato: "15. jun", tid: "04:00" },
  { id: "G33", gruppe: "F", hjemmehold: "Holland",  udehold: "Sverige",  dato: "20. jun", tid: "19:00" },
  { id: "G34", gruppe: "F", hjemmehold: "Tunesien", udehold: "Japan",    dato: "21. jun", tid: "06:00" },
  { id: "G35", gruppe: "F", hjemmehold: "Japan",    udehold: "Sverige",  dato: "26. jun", tid: "01:00" },
  { id: "G36", gruppe: "F", hjemmehold: "Tunesien", udehold: "Holland",  dato: "26. jun", tid: "01:00" },

  // GRUPPE G
  { id: "G37", gruppe: "G", hjemmehold: "Belgien",     udehold: "Egypten",     dato: "15. jun", tid: "21:00" },
  { id: "G38", gruppe: "G", hjemmehold: "Iran",         udehold: "New Zealand", dato: "16. jun", tid: "03:00" },
  { id: "G39", gruppe: "G", hjemmehold: "Belgien",      udehold: "Iran",        dato: "21. jun", tid: "21:00" },
  { id: "G40", gruppe: "G", hjemmehold: "New Zealand",  udehold: "Egypten",     dato: "22. jun", tid: "03:00" },
  { id: "G41", gruppe: "G", hjemmehold: "Egypten",      udehold: "Iran",        dato: "27. jun", tid: "05:00" },
  { id: "G42", gruppe: "G", hjemmehold: "New Zealand",  udehold: "Belgien",     dato: "27. jun", tid: "05:00" },

  // GRUPPE H
  { id: "G43", gruppe: "H", hjemmehold: "Spanien",      udehold: "Kap Verde",   dato: "15. jun", tid: "18:00" },
  { id: "G44", gruppe: "H", hjemmehold: "Saudi-Arabien",udehold: "Uruguay",     dato: "16. jun", tid: "00:00" },
  { id: "G45", gruppe: "H", hjemmehold: "Spanien",      udehold: "Saudi-Arabien",dato: "21. jun", tid: "18:00" },
  { id: "G46", gruppe: "H", hjemmehold: "Uruguay",      udehold: "Kap Verde",   dato: "22. jun", tid: "00:00" },
  { id: "G47", gruppe: "H", hjemmehold: "Kap Verde",    udehold: "Saudi-Arabien",dato: "27. jun", tid: "02:00" },
  { id: "G48", gruppe: "H", hjemmehold: "Uruguay",      udehold: "Spanien",     dato: "27. jun", tid: "02:00" },

  // GRUPPE I
  { id: "G49", gruppe: "I", hjemmehold: "Frankrig", udehold: "Senegal", dato: "16. jun", tid: "21:00" },
  { id: "G50", gruppe: "I", hjemmehold: "Irak",     udehold: "Norge",   dato: "17. jun", tid: "00:00" },
  { id: "G51", gruppe: "I", hjemmehold: "Frankrig", udehold: "Irak",    dato: "22. jun", tid: "23:00" },
  { id: "G52", gruppe: "I", hjemmehold: "Norge",    udehold: "Senegal", dato: "23. jun", tid: "02:00" },
  { id: "G53", gruppe: "I", hjemmehold: "Norge",    udehold: "Frankrig",dato: "26. jun", tid: "21:00" },
  { id: "G54", gruppe: "I", hjemmehold: "Senegal",  udehold: "Irak",    dato: "26. jun", tid: "21:00" },

  // GRUPPE J
  { id: "G55", gruppe: "J", hjemmehold: "Argentina", udehold: "Algeriet", dato: "17. jun", tid: "03:00" },
  { id: "G56", gruppe: "J", hjemmehold: "Østrig",    udehold: "Jordan",   dato: "17. jun", tid: "06:00" },
  { id: "G57", gruppe: "J", hjemmehold: "Argentina", udehold: "Østrig",   dato: "22. jun", tid: "19:00" },
  { id: "G58", gruppe: "J", hjemmehold: "Jordan",    udehold: "Algeriet", dato: "23. jun", tid: "05:00" },
  { id: "G59", gruppe: "J", hjemmehold: "Algeriet",  udehold: "Østrig",   dato: "28. jun", tid: "04:00" },
  { id: "G60", gruppe: "J", hjemmehold: "Jordan",    udehold: "Argentina",dato: "28. jun", tid: "04:00" },

  // GRUPPE K
  { id: "G61", gruppe: "K", hjemmehold: "Portugal",   udehold: "DR Congo",    dato: "17. jun", tid: "19:00" },
  { id: "G62", gruppe: "K", hjemmehold: "Usbekistan", udehold: "Colombia",    dato: "18. jun", tid: "04:00" },
  { id: "G63", gruppe: "K", hjemmehold: "Portugal",   udehold: "Usbekistan",  dato: "23. jun", tid: "19:00" },
  { id: "G64", gruppe: "K", hjemmehold: "Colombia",   udehold: "DR Congo",    dato: "24. jun", tid: "04:00" },
  { id: "G65", gruppe: "K", hjemmehold: "Colombia",   udehold: "Portugal",    dato: "28. jun", tid: "01:30" },
  { id: "G66", gruppe: "K", hjemmehold: "DR Congo",   udehold: "Usbekistan",  dato: "28. jun", tid: "01:30" },

  // GRUPPE L
  { id: "G67", gruppe: "L", hjemmehold: "England",  udehold: "Kroatien", dato: "17. jun", tid: "22:00" },
  { id: "G68", gruppe: "L", hjemmehold: "Ghana",    udehold: "Panama",   dato: "18. jun", tid: "01:00" },
  { id: "G69", gruppe: "L", hjemmehold: "England",  udehold: "Ghana",    dato: "23. jun", tid: "22:00" },
  { id: "G70", gruppe: "L", hjemmehold: "Panama",   udehold: "Kroatien", dato: "24. jun", tid: "01:00" },
  { id: "G71", gruppe: "L", hjemmehold: "Panama",   udehold: "England",  dato: "27. jun", tid: "23:00" },
  { id: "G72", gruppe: "L", hjemmehold: "Kroatien", udehold: "Ghana",    dato: "27. jun", tid: "23:00" },
];

export const GRUPPENAVNE = {
  A: "Gruppe A", B: "Gruppe B", C: "Gruppe C", D: "Gruppe D",
  E: "Gruppe E", F: "Gruppe F", G: "Gruppe G", H: "Gruppe H",
  I: "Gruppe I", J: "Gruppe J", K: "Gruppe K", L: "Gruppe L",
};

// Alle 48 hold til finale-picks
export const ALLE_HOLD = Object.values(GROUPS).flatMap((g) => g.holds);