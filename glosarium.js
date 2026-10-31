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
  'fungsi aktivasi': 'Fungsi yang diterapkan pada hasil neuron, misalnya ReLU: max(0, z).',
  'limit': 'Nilai yang didekati sebuah ekspresi ketika sesuatu dibuat makin kecil atau makin besar.',
  'turunan': 'Laju perubahan sesaat: kemiringan garis singgung di satu titik.',
  'turunan parsial': 'Turunan terhadap satu variabel, sementara variabel lain dianggap tetap.',
  'gradien': 'Vektor berisi semua turunan parsial. Menunjuk arah naik paling curam.',
  'integral': 'Jumlah dari potongan-potongan yang sangat kecil; misalnya luas di bawah kurva.',
  'determinan': 'Angka yang menyatakan berapa kali sebuah matriks mengalikan luas (atau volume).',
  'nilai eigen': 'Faktor regangan λ pada arah yang tidak dibelokkan matriks: Av = λv.',
  'vektor eigen': 'Arah yang tidak dibelokkan oleh matriks, hanya diregangkan.',
  'distribusi': 'Daftar semua nilai yang mungkin beserta peluangnya.',
  'ekspektasi': 'Rata-rata berbobot peluang: pusat massa sebuah distribusi.',
  'kovarians': 'Ukuran apakah dua variabel cenderung naik bersama (positif) atau berlawanan (negatif).',
  'korelasi': 'Kovarians yang dibagi kedua simpangan baku, sehingga selalu di antara −1 dan 1.',
  'prior': 'Keyakinan sebelum melihat bukti.',
  'posterior': 'Keyakinan setelah memperhitungkan bukti, dihitung dengan teorema Bayes.',
  'likelihood': 'Seberapa cocok data yang teramati kalau sebuah hipotesis atau parameter benar.',
  'learning rate': 'Ukuran langkah gradient descent: berapa jauh bobot digeser setiap kali.',
  'loss': 'Angka yang mengukur seberapa salah model. Pelatihan berusaha membuatnya sekecil mungkin.',
  'mini-batch': 'Segenggam contoh data acak yang dipakai untuk menghitung satu langkah gradien.',
  'entropi': 'Ketidakpastian rata-rata sebuah distribusi: makin rata peluangnya, makin besar entropinya.',
  'overfitting': 'Model menghafal data latih termasuk deraunya, sehingga gagal pada data baru.',
  'kernel': 'Pola angka kecil yang digeser di atas data dalam konvolusi.',
  'fungsi partisi': 'Z, penjumlah faktor Boltzmann supaya semua peluang berjumlah 1.',
  'logit': 'Skor mentah sebuah model sebelum diubah menjadi peluang oleh softmax atau sigmoid.',
  'sigmoid': 'Fungsi 1/(1 + e^(−z)) yang memeras angka berapa pun ke antara 0 dan 1.',
  'token': 'Potongan teks (kata, bagian kata, atau tanda baca) yang dibaca model bahasa.',
  'attention': 'Cara setiap token menimbang token lain berdasarkan kecocokan query dan key.',
  'imbalan': 'Angka yang diterima agen RL setelah bertindak; tanda baik atau buruknya aksi.',
  'volatilitas': 'Seberapa liar harga bergoyang, diukur sebagai simpangan baku perubahan log harga per tahun.'
};
window.glosarium = function(root){
  var G = window.GLOSARIUM, keys = Object.keys(G).sort(function(a, b){ return b.length - a.length; });
  var seen = {}, re = new RegExp('(^|[^\\p{L}])(' + keys.join('|') + ')(?![\\p{L}])', 'iu');
  var walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function(n){
    var p = n.parentElement; if(!p || p.closest('.tx, .katex, pre, code, h1, h2, h3, a, button, .gl, .viz, .ex .q, .src, .meta, figure, .why b')) return NodeFilter.FILTER_REJECT;
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
