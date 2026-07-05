CARA MENJADIKAN POS KASIR MENJADI APK ANDROID

Nama aplikasi:
POS Kasir Minimarket

Jenis:
Aplikasi Android berbasis WebView.
File HTML, CSS, JavaScript, manifest, service-worker, dan icon POS sudah dimasukkan ke dalam aplikasi Android.

CARA BUILD TANPA ANDROID STUDIO:

1. Extract ZIP project ini.
2. Upload semua isi folder ke repository GitHub.
3. Pastikan struktur repository terlihat seperti ini:
   - app
   - .github/workflows
   - build.gradle
   - settings.gradle

4. Buka tab Actions.
5. Pilih workflow:
   Build POS APK Android

6. Klik:
   Run workflow

7. Tunggu sampai centang hijau.
8. Download bagian Artifacts:
   POS-Kasir-Minimarket-APK

9. Extract hasil download.
10. Di dalamnya ada:
    app-debug.apk

11. Kirim app-debug.apk ke HP.
12. Install aplikasi.

CATATAN:
- APK ini versi debug, cocok untuk tugas/pengujian.
- Jika Play Protect muncul, pilih Detail selengkapnya lalu Tetap install.
- Aplikasi berjalan offline karena semua file POS dimasukkan ke assets Android.
- Data transaksi/laporan tersimpan memakai localStorage WebView di HP.
