/* Pendalaman Lapis 5. Format sama dengan dalam.js: viz, deep, salah, ringkas, uji. */
window.DALAM = window.DALAM || {};
Object.assign(window.DALAM, {

"5.1": { viz: "logit",
deep: String.raw`<p>Kenapa tidak memakai MSE untuk regresi logistik? Dengan sigmoid di dalamnya, MSE tidak lagi cembung, dan ketika tebakan sangat salah, sigmoid mendatar sehingga gradiennya hampir nol: model yang yakin salah malah belajar paling lambat. Cross-entropy membatalkan eksponen sigmoid lewat logaritma, dan gradiennya tetap p̂ − y, besar ketika salah besar.</p>
<p>Kalau data bisa dipisahkan sempurna oleh sebuah garis, MLE regresi logistik tidak ada: bobot terus membesar ke tak hingga supaya peluangnya mendekati 0 dan 1 tepat. Regularisasi L2 (3.3) menghentikannya. Untuk lebih dari dua kelas, sigmoid diganti softmax (4.2): regresi logistik multinomial, yang juga merupakan lapis terakhir setiap classifier jaringan saraf.</p>`,
salah: ["Membaca keluaran regresi logistik sebagai kelas, bukan peluang. 0,51 dan 0,99 sama-sama \"ya\", tapi keyakinannya sangat berbeda.", "Mengira regresi linear cukup untuk ya/tidak. Garisnya bisa memberi angka di bawah 0 atau di atas 1."],
ringkas: ["Linear: ŷ = w·x + b, loss MSE, ada rumus langsung.", "Logistik: p̂ = σ(w·x + b), loss cross-entropy biner, gradien p̂ − y.", "Batas keputusan: w·x + b = 0."],
uji: ["Kenapa yakin-tapi-salah dihukum jauh lebih berat oleh cross-entropy?", "Tuliskan gradien loss logistik terhadap w untuk satu contoh."] },

"5.2": { viz: "stump",
deep: String.raw`<p>Pohon membagi ruang fitur menjadi kotak-kotak yang sejajar sumbu. Itu sebabnya pohon tidak terpengaruh skala fitur (tidak perlu normalisasi), menangani campuran angka dan kategori, dan mudah dibaca. Tapi batas miring harus didekati dengan anak tangga, dan pohon tidak bisa menebak di luar kisaran data latih.</p>
<p>Out-of-bag: setiap pohon di random forest hanya melihat sekitar 63% data (sampel bootstrap). Sisa 37% bisa dipakai menguji pohon itu tanpa memisahkan data validasi. Pentingnya fitur bisa diukur dari total penurunan ketidakmurnian atau dengan mengacak satu fitur dan melihat berapa akurasi turun; untuk penjelasan per prediksi, metode seperti SHAP sering dipakai.</p>`,
salah: ["Mengira pohon yang lebih dalam selalu lebih baik. Pohon dalam menghafal; batasi kedalaman atau pakai ensemble.", "Mengira random forest dan boosting sama. Forest melatih paralel dan merata-ratakan (menurunkan varians); boosting berurutan dan membetulkan kesalahan (menurunkan bias)."],
ringkas: ["Gini = 1 − Σp²; pilih belahan dengan penurunan terbesar.", "Random forest: bootstrap + fitur acak + suara terbanyak.", "Boosting: setiap pohon menebak sisa kesalahan, sama dengan gradient descent di ruang fungsi."],
uji: ["Hitung Gini simpul dengan 3 ya dan 3 tidak, lalu simpul dengan 6 ya dan 0 tidak.", "Kenapa fitur acak di setiap simpul membuat random forest lebih baik?"] },

"5.3": { viz: "kmeans",
deep: String.raw`<p>K-means meminimalkan jumlah kuadrat jarak setiap titik ke pusat kelompoknya. Langkah "tugaskan" meminimalkan terhadap kelompok dengan pusat tetap; langkah "pindahkan" meminimalkan terhadap pusat dengan kelompok tetap (rata-rata adalah titik dengan jumlah kuadrat jarak terkecil). Bergantian seperti ini selalu turun, tapi bisa berhenti di minimum lokal. Masalah mencari minimum global k-means termasuk sulit secara komputasi (NP-hard).</p>
<p>Model campuran Gauss (GMM) adalah versi lunak k-means: setiap titik punya peluang menjadi anggota setiap kelompok, dan kelompok boleh berbentuk elips. Algoritma EM yang dipakainya bergantian antara langkah E (hitung peluang anggota) dan M (perbarui parameter), keduanya naik pada likelihood (3.2). K-means adalah batas GMM ketika semua varians dibuat sangat kecil.</p>`,
salah: ["Lupa menormalkan fitur. Fitur bersatuan besar (gaji dalam rupiah) akan mendominasi jarak.", "Menafsirkan klaster sebagai kategori yang \"nyata\" tanpa memeriksa kestabilan dan maknanya."],
ringkas: ["K-means: tugaskan ke pusat terdekat, pindahkan pusat ke rata-rata, ulangi.", "Hasil bergantung pada titik awal; k harus dipilih.", "PCA meringkas kolom; klasterisasi mengelompokkan baris."],
uji: ["Jalankan satu putaran k-means dengan tangan untuk titik 1, 2, 9, 10 dengan pusat awal 1 dan 2.", "Kenapa jumlah kuadrat jarak tidak bisa dipakai langsung untuk memilih k?"] },

"5.4": { viz: "backprop",
deep: String.raw`<p>Kenapa mundur lebih murah daripada maju? Model punya jutaan bobot tapi hanya satu loss. Menghitung turunan dari depan (mode maju) butuh satu lintasan per bobot; dari belakang (mode mundur) butuh satu lintasan untuk semua bobot sekaligus. Harganya: semua nilai antara dari lintasan maju harus disimpan di memori, itulah sebabnya pelatihan butuh memori GPU jauh lebih besar daripada penggunaan.</p>
<p>Ada banyak fungsi aktivasi. Sigmoid dan tanh mendatar di ujung-ujungnya sehingga gradien lenyap di jaringan dalam. ReLU tidak mendatar untuk nilai positif, murah dihitung, dan mempercepat pelatihan, tapi neuron bisa "mati" kalau masukannya selalu negatif (seperti neuron pertama di contoh). GELU dan SiLU, versi ReLU yang melengkung halus, dipakai di Transformer modern.</p>
<p>Cara memeriksa gradien buatan sendiri: bandingkan dengan beda hingga <span class="tx">(L(w + h) - L(w - h))/(2h)</span> untuk h kecil. Kalau keduanya cocok sampai beberapa angka, backprop-nya benar.</p>`,
salah: ["Mengira jaringan tanpa fungsi aktivasi bisa belajar pola melengkung. Tanpa φ, tumpukan lapis tetap satu matriks.", "Mengira backpropagation adalah metode pelatihan. Backprop hanya menghitung gradien; yang melatih adalah gradient descent."],
ringkas: ["Lapis: h = φ(Wx + b); ReLU = max(0, z).", "Maju: simpan nilai antara. Mundur: aturan rantai dari loss ke setiap bobot.", "Neuron dengan z negatif tidak meneruskan gradien lewat ReLU."],
uji: ["Ulangi contoh dengan target t = −2. Berapa semua gradiennya, dan kenapa?", "Jelaskan kenapa jaringan 10 lapis tanpa fungsi aktivasi setara dengan satu lapis."] },

"5.5": { viz: "conv2d",
deep: String.raw`<p>Satu angka dalam peta fitur lapis ke-L bergantung pada kotak masukan yang makin besar. Dengan kernel k × k dan stride 1, receptive field tumbuh k − 1 setiap lapis; pooling dan stride melipatgandakannya. Inilah cara CNN menggabungkan informasi lokal menjadi pemahaman global tanpa lapis penuh yang mahal.</p>
<p>CNN juga punya kelemahan yang dipelajari banyak orang: model bisa mengandalkan tekstur alih-alih bentuk, dan perubahan piksel yang tak terlihat manusia (contoh adversarial) bisa membalik keputusannya. Vision Transformer (ViT) memotong gambar menjadi petak-petak 16 × 16 dan memprosesnya dengan attention (5.7); dengan data sangat banyak ia menyamai atau melampaui CNN, tapi CNN masih unggul ketika datanya sedikit, berkat asumsi lokalitas bawaannya.</p>`,
salah: ["Mengira pooling dipelajari. Max pooling tidak punya bobot; ia hanya mengambil maksimum.", "Lupa menghitung kanal masukan dalam ukuran kernel. Kernel 3 × 3 pada 64 kanal punya 576 bobot, bukan 9."],
ringkas: ["CNN: konvolusi + ReLU + pooling, berulang, lalu lapis penuh.", "Ukuran keluaran (n + 2p − k)/s + 1; bobot (k·k·kanal + 1) × banyak kernel.", "ResNet: x + F(x) membuat jaringan sangat dalam bisa dilatih."],
uji: ["Masukan 28 × 28 × 1, 32 kernel 5 × 5 tanpa padding. Berapa ukuran keluaran dan bobotnya?", "Kenapa sambungan residual membantu gradien mengalir?"] },

"5.6": { viz: "vanish",
deep: String.raw`<p>Mengapa nilai eigen? Gradien yang mengalir mundur t langkah dikali oleh <span class="tx">W^\top</span> (dan turunan tanh, paling besar 1) sebanyak t kali. Tulis gradien dalam basis vektor eigen W: komponen dengan |λ| &lt; 1 menyusut seperti |λ|ᵗ, yang |λ| &gt; 1 membesar seperti |λ|ᵗ. Ini analisis yang sama dengan distribusi stasioner rantai Markov (3.8) dan stabilitas Euler (3.7).</p>
<p>Gradient clipping: kalau panjang vektor gradien melebihi batas, misalnya 1, skala ulang ke panjang itu. Arahnya tetap, ukurannya dibatasi. Trik sederhana ini juga dipakai dalam pelatihan Transformer besar untuk mencegah lonjakan loss sesekali.</p>`,
salah: ["Mengira LSTM menghapus masalah jarak jauh sepenuhnya. LSTM memperpanjang ingatan hingga ratusan langkah, bukan tak terbatas.", "Mengira RNN tidak bisa paralel karena kurang dioptimalkan. Ketergantungan berurutan itu sifat dasarnya."],
ringkas: ["h_t = tanh(W h_{t−1} + U x_t + b), bobot sama setiap langkah.", "Gradien jarak t ~ λᵗ: lenyap kalau |λ| < 1, meledak kalau > 1.", "LSTM: sel ingatan dengan gerbang lupa, masuk, keluar; diperbarui dengan penjumlahan."],
uji: ["Kalau faktor per langkah 0,95, setelah berapa langkah gradien tinggal di bawah 1%?", "Apa peran gerbang lupa dalam LSTM?"] },

"5.7": { viz: "attn",
deep: String.raw`<p>Kenapa √d? Kalau komponen q dan k acak dengan rata-rata 0 dan varians 1, perkalian titiknya adalah jumlah d suku bervarians 1, sehingga variansnya d (2.10). Membagi dengan √d mengembalikan varians skor ke 1, apa pun ukuran d. Ini persis seperti menormalkan suhu softmax.</p>
<p>Karena biaya n², banyak cara untuk menghemat: attention jendela lokal, attention linear, dan FlashAttention, yang tidak mengubah rumus tapi menghitungnya per blok supaya hemat memori dan cepat. Saat menghasilkan teks, key dan value token lama disimpan (KV cache) sehingga setiap token baru hanya menghitung satu baris attention.</p>
<p>Ramsauer dkk. menunjukkan bahwa satu langkah attention sama dengan satu pembaruan jaringan Hopfield modern (4.1): query ditarik ke pola tersimpan yang paling mirip. Attention adalah ingatan asosiatif.</p>`,
salah: ["Mengira attention memahami makna secara langsung. Ia hanya menimbang vektor; maknanya muncul dari matriks yang dipelajari dan tumpukan lapis.", "Lupa bahwa attention tidak tahu urutan tanpa positional encoding."],
ringkas: ["Attention = softmax(QKᵀ/√d)V: campuran value berbobot kecocokan.", "Self-attention: Q, K, V dari token yang sama; multi-head untuk banyak jenis hubungan.", "Biaya n² terhadap panjang konteks."],
uji: ["Ulangi contoh dengan q = [0; 1]. Kunci mana yang mendapat bobot terbesar?", "Kenapa model bahasa memakai topeng causal?"] },

"5.8": { viz: "ssm",
deep: String.raw`<p>Diskretisasi: untuk ODE <span class="tx">dh/dt = ah + bx</span> dengan a negatif, masukan tetap selama selang Δ menghasilkan <span class="tx">\bar a = e^{a\Delta}</span>. Karena a &lt; 0, <span class="tx">\bar a</span> selalu di antara 0 dan 1: sistem stabil secara otomatis. Δ besar membuat <span class="tx">\bar a</span> kecil (lupa cepat, perhatikan masukan sekarang); Δ kecil membuat <span class="tx">\bar a</span> mendekati 1 (ingat lama, abaikan masukan). Mamba mempelajari Δ per token, dan dari sinilah sifat "memilih" muncul.</p>
<p>Kelemahan SSM: semua sejarah harus dimampatkan ke keadaan berukuran tetap. Tugas yang menuntut menyalin persis potongan teks panjang, atau mencari satu fakta di tengah dokumen panjang, lebih mudah untuk attention yang menyimpan semuanya. Itulah alasan arsitektur hibrida.</p>`,
salah: ["Mengira SSM adalah RNN biasa. RNN punya nonlinearitas di dalam rekursi sehingga tidak bisa dihitung sebagai konvolusi.", "Mengira Mamba menggantikan attention sepenuhnya. Keduanya punya kekuatan berbeda."],
ringkas: ["h_t = Ā h_{t−1} + B̄ x_t, y_t = C h_t, linear.", "Linear → keluaran = konvolusi dengan kernel C Āᵏ B̄: latih paralel, jalankan berulang.", "Mamba: Δ, B, C bergantung token (selektif)."],
uji: ["Dengan a = 0,5, berapa sumbangan masukan 5 langkah lalu?", "Jelaskan dua mode hitung SSM dan kapan masing-masing dipakai."] },

"5.9": { viz: "sched",
deep: String.raw`<p>Kenapa varians bobot 1/n? Satu keluaran adalah jumlah n hasil kali bobot × masukan. Kalau keduanya bebas dengan rata-rata 0, variansnya n · Var(w) · Var(x) (2.10). Supaya Var(keluaran) = Var(x), perlu Var(w) = 1/n. ReLU membuang separuh, jadi He memakai 2/n.</p>
<p>Kenapa batch normalization membantu masih diperdebatkan. Penjelasan awal ("mengurangi pergeseran kovariat internal") belakangan dipertanyakan; penjelasan lain menyebut BN membuat permukaan loss lebih mulus sehingga learning rate besar aman. Ini contoh jujur bahwa banyak trik deep learning lebih dulu terbukti bekerja daripada terbukti mengapa.</p>
<p>Presisi campuran: menghitung dengan angka 16-bit menghemat memori dan dua kali lebih cepat, tapi gradien kecil bisa menjadi nol. Loss dikalikan faktor besar sebelum backprop (loss scaling), lalu gradien dibagi kembali.</p>`,
salah: ["Lupa mematikan dropout saat menguji. Di PyTorch: model.eval().", "Memakai batch normalization dengan batch berukuran 1 atau 2. Rata-rata dan simpangan bakunya tidak bermakna."],
ringkas: ["Inisialisasi: Var(w) ≈ 2/(n_masuk + n_keluar) (Glorot) atau 2/n (He, ReLU).", "Normalisasi: kurangi rata-rata, bagi simpangan baku, lalu γ, β.", "Warmup + cosine; dropout, weight decay, AdamW."],
uji: ["Hitung learning rate di langkah 25 dan 775 untuk jadwal contoh.", "Kenapa dropout harus menskala keluaran yang tersisa?"] },

"5.10": { viz: "vae",
deep: String.raw`<p>Turunan KL dua normal: tulis log rasio kedua kerapatan, ambil ekspektasi terhadap <span class="tx">\mathcal N(\mu, \sigma^2)</span>, dan pakai <span class="tx">E[z^2] = \mu^2 + \sigma^2</span>. Suku μ² menghukum rata-rata yang jauh dari nol; suku σ² − 1 − ln σ² minimum (nol) tepat di σ = 1, menghukum kode yang terlalu tajam maupun terlalu lebar.</p>
<p>β-VAE mengalikan suku KL dengan β &gt; 1 untuk memaksa kode lebih teratur, kadang menghasilkan dimensi yang bermakna terpisah (satu angka untuk sudut wajah, satu untuk senyum). Risiko sebaliknya, <b>posterior collapse</b>: decoder yang sangat kuat mengabaikan z, KL jatuh ke nol, dan kode tidak membawa informasi.</p>`,
salah: ["Mengira VAE sama dengan autoencoder ditambah derau. Bedanya adalah suku KL yang mengatur ruang kode.", "Mengambil sampel z lalu mencoba backprop melalui pengambilan acak tanpa reparameterisasi."],
ringkas: ["Autoencoder: x → z → x̂, loss rekonstruksi.", "VAE: encoder memberi μ, σ; loss = rekonstruksi + KL ke N(0, 1).", "Reparameterisasi z = μ + σε memungkinkan backprop."],
uji: ["Hitung KL untuk μ = 0, σ = 2.", "Kenapa ruang kode VAE bisa disampel sedangkan autoencoder biasa tidak?"] },

"5.11": { viz: "gan",
deep: String.raw`<p>Turunan D*: untuk satu titik x, nilai permainan adalah <span class="tx">p\log D + q\log(1-D)</span>. Turunkan terhadap D, samakan dengan nol: p/D = q/(1 − D), sehingga D = p/(p + q). Ini sama dengan regresi logistik terbaik untuk membedakan dua kelas dengan peluang awal sama.</p>
<p>Wasserstein GAN mengganti JSD dengan jarak "pemindah tanah": berapa usaha minimum memindahkan tumpukan peluang palsu ke tumpukan asli. Jarak ini tetap memberi gradien bermakna bahkan ketika dua distribusi sama sekali tidak bertumpuk, saat JSD mentok di log 2. StyleGAN memakai trik arsitektur (gaya disuntikkan per skala) untuk mencapai wajah buatan yang sulit dibedakan dari foto.</p>`,
salah: ["Mengira loss generator yang turun berarti gambar makin bagus. Loss GAN naik-turun karena lawannya juga berubah.", "Mengira D* bisa dihitung dalam praktik. p dan q tidak diketahui; D hanya mendekatinya."],
ringkas: ["G memalsukan, D mendeteksi; min-max cross-entropy biner.", "D* = p/(p + q); dengan D*, G meminimalkan JSD; optimum −log 4 saat q = p.", "Masalah: pelana, mode collapse, gradien lenyap."],
uji: ["Di sebuah titik, data asli 3 kali lebih sering daripada palsu. Berapa D*?", "Jelaskan mode collapse dengan kata sendiri."] },

"5.12": { viz: "diffuse",
deep: String.raw`<p>Kenapa menebak derau? Dari rumus <span class="tx">x_t</span>, tebakan derau langsung memberi tebakan gambar bersih: <span class="tx">\hat x_0 = (x_t - \sqrt{1-\bar\alpha_t}\,\hat\varepsilon)/\sqrt{\bar\alpha_t}</span>. Ho dkk. menemukan bahwa melatih tebakan derau dengan bobot yang sama untuk semua t, versi sederhana dari ELBO lengkap, memberi gambar terbaik. Karras dkk. (EDM) kemudian merapikan semua pilihan desain (jadwal derau, bobot loss, cara sampling) menjadi kerangka yang lebih bersih.</p>
<p>Hubungan dengan skor: untuk derau normal, <span class="tx">\nabla_{x_t}\log p(x_t \mid x_0) = -\varepsilon/\sqrt{1-\bar\alpha_t}</span>. Jadi menebak derau sama dengan menaksir skor, sampai faktor skala. Vincent (2011) membuktikan bahwa melatih penghilang derau setara dengan score matching. Proses balik lalu menjadi Langevin dynamics (4.5) yang dipandu skor, dengan suhu yang turun bertahap.</p>`,
salah: ["Mengira model difusi menyimpan gambar latih lalu menempelkannya. Ia mempelajari skor distribusi, meski bisa menghafal kalau data sedikit atau berulang.", "Mengira proses maju perlu dijalankan langkah demi langkah saat melatih. Rumus x_t melompat langsung."],
ringkas: ["Maju: x_t = √ᾱ x₀ + √(1 − ᾱ) ε; di t besar menjadi derau murni.", "Latih: tebak ε dari x_t dan t, loss MSE.", "Balik: kurangi derau bertahap; penebak derau = penaksir skor."],
uji: ["Dari tabel, kira-kira di langkah berapa sinyal dan derau seimbang?", "Jelaskan kenapa pelatihan difusi lebih stabil daripada GAN."] },

"5.13": { viz: "bigram",
deep: String.raw`<p>Kenapa token, bukan huruf atau kata? Huruf membuat urutan sangat panjang; kata membuat kosakata tak terbatas dan kata baru tidak bisa dibaca. Byte-pair encoding mulai dari huruf (atau byte) dan berulang kali menggabungkan pasangan yang paling sering muncul, sampai kosakata mencapai ukuran yang diinginkan. Kata umum menjadi satu token; kata langka dipecah menjadi beberapa potong.</p>
<p>Model bahasa besar bisa <b>berhalusinasi</b>: menghasilkan kalimat lancar yang salah. Ini akibat wajar dari tujuannya, menebak teks yang masuk akal, bukan memeriksa kebenaran. Teknik seperti retrieval (memberi model dokumen sumber), rantai penalaran (Wei dkk., chain-of-thought), dan pelatihan RL pada tugas yang bisa dicek mengurangi masalah ini, tapi tidak menghapusnya. Itulah alasan situs ini memeriksa setiap angka dengan Python.</p>`,
salah: ["Mengira LLM mencari jawaban di basis data. Ia menghasilkan token demi token dari peluang yang dipelajari.", "Mengira suhu 0 membuat jawaban benar. Suhu 0 membuat jawaban konsisten, bukan benar."],
ringkas: ["LLM = Transformer causal yang menebak token berikutnya, dilatih dengan cross-entropy.", "Perplexity = e^loss; hukum skala: loss turun mulus dengan N, D, komputasi (≈ 6ND).", "Pretraining → fine-tuning instruksi → RLHF."],
uji: ["Dari korpus contoh, berapa p(suka | aku)?", "Kenapa model 70 miliar parameter dilatih pada sekitar 1,4 triliun token menurut Chinchilla?"] },

"5.14": { viz: "grid",
deep: String.raw`<p>Kenapa value iteration pasti konvergen? Operator Bellman adalah <b>kontraksi</b>: menerapkannya pada dua tebakan nilai yang berbeda membuat selisih terbesarnya mengecil paling sedikit dengan faktor γ. Seperti peta yang dilipat berulang, semua tebakan menyusut menuju satu titik tetap. Dengan γ = 0,9, galat terbagi sekitar sepuluh setiap 22 putaran.</p>
<p>Q-learning menyimpan nilai per pasangan (keadaan, aksi), Q(s, a), dan memperbaruinya dengan <span class="tx">Q \leftarrow Q + \alpha\,[\,r + \gamma\max_{a'}Q(s', a') - Q\,]</span>. Ia belajar kebijakan terbaik bahkan ketika agen bertindak secara eksploratif. AlphaGo menggabungkan jaringan kebijakan, jaringan nilai, dan pencarian pohon Monte Carlo; AlphaGo Zero belajar dari nol hanya dengan bermain melawan dirinya sendiri.</p>`,
salah: ["Mengira imbalan sama dengan nilai. Imbalan didapat sekarang; nilai adalah perkiraan semua imbalan masa depan.", "Mengira RL butuh data berlabel. RL hanya butuh sinyal imbalan, yang bisa jarang dan tertunda."],
ringkas: ["MDP: keadaan, aksi, peluang pindah, imbalan, diskon γ.", "Bellman: V(s) = max_a [r + γ Σ P V(s')]; value iteration mengulangnya.", "TD, Q-learning, gradien kebijakan, PPO; eksplorasi vs eksploitasi."],
uji: ["Dengan γ = 0,5, berapa nilai kotak paling jauh di lorong lima kotak?", "Jelaskan kenapa γ < 1 penting untuk tugas yang tidak pernah berakhir."] },

"5.15": { viz: "bs",
deep: String.raw`<p>Langkah kunci memakai lemma Itô (4.5) pada harga opsi V(S, t): <span class="tx">dV = \left(V_t + \mu S V_S + \tfrac12\sigma^2S^2V_{SS}\right)dt + \sigma S V_S\,dW</span>. Portofolio "opsi dikurangi <span class="tx">V_S</span> saham" membuang suku dW. Tanpa risiko, ia harus tumbuh dengan laju r, dan μ ikut terhapus. Hasilnya persamaan Black–Scholes <span class="tx">V_t + rSV_S + \tfrac12\sigma^2S^2V_{SS} - rV = 0</span>, yang berubah menjadi persamaan panas setelah substitusi x = ln S.</p>
<p>Jumlah saham untuk lindung nilai, <span class="tx">V_S = N(d_1)</span>, disebut <b>delta</b>; untuk contoh di atas 0,637. Dalam praktik, pedagang membalik rumus: dari harga opsi di pasar, cari σ yang cocok (volatilitas tersirat). Kalau modelnya sempurna, σ ini sama untuk semua K; kenyataannya membentuk "senyum volatilitas", tanda asumsi normal tidak sepenuhnya tepat.</p>`,
salah: ["Mengira harga opsi bergantung pada perkiraan kita tentang naik-turunnya saham. Dalam model ini μ hilang dari rumus.", "Memakai drift μ (bukan r) dalam simulasi Monte Carlo untuk harga."],
ringkas: ["dS = μS dt + σS dW; log S normal.", "Lindung nilai menghapus risiko → PDE → persamaan panas; μ hilang.", "C = S N(d₁) − K e^(−rT) N(d₂); bisa dicek dengan Monte Carlo."],
uji: ["Apa yang terjadi pada harga opsi beli kalau σ naik? Jelaskan secara intuitif.", "Kenapa simulasi Monte Carlo memakai r, bukan μ?"] }
});
