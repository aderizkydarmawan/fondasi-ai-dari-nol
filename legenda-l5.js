/* Arti simbol rumus Lapis 5, per pelajaran. */
Object.assign(window.LEGENDA, {
"5.1": {
 "X": "tabel data: satu baris per contoh, satu kolom per fitur",
 "y": "nilai asli: angka bebas di regresi linear, 0 atau 1 di regresi logistik; ȳ = rata-ratanya, ŷ = tebakan model",
 "w": "bobot: seberapa penting tiap fitur input",
 "x": "input/fitur data, bisa satu angka atau vektor",
 "b": "bias: angka geser yang ditambahkan ke hasil",
 "z": "skor mentah w·x + b sebelum masuk sigmoid",
 "σ": "fungsi sigmoid: memeras skor jadi peluang 0 sampai 1",
 "L": "loss log (cross-entropy): ukuran salahnya tebakan",
 "p": "p̂: peluang kelas 1 yang ditebak model"
},
"5.2": {
 "G": "indeks Gini: ukuran campur-aduknya kelas di satu simpul",
 "k": "nomor kelas, dijumlah untuk semua kelas",
 "p": "proporsi data kelas k di simpul itu",
 "ρ": "korelasi rata-rata antar pohon",
 "σ": "σ²: ragam (variance) tebakan satu pohon",
 "B": "banyaknya pohon yang dirata-ratakan"
},
"5.4": {
 "w": "bobot (vektor); juga satu bobot yang diuji gradiennya",
 "x": "vektor input ke lapisan",
 "b": "bias: angka geser tiap neuron",
 "φ": "fungsi aktivasi, misalnya ReLU max(0, z)",
 "h": "vektor keluaran lapisan tersembunyi; juga langkah kecil cek gradien",
 "W": "matriks bobot lapisan (W₁, W₂ = lapisan 1, 2)",
 "z": "nilai masuk ke fungsi aktivasi",
 "L": "loss: ukuran salahnya jaringan"
},
"5.5": {
 "x": "input blok, diteruskan langsung lewat jalan pintas",
 "F": "perubahan yang dipelajari lapisan-lapisan di dalam blok"
},
"5.6": {
 "h": "keadaan tersembunyi: ingatan jaringan di langkah t",
 "t": "nomor langkah waktu (kata ke-t dalam urutan)",
 "W": "matriks bobot dari ingatan lama ke ingatan baru",
 "U": "matriks bobot dari input ke ingatan",
 "x": "input pada langkah t, misalnya vektor kata",
 "b": "vektor bias",
 "c": "sel memori LSTM; c̃ = calon isi baru",
 "f": "gerbang lupa: berapa banyak memori lama disimpan",
 "i": "gerbang input: berapa banyak isi baru dimasukkan"
},
"5.7": {
 "n": "panjang urutan: banyak token",
 "Q": "query: 'aku sedang mencari apa' tiap token",
 "K": "key: 'aku berisi apa' tiap token",
 "V": "value: isi yang diambil kalau cocok",
 "d": "dimensi vektor key; √d meredam skor biar tak terlalu besar",
 "X": "matriks embedding token masukan",
 "W": "matriks bobot yang dipelajari (W_Q, W_K, W_V)"
},
"5.8": {
 "d": "lambang turunan: d/dt = laju perubahan terhadap waktu",
 "h": "keadaan tersembunyi: ringkasan masa lalu",
 "t": "waktu atau nomor langkah",
 "A": "matriks yang mengatur cara ingatan berubah/meluruh; Ā versi diskret",
 "B": "matriks yang memasukkan input ke keadaan; B̄ versi diskret",
 "x": "input pada waktu t (atau s)",
 "y": "output model pada waktu t",
 "C": "matriks yang membaca keadaan jadi output",
 "a": "angka peluruhan ingatan versi satu dimensi",
 "s": "waktu lampau saat input x_s masuk",
 "b": "angka penguat input versi satu dimensi",
 "Δ": "ukuran langkah waktu saat diskretisasi"
},
"5.10": {
 "x": "data asli (gambar); x̂ = hasil rekonstruksi",
 "μ": "rata-rata kode yang ditebak encoder",
 "σ": "simpangan baku kode yang ditebak encoder",
 "q": "encoder: sebaran kode z bila diberi x",
 "z": "kode laten: ringkasan acak dari data",
 "p": "decoder: peluang menghasilkan x dari kode z",
 "D": "D_KL: divergensi KL, ukuran beda sebaran kode dari N(0, 1)",
 "ε": "derau acak dari normal baku N(0,1)",
 "E": "nilai harapan: rata-rata berbobot peluang dari isi kurungnya (2.10)"
},
"5.11": {
 "G": "generator: pembuat data palsu dari derau",
 "D": "diskriminator: peluang data itu asli",
 "x": "contoh data (asli atau buatan)",
 "p": "sebaran data asli",
 "z": "derau acak masukan generator",
 "q": "sebaran data buatan generator"
},
"5.12": {
 "x": "gambar; x₀ bersih, x_t setelah t langkah derau",
 "β": "banyak derau ditambah pada langkah t",
 "t": "nomor langkah penambahan derau",
 "α": "ᾱ_t: porsi sinyal asli yang tersisa di langkah t",
 "ε": "derau Gaussian; ε_θ = tebakan derau oleh jaringan",
 "I": "matriks identitas: derau tiap piksel bebas, ragam 1",
 "s": "indeks langkah yang dikalikan, dari 1 sampai t",
 "θ": "parameter (bobot) jaringan penebak derau",
 "L": "loss: selisih kuadrat derau asli dan tebakan",
 "T": "langkah terakhir, gambar sudah jadi derau murni",
 "p": "sebaran peluang data; ∇log p = arah skor"
},
"5.13": {
 "p": "peluang sebuah kalimat atau kata berikutnya",
 "w": "kata/token; w_t = token ke-t",
 "n": "panjang kalimat dalam token",
 "t": "posisi token dalam kalimat",
 "N": "banyaknya parameter model",
 "D": "banyaknya token data latih"
},
"5.14": {
 "γ": "faktor diskon: imbalan nanti dihargai lebih kecil",
 "G": "return: total imbalan terdiskon mulai waktu t",
 "t": "langkah waktu",
 "r": "imbalan (reward) yang diterima",
 "V": "nilai keadaan: total imbalan terbaik dari s",
 "s": "keadaan (state); s' = keadaan berikutnya",
 "a": "aksi yang dipilih agen; a' = aksi berikutnya",
 "P": "peluang pindah ke s' setelah aksi a",
 "α": "laju belajar: seberapa besar Q diperbarui",
 "Q": "nilai aksi a di keadaan s"
},
"5.15": {
 "S": "harga saham; S_T = harga saat jatuh tempo",
 "T": "waktu jatuh tempo opsi",
 "K": "harga kesepakatan (strike) opsi",
 "μ": "rata-rata laju naik harga saham (drift)",
 "σ": "volatilitas: seberapa liar harga bergoyang",
 "d": "perubahan sangat kecil; d₁, d₂ angka bantu rumus",
 "t": "waktu; V_t = laju perubahan V terhadap waktu",
 "W": "gerak Brown: guncangan acak pasar",
 "C": "harga wajar opsi call",
 "N": "fungsi peluang kumulatif normal baku",
 "r": "suku bunga bebas risiko",
 "V": "nilai opsi; V_S, V_SS turunannya terhadap S"
}
});
