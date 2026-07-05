
const barang = [
  { kode: "8991002121012", plu: "10001", nama: "Indomie Goreng", harga: 3500, stok: 40 },
  { kode: "8998866200112", plu: "10002", nama: "Aqua 600ml", harga: 4000, stok: 35 },
  { kode: "8999999000011", plu: "10003", nama: "Teh Pucuk Harum", harga: 5000, stok: 25 },
  { kode: "8996001300123", plu: "10004", nama: "Roti Tawar", harga: 15000, stok: 15 },
  { kode: "8992775000456", plu: "10005", nama: "Susu Ultra 250ml", harga: 7000, stok: 30 },
  { kode: "8991234567890", plu: "10006", nama: "Kopi Sachet", harga: 2000, stok: 60 }
];

let keranjang = [];
let strukTerakhir = "";

// Tanggal dan jam di atas
function updateTanggal() {
  const sekarang = new Date();
  document.getElementById("tanggal").innerText =
    "📅 " + sekarang.toLocaleDateString("id-ID") + " " + sekarang.toLocaleTimeString("id-ID");
}
setInterval(updateTanggal, 1000);
updateTanggal();

// Format rupiah
function rupiah(angka) {
  return new Intl.NumberFormat("id-ID").format(angka);
}

// Tambah barang dari input barcode / PLU
function tambahBarang() {
  const input = document.getElementById("kodeBarang");
  const kode = input.value.trim();

  if (kode === "") {
    alert("Masukkan barcode atau PLU barang dulu.");
    return;
  }

  const data = barang.find(b => b.kode === kode || b.plu === kode);

  if (!data) {
    alert("Barang tidak ditemukan. Coba kode PLU contoh: 10001, 10002, 10003.");
    input.value = "";
    return;
  }

  if (data.stok <= 0) {
    alert("Stok barang kosong.");
    return;
  }

  const sudahAda = keranjang.find(item => item.kode === data.kode);

  if (sudahAda) {
    if (sudahAda.qty < data.stok) {
      sudahAda.qty++;
    } else {
      alert("Qty melebihi stok tersedia.");
    }
  } else {
    keranjang.push({
      kode: data.kode,
      plu: data.plu,
      nama: data.nama,
      harga: data.harga,
      qty: 1,
      stok: data.stok
    });
  }

  input.value = "";
  renderKeranjang();
}

// Menampilkan isi keranjang ke tabel
function renderKeranjang() {
  const tbody = document.getElementById("listBelanja");
  tbody.innerHTML = "";

  if (keranjang.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="kosong">Belum ada barang yang dimasukkan</td></tr>`;
    document.getElementById("grandTotal").innerText = "0";
    document.getElementById("ringkasanPromo").innerText = "-";
    document.getElementById("infoPromo").value = "";
    return;
  }

  let total = 0;

  keranjang.forEach((item, index) => {
    const subtotal = item.harga * item.qty;
    total += subtotal;

    tbody.innerHTML += `
      <tr>
        <td>☰</td>
        <td>${index + 1}</td>
        <td>${item.plu} - ${item.nama}</td>
        <td>${rupiah(item.harga)}</td>
        <td>
          <button class="qty-btn" onclick="ubahQty(${index}, -1)">-</button>
          ${item.qty}
          <button class="qty-btn" onclick="ubahQty(${index}, 1)">+</button>
        </td>
        <td>${rupiah(subtotal)}</td>
        <td><button class="hapus" onclick="hapusBarang(${index})">Hapus</button></td>
      </tr>
    `;
  });

  const diskon = hitungDiskon(total);
  const grandTotal = total - diskon;

  document.getElementById("grandTotal").innerText = rupiah(grandTotal);

  if (diskon > 0) {
    document.getElementById("ringkasanPromo").innerText =
      "Promo belanja di atas Rp50.000, diskon Rp5.000";
    document.getElementById("infoPromo").value =
      "Selamat! Transaksi mendapatkan diskon Rp5.000.";
  } else {
    document.getElementById("ringkasanPromo").innerText =
      "Belum ada promo yang digunakan";
    document.getElementById("infoPromo").value =
      "Promo aktif: Diskon Rp5.000 jika belanja minimal Rp50.000.";
  }
}

// Hitung diskon sederhana
function hitungDiskon(total) {
  if (total >= 50000) {
    return 5000;
  }
  return 0;
}

// Ubah qty
function ubahQty(index, nilai) {
  keranjang[index].qty += nilai;

  if (keranjang[index].qty <= 0) {
    keranjang.splice(index, 1);
  } else if (keranjang[index].qty > keranjang[index].stok) {
    keranjang[index].qty = keranjang[index].stok;
    alert("Stok tidak cukup.");
  }

  renderKeranjang();
}

// Hapus barang
function hapusBarang(index) {
  keranjang.splice(index, 1);
  renderKeranjang();
}

// Proses bayar
function prosesBayar() {
  if (keranjang.length === 0) {
    alert("Keranjang masih kosong.");
    return;
  }

  let total = keranjang.reduce((sum, item) => sum + (item.harga * item.qty), 0);
  let diskon = hitungDiskon(total);
  let grandTotal = total - diskon;
  let uangBayar = Number(document.getElementById("uangBayar").value);
  let metode = document.getElementById("metodeBayar").value;
  let member = document.getElementById("memberInput").value || "-";

  if (metode === "Tunai" && uangBayar < grandTotal) {
    alert("Uang bayar kurang.");
    return;
  }

  if (metode !== "Tunai") {
    uangBayar = grandTotal;
  }

  let kembalian = uangBayar - grandTotal;

  // Buat isi struk
  let isi = `
    <p><b>POS KASIR MINIMARKET</b></p>
    <p>Tanggal: ${new Date().toLocaleString("id-ID")}</p>
    <p>Member: ${member}</p>
    <hr>
  `;

  keranjang.forEach(item => {
    isi += `
      <p>${item.nama}<br>
      ${item.qty} x Rp${rupiah(item.harga)} = Rp${rupiah(item.qty * item.harga)}</p>
    `;
  });

  isi += `
    <hr>
    <p>Subtotal: Rp${rupiah(total)}</p>
    <p>Diskon: Rp${rupiah(diskon)}</p>
    <p><b>Total: Rp${rupiah(grandTotal)}</b></p>
    <p>Metode: ${metode}</p>
    <p>Bayar: Rp${rupiah(uangBayar)}</p>
    <p>Kembalian: Rp${rupiah(kembalian)}</p>
    <hr>
    <p>Terima kasih sudah berbelanja.</p>
  `;

  strukTerakhir = isi;
  document.getElementById("isiStruk").innerHTML = isi;
  document.getElementById("modalStruk").style.display = "flex";

  // Simpan laporan sederhana ke localStorage
  simpanLaporan(total, diskon, grandTotal, metode);

  // Kosongkan transaksi
  keranjang = [];
  document.getElementById("uangBayar").value = "";
  renderKeranjang();
}

// Simpan laporan penjualan sederhana
function simpanLaporan(subtotal, diskon, total, metode) {
  let laporan = JSON.parse(localStorage.getItem("laporanPOS")) || [];

  laporan.push({
    tanggal: new Date().toLocaleString("id-ID"),
    subtotal: subtotal,
    diskon: diskon,
    total: total,
    metode: metode
  });

  localStorage.setItem("laporanPOS", JSON.stringify(laporan));
}

// Tutup modal
function tutupModal() {
  document.getElementById("modalStruk").style.display = "none";
}

// Input barang manual
function inputBarangManual() {
  const kode = prompt("Masukkan PLU barang contoh: 10001 / 10002 / 10003");
  if (kode) {
    document.getElementById("kodeBarang").value = kode;
    tambahBarang();
  }
}

// Pending transaksi
function pendingTransaksi() {
  if (keranjang.length === 0) {
    alert("Tidak ada transaksi yang bisa dipending.");
    return;
  }

  localStorage.setItem("pendingPOS", JSON.stringify(keranjang));
  alert("Transaksi berhasil dipending.");
}

// Reprint struk
function reprintStruk() {
  if (strukTerakhir === "") {
    alert("Belum ada struk terakhir.");
    return;
  }

  document.getElementById("isiStruk").innerHTML = strukTerakhir;
  document.getElementById("modalStruk").style.display = "flex";
}

// Kalkulator sederhana
function bukaKalkulator() {
  let a = Number(prompt("Masukkan angka pertama:"));
  let b = Number(prompt("Masukkan angka kedua:"));
  alert("Hasil penjumlahan: " + (a + b));
}

// Laporan sales sederhana
function laporanSales() {
  let laporan = JSON.parse(localStorage.getItem("laporanPOS")) || [];

  if (laporan.length === 0) {
    alert("Belum ada laporan penjualan.");
    return;
  }

  let teks = "LAPORAN SALES\n\n";
  let totalSemua = 0;

  laporan.forEach((l, i) => {
    teks += `${i + 1}. ${l.tanggal} | ${l.metode} | Rp${rupiah(l.total)}\n`;
    totalSemua += l.total;
  });

  teks += `\nTotal Penjualan: Rp${rupiah(totalSemua)}`;
  alert(teks);
}

// Reset transaksi
function resetTransaksi() {
  if (confirm("Reset transaksi sekarang?")) {
    keranjang = [];
    renderKeranjang();
  }
}

// Bisa tekan Enter untuk input barang
document.getElementById("kodeBarang").addEventListener("keyup", function(e) {
  if (e.key === "Enter") {
    tambahBarang();
  }
});


// Tambahan: buka transaksi yang sebelumnya dipending
function bukaPendingTransaksi() {
  const pending = JSON.parse(localStorage.getItem("pendingPOS")) || [];
  if (pending.length === 0) {
    alert("Belum ada transaksi pending.");
    return;
  }
  keranjang = pending;
  localStorage.removeItem("pendingPOS");
  renderKeranjang();
  alert("Transaksi pending berhasil dibuka kembali.");
}

// Tambahan: ekspor laporan sales ke file CSV
function exportLaporanCSV() {
  const laporan = JSON.parse(localStorage.getItem("laporanPOS")) || [];
  if (laporan.length === 0) {
    alert("Belum ada laporan yang bisa diekspor.");
    return;
  }
  let csv = "Tanggal,Subtotal,Diskon,Total,Metode\n";
  laporan.forEach(l => {
    csv += `"${l.tanggal}",${l.subtotal},${l.diskon},${l.total},"${l.metode}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "laporan-sales-pos.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
