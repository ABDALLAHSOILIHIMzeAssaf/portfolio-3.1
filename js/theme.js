/* Applique le thème avant le rendu pour éviter le flash (script externe : compatible CSP) */
(function () {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
  } catch (e) { /* stockage indisponible : thème sombre par défaut */ }
})();
