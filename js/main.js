'use strict';
/* ==========================================================
   Portfolio Mze.dev – JavaScript (ES6+, sans dépendance)
   Sécurité : aucun innerHTML avec des données externes,
   tout est construit via textContent / createElement.
   ========================================================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Création de nœuds DOM sûre */
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v == null) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) if (c != null) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
}
const debounce = (fn, ms = 250) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const safeUrl = (u) => { try { const x = new URL(u); return x.protocol === 'https:' ? x.href : '#'; } catch { return '#'; } };

/* ---------- Thème clair / sombre ---------- */
(() => {
  const root = document.documentElement, btn = $('#theme-toggle');
  const apply = (t) => {
    root.setAttribute('data-theme', t);
    $('[data-icon="sun"]', btn).classList.toggle('hidden', t === 'light');
    $('[data-icon="moon"]', btn).classList.toggle('hidden', t !== 'light');
    try { localStorage.setItem('theme', t); } catch { /* ignoré */ }
  };
  apply(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  btn.addEventListener('click', () => apply(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'));
})();

/* ---------- Menu mobile + lien actif ---------- */
(() => {
  const menu = $('#menu'), burger = $('#burger');
  const setOpen = (o) => {
    menu.classList.toggle('hidden', !o); menu.classList.toggle('flex', o);
    burger.setAttribute('aria-expanded', String(o));
  };
  burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  const links = $$('a.nav-link', menu);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.setAttribute('aria-current', String(a.hash === '#' + en.target.id)));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['accueil', 'projets', 'experiences', 'blog'].forEach((id) => spy.observe(document.getElementById(id)));
})();

/* ---------- Carrousel profils + logos (hero) ---------- */
(() => {
  const PROFILES = [
    { techs: [['HTML5', 'html5'], ['CSS3', 'css3'], ['JavaScript', 'javascript']] },
    { techs: [['Python', 'python'], ['PHP', 'php'], ['Kotlin', 'kotlin']] },
    { techs: [['React', 'react'], ['Node.js', 'nodejs'], ['Next.js', 'nextjs']] },
    { techs: [['Three.js', 'threejs'], ['Phaser', 'phaser']] },
    { techs: [['MySQL', 'mysql'], ['PostgreSQL', 'postgresql'], ['Supabase', 'supabase']] },
    { techs: [['Git', 'git'], ['GitHub', 'github'], ['Linux', 'linux']] },
  ];
  const track = $('#tech-track'), role = $('#profile-role'), dots = $('#profile-dots');
  let i = 0, timer;

  PROFILES.forEach((p, k) => {
    const d = h('button', { type: 'button', class: 'dot', role: 'tab', 'aria-label': p.role, 'aria-current': 'false' });
    d.addEventListener('click', () => { go(k); restart(); });
    dots.append(d);
  });

  function render() {
    const p = PROFILES[i];
    role.textContent = p.role;
    track.replaceChildren(...p.techs.map(([name, file]) => h('li', { class: 'flex flex-col items-center gap-2' },
      h('img', { src: `img/tech/${file}.svg`, alt: `Logo officiel ${name}`, width: 64, height: 64, class: 'h-14 w-14 sm:h-16 sm:w-16', loading: 'lazy' }),
      h('span', { class: 'text-sm', text: name }))));
    $$('.dot', dots).forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
  }
  const go = (n) => { i = (n + PROFILES.length) % PROFILES.length; render(); };
  const restart = () => { clearInterval(timer); if (!reduceMotion) timer = setInterval(() => go(i + 1), 4500); };
  $$('[data-profile]').forEach((b) => b.addEventListener('click', () => { go(i + Number(b.dataset.profile)); restart(); }));
  const box = $('#profile-carousel');
  box.addEventListener('mouseenter', () => clearInterval(timer));
  box.addEventListener('mouseleave', restart);
  box.addEventListener('focusin', () => clearInterval(timer));
  render(); restart();
})();

/* ---------- Expériences (Master-Detail) ---------- */
const EXPERIENCES = [
  {
    tab: 'Co-Fondateur & Data Scientist', org: 'Rushe.', date: 'Févr. 2026 – Aujourd’hui · 9 mois',
    text: 'Création d’une solution permettant d’identifier les logements avec de fortes déperditions thermiques sur un territoire donné, d’établir une priorisation des rénovations énergétiques et de contribuer à la lutte contre la précarité énergétique.',
    badges: ['Intelligence Artificielle (IA)', 'Analyse de données', 'Travail d’équipe']
  },
  {
    tab: 'Cordées de la réussite | Cyber Gendarme (cadet)', org: 'Lycée Léonard de Vinci de Melun / AMGN', date: 'Sept. 2025 – Aujourd’hui · 1 an 2 mois',
    text: 'Connaissances juridiques, respect du cadre légal, participation à des cérémonies officielles comme le ravivage de la flamme. Activités avec des parrains de l’école de la gendarmerie et découverte des structures militaires. Participation à des ateliers et simulations d’enquêtes (ex : identification de comportements problématiques en ligne) avec respect strict des procédures et de l’éthique.',
    badges: ['Cybersécurité', 'Cadre légal', 'Éthique']
  },
  {
    tab: 'Ingénieur IA (Stage)', org: 'My Super Academia', date: 'Mai 2026 – Juil. 2026 · 3 mois',
    text: 'Apprentissage des fondamentaux du développement web. Conception et développement de composants front-end. Conception et développement d’agents IA. Élaboration de tests d’agents IA (système multi-agents Hermes). Automatisation de workflows. Initiation au déploiement d’applications web. Veille technologique sur l’intelligence artificielle agentique.',
    badges: ['React 19', 'Supabase', 'Three.js', 'Phaser', 'Agents IA', 'n8n', 'QA & Tests']
  },
  {
    tab: 'Data Scientist', org: 'Evolukid – programme KESK’IA', date: 'Févr. 2026 – Juil. 2026 · 6 mois',
    text: 'Sélectionné parmi une dizaine de candidats pour représenter les Yvelines (78) et les Hauts-de-Seine (92) dans le programme KESK’IA saison 4, en partenariat avec le groupe Crédit Agricole. Développement d’une solution intelligente (IA) Rushe, capable d’identifier les logements à forte déperdition thermique sur un territoire donné.',
    badges: ['Intelligence Artificielle (IA)', 'Data Science', 'Python']
  },
  {
    tab: 'Nuit du Code | Concours national en ligne', org: 'Lycée Rosa Parks', date: 'Janv. 2024 – Juin 2024 · 6 mois',
    text: 'Développement d’un projet en équipe en HTML, CSS et JavaScript dans un temps limité (tenisbymze.netlify.app).',
    badges: ['JavaScript', 'Collaboration', 'Algorithmique']
  },
  {
    tab: 'Passe ton hack d’abord | Concours national', org: 'Concours en ligne – Montgeron', date: 'Déc. 2023 – Janv. 2024 · 2 mois',
    text: '7ᵉ place sur +5 000 participants, tous niveaux d’études confondus. Accès à un compte bancaire sans identifiants en modifiant le code source du site. Utilisation d’OSINT pour trouver la localisation d’un lieu de tournage à partir d’un clip vidéo. Décryptage d’un message historique de guerre d’un soldat, chiffré selon une méthode ancienne.',
    badges: ['OSINT', 'Cryptographie', 'Reverse Engineering', 'Web Hacking']
  },
  {
    tab: 'Hack mon Lycée | Concours national', org: 'Concours national', date: '2024',
    text: '190ᵉ place sur 744 participants. Résolution de défis techniques, développement d’idées innovantes sous contrainte de temps et de sécurité.',
    badges: ['Sécurité', 'CTF', 'Résolution de problèmes']
  },
  {
    tab: 'Développeur informatique (Stage)', org: 'DIGITAL', date: 'Janv. 2022 · 1 mois',
    text: 'Initiation aux langages informatiques (Pascal) et à l’algorithmique (boucles, conditions, fonctions).',
    badges: ['Algorithmique', 'Pascal']
  },
  {
    tab: 'Certification – Les bases de l’IA 2026', org: 'The Canva Team – Canva Design School', date: 'Émis le 21 octobre 2026',
    text: 'Certificat de complétion officielle : Les bases de l’IA 2026. ID d’accréditation : cc3df3.',
    badges: ['Intelligence Artificielle (IA)', 'Certification'], cert: true
  },
];

(() => {
  const list = $('#xp-list');
  let current = -1, lockUntil = 0;

  EXPERIENCES.forEach((x, k) => {
    const li = h('li', { role: 'presentation' },
      h('button', { type: 'button', role: 'option', class: 'xp-item glass w-full rounded-[1.5rem] px-5 py-4 text-left text-lg font-semibold transition hover:bg-[rgba(129,104,255,.3)]', 'aria-selected': 'false', 'data-i': k },
        h('span', { class: 'block text-sm font-normal text-muted', text: x.date }), x.tab));
    list.append(li);
  });

  function show(i, fromScroll = false) {
    if (i === current) return;
    current = i;
    const x = EXPERIENCES[i];
    $('#xp-detail-org').textContent = x.org;
    $('#xp-detail-title').textContent = x.tab;
    $('#xp-detail-date').textContent = x.date;
    $('#xp-detail-text').textContent = x.text;
    $('#xp-detail-badges').replaceChildren(...x.badges.map((b) => h('li', { class: 'badge', text: b })));
    $$('.xp-item', list).forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
    if (!fromScroll) lockUntil = Date.now() + 700;
  }

  list.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) show(Number(b.dataset.i)); });
  list.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const n = Math.min(EXPERIENCES.length - 1, Math.max(0, current + (e.key === 'ArrowDown' ? 1 : -1)));
      show(n); $$('.xp-item', list)[n].scrollIntoView({ block: 'nearest' });
    }
  });
  /* Sélection pilotée par le défilement : la position de scroll est mappée sur l'index */
  list.addEventListener('scroll', () => {
    if (Date.now() < lockUntil) return;
    const max = list.scrollHeight - list.clientHeight;
    if (max <= 0) return;
    show(Math.round((list.scrollTop / max) * (EXPERIENCES.length - 1)), true);
  }, { passive: true });

  /* Certifications – bande défilante basse */
  const cert = EXPERIENCES.findIndex((x) => x.cert);
  const item = () => h('button', { type: 'button', class: 'whitespace-nowrap px-4 text-lg font-semibold hover:text-teal-text', 'data-cert': cert },
    '🎓 Certificat officiel · Les bases de l’IA 2026 · Canva Design School · ID cc3df3 · 21 oct. 2026');
  const track = $('#cert-track');
  for (let n = 0; n < 6; n++) track.append(item());   // 6 copies : la moitié (3) boucle sans coupure
  track.addEventListener('click', (e) => { if (e.target.closest('[data-cert]')) { show(cert); $('#xp-detail').scrollIntoView({ behavior: 'smooth', block: 'center' }); } });

  show(0);
})();

/* ---------- Blog / Veille (API Dev.to, CORS ouvert) ---------- */
(() => {
  const TOPICS = {
    'IA Médicale': ['healthcare', 'healthtech'],
    'Cybersécurité PME': ['cybersecurity', 'security'],
    'VibeCoding': ['vibecoding', 'cursor'],
    'Outils DevOps': ['devops', 'cicd'],
  };
  const FALLBACK = Object.entries(TOPICS).map(([topic, tags], k) => ({
    id: 'fb' + k, topic, title: `Veille ${topic} : flux Dev.to indisponible`, description: `Le flux en direct n’a pas pu être chargé. Consultez directement les publications Dev.to sur #${tags[0]}.`,
    url: `https://dev.to/t/${tags[0]}`, tags: [tags[0]], date: '', cover: '', author: 'Dev.to',
  }));
  const CACHE_KEY = 'veille-v1', TTL = 30 * 60 * 1000;
  const track = $('#blog-track'), status = $('#blog-status'), search = $('#blog-search'), filters = $('#blog-filters');
  let articles = [], topic = 'Tous', query = '';

  ['Tous', ...Object.keys(TOPICS)].forEach((t) => {
    const b = h('button', { type: 'button', class: 'badge hover:bg-[rgba(129,104,255,.4)] aria-pressed:bg-[rgba(95,209,198,.3)] aria-pressed:border-[#5fd1c6]', 'aria-pressed': String(t === 'Tous'), text: t });
    b.addEventListener('click', () => { topic = t; $$('button', filters).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); draw(); });
    filters.append(b);
  });

  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function visible() {
    const q = norm(query.trim());
    return articles.filter((a) => (topic === 'Tous' || a.topic === topic) &&
      (!q || norm(`${a.title} ${a.description} ${a.tags.join(' ')} ${a.tags.map((t) => '#' + t).join(' ')}`).includes(q)));
  }
  function card(a) {
    const date = a.date ? new Date(a.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    return h('article', { class: 'glass flex h-full w-[min(85vw,22rem)] flex-col overflow-hidden rounded-[1.75rem]' },
      a.cover ? h('img', { src: safeUrl(a.cover), alt: `Illustration de l’article : ${a.title}`, loading: 'lazy', width: 440, height: 200, class: 'h-40 w-full object-cover', referrerpolicy: 'no-referrer' })
        : h('div', { class: 'h-40 w-full bg-gradient-to-br from-[#2b2bb8] to-[#6d3df0]', 'aria-hidden': 'true' }),
      h('div', { class: 'flex flex-1 flex-col gap-3 p-5' },
        h('p', { class: 'text-xs font-semibold uppercase tracking-wide text-teal-text', text: `${a.topic}${date ? ' · ' + date : ''}` }),
        h('h3', { class: 'line-clamp-3 text-lg font-bold leading-snug', text: a.title }),
        h('p', { class: 'line-clamp-3 text-sm text-muted', text: a.description }),
        h('ul', { class: 'flex flex-wrap gap-1 text-xs text-muted', 'aria-label': 'Hashtags' }, a.tags.slice(0, 4).map((t) => h('li', { text: '#' + t }))),
        h('a', { class: 'btn-ghost mt-auto !h-10 text-sm', href: safeUrl(a.url), target: '_blank', rel: 'noopener noreferrer' }, 'Lire l’article')));
  }
  function draw() {
    const list = visible();
    track.replaceChildren(...(list.length ? list.map(card) : [h('p', { class: 'p-6 text-muted', text: 'Aucun article ne correspond à votre recherche.' })]));
    track.scrollTo({ left: 0 });
  }

  async function fetchTag(tag, topicName) {
    const r = await fetch(`https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=6&top=30`, { headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return (await r.json()).map((x) => ({
      id: x.id, topic: topicName, title: String(x.title || ''), description: String(x.description || ''), url: x.url,
      tags: Array.isArray(x.tag_list) ? x.tag_list.map(String) : String(x.tag_list || '').split(',').map((s) => s.trim()).filter(Boolean),
      date: x.published_at || '', cover: x.cover_image || x.social_image || '', author: x.user && x.user.name,
    }));
  }
  async function load() {
    try {
      const c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (c && Date.now() - c.t < TTL) { articles = c.a; status.textContent = `${articles.length} articles · source Dev.to`; return draw(); }
    } catch { /* pas de cache */ }
    status.textContent = 'Chargement de la veille…';
    const jobs = Object.entries(TOPICS).flatMap(([name, tags]) => tags.map((t) => fetchTag(t, name)));
    const res = (await Promise.allSettled(jobs)).filter((r) => r.status === 'fulfilled').flatMap((r) => r.value);
    const seen = new Set();
    articles = res.filter((a) => !seen.has(a.id) && seen.add(a.id)).sort((a, b) => new Date(b.date) - new Date(a.date));
    if (!articles.length) { articles = FALLBACK; status.textContent = 'Flux en direct indisponible : liens vers les thèmes Dev.to.'; }
    else {
      status.textContent = `${articles.length} articles · source Dev.to · actualisé à l’ouverture de la page`;
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), a: articles })); } catch { /* ignoré */ }
    }
    draw();
  }

  /* Recherche en temps réel avec debounce */
  search.form.addEventListener('submit', (e) => e.preventDefault());
  search.addEventListener('input', debounce(() => { query = search.value; draw(); }, 250));
  const step = () => Math.max(280, track.clientWidth * 0.8);
  $('#blog-prev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  $('#blog-next').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  load();
})();

/* ---------- Toast ---------- */
const toast = (() => {
  const el = $('#toast'); let t;
  return (ok, msg) => {
    el.replaceChildren(h('span', { 'aria-hidden': 'true', text: ok ? '✔' : '✖' }), h('span', { text: msg }));
    el.classList.toggle('bg-emerald-600/85', ok); el.classList.toggle('bg-red-600/85', !ok);
    el.dataset.show = 'true';
    clearTimeout(t); t = setTimeout(() => { el.dataset.show = 'false'; }, 4000);
  };
})();

/* ---------- Formulaire de contact (FormSubmit, AJAX) ---------- */
(() => {
  const form = $('#contact-form'), btn = $('#f-submit');
  const ENDPOINT = 'https://formsubmit.co/ajax/mze.abdallahsoilihi@gmail.com';
  /** Anti-XSS : retire balises, caractères de contrôle et neutralise < > " ' & */
  const clean = (v) => String(v)
    .replace(/<[^>]*>?/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    .trim();
  const emailOk = (v) => /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(v);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = new FormData(form);
    if (d.get('_honey')) return;                                    // honeypot anti-bot
    const data = { nom: clean(d.get('nom')), email: clean(d.get('email')), objet: clean(d.get('objet')), message: clean(d.get('message')) };
    if (!data.nom || !data.objet || !data.message || !emailOk(String(d.get('email')).trim())) {
      form.reportValidity?.(); return toast(false, 'Échec de l’envoi. Veuillez réessayer.');
    }
    const label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Envoi en cours...';
    try {
      const r = await fetch(ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _subject: `[Portfolio] ${data.objet}`, _captcha: 'false', _template: 'table' }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || String(j.success) === 'false') throw new Error('envoi refusé');
      toast(true, 'Message envoyé avec succès !'); form.reset();
    } catch { toast(false, 'Échec de l’envoi. Veuillez réessayer.'); }
    finally { btn.disabled = false; btn.textContent = label; }
  });
})();

/* ---------- Docs + (widget flottant global) ---------- */
(() => {
  const button = document.getElementById('docs-fab');
  const panel = document.getElementById('docs-panel');
  const closeBtn = document.getElementById('docs-panel-close');
  const body = document.getElementById('docs-panel-body');
  const footerButton = document.getElementById('docs-btn');

  if (!button || !panel || !body) return;

  const triggers = [button, footerButton].filter(Boolean);
  let activeTrigger = button;

  const documentIcon = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.8');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M7 3h7l5 5v13H7zM14 3v6h5M10 13h6m-6 4h6');
    svg.append(path);
    return svg;
  };

  const setOpen = (open, restoreFocus = false, trigger = button) => {
    panel.hidden = !open;
    triggers.forEach((element) => element.setAttribute('aria-expanded', String(open)));
    button.classList.toggle('is-open', open);
    if (open) {
      activeTrigger = trigger;
      button.setAttribute('aria-label', 'Fermer Docs +');
      closeBtn?.focus({ preventScroll: true });
    } else {
      button.setAttribute('aria-label', 'Ouvrir Docs +');
      if (restoreFocus && activeTrigger.isConnected) activeTrigger.focus({ preventScroll: true });
    }
  };

  const createItem = (doc) => {
    if (!doc || typeof doc.label !== 'string' || !doc.label.trim()) {
      console.error('Docs+ : document ignoré, son nom est manquant.');
      return null;
    }
    if (typeof doc.href !== 'string' || !doc.href.trim()) return null;

    let url;
    try {
      url = new URL(doc.href, document.baseURI);
    } catch {
      console.error(`Docs+ : URL invalide pour « ${doc.label} ».`);
      return null;
    }
    if (url.protocol !== 'https:' && url.origin !== location.origin) {
      console.error(`Docs+ : URL non autorisée pour « ${doc.label} ».`);
      return null;
    }

    const wrapper = h('article', { class: 'docs-doc' });

    const main = h('div', { class: 'docs-doc__main' },
      h('span', { class: 'docs-doc__icon', 'aria-hidden': 'true' }, documentIcon()),
      h('div', { class: 'docs-doc__text' },
        h('span', { class: 'docs-doc__label', text: doc.label }),
        doc.description ? h('span', { class: 'docs-doc__description', text: doc.description }) : null
      )
    );

    const actions = h('div', { class: 'docs-doc__actions' },
      h('a', {
        class: 'docs-doc__action',
        href: url.href,
        target: '_blank',
        rel: 'noopener noreferrer',
      }, 'Consulter')
    );

    if (doc.download) {
      actions.append(h('a', {
        class: 'docs-doc__action docs-doc__download',
        href: url.href,
        download: true,
        'aria-label': `Télécharger ${doc.label}`,
        title: `Télécharger ${doc.label}`,
      }, h('span', { 'aria-hidden': 'true', text: '↓' })));
    }

    wrapper.append(main, actions);
    return wrapper;
  };

  const render = () => {
    const config = window.DOCS_CONFIG;
    if (!config || !Array.isArray(config.sections)) {
      console.error('Docs+ : configuration des documents manquante ou invalide.');
      return;
    }

    const sections = config.sections.map((section) => {
      if (!section || typeof section.title !== 'string' || !Array.isArray(section.items)) {
        console.error('Docs+ : section ignorée, sa configuration est invalide.');
        return null;
      }

      const items = section.items.map(createItem).filter(Boolean);
      if (!items.length) return null;

      const sectionWrap = h('section', { class: 'docs-panel__section' },
        h('h3', { class: 'docs-panel__section-title', text: section.title })
      );
      const list = h('div', { class: 'docs-panel__list' });
      list.append(...items);
      sectionWrap.append(list);
      return sectionWrap;
    }).filter(Boolean);

    const container = h('div', { class: 'docs-panel__sections' });
    container.append(...sections);
    body.replaceChildren(container);
  };

  button.addEventListener('click', () => setOpen(panel.hidden, true, button));

  if (closeBtn) {
    closeBtn.addEventListener('click', () => setOpen(false, true));
  }

  if (footerButton) {
    footerButton.addEventListener('click', () => setOpen(panel.hidden, true, footerButton));
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      setOpen(false, true);
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof Node && !panel.hidden && !panel.contains(target)
      && !triggers.some((element) => element.contains(target))) {
      setOpen(false);
    }
  });

  render();
})();