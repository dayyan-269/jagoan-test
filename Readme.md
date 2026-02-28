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
* buat database serta sesuaikan dengan konfigurasi .env, lalu anda bisa import db dari folder `/database/dump-jagoan-test.sql`.
* jalankan command `composer install`.
* jalankan command `php artisan key:generate` untuk setup app key.
* jalankan command `php artisan serve` untuk memulai dev server.

### Frontend

* email admin@email.com | password: password
* jalankan command `npm i` untuk install dependancy
* masukkan url api server yang dimulai pada konfigurasi file di `/src/env.ts`.
* jalankan `npm run dev` untuk memulai dev server.

# Fitur

## Login

![Login](https://github.com/dayyan-269/jagoan-test/blob/master/JAGO/login.png)

Halaman utama ketika dev server telah dijalankan.

## Dashboard

![Dashboard](https://github.com/dayyan-269/jagoan-test/blob/master/JAGO/dash/1.png)

Pada dashboard terdapat ringkasan singkat mengenai finansial seperti, total saldo, pengeluaran/pemasukkan bulan ini. 

![Report](https://github.com/dayyan-269/jagoan-test/blob/master/JAGO/dash/2.png)

Serta itu ada pula laporan kegiatan finansial yg terdiri dari Pemasukkan (pembayaran kontrak rumah, pembayaran iuran) dan Pengeluaran (pengeluaran).

## Olah Rumah

![table rumah](https://github.com/dayyan-269/jagoan-test/blob/master/JAGO/rumah/tab.png)

Disini adalah halaman dimana admin dapat menambahkan data rumah baru. 

![history rumah](https://github.com/dayyan-269/jagoan-test/blob/master/JAGO/rumah/history.png)

Pada halaman ini anda dapat melihat history masing masing rumah beserta tagihan yang dibayar oleh para penghuni.

![assign resident](https://github.com/dayyan-269/jagoan-test/blob/master/JAGO/rumah/assign.png)

Selain itu, anda juga dapat melakukan pemindahan ketika penghuni ingin pindah ke rumah lain.

## Olah Penghuni

![table](https://github.com/dayyan-269/jagoan-test/blob/master/JAGO/penghuni/table.png)

Halaman ini merupakan halaman yang berfokus untuk mengelolah data para penghuni yang ada.

![history user](https://github.com/dayyan-269/jagoan-test/blob/master/JAGO/penghuni/history.png)

Selain itu juga terdapat history pembayaran kontrak rumah serta iuran yang telah dibayar.

## Olah Pembayaran Kontrak

![kontrak](https://github.com/dayyan-269/jagoan-test/blob/master/JAGO/kontrak/tab.png)

Tentunya sebagai fitur utama anda dapat melakukan input pembayaran kontrak rumah oleh para penghuni yang ada.

## Olah Pembayaran Iuran

![iuran](https://github.com/dayyan-269/jagoan-test/blob/master/JAGO/iuran/add.png)

Pada halaman ini anda dapat melakukan pencatatan untuk pembayaran iuran untuk para penghuni.

## Olah Pembayaran Pengeluaran

![pengeluaran](https://github.com/dayyan-269/jagoan-test/blob/master/JAGO/pengeluaran/tab.png)

Seperti di pembayaran iuran, halaman ini adalah pencatatan untuk pengeluaran anda.

## Olah Data Master

![master iuran](https://github.com/dayyan-269/jagoan-test/blob/master/JAGO/jenis%20iuran/tab.png)

Pada data master digunakan untuk melakukan pengolahan data jenis-jenis pembayaran iuran dan pengeluaran.

![master pengeluaran](https://github.com/dayyan-269/jagoan-test/blob/master/JAGO/jenis%20pengeluaran/tab.png)
