/* =========================================================
   ANTONELLA.DEV — SCRIPT
   Vanilla JS (ES6+), modular, sin dependencias externas.
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initYear();
  initParticles();
  initCustomCursor();
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initScrollSpy();
  initRevealOnScroll();
  initHeroTerminal();
  initHeroObject();
  initStackMarquee();
  initMagneticButtons();
  initCertificatesSlider();
  initBackToTop();
  initContactForm();
});

/* ---------- Loader ---------- */
function initLoader(){
  const loader = document.getElementById('loader');
  const textEl = document.getElementById('loaderText');
  const barFill = document.getElementById('loaderBarFill');
  const lines = ['booting antonella.dev', 'cargando módulos...', 'listo.'];
  let i = 0, char = 0;

  function typeLine(){
    if (i >= lines.length){
      barFill.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('is-hidden');
        document.body.style.overflow = '';
      }, 400);
      return;
    }
    const line = lines[i];
    if (char <= line.length){
      textEl.textContent = line.slice(0, char);
      barFill.style.width = `${Math.round(((i + char / line.length) / lines.length) * 100)}%`;
      char++;
      setTimeout(typeLine, 28);
    } else {
      char = 0; i++;
      setTimeout(typeLine, 260);
    }
  }

  document.body.style.overflow = 'hidden';
  typeLine();

  // Failsafe: never trap the user on the loader
  setTimeout(() => {
    loader.classList.add('is-hidden');
    document.body.style.overflow = '';
  }, 4000);
}

/* ---------- Footer year ---------- */
function initYear(){
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Ambient particle field ---------- */
function initParticles(){
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles(){
    const count = Math.min(70, Math.floor((w * h) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.15
    }));
  }

  function tick(){
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#a78bfa';
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  resize();
  createParticles();
  if (!prefersReduced) requestAnimationFrame(tick);
  else tick(); // draw a single static frame

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); createParticles(); }, 200);
  });
}

/* ---------- Custom cursor ---------- */
function initCustomCursor(){
  if (window.matchMedia('(hover: none)').matches) return;
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  let mx = 0, my = 0, cx = 0, cy = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });

  function loop(){
    cx += (mx - cx) * 0.16;
    cy += (my - cy) * 0.16;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
  });
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress(){
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  }, { passive: true });
}

/* ---------- Navbar scroll state ---------- */
function initNavbar(){
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    // Añade el fondo de cristal más oscuro al bajar más de 20px
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ---------- Scroll spy: resalta el link activo del nav ---------- */
function initScrollSpy(){
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!links.length) return;

  const sections = Array.from(links)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length) return;

  const linkFor = (id) => document.querySelector(`.nav-links a[href="#${id}"]`);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = linkFor(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

/* ---------- Mobile menu ---------- */
function initMobileMenu(){
  const burger = document.getElementById('burger');
  const links = document.getElementById('navLinks');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    
    // Animación de las tres líneas del menú hamburguesa
    const spans = burger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Cerrar el menú automáticamente al hacer click en cualquier enlace (móvil)
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      const spans = burger.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });
}

/* ---------- Scroll reveal via IntersectionObserver ---------- */
function initRevealOnScroll(){
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach((el, idx) => {
    el.style.transitionDelay = `${Math.min(idx % 4, 3) * 80}ms`;
    observer.observe(el);
  });
}

/* ---------- Hero terminal: boot real de una sola pasada, no un carrusel ---------- */
const TERMINAL_LINES = [
  { cmd: 'whoami', out: 'Antonella Dev' },
  { cmd: 'stack', out: 'Python · Django · JavaScript' },
  { cmd: 'ubicacion', out: 'Santa Cruz de la Sierra, Bolivia' },
  { cmd: 'estado', out: 'Disponible para prácticas profesionales' }
];

function initHeroTerminal(){
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced){
    body.innerHTML = TERMINAL_LINES.map(renderTerminalLine).join('');
    return;
  }

  let lineIndex = 0;

  function typeLine(){
    if (lineIndex >= TERMINAL_LINES.length) return;

    const { cmd, out } = TERMINAL_LINES[lineIndex];
    const row = document.createElement('div');
    row.className = 'hero__terminal-line';
    row.innerHTML = `<span class="hero__terminal-prompt">&gt;</span><span class="hero__terminal-cmd"></span><span class="hero__terminal-cursor">|</span>`;
    body.appendChild(row);
    const cmdEl = row.querySelector('.hero__terminal-cmd');
    const cursorEl = row.querySelector('.hero__terminal-cursor');

    let charIndex = 0;
    (function typeChar(){
      if (charIndex <= cmd.length){
        cmdEl.textContent = cmd.slice(0, charIndex);
        charIndex++;
        setTimeout(typeChar, 45);
      } else {
        cursorEl.remove();
        const outEl = document.createElement('div');
        outEl.className = 'hero__terminal-out';
        outEl.textContent = out;
        body.appendChild(outEl);
        lineIndex++;
        setTimeout(typeLine, 320);
      }
    })();
  }
  typeLine();
}

function renderTerminalLine({ cmd, out }){
  return `<div class="hero__terminal-line"><span class="hero__terminal-prompt">&gt;</span><span class="hero__terminal-cmd">${cmd}</span></div><div class="hero__terminal-out">${out}</div>`;
}

/* ---------- Hero: spotlight sutil que sigue al cursor ---------- */
function initHeroObject(){
  const hero = document.getElementById('hero');
  const spotlight = document.getElementById('heroSpotlight');
  if (!hero || !spotlight) return;
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  hero.addEventListener('mousemove', (e) => {
    const bounds = hero.getBoundingClientRect();
    const relX = (e.clientX - bounds.left) / bounds.width;   // 0..1
    const relY = (e.clientY - bounds.top) / bounds.height;   // 0..1

    spotlight.style.setProperty('--spot-x', `${relX * 100}%`);
    spotlight.style.setProperty('--spot-y', `${relY * 100}%`);
  });
}

/* ---------- Tech stack: carrusel horizontal infinito ---------- */
const TECH_STACK = [
  { name: 'HTML5', tag: 'Markup', icon: '</>' },
  { name: 'CSS3', tag: 'Estilos', icon: '#' },
  { name: 'JavaScript', tag: 'Lenguaje', icon: 'JS' },
  { name: 'TypeScript', tag: 'Lenguaje', icon: 'TS' },
  { name: 'React', tag: 'Librería', icon: '⚛' },
  { name: 'Python', tag: 'Lenguaje', icon: 'Py' },
  { name: 'Django', tag: 'Framework', icon: '◧' },
  { name: 'C++', tag: 'Lógica & DSA', icon: 'C++' },
  { name: 'MySQL', tag: 'Base de datos', icon: '⛁' },
  { name: 'MongoDB', tag: 'Base de datos', icon: '⬡' },
  { name: 'Git & GitHub', tag: 'Control de versiones', icon: '⑂' },
  { name: 'Linux', tag: 'Sistemas', icon: '$' },
  { name: 'Figma', tag: 'UI/UX', icon: '◆' },
  { name: 'VS Code', tag: 'Editor', icon: '{}' }
  // 👉 Agrega más tecnologías aquí; el carrusel se ajusta solo.
];

function initStackMarquee(){
  const track = document.getElementById('stackTrack');
  if (!track) return;

  const pill = (t) => `
    <div class="stack__pill">
      <span class="stack__pill-icon">${t.icon}</span>
      <span class="stack__pill-name">${t.name}</span>
      <span class="stack__pill-tag">${t.tag}</span>
    </div>
  `;

  // Se duplica la lista para lograr un loop perfectamente continuo (translateX -50%).
  const items = TECH_STACK.map(pill).join('') + TECH_STACK.map(pill).join('');
  track.innerHTML = items;
}

/* ---------- Certificados: slider arrastrable con flechas ---------- */
function initCertificatesSlider(){
  const track = document.getElementById('certTrack');
  const prevBtn = document.getElementById('certPrev');
  const nextBtn = document.getElementById('certNext');
  if (!track) return;

  const scrollAmount = () => Math.min(280, track.clientWidth * 0.8);

  if (prevBtn) prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
  });

  // Arrastre con mouse (los touchscreens ya tienen scroll nativo)
  let isDown = false, startX = 0, scrollStart = 0, dragMoved = false;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    dragMoved = false;
    track.classList.add('is-dragging');
    startX = e.pageX;
    scrollStart = track.scrollLeft;
  });
  window.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('is-dragging');
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    if (Math.abs(e.pageX - startX) > 6) dragMoved = true;
    track.scrollLeft = scrollStart - (e.pageX - startX);
  });

  // Evita que un arrastre con mouse abra accidentalmente el PDF de una tarjeta
  track.querySelectorAll('.cert-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (dragMoved) e.preventDefault();
    });
  });
}

/* ---------- Magnetic button effect ---------- */
function initMagneticButtons(){
  if (window.matchMedia('(hover: none)').matches) return;
  const items = document.querySelectorAll('[data-magnetic]');

  items.forEach(el => {
    let bounds;
    el.addEventListener('mouseenter', () => { bounds = el.getBoundingClientRect(); });
    el.addEventListener('mousemove', (e) => {
      if (!bounds) bounds = el.getBoundingClientRect();
      const relX = e.clientX - bounds.left - bounds.width / 2;
      const relY = e.clientY - bounds.top - bounds.height / 2;
      el.style.transform = `translate(${relX * 0.18}px, ${relY * 0.28}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
    });
  });
}

/* ---------- Back to top ---------- */
function initBackToTop(){
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Contact form (front-end only demo) ---------- */
function initContactForm(){
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  const btnText = document.getElementById('formBtnText');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const original = btnText.textContent;
    btnText.textContent = 'Enviando...';

    // NOTE: conecta aquí tu backend o servicio de email (Formspree, EmailJS, etc.)
    setTimeout(() => {
      btnText.textContent = original;
      note.textContent = '¡Gracias! Tu mensaje fue registrado. Te responderé pronto a tu correo.';
      form.reset();
    }, 900);
  });
}

/* ---------- Typewriter (Hero): alterna roles con efecto de tipeo/borrado ---------- */
(function initHeroTypewriter(){
  const el = document.getElementById('heroTypewriter');
  if (!el) return;

  const words = ['UI / UX Designer', 'Frontend Developer', 'Systems Engineer'];
  const TYPE_SPEED = 70;    // ms por letra al escribir
  const DELETE_SPEED = 40;  // ms por letra al borrar
  const PAUSE_AFTER = 1000; // ms de espera con la palabra completa

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    el.textContent = words[0];
    return;
  }

  let wordIndex = 0, charIndex = 0, deleting = false;

  function tick(){
    const current = words[wordIndex];

    if (!deleting){
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length){
        deleting = true;
        setTimeout(tick, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0){
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
})();
