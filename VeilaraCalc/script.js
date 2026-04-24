/* ============================================
   VEILARA — 5e CHARACTER CALCULATOR
   calculator.js — Game logic, data, DOM
   ============================================ */

// ── DATA ──────────────────────────────────────────────────────────────────

const RACES = {
  "Humanian": {
    asi: { str:1, dex:1, con:1, int:1, wis:1, cha:1 },
    speed: 30, size: "Medium",
    traits: [
      "Cosmic Adaptability: Gain proficiency in one skill of your choice"
    ],
    langs: ["Common", "+ 1 of choice"],
    subraces: {
      "Jovarite": {
        asi: {},
        traits: [
          "Steady Body: Advantage on saving throws to resist being knocked prone",
          "Heavy Presence: Disadvantage on Stealth in natural terrain"
        ]
      },
      "Venarine": {
        asi: {},
        traits: [
          "Toxin Resilience: Resistance to poison damage + advantage vs poisoned"
        ]
      }
    }
  },

  "Dwarken": {
    asi: { con:2, str:1 },
    speed: 25, size: "Medium", nat_armor: true,
    traits: [
      "Natural Armor: AC = 13 + DEX modifier (no armor required)",
      "Reinforced Frame: Reduce damage by CON mod once per long rest",
      "Heavy Frame: Difficult terrain costs +5 ft extra movement"
    ],
    langs: ["Common", "Dwarken"],
    subraces: {
      "Frost-Plate": {
        asi: { con:1 },
        traits: ["Cold Resistance: Resistance to cold damage"]
      },
      "Magma-Forged": {
        asi: { str:1 },
        traits: ["Fire Resistance: Resistance to fire damage"]
      }
    }
  },

  "Scallion": {
    asi: { dex:2, wis:1 },
    speed: 30, size: "Medium",
    traits: [
      "Stalker's Gait: Ignore movement penalties from plant-based terrain"
    ],
    langs: ["Common", "Scallion"],
    subraces: {
      "Raptoid": {
        asi: { dex:1 },
        traits: ["Swift Pursuit: +5 ft movement speed"],
        speed_bonus: 5
      },
      "Cera-Knight": {
        asi: { str:1 },
        traits: ["Plated Hide: +1 AC"],
        ac_bonus: 1
      }
    }
  },

  "Falenian": {
    asi: { str:2, con:1 },
    speed: 25, swim: 40, size: "Medium",
    traits: [
      "Deep Lungs: Can hold breath for 1 hour",
      "Echolocation: 30 ft blindsight while underwater only",
      "Crushing Grip: Proficiency in Athletics while underwater"
    ],
    langs: ["Common", "Falenia"],
    subraces: {
      "Current-Rider": {
        asi: { con:1 },
        traits: ["Bog Adaptation: Ignore difficult terrain from mud, swamp, or shallow water"]
      },
      "Abyss-Watcher": {
        asi: { str:1 },
        traits: ["Cold Resistance: Resistance to cold damage"]
      }
    }
  },

  "Hadroan": {
    asi: { wis:2, dex:1 },
    speed: 30, darkvision: 120, size: "Medium",
    traits: [
      "Darkvision: 120 ft",
      "Silent Stride: Proficiency in Stealth",
      "Sunlight Sensitivity: Disadvantage on sight-based Perception in bright sunlight"
    ],
    skills: ["Stealth"],
    langs: ["Common", "Hadroan"],
    subraces: {
      "Marsh-Strigid": {
        asi: { dex:1 },
        traits: ["Mask of the Wild: Can attempt to hide while lightly obscured"]
      },
      "Peak-Strigid": {
        asi: { wis:1 },
        traits: ["Keen Sight: Proficiency in Perception"],
        skills: ["Perception"]
      }
    }
  },

  "Tusker": {
    asi: { str:2, con:1 },
    speed: 25, ac_bonus: 1, size: "Medium",
    traits: [
      "Thick Hide: +1 AC",
      "Mass Authority: Count as one size larger for grappling, pushing, and carrying capacity",
      "Heavy Build: Disadvantage on Dexterity (Stealth) checks"
    ],
    langs: ["Common", "Tusker"],
    subraces: {
      "Veldt-Walker": {
        asi: { str:1 },
        traits: ["Open Stride: Ignore difficult terrain when moving in a straight line"]
      },
      "Crag-Keeper": {
        asi: { con:1 },
        traits: ["Bedrock Stance: +2 bonus on Strength saving throws while grounded"]
      }
    }
  },

  "Smiloborn": {
    asi: { str:2, con:1 },
    speed: 30, size: "Medium",
    traits: [
      "Natural Weapons: 1d6 + STR piercing damage",
      "Steady Nerve: Advantage on saving throws against being frightened",
      "Tenacity: Once per long rest, drop to 1 HP instead of 0"
    ],
    langs: ["Common", "Smiloborn"],
    subraces: {
      "Primal-Fang": {
        asi: { str:1 },
        traits: ["Scent Tracker: Advantage on Survival checks to track"]
      },
      "Code-Fang": {
        asi: { con:1 },
        traits: ["Protective Presence: Reaction — impose -2 on attack roll vs ally within 5 ft (1/long rest)"]
      }
    }
  },

  "Glimmer": {
    asi: { int:2, con:1 },
    speed: 30, size: "Medium",
    traits: [
      "Blindsight: 30 ft (blind beyond this range and while deafened)",
      "Structural Awareness: Proficiency in Investigation"
    ],
    skills: ["Investigation"],
    langs: ["Common", "Glimmer"],
    subraces: {
      "Canopy-Clipper": {
        asi: { dex:1 },
        traits: ["Climber: Climbing speed equals walking speed"]
      }
    }
  },

  "Lilliput": {
    asi: { dex:2, wis:1 },
    speed: 25, size: "Small",
    traits: [
      "Slip Through: Opportunity attacks against you have disadvantage",
      "People Sense: Proficiency in Insight"
    ],
    skills: ["Insight"],
    langs: ["Common", "Lilliput"],
    subraces: {
      "Meadow-Hopper": {
        asi: { dex:1 },
        traits: ["Chain Leap: Can make a second jump immediately after landing"]
      },
      "Hearth-Keeper": {
        asi: { wis:1 },
        traits: ["Emotional Read: Proficiency in Persuasion"],
        skills: ["Persuasion"]
      }
    }
  },

  "Elvian": {
    asi: { int:2, wis:1 },
    speed: 30, darkvision: 60, size: "Medium",
    traits: [
      "Darkvision: 60 ft",
      "Chronicle Mind: Proficiency in History",
      "Arcane Discipline: Advantage on saving throws against being charmed",
      "Memory Anchor: Once per long rest, reroll one INT or WIS check",
      "Frail Form: Disadvantage on Strength saving throws"
    ],
    skills: ["History"],
    langs: ["Common", "Elvish", "+ 1 of choice"],
    subraces: {
      "(None)": { asi: {}, traits: [] }
    }
  }
};

// ── CLASSES ───────────────────────────────────────────────────────────────

const CLASSES = {
  "Fighter": {
    hd: 10, saves: ["str","con"], skillCount: 2,
    skills: ["Athletics","Acrobatics","Animal Handling","History","Insight","Intimidation","Perception","Survival"],
    armor: "Light, medium, heavy armor; shields",
    weapons: "Simple and martial weapons",
    features: [
      "Fighting Style: +1 to attack rolls / +1 AC / +2 melee damage (choose one)",
      "Second Wind: Regain 1d10 + level HP (bonus action, 1/short rest)"
    ]
  },
  "Barbarian": {
    hd: 12, saves: ["str","con"], skillCount: 2,
    skills: ["Animal Handling","Athletics","Intimidation","Nature","Perception","Survival"],
    armor: "Light and medium armor; shields",
    weapons: "Simple and martial weapons",
    features: [
      "Rage: Resistance to BPS damage + bonus melee damage (bonus action, 2/long rest)"
    ]
  },
  "Rogue": {
    hd: 8, saves: ["dex","int"], skillCount: 4,
    skills: ["Acrobatics","Athletics","Deception","Insight","Intimidation","Investigation","Perception","Performance","Persuasion","Sleight of Hand","Stealth"],
    armor: "Light armor",
    weapons: "Simple weapons, hand crossbows, longswords, rapiers, shortswords",
    features: [
      "Sneak Attack: Extra damage when you have advantage or an ally is within 5 ft of target",
      "Cunning Action: Dash, Disengage, or Hide as a bonus action"
    ]
  },
  "Monk": {
    hd: 8, saves: ["str","dex"], skillCount: 2,
    skills: ["Acrobatics","Athletics","History","Insight","Religion","Stealth"],
    armor: "None",
    weapons: "Simple weapons, shortswords",
    features: [
      "Martial Arts: After the Attack action, make one unarmed strike as a bonus action"
    ]
  },
  "Ranger": {
    hd: 10, saves: ["dex","wis"], skillCount: 3,
    skills: ["Animal Handling","Athletics","Insight","Investigation","Nature","Perception","Stealth","Survival"],
    armor: "Light and medium armor; shields",
    weapons: "Simple and martial weapons",
    features: [
      "Natural Explorer: Advantage on tracking and survival in natural environments"
    ],
    spellcast: { ability:"wis", type:"Half", startLv:2 }
  },
  "Paladin": {
    hd: 10, saves: ["wis","cha"], skillCount: 2,
    skills: ["Athletics","Insight","Intimidation","Medicine","Persuasion","Religion"],
    armor: "Light, medium, heavy armor; shields",
    weapons: "Simple and martial weapons",
    features: [
      "Lay on Hands: Heal a creature by touch from a pool of hit points (action)"
    ],
    spellcast: { ability:"cha", type:"Half", startLv:2 }
  },
  "Cleric": {
    hd: 8, saves: ["wis","cha"], skillCount: 2,
    skills: ["History","Insight","Medicine","Persuasion","Religion"],
    armor: "Light and medium armor; shields",
    weapons: "Simple weapons",
    features: [],
    spellcast: { ability:"wis", type:"Full", startLv:1, cantrips:3 }
  },
  "Druid": {
    hd: 8, saves: ["wis","dex"], skillCount: 2,
    skills: ["Arcana","Animal Handling","Insight","Medicine","Nature","Perception","Survival"],
    armor: "Light and medium armor (non-metal); shields",
    weapons: "Simple weapons",
    features: [],
    spellcast: { ability:"wis", type:"Full", startLv:1, cantrips:2 }
  },
  "Wizard": {
    hd: 6, saves: ["int","wis"], skillCount: 2,
    skills: ["Arcana","History","Insight","Investigation","Medicine","Religion"],
    armor: "None",
    weapons: "Simple weapons",
    features: [],
    spellcast: { ability:"int", type:"Full", startLv:1, cantrips:3 }
  },
  "Sorcerer": {
    hd: 6, saves: ["con","cha"], skillCount: 2,
    skills: ["Arcana","Deception","Insight","Intimidation","Persuasion"],
    armor: "None",
    weapons: "Simple weapons",
    features: [],
    spellcast: { ability:"cha", type:"Full", startLv:1, cantrips:4 }
  },
  "Warlock": {
    hd: 8, saves: ["wis","cha"], skillCount: 2,
    skills: ["Arcana","Deception","History","Intimidation","Investigation","Religion"],
    armor: "Light armor",
    weapons: "Simple weapons",
    features: [],
    spellcast: { ability:"cha", type:"Pact", startLv:1, cantrips:2, shortRest:true }
  },
  "Bard": {
    hd: 8, saves: ["dex","cha"], skillCount: 3,
    skills: ["All"],
    armor: "Light armor",
    weapons: "Simple weapons",
    features: [
      "Bardic Inspiration: Give an ally a die to add to a future roll (bonus action)"
    ],
    spellcast: { ability:"cha", type:"Full", startLv:1, cantrips:2 }
  },
  "Artificer": {
    hd: 8, saves: ["con","int"], skillCount: 2,
    skills: ["Arcana","History","Investigation","Medicine","Nature","Perception","Sleight of Hand"],
    armor: "Light and medium armor; shields",
    weapons: "Simple weapons",
    features: [
      "Magic Tinkering: Create small magical effects using tools (action)"
    ],
    spellcast: { ability:"int", type:"Half", startLv:1 }
  }
};

// ── BACKGROUNDS ───────────────────────────────────────────────────────────

const BACKGROUNDS = {
  "Veteran":     { skills:["Athletics","Intimidation"],         feature:"Rank: Military forces and militias recognize your experience." },
  "Warden":      { skills:["Perception","Insight"],             feature:"Authority: Commoners and guards cooperate when you show authority." },
  "Shadow":      { skills:["Deception","Stealth"],              feature:"Contact: A reliable criminal contact provides information or illicit access." },
  "Wayfinder":   { skills:["Survival","Perception"],            feature:"Safe Passage: Identify safer routes and avoid natural dangers during travel." },
  "Adept":       { skills:["Insight","Religion"],               feature:"Sanctuary: Temples and aligned orders offer basic shelter and aid." },
  "Scribe":      { skills:["History","Investigation"],          feature:"Research: You know where and how to locate information if it exists." },
  "Trader":      { skills:["Persuasion","Insight"],             feature:"Markets: Find buyers, sellers, and fair deals in most settlements." },
  "Artisan":     { skills:["Investigation","Persuasion"],       feature:"Guild: Craft networks provide lodging, work, and minor assistance." },
  "Laborer":     { skills:["Athletics","Survival"],             feature:"Work: Always find basic labor and simple shelter in settlements." },
  "Reclaimer":   { skills:["Investigation","Athletics"],        feature:"Salvage: Locate useful materials or minor valuables in ruins and debris." },
  "Outrider":    { skills:["Animal Handling","Survival"],       feature:"Relay: Secure mounts, directions, or minor assistance from outposts." },
  "Entertainer": { skills:["Performance","Acrobatics"],         feature:"Audience: Find places to perform and earn modest food and lodging." }
};

// ── SKILLS ────────────────────────────────────────────────────────────────

const ALL_SKILLS = [
  ["Acrobatics","dex"],  ["Animal Handling","wis"], ["Arcana","int"],
  ["Athletics","str"],   ["Deception","cha"],        ["History","int"],
  ["Insight","wis"],     ["Intimidation","cha"],     ["Investigation","int"],
  ["Medicine","wis"],    ["Nature","int"],            ["Perception","wis"],
  ["Performance","cha"], ["Persuasion","cha"],        ["Religion","int"],
  ["Sleight of Hand","dex"], ["Stealth","dex"],       ["Survival","wis"]
];

// ── SPELL SLOTS ───────────────────────────────────────────────────────────
// Index = level, values = [1st,2nd,3rd,4th,5th,6th,7th,8th,9th]

const SPELL_SLOTS = {
  Full: [
    null,
    [2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],
    [4,3,2,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],[4,3,3,1,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],
    [4,3,3,3,1,0,0,0,0],[4,3,3,3,2,0,0,0,0],[4,3,3,3,2,1,0,0,0],[4,3,3,3,2,1,0,0,0],
    [4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,1,0],[4,3,3,3,2,1,1,1,0],
    [4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]
  ],
  Half: [
    null,
    [0,0,0,0,0,0,0,0,0],[2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],
    [4,2,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],
    [4,3,2,0,0,0,0,0,0],[4,3,2,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],
    [4,3,3,1,0,0,0,0,0],[4,3,3,1,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],
    [4,3,3,3,1,0,0,0,0],[4,3,3,3,1,0,0,0,0],[4,3,3,3,2,0,0,0,0],[4,3,3,3,2,0,0,0,0]
  ],
  Pact: [
    null,
    [1,0,0,0,0,0,0,0,0],[2,0,0,0,0,0,0,0,0],[2,0,0,0,0,0,0,0,0],[2,0,0,0,0,0,0,0,0],
    [2,1,0,0,0,0,0,0,0],[2,2,0,0,0,0,0,0,0],[2,2,0,0,0,0,0,0,0],[2,2,0,0,0,0,0,0,0],
    [2,2,0,0,0,0,0,0,0],[2,2,0,0,0,0,0,0,0],[3,2,0,0,0,0,0,0,0],[3,2,0,0,0,0,0,0,0],
    [3,2,0,0,0,0,0,0,0],[3,2,0,0,0,0,0,0,0],[3,2,0,0,0,0,0,0,0],[3,2,0,0,0,0,0,0,0],
    [4,3,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0]
  ]
};

// ── HELPERS ───────────────────────────────────────────────────────────────

function mod(score)  { return Math.floor((score - 10) / 2); }
function fmtMod(m)   { return m >= 0 ? `+${m}` : String(m); }
function profBonus(lv) { return Math.floor((lv - 1) / 4) + 2; }

function getRaceData() {
  const rn  = document.getElementById('race').value;
  const srn = document.getElementById('subrace').value;
  const r   = RACES[rn];
  if (!r) return null;
  const sr = (r.subraces && r.subraces[srn]) ? r.subraces[srn] : {};
  return { race: r, subrace: sr, raceName: rn, subraceName: srn };
}

function getASI() {
  const rd = getRaceData();
  if (!rd) return {};
  const asi = { str:0, dex:0, con:0, int:0, wis:0, cha:0 };
  function addAsi(a) {
    if (!a) return;
    for (const k in a) {
      if (asi[k] !== undefined) asi[k] += a[k];
    }
  }
  addAsi(rd.race.asi);
  addAsi(rd.subrace.asi);
  return asi;
}

function getSpellSlotString(type, lv, startLv) {
  if (lv < startLv) return null;
  const table = SPELL_SLOTS[type];
  if (!table || !table[lv]) return null;
  const ordinals = ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th'];
  return table[lv]
    .map((s, i) => s > 0 ? `${s} ${ordinals[i]}-level` : null)
    .filter(Boolean).join(' &bull; ');
}

function animatePulse(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('pulse');
  void el.offsetWidth; // reflow
  el.classList.add('pulse');
}

// ── REACTIVE UPDATE ───────────────────────────────────────────────────────

function update() {
  const keys = ['str','dex','con','int','wis','cha'];
  const asi  = getASI();

  keys.forEach(s => {
    const base  = parseInt(document.getElementById('s_' + s).value) || 10;
    const bonus = asi[s] || 0;
    const total = base + bonus;
    const m     = mod(total);

    const bEl = document.getElementById('b_' + s);
    bEl.textContent = fmtMod(m);
    bEl.style.color = m >= 0 ? 'var(--blue)' : 'var(--red)';

    const rEl = document.getElementById('r_' + s);
    rEl.textContent = bonus > 0 ? `+${bonus} racial` : '';

    document.getElementById('t_' + s).textContent = total;
  });

  // Racial info bar
  const rd = getRaceData();
  const rb = document.getElementById('racial-info');
  if (rd) {
    const parts = [];
    const combined = {};
    const applyAsi = (a) => {
      if (!a) return;
      for (const k in a) { combined[k] = (combined[k] || 0) + a[k]; }
    };
    applyAsi(rd.race.asi);
    applyAsi(rd.subrace.asi);
    for (const k in combined) {
      if (combined[k]) parts.push(`+${combined[k]} ${k.toUpperCase()}`);
    }
    const speed   = (rd.race.speed || 30) + (rd.subrace.speed_bonus || 0);
    const swim    = rd.race.swim ? ` · Swim ${rd.race.swim} ft` : '';
    const dv      = rd.race.darkvision ? ` · Darkvision ${rd.race.darkvision} ft` : '';
    const size    = rd.race.size ? ` · Size: ${rd.race.size}` : '';
    rb.textContent = parts.length
      ? `Racial bonuses: ${parts.join(', ')} · Speed: ${speed} ft${swim}${dv}${size}`
      : `Speed: ${speed} ft${swim}${dv}${size}`;
  }
}

// ── POPULATE DROPDOWNS ────────────────────────────────────────────────────

function populateRaces() {
  const sel = document.getElementById('race');
  sel.innerHTML = '';
  Object.keys(RACES).forEach(r => {
    const o = document.createElement('option');
    o.value = r; o.textContent = r;
    sel.appendChild(o);
  });
  sel.onchange = () => { populateSubraces(); populateClassSkills(); update(); };
  populateSubraces();
}

function populateSubraces() {
  const rn  = document.getElementById('race').value;
  const r   = RACES[rn];
  const sel = document.getElementById('subrace');
  sel.innerHTML = '';
  if (r && r.subraces) {
    Object.keys(r.subraces).forEach(sr => {
      const o = document.createElement('option');
      o.value = sr; o.textContent = sr;
      sel.appendChild(o);
    });
  }
  sel.onchange = () => { updateRaceSkills(); update(); };
  updateRaceSkills();
  update();
}

function populateClasses() {
  const sel = document.getElementById('cls');
  sel.innerHTML = '';
  Object.keys(CLASSES).forEach(c => {
    const o = document.createElement('option');
    o.value = c; o.textContent = c;
    sel.appendChild(o);
  });
  sel.onchange = () => populateClassSkills();
}

function populateBackgrounds() {
  const sel = document.getElementById('bg');
  sel.innerHTML = '';
  Object.keys(BACKGROUNDS).forEach(b => {
    const o = document.createElement('option');
    o.value = b; o.textContent = b;
    sel.appendChild(o);
  });
  sel.onchange = () => updateBgSkills();
  updateBgSkills();
}

function updateBgSkills() {
  const bn = document.getElementById('bg').value;
  const bg = BACKGROUNDS[bn];
  const el = document.getElementById('bg-skills-display');
  if (bg) {
    el.innerHTML = bg.skills.map(s => `<div>&#x2713; ${s}</div>`).join('');
  }
}

function updateRaceSkills() {
  const rd  = getRaceData();
  const el  = document.getElementById('race-skills-display');
  if (!rd) { el.innerHTML = ''; return; }
  const allRaceSkills = [
    ...(rd.race.skills || []),
    ...(rd.subrace.skills || [])
  ];
  if (allRaceSkills.length) {
    el.innerHTML = '<div style="font-size:10px;color:var(--text-faint);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px;margin-top:8px;">Racial Skills (auto)</div>'
      + allRaceSkills.map(s => `<div>&#x2713; ${s}</div>`).join('');
  } else {
    el.innerHTML = '';
  }
}

// ── CLASS SKILLS ──────────────────────────────────────────────────────────

let selectedClassSkills = new Set();

function populateClassSkills() {
  const cn  = document.getElementById('cls').value;
  const cls = CLASSES[cn];
  if (!cls) return;

  selectedClassSkills = new Set();
  const container = document.getElementById('class-skill-checks');
  container.innerHTML = '';

  const badge = document.getElementById('pick-badge');
  badge.textContent = `Pick ${cls.skillCount}`;

  const skillList = cls.skills[0] === 'All'
    ? ALL_SKILLS.map(s => s[0])
    : cls.skills;

  skillList.forEach(sk => {
    const div = document.createElement('div');
    div.className = 'chk-item';

    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.id = 'csk_' + sk; cb.value = sk;
    cb.onchange = () => {
      if (cb.checked) {
        if (selectedClassSkills.size >= cls.skillCount) { cb.checked = false; return; }
        selectedClassSkills.add(sk);
      } else {
        selectedClassSkills.delete(sk);
      }
      const rem = cls.skillCount - selectedClassSkills.size;
      badge.textContent = rem > 0 ? `Pick ${rem} more` : 'Full ✓';
    };

    const lbl = document.createElement('label');
    lbl.htmlFor = 'csk_' + sk;
    lbl.textContent = sk;

    div.appendChild(cb);
    div.appendChild(lbl);
    container.appendChild(div);
  });
}

// ── RANDOMIZE ─────────────────────────────────────────────────────────────

function randomize() {
  function roll4d6() {
    const d = Array.from({ length: 4 }, () => Math.ceil(Math.random() * 6));
    d.sort((a, b) => a - b);
    return d.slice(1).reduce((a, b) => a + b, 0);
  }

  const rolls = Array.from({ length: 6 }, () => roll4d6()).sort((a, b) => b - a);
  const keys  = ['str','dex','con','int','wis','cha'];

  keys.forEach((s, i) => {
    const el = document.getElementById('s_' + s);
    el.value = rolls[i];
    animatePulse('s_' + s);
  });

  update();

  const btn = document.getElementById('rand-btn');
  btn.textContent = '⚄ Rolled!';
  setTimeout(() => btn.textContent = '⚄ Randomize (4d6 drop lowest)', 1400);
}

// ── CALCULATE ─────────────────────────────────────────────────────────────

function calculate() {
  const lv  = Math.max(1, Math.min(20, parseInt(document.getElementById('lvl').value) || 1));
  const cn  = document.getElementById('cls').value;
  const bn  = document.getElementById('bg').value;
  const cls = CLASSES[cn];
  const bg  = BACKGROUNDS[bn];
  const rd  = getRaceData();
  if (!rd || !cls) return;

  const { race, subrace } = rd;
  const prof = profBonus(lv);

  // Raw scores
  const raw = {
    str: parseInt(document.getElementById('s_str').value) || 10,
    dex: parseInt(document.getElementById('s_dex').value) || 10,
    con: parseInt(document.getElementById('s_con').value) || 10,
    int: parseInt(document.getElementById('s_int').value) || 10,
    wis: parseInt(document.getElementById('s_wis').value) || 10,
    cha: parseInt(document.getElementById('s_cha').value) || 10
  };

  const asi   = getASI();
  const stats = {};
  const mods  = {};
  ['str','dex','con','int','wis','cha'].forEach(s => {
    stats[s] = raw[s] + (asi[s] || 0);
    mods[s]  = mod(stats[s]);
  });

  // ── HP ──
  const hpFirst = cls.hd + mods.con;
  const hpPerLv = Math.floor(cls.hd / 2) + 1 + mods.con;
  const hp      = Math.max(1, hpFirst + (lv - 1) * hpPerLv);

  // ── AC ──
  let ac     = 10 + mods.dex;
  let acNote = '';
  if (race.nat_armor) {
    const natAC = 13 + mods.dex;
    if (natAC > ac) { ac = natAC; acNote = 'Natural Armor'; }
  }
  const acBonus = (race.ac_bonus || 0) + (subrace.ac_bonus || 0);
  ac += acBonus;
  if (acBonus && !acNote) acNote = subrace.ac_bonus ? 'Plated Hide' : 'Thick Hide';
  else if (acBonus && acNote) acNote += ' + ' + (subrace.ac_bonus ? 'Plated Hide' : 'Thick Hide');

  // ── SPEED ──
  const speed   = (race.speed || 30) + (subrace.speed_bonus || 0);
  const spdNote = race.swim ? `Swim ${race.swim} ft` : '';

  // ── OTHER ──
  const init = mods.dex;
  const allProfSkills = new Set([
    ...selectedClassSkills,
    ...(bg ? bg.skills : []),
    ...(race.skills || []),
    ...(subrace.skills || [])
  ]);
  const percProf = allProfSkills.has('Perception');
  const pp = 10 + mods.wis + (percProf ? prof : 0);

  // ── SET VITALS ──
  setText('r-hp',      hp);
  setText('r-ac',      ac);
  setText('r-ac-note', acNote);
  setText('r-prof',    fmtMod(prof));
  setText('r-spd',     speed + ' ft');
  setText('r-spd-note',spdNote);
  setText('r-init',    fmtMod(init));
  setText('r-pp',      pp);
  setText('lvl-badge', `Level ${lv}`);

  // ── SCORES TABLE ──
  const scBody = document.getElementById('scores-body');
  scBody.innerHTML = '';
  const statLabels = { str:'STR', dex:'DEX', con:'CON', int:'INT', wis:'WIS', cha:'CHA' };
  ['str','dex','con','int','wis','cha'].forEach((s, idx) => {
    const isProfSave = cls.saves.includes(s);
    const saveVal    = mods[s] + (isProfSave ? prof : 0);
    const tr = document.createElement('tr');
    tr.style.animationDelay = `${idx * 0.04}s`;
    tr.classList.add('shimmer');
    tr.innerHTML = `
      <td>${statLabels[s]}</td>
      <td>${stats[s]}</td>
      <td class="${mods[s] >= 0 ? 'mod-pos' : 'mod-neg'}">${fmtMod(mods[s])}</td>
      <td>${fmtMod(saveVal)}${isProfSave ? ' <span class="save-dot">●</span>' : ''}</td>`;
    scBody.appendChild(tr);
  });

  // ── SKILLS LIST ──
  const skillsOut = document.getElementById('skills-output');
  skillsOut.innerHTML = '';
  ALL_SKILLS.forEach(([sk, ab], idx) => {
    const p   = allProfSkills.has(sk);
    const val = mods[ab] + (p ? prof : 0);
    const div = document.createElement('div');
    div.className = 'skill-row' + (p ? ' proficient' : '');
    div.style.animationDelay = `${idx * 0.025}s`;
    div.classList.add('shimmer');
    div.innerHTML = `
      <div class="skill-left">
        <div class="skill-dot-small${p ? ' prof' : ''}"></div>
        <span class="skill-name">${sk}</span>
        <span class="skill-attr">&nbsp;${ab.toUpperCase()}</span>
      </div>
      <span class="skill-val">${fmtMod(val)}</span>`;
    skillsOut.appendChild(div);
  });

  // ── TRAITS ──
  const traitsDiv = document.getElementById('traits-display');
  traitsDiv.innerHTML = '';
  const allTraits = [
    ...(race.traits || []),
    ...(subrace.traits || []),
    ...(cls.features || [])
  ];
  allTraits.forEach((t, idx) => {
    const div = document.createElement('div');
    div.className = 'trait-item shimmer';
    div.style.animationDelay = `${idx * 0.05}s`;
    div.innerHTML = `<div class="trait-dot"></div><span>${t}</span>`;
    traitsDiv.appendChild(div);
  });

  // ── SPELLCASTING ──
  const spellDiv = document.getElementById('spell-info');
  if (cls.spellcast && lv >= cls.spellcast.startLv) {
    const sc       = cls.spellcast;
    const spellAtk = mods[sc.ability] + prof;
    const saveDC   = 8 + mods[sc.ability] + prof;
    const slotStr  = getSpellSlotString(sc.type, lv, sc.startLv);
    const abilName = sc.ability.toUpperCase();
    let html = `<strong>Spellcasting</strong> &bull; Ability: ${abilName} &bull; Attack Bonus: ${fmtMod(spellAtk)} &bull; Save DC: ${saveDC}`;
    if (sc.cantrips) html += ` &bull; Cantrips: ${sc.cantrips}`;
    if (slotStr)     html += `<br>Spell Slots: ${slotStr}`;
    if (sc.shortRest) html += ` &bull; <em>Slots recover on Short Rest</em>`;
    spellDiv.innerHTML = html;
    spellDiv.style.display = '';
  } else {
    spellDiv.style.display = 'none';
  }

  // ── SHOW RESULTS ──
  const results = document.getElementById('results');
  results.style.display = 'flex';
  results.style.animation = 'none';
  void results.offsetWidth;
  results.style.animation = '';

  setTimeout(() => {
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 60);
}

// ── UTILITY ───────────────────────────────────────────────────────────────

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ── INIT ──────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  populateRaces();
  populateClasses();
  populateBackgrounds();
  populateClassSkills();
  updateRaceSkills();
  update();

  ['str','dex','con','int','wis','cha'].forEach(s => {
    document.getElementById('s_' + s).addEventListener('input', update);
  });
  document.getElementById('lvl').addEventListener('input', update);
});