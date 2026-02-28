# Dokumentasi

## Spesifikasi

### Backend

* PHP 8.4
* MariaDB 11.4
* Laravel 12

### Frontend

* Node v24
* Vite

## Instalasi

### Backend

* copy file .env.example menjadi .env
* buat database serta sesuaikan dengan konfigurasi .env, lalu anda bisa import db dari folder `/database/jagoan-test`.
* jalankan command `composer install`.
* jalankan command `php artisan key:generate` untuk setup app key.
* jalankan command `php artisan serve` untuk memulai dev server.

### Frontend

* jalankan command `npm i` untuk install dependancy
* masukkan url api server yang dimulai pada konfigurasi file di `/src/env.ts`.
* jalankan `npm run dev` untuk memulai dev server.

# Fitur

## Dashboard

Pada dashboard terdapat ringkasan singkat mengenai finansial seperti, total saldo, pengeluaran/pemasukkan bulan ini. 

Serta itu ada pula laporan kegiatan finansial yg terdiri dari Pemasukkan (pembayaran kontrak rumah, pembayaran iuran) dan Pengeluaran (pengeluaran).

## Olah Rumah

Disini adalah halaman dimana admin dapat menambahkan data rumah baru. 

Pada halaman ini anda dapat melihat history masing masing rumah beserta tagihan yang dibayar oleh para penghuni.

Selain itu, anda juga dapat melakukan pemindahan ketika penghuni ingin pindah ke rumah lain.

## Olah Penghuni

Halaman ini merupakan halaman yang berfokus untuk mengelolah data para penghuni yang ada. selain itu juga terdapat history pembayaran kontrak rumah serta iuran yang telah dibayar.

## Olah Pembayaran Kontrak

Tentunya sebagai fitur utama anda dapat melakukan input pembayaran kontrak rumah oleh para penghuni yang ada.

## Olah Pembayaran Iuran

Pada halaman ini anda dapat melakukan pencatatan untuk pembayaran iuran untuk para penghuni.

## Olah Pembayaran Pengeluaran

Seperti di pembayaran iuran, halaman ini adalah pencatatan untuk pengeluaran anda.

## Olah Data Master

Pada data master digunakan untuk melakukan pengolahan data jenis-jenis pembayaran iuran dan pengeluaran.