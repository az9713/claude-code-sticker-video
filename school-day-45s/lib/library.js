// Reusable library (the host's step 3) for "A School Day": sets, props, sticker boy, effects, clock badge.
// Every piece is called by name, e.g. boy.pop(tl, 3) or sets.classroom(stage, { board: "SCIENCE" }).
// Follows style-bible.md. Scenes must use only this file.
(function () {
  const STYLE = {
    ink: "#2b2420", paper: "#fff8ec", sweater: "#8c8783",
    skyDawn: "#ffd6a8", skyDay: "#a8dcf2", skyDusk: "#f7a983", skyNight: "#22305c",
    wallBlue: "#cfe6f7", wallCream: "#fde9bd", wallMint: "#d6f0d2", wallMintDark: "#bfe3b9",
    wallRose: "#f9d8cf", wallLilac: "#e4dcf7",
    wood: "#d6995f", woodDark: "#b0733f", grass: "#93d36c", grassDark: "#6db44d",
    red: "#ef5b4c", yellow: "#ffc93c", teal: "#3fbfb0", orange: "#ff9a3c", pink: "#ff8fb1", purple: "#9b7be0",
    board: "#2f5d4e", glow: "#fff3b0", night: "#0d1330",
    line: 6, detail: 4,
  };
  const S = STYLE;
  const NS = "http://www.w3.org/2000/svg";
  const ol = (w = S.line) => `stroke="${S.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const font = (size, weight = 800) => `font-family="system-ui, sans-serif" font-weight="${weight}" font-size="${size}"`;
  let uid = 0;

  // ---------- STAGE: one per scene. back (set) -> boy slot -> front (foreground props) -> fx ----------
  function stage(section) {
    const cam = document.createElement("div");
    cam.className = "cam";
    const svg = () => {
      const s = document.createElementNS(NS, "svg");
      s.setAttribute("viewBox", "0 0 1920 1080");
      s.setAttribute("class", "layer");
      return s;
    };
    const back = svg(), front = svg(), fx = svg();
    const slot = document.createElement("div");
    slot.className = "layer";
    cam.append(back, slot, front, fx);
    section.appendChild(cam);
    return { cam, back, slot, front, fx, section };
  }
  function add(svg, markup) {
    const g = document.createElementNS(NS, "g");
    g.innerHTML = markup;
    svg.appendChild(g);
    return g;
  }
  // Animated props: outer <g> places them, inner [data-name] is what GSAP moves.
  const place = (name, x, y, inner) => `<g transform="translate(${x} ${y})"><g data-name="${name}">${inner}</g></g>`;
  const refs = (st) => {
    const r = {};
    [st.back, st.front, st.fx].forEach((s) => s.querySelectorAll("[data-name]").forEach((el) => (r[el.dataset.name] = el)));
    return r;
  };

  // ---------- SHAPES ----------
  function starPath(r) {
    let d = "";
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
      d += (i ? "L" : "M") + (rr * Math.cos(a)).toFixed(1) + " " + (rr * Math.sin(a)).toFixed(1);
    }
    return d + "Z";
  }
  const heartPath = (s) => `M0 ${0.9 * s} C${-1.6 * s} ${-0.1 * s} ${-0.8 * s} ${-1.4 * s} 0 ${-0.55 * s} C${0.8 * s} ${-1.4 * s} ${1.6 * s} ${-0.1 * s} 0 ${0.9 * s}Z`;
  const cloud = (x, y, s = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M-90 30 q-10 -45 35 -48 q15 -45 65 -30 q40 -25 70 15 q40 0 35 40 q0 23 -25 23 h-160 q-30 0 -20 0z" fill="${S.paper}" ${ol()}/>`;
  function window_(p, x, y, w, h, sky, inside) {
    return `<clipPath id="${p}-win"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/></clipPath>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${sky}"/>
      <g clip-path="url(#${p}-win)">${inside}</g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="none" ${ol()}/>
      <path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" fill="none" ${ol()}/>
      <rect x="${x - 24}" y="${y + h - 4}" width="${w + 48}" height="26" rx="8" fill="${S.paper}" ${ol()}/>`;
  }
  const floor = (y, fill) => `<rect x="-20" y="${y}" width="1960" height="${1100 - y}" fill="${fill}" ${ol()}/>
    <rect x="-20" y="${y - 22}" width="1960" height="24" fill="${S.paper}" ${ol()}/>`;

  // ---------- PROPS ----------
  const props = {
    alarmClock: () => `
      <path d="M-58 -112 l-22 -22 M58 -112 l22 -22" ${ol()}/>
      <circle cx="-48" cy="-118" r="22" fill="${S.yellow}" ${ol()}/><circle cx="48" cy="-118" r="22" fill="${S.yellow}" ${ol()}/>
      <path d="M-40 -6 l-14 10 M40 -6 l14 10" ${ol()}/>
      <circle cx="0" cy="-66" r="62" fill="${S.red}" ${ol()}/>
      <circle cx="0" cy="-66" r="44" fill="${S.paper}" ${ol(S.detail)}/>
      <path d="M0 -66 V-96 M0 -66 L-22 -56" fill="none" ${ol(S.detail)}/>`,
    lamp: () => `
      <circle cx="0" cy="-150" r="230" fill="${S.glow}" opacity="0.55"/>
      <rect x="-50" y="-22" width="100" height="22" rx="8" fill="${S.woodDark}" ${ol()}/>
      <rect x="-10" y="-120" width="20" height="100" fill="${S.paper}" ${ol()}/>
      <path d="M-80 -110 L-50 -210 H50 L80 -110Z" fill="${S.yellow}" ${ol()}/>`,
    bus: () => `
      <rect x="0" y="0" width="560" height="180" rx="26" fill="${S.yellow}" ${ol()}/>
      ${[0, 1, 2, 3].map((i) => `<rect x="${30 + i * 100}" y="24" width="80" height="62" rx="10" fill="${S.skyDay}" ${ol(S.detail)}/>`).join("")}
      <rect x="440" y="24" width="90" height="120" rx="10" fill="${S.skyDay}" ${ol(S.detail)}/>
      <path d="M10 110 H430" ${ol(S.detail)}/>
      <text x="215" y="150" text-anchor="middle" fill="${S.ink}" ${font(30)}>SCHOOL BUS</text>
      <circle cx="120" cy="182" r="38" fill="${S.ink}"/><circle cx="120" cy="182" r="13" fill="${S.paper}"/>
      <circle cx="450" cy="182" r="38" fill="${S.ink}"/><circle cx="450" cy="182" r="13" fill="${S.paper}"/>`,
    volcano: () => `
      <ellipse cx="0" cy="0" rx="210" ry="22" fill="${S.paper}" ${ol()}/>
      <path d="M-170 0 L-48 -230 H48 L170 0Z" fill="${S.woodDark}" ${ol()}/>
      <path data-name="lavaDrip" opacity="0" d="M-48 -230 H48 L70 -170 q-12 22 -24 0 l-14 -26 q-12 40 -28 4 l-10 -20 q-14 30 -30 -2 z" fill="${S.red}" ${ol(S.detail)}/>
      <ellipse cx="0" cy="-230" rx="48" ry="14" fill="${S.red}" ${ol(S.detail)}/>`,
    testPaper: () => `
      <rect x="-170" y="-220" width="340" height="440" rx="12" fill="${S.paper}" ${ol()}/>
      ${[0, 1, 2, 3].map((i) => `<path d="M-120 ${-60 + i * 60} H70" stroke="${S.sweater}" stroke-width="${S.detail}" stroke-linecap="round"/>`).join("")}
      <text x="-120" y="-130" fill="${S.ink}" ${font(40, 700)}>Spelling</text>
      <text x="40" y="190" text-anchor="middle" fill="${S.red}" ${font(120)}>A+</text>
      <path transform="translate(120 -150)" d="${starPath(62)}" fill="${S.yellow}" ${ol()}/>`,
    ball: () => `<circle r="56" fill="${S.red}" ${ol()}/><path d="M-54 -10 q54 30 108 0" fill="none" stroke="${S.paper}" stroke-width="10"/>`,
    banner: (text) => `
      <rect x="-440" y="-80" width="880" height="160" rx="22" fill="${S.red}" ${ol()}/>
      <text x="0" y="34" text-anchor="middle" fill="${S.paper}" ${font(100)}>${text}</text>`,
    milkTray: () => `
      <path d="M-200 0 L-180 -50 H180 L200 0Z" fill="${S.paper}" ${ol()}/>
      <path d="M-130 -50 V-150 L-100 -180 L-70 -150 V-50Z" fill="${S.paper}" ${ol()}/>
      <rect x="-130" y="-130" width="60" height="44" fill="${S.teal}" ${ol(S.detail)}/>
      <circle cx="90" cy="-82" r="34" fill="${S.red}" ${ol()}/><path d="M90 -116 q6 -20 22 -24" fill="none" ${ol(S.detail)}/>`,
    amp: () => `
      <rect x="0" y="0" width="260" height="250" rx="16" fill="${S.ink}"/>
      <rect x="20" y="22" width="220" height="40" rx="6" fill="${S.yellow}"/>
      <circle cx="130" cy="160" r="70" fill="${S.sweater}" ${ol()}/><circle cx="130" cy="160" r="22" fill="${S.ink}"/>`,
    cake: () => `
      <ellipse cx="0" cy="0" rx="150" ry="26" fill="${S.paper}" ${ol()}/>
      <rect x="-110" y="-130" width="220" height="130" rx="16" fill="${S.pink}" ${ol()}/>
      <path d="M-110 -60 H110" stroke="${S.paper}" stroke-width="12"/>
      <path d="M-110 -110 q0 -20 20 -20 h180 q20 0 20 20 v14 q-18 20 -36 0 q-18 24 -36 0 q-18 24 -36 0 q-18 24 -36 0 q-18 24 -36 0 q-18 24 -40 0z" fill="${S.paper}" ${ol(S.detail)}/>
      <circle cx="0" cy="-150" r="24" fill="${S.red}" ${ol()}/><path d="M0 -174 q8 -26 30 -30" fill="none" ${ol(S.detail)}/>`,
  };

  // ---------- SETS ----------
  // Each set draws its back layer (behind the boy) and front layer (in front of the boy).
  const sets = {
    bedroom(st, { sky = "dawn" } = {}) {
      const p = "bed" + uid++;
      const night = sky === "night";
      const inside = night
        ? `<circle cx="1470" cy="250" r="60" fill="${S.paper}" ${ol()}/><circle cx="1500" cy="230" r="54" fill="${S.skyNight}"/>
           ${[[1250, 210], [1330, 420], [1540, 400], [1280, 330]].map(([x, y], i) => place("tw" + i, x, y, `<path d="${starPath(18)}" fill="${S.yellow}" ${ol(S.detail)}/>`)).join("")}`
        : `${place("sun", 1390, 520, `<circle r="80" fill="${S.yellow}" ${ol()}/>`)}${cloud(1290, 250, 0.7)}`;
      add(st.back, `
        <rect width="1920" height="1080" fill="${S.wallBlue}"/>
        ${floor(880, S.wood)}
        ${window_(p, 1180, 150, 420, 380, night ? S.skyNight : S.skyDawn, inside)}
        <rect x="190" y="180" width="250" height="310" rx="10" fill="${S.paper}" ${ol()}/>
        <path d="M315 230 q40 50 30 140 h-60 q-10 -90 30 -140z" fill="${S.red}" ${ol()}/>
        <circle cx="315" cy="300" r="18" fill="${S.skyDay}" ${ol(S.detail)}/>
        <path d="M290 370 l-20 50 l30 -20 M340 370 l20 50 l-30 -20" fill="${S.orange}" ${ol(S.detail)}/>
        <path transform="translate(240 230)" d="${starPath(16)}" fill="${S.yellow}" ${ol(S.detail)}/>
        <path transform="translate(395 440)" d="${starPath(14)}" fill="${S.yellow}" ${ol(S.detail)}/>
        <path d="M380 880 V600 q0 -50 50 -50 H1090 q50 0 50 50 V880" fill="${S.woodDark}" ${ol()}/>
        <rect x="470" y="660" width="320" height="120" rx="55" fill="${S.paper}" ${ol()}/>
        <rect x="1440" y="700" width="300" height="190" rx="10" fill="${S.wood}" ${ol()}/>
        <path d="M1440 790 H1740" ${ol(S.detail)}/><circle cx="1590" cy="840" r="10" fill="${S.ink}"/>
        ${night ? place("lamp", 1590, 700, props.lamp()) : place("alarm", 1590, 700, props.alarmClock())}`);
      add(st.front, `
        <path d="M330 1100 V880 q0 -50 50 -50 H1140 q50 0 50 50 V1100Z" fill="${S.teal}" ${ol()}/>
        <rect x="330" y="830" width="860" height="56" rx="24" fill="${S.paper}" ${ol()}/>
        ${[[450, 960], [640, 1020], [830, 950], [1020, 1030]].map(([x, y]) => `<path transform="translate(${x} ${y})" d="${starPath(22)}" fill="${S.yellow}" ${ol(S.detail)}/>`).join("")}`);
      return refs(st);
    },

    street(st) {
      add(st.back, `
        <rect width="1920" height="1080" fill="${S.skyDay}"/>
        <circle cx="1720" cy="140" r="80" fill="${S.yellow}" ${ol()}/>
        ${cloud(420, 150, 0.9)}${cloud(1050, 110, 0.7)}
        <path d="M1150 400 L1460 250 L1770 400Z" fill="${S.woodDark}" ${ol()}/>
        <rect x="1190" y="390" width="540" height="270" fill="${S.red}" ${ol()}/>
        <circle cx="1460" cy="330" r="36" fill="${S.paper}" ${ol()}/><path d="M1460 330 V306 M1460 330 H1478" ${ol(S.detail)}/>
        <rect x="1350" y="410" width="220" height="56" rx="8" fill="${S.paper}" ${ol(S.detail)}/>
        <text x="1460" y="452" text-anchor="middle" fill="${S.ink}" ${font(36)}>SCHOOL</text>
        ${[1230, 1300, 1600, 1670].map((x) => `<rect x="${x}" y="500" width="50" height="60" fill="${S.skyDay}" ${ol(S.detail)}/>`).join("")}
        <rect x="1410" y="540" width="100" height="120" fill="${S.yellow}" ${ol()}/>
        <path d="M1790 660 V250" ${ol()}/><path d="M1790 255 h90 l-20 30 l20 30 h-90z" fill="${S.yellow}" ${ol(S.detail)}/>
        <path d="M90 470 L230 380 L370 470Z" fill="${S.red}" ${ol()}/><rect x="110" y="465" width="240" height="195" fill="${S.teal}" ${ol()}/>
        <rect x="200" y="560" width="60" height="100" fill="${S.paper}" ${ol(S.detail)}/>
        <rect x="580" y="520" width="44" height="140" fill="${S.woodDark}" ${ol()}/><circle cx="602" cy="480" r="100" fill="${S.grassDark}" ${ol()}/>
        <rect x="-20" y="650" width="1960" height="130" fill="${S.grass}" ${ol()}/>
        <rect x="-20" y="780" width="1960" height="120" fill="${S.sweater}" ${ol()}/>
        ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${80 + i * 330} 840 h150" stroke="${S.paper}" stroke-width="10" stroke-linecap="round"/>`).join("")}
        ${place("bus", 0, 640, props.bus())}
        <rect x="-20" y="900" width="1960" height="200" fill="${S.paper}" ${ol()}/>
        ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${100 + i * 300} 900 l-60 180" ${ol(S.detail)}/>`).join("")}`);
      return refs(st);
    },

    classroom(st, { board = "SCIENCE", desk = true } = {}) {
      const letters = "ABCDEFGHIJK".split(""); // starts right of the clock badge
      const cols = [S.red, S.yellow, S.teal, S.orange, S.pink, S.purple];
      const doodles = board === "SCIENCE"
        ? `<g transform="translate(560 420)" fill="none" stroke="${S.paper}" stroke-width="6">
             <ellipse rx="110" ry="38"/><ellipse rx="110" ry="38" transform="rotate(60)"/><ellipse rx="110" ry="38" transform="rotate(-60)"/>
             <circle r="14" fill="${S.paper}"/></g>
           <path d="M1310 330 h60 M1325 330 v70 l-50 90 h130 l-50 -90 v-70" fill="none" stroke="${S.paper}" stroke-width="6" stroke-linejoin="round"/>`
        : `${["1. cat", "2. sun", "3. star"].map((w, i) => `<text x="1000" y="${350 + i * 70}" fill="${S.paper}" ${font(54, 700)}>${w}</text>`).join("")}
           <path d="M1260 330 l30 30 l60 -70" fill="none" stroke="${S.paper}" stroke-width="8" stroke-linecap="round"/>`;
      add(st.back, `
        <rect width="1920" height="1080" fill="${S.wallCream}"/>
        ${letters.map((l, i) => `<rect x="${620 + i * 116}" y="24" width="96" height="70" rx="10" fill="${cols[i % 6]}" ${ol(S.detail)}/>
          <text x="${668 + i * 116}" y="76" text-anchor="middle" fill="${S.ink}" ${font(44)}>${l}</text>`).join("")}
        ${floor(900, S.wood)}
        <rect x="250" y="120" width="1420" height="480" rx="12" fill="${S.wood}" ${ol()}/>
        <rect x="282" y="150" width="1356" height="420" fill="${S.board}" ${ol(S.detail)}/>
        <text x="960" y="250" text-anchor="middle" fill="${S.paper}" ${font(84)}>${board}</text>
        ${doodles}
        <rect x="230" y="590" width="1460" height="26" rx="8" fill="${S.woodDark}" ${ol()}/>`);
      if (desk) {
        add(st.front, `
          <rect x="150" y="868" width="1620" height="260" fill="${S.woodDark}" ${ol()}/>
          <rect x="120" y="830" width="1680" height="48" rx="12" fill="${S.wood}" ${ol()}/>
          ${place("volcano", 1400, 832, props.volcano())}`);
      }
      return refs(st);
    },

    playground(st) {
      add(st.back, `
        <rect width="1920" height="1080" fill="${S.skyDay}"/>
        <circle cx="1650" cy="150" r="78" fill="${S.yellow}" ${ol()}/>
        ${cloud(700, 160, 0.9)}${cloud(1200, 230, 0.6)}
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<rect x="${i * 170}" y="600" width="26" height="140" rx="6" fill="${S.paper}" ${ol(S.detail)}/>`).join("")}
        <path d="M-20 640 H1940 M-20 700 H1940" ${ol(S.detail)}/>
        <rect x="-20" y="740" width="1960" height="360" fill="${S.grass}" ${ol()}/>
        ${[[300, 860], [1200, 820], [1600, 980], [520, 1010]].map(([x, y]) => `<path d="M${x} ${y} l12 -30 l12 30 l12 -24 l12 24" fill="none" stroke="${S.grassDark}" stroke-width="6" stroke-linecap="round"/>`).join("")}
        <rect x="235" y="420" width="70" height="360" fill="${S.woodDark}" ${ol()}/>
        <circle cx="200" cy="390" r="130" fill="${S.grassDark}" ${ol()}/><circle cx="340" cy="330" r="140" fill="${S.grassDark}" ${ol()}/>
        <circle cx="300" cy="460" r="110" fill="${S.grassDark}" ${ol()}/>
        <path d="M1380 780 V420 M1470 780 V420" ${ol()}/>
        ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M1380 ${740 - i * 60} H1470" ${ol(S.detail)}/>`).join("")}
        <rect x="1360" y="400" width="140" height="30" rx="8" fill="${S.yellow}" ${ol()}/>
        <path d="M1495 410 q60 0 120 160 t160 210 h-60 q-80 -40 -120 -150 t-100 -170z" fill="${S.red}" ${ol()}/>
        ${place("ball", 1220, 950, props.ball())}`);
      return refs(st);
    },

    cafeteria(st, { banner = "PIZZA DAY!" } = {}) {
      const tiles = [];
      for (let x = 120; x < 1920; x += 120) tiles.push(`<path d="M${x} 0 V880" stroke="${S.wallMintDark}" stroke-width="${S.detail}"/>`);
      for (let y = 120; y < 880; y += 120) tiles.push(`<path d="M0 ${y} H1920" stroke="${S.wallMintDark}" stroke-width="${S.detail}"/>`);
      const flags = [];
      for (let i = 0; i < 14; i++) flags.push(`<path d="M${20 + i * 140} ${40 + (i % 2) * 6} l60 0 l-30 54z" fill="${[S.red, S.yellow, S.teal, S.pink][i % 4]}" ${ol(S.detail)}/>`);
      add(st.back, `
        <rect width="1920" height="1080" fill="${S.wallMint}"/>${tiles.join("")}
        <path d="M0 40 H1940" ${ol(S.detail)}/>${flags.join("")}
        <rect x="110" y="320" width="300" height="320" rx="10" fill="${S.board}" ${ol()}/>
        <text x="260" y="400" text-anchor="middle" fill="${S.paper}" ${font(48)}>MENU</text>
        ${["pizza", "salad", "milk"].map((w, i) => `<text x="150" y="${470 + i * 56}" fill="${S.paper}" ${font(38, 700)}>• ${w}</text>`).join("")}
        <rect x="1480" y="540" width="480" height="360" fill="${S.paper}" ${ol()}/>
        <rect x="1460" y="520" width="520" height="40" rx="8" fill="${S.sweater}" ${ol()}/>
        <ellipse cx="1590" cy="510" rx="70" ry="24" fill="${S.orange}" ${ol(S.detail)}/><ellipse cx="1780" cy="510" rx="70" ry="24" fill="${S.grass}" ${ol(S.detail)}/>
        ${floor(900, S.wood)}
        ${place("banner", 960, 230, props.banner(banner))}`);
      add(st.front, `
        <rect x="200" y="900" width="1520" height="220" fill="${S.teal}" ${ol()}/>
        <rect x="170" y="850" width="1580" height="56" rx="14" fill="${S.paper}" ${ol()}/>
        ${place("tray", 1430, 860, props.milkTray())}`);
      return refs(st);
    },

    musicRoom(st) {
      const p = "mus" + uid++;
      add(st.back, `
        <rect width="1920" height="1080" fill="${S.wallLilac}"/>
        ${window_(p, 170, 160, 360, 340, S.skyDay, `<circle cx="440" cy="300" r="60" fill="${S.yellow}" ${ol()}/>${cloud(280, 260, 0.6)}`)}
        <rect x="1240" y="150" width="230" height="300" rx="10" fill="${S.ink}"/>
        <path d="M1380 180 L1300 320 h60 l-40 110 l110 -160 h-62 l40 -90z" fill="${S.yellow}" ${ol(S.detail)}/>
        <rect x="1540" y="200" width="200" height="200" rx="10" fill="${S.paper}" ${ol()}/>
        <path transform="translate(1640 300)" d="${starPath(70)}" fill="${S.pink}" ${ol()}/>
        ${floor(890, S.woodDark)}
        <ellipse cx="900" cy="1000" rx="560" ry="70" fill="${S.orange}" ${ol()}/>
        ${place("amp", 1450, 650, props.amp())}`);
      return refs(st);
    },

    dining(st) {
      const p = "din" + uid++;
      const stripes = [];
      for (let x = 200; x < 1740; x += 80) stripes.push(`<rect x="${x}" y="905" width="40" height="200" fill="${S.paper}"/>`);
      add(st.back, `
        <rect width="1920" height="1080" fill="${S.wallRose}"/>
        ${window_(p, 1270, 170, 400, 360, S.skyDusk, `<circle cx="1470" cy="520" r="90" fill="${S.orange}" ${ol()}/>${cloud(1380, 270, 0.6)}`)}
        <rect x="230" y="200" width="260" height="230" rx="10" fill="${S.paper}" ${ol()}/>
        <path transform="translate(360 320)" d="${heartPath(56)}" fill="${S.red}" ${ol()}/>
        <circle cx="960" cy="230" r="190" fill="${S.glow}" opacity="0.55"/>
        <path d="M960 0 V120" ${ol()}/><path d="M880 200 L920 120 H1000 L1040 200Z" fill="${S.yellow}" ${ol()}/>
        ${floor(880, S.wood)}`);
      add(st.front, `
        <rect x="160" y="900" width="1600" height="220" fill="${S.red}" ${ol()}/>${stripes.join("")}
        <rect x="160" y="900" width="1600" height="220" fill="none" ${ol()}/>
        <rect x="130" y="850" width="1660" height="56" rx="14" fill="${S.paper}" ${ol()}/>
        <ellipse cx="380" cy="862" rx="130" ry="24" fill="${S.paper}" ${ol()}/><ellipse cx="380" cy="862" rx="80" ry="12" fill="none" ${ol(S.detail)}/>
        ${place("cake", 1460, 866, props.cake())}`);
      return refs(st);
    },
  };

  // ---------- FX (stars, hearts, notes, lava, words) ----------
  // Seeded positions (determinism rule: no Math.random).
  function rng(seed) {
    let s = seed >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }
  const fxShape = {
    star: () => `<path d="${starPath(34)}" fill="${S.yellow}" ${ol(S.detail)}/>`,
    heart: () => `<path d="${heartPath(30)}" fill="${S.red}" ${ol(S.detail)}/>`,
    note: () => `<ellipse cx="-14" cy="20" rx="20" ry="15" fill="${S.ink}" transform="rotate(-20 -14 20)"/><path d="M4 18 V-46 q20 6 30 26" fill="none" ${ol()}/>`,
    lava: (r) => `<circle r="${12 + r * 14}" fill="${[S.red, S.orange, S.yellow][Math.floor(r * 3)]}" ${ol(S.detail)}/>`,
    zzz: () => `<text text-anchor="middle" fill="${S.paper}" ${font(70)} stroke="${S.ink}" stroke-width="6" paint-order="stroke">Z</text>`,
  };
  // Returns the movable elements; each sits at (x, y) before it is animated.
  function fx(st, kind, x, y, count, seed = 1) {
    const r = rng(seed);
    const g = add(st.fx, Array.from({ length: count }, () => place("fx", x, y, fxShape[kind](r()))).join(""));
    return Array.from(g.querySelectorAll('[data-name="fx"]'));
  }
  // A loose prop in the fx layer (in front of the boy), e.g. prop(stage, "testPaper", 1380, 600, 8).
  function prop(st, name, x, y, rotate = 0) {
    const g = add(st.fx, `<g transform="translate(${x} ${y}) rotate(${rotate})"><g data-name="${name}">${props[name]()}</g></g>`);
    return g.querySelector(`[data-name="${name}"]`);
  }
  function word(st, text, x, y, fill = S.yellow, size = 90) {
    const g = add(st.fx, place("word", x, y, `
      <rect x="${-(text.length * size * 0.36 + 40)}" y="${-size * 0.75}" width="${2 * (text.length * size * 0.36 + 40)}" height="${size * 1.5}" rx="${size * 0.75}" fill="${fill}" ${ol()}/>
      <text y="${size * 0.35}" text-anchor="middle" fill="${S.ink}" ${font(size)}>${text}</text>`));
    return g.querySelector('[data-name="word"]');
  }

  // ---------- THE BOY (sticker cut-outs, never redrawn) ----------
  const STICKERS = {
    grumpy: [740, 680], peace: [746, 820], surprised: [724, 784], laugh: [706, 766], pizza: [688, 836],
    thumbs: [676, 816], guitar: [720, 852], hearts: [706, 784], sleepy: [772, 760],
  };
  // x = centre, bottom = y of the sticker's bottom edge, h = height on screen.
  function boy(st, name, { x, bottom, h }) {
    const [w0, h0] = STICKERS[name];
    const w = Math.round((w0 * h) / h0);
    const wrap = document.createElement("div");
    wrap.className = "boy";
    Object.assign(wrap.style, { left: x - w / 2 + "px", top: bottom - h + "px", width: w + "px", height: h + "px" });
    const img = document.createElement("img");
    img.src = `assets/stickers/${name}.png`;
    img.alt = `boy, ${name} sticker`;
    wrap.appendChild(img);
    st.slot.appendChild(wrap);
    return {
      el: wrap, img,
      // Enter: sticker slaps on (scale up with overshoot). Call once per boy.
      pop(tl, at) {
        tl.fromTo(img, { scale: 0.2, rotation: -10, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.45, ease: "back.out(2.2)" }, at);
        return this;
      },
      hop(tl, at, height = 50, times = 1) {
        tl.to(wrap, { y: -height, duration: 0.18, ease: "power2.out", yoyo: true, repeat: times * 2 - 1 }, at);
        return this;
      },
      squash(tl, at) {
        tl.to(wrap, { scaleY: 0.9, scaleX: 1.06, duration: 0.12, ease: "power1.out", yoyo: true, repeat: 1 }, at);
        return this;
      },
      wiggle(tl, at, deg = 5, times = 3) {
        tl.to(wrap, { rotation: deg, duration: 0.08, ease: "sine.inOut", yoyo: true, repeat: times * 2 - 1 }, at)
          .to(wrap, { rotation: 0, duration: 0.08 }, at + times * 0.16);
        return this;
      },
      sway(tl, at, dur, deg = 3) {
        const n = Math.max(1, Math.round(dur / 0.8));
        tl.fromTo(wrap, { rotation: -deg }, { rotation: deg, duration: dur / n, ease: "sine.inOut", yoyo: true, repeat: n - 1, immediateRender: false }, at);
        return this;
      },
    };
  }

  // ---------- UI: clock badge ----------
  const UI = {
    css: `
      .badge { position: absolute; left: 40px; top: 36px; display: flex; align-items: center; gap: 18px;
        padding: 14px 30px 14px 16px; background: ${S.paper}; border: 6px solid ${S.ink}; border-radius: 30px; }
      .badge-text { position: relative; width: 360px; height: 96px; }
      .badge-line { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; opacity: 0; }
      .badge-line b { font: 800 48px/1 system-ui, sans-serif; color: ${S.ink}; }
      .badge-line span { margin-top: 6px; font: 700 30px/1.1 system-ui, sans-serif; color: ${S.ink}; }
      .title-card { position: absolute; left: 0; right: 0; top: 120px; display: flex; justify-content: center; }
      .title-card div { padding: 22px 60px; background: ${S.paper}; border: 6px solid ${S.ink}; border-radius: 36px;
        font: 800 110px/1 system-ui, sans-serif; color: ${S.ink}; opacity: 0; }`,
    // items: [{ time: "7:00 AM", label: "Wake up", minutes: 420 }, ...]
    clockBadge(parent, items) {
      const ticks = Array.from({ length: 12 }, (_, i) => `<path d="M50 9 V16" transform="rotate(${i * 30} 50 50)" stroke="${S.ink}" stroke-width="4" stroke-linecap="round"/>`).join("");
      const el = document.createElement("div");
      el.className = "badge";
      el.innerHTML = `
        <svg width="96" height="96" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="${S.paper}" stroke="${S.ink}" stroke-width="6"/>${ticks}
          <path data-hand="h" d="M50 50 V27" stroke="${S.ink}" stroke-width="7" stroke-linecap="round"/>
          <path data-hand="m" d="M50 50 V15" stroke="${S.red}" stroke-width="5" stroke-linecap="round"/>
          <circle cx="50" cy="50" r="5" fill="${S.ink}"/>
        </svg>
        <div class="badge-text">${items.map((it) => `<div class="badge-line"><b>${it.time}</b><span>${it.label}</span></div>`).join("")}</div>`;
      parent.appendChild(el);
      const hh = el.querySelector('[data-hand="h"]'), mh = el.querySelector('[data-hand="m"]');
      const lines = el.querySelectorAll(".badge-line");
      const ang = (m) => ({ h: m * 0.5, m: (m - items[0].minutes) * 6 }); // cumulative, hands only go forward
      return {
        el,
        start(tl, at) {
          const a = ang(items[0].minutes);
          tl.set(hh, { rotation: a.h, svgOrigin: "50 50" }, 0).set(mh, { rotation: 0, svgOrigin: "50 50" }, 0);
          tl.fromTo(el, { y: -160 }, { y: 0, duration: 0.5, ease: "back.out(1.6)" }, at);
          tl.fromTo(lines[0], { opacity: 0 }, { opacity: 1, duration: 0.2 }, at + 0.1);
        },
        // Turn the hands to item i and swap the label.
        go(tl, at, i) {
          const a = ang(items[i].minutes);
          tl.to(hh, { rotation: a.h, svgOrigin: "50 50", duration: 0.6, ease: "power2.inOut" }, at)
            .to(mh, { rotation: a.m, svgOrigin: "50 50", duration: 0.6, ease: "power2.inOut" }, at)
            .to(lines[i - 1], { opacity: 0, duration: 0.15 }, at)
            .fromTo(lines[i], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)" }, at + 0.15);
        },
      };
    },
  };

  window.Library = { STYLE, stage, sets, props, prop, fx, word, boy, UI, STICKERS };
})();
