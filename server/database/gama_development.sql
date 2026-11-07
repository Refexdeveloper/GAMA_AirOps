CREATE DATABASE  IF NOT EXISTS `gama_development` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gama_development`;
-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: gama_development
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `brief_sheet_trip_crews`
--

DROP TABLE IF EXISTS `brief_sheet_trip_crews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brief_sheet_trip_crews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trip_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trip_id` (`trip_id`),
  CONSTRAINT `brief_sheet_trip_crews_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `brief_sheet_trips` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brief_sheet_trip_crews`
--

LOCK TABLES `brief_sheet_trip_crews` WRITE;
/*!40000 ALTER TABLE `brief_sheet_trip_crews` DISABLE KEYS */;
INSERT INTO `brief_sheet_trip_crews` VALUES (1,1,'Murugesh',''),(2,2,'Murugesh',''),(3,3,'Murugesh',''),(4,3,'Murugesh',''),(5,4,'Murugesh',''),(6,4,'Murugesh',''),(7,5,'Murugesh',''),(8,6,'sdfafv',''),(9,7,'Capt Vijay Kumar',''),(10,7,'Capt Ajit Kumar',''),(11,7,'Miss Rupa',''),(12,8,'Test','');
/*!40000 ALTER TABLE `brief_sheet_trip_crews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brief_sheet_trip_passengers`
--

DROP TABLE IF EXISTS `brief_sheet_trip_passengers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brief_sheet_trip_passengers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trip_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trip_id` (`trip_id`),
  CONSTRAINT `brief_sheet_trip_passengers_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `brief_sheet_trips` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brief_sheet_trip_passengers`
--

LOCK TABLES `brief_sheet_trip_passengers` WRITE;
/*!40000 ALTER TABLE `brief_sheet_trip_passengers` DISABLE KEYS */;
INSERT INTO `brief_sheet_trip_passengers` VALUES (1,1,'Murugesh Kumar V'),(2,2,'Test Pdf'),(3,3,'Test Pdf'),(4,3,'Test Passengers'),(5,4,'Pax 1'),(6,4,'Test Pdf'),(7,4,'Test Passengers'),(8,5,'Pax 1'),(9,5,'Test Pdf'),(10,6,'sdfadg'),(11,7,'Test 1'),(12,7,'Test 2'),(13,7,'Test 3'),(14,7,'Test 5'),(15,7,'Test 4'),(16,7,'Test 6'),(17,7,'Test 7'),(18,7,'Test 8'),(19,7,'Test 9'),(20,7,'Test 10'),(21,8,'Test Passengers');
/*!40000 ALTER TABLE `brief_sheet_trip_passengers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brief_sheet_trips`
--

DROP TABLE IF EXISTS `brief_sheet_trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brief_sheet_trips` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sheet_id` int NOT NULL,
  `departure_airport_id` int NOT NULL,
  `arrival_airport_id` int NOT NULL,
  `gh_departure_airport` varchar(50) NOT NULL,
  `gh_departure_airport_phone` varchar(255) DEFAULT NULL,
  `gh_arrival_airport` varchar(50) NOT NULL,
  `gh_arrival_airport_phone` varchar(255) DEFAULT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `departure_address` varchar(255) DEFAULT NULL,
  `arrival_address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sheet_id` (`sheet_id`),
  KEY `departure_airport_id` (`departure_airport_id`),
  KEY `arrival_airport_id` (`arrival_airport_id`),
  CONSTRAINT `brief_sheet_trips_ibfk_772` FOREIGN KEY (`sheet_id`) REFERENCES `brief_sheets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `brief_sheet_trips_ibfk_773` FOREIGN KEY (`departure_airport_id`) REFERENCES `masters_airports` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `brief_sheet_trips_ibfk_774` FOREIGN KEY (`arrival_airport_id`) REFERENCES `masters_airports` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brief_sheet_trips`
--

LOCK TABLES `brief_sheet_trips` WRITE;
/*!40000 ALTER TABLE `brief_sheet_trips` DISABLE KEYS */;
INSERT INTO `brief_sheet_trips` VALUES (1,1,35,62,'Test Handler','9836788356','Test Handler 2','9867455678','2024-07-25 22:30:00','2024-07-25 23:55:00','GATE NO. 6 @Chennai Airpor','BA Terminal, Near Bird BWFS Hangar'),(2,2,1,1,'Test Handler','9836788356','Test Handler 2','9835122345','2024-08-26 01:40:00','2024-08-26 04:50:00','GATE NO. 6 @Chennai Airpor','BA Terminal, Near Bird BWFS Hangar'),(3,3,1,2,'Test Handler','9836788356','Test Handler 2','9867455678','2024-08-29 21:40:00','2024-08-30 22:50:00','GATE NO. 6 @Chennai Airpor','BA Terminal, Near Bird BWFS Hangar'),(4,4,1,2,'Test Handler','9836788356','Test Handler 2','9867455678','2024-08-29 21:40:00','2024-08-30 22:50:00','GATE NO. 6 @Chennai Airpor','BA Terminal, Near Bird BWFS Hangar'),(5,4,1,3,'Test Handler','9836788356','Test Handler 2','9867455678','2024-08-29 21:40:00','2024-08-29 19:20:00','GATE NO. 6 @Chennai Airpor','BA Terminal, Near Bird BWFS Hangar'),(6,5,8,6,'sdfsa','874677836','sdvfsa','7894677352','2024-08-31 01:05:00','2024-08-31 01:05:00','GATE NO. 6 @Chennai Airpor','BA Terminal, Near Bird BWFS Hangar'),(7,6,35,34,'Test Handler','8976566754','Test Handler 2','9845677898','2024-09-04 03:30:00','2024-09-04 06:30:00','T3, Chennai Airport','Gate 6, Mumbai Airport'),(8,7,6,35,'Test Handler','986788978','Test Handler 2','7867899878','2024-09-04 20:40:00','2024-09-04 22:50:00','Gate 6','T3');
/*!40000 ALTER TABLE `brief_sheet_trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brief_sheets`
--

DROP TABLE IF EXISTS `brief_sheets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brief_sheets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(45) NOT NULL,
  `aircraft_id` int NOT NULL,
  `flight_manager` varchar(45) NOT NULL,
  `flight_manager_phone` varchar(255) DEFAULT NULL,
  `operation_manager` varchar(45) NOT NULL,
  `operation_manager_phone` varchar(255) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `created_by` int NOT NULL,
  `updated_by` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `aircraft_id` (`aircraft_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `brief_sheets_ibfk_772` FOREIGN KEY (`aircraft_id`) REFERENCES `masters_aircrafts` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `brief_sheets_ibfk_773` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `brief_sheets_ibfk_774` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brief_sheets`
--

LOCK TABLES `brief_sheets` WRITE;
/*!40000 ALTER TABLE `brief_sheets` DISABLE KEYS */;
INSERT INTO `brief_sheets` VALUES (1,'Murugesh',2,'Manager Test','9846788467','Test Manager','7864744861','flight_brief_sheet_1721900447217-56505890.pdf',1,1,'2024-07-25 09:40:39','2024-07-25 09:40:49'),(2,'Test 2',2,'Manager Test','9846788467','Test Manager','7864744861','flight_brief_sheet_1724653794850-776670941.pdf',1,1,'2024-08-26 06:29:48','2024-08-26 06:29:58'),(3,'Murugesh',1,'Manager Test','9846788467','Test Manager','7864744861',NULL,1,1,'2024-08-29 10:39:57','2024-08-29 10:39:57'),(4,'Murugesh',1,'Manager Test','9846788467','Test Manager','7864744861','flight_brief_sheet_1724928023008-596528645.pdf',1,1,'2024-08-29 10:40:13','2024-08-29 10:40:25'),(5,'murugesh',1,'sf','7898766567','sfds','9847622567','flight_brief_sheet_1725019931568-844301388.pdf',1,1,'2024-08-30 12:12:02','2024-08-30 12:12:13'),(6,'TEST123',2,'Manager Test','9835677876','Test Manager','6754344567','flight_brief_sheet_1725367472526-959095711.pdf',1,1,'2024-09-03 12:44:27','2024-09-03 12:44:33'),(7,'ssss',1,'sss','9876366789','sdfvs','7865567898','flight_brief_sheet_1725427006702-674481500.pdf',1,1,'2024-09-04 05:16:41','2024-09-04 05:16:48');
/*!40000 ALTER TABLE `brief_sheets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lead_trips`
--

DROP TABLE IF EXISTS `lead_trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lead_trips` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lead_id` int NOT NULL,
  `departure_airport_id` int NOT NULL,
  `arrival_airport_id` int NOT NULL,
  `pax` int NOT NULL,
  `start_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `lead_id` (`lead_id`),
  KEY `departure_airport_id` (`departure_airport_id`),
  KEY `arrival_airport_id` (`arrival_airport_id`),
  CONSTRAINT `lead_trips_ibfk_934` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `lead_trips_ibfk_935` FOREIGN KEY (`departure_airport_id`) REFERENCES `masters_airports` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `lead_trips_ibfk_936` FOREIGN KEY (`arrival_airport_id`) REFERENCES `masters_airports` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_trips`
--

LOCK TABLES `lead_trips` WRITE;
/*!40000 ALTER TABLE `lead_trips` DISABLE KEYS */;
INSERT INTO `lead_trips` VALUES (1,1,63,39,4,'2024-02-24 00:15:00'),(2,1,36,63,4,'2024-02-23 20:15:00'),(3,1,39,67,4,'2024-02-24 06:15:00'),(4,2,36,63,4,'2024-02-23 20:15:00'),(5,2,63,39,4,'2024-02-24 00:15:00'),(6,2,39,67,4,'2024-02-24 06:15:00'),(7,3,35,62,0,'2024-08-05 16:15:00'),(8,4,35,62,0,'2024-08-04 19:30:00'),(9,4,62,34,1,'2024-08-05 19:30:00'),(10,4,34,124,0,'2024-08-06 19:30:00'),(11,5,7,20,0,'2024-08-06 06:30:00'),(12,6,35,62,7,'2024-08-07 16:00:00');
/*!40000 ALTER TABLE `lead_trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `email` varchar(80) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `type` enum('oneway','roundtrip','multicity') NOT NULL DEFAULT 'oneway',
  `aircraft_id` int NOT NULL,
  `status` enum('New','Assigned','In Progress','Converted','Closed') NOT NULL DEFAULT 'New',
  `created_by` int NOT NULL,
  `updated_by` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `aircraft_id` (`aircraft_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `leads_ibfk_934` FOREIGN KEY (`aircraft_id`) REFERENCES `masters_aircraft_models` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `leads_ibfk_935` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `leads_ibfk_936` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
INSERT INTO `leads` VALUES (1,'Murugesh Kumar','murugesh.k@refex.co.in','7305880787','Book now','multicity',1,'New',1,1,'2024-06-27 06:01:51','2024-06-27 06:01:51'),(2,'Murugesh Kumar','murugesh.k@refex.co.in','7305880787','Book now','multicity',1,'New',1,1,'2024-06-27 06:08:45','2024-06-27 06:08:45'),(3,'Test','murugesh.k@refex.co.in','7305880787','Test','oneway',1,'New',1,1,'2024-08-05 07:44:05','2024-08-05 07:44:05'),(4,'Murugesh','kumarmurugesh14032001@gmail.com','7305880787','Book me now','multicity',6,'New',1,1,'2024-08-05 11:22:53','2024-08-05 11:22:53'),(5,'Test Murugesh','kumarmurugesh14032001@gmail.com','7305880787','','oneway',1,'New',1,1,'2024-08-05 11:29:11','2024-08-05 11:29:11'),(6,'murugesh','kumarmurugesh@gmail.com','9840233876','','oneway',6,'New',1,1,'2024-08-07 05:39:38','2024-08-07 05:39:38');
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_histories`
--

DROP TABLE IF EXISTS `login_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_histories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `status` enum('Logged-In','Logged-Out') NOT NULL,
  `login_time` datetime NOT NULL,
  `logout_time` datetime NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `login_histories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_histories`
--

LOCK TABLES `login_histories` WRITE;
/*!40000 ALTER TABLE `login_histories` DISABLE KEYS */;
INSERT INTO `login_histories` VALUES (1,1,'murugesh.k@refex.co.in','Logged-Out','2024-07-18 07:37:46','2024-07-18 07:41:49','SuperAdmin Murugesh'),(2,1,'murugesh.k@refex.co.in','Logged-Out','2024-07-19 09:19:11','2024-07-19 11:33:20','SuperAdmin Murugesh'),(3,1,'murugesh.k@refex.co.in','Logged-In','2024-07-22 06:07:08','2024-07-22 06:07:08','SuperAdmin Murugesh'),(4,1,'murugesh.k@refex.co.in','Logged-In','2024-07-24 05:27:14','2024-07-24 05:27:14','SuperAdmin Murugesh'),(5,1,'murugesh.k@refex.co.in','Logged-In','2024-07-24 09:17:01','2024-07-24 09:17:01','SuperAdmin Murugesh'),(6,1,'murugesh.k@refex.co.in','Logged-In','2024-07-25 05:38:59','2024-07-25 05:38:59','SuperAdmin Murugesh'),(7,1,'murugesh.k@refex.co.in','Logged-Out','2024-07-25 07:14:27','2024-07-25 07:15:59','SuperAdmin Murugesh'),(8,1,'murugesh.k@refex.co.in','Logged-In','2024-07-25 07:25:27','2024-07-25 07:25:27','SuperAdmin Murugesh'),(9,1,'murugesh.k@refex.co.in','Logged-In','2024-07-25 07:49:22','2024-07-25 07:49:22','SuperAdmin Murugesh'),(10,1,'murugesh.k@refex.co.in','Logged-In','2024-07-25 09:33:12','2024-07-25 09:33:12','SuperAdmin Murugesh'),(11,1,'murugesh.k@refex.co.in','Logged-In','2024-07-26 06:14:25','2024-07-26 06:14:25','SuperAdmin Murugesh'),(12,1,'murugesh.k@refex.co.in','Logged-Out','2024-07-29 12:15:45','2024-07-29 16:32:25','SuperAdmin Murugesh'),(13,1,'murugesh.k@refex.co.in','Logged-In','2024-07-30 06:52:04','2024-07-30 06:52:04','SuperAdmin Murugesh'),(14,1,'murugesh.k@refex.co.in','Logged-In','2024-07-30 09:35:52','2024-07-30 09:35:52','SuperAdmin Murugesh'),(15,1,'murugesh.k@refex.co.in','Logged-In','2024-07-31 06:56:56','2024-07-31 06:56:56','SuperAdmin Murugesh'),(16,1,'murugesh.k@refex.co.in','Logged-In','2024-07-31 11:04:33','2024-07-31 11:04:33','SuperAdmin Murugesh'),(17,1,'murugesh.k@refex.co.in','Logged-Out','2024-08-01 05:19:28','2024-08-01 13:14:57','SuperAdmin Murugesh'),(18,1,'murugesh.k@refex.co.in','Logged-In','2024-08-02 09:36:10','2024-08-02 09:36:10','SuperAdmin Murugesh'),(19,1,'murugesh.k@refex.co.in','Logged-In','2024-08-02 11:51:56','2024-08-02 11:51:56','SuperAdmin Murugesh'),(20,1,'murugesh.k@refex.co.in','Logged-In','2024-08-03 06:05:22','2024-08-03 06:05:22','SuperAdmin Murugesh'),(21,1,'murugesh.k@refex.co.in','Logged-In','2024-08-05 05:14:38','2024-08-05 05:14:38','SuperAdmin Murugesh'),(22,1,'murugesh.k@refex.co.in','Logged-Out','2024-08-05 12:07:37','2024-08-05 12:10:02','SuperAdmin Murugesh'),(23,1,'murugesh.k@refex.co.in','Logged-Out','2024-08-07 05:12:04','2024-08-07 05:53:59','SuperAdmin Murugesh'),(24,1,'murugesh.k@refex.co.in','Logged-In','2024-08-07 05:54:23','2024-08-07 05:54:23','SuperAdmin Murugesh'),(25,1,'murugesh.k@refex.co.in','Logged-In','2024-08-08 05:34:03','2024-08-08 05:34:03','SuperAdmin Murugesh'),(26,1,'murugesh.k@refex.co.in','Logged-In','2024-08-12 05:11:06','2024-08-12 05:11:06','SuperAdmin Murugesh'),(27,1,'murugesh.k@refex.co.in','Logged-In','2024-08-13 04:59:16','2024-08-13 04:59:16','SuperAdmin Murugesh'),(28,1,'murugesh.k@refex.co.in','Logged-In','2024-08-13 08:33:19','2024-08-13 08:33:19','SuperAdmin Murugesh'),(29,1,'murugesh.k@refex.co.in','Logged-Out','2024-08-14 05:00:54','2024-08-14 05:36:54','SuperAdmin Murugesh'),(30,1,'murugesh.k@refex.co.in','Logged-Out','2024-08-14 05:37:10','2024-08-14 09:29:55','SuperAdmin Murugesh'),(31,1,'murugesh.k@refex.co.in','Logged-Out','2024-08-14 08:00:33','2024-08-14 08:15:38','SuperAdmin Murugesh'),(32,3,'kumarmurugesh2001@gmail.com','Logged-Out','2024-08-14 08:27:02','2024-08-14 09:29:43','User Murugesh'),(33,2,'kumarmurugesh14032001@gmail.com','Logged-Out','2024-08-14 08:29:47','2024-08-14 09:29:40','Admin Murugesh'),(34,1,'murugesh.k@refex.co.in','Logged-In','2024-08-26 05:25:56','2024-08-26 05:25:56','SuperAdmin Murugesh'),(35,1,'murugesh.k@refex.co.in','Logged-In','2024-08-26 06:21:47','2024-08-26 06:21:47','SuperAdmin Murugesh'),(36,1,'murugesh.k@refex.co.in','Logged-In','2024-08-28 11:15:59','2024-08-28 11:15:59','SuperAdmin Murugesh'),(37,1,'murugesh.k@refex.co.in','Logged-In','2024-08-29 05:13:28','2024-08-29 05:13:28','SuperAdmin Murugesh'),(38,1,'murugesh.k@refex.co.in','Logged-Out','2024-08-29 08:45:30','2024-08-29 09:44:07','SuperAdmin Murugesh'),(39,1,'murugesh.k@refex.co.in','Logged-In','2024-08-29 10:07:29','2024-08-29 10:07:29','SuperAdmin Murugesh'),(40,1,'murugesh.k@refex.co.in','Logged-In','2024-08-30 05:05:15','2024-08-30 05:05:15','SuperAdmin Murugesh'),(41,1,'murugesh.k@refex.co.in','Logged-In','2024-08-31 04:59:47','2024-08-31 04:59:47','SuperAdmin Murugesh'),(42,1,'murugesh.k@refex.co.in','Logged-In','2024-09-02 05:12:44','2024-09-02 05:12:44','SuperAdmin Murugesh'),(43,1,'murugesh.k@refex.co.in','Logged-In','2024-09-02 09:45:22','2024-09-02 09:45:22','SuperAdmin Murugesh'),(44,1,'murugesh.k@refex.co.in','Logged-In','2024-09-03 04:47:52','2024-09-03 04:47:52','SuperAdmin Murugesh'),(45,1,'murugesh.k@refex.co.in','Logged-In','2024-09-04 04:57:38','2024-09-04 04:57:38','SuperAdmin Murugesh'),(46,1,'murugesh.k@refex.co.in','Logged-Out','2024-09-04 05:15:00','2024-09-04 09:37:48','SuperAdmin Murugesh'),(47,1,'murugesh.k@refex.co.in','Logged-In','2024-09-04 09:38:46','2024-09-04 09:38:46','SuperAdmin Murugesh'),(48,1,'murugesh.k@refex.co.in','Logged-In','2024-09-05 11:47:59','2024-09-05 11:47:59','SuperAdmin Murugesh'),(49,1,'murugesh.k@refex.co.in','Logged-In','2024-09-06 09:17:32','2024-09-06 09:17:32','SuperAdmin Murugesh'),(50,1,'murugesh.k@refex.co.in','Logged-In','2024-09-10 07:52:38','2024-09-10 07:52:38','SuperAdmin Murugesh'),(51,1,'murugesh.k@refex.co.in','Logged-In','2024-09-11 07:10:50','2024-09-11 07:10:50','SuperAdmin Murugesh');
/*!40000 ALTER TABLE `login_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `masters_aircraft_images`
--

DROP TABLE IF EXISTS `masters_aircraft_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `masters_aircraft_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aircraft_image_1` varchar(255) DEFAULT NULL,
  `aircraft_image_2` varchar(255) DEFAULT NULL,
  `aircraft_image_3` varchar(255) DEFAULT NULL,
  `lopa_image` varchar(255) DEFAULT NULL,
  `interior_image_1` varchar(255) DEFAULT NULL,
  `interior_image_2` varchar(255) DEFAULT NULL,
  `interior_image_3` varchar(255) DEFAULT NULL,
  `cabin_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masters_aircraft_images`
--

LOCK TABLES `masters_aircraft_images` WRITE;
/*!40000 ALTER TABLE `masters_aircraft_images` DISABLE KEYS */;
INSERT INTO `masters_aircraft_images` VALUES (1,'aircraft-1721215946528-740907052.jpg','aircraft-1721215946545-3177406.jpg','aircraft-1721215946528-740907052.jpg','lopa-1721215946549-991415769.png','interior-1721215946555-772280283.jpg','interior-1721215946552-714719808.jpg','interior-1721215946555-772280283.jpg','800XP.png'),(2,'aircraft-1721216472083-663886887.jpg','aircraft-1721216472083-663886887.jpg','aircraft-1721216472083-663886887.jpg','lopa-1721216472087-171806846.png','interior-1721216472091-218226398.jpg','interior-1721216472095-911652798.jpg','interior-1721216472091-218226398.jpg','900XP.png'),(3,'aircraft-1721284503746-952628051.jpg','aircraft-1721284503746-952628051.jpg','aircraft-1721284503746-952628051.jpg','lopa-1721284503763-269362253.png','interior-1721284503778-568135440.jpg','interior-1721284503770-664518132.jpg','interior-1721284503778-568135440.jpg','cabin-1723546239745-900599341.jpg'),(4,'aircraft-1721285492441-55927063.jpg','aircraft-1721285492441-55927063.jpg','aircraft-1721285492441-55927063.jpg','lopa-1721285492493-41747878.png','interior-1721285492508-476157207.jpg','interior-1721285492500-334865608.jpg','interior-1721285492508-476157207.jpg','cabin-1723546239745-900599341.jpg'),(5,'aircraft-1721286169412-302335665.jpg','aircraft-1721286169412-302335665.jpg','aircraft-1721286169412-302335665.jpg','lopa-1721286169422-29688024.png','interior-1721286169433-809458663.jpg','interior-1721286169427-640075077.jpg','interior-1721286169433-809458663.jpg','cabin-1723546239745-900599341.jpg'),(6,'aircraft-1723546239732-388780855.jpg','aircraft-1723546239732-388780855.jpg','aircraft-1723546239732-388780855.jpg','lopa-1723546239738-324292666.jpg','interior-1723546239751-34540026.jpg','interior-1721285492500-334865608.jpg','interior-1723546239751-34540026.jpg','cabin-1723546239745-900599341.jpg');
/*!40000 ALTER TABLE `masters_aircraft_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `masters_aircraft_models`
--

DROP TABLE IF EXISTS `masters_aircraft_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `masters_aircraft_models` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aircraft_manufacture` varchar(45) DEFAULT NULL,
  `aircraft_model` varchar(45) DEFAULT NULL,
  `aircraft_type` varchar(45) DEFAULT NULL,
  `wing_type` varchar(45) DEFAULT NULL,
  `pilots` int DEFAULT NULL,
  `seats` int DEFAULT NULL,
  `baggages_capacity` varchar(25) DEFAULT NULL,
  `aircraft_attendant_availability` tinyint(1) DEFAULT NULL,
  `wifi_availability` tinyint(1) DEFAULT NULL,
  `satellite_phone` tinyint(1) DEFAULT NULL,
  `lavatory` tinyint(1) DEFAULT NULL,
  `cabin_height` float DEFAULT NULL,
  `cabin_width` float DEFAULT NULL,
  `cabin_length` float DEFAULT NULL,
  `period_of_manufacture` varchar(45) DEFAULT NULL,
  `length` float DEFAULT NULL,
  `height` float DEFAULT NULL,
  `wingspan` float DEFAULT NULL,
  `empty_weight` int DEFAULT NULL,
  `max_take_of_weight` int DEFAULT NULL,
  `max_payload` int DEFAULT NULL,
  `fuel_capacity` int DEFAULT NULL,
  `engine` int DEFAULT NULL,
  `engine_model` varchar(45) DEFAULT NULL,
  `max_cruising_speed` float DEFAULT NULL,
  `runway_length` int DEFAULT NULL,
  `max_ceiling` int DEFAULT NULL,
  `range` int DEFAULT NULL,
  `aircraft_per_hour_cost` int DEFAULT NULL,
  `base_location` int DEFAULT NULL,
  `image_id` int DEFAULT NULL,
  `created_by` int NOT NULL,
  `updated_by` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `base_location` (`base_location`),
  KEY `image_id` (`image_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `masters_aircraft_models_ibfk_3380` FOREIGN KEY (`base_location`) REFERENCES `masters_airports` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `masters_aircraft_models_ibfk_3381` FOREIGN KEY (`image_id`) REFERENCES `masters_aircraft_images` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `masters_aircraft_models_ibfk_3382` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `masters_aircraft_models_ibfk_3383` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masters_aircraft_models`
--

LOCK TABLES `masters_aircraft_models` WRITE;
/*!40000 ALTER TABLE `masters_aircraft_models` DISABLE KEYS */;
INSERT INTO `masters_aircraft_models` VALUES (1,'Textron','Hawker 800XP','Midsize Jet','Fixed Wing',2,8,'3042',0,0,0,1,5.9,6,21.4,'1995-2006',51.2,18.1,54.4,16065,28000,2050,10000,2,'Honeywell',449,3803,41000,2620,380000,35,1,1,1,'2024-07-18 06:35:03','2024-07-18 06:35:03'),(2,'Textron','Hawker 900XP','Midsize Jet','Fixed Wing',2,9,'3119',0,0,0,1,5.8,6,21.3,'2007-2012',51.2,18.1,54.4,15846,28000,1950,10000,2,'Honeywell',452,3805,41000,2929,400000,35,2,1,1,'2024-07-18 06:35:03','2024-07-18 06:35:03'),(3,'Textron','Hawker 850XP','Midsize Jet','Fixed Wing',2,13,'395',0,0,0,1,5.8,6,21.3,'2006-2009',51.2,18.1,55.5,15670,28000,2120,8950,2,'Honeywell',452,3810,41000,2710,380000,NULL,3,1,1,'2024-07-18 06:35:03','2024-07-18 06:35:03'),(4,'Textron','Hawker 750XP','Light Jet','Fixed Wing',2,8,'395',0,0,0,1,5.9,6,21.4,'2008-2011',51.2,18.1,51.3,16250,27000,2200,8950,2,'Honeywell',447,3803,41000,1978,380000,NULL,4,1,1,'2024-07-18 06:51:32','2024-07-18 06:51:32'),(5,'Textron','Hawker 400A(XP)','Light Jet','Fixed Wing',2,8,'0',0,0,0,1,4.8,4.9,15.6,'2003-2010',48.4,13.9,43.5,10551,16300,2015,4912,2,'Pratt & Whitney',450,5025,41000,1591,350000,NULL,5,1,1,'2024-07-18 07:02:49','2024-07-18 07:02:49'),(6,'Pilatus','Pilatus PC12/45','Turbo Prop','Fixed Wing',2,7,'0',0,0,0,1,4.1,5,16.11,'1995-2008',47.3,14,53.3,5867,10450,2257,2704,2,'Pratt & Whitney',280,2783,30000,1309,125000,NULL,6,1,1,'2024-07-18 07:09:30','2024-08-13 10:53:56');
/*!40000 ALTER TABLE `masters_aircraft_models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `masters_aircrafts`
--

DROP TABLE IF EXISTS `masters_aircrafts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `masters_aircrafts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `operator_id` int NOT NULL,
  `model_id` int NOT NULL,
  `reg_no` varchar(45) NOT NULL,
  `min_cabin_crew` int DEFAULT NULL,
  `min_flight_crew` int NOT NULL,
  `no_of_captain` int DEFAULT NULL,
  `no_of_fo` int DEFAULT NULL,
  `no_of_fe` int DEFAULT NULL,
  `c_cls_capacity` int DEFAULT NULL,
  `y_cls_capacity` int DEFAULT NULL,
  `seating_capacity` int DEFAULT NULL,
  `time_format` varchar(45) NOT NULL,
  `local_time` tinyint(1) DEFAULT '0',
  `utc_time` tinyint(1) DEFAULT '0',
  `block_opening_hrs` time DEFAULT NULL,
  `time_in_air_opening_hrs` time DEFAULT NULL,
  `not_in_service` tinyint(1) DEFAULT '0',
  `not_in_service_from` datetime DEFAULT NULL,
  `freight_capacity` float DEFAULT NULL,
  `unit` varchar(45) DEFAULT NULL,
  `last_arrival` int DEFAULT NULL,
  `created_by` int NOT NULL,
  `updated_by` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `cruising_speed` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `operator_id` (`operator_id`),
  KEY `model_id` (`model_id`),
  KEY `last_arrival` (`last_arrival`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `masters_aircrafts_ibfk_4200` FOREIGN KEY (`operator_id`) REFERENCES `masters_operators` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `masters_aircrafts_ibfk_4201` FOREIGN KEY (`model_id`) REFERENCES `masters_aircraft_models` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `masters_aircrafts_ibfk_4202` FOREIGN KEY (`last_arrival`) REFERENCES `masters_airports` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `masters_aircrafts_ibfk_4203` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `masters_aircrafts_ibfk_4204` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masters_aircrafts`
--

LOCK TABLES `masters_aircrafts` WRITE;
/*!40000 ALTER TABLE `masters_aircrafts` DISABLE KEYS */;
INSERT INTO `masters_aircrafts` VALUES (1,1,1,'VT-VPA',2,2,2,2,2,8,8,8,'Local Time',1,0,'03:00:00','03:00:00',1,'2023-12-25 09:22:26',23,'Kilo Grams',NULL,1,1,'2023-12-25 09:22:26','2023-12-25 09:22:26',395),(2,1,2,'VT-RFX',2,2,2,2,2,8,8,8,'Local Time',1,0,'03:00:00','03:00:00',0,NULL,23,'Kilo Grams',NULL,1,1,'2023-12-25 09:22:26','2023-12-25 09:22:26',395);
/*!40000 ALTER TABLE `masters_aircrafts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `masters_airports`
--

DROP TABLE IF EXISTS `masters_airports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `masters_airports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `airport_name` varchar(225) NOT NULL,
  `iata_code` varchar(5) NOT NULL,
  `icao_code` varchar(5) NOT NULL,
  `city_id` int NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `address` text,
  `remark` text,
  `critical_airport` tinyint DEFAULT NULL,
  `alertable_airport` tinyint DEFAULT NULL,
  `created_by` int NOT NULL,
  `updated_by` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `city_id` (`city_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `masters_airports_ibfk_2565` FOREIGN KEY (`city_id`) REFERENCES `masters_cities` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `masters_airports_ibfk_2566` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `masters_airports_ibfk_2567` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=258 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masters_airports`
--

LOCK TABLES `masters_airports` WRITE;
/*!40000 ALTER TABLE `masters_airports` DISABLE KEYS */;
INSERT INTO `masters_airports` VALUES (1,'Agartala Airport','IXA','VEAT',2,23.88600000,91.24040000,NULL,'None',0,0,1,1,'2024-02-28 17:13:00','2024-02-28 17:13:00'),(2,'Agatti Aerodrome','AGX','VOAT',3,10.82310000,72.17630000,'Airport Rd, Agatti, Lakshadweep 682553','None',0,0,1,1,'2024-02-28 17:13:00','2024-02-28 17:13:00'),(3,'Agra Airport / Agra Air Force Base','AGR','VIAG',4,27.15570000,77.96070000,NULL,'None',0,0,1,1,'2024-02-28 17:13:00','2024-02-28 17:13:00'),(4,'Akola Airport','AKD','VAAK',5,20.69900000,77.05860000,'Shivani AirPort Area, National Highway 6, Akola, Maharashtra 444104','None',0,0,1,1,'2024-02-28 17:13:00','2024-02-28 17:13:00'),(5,'Along Airport','IXV','VEAN',1,28.17520000,94.80260000,NULL,'None',0,0,1,1,'2024-02-28 17:13:00','2024-02-28 17:13:00'),(6,'Lucknow Amausi Airport','LKO','VILK',6,26.76060000,80.88930000,'Kanpur Rd, Amausi, Lucknow, Uttar Pradesh - 226009','None',0,0,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(7,'Ambala Air Force Base','AMB','VIAM',7,30.36750000,76.81640000,NULL,'None',0,0,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(8,'Anand Arakkonam Air Force Base','XAX','VOAR',8,13.57670000,79.41030000,NULL,'None',0,0,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(9,'Aurangabad Airport','IXU','VAAU',9,19.86370000,75.39870000,NULL,'None',0,0,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(10,'Bagdogra Airport / Bagdogra Air Force Base','IXB','VEBD',10,26.68120000,88.32860000,NULL,'None',0,0,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(11,'Bakshi Ka Talab Air Force Base','BKB','VIBL',11,26.22000000,80.49970000,NULL,'None',0,0,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(12,'Balurghat Airport','RGH','VEBG',12,25.26310000,88.79660000,NULL,'None',0,0,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(13,'Bamrauli Air Force Base','IXD','VIAL',13,25.44250000,81.73480000,NULL,'None',0,0,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(14,'Bangalore International Airport','BLR','VOBL',14,13.19860000,77.70660000,NULL,'None',0,0,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(15,'Bareli Airport','BEK','VIBY',15,28.42240000,79.45020000,NULL,'None',0,0,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(16,'Behala Airport','BQA','VEBA',16,22.63160000,88.44670000,NULL,'None',0,0,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(17,'Belgaum Airport','IXG','VOBM',17,15.85900000,74.61850000,NULL,'None',0,0,1,1,'2024-02-28 17:13:01','2024-02-28 18:11:57'),(18,'Bellary Airport','BEP','VOBI',18,15.16280000,76.88070000,NULL,'None',0,0,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(19,'Bhavnagar Airport','BHU','VABV',19,21.75500000,72.18610000,NULL,'None',0,0,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(20,'Bhisiana Air Force Base','BKN','VIBT',20,30.92610000,74.62290000,NULL,'None',0,0,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(21,'Bhopal Airport (Bairagarh Airport)','BHO','VABP',21,23.28750000,77.33740000,NULL,'None',0,0,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(22,'Bhuj Airport','BHJ','VABJ',22,23.28750000,69.67010000,NULL,'None',0,0,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(23,'Bhuntar Airport','BUU','VIBR',23,31.88260000,77.15430000,NULL,'None',0,0,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(24,'Bidar Air Force Station','BDR','VOBR',24,17.91640000,77.51880000,NULL,'None',0,0,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(25,'Biju Patnaik Airport','BBI','VEBS',25,20.25270000,85.81730000,NULL,'None',0,0,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(26,'Bilaspur Airport','PAB','VABI',26,21.99020000,82.10990000,NULL,'None',0,0,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(27,'Birsa Munda Airport (Ranchi Airport)','IXR','VERC',27,23.31750000,85.32110000,NULL,'None',0,0,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(28,'Calicut International Airport (Karipur Airport)','CCJ','VOCL',28,11.13640000,75.95530000,NULL,'None',0,0,1,1,'2024-02-28 17:14:17','2024-02-28 17:14:17'),(29,'Car Nicobar Air Force Base','IXZ','VOCX',29,9.15330000,92.81250000,NULL,'None',0,0,1,1,'2024-02-28 17:14:17','2024-02-28 17:14:17'),(30,'Chabua Air Force Base (Jorhat Airport)','JRH','VEJT',30,27.48280000,95.01600000,NULL,'None',0,0,1,1,'2024-02-28 17:14:17','2024-02-28 17:14:17'),(31,'Chakeri Air Force Station','KEQ','VICX',31,26.40420000,80.41230000,NULL,'None',0,0,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(32,'Chakulia Airport','CDP','VECK',32,22.49800000,86.49060000,NULL,'None',0,0,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(33,'Chandigarh Airport (Chandigarh Air Force Base)','IXC','VICG',33,30.67370000,76.78890000,NULL,'None',0,0,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(34,'Chatrapati Shivaji International Airport','BOM','VABB',34,19.08800000,72.86790000,NULL,'None',0,0,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(35,'Chennai International Airport','MAA','VOMM',35,13.08270000,80.27070000,NULL,'None',0,0,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(36,'Cochin International Airport (Kochi)','COK','VOCB',36,10.15200000,76.39220000,NULL,'None',0,0,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(37,'Coimbatore Airport','CJB','VOCB',37,11.03000000,77.04340000,NULL,'None',0,0,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(38,'Cooch Behar Airport','COH','VECO',38,26.33130000,89.46160000,NULL,'None',0,0,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(39,'Dabolim Airport (Goa Airport)','GOI','VAGO',39,15.38080000,73.83100000,NULL,'None',0,0,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(40,'Daman Airport','NMB','VADN',40,20.43490000,72.84410000,NULL,'None',0,0,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(41,'Daparizo Airport','DAP','VADZ',41,27.99060000,94.22580000,NULL,'None',0,0,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(42,'Daporijo Airport','DAE','VEDZ',42,27.98390000,94.21740000,NULL,'None',0,0,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(43,'Devi Ahilyabai Holkar International Airport','IDR','VAID',43,22.72170000,75.80110000,NULL,'None',0,0,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(44,'Dhanbad Airport','DBD','VEDB',44,23.83150000,86.42370000,NULL,'None',0,0,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(45,'Dibrugarh Airport (Mohanbari Airport)','DIB','VEMN',45,27.48390000,95.01600000,NULL,'None',0,0,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(46,'Dimapur Airport (Dimapur Air Force Base)','DMU','VEMR',46,25.87830000,93.77130000,NULL,'None',0,0,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(47,'Donakonda Airport','DOX','VODK',47,15.36390000,79.19770000,NULL,'None',0,0,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(48,'Dr. Babasaheb Ambedkar International Airport','NAG','VANP',48,21.09150000,79.04930000,NULL,'None',0,0,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(49,'Dundigul Air Force Academy','DAG','VODG',49,17.50550000,78.38750000,NULL,'None',0,0,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(50,'Gaggal Airport (Kangra Airport)','GAG','VIGG',50,32.16560000,76.26320000,NULL,'None',0,0,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(51,'Gaya Airport','GAY','VEGY',51,24.74430000,84.95100000,NULL,'None',0,0,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(52,'Gorakhpur Air Force Base','GOP','VEGK',52,26.73970000,83.44900000,NULL,'None',0,0,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(53,'Guna Airport','GUX','VAGN',53,24.65400000,77.34750000,NULL,'None',0,0,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(54,'Gwalior Airport (Maharajpur Air Force Base)','GWL','VIGR',54,26.29500000,78.22770000,NULL,'None',0,0,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(55,'Hakimpet Air Force Station','HKW','VOHK',55,17.47250000,78.52430000,NULL,'None',0,0,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(56,'Hindon Air Force Base','HSS','VIDX',56,28.71450000,77.47720000,NULL,'None',0,0,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(57,'Hindustan Airport','BGA','VOBG',14,13.19860000,77.70660000,NULL,'None',0,0,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(58,'Hirakud Airport','WSJ','VEHK',57,21.51670000,83.86670000,NULL,'None',0,0,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(59,'Hissar Airport','HSR','VIHR',58,29.17980000,75.75190000,NULL,'None',0,0,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(60,'Hubli Airport','HBX','VAHB',59,15.36020000,75.08490000,NULL,'None',0,0,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(61,'Imphal Airport (Tulihal Airport)','IMF','VEIM',60,24.76000000,93.89670000,NULL,'None',0,0,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(62,'Indira Gandhi International Airport','DEL','VIDP',61,28.55620000,77.10000000,NULL,'None',0,0,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(63,'Jabalpur Airport','JLR','VAJB',62,23.17700000,80.05200000,NULL,'None',0,0,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(64,'Jaipur Airport (Sanganer Airport)','JAI','VIJP',63,26.82400000,75.80210000,NULL,'None',0,0,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(65,'Jaisalmer Airport','JSA','VIJR',64,26.89460000,70.86450000,NULL,'None',0,0,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(66,'Jammu Airport','IXJ','VIJU',65,32.68940000,74.83780000,NULL,'None',0,0,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(67,'Jamnagar Airport (Jamnagar Air Force Base)','JGA','VAJM',66,22.46580000,70.01250000,NULL,'None',0,0,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(68,'Jamshedpur Airport','IXW','VEJS',67,22.81340000,86.16810000,NULL,'None',0,0,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(69,'Jhansi Airport','JHS','VIJN',68,25.50260000,78.55620000,NULL,'None',0,0,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(70,'Jodhpur Airport (Jodhpur Air Force Base)','JDH','VIJO',69,26.25150000,73.06380000,NULL,'None',0,0,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(71,'Jolly Grant Airport','DED','VIDN',70,30.18960000,78.18010000,NULL,'None',0,0,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(72,'Juhu Airport','JUH','VAJJ',34,19.09740000,72.83280000,NULL,'None',0,0,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(73,'Junagadh Airport (Keshod Airport)','HJR','VAKS',71,21.31760000,70.27060000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(74,'Kailashahar Airport','IXH','VEKR',72,24.30830000,92.00740000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(75,'Kamalpur Airport','IXQ','VEKM',73,24.15710000,91.77140000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(76,'Kandla Airport (Gandhidham Airport)','IXY','VAKE',74,23.11360000,70.10020000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(77,'Kanpur Airport (Chakeri Airport)','KNU','VIKA',31,26.44170000,80.36420000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(78,'Khandwa Airport','KNW','VAKD',75,21.83240000,76.35140000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(79,'Khowai Airport','IXN','VEKW',76,24.06800000,91.54100000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(80,'Kolhapur Airport','KLH','VAKP',77,16.66440000,74.28570000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(81,'Kota Airport','KTU','VIKO',78,25.16050000,75.84400000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(82,'Leh Kushok Bakula Rimpochee Airport','IXL','VILH',79,34.13570000,77.54600000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(83,'Lilabari Airport','IXI','VELR',80,27.29550000,94.09770000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(84,'Lok Nayak Jaya Prakash Narayan Airport (Patna)','PAT','VEPT',81,25.59140000,85.08800000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(85,'Lokpriya Gopinath Bordoloi International Airport','GAU','VEGT',82,26.10600000,91.58590000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(86,'Madurai Airport','IXM','VOMD',83,9.83290000,78.09070000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(87,'Malda Airport','LDA','VEMH',84,25.02550000,88.62750000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(88,'Mangalore International Airport','IXE','VOML',85,12.96150000,74.89000000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(89,'Muzzafarpur Airport','MZU','VEMZ',86,26.11900000,85.31550000,NULL,'None',0,0,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(90,'Mysore Airport','MYQ','VOMY',87,12.30810000,76.64990000,NULL,'None',0,0,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(91,'Nanded Airport','NDC','VAND',88,19.18400000,77.31900000,NULL,'None',0,0,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(92,'Nasik Road Airport','ISK','VANR',89,20.11630000,73.91230000,NULL,'None',0,0,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(93,'Netaji Subhash Chandra Bose International Airport','CCU','VECC',16,22.65430000,88.44670000,NULL,'None',0,0,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(94,'Neyvafli Airport','none','VONV',90,28.06190000,94.71210000,NULL,'None',0,0,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(95,'Panagarh Air Force Base','RDP','VEPH',91,23.51780000,87.28670000,NULL,'None',0,0,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(96,'Pant Nagar Airport (Pantnagar Airport)','PGH','VIPT',92,29.03340000,79.47390000,NULL,'None',0,0,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(97,'Pasighat Airport','IXT','VEPG',93,28.06650000,95.32940000,NULL,'None',0,0,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(98,'Pathankot Air Force Base','IXP','VIPK',94,32.23380000,75.63440000,NULL,'None',0,0,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(99,'Pondicherry Airport','PNY','VOPC',95,11.96800000,79.81010000,NULL,'None',0,0,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(100,'Porbandar Airport','PBD','VAPR',96,21.64870000,69.65730000,NULL,'None',0,0,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(101,'Pune Airport (Lohegaon Air Force Base)','PNQ','VAPO',97,18.58000000,73.91960000,NULL,'None',0,0,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(102,'Purnea Airport','PUI','VEPY',98,25.76170000,87.48020000,NULL,'None',0,0,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(103,'Raipur Airport','RPR','VARP',99,21.18040000,81.73860000,NULL,'None',0,0,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(104,'Raja Sansi International Airport (Amritsar Int’l)','ATQ','VIAR',100,31.70960000,74.79980000,NULL,'None',0,0,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(105,'Rajahmundry Airport','RJA','VORY',101,17.11060000,81.81880000,NULL,'None',0,0,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(106,'Rajiv Gandhi International Airport','HYD','VOHS',102,17.23150000,78.42940000,NULL,'None',0,0,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(107,'Rajkot Airport','RAJ','VARK',103,22.30900000,70.77950000,NULL,'None',0,0,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(108,'Ramagundam Airport','RMD','VORG',104,18.75720000,79.47420000,NULL,'None',0,0,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(109,'Ratnagiri Airport','RTC','VARG',105,17.00230000,73.32500000,NULL,'None',0,0,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(110,'Rourkela Airport','RRK','VERK',106,22.25610000,84.81410000,NULL,'None',0,0,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(111,'Rupsi Airport','RUP','VERU',107,26.15440000,89.01950000,NULL,'None',0,0,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(112,'Safdarjung Airport (Safdarjung Air Force Station)','VCI','VIDD',108,28.58420000,77.20500000,NULL,'None',0,0,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(113,'Sahnewal Airport','QRS','VILD',109,30.85470000,75.95630000,NULL,'None',0,0,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(114,'Salem Airport','SXV','VOSM',110,11.78090000,78.06500000,NULL,'None',0,0,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(115,'Sardar Vallabhbhai Patel International Airport','AMD','VAAH',111,23.07340000,72.62600000,NULL,'None',0,0,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(116,'Satna Airport','TNI','VIST',112,24.56280000,80.85580000,NULL,'None',0,0,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(117,'Shillong Airport (Barapani Airport)','SHL','VEBI',113,25.70370000,91.97800000,NULL,'None',0,0,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(118,'Shimla Airport','SLV','VISM',114,31.08150000,77.06850000,NULL,'None',0,0,1,1,'2024-02-28 17:14:23','2024-02-28 18:18:09'),(119,'Sholapur Airport','SSE','VASL',115,17.62730000,75.93480000,NULL,'None',0,0,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(120,'Silchar Airport (Kumbhirgram Air Force Base)','IXS','VEKU',116,24.91290000,92.97850000,NULL,'None',0,0,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(121,'Sirsa Air Force Base','HSI','VIAX',117,29.17980000,75.75190000,NULL,'None',0,0,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(122,'Sri Sathya Sai Airport','PUT','VOPN',118,14.14900000,77.79100000,NULL,'None',0,0,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(123,'Surat Airport','STV','VASU',119,21.11410000,72.74110000,NULL,'None',0,0,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(124,'Tambaram Air Force Base','TMB','VOTX',35,12.91270000,80.12750000,NULL,'None',0,0,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(125,'Tanjore Air Force Base','TJV','VOTJ',120,10.72420000,79.10510000,NULL,'None',0,0,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(126,'Tezpur Airport (Tezpur Air Force Base)','TEZ','VETZ',121,26.70910000,92.80400000,NULL,'None',0,0,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(127,'Tezu Airport','TEI','VETJ',122,27.94510000,96.16200000,NULL,'None',0,0,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(128,'Thiruvananthapuram International Airport','TRV','VOTV',123,8.48210000,76.92030000,NULL,'None',0,0,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(129,'Tiruchirapalli Airport','TRZ','VOTR',124,10.76540000,78.70880000,NULL,'None',0,0,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(130,'Tirupati Airport','TIR','VOTP',125,13.63250000,79.54310000,NULL,'None',0,0,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(131,'Udaipur Airport','UDR','VAUD',126,24.61720000,73.89610000,NULL,'None',0,0,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(132,'Varanasi Airport (Lal Bahadur Shastri Airport)','VNS','VAUH',127,25.45210000,82.85920000,NULL,'None',0,0,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(133,'Vijayawada Airport','VGA','VAVV',128,16.52190000,80.79700000,NULL,'None',0,0,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(134,'Visakhapatnam Airport (Visakhapatnam Air Force Base)','VTZ','VOVR',129,17.72150000,83.22440000,NULL,'None',0,0,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(135,'Cochin Navy Airbase','COK','VOCC',36,10.15200000,76.39220000,NULL,'None',0,0,1,1,'2024-02-28 18:02:52','2024-02-28 18:02:52'),(136,'Cuddapah Airport','CDP','VOCP',130,14.51040000,78.77260000,NULL,'None',0,0,1,1,'2024-02-28 18:02:52','2024-02-28 18:02:52'),(137,'Jeypore Airport','JSA','VEJP',131,18.88060000,82.56860000,NULL,'None',0,0,1,1,'2024-02-28 18:02:52','2024-02-28 18:02:52'),(138,'Jharsuguda Airport','IXR','VEJH',132,21.91890000,84.05010000,NULL,'None',0,0,1,1,'2024-02-28 18:02:52','2024-02-28 18:02:52'),(139,'Khajuraho Airport','HJR','VIKI',133,24.81770000,79.91970000,NULL,'None',0,0,1,1,'2024-02-28 18:02:52','2024-02-28 18:02:52'),(140,'Nal Air Force Base','BOM','VIBK',134,28.55620000,77.10000000,NULL,'None',0,0,1,1,'2024-02-28 18:02:53','2024-02-28 18:02:53'),(141,'Raxaul Airport','none','VERL',135,26.96540000,84.85820000,NULL,'None',0,0,1,1,'2024-02-28 18:02:53','2024-02-28 18:02:53'),(142,'Sulur Air Force Base','none','VOSX',136,11.01820000,77.08490000,NULL,'None',0,0,1,1,'2024-02-28 18:02:53','2024-02-28 18:02:53'),(143,'Turial Air Force Base','none','VEAZ',137,23.87230000,91.28820000,NULL,'None',0,0,1,1,'2024-02-28 18:02:53','2024-02-28 18:02:53'),(144,'Udhampur Air Force Base','UDR','VIUX',138,32.92540000,75.12760000,NULL,'None',0,0,1,1,'2024-02-28 18:02:53','2024-02-28 18:02:53'),(145,'Srinagar Airport (Srinagar Air Force Base)','SXR','VISR',139,33.98740000,74.77450000,NULL,'None',1,1,1,1,'2024-02-28 18:19:13','2024-02-28 18:19:13'),(146,'Ayodhya Airport','AYJ','VEAY',140,26.75333300,82.15027800,NULL,'None',0,0,1,1,'2024-02-28 18:26:52','2024-03-13 15:43:48'),(256,'Begumpet Airport','BPM','VOHY',102,17.44987850,78.46800250,NULL,'None',0,0,1,1,'2024-02-28 18:26:52','2024-03-13 15:43:48'),(257,'Shirdi Airport','SAG','VASD',256,19.68876000,74.37766000,NULL,'None',0,0,1,1,'2024-02-28 18:26:52','2024-02-28 18:26:52');
/*!40000 ALTER TABLE `masters_airports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `masters_cities`
--

DROP TABLE IF EXISTS `masters_cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `masters_cities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `city_name` varchar(45) NOT NULL,
  `zone_id` int NOT NULL,
  `country_id` int NOT NULL,
  `created_by` int NOT NULL,
  `updated_by` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `zone_id` (`zone_id`),
  KEY `country_id` (`country_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `masters_cities_ibfk_3425` FOREIGN KEY (`zone_id`) REFERENCES `masters_zones` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `masters_cities_ibfk_3426` FOREIGN KEY (`country_id`) REFERENCES `masters_countries` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `masters_cities_ibfk_3427` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `masters_cities_ibfk_3428` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=257 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masters_cities`
--

LOCK TABLES `masters_cities` WRITE;
/*!40000 ALTER TABLE `masters_cities` DISABLE KEYS */;
INSERT INTO `masters_cities` VALUES (1,'Along',25,1,1,1,'2024-02-28 16:37:48','2024-02-28 16:37:48'),(2,'Agartala',25,1,1,1,'2024-02-28 17:03:58','2024-02-28 17:03:58'),(3,'Agatti',25,1,1,1,'2024-02-28 17:13:00','2024-02-28 17:13:00'),(4,'Agra',25,1,1,1,'2024-02-28 17:13:00','2024-02-28 17:13:00'),(5,'Akola',25,1,1,1,'2024-02-28 17:13:00','2024-02-28 17:13:00'),(6,'Lucknow',25,1,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(7,'Ambala',25,1,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(8,'Arakkonam',25,1,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(9,'Aurangabad',25,1,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(10,'Bagdogra',25,1,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(11,'Bakshi Ka Talab',25,1,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(12,'Balurghat',25,1,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(13,'Allahabad',25,1,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(14,'Bengaluru',25,1,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(15,'Bareilly',25,1,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(16,'Kolkata',25,1,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(17,'Belgaum',25,1,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(18,'Bellary',25,1,1,1,'2024-02-28 17:13:01','2024-02-28 17:13:01'),(19,'Bhavnagar',25,1,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(20,'Bhisiana',25,1,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(21,'Bhopal',25,1,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(22,'Bhuj',25,1,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(23,'Bhuntar',25,1,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(24,'Bidar',25,1,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(25,'Bhubaneswar',25,1,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(26,'Bilaspur',25,1,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(27,'Ranchi',25,1,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(28,'Kozhikode',25,1,1,1,'2024-02-28 17:13:02','2024-02-28 17:13:02'),(29,'Car Nicobar',25,1,1,1,'2024-02-28 17:14:17','2024-02-28 17:14:17'),(30,'Jorhat',25,1,1,1,'2024-02-28 17:14:17','2024-02-28 17:14:17'),(31,'Kanpur',25,1,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(32,'Chakulia',25,1,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(33,'Chandigarh',25,1,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(34,'Mumbai',25,1,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(35,'Chennai',25,1,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(36,'Kochi',25,1,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(37,'Coimbatore',25,1,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(38,'Cooch Behar',25,1,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(39,'Dabolim',25,1,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(40,'Daman',25,1,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(41,'Daparizo',25,1,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(42,'Daporijo',25,1,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(43,'Indore',25,1,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(44,'Dhanbad',25,1,1,1,'2024-02-28 17:14:18','2024-02-28 17:14:18'),(45,'Dibrugarh',25,1,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(46,'Dimapur',25,1,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(47,'Donakonda',25,1,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(48,'Nagpur',25,1,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(49,'Dundigul',25,1,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(50,'Gaggal',25,1,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(51,'Gaya',25,1,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(52,'Gorakhpur',25,1,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(53,'Guna',25,1,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(54,'Gwalior',25,1,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(55,'Hakimpet',25,1,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(56,'Hindon',25,1,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(57,'Hirakud',25,1,1,1,'2024-02-28 17:14:19','2024-02-28 17:14:19'),(58,'Hissar',25,1,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(59,'Hubli',25,1,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(60,'Imphal',25,1,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(61,'Delhi',25,1,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(62,'Jabalpur',25,1,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(63,'Jaipur',25,1,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(64,'Jaisalmer',25,1,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(65,'Jammu',25,1,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(66,'Jamnagar',25,1,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(67,'Jamshedpur',25,1,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(68,'Jhansi',25,1,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(69,'Jodhpur',25,1,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(70,'Dehradun',25,1,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(71,'Junagadh',25,1,1,1,'2024-02-28 17:14:20','2024-02-28 17:14:20'),(72,'Kailashahar',25,1,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(73,'Kamalpur',25,1,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(74,'Kandla',25,1,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(75,'Khandwa',25,1,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(76,'Khowai',25,1,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(77,'Kolhapur',25,1,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(78,'Kota',25,1,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(79,'Leh',25,1,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(80,'Lilabari',25,1,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(81,'Patna',25,1,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(82,'Guwahati',25,1,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(83,'Madurai',25,1,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(84,'Malda',25,1,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(85,'Mangalore',25,1,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(86,'Muzzafarpur',25,1,1,1,'2024-02-28 17:14:21','2024-02-28 17:14:21'),(87,'Mysore',25,1,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(88,'Nanded',25,1,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(89,'Nasik',25,1,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(90,'Neyvafli',25,1,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(91,'Panagarh',25,1,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(92,'Pantnagar',25,1,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(93,'Pasighat',25,1,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(94,'Pathankot',25,1,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(95,'Pondicherry',25,1,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(96,'Porbandar',25,1,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(97,'Pune',25,1,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(98,'Purnea',25,1,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(99,'Raipur',25,1,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(100,'Amritsar',25,1,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(101,'Rajahmundry',25,1,1,1,'2024-02-28 17:14:22','2024-02-28 17:14:22'),(102,'Hyderabad',25,1,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(103,'Rajkot',25,1,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(104,'Ramagundam',25,1,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(105,'Ratnagiri',25,1,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(106,'Rourkela',25,1,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(107,'Rupsi',25,1,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(108,'New Delhi',25,1,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(109,'Ludhiana',25,1,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(110,'Salem',25,1,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(111,'Ahmedabad',25,1,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(112,'Satna',25,1,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(113,'Shillong',25,1,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(114,'Shimla',25,1,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(115,'Solapur',25,1,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(116,'Silchar',25,1,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(117,'Sirsa',25,1,1,1,'2024-02-28 17:14:23','2024-02-28 17:14:23'),(118,'Puttaparthi',25,1,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(119,'Surat',25,1,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(120,'Thanjavur',25,1,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(121,'Tezpur',25,1,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(122,'Tezu',25,1,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(123,'Thiruvananthapuram',25,1,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(124,'Tiruchirapalli',25,1,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(125,'Tirupati',25,1,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(126,'Udaipur',25,1,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(127,'Varanasi',25,1,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(128,'Vijayawada',25,1,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(129,'Visakhapatnam',25,1,1,1,'2024-02-28 17:14:24','2024-02-28 17:14:24'),(130,'Cuddapah',25,1,1,1,'2024-02-28 18:02:52','2024-02-28 18:02:52'),(131,'Jeypore',25,1,1,1,'2024-02-28 18:02:52','2024-02-28 18:02:52'),(132,'Jharsuguda',25,1,1,1,'2024-02-28 18:02:52','2024-02-28 18:02:52'),(133,'Khajuraho',25,1,1,1,'2024-02-28 18:02:52','2024-02-28 18:02:52'),(134,'Bikaner',25,1,1,1,'2024-02-28 18:02:53','2024-02-28 18:02:53'),(135,'Raxaul',25,1,1,1,'2024-02-28 18:02:53','2024-02-28 18:02:53'),(136,'Sulur',25,1,1,1,'2024-02-28 18:02:53','2024-02-28 18:02:53'),(137,'Turial',25,1,1,1,'2024-02-28 18:02:53','2024-02-28 18:02:53'),(138,'Udhampur',25,1,1,1,'2024-02-28 18:02:53','2024-02-28 18:02:53'),(139,'Srinagar',25,1,1,1,'2024-02-28 18:19:13','2024-02-28 18:19:13'),(140,'Ayodhya',25,1,1,1,'2024-02-28 18:27:45','2024-02-28 18:27:45'),(256,'Shirdi',25,1,1,1,'2024-02-28 18:27:45','2024-02-28 18:27:45');
/*!40000 ALTER TABLE `masters_cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `masters_countries`
--

DROP TABLE IF EXISTS `masters_countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `masters_countries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `country_name` varchar(45) NOT NULL,
  `created_by` int NOT NULL,
  `updated_by` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `masters_countries_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `masters_countries_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masters_countries`
--

LOCK TABLES `masters_countries` WRITE;
/*!40000 ALTER TABLE `masters_countries` DISABLE KEYS */;
INSERT INTO `masters_countries` VALUES (1,'India',1,1,'2024-02-28 16:37:48','2024-02-28 16:37:48');
/*!40000 ALTER TABLE `masters_countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `masters_operators`
--

DROP TABLE IF EXISTS `masters_operators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `masters_operators` (
  `id` int NOT NULL AUTO_INCREMENT,
  `operator_name` varchar(255) NOT NULL,
  `created_by` int NOT NULL,
  `updated_by` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `masters_operators_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `masters_operators_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masters_operators`
--

LOCK TABLES `masters_operators` WRITE;
/*!40000 ALTER TABLE `masters_operators` DISABLE KEYS */;
INSERT INTO `masters_operators` VALUES (1,'Sparzana Aviation Pvt Ltd',1,1,'2023-12-18 18:35:30','2023-12-18 18:35:30');
/*!40000 ALTER TABLE `masters_operators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `masters_zones`
--

DROP TABLE IF EXISTS `masters_zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `masters_zones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `zone` varchar(255) NOT NULL,
  `gmt` time NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masters_zones`
--

LOCK TABLES `masters_zones` WRITE;
/*!40000 ALTER TABLE `masters_zones` DISABLE KEYS */;
INSERT INTO `masters_zones` VALUES (1,'(GMT-11:00) Midway Island, Samoa','-11:00:00'),(2,'(GMT-10:00) Hawaii','-10:00:00'),(3,'(GMT-09:00) Alaska','-09:00:00'),(4,'(GMT-08:00) Pacific Time (US & Canada)','-08:00:00'),(5,'(GMT-07:00) Mountain Time (US & Canada)','-07:00:00'),(6,'(GMT-06:00) Central Time (US & Canada), Mexico City','-06:00:00'),(7,'(GMT-05:00) Eastern Time (US & Canada), Lima','-05:00:00'),(8,'(GMT-05:00) Bogota, Panama','-05:00:00'),(9,'(GMT-04:00) Atlantic Time (Canada), La Paz, Santiago','-04:00:00'),(10,'(GMT-03:30) Newfoundland','-03:30:00'),(11,'(GMT-03:00) Brazil, Buenos Aires, Georgetown','-03:00:00'),(12,'(GMT-02:00) Mid-Atlantic','-02:00:00'),(13,'(GMT-01:00) Azores, Cape Verde Islands','-01:00:00'),(14,'(GMT 00:00) Western Europe Time, Dublin, Lisbon, London, Casablanca, Greenwich','00:00:00'),(15,'(GMT 00:00) Conakry','00:00:00'),(16,'(GMT+01:00) Douala, Cameroon','01:00:00'),(17,'(GMT+01:00) Brussels, Copenhagen, Madrid, Paris','01:00:00'),(18,'(GMT+02:00) Kaliningrad, South Africa, Cairo','02:00:00'),(19,'(GMT+03:00) Baghdad, Riyadh, Moscow, St. Petersburg, East Africa','03:00:00'),(20,'(GMT+03:30) Tehran','03:30:00'),(21,'(GMT+04:00) Abu Dhabi, Muscat, Yerevan, Baku','04:00:00'),(22,'(GMT+04:00) Tbilisi','04:00:00'),(23,'(GMT+04:30) Kabul','04:30:00'),(24,'(GMT+05:00) Ekaterinburg, Islamabad, Karachi, Tashkent','05:00:00'),(25,'(GMT+05:30) Mumbai, Kolkata, Chennai, New Delhi','05:30:00'),(26,'(GMT+05:30) Kathmandu','05:30:00'),(27,'(GMT+06:00) Almaty, Dhaka, Colombo','06:00:00'),(28,'(GMT+06:30) Yangon, Cocos Islands','06:30:00'),(29,'(GMT+07:00) Bangkok, Hanoi, Jakarta','07:00:00'),(30,'(GMT+08:00) Beijing, Perth, Singapore, Hong Kong','08:00:00'),(31,'(GMT+09:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk','09:00:00'),(32,'(GMT+09:30) Adelaide, Darwin','09:30:00'),(33,'(GMT+10:00) Eastern Australia, Guam, Vladivostok','10:00:00'),(34,'(GMT+11:00) Magadan, Solomon Islands, New Caledonia','11:00:00'),(35,'(GMT+12:00) Auckland, Wellington, Fiji, Kamchatka, Eniwetok, Kwajalein','12:00:00');
/*!40000 ALTER TABLE `masters_zones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotation_charges`
--

DROP TABLE IF EXISTS `quotation_charges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotation_charges` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quotation_id` int NOT NULL,
  `title` varchar(45) NOT NULL,
  `cost` float(12,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `quotation_id` (`quotation_id`),
  CONSTRAINT `quotation_charges_ibfk_1` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotation_charges`
--

LOCK TABLES `quotation_charges` WRITE;
/*!40000 ALTER TABLE `quotation_charges` DISABLE KEYS */;
INSERT INTO `quotation_charges` VALUES (1,1,'Airport Handling Charges',0.00),(2,1,'Crew Accomodation Charges',0.00),(3,1,'Ground Handling Charges',0.00),(4,1,'Halt Charges',0.00),(5,1,'Other Charges',0.00),(6,2,'Airport Handling Charges',0.00),(7,2,'Crew Accomodation Charges',0.00),(8,2,'Ground Handling Charges',0.00),(9,2,'Halt Charges',0.00),(10,2,'Other Charges',0.00),(11,3,'Airport Handling Charges',0.00),(12,3,'Crew Accomodation Charges',0.00),(13,3,'Ground Handling Charges',0.00),(14,3,'Halt Charges',0.00),(15,3,'Other Charges',0.00),(16,4,'Airport Handling Charges',0.00),(17,4,'Crew Accomodation Charges',0.00),(18,4,'Ground Handling Charges',0.00),(19,4,'Halt Charges',0.00),(20,4,'Other Charges',0.00),(21,5,'Airport Handling Charges',120000.00),(22,5,'Crew Accomodation Charges',200000.00),(23,5,'Ground Handling Charges',0.00),(24,5,'Halt Charges',0.00),(25,5,'Other Charges',100000.00),(26,6,'Airport Handling Charges',0.00),(27,6,'Crew Accomodation Charges',0.00),(28,6,'Ground Handling Charges',0.00),(29,6,'Halt Charges',0.00),(30,6,'Other Charges',0.00),(31,7,'Airport Handling Charges',0.00),(32,7,'Crew Accomodation Charges',0.00),(33,7,'Ground Handling Charges',0.00),(34,7,'Halt Charges',0.00),(35,7,'Other Charges',0.00);
/*!40000 ALTER TABLE `quotation_charges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotation_downloads`
--

DROP TABLE IF EXISTS `quotation_downloads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotation_downloads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(30) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotation_downloads`
--

LOCK TABLES `quotation_downloads` WRITE;
/*!40000 ALTER TABLE `quotation_downloads` DISABLE KEYS */;
/*!40000 ALTER TABLE `quotation_downloads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotation_trips`
--

DROP TABLE IF EXISTS `quotation_trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotation_trips` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quotation_id` int NOT NULL,
  `departure_airport_id` int NOT NULL,
  `arrival_airport_id` int NOT NULL,
  `pax` int NOT NULL,
  `start_at` datetime NOT NULL,
  `duration` int NOT NULL,
  `cost` float(12,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `quotation_id` (`quotation_id`),
  KEY `departure_airport_id` (`departure_airport_id`),
  KEY `arrival_airport_id` (`arrival_airport_id`),
  CONSTRAINT `quotation_trips_ibfk_928` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `quotation_trips_ibfk_929` FOREIGN KEY (`departure_airport_id`) REFERENCES `masters_airports` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `quotation_trips_ibfk_930` FOREIGN KEY (`arrival_airport_id`) REFERENCES `masters_airports` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotation_trips`
--

LOCK TABLES `quotation_trips` WRITE;
/*!40000 ALTER TABLE `quotation_trips` DISABLE KEYS */;
INSERT INTO `quotation_trips` VALUES (1,1,1,10,9,'2024-07-25 23:55:00',65,500000.00),(2,1,10,11,0,'2024-07-26 23:50:00',95,700000.00),(3,2,35,62,5,'2024-07-25 21:14:00',175,1200000.00),(4,2,62,35,0,'2024-07-25 21:55:00',175,1200000.00),(5,3,35,62,5,'2024-07-25 21:14:00',175,1200000.00),(6,3,62,35,0,'2024-07-25 21:55:00',175,1200000.00),(7,4,35,62,8,'2024-07-25 15:04:00',175,1140000.00),(8,5,35,62,4,'2024-07-30 19:30:00',175,1140000.00),(9,5,62,35,4,'2024-08-01 21:30:00',175,1140000.00),(10,6,1,3,0,'2024-08-07 18:30:00',145,950000.00),(11,7,1,2,0,'2024-08-28 02:40:00',235,1520000.00);
/*!40000 ALTER TABLE `quotation_trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotations`
--

DROP TABLE IF EXISTS `quotations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(50) NOT NULL,
  `aircraft_id` int NOT NULL,
  `type` enum('oneway','roundtrip','multicity') DEFAULT 'oneway',
  `per_hour_cost` int NOT NULL,
  `duration` int NOT NULL,
  `trip_cost` float(12,2) NOT NULL,
  `sub_total` float(12,2) NOT NULL,
  `discount` float(12,2) NOT NULL,
  `st_after_discount` float(12,2) NOT NULL,
  `gst` float(12,2) NOT NULL,
  `grand_total` float(12,2) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `assigned_to` int NOT NULL,
  `created_by` int NOT NULL,
  `updated_by` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `aircraft_id` (`aircraft_id`),
  KEY `assigned_to` (`assigned_to`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `quotations_ibfk_1241` FOREIGN KEY (`aircraft_id`) REFERENCES `masters_aircrafts` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `quotations_ibfk_1242` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `quotations_ibfk_1243` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `quotations_ibfk_1244` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `quotations_ibfk_177` FOREIGN KEY (`aircraft_id`) REFERENCES `masters_aircraft_models` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotations`
--

LOCK TABLES `quotations` WRITE;
/*!40000 ALTER TABLE `quotations` DISABLE KEYS */;
INSERT INTO `quotations` VALUES (1,'Murugesh',2,'multicity',400000,160,1200000.00,1200000.00,0.00,1200000.00,216000.00,1416000.00,'quotation_1721894430971-409635510.pdf',1,1,1,'2024-07-25 08:00:24','2024-07-25 08:00:34'),(2,'Murugesh',2,'multicity',400000,350,2400000.00,2400000.00,0.00,2400000.00,432000.00,2832000.00,NULL,1,1,1,'2024-07-25 08:42:50','2024-07-25 08:42:50'),(3,'Murugesh',2,'multicity',400000,350,2400000.00,2400000.00,0.00,2400000.00,432000.00,2832000.00,'quotation_1721897009568-83021874.pdf',1,1,1,'2024-07-25 08:43:24','2024-07-25 08:43:34'),(4,'Murugesh',1,'oneway',380000,175,1140000.00,1140000.00,0.00,1140000.00,205200.00,1345200.00,'quotation_1721897328402-849576316.pdf',1,1,1,'2024-07-25 08:48:44','2024-07-25 08:48:55'),(5,'Surya',1,'roundtrip',380000,350,2280000.00,2700000.00,100000.00,2600000.00,468000.00,3068000.00,'quotation_1722334910305-424332324.pdf',1,1,1,'2024-07-30 10:21:43','2024-07-30 10:21:52'),(6,'murugesh',1,'oneway',380000,145,950000.00,950000.00,0.00,950000.00,171000.00,1121000.00,'quotation_1723009426759-636586267.pdf',1,1,1,'2024-08-07 05:43:39','2024-08-07 05:43:50'),(7,'Test',1,'oneway',380000,235,1520000.00,1520000.00,0.00,1520000.00,273600.00,1793600.00,'quotation_1724653354168-593928269.pdf',1,1,1,'2024-08-26 06:22:23','2024-08-26 06:22:39');
/*!40000 ALTER TABLE `quotations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20240415094358-create-user.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `api_key` text,
  `role` varchar(10) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `deleted_by` (`deleted_by`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_3` FOREIGN KEY (`deleted_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'SuperAdmin Murugesh','murugesh.k@refex.co.in','7305880787','$2b$10$jwIGWh1ULeK8VLBU70EHdecFLekbB7z0hf.n2Mhqih6SbQJsHmZZK','http://localhost:3001/uploads/users/photo-1716200285366-458793595.jpg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE3MTU5MjQyNTh9.0Bb_SLDcXj1bStERy7vjI5yzHTblZUJdo2RJmKW8MFY','SuperAdmin',1,1,'2023-11-19 20:20:21','2024-06-10 12:27:06',NULL,1,1,NULL),(2,'Admin Murugesh','kumarmurugesh14032001@gmail.com','7305880787','$2b$10$mFCT9a58Rxm8z9R.FzjJD.XT7pRJSBswcnIChDSUMp9utq4IWAPe6','http://localhost:3001/uploads/users/photo-1716200285366-458793595.jpg',NULL,'Admin',1,1,'2024-05-20 10:18:05','2024-05-23 08:04:57',NULL,1,1,NULL),(3,'User Murugesh','kumarmurugesh2001@gmail.com','7305880787','$2b$10$XoqClgNeZZacaZI2ti4K0.0gUrcbqC9DNh1qFFRQzLmaLZCwr8cvG','http://localhost:3001/uploads/users/photo-1716445879281-849244931.jpg',NULL,'User',1,1,'2024-05-20 11:48:43','2024-05-23 08:08:54',NULL,1,1,NULL),(4,'Raghul JE','raghul.je@refex.co.in','9790738549','$2b$10$XoqClgNeZZacaZI2ti4K0.0gUrcbqC9DNh1qFFRQzLmaLZCwr8cvG','http://localhost:3001/uploads/users/photo-1716445879281-849244931.jpg',NULL,'User',1,1,'2024-05-20 11:48:43','2024-05-23 08:08:54',NULL,1,1,NULL),(5,'Dinesh R','dinesh.r@refex.co.in','9361083127','$2b$10$jwIGWh1ULeK8VLBU70EHdecFLekbB7z0hf.n2Mhqih6SbQJsHmZZK','http://localhost:3001/uploads/users/photo-1716445879281-849244931.jpg',NULL,'SuperAdmin',1,1,'2023-11-19 20:20:21','2024-06-10 12:27:06',NULL,1,1,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'gama_development'
--

--
-- Dumping routines for database 'gama_development'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-11 12:49:58
