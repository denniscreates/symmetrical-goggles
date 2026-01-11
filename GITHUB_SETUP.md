# Si të Push-osh Projektin në GitHub

## Metoda 1: Përdor GitHub Desktop (Më e lehtë)

1. **Shkarko GitHub Desktop:**
   - Shko te: https://desktop.github.com/
   - Instalo GitHub Desktop

2. **Krijo Repository në GitHub:**
   - Shko te: https://github.com/new
   - Krijo një repository të ri (p.sh. `robotika-updates-2026`)
   - **MOS** inicializo me README, .gitignore, ose license

3. **Hap Projektin në GitHub Desktop:**
   - File → Add Local Repository
   - Zgjidh folder-in: `C:\Users\denis\Downloads\Robotika updates 2`
   - Kliko "Create a Repository" nëse kërkon

4. **Commit dhe Push:**
   - Shkruaj commit message: "Initial commit"
   - Kliko "Commit to main"
   - Kliko "Publish repository" ose "Push origin"

## Metoda 2: Përdor Git Command Line

1. **Instalo Git:**
   - Shkarko nga: https://git-scm.com/download/win
   - Instalo me default settings

2. **Hap PowerShell në folder-in e projektit:**
   ```powershell
   cd "C:\Users\denis\Downloads\Robotika updates 2"
   ```

3. **Inicializo Git:**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   ```

4. **Krijo Repository në GitHub:**
   - Shko te: https://github.com/new
   - Krijo repository (p.sh. `robotika-updates-2026`)
   - **MOS** inicializo me README

5. **Push në GitHub:**
   ```powershell
   git remote add origin https://github.com/TU_USERNAME/robotika-updates-2026.git
   git branch -M main
   git push -u origin main
   ```

## Metoda 3: Upload Direkt në GitHub (Për skedarë të vegjël)

1. **Krijo Repository në GitHub:**
   - Shko te: https://github.com/new
   - Krijo repository

2. **Upload Files:**
   - Kliko "uploading an existing file"
   - Drag & drop të gjitha skedarët (përveç `node_modules` dhe `.next`)

**Shënim:** Metoda 3 nuk rekomandohet për projekte të mëdha sepse nuk mund të upload-osh `node_modules`.

## Pas Push-imit në GitHub

1. **Lidh me Vercel:**
   - Shko te: https://vercel.com
   - Import project nga GitHub
   - Zgjidh repository-n tënd
   - Vercel do të detektojë Next.js automatikisht

2. **Shto Environment Variables në Vercel:**
   - Project Settings → Environment Variables
   - Shto:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXTAUTH_SECRET` (optional)

3. **Deploy:**
   - Vercel do të deploy-ojë automatikisht

## Files që duhen për GitHub

✅ **Duhen:**
- `app/` - Të gjitha faqet dhe API routes
- `components/` - React components
- `lib/` - Utility functions
- `sql/` - Database schema
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `next.config.js` - Next.js config
- `.gitignore` - Git ignore rules
- `README.md` - Documentation
- `middleware.ts` - Next.js middleware

❌ **Nuk duhen:**
- `node_modules/` - Do të instalohet nga `npm install`
- `.next/` - Do të build-ohet nga Vercel
- `.env.local` - Environment variables (shto në Vercel)
- `.vercel/` - Vercel config

