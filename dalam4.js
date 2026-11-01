/* Pendalaman Lapis 4. Format sama dengan dalam.js: viz, deep, salah, ringkas, uji. */
window.DALAM = window.DALAM || {};
Object.assign(window.DALAM, {

"4.1": { viz: "boltz",
deep: String.raw`<p>Kenapa faktornya eksponen? Bayangkan sistem kecil yang bersentuhan dengan lingkungan raksasa bersuhu T. Kalau sistem kecil mengambil energi E, lingkungan kehilangan E, dan banyaknya susunan lingkungan turun dengan faktor <span class="tx">e^{-E/kT}</span> (dari definisi 1/T = ∂S/∂E dan S = k ln Ω). Peluang sistem kecil sebanding dengan banyaknya susunan lingkungan yang cocok, jadi faktor eksponen itu muncul dengan sendirinya.</p>
<p>Ekuipartisi: dalam fisika klasik, setiap suku kuadrat dalam energi (seperti ½mv² untuk satu arah gerak) rata-rata menyimpan ½kT. Molekul gas punya tiga arah gerak, jadi energi kinetik rata-ratanya 3/2 kT. Inilah arti fisik suhu: ukuran energi gerak rata-rata per derajat kebebasan.</p>
<p>Simulated annealing memanfaatkan dua sisi suhu. Panas: sistem mudah melompati bukit energi dan menjelajah. Dingin: sistem mengendap di lembah. Kalau pendinginan cukup pelan, sistem berakhir di lembah terdalam dengan peluang tinggi.</p>`,
salah: ["Mengira suhu nol berarti tidak ada gerak sama sekali. Dalam kuantum masih ada energi titik nol; dalam model ini, suhu nol berarti selalu di keadaan terendah.", "Mengira energi di AI adalah energi fisik. Di AI, \"energi\" hanya angka skor; yang dipinjam adalah matematikanya."],
ringkas: ["Rasio peluang dua keadaan = e^(−ΔE/kT).", "kT pada suhu kamar ≈ 0,026 eV.", "S = k ln Ω; 1/T = ∂S/∂E."],
uji: ["Dua keadaan berselisih 3 kT. Berapa kali lebih jarang keadaan atas?", "Jelaskan dengan kata sendiri kenapa simulated annealing harus mendingin pelan-pelan."] },

"4.2": { viz: "softmax",
deep: String.raw`<p>Softmax tidak berubah kalau semua logit ditambah angka yang sama: <span class="tx">e^{z_i + c}/\sum e^{z_j + c}</span>, faktor <span class="tx">e^c</span> saling coret. Program memanfaatkannya untuk mencegah angka meluap: kurangi dulu logit terbesar sebelum mengambil eksponen. Tanpa trik ini, logit 1000 membuat e¹⁰⁰⁰ tak hingga di komputer.</p>
<p>Dari fungsi partisi, energi rata-rata keluar dengan menurunkan log Z: <span class="tx">\langle E \rangle = -\partial \ln Z / \partial \beta</span>, dengan β = 1/kT. Di ML, turunan log-sum-exp terhadap logit adalah softmax itu sendiri, dan itulah sebabnya gradien cross-entropy terhadap logit begitu sederhana: softmax dikurangi label.</p>
<p>Selain suhu, model bahasa memakai <b>top-k</b> dan <b>top-p</b>: buang semua token kecuali k teratas, atau kecuali kumpulan teratas yang peluangnya berjumlah p, lalu normalkan ulang. Keduanya memotong ekor panjang token aneh yang tetap punya peluang kecil.</p>`,
salah: ["Mengira softmax pada suhu tinggi mengubah urutan pilihan. Urutannya tetap; hanya selisih peluangnya yang mengecil.", "Mengira suhu 0 bisa dimasukkan langsung ke rumus. Pembagian dengan 0 tidak boleh; dalam praktik suhu 0 berarti langsung memilih argmax."],
ringkas: ["p_i = e^(−E_i/kT)/Z; Z = fungsi partisi.", "softmax(z/T) = Boltzmann dengan E = −z.", "T kecil: yakin, tajam; T besar: rata, beragam."],
uji: ["Hitung softmax dari [1; 1; 1]. Kenapa hasilnya tidak bergantung T?", "Jelaskan kenapa mengurangi logit terbesar tidak mengubah hasil softmax."] },

"4.3": { viz: "freeen",
deep: String.raw`<p>Turunan rumus F[q] − F = kT·KL: tulis log p = −E/kT − ln Z. Maka <span class="tx">kT\,D_{\text{KL}}(q\|p) = kT\sum q\ln q - kT\sum q \ln p = -kT\,H(q) + \langle E\rangle_q + kT\ln Z</span>. Dua suku pertama adalah F[q], suku terakhir adalah −F. Selesai dalam tiga baris.</p>
<p>Inferensi variasional "mean-field" memilih q yang memecah semua variabel menjadi saling bebas: <span class="tx">q(\theta_1, \theta_2, \dots) = q_1(\theta_1)\,q_2(\theta_2)\cdots</span>. Nama ini berasal dari fisika magnet: setiap spin merasakan rata-rata (mean) medan dari tetangganya, bukan nilai persisnya. Hasilnya cepat, tapi cenderung terlalu yakin, karena KL(q‖p) bersifat mode-seeking (3.4).</p>
<p>ELBO juga dipakai untuk membandingkan model: log p(D), disebut <b>evidence</b>, makin besar berarti model menjelaskan data lebih baik. Karena ELBO adalah batas bawahnya, ELBO yang lebih tinggi menjadi petunjuk (bukan jaminan) model yang lebih baik.</p>`,
salah: ["Mengira ELBO sama dengan log p(D). ELBO hanya batas bawah; selisihnya tepat KL antara q dan posterior sebenarnya.", "Mengira energi bebas berarti energi yang gratis. Namanya historis: bagian energi yang bisa diubah menjadi kerja."],
ringkas: ["F = ⟨E⟩ − TS = −kT ln Z.", "F[q] − F = kT·KL(q‖p) ≥ 0.", "ELBO = −F[q] = E_q[log p(D|θ)] − KL(q‖prior) ≤ log p(D)."],
uji: ["Untuk dua keadaan berenergi 0 dan 1 pada kT = 1, hitung F = −ln Z.", "Jelaskan arti dua suku ELBO dengan kata sendiri."] },

"4.4": { viz: "walk",
deep: String.raw`<p>Di dua dimensi (pemabuk di lapangan), jarak khas tetap tumbuh seperti √n. Pólya (1921) membuktikan hal yang lebih mengejutkan: di satu dan dua dimensi, pemabuk pasti kembali ke titik awal suatu saat; di tiga dimensi peluangnya hanya sekitar 34%. "Pemabuk selalu pulang, burung mabuk bisa tersesat selamanya."</p>
<p>Hukum √n menjelaskan kenapa rata-rata dari n data punya galat 1/√n (2.10): jumlah n noise tumbuh seperti √n, lalu dibagi n. Itu juga menjelaskan noise SGD: gradien mini-batch berukuran B bergoyang sekitar 1/√B dari gradien penuh, jadi memperbesar batch 4 kali hanya mengurangi noise separuhnya.</p>
<p>Gerak Brown standar bersifat <b>skala-invarian</b>: perbesar waktu c kali dan ruang √c kali, gambarnya tampak sama secara statistik. Itulah sebabnya grafik saham harian dan grafik saham per menit tampak serupa (5.15).</p>`,
salah: ["Mengira rata-rata posisi 0 berarti pemabuk tetap dekat 0. Rata-rata 0, tapi jarak khasnya √n.", "Mengira jalan acak \"seimbang\" lama-lama: setelah banyak gambar, angka tidak jadi lebih mungkin. Koin tidak punya ingatan."],
ringkas: ["Var setelah n langkah = n; jarak khas √n.", "Gerak Brown: kenaikan dalam Δt ~ N(0, Δt).", "Lintasan Brown bergerigi di semua skala, tidak punya turunan."],
uji: ["Berapa langkah yang dibutuhkan supaya jarak khas pemabuk menjadi 30?", "Kenapa memperbesar mini-batch 100 kali hanya mengurangi noise gradien 10 kali?"] },

"4.5": { viz: "ou",
deep: String.raw`<p>Kenapa kalkulus biasa tidak cukup? Dalam aturan rantai biasa, suku <span class="tx">(dx)^2</span> diabaikan karena terlalu kecil. Untuk gerak Brown, <span class="tx">(dW)^2 \approx dt</span>, sama besar dengan suku orde pertama. Lemma Itô menambahkan suku koreksi itu: untuk g(X), <span class="tx">dg = g'(X)\,dX + \tfrac12 g''(X)\,\sigma^2\,dt</span>. Suku tambahan inilah yang membuat rumus Black–Scholes (5.15) berbeda dari tebakan polos.</p>
<p>Untuk OU, rata-rata dan varians punya rumus tepat: mulai dari x₀, rata-ratanya <span class="tx">x_0 e^{-\kappa t}</span> dan variansnya <span class="tx">\frac{\sigma^2}{2\kappa}(1 - e^{-2\kappa t})</span>. Dengan x₀ = 3, κ = σ = 1 pada t = 1: rata-rata 1,104, varians 0,432. Proses maju "variance preserving" di model difusi adalah OU dengan κ dan σ yang diatur supaya varians total tetap 1.</p>
<p>Langevin dengan langkah diskret (tanpa koreksi) sedikit meleset dari distribusi target. Metropolis-adjusted Langevin (MALA) menambahkan langkah terima-tolak ala Metropolis (3.8) untuk membetulkannya.</p>`,
salah: ["Memakai Δt (bukan √Δt) untuk suku noise di Euler–Maruyama. Hasilnya, noise mengecil terlalu cepat ketika Δt diperkecil.", "Mengira satu lintasan SDE mewakili jawabannya. Jawaban SDE adalah distribusi; perlu banyak lintasan."],
ringkas: ["dX = f(X)dt + σdW: drift + noise Brown.", "Euler–Maruyama: tambah σ√Δt·ξ setiap langkah.", "OU: tarikan ke 0, varians stasioner σ²/(2κ); Langevin: sampel dari e^(−E/T)."],
uji: ["Untuk OU dengan κ = 2, σ = 2, berapa varians stasionernya?", "Jelaskan bagaimana Langevin dynamics berbeda dari gradient descent."] },

"4.6": { viz: "heat",
deep: String.raw`<p>Hubungan partikel dan kepadatan bisa diturunkan langsung. Partikel di kisi melangkah kiri atau kanan dengan peluang sama. Kepadatan di titik i pada waktu berikutnya adalah separuh dari tetangga kiri ditambah separuh dari tetangga kanan. Kurangi kepadatan sekarang, maka muncul <span class="tx">(u_{i+1} - 2u_i + u_{i-1})/2</span>, bentuk diskret turunan kedua. Persamaan panas adalah jalan acak yang dilihat dari jauh.</p>
<p>Persamaan panas bersifat <b>tak dapat dibalik</b>: menjalankannya mundur (menajamkan kurva) tidak stabil, karena noise kecil ikut menajam dan meledak. Model difusi menghindari masalah ini dengan tidak membalik persamaannya secara buta. Mereka mempelajari skor ∇log p dari data, dan skor itulah yang membuat proses balik menjadi SDE yang stabil.</p>
<p>Di dua dimensi, turunan kedua diganti Laplacian <span class="tx">\nabla^2 u = u_{xx} + u_{yy}</span>. Mengaburkan gambar dengan kernel Gauss (3.6) sama dengan menjalankan persamaan panas pada gambar itu.</p>`,
salah: ["Mengira difusi membuat kepadatan berpindah ke satu arah. Tanpa drift, difusi hanya meratakan; pusat massa tetap.", "Memilih Δt sembarang di skema eksplisit. Harus D·Δt/Δx² ≤ ½, atau hitungan meledak."],
ringkas: ["∂u/∂t = D ∂²u/∂x²: puncak turun, lembah naik.", "Paku awal menjadi normal dengan varians 2Dt.", "Fokker–Planck = difusi + arus drift; keseimbangannya distribusi stasioner."],
uji: ["Dengan D = 2, berapa simpangan baku setelah t = 1?", "Kenapa menjalankan persamaan panas mundur berbahaya?"] },

"4.7": { viz: "hamil",
deep: String.raw`<p>Euler pada pegas mengalikan vektor (q, p) dengan matriks <span class="tx">\begin{bmatrix}1 & \Delta t\\ -\Delta t & 1\end{bmatrix}</span>. Determinannya (2.5) 1 + Δt², lebih dari 1, jadi luas di ruang (q, p) membesar setiap langkah dan lintasan berputar keluar. Matriks leapfrog punya determinan tepat 1: luas dijaga, sesuai teorema Liouville. Nilai eigennya (2.7) bilangan kompleks bermodulus 1, jadi lintasan berputar tanpa membesar, asalkan Δt &lt; 2.</p>
<p>Di HMC, energi yang tidak tepat kekal (karena Δt terbatas) dikoreksi dengan langkah terima-tolak Metropolis memakai selisih H di awal dan akhir. Karena leapfrog menjaga H hampir tetap, tingkat penerimaannya tinggi. NUTS (No-U-Turn Sampler), varian HMC yang menentukan sendiri berapa langkah meluncur, adalah sampler bawaan Stan dan PyMC.</p>
<p>Gagasan "jaga strukturnya, jangan hanya kecilkan galatnya" muncul juga di deep learning: integrator simplektik dipakai di Hamiltonian neural network, dan analisis momentum (3.1) memandang SGD dengan momentum sebagai sistem Hamilton dengan gesekan.</p>`,
salah: ["Mengira galat kecil per langkah cukup. Galat kecil yang selalu searah menumpuk; leapfrog membuat galatnya bergoyang tanpa menumpuk.", "Mengira momentum di HMC adalah momentum fisik sungguhan. Itu variabel bantu yang diacak ulang setiap iterasi."],
ringkas: ["H = kinetik + potensial; dq/dt = ∂H/∂p, dp/dt = −∂H/∂q.", "Energi kekal; Euler membuatnya hanyut, leapfrog menjaganya.", "HMC: meluncur di lanskap −log posterior dengan leapfrog."],
uji: ["Untuk pegas dengan Euler, Δt = 0,2, setelah 50 langkah energinya dikali berapa?", "Jelaskan kenapa HMC menerima usulan jauh lebih sering daripada Metropolis jalan acak."] }
});
