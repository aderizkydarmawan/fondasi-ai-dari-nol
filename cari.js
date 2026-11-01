/* Pencarian: judul pelajaran, subjudul (h2), glosarium, dan simbol rumus. Semua di browser, tanpa server. */
(function(){
  var L = window.LESSONS || {}, idx = null;
  var norm = function(t){ return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim(); };
  var plain = function(h){ return String(h).replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' '); };
  var esc = function(t){ return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var slug = function(id){ return 'p' + id.replace(/\./g, '-'); };
  function order(){ var o = []; (window.KURIKULUM || []).forEach(function(l){ l.items.forEach(function(it){ if(L[it.id]) o.push(it.id); }); }); return o; }

  function build(){
    var o = order(), items = [], teks = {};
    o.forEach(function(id){
      var x = L[id]; teks[id] = norm(plain(x.title + ' ' + x.why + ' ' + x.body));
      items.push({ k: 'Pelajaran', t: id + ' · ' + x.title, d: plain(x.why).slice(0, 120) + '…', h: '#' + slug(id), s: norm(id + ' ' + x.title), w: 3 });
      (x.body.match(/<h2>([\s\S]*?)<\/h2>/g) || []).forEach(function(h){
        var t = plain(h.replace(/<small>[\s\S]*?<\/small>/, '')).trim();
        items.push({ k: 'Subjudul', t: t, d: 'di ' + id + ' · ' + x.title, h: '#' + slug(id), s: norm(t), w: 2 });
      });
    });
    var G = window.GLOSARIUM || {};
    Object.keys(G).forEach(function(term){
      var n = norm(term), di = o.filter(function(id){ return teks[id].indexOf(n) >= 0; })[0];
      items.push({ k: 'Glosarium', t: term, d: G[term] + (di ? ' Pertama muncul di ' + di + '.' : ''), h: di ? '#' + slug(di) : null, s: n, w: 2 });
    });
    var S = (window.LEG && window.LEG.SIMBOL) || {};
    Object.keys(S).forEach(function(sym){
      var m = S[sym].match(/\((\d\.\d+)\)/), di = m && L[m[1]] ? m[1] : null;
      items.push({ k: 'Simbol', t: sym, d: S[sym], h: di ? '#' + slug(di) : null, s: norm(sym + ' ' + S[sym]), sym: sym, w: 1 });
    });
    return items;
  }

  function cari(q){
    idx = idx || build();
    var n = norm(q); if(!n) return [];
    var kata = n.split(' ');
    return idx.map(function(it){
      var skor = 0;
      if(it.sym && it.sym === q.trim()) skor = 100;
      else if(kata.every(function(w){ return it.s.indexOf(w) >= 0; })) skor = it.w * 10 + (it.s.indexOf(n) === 0 ? 5 : 0) + (it.s === n ? 20 : 0);
      return { it: it, skor: skor };
    }).filter(function(r){ return r.skor > 0; }).sort(function(a, b){ return b.skor - a.skor; }).slice(0, 30).map(function(r){ return r.it; });
  }

  var box = document.createElement('div');
  box.id = 'cari'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Cari di situs');
  box.innerHTML = '<div class="cari-in"><div class="cari-h"><label for="cariQ">Cari judul, istilah, atau simbol</label><button type="button" class="x" id="cariX">Tutup <kbd>Esc</kbd></button></div>' +
    '<input id="cariQ" type="search" autocomplete="off" spellcheck="false" placeholder="misalnya: softmax, varians, ∇, Bayes">' +
    '<p class="cari-n" role="status" aria-live="polite"></p><ul class="cari-r"></ul></div>';
  document.body.appendChild(box);
  var q = box.querySelector('#cariQ'), ul = box.querySelector('.cari-r'), info = box.querySelector('.cari-n'), balik = null;

  function tampil(){
    var v = q.value, r = cari(v);
    info.textContent = v.trim() ? (r.length ? r.length + (r.length === 30 ? '+' : '') + ' hasil' : 'Tidak ada hasil. Coba kata lain, misalnya bahasa Inggris istilahnya.') : '';
    ul.innerHTML = r.map(function(it){
      var isi = '<span class="ck">' + it.k + '</span><b>' + esc(it.t) + '</b><span class="cd">' + esc(it.d) + '</span>';
      return '<li>' + (it.h ? '<a href="' + it.h + '">' + isi + '</a>' : '<div>' + isi + '</div>') + '</li>';
    }).join('');
  }
  var t = null;
  q.addEventListener('input', function(){ clearTimeout(t); t = setTimeout(tampil, 80); });
  q.addEventListener('keydown', function(e){ if(e.key === 'Enter'){ var a = ul.querySelector('a'); if(a){ e.preventDefault(); a.click(); } } });

  function buka(on){
    box.classList.toggle('open', on);
    var b = document.getElementById('cariBtn'); if(b) b.setAttribute('aria-expanded', on);
    if(on){ balik = document.activeElement; setTimeout(function(){ q.focus(); q.select(); }, 30); }
    else if(balik && balik.focus){ balik.focus(); }
  }
  window.bukaCari = buka;
  box.querySelector('#cariX').addEventListener('click', function(){ buka(false); });
  box.addEventListener('click', function(e){ if(e.target === box) buka(false); else if(e.target.closest('a')){ balik = null; buka(false); } });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && box.classList.contains('open')){ buka(false); return; }
    var tag = (e.target.tagName || '').toLowerCase();
    if(e.key === '/' && tag !== 'input' && tag !== 'textarea' && !e.target.isContentEditable){ e.preventDefault(); buka(true); }
    if(box.classList.contains('open') && e.key === 'Tab'){
      var f = box.querySelectorAll('button, input, a'), a = f[0], z = f[f.length - 1];
      if(e.shiftKey && document.activeElement === a){ e.preventDefault(); z.focus(); }
      else if(!e.shiftKey && document.activeElement === z){ e.preventDefault(); a.focus(); }
    }
  });
  var btn = document.getElementById('cariBtn'); if(btn) btn.addEventListener('click', function(){ buka(true); });
})();
