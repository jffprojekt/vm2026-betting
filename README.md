# VM 2026 Betting App — Opsætningsguide

## Oversigt
React-app hostet på GitHub Pages med Supabase som gratis backend.
- Deltagere udfylder picks på websitet
- Du opdaterer kampresultater via admin-panelet
- Stillingen opdateres automatisk i realtid for alle

---

## Trin 1: Opret Supabase-projekt

1. Gå til [supabase.com](https://supabase.com) og opret en gratis konto
2. Klik **New Project** — giv det et navn, vælg en region (fx Frankfurt)
3. Vent ca. 1 minut på at projektet starter
4. Gå til **Project Settings → API** og kopiér:
   - `Project URL` → bruges som `REACT_APP_SUPABASE_URL`
   - `anon public` nøglen → bruges som `REACT_APP_SUPABASE_ANON_KEY`

---

## Trin 2: Opret tabeller i Supabase

Gå til **SQL Editor** i Supabase og kør denne SQL:

```sql
-- Deltagernes picks
CREATE TABLE entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  navn TEXT NOT NULL,
  picks JSONB NOT NULL DEFAULT '{}',
  finale JSONB NOT NULL DEFAULT '{}',
  oprettet TIMESTAMPTZ DEFAULT NOW()
);

-- Kampresultater (opdateres af admin)
CREATE TABLE match_results (
  id SERIAL PRIMARY KEY,
  kamp_id TEXT UNIQUE NOT NULL,
  resultat TEXT CHECK (resultat IN ('1', 'X', '2'))
);

-- Finaleplaceringer (én række, id=1)
CREATE TABLE final_results (
  id INT PRIMARY KEY DEFAULT 1,
  vinder TEXT,
  runner_up TEXT,
  tredje_plads TEXT
);

-- Indsæt tom finalerække
INSERT INTO final_results (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Tillad offentlig læsning (stillingen er synlig for alle)
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_results ENABLE ROW LEVEL SECURITY;

-- Alle kan se stilling og resultater
CREATE POLICY "Alle kan læse entries" ON entries FOR SELECT USING (true);
CREATE POLICY "Alle kan indsende picks" ON entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Alle kan læse kampresultater" ON match_results FOR SELECT USING (true);
CREATE POLICY "Alle kan opdatere kampresultater" ON match_results FOR ALL USING (true);
CREATE POLICY "Alle kan læse finalresultater" ON final_results FOR SELECT USING (true);
CREATE POLICY "Alle kan opdatere finalresultater" ON final_results FOR ALL USING (true);
```

> **Bemærk om sikkerhed:** Admin-panelet er beskyttet af kode i browseren — det er tilstrækkeligt for et kontorsudspil. Supabase-nøglen er kun `anon`-nøglen og har begrænsede rettigheder.

---

## Trin 3: Konfigurér projektet

1. Kopiér `.env.example` til `.env`:
   ```bash
   cp .env.example .env
   ```

2. Åbn `.env` og udfyld dine værdier:
   ```
   REACT_APP_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGci...
   REACT_APP_ADMIN_KODE=ditHemmeligeKodeord
   ```

---

## Trin 4: Test lokalt

```bash
npm install
npm start
```

Åbn [http://localhost:3000](http://localhost:3000) og test:
- Udfyld picks som deltager → se om de gemmes i Supabase
- Gå til Admin (kode fra `.env`) → opdatér et resultat
- Se om stilling opdateres

---

## Trin 5: Deploy til GitHub Pages

1. Opret et nyt GitHub repository (fx `vm2026-betting`)

2. Opdatér `homepage` i `package.json`:
   ```json
   "homepage": "https://DIT-BRUGERNAVN.github.io/vm2026-betting"
   ```

3. Tilføj dine environment-variabler som **GitHub Secrets** (de bruges under build):
   - Gå til repository → **Settings → Secrets and variables → Actions**
   - Tilføj:
     - `REACT_APP_SUPABASE_URL`
     - `REACT_APP_SUPABASE_ANON_KEY`
     - `REACT_APP_ADMIN_KODE`

4. Opret `.github/workflows/deploy.yml` (se nedenfor)

5. Push koden:
   ```bash
   git init
   git add .
   git commit -m "VM 2026 betting app"
   git remote add origin https://github.com/DIT-BRUGERNAVN/vm2026-betting.git
   git push -u origin main
   ```

### GitHub Actions deploy-workflow

Opret `.github/workflows/deploy.yml`:

```yaml
name: Deploy til GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
        env:
          REACT_APP_SUPABASE_URL: ${{ secrets.REACT_APP_SUPABASE_URL }}
          REACT_APP_SUPABASE_ANON_KEY: ${{ secrets.REACT_APP_SUPABASE_ANON_KEY }}
          REACT_APP_ADMIN_KODE: ${{ secrets.REACT_APP_ADMIN_KODE }}
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

---

## Brug under turneringen

### Opdatere et kampresultat
1. Gå til siden → **Admin**-fanen
2. Indtast din admin-kode
3. Vælg den rigtige gruppe øverst
4. Klik **1**, **X** eller **2** ud for kampen
5. Stillingen opdateres automatisk for alle deltagere

### Opdatere finaleplaceringer
I admin-panelet øverst under "Finaleplaceringer" — vælg det rigtige hold for hver placering.

---

## Pointsystem

| Udfald | Point |
|--------|-------|
| Korrekt 1/X/2 | 2 point |
| Korrekt vinder | 5 point |
| Korrekt runner-up | 3 point |
| Korrekt 3. plads | 2 point |
| **Maks mulige** | **96 + 10 = 106 point** |

---

## Gruppedata

VM 2026 hold per gruppe (baseret på det officielle draw, december 2024).
Ret `src/data/matches.js` hvis holdene ændrer sig.
