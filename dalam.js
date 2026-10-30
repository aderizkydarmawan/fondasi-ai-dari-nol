/* Lapisan pendalaman per pelajaran: visualisasi, penjelasan lebih dalam, kesalahan umum, ringkasan, dan tes kertas kosong.
   Ditampilkan sesudah isi utama pelajaran (lapis0.js / lapis1.js). */
window.DALAM = {

"0.1": { viz: "numline",
deep: `<p>Matematikawan tidak "menemukan" bilangan negatif di alam; mereka <b>membangunnya</b> supaya pengurangan selalu punya jawaban. Dengan bilangan asli saja, 2 − 5 tidak bisa dihitung. Dengan menambahkan bilangan negatif, kita mendapat himpunan <b>bilangan bulat</b> ℤ = {…, −2, −1, 0, 1, 2, …}, dan pengurangan selalu berhasil.</p>
<p>Setiap bilangan a punya <b>lawan</b> −a, yaitu bilangan yang kalau dijumlahkan dengan a hasilnya 0. Dari sini, mengurangi sama dengan menambah lawannya: a − b = a + (−b). Karena itu −(−2) = 2: lawan dari lawan adalah bilangan semula.</p>
<p>Aturan tanda perkalian, (−)×(−) = (+), bukan kesepakatan sembarangan. Kalau kita ingin sifat distributif a(b + c) = ab + ac tetap berlaku untuk bilangan negatif, aturan itu <b>terpaksa</b> benar. Contoh: (−3)·(4 + (−4)) = (−3)·0 = 0. Kalau dibuka, (−3)·4 + (−3)·(−4) = −12 + (−3)·(−4). Supaya hasilnya 0, (−3)·(−4) harus 12.</p>`,
salah: ["Mengira −5 lebih besar dari −2 karena 5 lebih besar dari 2. Ingat posisi di garis bilangan: makin ke kiri, makin kecil.",
        "Menulis 3 − (−2) = 1. Tanda kurang di depan bilangan negatif berarti menghapus utang, jadi hasilnya 5."],
ringkas: ["Bilangan negatif ada supaya pengurangan selalu punya jawaban.", "a − b = a + (−b).", "(−)×(−) = (+) dipaksa oleh sifat distributif, bukan hafalan."],
uji: ["Gambar garis bilangan dan tunjukkan −4 + 6 dengan panah.", "Jelaskan dengan kata-katamu kenapa (−2)·(−5) = 10, tanpa menyebut \"aturan tanda\"."] },

"0.2": { viz: "neuron",
deep: `<p>Urutan operasi (kurung, pangkat, kali-bagi, tambah-kurang) adalah <b>konvensi penulisan</b>: kesepakatan supaya satu deret simbol hanya punya satu arti. Tanpa konvensi, 2 + 3 × 4 bisa dibaca 20 atau 14. Konvensinya memilih 14.</p>
<p>Kenapa kali didahulukan? Karena perkalian "mengikat lebih kuat". Dalam ekspresi seperti w·x + b, yang kita maksud hampir selalu "hasil kali, lalu ditambah". Konvensi ini menghemat kurung.</p>
<p>Neuron McCulloch & Pitts (1943) menjumlahkan input berbobot lalu membandingkannya dengan ambang. Neuron modern menulisnya y = σ(w·x + b): hitung w·x + b dulu, lalu masukkan ke fungsi aktivasi σ. Urutan ini persis urutan operasi: dalam kurung dulu, baru fungsi di luarnya.</p>
<p>Soal 0.1 + 0.2 ≠ 0.3: komputer menyimpan angka dalam basis 2, dan 0,1 dalam basis 2 adalah pecahan berulang tanpa akhir (seperti 1/3 = 0,333… dalam basis 10). Komputer memotongnya, jadi ada galat kecil sekitar 10⁻¹⁷. Ini bukan bug Python, tapi sifat standar IEEE 754 yang dipakai hampir semua komputer.</p>`,
salah: ["Menghitung dari kiri ke kanan tanpa melihat jenis operasi: 2 + 3 × 4 = 20 (salah), seharusnya 14.", "Membandingkan angka desimal komputer dengan == (misalnya 0.1 + 0.2 == 0.3). Gunakan pembanding dengan toleransi, seperti math.isclose."],
ringkas: ["Kurung → pangkat → kali/bagi → tambah/kurang.", "Neuron: kalikan input dengan bobot, jumlahkan, tambah bias.", "Angka desimal di komputer hampir selalu sedikit tidak persis."],
uji: ["Hitung 5 − 2 × 3 + 4² ÷ 8 di kertas, sebutkan urutan langkahnya.", "Tulis rumus neuron dengan 2 input dan hitung untuk w = [1, −2], x = [3, 1], b = 0,5."] },

"0.3": { viz: "fraction",
deep: `<p>Pecahan p/q menjawab "bagi satu utuh jadi q bagian sama besar, ambil p". Secara formal, p/q adalah bilangan yang kalau dikali q hasilnya p. Kumpulan semua pecahan disebut <b>bilangan rasional</b> ℚ.</p>
<p>Dua pecahan bisa <b>senilai</b>: 1/2 = 2/4 = 50/100. Alasannya, mengalikan pembilang dan penyebut dengan angka yang sama sama dengan mengalikan dengan 1 (misalnya 2/2). Menyederhanakan pecahan adalah langkah sebaliknya.</p>
<p>Desimal adalah pecahan dengan penyebut 10, 100, 1000, dan seterusnya. Persen adalah pecahan dengan penyebut 100. Jadi 3/4 = 0,75 = 75%: tiga tulisan untuk satu bilangan yang sama.</p>
<p>Di AI, peluang selalu berupa bilangan antara 0 dan 1, sering ditulis sebagai persen. "Model 92% yakin" artinya model memberi peluang 0,92. Perubahan "naik 5%" dan "naik 5 poin persen" juga berbeda: dari 40% ke 42% adalah naik 2 poin persen, tapi naik 5% secara relatif.</p>`,
salah: ["Menjumlahkan pecahan dengan menjumlahkan atas dan bawah: 1/2 + 1/3 ≠ 2/5. Samakan penyebut dulu: 3/6 + 2/6 = 5/6.", "Menyamakan \"naik 10%\" dengan \"naik 10 poin persen\"."],
ringkas: ["p/q = p bagian dari q bagian sama besar.", "Pecahan, desimal, dan persen hanyalah tiga tulisan untuk satu bilangan.", "Jumlahkan pecahan hanya setelah penyebutnya sama."],
uji: ["Ubah 3/8 ke desimal dan persen tanpa kalkulator.", "Jelaskan kenapa 2/4 = 1/2 memakai gambar batang."] },

"0.4": { viz: "power",
deep: `<p>Pangkat bilangan bulat positif adalah perkalian berulang: aⁿ = a × a × … × a (n kali). Dari definisi ini, aturan aᵐ·aⁿ = aᵐ⁺ⁿ langsung terlihat: m faktor ditambah n faktor.</p>
<p>Pangkat nol dan negatif didefinisikan supaya aturan itu <b>tetap berlaku</b>: a⁰ = 1 karena aⁿ·a⁰ harus sama dengan aⁿ, dan a⁻ⁿ = 1/aⁿ karena aⁿ·a⁻ⁿ harus a⁰ = 1. Akar juga pangkat: √a = a^(1/2), karena a^(1/2)·a^(1/2) = a¹.</p>
<p>Ada dua jenis pertumbuhan yang sering tertukar. <b>Pangkat tetap</b> seperti x² (variabel di bawah) dan <b>eksponen</b> seperti 2ˣ (variabel di atas). Untuk x besar, eksponen selalu menang. Itulah kenapa jumlah kombinasi kata dalam kalimat (eksponensial dalam panjang kalimat) terlalu besar untuk dihitung satu per satu, dan model bahasa harus belajar pola.</p>
<p>Notasi ilmiah (1,75 × 10¹¹) memakai pangkat sepuluh untuk menulis angka sangat besar atau kecil tanpa deretan nol yang mudah salah dihitung.</p>`,
salah: ["Menganggap 2³ = 6 (mengalikan dengan pangkat, bukan memangkatkan).", "Menulis (a + b)² = a² + b². Yang benar a² + 2ab + b²; coba dengan a = b = 1.", "Mengira a⁰ = 0."],
ringkas: ["aⁿ = perkalian berulang; aturan pangkat mengikuti dari definisi.", "a⁰ = 1 dan a⁻ⁿ = 1/aⁿ supaya aturan tetap konsisten.", "Eksponen (2ˣ) akhirnya selalu tumbuh jauh lebih cepat daripada pangkat tetap (x²)."],
uji: ["Turunkan sendiri kenapa 5⁰ = 1 memakai pola 5³, 5², 5¹.", "Tanpa kalkulator: mana lebih besar, 2¹⁰ atau 10³?"] },

"0.5": { viz: "coin",
deep: `<p>Untuk kejadian dengan hasil yang sama-sama mungkin, peluang = banyak hasil yang diinginkan ÷ banyak semua hasil. Dua koin punya empat hasil (GG, GA, AG, AA), jadi peluang dua gambar adalah 1/4.</p>
<p>Ada dua cara memaknai peluang. <b>Frekuentis</b>: peluang adalah proporsi jangka panjang kalau percobaan diulang sangat banyak kali (lihat simulasi di atas). <b>Bayesian</b>: peluang adalah derajat keyakinan yang diperbarui saat ada bukti baru. AI modern memakai keduanya, dan bab-bab berikutnya akan membahas keduanya dengan rapi.</p>
<p>Simulasi di atas menunjukkan <b>hukum bilangan besar</b>: proporsi dari percobaan acak makin mendekati peluang sebenarnya kalau jumlah percobaan bertambah. Grinstead & Snell membuka buku mereka (§1.1) dengan simulasi persis seperti ini. Hukum ini adalah alasan dasar kenapa model yang dilatih dengan lebih banyak data cenderung lebih bisa dipercaya.</p>
<p>Dua aturan dasar: kejadian saling lepas, peluangnya dijumlah (P(A atau B) = P(A) + P(B)); kejadian saling bebas, peluangnya dikali (P(A dan B) = P(A)·P(B)).</p>`,
salah: ["Kekeliruan penjudi: setelah 5 kali gambar, mengira angka \"sudah waktunya\" muncul. Koin tidak punya ingatan; peluangnya tetap 1/2.", "Mengalikan peluang kejadian yang tidak saling bebas, misalnya \"hujan\" dan \"mendung\"."],
ringkas: ["Peluang = hasil yang diinginkan ÷ semua hasil (kalau sama-sama mungkin).", "Proporsi dari banyak percobaan mendekati peluang sebenarnya.", "Saling lepas → jumlah; saling bebas → kali."],
uji: ["Daftar semua hasil melempar tiga koin. Berapa peluang tepat dua gambar?", "Jelaskan kenapa 10 lemparan saja tidak cukup untuk menilai apakah koin adil."] },

"0.6": { viz: "distance",
deep: `<p>Teorema Pythagoras: pada segitiga siku-siku dengan sisi tegak a dan b serta sisi miring c, berlaku a² + b² = c². Ada ratusan bukti. Salah satu yang paling mudah dilihat: susun empat salinan segitiga di dalam persegi bersisi (a + b). Luas persegi besar bisa dihitung dua cara, dan dari situ a² + b² = c² keluar.</p>
<p>Jarak antara titik (x₁, y₁) dan (x₂, y₂) adalah sisi miring segitiga dengan sisi Δx = x₂ − x₁ dan Δy = y₂ − y₁. Jadi d = √(Δx² + Δy²). Rumus ini disebut <b>jarak Euclid</b>.</p>
<p>Rumusnya meluas ke dimensi berapa pun: untuk vektor dengan n komponen, d = √(Σ (aᵢ − bᵢ)²). Buku VMLS (§3.2) memakai rumus ini untuk vektor fitur seperti dokumen, gambar, atau pelanggan. Algoritma k-nearest neighbors dan k-means bekerja dengan jarak ini.</p>`,
salah: ["Lupa mengakarkan: √(3² + 4²) = 5, bukan 25.", "Menjumlahkan jarak sumbu (3 + 4 = 7) dan menyebutnya jarak lurus. Itu jarak lain (jarak Manhattan), yang juga dipakai di AI tapi berbeda maknanya."],
ringkas: ["a² + b² = c² untuk segitiga siku-siku.", "Jarak Euclid = √(Δx² + Δy²), dan meluas ke banyak dimensi.", "Banyak algoritma AI mengukur kemiripan data dengan jarak."],
uji: ["Hitung jarak dari (1, 2) ke (7, 10).", "Tulis rumus jarak untuk dua titik di ruang 3 dimensi."] },

"0.7": { viz: "secant",
deep: `<p>Laju rata-rata antara dua waktu adalah perubahan posisi dibagi perubahan waktu. Laju <b>sesaat</b> adalah nilai yang didekati laju rata-rata ketika selang h dibuat makin kecil. Secara simbol: s′(t) = lim<sub>h→0</sub> (s(t + h) − s(t)) / h. Inilah definisi turunan.</p>
<p>Untuk s(t) = t², aljabarnya bisa dikerjakan sepenuhnya: (t + h)² − t² = 2th + h². Dibagi h menjadi 2t + h. Ketika h mendekati 0, sisanya 2t. Jadi turunan t² adalah 2t, dan kamu sudah melihat angkanya di tabel (4,1; 4,01; 4,001 → 4).</p>
<p>Thompson (<i>Calculus Made Easy</i>, Bab II–IV) menjelaskan ini dengan "bagian kecil dari bagian kecil": h² jauh lebih kecil daripada h ketika h kecil, jadi boleh diabaikan dalam batas. Penjelasan modern memakai konsep limit, yang akan dibuat rapi di Lapis 2.</p>
<p>Di sisi komputer, h tidak bisa dibuat terlalu kecil. Untuk h sekitar 10⁻¹⁵, selisih s(t + h) − s(t) terkena galat pembulatan (lihat 0.2), dan hasilnya kacau. Fenomena ini disebut <b>pembatalan</b> (cancellation), dibahas Higham §1.7.</p>`,
salah: ["Mengira turunan adalah \"laju rata-rata dengan h kecil\". Turunan adalah nilai batasnya, bukan nilai untuk satu h tertentu.", "Memasukkan h = 0 langsung: hasilnya 0/0, tidak terdefinisi. Sederhanakan dulu, baru ambil batasnya."],
ringkas: ["Laju rata-rata = Δs/Δt.", "Turunan = batas laju rata-rata ketika selangnya menuju nol.", "Turunan t² adalah 2t, dan bisa diturunkan dengan aljabar biasa."],
uji: ["Tanpa melihat catatan, turunkan laju sesaat t² di t = 3 dengan tabel h = 1; 0,1; 0,01.", "Kerjakan aljabar (t + h)² − t² lalu bagi h. Apa sisanya ketika h → 0?"] },

"1.1": { viz: "subst",
deep: `<p>Variabel memungkinkan kita menulis pernyataan tentang <b>semua</b> bilangan sekaligus. "Untuk setiap x, 3(x + 4) = 3x + 12" adalah satu kalimat yang berlaku untuk tak terhingga kasus. Pernyataan seperti ini disebut <b>identitas</b>.</p>
<p>Aljabar bekerja dengan beberapa sifat dasar bilangan:</p>
<ul><li><b>komutatif</b>: a + b = b + a dan ab = ba;</li><li><b>asosiatif</b>: (a + b) + c = a + (b + c);</li><li><b>distributif</b>: a(b + c) = ab + ac.</li></ul>
<p>Setiap langkah "menyederhanakan" sebenarnya memakai salah satu sifat itu. Menggabungkan 4x + 2x menjadi 6x adalah distributif yang dibaca terbalik: 4x + 2x = (4 + 2)x.</p>
<p>Cara menguji dengan satu angka punya batas yang penting. Kalau dua bentuk memberi hasil berbeda untuk satu angka, pasti tidak setara. Tapi kalau hasilnya sama untuk satu angka, belum tentu setara. Contohnya x² dan 2x sama-sama 4 saat x = 2. Uji dua atau tiga angka, atau buktikan dengan sifat-sifat di atas. Widget di atas menunjukkannya: dua bentuk yang setara menghasilkan garis yang berimpit.</p>`,
salah: ["3(x + 4) = 3x + 4: lupa membagikan pengali ke suku kedua.", "Menggabungkan suku tak sejenis: 3x + 2y = 5xy.", "−(x − 3) = −x − 3. Yang benar −x + 3, karena tanda minus dibagikan ke kedua suku."],
ringkas: ["Variabel = nama untuk bilangan yang belum diketahui atau berubah-ubah.", "Komutatif, asosiatif, distributif adalah dasar semua manipulasi aljabar.", "Satu angka bisa membantah kesetaraan, tapi tidak bisa membuktikannya."],
uji: ["Sederhanakan 2(3x − 1) − (x + 4) dan cek dengan x = 0 dan x = 1.", "Beri contoh dua ekspresi yang sama di satu nilai x tapi tidak setara."] },

"1.2": { viz: "system",
deep: `<p>Menyelesaikan persamaan berarti mencari semua nilai yang membuatnya benar. Operasi yang "aman" adalah operasi yang bisa dibalik: menambah atau mengurangi bilangan yang sama di kedua sisi, serta mengalikan atau membagi dengan bilangan <b>bukan nol</b>. Karena bisa dibalik, operasi ini tidak menambah atau menghilangkan jawaban.</p>
<p>Membagi dengan nol tidak pernah aman. Mengalikan kedua sisi dengan 0 membuat persamaan apa pun menjadi 0 = 0, dan informasinya hilang.</p>
<p>Sistem dua persamaan linear dengan dua variabel punya tiga kemungkinan, dan masing-masing punya gambar geometris:</p>
<ul><li><b>satu jawaban</b>: dua garis berpotongan di satu titik;</li><li><b>tidak ada jawaban</b>: dua garis sejajar, misalnya x + y = 2 dan x + y = 5;</li><li><b>tak terhingga jawaban</b>: dua garis berimpit, misalnya x + y = 2 dan 2x + 2y = 4.</li></ul>
<p>Strang (§1.2) menyebut cara pandang ini "geometri persamaan linear". Dengan banyak variabel, garis menjadi bidang dan bidang berdimensi tinggi, dan aljabar linear adalah alat untuk menanganinya.</p>`,
salah: ["Mengurangi hanya di satu sisi: 3x + 5 = 20 → 3x = 20.", "Membagi hanya sebagian suku: (3x + 6)/3 = x + 6. Yang benar x + 2.", "Lupa mengecek jawaban dengan memasukkannya kembali ke persamaan awal."],
ringkas: ["Lakukan operasi yang sama di kedua sisi; jangan bagi dengan nol.", "Sistem dua persamaan: berpotongan (1 jawaban), sejajar (0), berimpit (tak terhingga).", "Selalu cek jawaban dengan substitusi."],
uji: ["Selesaikan 5x − 3 = 2x + 9 dan cek.", "Tulis satu sistem dua persamaan yang tidak punya jawaban, lalu jelaskan gambarnya."] },

"1.3": { viz: "func",
deep: `<p>Definisi formal (Hammack, Definisi 12.1): fungsi f dari himpunan A ke himpunan B adalah aturan yang memasangkan <b>setiap</b> anggota A dengan <b>tepat satu</b> anggota B. A disebut <b>domain</b> (daerah asal) dan B <b>kodomain</b>. Ditulis f : A → B.</p>
<p>Dua kata kunci itu penting. "Setiap" berarti tidak boleh ada input yang tidak punya output. "Tepat satu" berarti tidak boleh ada input dengan dua output. Uji garis tegak adalah versi gambar dari "tepat satu".</p>
<p>Fungsi tidak harus berupa rumus. Tabel, daftar, bahkan program komputer bisa menjadi fungsi, asalkan syaratnya terpenuhi. Model AI yang sudah dilatih adalah fungsi: input gambar, output label. Saat dilatih, model berupa <b>keluarga fungsi</b> f(x; w) yang bergantung pada parameter w, dan pelatihan memilih satu anggota keluarga itu.</p>
<p><b>Komposisi</b> g∘f (dibaca "g setelah f") didefinisikan sebagai (g∘f)(x) = g(f(x)). Urutannya penting: umumnya g(f(x)) ≠ f(g(x)). Dengan f(x) = 2x + 1 dan g(x) = x², g(f(3)) = 49 tapi f(g(3)) = 19.</p>`,
salah: ["Mengira f(x + 1) = f(x) + 1. Untuk g(x) = x², g(x + 1) = x² + 2x + 1.", "Menukar urutan komposisi: g(f(x)) dan f(g(x)) umumnya berbeda.", "Menganggap lingkaran x² + y² = 1 adalah grafik fungsi y dari x. Garis tegak memotongnya dua kali."],
ringkas: ["Fungsi: setiap input punya tepat satu output.", "Domain = semua input yang sah.", "Model AI adalah fungsi, dan jaringan saraf adalah komposisi banyak fungsi."],
uji: ["Dengan f(x) = 3x − 2 dan g(x) = x², hitung f(g(2)) dan g(f(2)).", "Beri contoh hubungan sehari-hari yang bukan fungsi, dan jelaskan alasannya."] },

"1.4": { viz: "line",
deep: `<p>Kenapa kemiringan garis lurus sama di mana pun kamu mengukurnya? Ambil dua pasang titik di garis yang sama. Segitiga yang dibentuk Δx dan Δy di kedua tempat adalah segitiga <b>sebangun</b>, jadi perbandingan Δy/Δx-nya sama. Sifat "laju perubahan konstan" inilah yang membuat sebuah garis lurus.</p>
<p>Ada beberapa bentuk penulisan garis:</p>
<ul><li>bentuk kemiringan-titik potong: y = mx + b;</li><li>bentuk titik-kemiringan: y − y₁ = m(x − x₁), berguna kalau yang diketahui satu titik dan kemiringan;</li><li>bentuk umum: ax + by = c, yang juga bisa menyatakan garis tegak.</li></ul>
<p>Fungsi f(x) = mx + b disebut <b>afin</b>. Buku VMLS (Bab 2) membedakan fungsi <b>linear</b> (tanpa b, sehingga f(0) = 0) dari fungsi afin (dengan b). Dalam percakapan sehari-hari keduanya sering disebut "linear".</p>
<p>Di regresi, garis menjadi model data: kemiringan mengukur "kalau x naik satu satuan, y rata-rata berubah sebanyak m". Gelman dkk. menekankan bahwa titik potong b sering tidak bermakna kalau x = 0 berada jauh di luar data, seperti tahun 0 dalam contoh rekor lari.</p>`,
salah: ["Menukar urutan pengurangan: (y₂ − y₁)/(x₁ − x₂) memberi tanda yang salah.", "Membaca b sebagai titik potong sumbu x. b adalah nilai y saat x = 0.", "Menafsirkan garis di luar rentang data seolah-olah pasti benar."],
ringkas: ["m = Δy/Δx, sama di sepanjang garis karena segitiga sebangun.", "b = nilai y ketika x = 0.", "Neuron tanpa aktivasi = fungsi afin = garis (atau bidang)."],
uji: ["Cari persamaan garis lewat (−1, 4) dan (2, −2).", "Jelaskan kenapa garis tegak tidak bisa ditulis sebagai y = mx + b."] },

"1.5": { viz: "explog",
deep: `<p>Bilangan e bisa didefinisikan sebagai batas e = lim<sub>n→∞</sub> (1 + 1/n)ⁿ ≈ 2,718281828. Tabel bunga bank di atas menunjukkan barisan itu mendekat ke e. Sifat yang membuat e istimewa (dibuktikan di Lapis 2): turunan eˣ adalah eˣ sendiri. Laju pertumbuhannya sama dengan nilainya saat itu.</p>
<p>Logaritma adalah fungsi kebalikan dari eksponen. Kalau b^y = x, maka log<sub>b</sub> x = y. Karena itu grafik eˣ dan ln x saling bercermin terhadap garis y = x (lihat widget). ln x hanya terdefinisi untuk x &gt; 0.</p>
<p>Tiga sifat logaritma mengikuti langsung dari aturan pangkat:</p>
<ul><li>log(ab) = log a + log b, karena b^m·b^n = b^(m+n);</li><li>log(a/b) = log a − log b;</li><li>log(aⁿ) = n·log a.</li></ul>
<p>Ganti basis: log<sub>b</sub> x = ln x / ln b. Jadi semua logaritma sebanding; memilih basis hanya memilih satuan. Basis 2 memberi satuan <b>bit</b> dalam teori informasi.</p>
<p>Softmax mengubah skor z₁,…,z<sub>k</sub> menjadi peluang p<sub>i</sub> = e^(z<sub>i</sub>) / Σ<sub>j</sub> e^(z<sub>j</sub>). Hasilnya selalu positif dan jumlahnya 1. Goodfellow dkk. (§4.1) menjelaskan kenapa komputer menghitungnya dengan trik mengurangi skor terbesar dulu: supaya e pangkat bilangan besar tidak meluap (overflow).</p>`,
salah: ["log(a + b) = log a + log b. Salah; sifat itu hanya untuk perkalian.", "Mengira ln 0 = 0. ln x menuju −∞ ketika x mendekati 0.", "(2³)² = 2⁹. Yang benar 2⁶."],
ringkas: ["Eksponen: pertumbuhan berlipat. e ≈ 2,718 adalah basis alami.", "Logaritma menjawab \"pangkat berapa?\" dan mengubah kali menjadi tambah.", "Softmax memakai eˣ; cross-entropy memakai −ln."],
uji: ["Tanpa kalkulator: log₂ 32, log₁₀ 0,01, ln(e⁵).", "Jelaskan kenapa LLM menjumlahkan log-peluang alih-alih mengalikan peluang."] },

"1.6": { viz: "mean",
deep: `<p>Notasi Σ punya tiga bagian: indeks (i), batas (dari 1 sampai n), dan suku yang dijumlahkan. Nama indeks tidak penting: Σᵢ xᵢ = Σ<sub>k</sub> x<sub>k</sub>. Dua sifat yang paling sering dipakai: Σ(aᵢ + bᵢ) = Σaᵢ + Σbᵢ, dan Σ c·aᵢ = c·Σaᵢ.</p>
<p>Bukti bahwa jumlah selisih dari rata-rata selalu nol hanya perlu dua sifat itu: Σ(xᵢ − x̄) = Σxᵢ − n·x̄ = n·x̄ − n·x̄ = 0. Kamu bisa melihatnya di widget: seret titik ke mana pun, jumlahnya tetap 0.</p>
<p>Rata-rata punya sifat optimal: x̄ adalah bilangan c yang membuat Σ(xᵢ − c)² <b>sekecil mungkin</b>. Jadi rata-rata adalah "tebakan tunggal terbaik" kalau kesalahan diukur dengan kuadrat. Ini adalah regresi paling sederhana, dan buktinya akan kamu kerjakan dengan turunan di Lapis 2.</p>
<p>Rata-rata peka terhadap pencilan. Gaji [3, 3, 4, 4, 100] juta punya rata-rata 22,8 juta, padahal empat dari lima orang bergaji 4 juta atau kurang. <b>Median</b> (nilai tengah setelah diurutkan, di sini 4) lebih tahan terhadap pencilan.</p>`,
salah: ["Membaca Σᵢ₌₁⁴ i² sebagai (1 + 2 + 3 + 4)². Hasilnya 55, bukan 100.", "Menghitung rata-rata berbobot tapi lupa membagi dengan jumlah bobot.", "Melaporkan rata-rata saja untuk data yang punya pencilan besar."],
ringkas: ["Σ = jumlahkan suku untuk setiap nilai indeks.", "x̄ = (1/n)Σxᵢ, titik seimbang data; Σ(xᵢ − x̄) = 0.", "Rata-rata meminimalkan jumlah kuadrat selisih, tapi peka pencilan."],
uji: ["Tulis 2 + 4 + 6 + … + 20 dengan notasi Σ, lalu hitung.", "Buktikan Σ(xᵢ − x̄) = 0 di kertas memakai sifat Σ."] },

"1.7": { viz: "variance",
deep: `<p>Varians adalah rata-rata kuadrat selisih dari rata-rata. Kenapa kuadrat, bukan nilai mutlak? Ada beberapa alasan. Kuadrat mudah diturunkan (Lapis 2). Varians dari jumlah variabel acak yang saling bebas adalah jumlah variansnya (Wasserman, Teorema 3.15). Dan kuadrat terhubung langsung dengan jarak Euclid: simpangan baku adalah jarak rata-rata (RMS) antara data dan rata-ratanya (VMLS §3.3).</p>
<p>Ada rumus jalan pintas: Var(X) = E(X²) − (E X)², atau "rata-rata kuadrat dikurangi kuadrat rata-rata". Untuk data [2, 4, 4, 4, 5, 5, 7, 9], rata-rata kuadratnya 29 dan kuadrat rata-ratanya 25, jadi variansnya 4. Rumus ini praktis di kertas, tapi di komputer bisa kehilangan ketelitian karena mengurangkan dua angka besar yang hampir sama. Higham §1.9 membahas masalah ini khusus untuk varians sampel.</p>
<p>Mengapa sampel dibagi n − 1? Selisih dihitung dari x̄ sampel, bukan dari rata-rata populasi yang sebenarnya. x̄ selalu berada "di tengah" sampel, jadi selisih ke x̄ cenderung lebih kecil daripada selisih ke rata-rata sebenarnya. Membagi dengan n − 1 mengoreksi kecenderungan itu, sehingga rata-rata dari S² tepat sama dengan σ² (Wasserman, Teorema 3.17).</p>
<p>Sifat skala: Var(aX + b) = a²·Var(X). Menggeser data (menambah b) tidak mengubah sebaran; mengalikan dengan a mengalikan varians dengan a². Standarisasi z = (x − x̄)/s memakai dua sifat ini sekaligus untuk menghasilkan rata-rata 0 dan simpangan baku 1.</p>`,
salah: ["Lupa mengakarkan dan melaporkan varians sebagai \"simpangan baku\". Satuannya juga berbeda: varians dalam satuan kuadrat.", "Mencampur np.var (bagi n) dengan rumus sampel (bagi n − 1) lalu bingung angkanya beda.", "Mengira menambah konstanta ke semua data mengubah varians."],
ringkas: ["Varians = rata-rata (xᵢ − x̄)²; simpangan baku = akar varians.", "Bagi n untuk menggambarkan data; bagi n − 1 untuk menaksir populasi dari sampel.", "Var(aX + b) = a²Var(X); skor z menghasilkan rata-rata 0 dan simpangan baku 1."],
uji: ["Hitung varians dan simpangan baku [1, 3, 5] dengan dua versi pembagi.", "Jelaskan dengan kata-katamu kenapa varians dari data yang semuanya sama adalah 0."] },

"1.8": { viz: "dot",
deep: `<p>Secara formal, vektor berdimensi n adalah daftar terurut n bilangan real, ditulis x ∈ ℝⁿ. Penjumlahan vektor dan perkalian skalar didefinisikan per komponen. Gabungan keduanya, a·u + b·v, disebut <b>kombinasi linear</b>, operasi paling dasar di aljabar linear.</p>
<p>Hasil kali titik punya sifat: simetris (u·v = v·u), linear di tiap argumen ((au + bw)·v = a(u·v) + b(w·v)), dan u·u = ‖u‖² ≥ 0. Jadi norma bisa didefinisikan dari hasil kali titik: ‖u‖ = √(u·u). MML §3.2 memakai tiga sifat ini sebagai definisi umum "inner product".</p>
<p>Rumus u·v = ‖u‖‖v‖cos θ datang dari aturan kosinus di segitiga dengan sisi u, v, dan u − v. Hasil kali titik juga bisa dibaca sebagai <b>proyeksi</b>: panjang bayangan v di arah u (garis oranye di widget) adalah (u·v)/‖u‖.</p>
<p><b>Kemiripan kosinus</b>, cos θ = u·v / (‖u‖‖v‖), hanya mengukur arah dan mengabaikan panjang. Nilainya 1 untuk searah, 0 untuk tegak lurus, dan −1 untuk berlawanan. Sistem pencarian dokumen dan embedding kata memakai ukuran ini. Di attention (Vaswani dkk. §3.2.1), skornya adalah q·k/√d: hasil kali titik dibagi akar dimensi supaya angkanya tidak terlalu besar sebelum masuk softmax.</p>`,
salah: ["Mengira hasil kali titik menghasilkan vektor. Hasilnya satu bilangan.", "Mengalikan per komponen lalu lupa menjumlahkan.", "Menghitung hasil kali titik dua vektor yang dimensinya berbeda; itu tidak terdefinisi."],
ringkas: ["Vektor = daftar bilangan terurut; operasinya per komponen.", "u·v = Σuᵢvᵢ = ‖u‖‖v‖cos θ.", "Neuron dan attention dibangun dari hasil kali titik."],
uji: ["Hitung [2, −1, 3]·[4, 0, −2] dan tentukan apakah sudutnya lancip, siku, atau tumpul.", "Cari satu vektor yang tegak lurus [3, 4]."] },

"1.9": { viz: "matvec",
deep: `<p>Array NumPy menyimpan angka sejenis dalam satu blok memori yang berurutan. Karena itu satu operasi bisa diterapkan ke semua elemen tanpa perulangan Python yang lambat. Harris dkk. (2020) menyebut tiga gagasan inti NumPy: <b>vektorisasi</b>, <b>broadcasting</b>, dan <b>indexing</b>.</p>
<p><b>Broadcasting</b> adalah aturan saat dua array beda bentuk dioperasikan. Dalam <code>X @ w + b</code>, b adalah satu bilangan, tapi ditambahkan ke setiap baris hasil. NumPy "merentangkan" b supaya bentuknya cocok, tanpa benar-benar menyalinnya.</p>
<p><b>Bentuk</b> (shape) adalah hal pertama yang dicek kalau kode error. X berbentuk (3, 2): tiga rumah, dua fitur. w berbentuk (2,). X @ w berbentuk (3,), satu hasil per rumah. Aturan umumnya: dimensi dalam harus sama, (3, 2) @ (2,) → (3,).</p>
<p>Kebiasaan yang baik: periksa hasil vektorisasi dengan menghitung satu baris secara manual, seperti contoh 41 di atas. Dengan cara ini, kode dan matematika saling memeriksa. Kotak kode di halaman ini bisa dijalankan langsung (tombol "Jalankan"), memakai Python asli di browser.</p>`,
salah: ["Memakai list Python untuk matematika vektor: [1, 2] * 2 menghasilkan [1, 2, 1, 2].", "Bingung antara * (kali per elemen) dan @ (hasil kali titik atau perkalian matriks).", "Lupa ddof=1 saat butuh varians sampel."],
ringkas: ["np.array berperilaku seperti vektor matematika.", "Vektorisasi: satu operasi untuk seluruh array.", "Selalu cek shape; cek satu baris dengan tangan."],
uji: ["Tulis kode NumPy untuk menghitung skor z dari sebuah array tanpa melihat contoh.", "Jelaskan perbedaan a * b dan a @ b untuk a = [1, 2], b = [3, 4], lalu hitung keduanya."] }
};
