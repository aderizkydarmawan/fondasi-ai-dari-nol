/* Glosarium: kemunculan pertama tiap istilah di sebuah pelajaran bisa diketuk untuk melihat artinya.
   Definisi mengikuti OpenStax Prealgebra 2e / Elementary Algebra 2e / Introductory Statistics 2e. */
window.GLOSARIUM = {
  'bilangan bulat': 'Bilangan tanpa pecahan: …, −2, −1, 0, 1, 2, …',
  'garis bilangan': 'Garis lurus tempat setiap bilangan punya titik. Makin ke kanan, makin besar.',
  'nilai mutlak': 'Jarak sebuah bilangan dari nol, selalu positif atau nol. |−7| = 7.',
  'bobot': 'Angka pengali untuk setiap input neuron. Bobot besar berarti input itu berpengaruh besar.',
  'bias': 'Angka yang ditambahkan setelah semua input dikali bobot, menggeser hasil naik atau turun.',
  'neuron': 'Unit hitung terkecil di jaringan saraf: kalikan input dengan bobot, jumlahkan, tambah bias.',
  'pembilang': 'Angka di atas garis pecahan: berapa bagian yang diambil.',
  'penyebut': 'Angka di bawah garis pecahan: dibagi menjadi berapa bagian sama besar.',
  'pangkat': 'Perkalian berulang. 2³ artinya 2 × 2 × 2.',
  'akar kuadrat': 'Kebalikan dari kuadrat. √49 = 7 karena 7² = 49.',
  'peluang': 'Ukuran seberapa mungkin sesuatu terjadi, dari 0 (mustahil) sampai 1 (pasti).',
  'variabel': 'Huruf yang mewakili angka yang belum diketahui atau bisa berubah-ubah.',
  'persamaan': 'Pernyataan bahwa dua ruas bernilai sama, ditulis dengan tanda =.',
  'fungsi': 'Aturan yang memberi tepat satu keluaran untuk setiap masukan.',
  'kemiringan': 'Seberapa curam sebuah garis: perubahan y dibagi perubahan x.',
  'logaritma': 'Kebalikan dari pangkat. log₂ 8 = 3 karena 2³ = 8.',
  'rata-rata': 'Jumlah semua data dibagi banyaknya data.',
  'varians': 'Rata-rata dari kuadrat jarak setiap data ke rata-ratanya. Mengukur seberapa menyebar data.',
  'simpangan baku': 'Akar kuadrat dari varians, satuannya sama dengan data aslinya.',
  'vektor': 'Daftar angka berurutan, misalnya [3, 4]. Bisa dibayangkan sebagai panah dengan arah dan panjang.',
  'matriks': 'Tabel angka yang tersusun dalam baris dan kolom.',
  'perkalian titik': 'Kalikan pasangan angka yang seposisi di dua vektor, lalu jumlahkan semuanya.',
  'laju perubahan': 'Seberapa cepat satu besaran berubah ketika besaran lain berubah.',
  'fungsi aktivasi': 'Fungsi yang diterapkan pada hasil neuron, misalnya ReLU: max(0, z).'
};
window.glosarium = function(root){
  var G = window.GLOSARIUM, keys = Object.keys(G).sort(function(a, b){ return b.length - a.length; });
  var seen = {}, re = new RegExp('(^|[^\\p{L}])(' + keys.join('|') + ')(?![\\p{L}])', 'iu');
  var walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function(n){
    var p = n.parentElement; if(!p || p.closest('pre, code, h1, h2, h3, a, button, .gl, .viz, .ex .q, .src, .meta, figure, .why b')) return NodeFilter.FILTER_REJECT;
    return re.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP; } });
  var nodes = []; while(walk.nextNode()) nodes.push(walk.currentNode);
  nodes.forEach(function(n){
    var m = n.nodeValue.match(re); if(!m) return; var key = m[2].toLowerCase(); if(seen[key]) return; seen[key] = 1;
    var start = m.index + m[1].length, word = n.nodeValue.substr(start, m[2].length);
    var rest = n.splitText(start); rest.nodeValue = rest.nodeValue.slice(word.length);
    var b = document.createElement('button'); b.type = 'button'; b.className = 'gl'; b.setAttribute('aria-expanded', 'false');
    b.innerHTML = '<span class="gw"></span><span class="gd" role="note"></span>';
    b.firstChild.textContent = word; b.lastChild.textContent = G[key];
    rest.parentNode.insertBefore(b, rest);
  });
  if(!root._gl){ root._gl = 1; root.addEventListener('click', function(e){
    var b = e.target.closest('.gl'); [].forEach.call(root.querySelectorAll('.gl[aria-expanded="true"]'), function(o){ if(o !== b) o.setAttribute('aria-expanded', 'false'); });
    if(!b) return;
    var open = b.getAttribute('aria-expanded') !== 'true', d = b.lastChild;
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    if(open){ d.style.left = '0px'; var r = d.getBoundingClientRect(), over = r.right - (document.documentElement.clientWidth - 12);
      if(over > 0) d.style.left = -Math.min(over, r.left - 12) + 'px'; }
  }); }
};
