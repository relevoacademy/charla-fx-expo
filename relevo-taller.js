/* ═══════════════════════════════════════════════════════════════════
   RELEVO · Comportamiento canónico del formato de taller
   Fuente de verdad: ../DESIGN-MASTER.md

   Tres piezas: pestañas, visor de diapositivas y copiar prompt.
   Cada una se activa sola si su marcado existe — una página sin visor
   no falla, simplemente no lo monta.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Pestañas ─────────────────────────────────────────────────────
     El estado vive en aria-selected del botón y en .on del panel.
     No hay clase .active: un solo origen de verdad por elemento. */
  function montarPestanas() {
    var lista = document.querySelector('[role="tablist"]');
    if (!lista) return;

    var tabs = Array.prototype.slice.call(lista.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    function abrir(tab, moverFoco) {
      tabs.forEach(function (t) {
        var activo = t === tab;
        t.setAttribute('aria-selected', activo ? 'true' : 'false');
        // Solo la pestaña activa queda en el recorrido de Tab. Dentro del
        // grupo se navega con flechas — es el patrón de tabs de la W3C.
        t.tabIndex = activo ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.classList.toggle('on', activo);
      });
      if (moverFoco) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { abrir(tab); });
      tab.addEventListener('keydown', function (e) {
        var salto = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (salto) {
          e.preventDefault();
          abrir(tabs[(i + salto + tabs.length) % tabs.length], true);
        } else if (e.key === 'Home') {
          e.preventDefault(); abrir(tabs[0], true);
        } else if (e.key === 'End') {
          e.preventDefault(); abrir(tabs[tabs.length - 1], true);
        }
      });
    });

    // Punto de partida: la pestaña que ya venga marcada en el HTML.
    var inicial = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0];
    abrir(inicial || tabs[0]);
  }

  /* ── Visor de diapositivas ───────────────────────────────────────
     Los puntos se generan como <button>: se llega con Tab, se activan
     con Enter y el actual se marca con aria-current. */
  function montarVisor() {
    var deck = document.querySelector('.deck');
    if (!deck) return;

    var slides = Array.prototype.slice.call(deck.querySelectorAll('.slide'));
    if (!slides.length) return;

    var contenedorPuntos = deck.querySelector('.dots');
    var anterior = deck.querySelector('[data-deck="prev"]');
    var siguiente = deck.querySelector('[data-deck="next"]');
    var contador = deck.querySelector('.count');
    var actual = 0;
    var puntos = [];

    if (contenedorPuntos) {
      slides.forEach(function (_, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'dot';
        b.setAttribute('aria-label', 'Diapositiva ' + (i + 1) + ' de ' + slides.length);
        b.addEventListener('click', function () { ir(i); });
        contenedorPuntos.appendChild(b);
        puntos.push(b);
      });
    }

    function ir(i) {
      actual = Math.max(0, Math.min(i, slides.length - 1));
      slides.forEach(function (s, n) { s.classList.toggle('on', n === actual); });
      puntos.forEach(function (p, n) {
        if (n === actual) p.setAttribute('aria-current', 'true');
        else p.removeAttribute('aria-current');
      });
      if (anterior) anterior.disabled = actual === 0;
      if (siguiente) siguiente.disabled = actual === slides.length - 1;
      if (contador) contador.textContent = (actual + 1) + ' / ' + slides.length;
    }

    if (anterior) anterior.addEventListener('click', function () { ir(actual - 1); });
    if (siguiente) siguiente.addEventListener('click', function () { ir(actual + 1); });

    document.addEventListener('keydown', function (e) {
      // Las flechas solo mueven el visor cuando su panel está a la vista,
      // y nunca mientras se escribe en un campo.
      var panel = deck.closest('.panel');
      if (panel && !panel.classList.contains('on')) return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'ArrowRight') ir(actual + 1);
      if (e.key === 'ArrowLeft') ir(actual - 1);
    });

    ir(0);
  }

  /* ── Copiar prompt ───────────────────────────────────────────────
     El texto se lee del <pre> de al lado, no de una segunda copia en
     JS: si mañana se edita el prompt en el HTML, lo que se copia
     cambia solo. Nunca hay dos versiones que se desincronicen. */
  function montarCopiar() {
    document.querySelectorAll('.copy').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        var caja = btn.closest('.prompt-box') || btn.parentElement;
        var pre = caja && caja.querySelector('pre');
        if (!pre) return;
        var texto = pre.innerText;

        try {
          await navigator.clipboard.writeText(texto);
        } catch (e) {
          // Respaldo para http:// y navegadores viejos, donde la API
          // de portapapeles no existe o está bloqueada.
          var ta = document.createElement('textarea');
          ta.value = texto;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }

        var original = btn.dataset.label || btn.textContent;
        btn.dataset.label = original;
        btn.textContent = '✔ Copiado';
        btn.classList.add('done');
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove('done');
        }, 2000);
      });
    });
  }

  /* ── Descargar como archivo ──────────────────────────────────────
     Mismo principio que copiar: el texto sale del <pre> de la propia
     página, así el archivo nunca queda desactualizado respecto de lo
     que la persona está leyendo. Si el <pre> está vacío, avisa en vez
     de bajar un archivo en blanco.

       <a class="dl-file" data-src="id-del-pre" data-nombre="archivo.txt">
     */
  function montarDescargas() {
    function bajar(nombre, texto) {
      var b = new Blob([texto], { type: 'text/plain;charset=utf-8' });
      var u = URL.createObjectURL(b);
      var a = document.createElement('a');
      a.href = u;
      a.download = nombre;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
    }

    // Solo los que arman el archivo desde un <pre>. Un .dl-file con href
    // a un archivo de verdad (un CSV, un LEEME) se deja en paz: lo baja
    // el navegador.
    document.querySelectorAll('.dl-file[data-src]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var pre = document.getElementById(el.dataset.src);
        var txt = pre ? pre.textContent.trim() : '';
        if (!txt) {
          el.classList.add('vacio');
          setTimeout(function () { el.classList.remove('vacio'); }, 2000);
          return;
        }
        bajar(el.dataset.nombre || 'relevo.txt', txt);
        el.classList.add('done');
        setTimeout(function () { el.classList.remove('done'); }, 2000);
      });
    });
  }

  function arrancar() {
    montarPestanas();
    montarVisor();
    montarCopiar();
    montarDescargas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }
})();
