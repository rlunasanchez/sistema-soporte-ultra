-- MySQL dump 10.13  Distrib 8.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: soporte_ultra_db
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Current Database: `soporte_ultra_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `soporte_ultra_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `soporte_ultra_db`;

--
-- Table structure for table `ordenes_servicio`
--

DROP TABLE IF EXISTS `ordenes_servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordenes_servicio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `os` varchar(100) NOT NULL,
  `cliente` varchar(255) NOT NULL,
  `tecnico` varchar(255) DEFAULT NULL,
  `asignacion` date DEFAULT NULL,
  `en_garantia` enum('SI','NO') DEFAULT NULL,
  `tipo` enum('REPARACION','MANTENCION','DOA') DEFAULT NULL,
  `estado_actual` varchar(255) DEFAULT NULL,
  `fecha_reparacion` date DEFAULT NULL,
  `solicitud_compra` varchar(255) DEFAULT NULL,
  `n_denuncia` varchar(100) DEFAULT NULL,
  `qty` varchar(50) DEFAULT NULL,
  `anexo` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `equipo` varchar(255) DEFAULT NULL,
  `marca` varchar(255) DEFAULT NULL,
  `serie` varchar(255) DEFAULT NULL,
  `modelo` varchar(255) DEFAULT NULL,
  `procesador` varchar(255) DEFAULT NULL,
  `disco` varchar(255) DEFAULT NULL,
  `memoria` varchar(255) DEFAULT NULL,
  `cargador` tinyint DEFAULT '0',
  `bateria` tinyint DEFAULT '0',
  `insumo` tinyint DEFAULT '0',
  `cabezal` tinyint DEFAULT '0',
  `otros` varchar(255) DEFAULT NULL,
  `falla_informada` text,
  `falla_detectada` text,
  `conclusion` text,
  `realizado_por` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `os` (`os`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordenes_servicio`
--

LOCK TABLES `ordenes_servicio` WRITE;
/*!40000 ALTER TABLE `ordenes_servicio` DISABLE KEYS */;
INSERT INTO `ordenes_servicio` VALUES (43,'DOA-2520','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en Bodega','2026-03-04','','','','','2026-03-04','Impresora Termica','Sewoo','SW15AST001986','LK-T200','','','',0,0,0,0,'','No informada','Falta mantencion y ajustes mecanicos.','EQUIPO REPARADO\nSe realizo mantencion general y revision de puertos dejando equipo operativo.\nSerie original: 0\nSerie reversa: SW15AST001986\nTicket laboratorio: DOA-2520 ','Rodrigo Luna','2026-03-04 20:00:39'),(44,'DOA-2521','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-04','','','','','2026-03-04','Impresora termica','Sewoo','SW19GST071368','LK-T200','','','',0,0,0,0,'','No informada','Falta mantencion y ajustes mecanicos.','EQUIPO REPARADO\nSe realizo mantencion general y revision de puertos dejando equipo operativo.\nSerie original: 0\nSerie reversa: SW19GST071368\nTicket laboratorio: DOA-2521 ','Rodrigo Luna','2026-03-04 20:02:58'),(45,'DOA-2522','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-04','','','','','2026-03-04','Impresora termica','Sewoo','SW22CST042999','LK-T200','','','',0,0,0,0,'','No informada','Falta mantencion y ajustes mecanicos.','EQUIPO REPARADO\nSe realizo mantencion general y revision de puertos dejando equipo operativo.\nSerie original: 0\nSerie reversa: SW22CST042999\nTicket laboratorio: DOA-2522 ','Rodrigo Luna','2026-03-04 20:05:38'),(46,'DOA-2524','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-04','','','','','2026-03-04','Impresora termica','Sewoo','SW17IST198553','LK-T200','','','',0,0,0,0,'','No  informada','Falta mantencion y ajustes mecanicos.','EQUIPO REPARADO\nSe realizo mantencion general y revision de puertos dejando equipo operativo.\nSerie original: 0\nSerie reversa: SW17IST198553\nTicket laboratorio: DOA-2523 ','Rodrigo Luna','2026-03-04 20:08:24'),(47,'DOA-2525','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-04','','','','','2026-03-04','Impresora termica','Sewoo','SW20HST051114','LK-T200','','','',0,0,0,0,'','No informada','Falta mantencion y ajustes mecanicos.','EQUIPO REPARADO\nSe realizo mantencion general y revision de puertos dejando equipo operativo.\nSerie original: 0\nSerie reversa: SW20HST051114\nTicket laboratorio: DOA-2525','Rodrigo Luna','2026-03-04 20:10:54'),(48,'DOA-2526','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-04','','','','','2026-03-04','Impresora terminca','Sewoo','SW24DST019203','LK-T200','','','',0,0,0,0,'','No informada','Falta mantencion y ajustes mecanicos.','EQUIPO REPARADO\nSe realizo mantencion general y revision de puertos dejando equipo operativo.\nSerie original: 0\nSerie reversa: SW24DST019203\nTicket laboratorio: DOA-2526','Rodrigo Luna','2026-03-04 20:13:17'),(49,'DOA-2527','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-04','','','','','2026-03-04','Impresora termica','Sewoo','SW18BST021057','LK-T200','','','',0,0,0,0,'','No informada','Falta mantencion y ajustes mecanicos.','EQUIPO REPARADO\nSe realizo mantencion general y revision de puertos dejando equipo operativo.\nSerie original: 0\nSerie reversa: SW18BST021057\nTicket laboratorio: DOA-2527','Rodrigo Luna','2026-03-04 20:15:29'),(50,'DOA-2523','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Equipo irreparable en bodega',NULL,'','','','','2026-03-04','Impresora termica','Sewoo','SW19DST041800','LK-T200','','','',0,0,0,0,'','No Informada','Cabezal termico defectuoso, no imprime correctamente los caracteres, falta mantencion.','Para dejar maquina operativa es necesario cambiar cabezal\nSerie orginal: 0\nSerie reversa: SW19DST041800\nTicket laboratorio: DOA-2523','Rodrigo Luna','2026-03-04 21:12:18'),(51,'DOA-2528','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Equipo irreparable en bodega',NULL,'','','','','2026-03-06','Scanner','SmartSource','900376610','SSP1','','','',0,0,0,0,'','No informada','Equipo con daño fisico y problemas en mainboard.','Equipo irreparable\nSerie reversa: 900376610\nTicket laboratorio: DOA-2528','Rodrigo Luna','2026-03-06 12:13:05'),(52,'DOA-2529','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Equipo irreparable en bodega',NULL,'','','','','2026-03-06','Scanner','SmartSource','900311373','SSP1','','','',0,0,0,0,'','No informada','Equipo con daño fisico y problemas en mainboard.','Equipo irreparable\nSerie reversa: 900311373\nTicket laboratorio: DOA-2529','Rodrigo Luna','2026-03-06 12:17:06'),(53,'DOA-2530','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-06','','','','','2026-03-06','Scanner','SmartSource','900349161','SSP1','','','',0,0,0,0,'','No informada','Se realizo pruebas de lectura de datos y mantencion general al equipo.','Equipo reparado\nSerie original: 900349161\nTicket laboratorio: 2530','Rodrigo Luna','2026-03-06 12:28:47'),(54,'DOA-2531','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-06','','','','','2026-03-06','Scanner','SmartSoruce','900373209','SSP1','','','',0,0,0,0,'','No informada','Se realizo pruebas de lectura de datos y mantencion general al equipo.','Equipo reparado \nSerie reversa: 900373209\nTicket Laboratorio: 900373209','Rodrigo Luna','2026-03-06 12:33:32'),(55,'DOA-2532','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-06','','','','','2026-03-06','Lector de cheque','Uniform','207121200662','8310-50KR USB','','','',0,0,0,0,'','No informada','Se realizo pruebas de lectura de datos y mantencion general al equipo.','Equipo reparado\nSerie reversa: 207121200662\nTicket laboratorio: DOA-2532','Rodrigo Luna','2026-03-06 12:38:41'),(56,'DOA-2533','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Equipo irreparable en bodega',NULL,'','','','','2026-03-06','Lector de cheque','Uniform','70483','8310-50KR USB','','','',0,0,0,0,'','No informada','Puerto de red dañado, problemas con la lectura de datos.','Equipo irreparable\nSerie reversa: 70483\nTicket laboratorio: 2533','Rodrigo Luna','2026-03-06 12:44:32'),(57,'DOA-2534','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-06','','','','','2026-03-06','Lector de cheque','Uniform','207150500307','8310-50KR USB','','','',0,0,0,0,'','No informada','Se realizo pruebas de lectura de datos y mantencion general.','Equipo reparado\nSerie reversa: 207150500307\nDOA-2534','Rodrigo Luna','2026-03-06 12:50:31'),(58,'DOA-2535','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-06','','','','','2026-03-06','Lector de cheque ','Uniform','207180600644','8310-50KR USBs','','','',0,0,0,0,'','No informada','Se realizo pruebas de lectura de datos y mantencion general','Equipo reparado \nSerie reversa: 207180600644\nTicket laboratorio: DOA-2535','Rodrigo Luna','2026-03-06 12:53:58'),(61,'DOA-2536','Banco Estado','Rodrigo Luna','2026-03-09','NO','REPARACION','Reparado en bodega','2026-03-11','','','','','2026-03-11','Impresora Matriz','Olivetti','8103096','PR2-PLUS','','','',0,0,0,0,'','No informada','Falta mantencion general y pruebas de funcionamiento.','Maquina reparada\nSe realizan ajustes mecanicos, mantencion general y pruebas de funcionamiento dejando equipo operativo.\nSerie reversa: 8103096\nTicket Laboratorio: DOA-2536','Rodrigo Luna','2026-03-11 18:49:26'),(62,'DOA-2537','Banco Estado','Rodrigo Luna','2026-03-09','NO','REPARACION','Equipo irreparable en bodega',NULL,'','','','','2026-03-11','Impresora Termica','Olivetti','8103009','PR2-PLUS','','','',0,0,0,0,'','No informada','Problema en la toma de papel.','Equipo enviado a servicio externo\nSerie reversa: 8103009\nTicket laboratorio: DOA-2537','Rodrigo Luna','2026-03-11 18:55:55'),(63,'DOA-2538','Banco Estado','Rodrigo Luna','2026-03-09','NO','REPARACION','Equipo irreparable en bodega',NULL,'','','','','2026-03-11','Scanner','SmartSource','900377929','SSP1','','','',0,0,0,0,'','No informada','Equipo con daño fisico y problemas en la mainboard','Equipo irreparable\nSerie reversa: 900377929\nTicket laboratorio: DOA-2538','Rodrigo Luna','2026-03-11 19:05:13'),(64,'DOA-2539','Banco Estado ','Rodrigo Luna','2026-03-09','NO','REPARACION','Reparado en bodega','2026-03-11','','','','','2026-03-11','Scanner','SmartSource','900377912','SSP1','','','',0,0,0,0,'','No informada','Falta mantencion general y pruebas de funcionamiento.','Equipo reparado \nSe realizo mantencion general y pruebas de funcionamiento dejando equipo operativo.\nSerie reversa: 900377912\nTicket laboratorio: 2539','Rodrigo Luna','2026-03-11 19:09:18'),(65,'DOA-2540','Banco Estado','Rodrigo Luna','2026-03-09','NO','REPARACION','Reparado en bodega','2026-03-11','','','','','2026-03-11','Impresora termica','Sewoo','SW13089578','LK-T200','','','',0,0,0,0,'','No informada','Falta mantencion general y pruebas de funcionamiento','Equipo reparado\nSe realizo mantencion general y prueba de funcionamiento dejando equipo reparado.\nSerie reversa: SW13089578\nTicket laboratorio: DOA-2540','Rodrigo Luna','2026-03-11 19:16:22');
/*!40000 ALTER TABLE `ordenes_servicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','tecnico') DEFAULT 'tecnico',
  `activo` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `codigo_recuperacion` varchar(6) DEFAULT NULL,
  `fecha_codigo` timestamp NULL DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin','$2b$10$1y/.S7EWPwyN3kB6J906OeB9Gu4qyD6/IoDa7FOked/uj5kuuB6Oy','admin',1,'2026-03-12 15:40:39',NULL,NULL,'rodrigo.luna.analista@gmail.com'),(4,'rodrigo','$2b$10$RQDQWLcM14LHUaIcuVIzleZyGLkHaq0k016q1Ir113HdAoveY6rba','tecnico',1,'2026-03-12 19:03:45',NULL,NULL,'rluna.msys@gmail.com'),(5,'diego','$2b$10$BrP4VoUgX0Qb1/gUz75pU.3NIQ6Al2Prl0Km3BYadnaVuXRQeFUJC','tecnico',1,'2026-03-12 19:17:31',NULL,NULL,NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-13 17:03:45
