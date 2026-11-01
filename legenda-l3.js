/* Arti simbol rumus Lapis 3, per pelajaran. */
Object.assign(window.LEGENDA, {
"3.1": {
 "θ": "parameter model yang sedang diperbaiki",
 "η": "learning rate: seberapa besar langkah tiap kali update",
 "L": "loss: angka salah model yang ingin dikecilkan",
 "x": "koordinat pertama di contoh lembah x² + 25y²",
 "y": "koordinat kedua, arah lembah yang curam",
 "β": "faktor ingatan momentum, seberapa banyak kecepatan lama disimpan",
 "v": "momentum: kecepatan terkumpul; di Adam: rata-rata gradien kuadrat",
 "ε": "angka sangat kecil agar tidak membagi dengan nol",
 "m": "rata-rata gradien yang berjalan di Adam (topi = dikoreksi)"
},
"3.2": {
 "L": "likelihood: peluang data muncul kalau parameternya segini",
 "p": "peluang yang ditebak; p̂ = tebakan terbaiknya",
 "θ": "parameter model yang dicari",
 "y": "nilai keluaran yang diamati",
 "f": "fungsi model dengan parameter θ",
 "x": "masukan ke model"
},
"3.3": {
 "θ": "parameter yang tidak diketahui",
 "p": "peluang/keyakinan; juga peluang muncul gambar koin",
 "D": "data yang sudah diamati",
 "λ": "kekuatan hukuman weight decay",
 "w": "bobot model",
 "a": "parameter prior Beta, seperti hitungan gambar bayangan",
 "b": "parameter prior Beta, seperti hitungan angka bayangan",
 "h": "jumlah hasil gambar yang teramati",
 "t": "jumlah hasil angka yang teramati"
},
"3.4": {
 "p": "distribusi peluang yang benar; pᵢ peluang kejadian ke-i",
 "H": "entropi: rata-rata kejutan; H(p,q) = cross-entropy",
 "i": "nomor kejadian/kelas yang dijumlahkan",
 "q": "distribusi tebakan model",
 "D": "D_KL: jarak (divergensi) dari p ke q"
},
"3.5": {
 "f": "fungsi benar; f̂ tebakan model, f̄ rata-rata tebakan"
},
"3.6": {
 "s": "sinyal masukan yang diolah",
 "k": "kernel/filter yang digeser di atas sinyal",
 "n": "posisi keluaran yang sedang dihitung",
 "m": "posisi yang dijumlahkan sepanjang sinyal"
},
"3.7": {
 "d": "lambang perubahan sangat kecil, seperti di dy/dt",
 "y": "besaran yang berubah terhadap waktu; y₀ nilai awal",
 "t": "waktu",
 "k": "laju peluruhan: makin besar, makin cepat turun",
 "Δ": "Δt: ukuran langkah waktu di metode Euler",
 "n": "nomor langkah ke-n",
 "f": "aturan yang memberi laju perubahan dari keadaan sekarang",
 "θ": "parameter model yang bergerak menuruni loss",
 "L": "loss yang ingin dikecilkan",
 "A": "matriks yang menentukan sistem linear"
},
"3.8": {
 "P": "matriks transisi: peluang pindah antar keadaan",
 "x": "distribusi peluang keadaan sekarang",
 "b": "peluang pindah dari hujan ke cerah",
 "a": "peluang pindah dari cerah ke hujan",
 "i": "nomor keadaan asal",
 "j": "nomor keadaan tujuan"
}
});
