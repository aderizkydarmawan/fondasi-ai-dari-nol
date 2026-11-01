/* Arti simbol rumus Lapis 6, per pelajaran. */
Object.assign(window.LEGENDA, {
"6.1": {
 "p": "peluang; p_i = peluang keadaan atau token ke-i", "i": "nomor keadaan atau token yang sedang dihitung", "j": "nomor yang berjalan di penjumlahan, melewati semua keadaan atau token",
 "E": "energi tiap keadaan (4.1); energi rendah lebih mungkin", "T": "suhu (fisika) atau temperature (LLM): pembagi yang mengatur seberapa acak", "z": "logit: skor mentah dari jaringan sebelum softmax"
},
"6.2": {
 "X": "variabel acak pertama", "Y": "variabel acak kedua, bebas dari X", "x": "keadaan yang bergerak; x₀ = data asli, x_t = data setelah dicampur noise sampai langkah t",
 "d": "perubahan sangat kecil: dx, dt, dW", "f": "arah dorongan rata-rata di SDE (drift)", "t": "waktu atau nomor langkah", "g": "besar guncangan noise di SDE",
 "W": "gerak Brown (4.4)", "μ": "rata-rata (pusat) yang digeser", "σ": "simpangan baku: seberapa lebar diregangkan", "ε": "noise normal standar, rata-rata 0 varians 1",
 "z": "sampel laten hasil geser-regang", "α": "ᾱ_t = hasil kali semua (1 − β) sampai langkah t: bagian sinyal yang tersisa", "n": "jumlah langkah jalan acak"
},
"6.3": {
 "H": "entropi H(p) atau cross-entropy H(p, q), dalam bit", "p": "distribusi asli data", "q": "distribusi tebakan model", "i": "nomor kemungkinan yang dijumlahkan", "D": "D_KL = divergensi KL (3.4)"
},
"6.4": {
 "Q": "matriks query: tiap baris satu pertanyaan 'aku mencari apa'", "K": "matriks key: tiap baris label 'aku berisi apa'", "V": "matriks value: isi yang diambil",
 "d": "dimensi; d_k = panjang vektor key, d_model = panjang vektor tiap token (512)", "k": "penanda 'key' pada d_k", "h": "jumlah kepala attention (8)",
 "x": "vektor satu token yang masuk ke feed-forward", "W": "matriks bobot yang dipelajari", "b": "vektor bias", "i": "nomor pasangan dimensi; dimensi 2i memakai sin, 2i+1 memakai cos"
},
"6.5": {
 "β": "β_t = varians noise yang ditambahkan di langkah t (10⁻⁴ sampai 0,02)", "q": "proses maju: cara data dirusak", "x": "x₀ = gambar asli, x_t = gambar setelah t langkah noise",
 "t": "nomor langkah, 1 sampai T", "T": "jumlah langkah total (1000)", "I": "matriks identitas: noise bebas di tiap piksel dengan varians sama", "α": "α_t = 1 − β_t; ᾱ_t = hasil kali semua α sampai t",
 "s": "nomor langkah yang berjalan di perkalian ∏", "ε": "noise normal standar yang dicampurkan", "θ": "parameter jaringan", "L": "loss; L_simple = loss sederhana persamaan (14)",
 "σ": "σ_t = besar noise segar di langkah pembuatan gambar", "z": "noise segar normal standar"
},
"6.6": {
 "θ": "parameter decoder", "φ": "parameter encoder", "p": "distribusi model: p_θ(x|z) decoder, p_θ(z) prior N(0, I), p_θ(z|x) posterior asli",
 "x": "data, misalnya gambar", "z": "kode laten tersembunyi", "q": "q_φ(z|x): encoder, tebakan kode dari data", "D": "D_KL = divergensi KL (3.4)",
 "μ": "rata-rata kode yang dikeluarkan encoder", "σ": "simpangan baku kode yang dikeluarkan encoder", "ε": "noise normal standar", "I": "matriks identitas", "j": "nomor dimensi laten yang dijumlahkan"
},
"6.7": {
 "β": "β₁, β₂ = laju lupa rata-rata bergerak (0,9 dan 0,999)", "m": "rata-rata bergerak gradien (momentum); m̂ = setelah koreksi bias", "t": "nomor langkah",
 "g": "gradien di langkah t", "v": "rata-rata bergerak kuadrat gradien; v̂ = setelah koreksi bias", "θ": "bobot yang dilatih",
 "α": "ukuran langkah (learning rate), bawaan 0,001", "ε": "angka sangat kecil (10⁻⁸) agar tidak membagi nol"
},
"6.8": {
 "G": "generator: mengubah noise z jadi gambar palsu", "D": "diskriminator: peluang bahwa input adalah data asli; D* = diskriminator terbaik",
 "V": "nilai permainan yang diperebutkan D dan G", "x": "contoh data (gambar)", "p": "distribusi: p_data = data asli, p_g = keluaran generator, p_z = noise",
 "z": "noise acak yang dimasukkan ke generator", "g": "penanda 'generator' pada p_g", "a": "koefisien (peluang data asli) dalam bukti Proposisi 1",
 "y": "nilai D yang dicari dalam bukti Proposisi 1", "b": "koefisien (peluang data palsu) dalam bukti Proposisi 1", "C": "C(G) = nilai permainan ketika D sudah terbaik"
},
"6.9": {
 "H": "entropi: ketidakpastian rata-rata, dalam bit kalau log₂", "K": "konstanta positif yang hanya memilih satuan", "i": "nomor kemungkinan",
 "n": "banyaknya kemungkinan", "p": "peluang tiap kemungkinan"
}
});
