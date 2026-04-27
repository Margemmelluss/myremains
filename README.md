# 🕯️ My Remains - Digital Memory Wall

A free, forever-lasting digital memorial where visitors can leave tiles (name, message, date) on a shared grid.

**Live at:** [myremains.pages](https://myremains.pages)

---

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript (GitHub Pages)
- **Backend/Database:** Supabase (PostgreSQL) - Free tier
- **Domain:** myremains.pages (Namecheap via GitHub Student Pack)
- **Hosting:** GitHub Pages (Student Pack)

---

## Setup Instructions

### 1. Configure Supabase

1. Go to [app.supabase.com](https://app.supabase.com) and create/open your project
2. Go to **Settings → API** and copy:
   - `Project URL` → Replace `YOUR_PROJECT_ID.supabase.co` in `app.js`
   - `anon public` key → Replace `YOUR_ANON_KEY_HERE` in `app.js`

3. Create the `tiles` table:
   - Navigate to **SQL Editor** and run this query:

   ```sql
   CREATE TABLE tiles (
       id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
       name VARCHAR(50) NOT NULL,
       message VARCHAR(200) NOT NULL,
       date DATE NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE INDEX idx_tiles_created_at ON tiles(created_at DESC);
   ```

4. Enable **Row Level Security (RLS)** on the `tiles` table:
   - Go to **Authentication → Policies**
   - Click on the `tiles` table
   - Add a new policy:
     - **Name:** `Allow public INSERT`
     - **Operation:** SELECT, INSERT
     - **Target roles:** anon
     - **Custom expression:** `true`
   - This allows anyone to read and add tiles without authentication

### 2. Configure GitHub Pages

1. Push your code to `Margemmelluss/myremains`:
   ```bash
   git add .
   git commit -m "Initial commit: Digital Memory Wall"
   git push origin main
   ```

2. Go to **Repository Settings → Pages**
3. Select **Source:** `Deploy from a branch`
4. Select **Branch:** `main` / `/ (root)`
5. Save

GitHub Pages will build at `https://margemmelluss.github.io/myremains`

### 3. Configure Custom Domain (Namecheap DNS)

1. In your GitHub repo, the `CNAME` file already points to `myremains.pages`

2. Log into Namecheap and go to your domain settings

3. Update DNS records (using Namecheap's nameservers or custom DNS):
   - **Type:** CNAME
   - **Host:** `@` (or leave blank for root)
   - **Value:** `margemmelluss.github.io`
   - **TTL:** 3600

   **Alternative (if using GitHub's nameservers):**
   - Replace Namecheap nameservers with GitHub's:
     - `ns-1620.awsdns-09.co.uk`
     - `ns-542.awsdns-01.com`
     - `ns-692.awsdns-28.net`
     - `ns-1274.awsdns-31.org`

4. In GitHub repo **Settings → Pages**, verify:
   - Custom domain is set to `myremains.pages`
   - ✅ DNS check passes (may take 24 hours)
   - ✅ HTTPS is enforced (GitHub auto-provisions SSL cert)

---

## Security

- ✅ **Row Level Security (RLS):** Only SELECT/INSERT allowed for anonymous users
- ✅ **No DELETE/UPDATE:** Tiles are permanent (can't delete or edit)
- ✅ **Input validation:** Max 50 chars for name, 200 for message
- ✅ **XSS protection:** HTML escaping on all user inputs
- ✅ **No authentication required:** Free-tier friendly

---

## Forever-Free Guarantees

✅ GitHub Pages (unlimited)  
✅ Supabase Free Tier (2GB, no credit card required)  
✅ Namecheap domain (renewed once yearly, ~$10)  
✅ No backend server costs  
✅ No database migration needed (PostgreSQL stays on Supabase free)

---

## Development

To run locally:
1. Install dependencies: `npm install` (if needed)
2. Run a local server: `python -m http.server 8000` or `npx serve`
3. Open `http://localhost:8000`

**Important:** Replace Supabase credentials in `app.js` to test with your project.

---

## File Structure

```
myremains/
├── index.html       # Main page structure
├── styles.css       # Memorial wall styling
├── app.js           # Supabase integration & DOM logic
├── CNAME            # GitHub Pages custom domain
└── README.md        # This file
```

---

## License

This project is open-source and free to use. Honor the memories.

---

**Built with 💜 by Apurva**  
"My Remains" - Where memories live forever.