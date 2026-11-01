/* Arti simbol rumus Lapis 4, per pelajaran. */
Object.assign(window.LEGENDA, {
"4.1": {
  "k": "konstanta Boltzmann, pengubah satuan suhu ke energi",
  "T": "suhu sistem",
  "Ω": "banyaknya susunan mikro yang mungkin",
  "S": "entropi, ukuran banyaknya susunan yang mungkin",
  "E": "energi sebuah keadaan atau sistem"
},
"4.2": {
  "E": "energi keadaan; E_i untuk keadaan ke-i",
  "i": "nomor keadaan atau pilihan yang sedang dihitung",
  "p": "peluang sistem berada di keadaan itu",
  "k": "konstanta Boltzmann",
  "T": "suhu; di softmax: pengatur seberapa acak pilihan",
  "Z": "fungsi partisi, jumlah semua bobot agar peluang totalnya 1",
  "j": "nomor keadaan yang dijumlahkan semuanya",
  "z": "logit, skor mentah model untuk tiap pilihan",
  "d": "dimensi vektor, pembagi skor di attention",
  "c": "angka sama yang ditambahkan ke semua logit",
  "β": "kebalikan suhu, 1/kT"
},
"4.3": {
  "F": "energi bebas: energi rata-rata dikurangi suhu kali entropi",
  "E": "energi; di Bayes: energi parameter = minus log-peluang (E = −log p, sampai konstanta)",
  "T": "suhu",
  "S": "entropi sistem",
  "k": "konstanta Boltzmann",
  "Z": "fungsi partisi, penormal agar peluang total 1",
  "q": "distribusi tebakan (pendekatan) untuk distribusi asli",
  "H": "entropi distribusi q, ukuran keacakannya",
  "D": "data pengamatan; juga D_KL, divergensi KL: ukuran beda dua distribusi (tidak simetris)",
  "p": "distribusi peluang asli (Boltzmann atau posterior)",
  "θ": "parameter atau bobot model"
},
"4.4": {
  "X": "posisi pejalan acak setelah n langkah",
  "n": "banyaknya langkah acak",
  "W": "gerak Brown (proses Wiener) pada waktu tertentu",
  "t": "waktu (akhir)",
  "s": "waktu awal yang lebih dulu dari t",
  "Δ": "selisih kecil; Δt = langkah waktu",
  "γ": "koefisien gesekan partikel dengan cairan",
  "D": "koefisien difusi, laju partikel menyebar",
  "k": "konstanta Boltzmann",
  "T": "suhu cairan"
},
"4.5": {
  "σ": "kekuatan derau acak",
  "d": "perubahan sangat kecil, misalnya dX dan dt",
  "X": "keadaan yang bergerak acak; X_n setelah n langkah",
  "f": "drift, arah tarikan deterministik",
  "t": "waktu",
  "W": "gerak Brown, sumber keacakan",
  "Δ": "selisih kecil; Δt = langkah waktu simulasi",
  "ξ": "angka acak normal baku tiap langkah",
  "n": "nomor langkah simulasi",
  "κ": "kekuatan tarikan kembali ke nol (proses OU)",
  "E": "energi; partikel turun menuruni lerengnya",
  "T": "suhu, besar derau",
  "p": "distribusi peluang akhir posisi",
  "x": "nilai posisi; x_0 = posisi awal",
  "g": "fungsi dari X yang perubahannya dihitung lemma Itô"
},
"4.6": {
  "u": "kepadatan atau suhu di posisi dan waktu tertentu",
  "t": "waktu",
  "D": "koefisien difusi, laju penyebaran",
  "x": "posisi",
  "σ": "kekuatan derau",
  "p": "kepadatan peluang posisi partikel",
  "f": "drift, arah tarikan pada posisi x",
  "Δ": "selisih kecil: Δx jarak grid, Δt langkah waktu",
  "i": "nomor titik grid",
  "y": "arah posisi kedua (dimensi kedua)"
},
"4.7": {
  "H": "Hamiltonian, energi total: kinetik plus potensial",
  "q": "posisi; di HMC: parameter yang dijelajahi",
  "p": "momentum; juga peluang p(θ)",
  "m": "massa",
  "U": "energi potensial; di HMC: minus log-peluang",
  "d": "perubahan sangat kecil, seperti dq dan dt",
  "t": "waktu",
  "Δ": "selisih kecil; Δt = langkah waktu",
  "θ": "parameter atau bobot model"
}
});
