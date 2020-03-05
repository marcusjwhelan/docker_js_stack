CREATE DATABASE IF NOT EXISTS ctodo;

use ctodo;
/* for creating user */
CREATE USER 'test'@'%' IDENTIFIED BY 'example';
GRANT ALL PRIVILEGES ON ctodo.* TO 'test'@'%' WITH GRANT OPTION;
/* for root */
/* GRANT ALL PRIVILEGES ON ctodo.* TO 'root'@'%' IDENTIFIED BY PASSWORD 'example' WITH GRANT OPTION;*/
flush privileges;

/***CREATING ALL TABLES*/
CREATE TABLE `customers` (
  `id` int(111) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/* INSERT DATA */
LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (3,'test@email.com','test1',1),(4,'test@test.com','test2',1);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;
/******************************************************************/