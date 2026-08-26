# NENXHORIZON — setup

Everything you need to get the website live. Follow it in order. Nothing here
needs you to write code, only to copy, paste and click.

Budget: **$0/month.** Every service used here has a free tier that this site
sits comfortably inside.

---

## THE THREE THINGS YOU CARRY BACK TO THE GAME CHAT

Fill these in as you go. At the end, paste this block into the game chat.

```
SITE URL:      https://nenxhorizon.vercel.app
API ENDPOINT:  https://nenxhorizon.vercel.app/api/register
SECRET KEY:    <in the chat, and on your Launch Sequence page>
```

**The secret key is deliberately not written in this file.** This file gets
uploaded to GitHub where anyone can read it, so the key stays out of it. Copy
the key from the chat or from your Launch Sequence page each time you need it.
It belongs in exactly two places: Vercel's Environment Variables screen, and
the game's server script.

---

## WHAT YOU ARE BUILDING

Three free accounts, wired together once:

| Service  | What it does for you              | Cost |
| -------- | --------------------------------- | ---- |
| GitHub   | Holds the website files           | Free |
| Supabase | The database of registered players| Free |
| Vercel   | Puts the site on the internet     | Free |

---

## STEP 1 — GITHUB (holds the files)

1. Go to **github.com** and click **Sign up**. Use your email, pick a username,
   confirm the code they email you.
2. On the top right click **+** → **New repository**.
3. Repository name: `nenxhorizon`
4. Leave it **Public**. There are no secrets inside these files, so public is
   safe and makes everything else simpler.
5. Do **not** tick "Add a README file".
6. Click **Create repository**.
7. On the page that appears, click the link **uploading an existing file**.
8. Unzip the folder I sent you. Open it. Select **everything inside it**
   (Cmd+A), and drag it all onto the GitHub page. Folders are allowed.
9. Wait for every file to finish uploading, then click **Commit changes**.

You should now see `index.html`, `guide.html`, `board.html`, `registry.html`,
plus the `api`, `assets` and `data` folders listed in your repository.

---

## STEP 2 — SUPABASE (the database)

1. Go to **supabase.com** and click **Start your project**.
2. Choose **Continue with GitHub** so you do not need another password.
3. Click **New project**.
   - Name: `nenxhorizon`
   - Database Password: click **Generate a password**, then
     **save it somewhere safe**. You will probably never need it, but there is
     no way to see it again later.
   - Region: pick the one closest to you.
4. Click **Create new project** and wait about two minutes while it builds.
5. In the left sidebar click **SQL Editor**, then **New query**.
6. Open the file `supabase-setup.sql` from the folder I sent you, copy the whole
   thing, paste it into the editor, and click **Run**.
   You should see "Success. No rows returned". That is the correct answer.
7. In the left sidebar click **Table Editor**. You should now see a table called
   **players**. It is empty. Good.

### Now collect two values

8. Go to **Settings** (the gear, bottom of the sidebar) → **API Keys**.
   - Copy the key that starts with `sb_secret_`. This is your **secret key**.
   - If you do not see one, click the **Legacy API Keys** tab and copy the
     `service_role` key instead. Either one works.
9. Go to **Settings** → **Data API** (some accounts call it just **API**).
   - Copy the **Project URL**. It looks like
     `https://abcdefghijklm.supabase.co`.

> **The secret key is a master key to your database. Never paste it into a
> Discord message, a screenshot, a video, or any of the website files.** It only
> ever goes into Vercel's settings screen in the next step.

---

## STEP 3 — VERCEL (puts it on the internet)

1. Go to **vercel.com** and click **Sign Up**. Choose **Continue with GitHub**
   and approve the access it asks for.
2. Click **Add New...** → **Project**.
3. Find `nenxhorizon` in the list and click **Import**.
4. Change **Project Name** to `nenxhorizon`. This is what decides your web
   address, so get it right here.
5. Leave **Framework Preset** as **Other**. Leave every build setting empty.
6. Open the **Environment Variables** section and add these three, one at a
   time. Name on the left, value on the right, click **Add** after each.

   | Name                   | Value                                              |
   | ---------------------- | -------------------------------------------------- |
   | `SUPABASE_URL`         | the Project URL you copied from Supabase            |
   | `SUPABASE_SERVICE_KEY` | the secret key you copied from Supabase             |
   | `NENX_KEY`             | your secret key, from the chat or Launch Sequence    |

   Check for stray spaces at the start or end of each value. A space is the
   single most common reason this does not work first try.

7. Click **Deploy** and wait about a minute.
8. When it finishes, your site is live at **https://nenxhorizon.vercel.app**

If that name was already taken, Vercel will have given you something slightly
different. Whatever address it shows you is your real one, and it replaces
`nenxhorizon.vercel.app` everywhere in this document.

---

## STEP 4 — TEST THAT THE REGISTRY WORKS

You are going to pretend to be the game, and see yourself appear on the wall.

1. On your Mac press **Cmd + Space**, type `Terminal`, press **Enter**.
2. Copy the whole block below, paste it into Terminal, press **Enter**.

```bash
curl -X POST https://nenxhorizon.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -H "x-nenx-key: PASTE_YOUR_SECRET_KEY_HERE" \
  -d '{"userId":716768216,"username":"kingkerveu","displayName":"Kerv Kure","firstJoinAt":"2026-08-26T12:00:00Z"}'
```

3. Terminal should answer:

```
{"ok":true}
```

4. Open **https://nenxhorizon.vercel.app/registry** in your browser.
   You should see **SOULS WHO ENTERED: 1** and a card with your name on it.

That is the whole system working end to end.

**Run the command a second time.** You should still get `{"ok":true}` and the
count should still say **1**, not 2. That proves nobody can be double-written.

### If it did not work

| What Terminal said           | What it means                                          |
| ---------------------------- | ------------------------------------------------------ |
| `{"ok":false,"error":"bad_key"}` | `NENX_KEY` in Vercel does not match the key in the command. Usually a stray space. |
| `{"ok":false,"error":"server_not_configured"}` | One of the three environment variables is missing or misspelled. |
| `{"ok":false,"error":"db_write_failed"}` | The Supabase URL or secret key is wrong, or you have not run the SQL yet. |
| A 404 page                   | The web address is wrong, or the deploy has not finished. |

After changing an environment variable in Vercel you must redeploy for it to
take effect: **Deployments** → the top one → the **...** menu → **Redeploy**.

---

## STEP 5 — YOUR LINKS

Open `assets/js/links.js`. Put your real addresses between the quote marks:

```js
window.NENX_LINKS = {
  roblox:  "https://www.roblox.com/games/YOUR_GAME_ID",
  discord: "https://discord.gg/YOUR_INVITE",
  group:   "",
  youtube: ""
};
```

Any link you leave empty (`""`) makes that button quietly disappear from the
site, so you never end up with a dead button.

To update it: on GitHub open `assets/js/links.js` → the **pencil** icon →
edit → **Commit changes**. Vercel notices and rebuilds the site by itself in
under a minute. That is how you change anything on this site from now on.

---

## STEP 6 — SCREENSHOTS

Drop your images into `assets/img/` on GitHub using **exactly** these
filenames. Any file you have not added yet shows a neat labelled placeholder
instead, so the site never looks broken while you fill it in.

Every one of these should be **1600 × 900 pixels** (a normal widescreen
screenshot). JPG or PNG both work.

| Filename                       | What it should show                              |
| ------------------------------ | ------------------------------------------------ |
| `island-hero.jpg`              | Whale Island, ideally the port town              |
| `combat-hero.jpg`              | A big combat moment, a ragdoll launch            |
| `menu-character-creation.jpg`  | The character creation menu                      |
| `menu-clan-spin.jpg`           | A clan spin resolving                            |
| `combat-chain.jpg`             | Mid M1 chain                                     |
| `combat-parry.jpg`             | A parry landing                                  |
| `nen-meditation.jpg`           | Meditating to awaken nen                         |
| `nen-cards.jpg`                | A hand of three nen cards                        |
| `stats-panel.jpg`              | The stats screen with Total Power                |
| `styles-master.jpg`            | Sparring a fighting style master                 |
| `world-bandit-camp.jpg`        | A bandit camp                                    |
| `world-moons.jpg`              | Your nine moon phases                            |
| `world-climate.jpg`            | The climate gauge with a frost or heat veil      |
| `world-emotes.jpg`             | The emote wheel                                  |

To upload: on GitHub open the `assets/img` folder → **Add file** →
**Upload files** → drag them in → **Commit changes**.

---

## STEP 7 — EDITING THE ROADMAP

Open `data/board.js` on GitHub, click the pencil, and edit. Every card is a
block that looks like this:

```js
{
  title: "THE CLASH",
  cj:    "衝",
  desc:  "A locked freeze-frame struggle when two attacks meet.",
  tags:  ["combat", "hot"]
},
```

To move a card from **In progress** to **Done**, cut the whole block including
its comma and paste it into the `DONE:` list. Commit the change and the live
board updates by itself.

The tag `"hot"` makes the little label red, `"new"` makes it green. Everything
else is grey.

---

## REMINDERS

- **Turn on HTTP requests in Roblox Studio.** Game Settings → Security →
  **Allow HTTP Requests → ON**. Without this the game cannot talk to the
  website at all, and your logs will keep nagging you about it.
- **The site link cannot go inside the game.** Roblox cannot open external
  websites from a game, and it strips non-approved links out of descriptions.
  Put the link in your Discord, your group page, and your YouTube.
- **The secret key never goes in the website files, in Discord, or in a
  video.** It lives in Vercel's settings screen and in the game's server script.
- **Supabase pauses free projects that get no activity for a week.** This site
  has a daily keepalive built in (`api/keepalive.js`, run by Vercel once a day)
  so it stays awake by itself. If a project ever does get paused, open the
  Supabase dashboard and click **Resume project**. No data is lost.

---

## WHAT IS IN THIS FOLDER

```
index.html              home page
guide.html              the guide
board.html              the roadmap
registry.html           the wall of players
supabase-setup.sql      paste into Supabase once, at the start
vercel.json             settings for Vercel, including the daily keepalive
SETUP.md                this file

api/
  register.js           POST, the game calls this on a player's first join
  players.js            GET, feeds the registry wall
  keepalive.js          keeps the free database awake

assets/
  css/style.css         all the styling
  js/links.js           YOUR LINKS — edit this one
  js/site.js            shared behaviour
  js/board.js           draws the roadmap
  js/registry.js        draws the registry
  img/                  your screenshots go here

data/
  board.js              THE ROADMAP CONTENT — edit this one
```

The only two files you will ever want to edit are **`assets/js/links.js`** and
**`data/board.js`**.
