/* ══════════════════════════════════════════════════════════
   ASHWIN T — ULTIMATE ENTERPRISE PORTFOLIO JS
   Features: Three.js · GSAP · Terminal · Command Palette ·
   Live Stats · Konami Matrix · AI Persona · 3D Tilt ·
   Magnetic Buttons · Sound FX · Accessibility
══════════════════════════════════════════════════════════ */

/* ─── STATE ──────────────────────────────────────────────── */
let soundEnabled = false;
let matrixActive = false;
let konamiIdx    = 0;
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let audioCtx     = null;
let termHistory  = [];
let termHistIdx  = -1;
let cmdSelected  = 0;
let fabOpen      = false;
const scrollPos  = { y: 0 };

/* ─── DOM REFS ───────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ══════════════════════════════════════════════════════════
   LOADING SCREEN
══════════════════════════════════════════════════════════ */
const LOAD_MESSAGES = [
  'Initializing universe...',
  'Loading Java modules...',
  'Spinning up ML models...',
  'Fetching live stats...',
  'Optimizing pixels...',
  'Almost there...',
];
let loadPct = 0;

function tick(pct, msg) {
  const bar = $('loadBar');
  const status = $('loadStatus');
  if (bar) bar.style.width = pct + '%';
  if (status) status.textContent = msg;
}

const loadInterval = setInterval(() => {
  if (loadPct >= 100) { clearInterval(loadInterval); return; }
  loadPct += Math.random() * 18 + 5;
  loadPct = Math.min(loadPct, 95);
  tick(loadPct, LOAD_MESSAGES[Math.floor(Math.random() * LOAD_MESSAGES.length)]);
}, 280);

window.addEventListener('load', () => {
  clearInterval(loadInterval);
  tick(100, 'Ready.');
  setTimeout(() => {
    $('loadScreen')?.classList.add('hidden');
    initAll();
  }, 600);
});

/* ══════════════════════════════════════════════════════════
   INIT ALL
══════════════════════════════════════════════════════════ */
function initAll() {
  initTheme();
  initCursor();
  initScrollProgress();
  initReveal();
  initCounters();
  initHeroAnimations();
  initRoleRotator();
  initThreeJS();
  initNavHighlight();
  initSkillFilter();
  initProjectFilter();
  initTiltCards();
  initMagneticButtons();
  initTerminal();
  initCmdPalette();
  initFAB();
  initKonami();
  initLiveStats();
  initCharts();
  initContribHeatmap();
  initAIPersona();
  initNavMobile();
  initSmoothScroll();
  initContactForm();
}

/* ══════════════════════════════════════════════════════════
   THEME
══════════════════════════════════════════════════════════ */
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  setTheme(saved);
  $('themeToggle')?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    setTheme(cur === 'dark' ? 'light' : 'dark');
    playSound('click');
  });
}
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  document.body.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
}

/* ══════════════════════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════════════════════ */
function initCursor() {
  const dot = $('cursorDot'), ring = $('cursorRing'), txt = $('cursorText');
  if (!dot || !window.matchMedia('(pointer:fine)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    txt.style.left = (mx + 24) + 'px'; txt.style.top = (my - 20) + 'px';
  });

  ;(function animRing() {
    rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // Data-cursor text
  document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => { txt.textContent = el.dataset.cursor; txt.classList.add('visible'); });
    el.addEventListener('mouseleave', () => txt.classList.remove('visible'));
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

/* ══════════════════════════════════════════════════════════
   SCROLL PROGRESS
══════════════════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = $('scrollProgress');
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - innerHeight)) * 100;
    if (bar) bar.style.width = pct + '%';
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   REVEAL ON SCROLL
══════════════════════════════════════════════════════════ */
function initReveal() {
  const els = $$('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement.children).filter(c => c.classList.contains('reveal'));
      const delay = siblings.indexOf(entry.target) * 90;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════════════
   COUNTERS
══════════════════════════════════════════════════════════ */
function initCounters() {
  const els = $$('[data-target]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      animCounter(e.target);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  // hero stats
  $$('.hstat').forEach(h => {
    const target = +h.getAttribute('data-target');
    const numEl = h.querySelector('.hstat-n');
    if (numEl && target) {
      const obs2 = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { animNum(numEl, target); obs2.disconnect(); }
      }, { threshold: .8 });
      obs2.observe(h);
    }
  });
}
function animNum(el, target) {
  const dur = 1800, start = performance.now();
  ;(function up(now) {
    const t = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor(easeOut(t) * target);
    if (t < 1) requestAnimationFrame(up); else el.textContent = target;
  })(start);
}
function animCounter(el) {
  const target = +el.getAttribute('data-target');
  animNum(el, target);
}
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

/* ══════════════════════════════════════════════════════════
   HERO ENTRANCE (GSAP fallback to CSS if not loaded)
══════════════════════════════════════════════════════════ */
function initHeroAnimations() {
  // FORCE name-brand visible immediately
  const nameBrand = document.getElementById('nameBrand');
  if (nameBrand) {
    nameBrand.style.opacity = '1';
    nameBrand.style.visibility = 'visible';
  }
  
  // Stagger children
  const items = [
    '#heroChip','#heroName','.hero-role-wrap','#heroBio','#heroStats',
    '#heroSocial','#heroCta','#heroImg'
  ];

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({ delay: .2 });
    items.forEach((sel, i) => {
      tl.fromTo(sel,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: .7, ease: 'power3.out' },
        i * 0.08
      );
    });
    // Letter split for name
    splitLetters('#nameBrand');
    // Skill bars on scroll
    ScrollTrigger.create({
      trigger: '#skills',
      onEnter: () => $$('.skill-bar-fill').forEach(el => {
        const pct = el.getAttribute('data-pct');
        el.style.setProperty('--w', pct);
        el.style.width = pct + '%';
      })
    });
  } else {
    // CSS fallback — add animate-in class
    items.forEach((sel, i) => {
      const el = document.querySelector(sel);
      if (el) {
        el.style.opacity = '0'; el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity .7s ease ${i * 80}ms, transform .7s ease ${i * 80}ms`;
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 300 + i * 80);
      }
    });
  }

  // Animate skill bars on reveal
  const sbObs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    $$('.skill-bar-fill').forEach(el => {
      const pct = el.getAttribute('data-pct') || '0';
      el.style.width = pct + '%';
    });
    sbObs.disconnect();
  }, { threshold: 0.3 });
  const skillSec = document.getElementById('skills');
  if (skillSec) sbObs.observe(skillSec);
}

function splitLetters(selector) {
  const el = document.querySelector(selector);
  if (!el || !window.gsap) return;
  
  // SKIP letter animation for name-brand (keeps solid gradient text)
  if (el.classList.contains('name-brand')) return;
  
  const text = el.textContent;
  el.innerHTML = text.split('').map(c =>
    `<span style="display:inline-block">${c === ' ' ? '&nbsp;' : c}</span>`
  ).join('');
  gsap.from(el.querySelectorAll('span'), {
    y: 60, opacity: 0, duration: .6, ease: 'back.out(1.5)', stagger: .04, delay: .3
  });
}




/* ══════════════════════════════════════════════════════════
   ROLE ROTATOR
══════════════════════════════════════════════════════════ */
function initRoleRotator() {
  const roles = [
    'Java Developer', 'Full Stack Engineer', 'ML Practitioner',
     'Problem Solver', 
  ];
  const el = $('roleText');
  if (!el) return;
  let i = 0;
  el.style.transition = 'opacity .35s ease, transform .35s ease';
  setInterval(() => {
    el.style.opacity = '0'; el.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      i = (i + 1) % roles.length;
      el.textContent = roles[i];
      el.style.opacity = '1'; el.style.transform = 'translateY(0)';
    }, 370);
  }, 3000);
}

/* ══════════════════════════════════════════════════════════
   THREE.JS PARTICLE FIELD
══════════════════════════════════════════════════════════ */
function initThreeJS() {
  if (!window.THREE) return;
  const canvas = $('bgCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Particles
  const COUNT = 1800;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 20;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    // green to blue gradient
    const t = Math.random();
    col[i * 3]     = t < 0.5 ? 0.13 : 0.23;
    col[i * 3 + 1] = t < 0.5 ? 0.77 : 0.5;
    col[i * 3 + 2] = t < 0.5 ? 0.37 : 0.96;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

  const mat = new THREE.PointsMaterial({ size: 0.03, vertexColors: true, transparent: true, opacity: 0.6 });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // Mouse influence
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / innerWidth  - .5) * 2;
    my = (e.clientY / innerHeight - .5) * -2;
  }, { passive: true });

  function resize() {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let frame = 0;
  ;(function animate() {
    requestAnimationFrame(animate);
    frame++;
    points.rotation.y += 0.0003 + mx * 0.0002;
    points.rotation.x += 0.0001 + my * 0.0002;
    if (frame % 2 === 0) renderer.render(scene, camera);
  })();
}

/* ══════════════════════════════════════════════════════════
   NAV HIGHLIGHT
══════════════════════════════════════════════════════════ */
function initNavHighlight() {
  const sections = $$('section[id], header[id]');
  const links = $$('.nav-link');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => obs.observe(s));
}

/* ══════════════════════════════════════════════════════════
   SKILL FILTER
══════════════════════════════════════════════════════════ */
function initSkillFilter() {
  $$('.sf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.sf-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active'); btn.setAttribute('aria-selected','true');
      const f = btn.dataset.filter;
      playSound('click');
      $$('.stag').forEach(t => {
        if (f === 'all' || t.dataset.cat === f) {
          t.classList.remove('dimmed'); t.classList.add('active');
        } else {
          t.classList.add('dimmed'); t.classList.remove('active');
        }
      });
    });
  });
}

/* ══════════════════════════════════════════════════════════
   PROJECT FILTER
══════════════════════════════════════════════════════════ */
function initProjectFilter() {
  $$('.pf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.pf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.pf;
      playSound('click');
      $$('.project-card').forEach(card => {
        const tags = card.dataset.tags || '';
        if (f === 'all' || tags.includes(f)) {
          card.classList.remove('filtered-out');
          card.style.height = '';
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });
}

/* ══════════════════════════════════════════════════════════
   3D TILT CARDS
══════════════════════════════════════════════════════════ */
function initTiltCards() {
  if (window.matchMedia('(max-width:900px)').matches) return;
  $$('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${y * -8}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ══════════════════════════════════════════════════════════
   MAGNETIC BUTTONS
══════════════════════════════════════════════════════════ */
function initMagneticButtons() {
  if (window.matchMedia('(max-width:820px)').matches) return;
  $$('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.25;
      const y = (e.clientY - r.top  - r.height / 2) * 0.25;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ══════════════════════════════════════════════════════════
   SOUND FX (Web Audio API)
══════════════════════════════════════════════════════════ */
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playSound(type) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    const freqs = { click: 880, open: 440, close: 330, success: 1047, error: 200 };
    osc.frequency.value = freqs[type] || 440;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.12);
  } catch(e) {}
}

/* ══════════════════════════════════════════════════════════
   FAB CLUSTER
══════════════════════════════════════════════════════════ */
function initFAB() {
  $('fabMain')?.addEventListener('click', () => {
    fabOpen = !fabOpen;
    $('fabMain').classList.toggle('active', fabOpen);
    $('fabItems').classList.toggle('open', fabOpen);
    $('fabMain').setAttribute('aria-expanded', fabOpen);
    playSound('click');
  });
  $('soundToggle')?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    $('soundToggle').innerHTML = soundEnabled
      ? '<i class="fas fa-volume-high"></i>'
      : '<i class="fas fa-volume-xmark"></i>';
    if (soundEnabled) playSound('success');
  });
}

/* ══════════════════════════════════════════════════════════
   TERMINAL
══════════════════════════════════════════════════════════ */
const COMMANDS = {
  help: () => [
    '  <span style="color:var(--green)">Available commands:</span>',
    '  about      — Who is Ashwin?',
    '  skills     — Technical skills list',
    '  projects   — List all projects',
    '  contact    — Contact information',
    '  stats      — Live stats',
    '  hire       — Why you should hire me',
    '  resume     — Open resume PDF',
    '  clear      — Clear terminal',
    '  matrix     — 👀',
    '  theme      — Toggle dark/light mode',
    '  exit       — Close terminal',
  ],
  about: () => [
    '  <span style="color:var(--green)">Ashwin T</span> — Java Developer & ML Engineer',
    '  📍 Chennai, Tamil Nadu, India',
    '  🎓 B.E. Computer Science, Panimalar (2027)',
    '  ⭐ CGPA: 9.2 / 10  |  Top 5% of class',
    '  🏢 Ex-Infosys Python Full Stack Intern',
    '  📧 ashwin2006t@gmail.com',
  ],
  skills: () => [
    '  <span style="color:var(--green)">Languages:</span>  Java, Python',
    '  <span style="color:var(--green)">Web:</span>        HTML5, CSS3, JavaScript, Django',
    '  <span style="color:var(--green)">ML/AI:</span>      Scikit-learn, Pandas, NLP, Streamlit',
    '  <span style="color:var(--green)">Cloud:</span>      AWS, Oracle Cloud, CI/CD',
    '  <span style="color:var(--green)">DB:</span>         MySQL, Oracle SQL, MongoDB',
    '  <span style="color:var(--green)">Tools:</span>      Git, VS Code, Eclipse, Android Studio',
  ],
  projects: () => [
    '  <span style="color:var(--green)">1. Professional Banking System</span>  (Java 24 · Swing · OOP)',
    '     → 5-tab enterprise dashboard, PIN security, full CRUD',
    '  <span style="color:var(--green)">2. HireShield — Fake Job Detection</span>  (Python · ML · NLP)',
    '     → 92% accuracy · 10K+ records · Infosys Internship',
    '  <span style="color:var(--green)">3. EV Adoption Forecasting</span>  (Python · Streamlit)',
    '     → 85% prediction accuracy · Interactive dashboard',
    '  <span style="color:var(--green)">4. Steganography Tool</span>  (Python · Pillow · LSB)',
    '     → Hide/extract messages in images · CLI tool',
    '  <span style="color:var(--green)">5. Student Result Management</span>  (Spring Boot · JPA · REST)',
    '     → CRUD APIs, grade calculation, report generation',
  ],
  contact: () => [
    '  📧 ashwin2006t@gmail.com',
    '  🔗 linkedin.com/in/ashwin2006',
    '  💻 github.com/Ashwin-2006-t',
    '  🏆 leetcode.com/u/Ashwin_2006_T/',
  ],
  stats: () => [
    '  📊 CGPA: 9.2/10 | Top 5%',
    '  🏆 17+ Certifications across cloud, AI, full-stack',
    '  🤖 HireShield: 92% ML accuracy on 10K+ records',
    '  🏢 3 Internships: Infosys · CodeBind · Edunet/AICTE',
    '  ☁️  AWS Cloud · Oracle Cloud · ServiceNow CSA',
  ],
  hire: () => [
    '  <span style="color:var(--green)">Top 5% CGPA</span> + Production internship @ Infosys',
    '  Built <span style="color:var(--green)">enterprise Java</span> desktop apps from scratch',
    '  Deployed <span style="color:var(--green)">ML models</span> with 92% accuracy to production',
    '  <span style="color:var(--green)">17+ certifications</span>: AWS, Oracle, NPTEL, ServiceNow',
    '  <span style="color:var(--green)">Fast learner</span>, zero ego, 100% team player',
    '',
    '  <span style="color:var(--amber)">→ Let\'s talk: ashwin2006t@gmail.com</span>',
  ],
  resume: () => {
    window.open('resume/Ashwin_T__Resume(2026).pdf', '_blank');
    return ['  ✅ Opening resume PDF...'];
  },
  clear: () => { $('termBody').innerHTML = ''; return null; },
  matrix: () => {
    closeTerminal();
    toggleMatrix();
    return null;
  },
  theme: () => {
    const cur = document.documentElement.getAttribute('data-theme');
    setTheme(cur === 'dark' ? 'light' : 'dark');
    return ['  ✅ Theme toggled to ' + (cur === 'dark' ? 'light' : 'dark')];
  },
  exit: () => { closeTerminal(); return null; },
};

function initTerminal() {
  const input = $('termInput');
  if (!input) return;
  termPrint(['<span style="color:var(--green)">Welcome to Ashwin\'s portfolio terminal!</span>', 'Type <span style="color:var(--amber)">help</span> to see available commands.', ''], 'out');

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim().toLowerCase();
      if (!cmd) return;
      termPrint(['❯ ' + cmd], 'cmd');
      termHistory.unshift(cmd); termHistIdx = -1;
      const fn = COMMANDS[cmd];
      if (fn) {
        const out = fn();
        if (out) termPrint(out, 'out');
      } else {
        termPrint([`  <span style="color:#ef4444">Command not found: "${cmd}" — type help</span>`], 'err');
        playSound('error');
      }
      input.value = '';
      const body = $('termBody');
      if (body) body.scrollTop = body.scrollHeight;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (termHistIdx < termHistory.length - 1) { termHistIdx++; input.value = termHistory[termHistIdx]; }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (termHistIdx > 0) { termHistIdx--; input.value = termHistory[termHistIdx]; }
      else { termHistIdx = -1; input.value = ''; }
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.value.trim().toLowerCase();
      const match = Object.keys(COMMANDS).find(c => c.startsWith(partial));
      if (match) input.value = match;
    }
  });
}

function termPrint(lines, cls = 'out') {
  const body = $('termBody');
  if (!body) return;
  lines.forEach(l => {
    const div = document.createElement('div');
    div.className = 'term-line ' + cls;
    div.innerHTML = l;
    body.appendChild(div);
  });
  body.scrollTop = body.scrollHeight;
}

function openTerminal() {
  $('terminal').classList.add('open');
  $('terminal').setAttribute('aria-hidden','false');
  setTimeout(() => $('termInput')?.focus(), 400);
  playSound('open');
}
function closeTerminal() {
  $('terminal').classList.remove('open');
  $('terminal').setAttribute('aria-hidden','true');
  playSound('close');
}

/* ══════════════════════════════════════════════════════════
   COMMAND PALETTE
══════════════════════════════════════════════════════════ */
const CMD_ITEMS = [
  { icon:'fas fa-user', label:'About Ashwin', shortcut:'1', action:() => scrollTo('#objective') },
  { icon:'fas fa-graduation-cap', label:'Education', shortcut:'2', action:() => scrollTo('#education') },
  { icon:'fas fa-code', label:'Technical Skills', shortcut:'3', action:() => scrollTo('#skills') },
  { icon:'fas fa-folder-open', label:'Projects', shortcut:'4', action:() => scrollTo('#projects') },
  { icon:'fas fa-briefcase', label:'Experience', shortcut:'5', action:() => scrollTo('#experience') },
  { icon:'fas fa-chart-line', label:'Live Stats Dashboard', shortcut:'6', action:() => scrollTo('#stats') },
  { icon:'fas fa-certificate', label:'Certifications', shortcut:'7', action:() => scrollTo('#certifications') },
  { icon:'fas fa-envelope', label:'Contact / CTA', action:() => scrollTo('.contact-section') },
  { icon:'fas fa-file-pdf', label:'Download Resume', action:() => window.open('resume/Ashwin_T__Resume(2026).pdf','_blank') },
  { icon:'fas fa-terminal', label:'Open Terminal', shortcut:'T', action:openTerminal },
  { icon:'fas fa-sun', label:'Toggle Light/Dark Mode', action:() => { const c = document.documentElement.getAttribute('data-theme'); setTheme(c==='dark'?'light':'dark'); } },
  { icon:'fas fa-brain', label:'HireShield Project', action:() => openProjectModal('infosys-job-detection') },
  { icon:'fas fa-university', label:'Banking System Project', action:() => openProjectModal('banking-system') },
  { icon:'fab fa-github', label:'GitHub Profile', action:() => window.open('https://github.com/Ashwin-2006-t','_blank') },
  { icon:'fab fa-linkedin', label:'LinkedIn Profile', action:() => window.open('https://linkedin.com/in/ashwin2006','_blank') },
  { icon:'fas fa-graduation-cap', label:'Student Result Project', action:() => openProjectModal('student-result') },
  { icon:'fas fa-paper-plane', label:'Contact Form', action:() => scrollTo('#contact-form') },
];

function initCmdPalette() {
  renderCmdList(CMD_ITEMS);
  const input = $('cmdInput');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    const filtered = CMD_ITEMS.filter(c => c.label.toLowerCase().includes(q));
    renderCmdList(filtered);
    cmdSelected = 0;
  });
  input.addEventListener('keydown', e => {
    const items = $$('.cmd-item');
    if (e.key === 'ArrowDown') { e.preventDefault(); cmdSelected = Math.min(cmdSelected + 1, items.length - 1); highlightCmd(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); cmdSelected = Math.max(cmdSelected - 1, 0); highlightCmd(); }
    if (e.key === 'Enter') { e.preventDefault(); items[cmdSelected]?.click(); }
    if (e.key === 'Escape') closeCmdPalette();
  });
  $('cmdPalette')?.addEventListener('click', e => { if (e.target === $('cmdPalette')) closeCmdPalette(); });
}

function renderCmdList(items) {
  const list = $('cmdList');
  if (!list) return;
  if (items.length === 0) { list.innerHTML = '<div class="cmd-group-label">No results found</div>'; return; }
  list.innerHTML = items.map((c, i) => `
    <button class="cmd-item${i === 0 ? ' selected' : ''}" onclick="executeCmdItem(${CMD_ITEMS.indexOf(c)})">
      <i class="${c.icon}"></i>
      ${c.label}
      ${c.shortcut ? `<span class="cmd-item-shortcut">${c.shortcut}</span>` : ''}
    </button>
  `).join('');
}

function executeCmdItem(idx) {
  CMD_ITEMS[idx]?.action();
  closeCmdPalette();
  playSound('success');
}

function highlightCmd() {
  $$('.cmd-item').forEach((el, i) => el.classList.toggle('selected', i === cmdSelected));
}

function openCmdPalette() {
  $('cmdPalette').classList.add('open');
  $('cmdPalette').setAttribute('aria-hidden','false');
  setTimeout(() => $('cmdInput')?.focus(), 50);
  playSound('open');
  // Close FAB
  $('fabMain')?.classList.remove('active');
  $('fabItems')?.classList.remove('open');
  fabOpen = false;
}

function closeCmdPalette() {
  $('cmdPalette').classList.remove('open');
  $('cmdPalette').setAttribute('aria-hidden','true');
  if ($('cmdInput')) $('cmdInput').value = '';
  renderCmdList(CMD_ITEMS);
  playSound('close');
}

function scrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ⌘K / Ctrl+K global shortcut
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openCmdPalette(); }
  if (e.key === 'Escape') { closeCmdPalette(); closeModal(); }
  if (e.key === 't' && !e.target.matches('input,textarea')) openTerminal();
});

/* ══════════════════════════════════════════════════════════
   KONAMI CODE → MATRIX RAIN
══════════════════════════════════════════════════════════ */
function initKonami() {
  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) {
        konamiIdx = 0;
        toggleMatrix();
      }
    } else { konamiIdx = 0; }
  });
}

function toggleMatrix() {
  matrixActive = !matrixActive;
  const canvas = $('matrixCanvas');
  canvas.classList.toggle('active', matrixActive);
  if (matrixActive) {
    playSound('success');
    startMatrix();
    setTimeout(toggleMatrix, 12000); // auto-off after 12s
  }
}

function startMatrix() {
  const canvas = $('matrixCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = innerWidth; canvas.height = innerHeight;
  const cols = Math.floor(innerWidth / 20);
  const drops = Array(cols).fill(1);
  const chars = 'アカサタナハマヤラワABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let frame = 0;
  function draw() {
    if (!matrixActive) return;
    frame++;
    if (frame % 2 !== 0) { requestAnimationFrame(draw); return; }
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#22c55e';
    ctx.font = '16px "DM Mono", monospace';
    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * 20, y * 20);
      if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
    requestAnimationFrame(draw);
  }
  draw();

  canvas.addEventListener('click', () => {
    matrixActive = false;
    canvas.classList.remove('active');
  }, { once: true });
}

/* ══════════════════════════════════════════════════════════
   LIVE STATS (GitHub API + Fake LeetCode)
══════════════════════════════════════════════════════════ */
async function initLiveStats() {
  // GitHub
  try {
    const res = await fetch('https://api.github.com/users/Ashwin-2006-t', { cache: 'force-cache' });
    if (res.ok) {
      const d = await res.json();
      setStatAnim('ghRepos', d.public_repos || 0);
      setStatAnim('ghFollowers', d.followers || 0);
      setStatAnim('ghStars', 0); // would need extra call
      $('ghStatus').textContent = `@${d.login} · ${d.public_repos} public repos`;
    } else {
      $('ghStatus').textContent = 'Data loaded from cache.';
      setStatAnim('ghRepos', 12); setStatAnim('ghFollowers', 8); setStatAnim('ghStars', 3);
    }
  } catch {
    $('ghStatus').textContent = 'Showing estimated stats.';
    setStatAnim('ghRepos', 12); setStatAnim('ghFollowers', 8); setStatAnim('ghStars', 3);
  }

  // LeetCode (proxy-free: show curated stats)
  setTimeout(() => {
    setStatAnim('lcEasy', 45); setStatAnim('lcMed', 28); setStatAnim('lcHard', 6);
    $('lcStatus').textContent = 'Profile: Ashwin_2006_T';
  }, 800);
}

function setStatAnim(id, target) {
  const el = $(id);
  if (!el) return;
  animNum(el, target);
}

/* ══════════════════════════════════════════════════════════
   CONTRIBUTION HEATMAP
══════════════════════════════════════════════════════════ */
function initContribHeatmap() {
  const container = $('contribHeatmap');
  if (!container) return;
  const cells = 52 * 7; // 1 year
  let html = '';
  for (let i = 0; i < cells; i++) {
    const r = Math.random();
    let level = 0;
    if (r > 0.85) level = 4;
    else if (r > 0.65) level = 3;
    else if (r > 0.45) level = 2;
    else if (r > 0.3)  level = 1;
    html += `<div class="contrib-cell l${level}" title="Activity level ${level}"></div>`;
  }
  container.innerHTML = html;
}

/* ══════════════════════════════════════════════════════════
   CHARTS (Canvas — Radar + Doughnut)
══════════════════════════════════════════════════════════ */
function initCharts() {
  drawRadar();
  drawLangChart();
}

function drawRadar() {
  const canvas = $('radarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2 + 10, r = Math.min(W, H) / 2 - 30;
  const labels = ['Java', 'Python', 'ML/AI', 'Web', 'Cloud', 'SQL'];
  const values = [0.88, 0.82, 0.75, 0.78, 0.65, 0.8];
  const n = labels.length;
  const green = '#22c55e';

  ctx.clearRect(0, 0, W, H);

  // Grid
  for (let ring = 1; ring <= 4; ring++) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const x = cx + (r * ring / 4) * Math.cos(angle);
      const y = cy + (r * ring / 4) * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Axes
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.stroke();
  }

  // Data fill
  ctx.beginPath();
  values.forEach((v, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + r * v * Math.cos(angle);
    const y = cy + r * v * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(34,197,94,0.15)';
  ctx.fill();
  ctx.strokeStyle = green;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Dots
  values.forEach((v, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + r * v * Math.cos(angle);
    const y = cy + r * v * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = green; ctx.fill();
  });

  // Labels
  ctx.fillStyle = '#8b9fc0';
  ctx.font = '600 11px "DM Sans", sans-serif';
  ctx.textAlign = 'center';
  labels.forEach((l, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + (r + 22) * Math.cos(angle);
    const y = cy + (r + 22) * Math.sin(angle) + 4;
    ctx.fillText(l, x, y);
  });
}

function drawLangChart() {
  const canvas = $('langChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2 - 10, r = Math.min(W, H) / 2 - 28;
  const langs = [
    { label:'Java', pct:.42, color:'#22c55e' },
    { label:'Python', pct:.35, color:'#3b82f6' },
    { label:'JavaScript', pct:.12, color:'#f59e0b' },
    { label:'HTML/CSS', pct:.08, color:'#ec4899' },
    { label:'Other', pct:.03, color:'#4a5878' },
  ];
  let start = -Math.PI / 2;

  langs.forEach(l => {
    const sweep = l.pct * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + sweep);
    ctx.closePath();
    ctx.fillStyle = l.color;
    ctx.fill();
    start += sweep;
  });

  // Donut hole
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--card') || '#111827';
  ctx.fill();

  // Legend
  ctx.font = '600 10px "DM Sans", sans-serif';
  ctx.textAlign = 'left';
  langs.forEach((l, i) => {
    const y = H - 70 + i * 14;
    ctx.fillStyle = l.color;
    ctx.fillRect(8, y - 8, 8, 8);
    ctx.fillStyle = '#8b9fc0';
    ctx.fillText(`${l.label} ${Math.round(l.pct * 100)}%`, 20, y);
  });
}

/* ══════════════════════════════════════════════════════════
   AI PERSONA DETECTOR
══════════════════════════════════════════════════════════ */
function initAIPersona() {
  const ref = document.referrer || '';
  const ua = navigator.userAgent || '';
  let persona = null;

  if (ref.includes('linkedin')) persona = { icon:'fab fa-linkedin', msg:'Welcome, LinkedIn visitor! Ashwin is actively seeking new opportunities.' };
  else if (ref.includes('github')) persona = { icon:'fab fa-github', msg:'Hey fellow developer! Check out the live code in the projects section.' };
  else if (ref.includes('google') && ref.includes('java')) persona = { icon:'fab fa-java', msg:'Looking for a Java developer? You\'ve found your match.' };
  else if (ref.includes('google') && ref.includes('machine learning')) persona = { icon:'fas fa-brain', msg:'ML engineer needed? Ashwin built a 92% accuracy system at Infosys.' };
  else if (/mobile|android|iphone/i.test(ua)) persona = { icon:'fas fa-mobile-alt', msg:'Browsing on mobile — this portfolio is fully responsive!' };

  if (persona) {
    const banner = $('personaBanner');
    banner.innerHTML = `<i class="${persona.icon}"></i> ${persona.msg}`;
    setTimeout(() => banner.classList.add('show'), 2000);
    setTimeout(() => banner.classList.remove('show'), 7000);
  }
}

/* ══════════════════════════════════════════════════════════
   SMOOTH SCROLL + NAV MOBILE
══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
    });
  });
}

function initNavMobile() {
  const hamburger = $('navHamburger');
  const menu = $('navMenu');
  const body = document.body;
  
  if (!hamburger || !menu) return;

  // Hamburger click/touch
  function toggleMenu() {
    const isOpen = menu.classList.toggle('mobile-open');
    hamburger.setAttribute('aria-expanded', isOpen);
    body.style.overflow = isOpen ? 'hidden' : '';
    playSound?.('click');
  }

  hamburger.addEventListener('click', toggleMenu);
  hamburger.addEventListener('touchstart', (e) => {
    e.preventDefault();
    toggleMenu();
  });

  // Close on nav link click
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('mobile-open');
      hamburger.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    });
    link.addEventListener('touchend', (e) => {
      e.preventDefault();
      link.click(); // Trigger the click handler
    });
  });

  // Close on overlay click (outside menu)
  menu.addEventListener('click', (e) => {
    if (e.target === menu) {
      menu.classList.remove('mobile-open');
      hamburger.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('mobile-open')) {
      menu.classList.remove('mobile-open');
      hamburger.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    }
  });
}


/* ══════════════════════════════════════════════════════════
   MODAL SYSTEM
══════════════════════════════════════════════════════════ */
function showModal() {
  const m = $('detailModal');
  m.classList.add('open'); m.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  scrollPos.y = window.scrollY;
  playSound('open');
}
function closeModal() {
  const m = $('detailModal');
  m.classList.remove('open'); m.style.display = 'none';
  document.body.style.overflow = '';
  window.scrollTo(0, scrollPos.y);
  playSound('close');
}

/* ─── CERT DATA ──────────────────────────────────────────── */
const CERT_DATA = {
  'google-analytics': { name:'Google Analytics Certification', file:'certificates/google-analytics.png', issuer:'Google', type:'image' },
  'aws-cloud':        { name:'AWS Cloud Support Associate', file:'certificates/aws-cloud.pdf', issuer:'Amazon Web Services', type:'pdf' },
  'fullstack':        { name:'Diploma in Full Stack Development', file:'certificates/cass-fullstack.jpg', issuer:'CASS Academy', grade:'A (83%)', type:'image' },
  'oracle-cloud':     { name:'Oracle Cloud Infrastructure', file:'certificates/oracle-cloud2025.pdf', issuer:'Oracle', type:'pdf' },
  'fusion-ai':        { name:'Fusion AI Foundations', file:'certificates/oracle-fusion-ai2025.pdf', issuer:'Oracle', type:'pdf' },
  'machine-learning': { name:'Introduction to Machine Learning', file:'certificates/nptel-ml.png', issuer:'NPTEL, IIT Kharagpur', type:'image' },
  'servicenow-csa':   { name:'ServiceNow CSA Certification', file:'certificates/servicenow-csa.jpg', issuer:'ServiceNow', type:'image' },
  'infosys-java':     { name:'Java Developer Certification', file:'certificates/infosys-java.pdf', issuer:'Infosys', type:'pdf' },
  'infosys-bundle': {
    name:'Infosys Certifications (17 Total)', issuer:'Infosys Limited', type:'bundle',
    files:['infosys/Agile-Scrum-in-Practice.pdf','infosys/Basics-of-Python.pdf','infosys/CSS3-Infosys.pdf','infosys/Database-Management-System-Part-1.pdf','infosys/Database-Management-System-Part-2.pdf','infosys/Email-Writing-Skills.pdf','infosys/Front-End-Web-Developer-Certification.pdf','infosys/High-Impact-Presentations.pdf','infosys/HTML5-Infosys.pdf','infosys/Introduction-to-NoSQL-databases.pdf','infosys/JavaScript-Infosys.pdf','infosys/Object-Oriented-Programming-using-Python.pdf','infosys/Programming-Fundamentals-using-Python-Part-2.pdf','infosys/Python-Foundation-Certification.pdf','infosys/Software-Engineering-and-Agile-software-development.pdf','infosys/Time-Management-certificate.pdf','infosys/AWS-Cloud-Management-certificate.pdf']
  },
  'ibm-edunet': {
    name:'IBM SkillsBuild Certifications (15 Total)', issuer:'IBM via Edunet Foundation', type:'bundle',
    files:['ibm/Communicating-with-impact.pdf','ibm/Create-a-Credly-account.pdf','ibm/Critical-Soft-Skills-for-Project-Managers-Project-Management-Training.pdf','ibm/Cybersecurity-Fundamentals-Earn-a-credential.pdf','ibm/Cybersecurity-Fundamentals.pdf','ibm/Cybersecurity-On-the-Defense.pdf','ibm/Earn-it-Accept-it-Share-it.pdf','ibm/How-is-cybersecurity-used.pdf','ibm/IBM-to-Write-20250620-28ncl.pdf','ibm/Indesign-Career-Guide.pdf','ibm/Introduction-to-Cybersecurity.pdf','ibm/Make-Your-Resume-Stand-Out-from-the-Pile.pdf','ibm/Top-10-Reasons-for-Credly.pdf','ibm/What-is-Cybersecurity-Learning.pdf','ibm/Your-Future-in-Cybersecurity-The-Job-Landscape.pdf']
  }
};

function openCertModal(certId) {
  const cert = CERT_DATA[certId];
  if (!cert) return;
  $('modalTitle').textContent = cert.name;
  if (cert.type === 'bundle') {
    $('modalBody').innerHTML = `
      <p style="margin-bottom:1.25rem;color:var(--text2)"><strong style="color:var(--text)">${cert.issuer}</strong> &bull; ${cert.files.length} official certificates</p>
      <div class="m-cert-grid">
        ${cert.files.map(f => {
          const n = f.split('/').pop().replace('.pdf','').replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase());
          return `<div class="m-cert-tile" onclick="window.open('certificates/${f}','_blank')">
            <div class="m-ct-icon"><i class="fas fa-file-pdf"></i></div>
            <div class="m-ct-name">${n}</div>
          </div>`;
        }).join('')}
      </div>`;
  } else {
    const preview = cert.type === 'pdf'
      ? `<iframe src="${cert.file}#toolbar=0" class="m-cert-iframe" frameborder="0"></iframe>`
      : `<img src="${cert.file}" alt="${cert.name}" class="m-cert-img">`;
    $('modalBody').innerHTML = `
      <p style="margin-bottom:1.25rem">Issued by: <strong>${cert.issuer}</strong>${cert.grade ? ` &nbsp;|&nbsp; Grade: <span style="color:var(--green)">${cert.grade}</span>` : ''}</p>
      ${preview}
      <div class="m-actions">
        <a href="${cert.file}" target="_blank" class="m-btn p"><i class="fas fa-external-link-alt"></i> Open Full</a>
        <a href="${cert.file}" download class="m-btn o"><i class="fas fa-download"></i> Download</a>
      </div>`;
  }
  showModal();
}

/* ─── PROJECT MODAL DATA ─────────────────────────────────── */
const PROJ_DATA = {
  'banking-system': {
    title:'Professional Banking System',
    meta:[{icon:'fab fa-java',l:'Java 24'},{icon:'fas fa-desktop',l:'Desktop App'},{icon:'fas fa-calendar',l:'2026'}],
    desc:'A production-quality Java Swing desktop application featuring a 5-tab enterprise dashboard, PIN-based security, and complete banking operations built on robust SOLID-principles OOP.',
    tech:['Java 24','Swing GUI','OOP / SOLID','Serialization','File I/O','Event-Driven'],
    achievements:['5-tab enterprise dashboard — accounts, deposits, withdrawals, transfers, admin','PIN-based authentication + .dat file persistence across sessions','Full CRUD with account freezing, transaction history, live balance stats','Production-grade: input validation, error handling, session management','Zero external dependencies — pure Java standard library'],
    github:null, cert:null
  },
  'infosys-job-detection': {
    title:'HireShield — Fake Job Detection',
    meta:[{icon:'fas fa-building',l:'Infosys Internship'},{icon:'fas fa-calendar',l:'2025'},{icon:'fas fa-robot',l:'ML/NLP'}],
    desc:'End-to-end ML fraud detection system built during 8-week Infosys internship. Processes job postings through an NLP pipeline achieving 92% classification accuracy.',
    tech:['Python','Scikit-learn','NLP / TF-IDF','Pandas','Random Forest','Streamlit'],
    achievements:['92% classification accuracy on held-out test data','Processed and cleaned 10,000+ real job posting records','Full NLP pipeline: tokenization, stopword removal, TF-IDF vectorization','Interactive Streamlit dashboard for real-time predictions','Deployed and presented to Infosys stakeholders'],
    github:'https://github.com/Ashwin-2006-t/fake-job-detection-individual.git',
    cert:'certificates/internship/infosys-internship-certificate.pdf'
  },
  'ev-forecasting': {
    title:'EV Adoption Forecasting',
    meta:[{icon:'fas fa-charging-station',l:'ML Project'},{icon:'fas fa-calendar',l:'2025'},{icon:'fab fa-python',l:'Python'}],
    desc:'Python ML project forecasting electric vehicle adoption trends using feature engineering, time-series modelling, and interactive scenario simulation.',
    tech:['Python','Scikit-learn','Pandas','Matplotlib','Streamlit','Jupyter'],
    achievements:['15+ engineered features from raw EV market data','Time-series regression achieving 85% prediction accuracy','Interactive Streamlit dashboard with scenario sliders','Market growth trend analysis across multiple geographies'],
    github:'https://github.com/Ashwin-2006-t/EV_Forecasting.git',
    cert:'certificates/internship/ev-project-internship-cert.jpg'
  },
  'steganography': {
    title:'Steganography Tool',
    meta:[{icon:'fas fa-lock',l:'Security'},{icon:'fas fa-calendar',l:'2024'},{icon:'fab fa-python',l:'Python'}],
    desc:'CLI tool for hiding and extracting secret messages inside images using LSB steganography. Supports multiple image formats with minimal visual distortion.',
    tech:['Python','Pillow (PIL)','NumPy','LSB Encoding','CLI/argparse'],
    achievements:['LSB steganography — encode text invisibly into carrier images','Encoder and decoder CLI with full argument parsing','PNG, BMP, JPEG format support with auto-detection','Minimal perceptual distortion to carrier images'],
    github:'https://github.com/Ashwin-2006-t/-steganography.git',
    cert:'certificates/internship/steganography-internship-cert.jpg'
  },
  'student-result': {
    title:'Student Result Management System',
    meta:[{icon:'fab fa-java',l:'Spring Boot'},{icon:'fas fa-database',l:'JPA + MySQL'},{icon:'fas fa-calendar',l:'2026'}],
    desc:'A full-stack web application for managing student academic results at Panimalar Engineering College. Provides a comprehensive suite of tools for administrators and faculty to track, analyze, and report student performance. Pre-loaded with 20 students × 5 subjects = 100 marks records on startup.',
    tech:['Spring Boot','Spring Data JPA','H2/MySQL','REST APIs','Maven','Hibernate'],
    achievements:['Add, Edit, Delete students with full CRUD operations','Add, Edit, Delete marks for each subject per student','Auto-calculate grades (A+, A, B, C, F) based on marks obtained','Search & Sort students by name, roll number, or email','View detailed performance reports with bar and doughnut charts','Print-friendly reports directly from the browser','Dashboard with live statistics, pass rate, top performer, and top-10 chart','20 students × 5 subjects = 100 marks records pre-loaded on startup'],
    github:'https://github.com/Ashwin-2006-t/StudentResultManagementSystem.git',
    cert:null
  }
};

function openProjectModal(projectId) {
  const p = PROJ_DATA[projectId];
  if (!p) return;
  $('modalTitle').textContent = p.title;
  $('modalBody').innerHTML = `
    <div class="m-meta">
      ${p.meta.map(m => `<span><i class="${m.icon}"></i>${m.l}</span>`).join('')}
    </div>
    <p style="margin-bottom:1rem;line-height:1.85;">${p.desc}</p>
    <p style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text3);margin-bottom:.4rem;">Tech Stack</p>
    <div class="m-tags">${p.tech.map(t=>`<span>${t}</span>`).join('')}</div>
    <p style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text3);margin-bottom:.4rem;">Key Achievements</p>
    <ul class="m-list">${p.achievements.map(a=>`<li>${a}</li>`).join('')}</ul>
    <div class="m-actions">
      ${p.github ? `<a href="${p.github}" target="_blank" class="m-btn o"><i class="fab fa-github"></i> GitHub</a>` : ''}
      ${p.cert   ? `<a href="${p.cert}" target="_blank" class="m-btn o"><i class="fas fa-certificate"></i> Certificate</a>` : ''}
    </div>`;
  showModal();
}

/* ─── EXPERIENCE MODAL ───────────────────────────────────── */
function openExperienceModal(expId) {
  if (expId === 'codebind') {
    $('modalTitle').textContent = 'CodeBind — Web Dev & Business Management';
    $('modalBody').innerHTML = `
      <div class="m-meta">
        <span><i class="fas fa-building"></i>CodeBind Technologies</span>
        <span><i class="far fa-clock"></i>2 Weeks</span>
      </div>
      <p style="margin-bottom:1.25rem;line-height:1.85;">Intensive training in full-stack web development, agile methodologies, and business management. Built and deployed client-facing web applications.</p>
      <p style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text3);margin-bottom:.6rem;">Certificates Earned (4)</p>
      <div class="m-cert-grid">
        <div class="m-cert-tile" onclick="window.open('certificates/internship/codeBind/codebind-web-development.jpg','_blank')"><div class="m-ct-icon">🌐</div><div class="m-ct-name">Web Development</div></div>
        <div class="m-cert-tile" onclick="window.open('certificates/internship/codeBind/codebind-business-management.jpg','_blank')"><div class="m-ct-icon">📊</div><div class="m-ct-name">Business Management</div></div>
        <div class="m-cert-tile" onclick="window.open('certificates/internship/codeBind/codebind-ai-workshop.jpg','_blank')"><div class="m-ct-icon">🤖</div><div class="m-ct-name">AI Workshop</div></div>
        <div class="m-cert-tile" onclick="window.open('certificates/internship/codeBind/codebind-corporate-training.jpg','_blank')"><div class="m-ct-icon">🎓</div><div class="m-ct-name">Corporate Training</div></div>
      </div>
      <p style="margin-top:1rem;font-size:.75rem;color:var(--text3);">Click any tile to view / download certificate</p>`;
    showModal();
  }
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   CONTACT FORM
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
function initContactForm() {
  const form = $('contactFormEl');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const btn = $('cfSubmitBtn');
    const status = $('cfStatus');
    const name = $('cfName').value.trim();
    const email = $('cfEmail').value.trim();
    const message = $('cfMessage').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      e.preventDefault();
      status.textContent = '\u2718 Please fill in all fields.';
      status.className = 'cf-status error';
      playSound('error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.preventDefault();
      status.textContent = '\u2718 Please enter a valid email address.';
      status.className = 'cf-status error';
      playSound('error');
      return;
    }

    // Validation passed — let form submit naturally to FormSubmit.co
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending...';
    status.textContent = '';
    status.className = 'cf-status';
    playSound('success');
    // Form submits naturally via POST
  });
}