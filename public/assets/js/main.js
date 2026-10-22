/* N-CONSULT SOLUTIONS — interactions du site */
(function () {
  document.documentElement.classList.add('js');

  // En-tête : ombre au défilement
  var header = document.querySelector('.header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  // Apparition au défilement
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Compteurs (chiffres clés)
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    var started = false;
    new IntersectionObserver(function (entries, obs) {
      if (!entries[0].isIntersecting || started) return;
      started = true; obs.disconnect();
      var t0 = null;
      function tick(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / 1400, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, { threshold: 0.5 }).observe(el);
  });

  // Duplication du bandeau références pour un défilement continu
  document.querySelectorAll('.logos-track').forEach(function (track) {
    track.innerHTML += track.innerHTML;
    Array.prototype.slice.call(track.children, track.children.length / 2).forEach(function (c) { c.setAttribute('aria-hidden', 'true'); });
  });

  // Année du pied de page
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ---------- Catalogue Académie ----------
  var grid = document.getElementById('catalog');
  if (grid && window.FORMATIONS) {
    var LABELS = { junior: 'Niveau 1 · Junior', intermediaire: 'Niveau 2 · Intermédiaire', senior: 'Niveau 3 · Senior' };
    var data = window.FORMATIONS;
    var current = 'all';
    var input = document.getElementById('search');
    var empty = document.getElementById('empty');

    document.querySelectorAll('[data-filter-count]').forEach(function (el) {
      var k = el.getAttribute('data-filter-count');
      el.textContent = k === 'all' ? data.length : data.filter(function (f) { return f.niveau === k; }).length;
    });

    function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

    function render() {
      var q = norm(input ? input.value.trim() : '');
      var list = data.map(function (f, i) { return Object.assign({ i: i }, f); }).filter(function (f) {
        return (current === 'all' || f.niveau === current) &&
          (!q || norm(f.titre + ' ' + f.intro + ' ' + f.programme.join(' ')).indexOf(q) > -1);
      });
      grid.innerHTML = list.map(function (f) {
        return '<article class="card course" tabindex="0" role="button" data-i="' + f.i + '">' +
          '<span class="lvl lvl--' + f.niveau + '">' + LABELS[f.niveau] + '</span>' +
          '<h3>' + esc(f.titre) + '</h3><p>' + esc(f.intro) + '</p>' +
          '<span class="link-arrow">Voir la fiche <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span>' +
          '</article>';
      }).join('');
      if (empty) empty.style.display = list.length ? 'none' : 'block';
    }

    document.querySelectorAll('.filter').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.filter').forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
        b.classList.add('active'); b.setAttribute('aria-pressed', 'true');
        current = b.getAttribute('data-filter');
        render();
      });
    });
    if (input) input.addEventListener('input', render);

    var modal = document.getElementById('course-modal');
    function open(i) {
      var f = data[i];
      modal.querySelector('.lvl').className = 'lvl lvl--' + f.niveau;
      modal.querySelector('.lvl').textContent = LABELS[f.niveau];
      modal.querySelector('[data-f="titre"]').textContent = f.titre;
      modal.querySelector('[data-f="intro"]').textContent = f.intro;
      modal.querySelector('[data-f="public"]').textContent = f.public;
      modal.querySelector('[data-f="prerequis"]').textContent = f.prerequis;
      modal.querySelector('[data-f="objectifs"]').innerHTML = f.objectifs.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('');
      modal.querySelector('[data-f="programme"]').innerHTML = f.programme.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('');
      modal.querySelector('[data-f="cta"]').href = 'contact.html?objet=formation&sujet=' + encodeURIComponent(f.titre);
      modal.showModal();
    }
    grid.addEventListener('click', function (e) { var c = e.target.closest('.course'); if (c) open(+c.getAttribute('data-i')); });
    grid.addEventListener('keydown', function (e) {
      var c = e.target.closest('.course');
      if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(+c.getAttribute('data-i')); }
    });
    modal.querySelector('.modal-close').addEventListener('click', function () { modal.close(); });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });

    render();
  }

  // ---------- Formulaire de contact ----------
  var form = document.getElementById('contact-form');
  if (form) {
    var params = new URLSearchParams(location.search);
    var objet = params.get('objet');
    if (objet && form.objet.querySelector('option[value="' + objet + '"]')) form.objet.value = objet;
    if (params.get('sujet')) form.message.value = 'Bonjour,\n\nJe souhaite recevoir le programme détaillé de la formation « ' + params.get('sujet') + ' ».\n\n';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('form-status');
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var to = form.getAttribute('data-to');
      var subject = '[Site web] ' + form.objet.options[form.objet.selectedIndex].text + ' — ' + form.nom.value;
      var body = [
        'Nom : ' + form.nom.value,
        'Société : ' + (form.societe.value || '-'),
        'E-mail : ' + form.email.value,
        'Téléphone : ' + (form.tel.value || '-'),
        'Objet : ' + form.objet.options[form.objet.selectedIndex].text,
        '',
        form.message.value
      ].join('\n');
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      status.textContent = 'Votre messagerie va s’ouvrir avec votre demande pré-remplie. Merci, nous vous répondrons rapidement.';
    });
  }
})();
