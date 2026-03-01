-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: db
-- ------------------------------------------------------
-- Server version	11.8.5-MariaDB-ubu2404-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `due_payments`
--

DROP TABLE IF EXISTS `due_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `due_payments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `due_type_id` bigint(20) unsigned NOT NULL,
  `resident_id` bigint(20) unsigned NOT NULL,
  `date` date NOT NULL DEFAULT curdate(),
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `due_payments_due_type_id_foreign` (`due_type_id`),
  KEY `due_payments_resident_id_foreign` (`resident_id`),
  CONSTRAINT `due_payments_due_type_id_foreign` FOREIGN KEY (`due_type_id`) REFERENCES `due_types` (`id`) ON DELETE CASCADE,
  CONSTRAINT `due_payments_resident_id_foreign` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `due_payments`
--

LOCK TABLES `due_payments` WRITE;
/*!40000 ALTER TABLE `due_payments` DISABLE KEYS */;
INSERT INTO `due_payments` VALUES (2,1,2,'2026-01-15',NULL,'2026-02-25 02:01:51','2026-02-25 02:01:51'),(4,2,1,'2026-01-15',NULL,'2026-02-25 02:02:20','2026-02-25 02:02:20'),(5,5,3,'2026-02-01',NULL,'2026-02-25 02:02:20','2026-03-01 10:33:35'),(6,1,4,'2026-03-01',NULL,NULL,NULL),(7,1,4,'2026-04-01',NULL,NULL,NULL),(8,1,4,'2026-05-01',NULL,NULL,NULL),(9,1,4,'2026-06-01',NULL,NULL,NULL),(10,1,4,'2026-07-01',NULL,NULL,NULL);
/*!40000 ALTER TABLE `due_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `due_types`
--

DROP TABLE IF EXISTS `due_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `due_types` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `amount` decimal(20,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `due_types`
--

LOCK TABLES `due_types` WRITE;
/*!40000 ALTER TABLE `due_types` DISABLE KEYS */;
INSERT INTO `due_types` VALUES (1,'Iuran Satpam',85000.00,'2026-02-25 01:52:34','2026-02-25 01:56:31',NULL),(2,'Iuran Kebersihan',20000.00,'2026-02-25 01:54:02','2026-02-25 01:54:02',NULL),(3,'Iuran Wifi',10000.00,'2026-02-27 11:09:53','2026-02-27 13:22:51','2026-02-27 13:22:51'),(4,'Iuran Kendaraan',5000.00,'2026-02-27 11:12:49','2026-02-27 11:31:00',NULL),(5,'Iuran Kesehatan',25000.00,'2026-02-27 11:16:32','2026-02-27 14:32:08',NULL),(6,'Iuran Kesehatan',25000.00,'2026-02-27 11:16:45','2026-02-27 11:29:07','2026-02-27 11:29:07'),(7,'Iuran Test',15000.00,'2026-02-27 11:18:53','2026-02-27 14:18:37','2026-02-27 14:18:37'),(8,'Bozo',10000.00,'2026-02-27 13:10:46','2026-02-27 13:11:01','2026-02-27 13:11:01');
/*!40000 ALTER TABLE `due_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `house_payments`
--

DROP TABLE IF EXISTS `house_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `house_payments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `occupant_history_id` bigint(20) unsigned NOT NULL,
  `payment_date` date DEFAULT curdate(),
  `payment_amount` decimal(20,2) NOT NULL,
  `payment_status` enum('Lunas','Belum Lunas') NOT NULL DEFAULT 'Lunas',
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `house_payments_occupant_history_id_foreign` (`occupant_history_id`),
  CONSTRAINT `house_payments_occupant_history_id_foreign` FOREIGN KEY (`occupant_history_id`) REFERENCES `occupant_histories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `house_payments`
--

LOCK TABLES `house_payments` WRITE;
/*!40000 ALTER TABLE `house_payments` DISABLE KEYS */;
INSERT INTO `house_payments` VALUES (1,1,'2026-01-01',500000.00,'Lunas',NULL,'2026-02-25 01:39:23','2026-02-25 01:39:23'),(2,2,'2026-01-11',500000.00,'Lunas',NULL,'2026-02-25 01:39:47','2026-02-25 01:39:47'),(3,1,'2026-02-10',500000.00,'Lunas',NULL,'2026-02-25 03:26:39','2026-02-25 03:26:39'),(4,8,'2026-02-28',250000.00,'Lunas',NULL,'2026-02-27 20:00:29','2026-02-27 20:00:29'),(5,9,'2026-02-28',100000.00,'Lunas',NULL,'2026-02-27 20:41:30','2026-02-27 20:41:30'),(6,10,'2026-02-28',500000.00,'Lunas',NULL,'2026-02-27 20:42:08','2026-02-27 20:42:08'),(7,1,'2026-02-10',500000.00,'Lunas',NULL,NULL,NULL),(9,11,'2026-03-01',350000.00,'Lunas',NULL,'2026-03-01 01:22:49','2026-03-01 01:22:49'),(10,1,'2026-03-01',450000.00,'Belum Lunas',NULL,NULL,'2026-03-01 02:30:34'),(12,1,'2026-03-01',450000.00,'Lunas',NULL,NULL,NULL),(13,1,'2026-04-01',450000.00,'Lunas',NULL,NULL,NULL),(14,12,'2026-03-01',400000.00,'Lunas',NULL,'2026-03-01 14:25:08','2026-03-01 14:25:08'),(15,13,'2026-03-01',500000.00,'Lunas',NULL,'2026-03-01 14:27:31','2026-03-01 14:27:31');
/*!40000 ALTER TABLE `house_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `houses`
--

DROP TABLE IF EXISTS `houses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `houses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `number` int(10) unsigned NOT NULL,
  `status` enum('aktif','tidak aktif') NOT NULL DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `houses`
--

LOCK TABLES `houses` WRITE;
/*!40000 ALTER TABLE `houses` DISABLE KEYS */;
INSERT INTO `houses` VALUES (1,40,'aktif','2026-02-25 01:37:11','2026-02-27 16:51:08',NULL),(2,15,'aktif','2026-02-25 01:37:21','2026-02-25 01:37:21',NULL),(3,7,'aktif','2026-02-27 17:00:52','2026-02-27 17:00:52',NULL),(4,20,'aktif','2026-02-27 22:22:17','2026-02-27 22:22:17',NULL);
/*!40000 ALTER TABLE `houses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_02_23_150532_create_houses_table',1),(5,'2026_02_23_150615_create_residents_table',1),(6,'2026_02_23_151037_create_personal_access_tokens_table',1),(7,'2026_02_23_162800_create_occupant_histories_table',1),(8,'2026_02_23_162805_create_house_payments_table',1),(9,'2026_02_23_163106_create_due_types_table',1),(10,'2026_02_23_163125_create_spending_types_table',1),(11,'2026_02_23_163958_create_spendings_table',1),(12,'2026_02_23_164015_create_due_payments_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `occupant_histories`
--

DROP TABLE IF EXISTS `occupant_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `occupant_histories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `house_id` bigint(20) unsigned NOT NULL,
  `resident_id` bigint(20) unsigned NOT NULL,
  `start_date` date NOT NULL DEFAULT curdate(),
  `end_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `occupant_histories_house_id_foreign` (`house_id`),
  KEY `occupant_histories_resident_id_foreign` (`resident_id`),
  CONSTRAINT `occupant_histories_house_id_foreign` FOREIGN KEY (`house_id`) REFERENCES `houses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `occupant_histories_resident_id_foreign` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `occupant_histories`
--

LOCK TABLES `occupant_histories` WRITE;
/*!40000 ALTER TABLE `occupant_histories` DISABLE KEYS */;
INSERT INTO `occupant_histories` VALUES (1,1,2,'2026-01-11',NULL,'2026-02-25 01:39:23','2026-02-25 01:39:23'),(2,2,1,'2026-01-01','2026-02-28','2026-02-25 01:39:47','2026-02-27 19:57:43'),(8,2,1,'2026-02-28','2026-02-28','2026-02-27 20:00:29','2026-02-27 20:19:44'),(9,2,1,'2026-02-28',NULL,'2026-02-27 20:41:30','2026-02-27 20:41:30'),(10,3,2,'2026-02-28','2026-02-28','2026-02-27 20:42:08','2026-02-27 20:42:44'),(11,4,3,'2026-03-01',NULL,'2026-03-01 01:22:49','2026-03-01 01:22:49'),(12,3,6,'2026-03-02',NULL,'2026-03-01 14:25:08','2026-03-01 14:25:08'),(13,3,4,'2026-03-02',NULL,'2026-03-01 14:27:31','2026-03-01 14:27:31');
/*!40000 ALTER TABLE `occupant_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residents`
--

DROP TABLE IF EXISTS `residents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `residents` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `photo` varchar(150) DEFAULT NULL,
  `marital_status` enum('Menikah','Lajang') DEFAULT 'Lajang',
  `occupant_status` enum('Tetap','Kontrak') NOT NULL,
  `mobile_number` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `residents_name_index` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residents`
--

LOCK TABLES `residents` WRITE;
/*!40000 ALTER TABLE `residents` DISABLE KEYS */;
INSERT INTO `residents` VALUES (1,'Udin','residents/XreHYDhPls1F03UrWUlweGEGf7yfOhnGRo7rpnuc.jpg','Lajang','Kontrak','082837737','2026-02-25 01:37:37','2026-02-27 22:22:50',NULL),(2,'Tomi','residents/xjqyslUJcIIhojtThHVmyRyZCuyumIupCGvPqWX2.jpg','Lajang','Tetap','082837737','2026-02-25 01:38:17','2026-02-25 01:38:17',NULL),(3,'Dito','residents/nSc3kcWsxcZt3bmi594XeaJQr12LLQ7lwCM4wgIU.png','Lajang','Tetap','082837737222','2026-02-27 22:01:52','2026-02-27 22:01:52',NULL),(4,'Angga','residents/heP71UE61UhNJ9VzCyFCfCFGMmcoqhA3ZkzjGbDG.png','Lajang','Kontrak','08283773722','2026-02-27 22:07:09','2026-02-27 22:07:09',NULL),(5,'Arno','residents/xjqyslUJcIIhojtThHVmyRyZCuyumIupCGvPqWX2.jpg','Menikah','Tetap','08762627272','2026-03-01 12:32:34','2026-03-01 12:32:34',NULL),(6,'Bozo','residents/43koJHQ1YRS93rkt7qCFbNzZgiFdRS7bZ9LVetLI.png','Menikah','Tetap','08762627272','2026-03-01 14:22:41','2026-03-01 14:22:41',NULL);
/*!40000 ALTER TABLE `residents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('Out8XiCA4WKE7d4zHSD2hZbPZ0smm9BvYTY0dfnk',1,'172.19.0.1','PostmanRuntime/7.51.1','YTozOntzOjY6Il90b2tlbiI7czo0MDoiSGZtSWRvTHNFeURBeHV4S0tDbFVKdHhuRVVOWDJaR240cVdrTDNmZyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly8xMjcuMC4wLjE6MzI3NjgiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1772245932);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spending_types`
--

DROP TABLE IF EXISTS `spending_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spending_types` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `amount` decimal(20,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spending_types`
--

LOCK TABLES `spending_types` WRITE;
/*!40000 ALTER TABLE `spending_types` DISABLE KEYS */;
INSERT INTO `spending_types` VALUES (1,'Iuran Perbaikan Tiang 1',18000.00,'2026-02-25 01:36:20','2026-02-27 15:02:08','2026-02-27 15:02:08'),(2,'Iuran Perbaikan Jalan',10000.00,'2026-02-25 01:36:28','2026-02-25 01:36:28',NULL),(3,'Iuran Perbaikan Selokan',10000.00,'2026-02-25 01:36:50','2026-02-25 01:36:50',NULL),(4,'Iuran Ziarah',5000.00,'2026-02-27 15:01:29','2026-02-27 15:01:29',NULL);
/*!40000 ALTER TABLE `spending_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spendings`
--

DROP TABLE IF EXISTS `spendings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spendings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `spending_type_id` bigint(20) unsigned NOT NULL,
  `date` date NOT NULL DEFAULT curdate(),
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `spendings_spending_type_id_foreign` (`spending_type_id`),
  CONSTRAINT `spendings_spending_type_id_foreign` FOREIGN KEY (`spending_type_id`) REFERENCES `spending_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spendings`
--

LOCK TABLES `spendings` WRITE;
/*!40000 ALTER TABLE `spendings` DISABLE KEYS */;
INSERT INTO `spendings` VALUES (3,1,'2026-01-20',NULL,'2026-02-25 01:50:12','2026-02-25 01:50:12'),(4,2,'2026-02-11',NULL,'2026-02-25 11:27:33','2026-02-25 11:27:33'),(5,4,'2026-02-25','tes','2026-03-01 08:39:25','2026-03-01 08:39:25'),(6,3,'2026-02-19',NULL,'2026-03-01 09:11:43','2026-03-01 09:11:43'),(7,3,'2026-03-01',NULL,'2026-03-01 10:56:39','2026-03-01 10:56:39');
/*!40000 ALTER TABLE `spendings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@email.com',NULL,'$2y$12$uceBk0hx3eUnMUSNutXsX.aZheKZz0jHN1yYl2kejcRECZqEIZY..',NULL,'2026-02-25 01:35:19','2026-02-25 01:35:19');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-02  4:47:21
