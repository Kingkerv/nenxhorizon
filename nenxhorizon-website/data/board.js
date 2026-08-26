/* ============================================================
   NENXHORIZON — THE ROADMAP BOARD
   ------------------------------------------------------------
   THIS IS THE FILE YOU EDIT TO MOVE CARDS AROUND.
   You do not need to touch board.html ever.

   HOW TO MOVE A CARD:
   Cut the whole { ... },  block and paste it into another list.
   The three lists are called DONE, DOING and PLANNED, further down.

   HOW TO ADD A CARD:
   Copy an existing { ... },  block, paste it, change the words.
   Keep the commas. Every card ends with a comma except you can
   leave the last one too, that is fine.

   A CARD LOOKS LIKE THIS:
   {
     title: "Name of the thing",      <- shows in bold
     cj:    "闘",                      <- optional kanji next to it, "" for none
     desc:  "One or two sentences.",  <- the grey text
     tags:  ["combat", "hot"]         <- optional little labels, [] for none
   },

   SPECIAL TAGS: "hot" turns the label red, "new" turns it green.
   ============================================================ */

window.NENX_BOARD = {

  /* ============================================================
     COLUMN 1 — DONE. In the game right now.
     ============================================================ */
  DONE: [
    {
      title: "Character creation",
      cj: "生",
      desc: "Six nameable slots. Gender, height, face mark and clan spins. Hair, skin, eyes, faces and traits. Redeem codes.",
      tags: ["menu"]
    },
    {
      title: "Clan bloodlines",
      cj: "血",
      desc: "Full rarity table down to Zoldyck at 0.05%.",
      tags: ["menu", "hot"]
    },
    {
      title: "The reactive mannequin",
      cj: "",
      desc: "Poke the preview model and he reacts. Angry, sad and surprised zones. Poke his feet and he gets sad.",
      tags: ["menu", "polish"]
    },
    {
      title: "Five-hit M1 chain",
      cj: "闘",
      desc: "Launcher and slam variants. Fifth hit ragdolls the victim across the map.",
      tags: ["combat"]
    },
    {
      title: "Air combos",
      cj: "",
      desc: "Launcher into air juggles into air slam. Dive slam from a double jump.",
      tags: ["combat"]
    },
    {
      title: "M2 heavy",
      cj: "",
      desc: "Telegraphed with a red glint, breaks raised guards, and can be feinted.",
      tags: ["combat"]
    },
    {
      title: "The defence suite",
      cj: "守",
      desc: "Block with a guard meter that chips and shatters, perfect block, parry on the bubble economy, dodge with i-frames, and perfect dodge into a counter.",
      tags: ["combat", "hot"]
    },
    {
      title: "Movement tech",
      cj: "",
      desc: "Dash-cancel out of M1 recovery, tech out of a launch with the jump button, wall splats with a crunch and crumple.",
      tags: ["combat"]
    },
    {
      title: "Aura burst",
      cj: "爆",
      desc: "Earned by taking hits, detonates you out of a combo. Parryable, and punishable on a whiff.",
      tags: ["combat"]
    },
    {
      title: "Ryu strike",
      cj: "流",
      desc: "Legendary card unlock. Click the exact instant a punch connects and the next one ignites at 1.5x with a screen crack. Also arms the perfect-block counter.",
      tags: ["combat", "hot"]
    },
    {
      title: "The ambush",
      cj: "暗",
      desc: "Crouch, behind, unseen. Three quarters of max health in a full execution animation. En sense can auto-slip it.",
      tags: ["combat"]
    },
    {
      title: "Nen awakening",
      cj: "念",
      desc: "Meditation for Hunters only, outside safe zones. Pre-nen meditation just whispers that something feels weird.",
      tags: ["nen"]
    },
    {
      title: "The six principles",
      cj: "六",
      desc: "Ten, Ren, Zetsu, Gyo, En and Ko. Five trainable levels each, summing into an F to SSS rank worn on the shoulder.",
      tags: ["nen"]
    },
    {
      title: "Nen cards",
      cj: "札",
      desc: "Around 56 cards. Every principle level-up deals three, you keep one forever. Common, rare and legendary, with legendaries about one hand in thirty.",
      tags: ["nen", "hot"]
    },
    {
      title: "Stats and Total Power",
      cj: "力",
      desc: "STR, DEF, AGI and STYLE capped at 50 with a soft cap at 40. Full power against NPCs, measured notches in PvP. TP as the one flex number.",
      tags: ["progression"]
    },
    {
      title: "The uncap",
      cj: "解",
      desc: "At max level, all-in one stat to 70 or split two to 60. Permanent.",
      tags: ["progression"]
    },
    {
      title: "Fighting styles",
      cj: "流",
      desc: "Karate live, with slots for Boxing, Muay Thai and Kickboxing. Ten difficulty rungs to the True Master, with enrage phases from LV7.",
      tags: ["progression"]
    },
    {
      title: "Intelligent bandits",
      cj: "賊",
      desc: "Self-rebuilding camps, morale and routs, leaders calling reinforcements, enrage phases, and reactions to your infamy.",
      tags: ["world", "hot"]
    },
    {
      title: "Grip and carry executions",
      cj: "",
      desc: "Pick up downed bodies and finish them.",
      tags: ["world"]
    },
    {
      title: "Day, night and nine moons",
      cj: "月",
      desc: "A full moon cycle using nine hand-made phases, including the red moon.",
      tags: ["world"]
    },
    {
      title: "Seasons, weather and climate",
      cj: "季",
      desc: "Four seasons at 95% spring, rain about one day in ten, winter blizzards, and a BotW-style climate gauge with hand-drawn frost and heat veils, shivering, heavy breathing and skin tints.",
      tags: ["world", "hot"]
    },
    {
      title: "Critterpedia",
      cj: "図",
      desc: "12 fish, 8 bugs and 6 fossils to catch and log. Plus cooking.",
      tags: ["world"]
    },
    {
      title: "Titles",
      cj: "名",
      desc: "Twenty titles to earn and wear.",
      tags: ["life"]
    },
    {
      title: "Gangs and infamy boards",
      cj: "組",
      desc: "Form a crew and share an infamy board.",
      tags: ["life"]
    },
    {
      title: "Emote wheel",
      cj: "顔",
      desc: "Chalk-drawn faces on the + key. Angry, ow, sad, wowis and question, each with real head choreography, VFX and voices.",
      tags: ["life"]
    },
    {
      title: "World sleep and the 40 minute legend",
      cj: "眠",
      desc: "Idle two minutes and you fall asleep, snoring. A 40 minute idle animation waits at the end, and the timer keeps counting while you sleep.",
      tags: ["life", "hot"]
    },
    {
      title: "Jenny economy",
      cj: "銭",
      desc: "Spar fees, spins, bandit bounties and fishing income.",
      tags: ["economy"]
    }
  ],

  /* ============================================================
     COLUMN 2 — IN PROGRESS. Being worked on right now.
     ============================================================ */
  DOING: [
    {
      title: "Animator's combat pack",
      cj: "描",
      desc: "Eight clips in production, plus the tech flip, the running attack and the Ryu punch.",
      tags: ["combat", "animation"]
    },
    {
      title: "THE CLASH",
      cj: "衝",
      desc: "A locked freeze-frame struggle when two attacks meet. Lands the moment the animation clips do.",
      tags: ["combat", "hot"]
    }
  ],

  /* ============================================================
     COLUMN 3 — PLANNED. Coming, not started.
     ============================================================ */
  PLANNED: [
    {
      title: "Bandit outpost models",
      cj: "砦",
      desc: "Proper built outposts instead of generic camps.",
      tags: ["world"]
    },
    {
      title: "Hatsu ability layer",
      cj: "発",
      desc: "Z, X and C ability kits. JAJANKEN and BIGBANG already exist as test kits.",
      tags: ["nen", "hot"]
    },
    {
      title: "Wanted posters",
      cj: "首",
      desc: "Infamy made visible in the world.",
      tags: ["world"]
    },
    {
      title: "TP milestone titles",
      cj: "位",
      desc: "Titles that unlock at Total Power thresholds.",
      tags: ["progression"]
    },
    {
      title: "En senses the hidden",
      cj: "円",
      desc: "En actively revealing players who are hiding in zetsu.",
      tags: ["nen"]
    },
    {
      title: "KO slow-mo",
      cj: "硬",
      desc: "A slow-motion moment on a Ko punch connecting.",
      tags: ["combat"]
    }
  ]

};
