-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.6-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6333
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for companydirectory
CREATE DATABASE IF NOT EXISTS `companydirectory` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `companydirectory`;

-- Dumping structure for table companydirectory.department
CREATE TABLE IF NOT EXISTS `department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `locationID` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- Dumping data for table companydirectory.department: ~13 rows (approximately)
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` (`id`, `name`, `locationID`) VALUES
	(1, 'Human Resources', 1),
	(2, 'Sales', 2),
	(3, 'Marketing', 2),
	(4, 'Legal', 1),
	(5, 'Services', 1),
	(6, 'Research and Development', 3),
	(7, 'Product Management', 3),
	(8, 'Training', 4),
	(9, 'Support', 4),
	(10, 'Engineering', 5),
	(11, 'Accounting', 5),
	(12, 'Business Development', 3);
/*!40000 ALTER TABLE `department` ENABLE KEYS */;

-- Dumping structure for table companydirectory.location
CREATE TABLE IF NOT EXISTS `location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Dumping data for table companydirectory.location: ~4 rows (approximately)
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` (`id`, `name`) VALUES
	(1, 'London'),
	(2, 'New York'),
	(3, 'Paris'),
	(4, 'Munich'),
	(5, 'Rome');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;

-- Dumping structure for table companydirectory.personnel
CREATE TABLE IF NOT EXISTS `personnel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `jobTitle` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `departmentID` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8;

-- Dumping data for table companydirectory.personnel: ~100 rows (approximately)
/*!40000 ALTER TABLE `personnel` DISABLE KEYS */;
INSERT INTO `personnel` (`id`, `firstName`, `lastName`, `jobTitle`, `email`, `departmentID`) VALUES
	(1, 'Robert', 'Heffron', '', 'rheffron0@ibm.com', 1),
	(2, 'Kris', 'Kovnot', '', 'kkovnot1@google.nl', 2),
	(3, 'Jim', 'Beam', '', 'jim.beam@example.com', 2),
    (4, 'Jack', 'Daniels', '', 'jack.daniels@example.com', 3),
    (5, 'Johnny', 'Walker', '', 'johnny.walker@example.com', 4),
    (6, 'Jill', 'Valentine', '', 'jill.valentine@example.com', 5),
    (7, 'Chris', 'Redfield', '', 'chris.redfield@example.com', 4),
    (8, 'Leon', 'Kennedy', '', 'leon.kennedy@example.com', 1),
    (9, 'Claire', 'Redfield', '', 'claire.redfield@example.com', 5),
    (10, 'Ada', 'Wong', '', 'ada.wong@example.com', 6),
    (11, 'Albert', 'Wesker', '', 'albert.wesker@example.com', 7),
    (12, 'Jill', 'Sandwich', '', 'jill.sandwich@example.com', 8),
    (13, 'Barry', 'Burton', '', 'barry.burton@example.com', 9),
    (14, 'Rebecca', 'Chambers', '', 'rebecca.chambers@example.com', 5),
    (15, 'Carlos', 'Oliveira', '', 'carlos.oliveira@example.com', 1),
    (16, 'Sheva', 'Alomar', '', 'sheva.alomar@example.com', 10),
    (17, 'Jake', 'Muller', '', 'jake.muller@example.com', 10),
    (18, 'Sherry', 'Birkin', '', 'sherry.birkin@example.com', 10),
    (19, 'Hunk', 'Unknown', '', 'hunk.unknown@example.com', 11),
    (20, 'Nemesis', 'STARS', '', 'nemesis.stars@example.com', 12),
	(21, 'Alex', 'Turner', '', 'alex.turner@fakemail.com', 1),
    (22, 'Mia', 'Wallace', '', 'mia.wallace@fakemail.com', 2),
    (23, 'Ethan', 'Hunt', '', 'ethan.hunt@fakemail.com', 2),
    (24, 'Lara', 'Croft', '', 'lara.croft@fakemail.com', 3),
    (25, 'Peter', 'Parker', '', 'peter.parker@fakemail.com', 4),
    (26, 'Bruce', 'Wayne', '', 'bruce.wayne@fakemail.com', 5),
    (27, 'Clark', 'Kent', '', 'clark.kent@fakemail.com', 4),
    (28, 'Diana', 'Prince', '', 'diana.prince@fakemail.com', 1),
    (29, 'Tony', 'Stark', '', 'tony.stark@fakemail.com', 5),
    (30, 'Natasha', 'Romanoff', '', 'natasha.romanoff@fakemail.com', 6),
    (31, 'Steve', 'Rogers', '', 'steve.rogers@fakemail.com', 7),
    (32, 'Nick', 'Fury', '', 'nick.fury@fakemail.com', 8),
    (33, 'Thor', 'Odinson', '', 'thor.odinson@fakemail.com', 9),
    (34, 'Loki', 'Laufeyson', '', 'loki.laufeyson@fakemail.com', 5),
    (35, 'Wanda', 'Maximoff', '', 'wanda.maximoff@fakemail.com', 1),
    (36, 'Vision', 'Synthezoid', '', 'vision.synthezoid@fakemail.com', 10),
    (37, 'Sam', 'Wilson', '', 'sam.wilson@fakemail.com', 10),
    (38, 'Bucky', 'Barnes', '', 'bucky.barnes@fakemail.com', 10),
    (39, 'Scott', 'Lang', '', 'scott.lang@fakemail.com', 11),
    (40, 'Hope', 'Van Dyne', '', 'hope.vandyne@fakemail.com', 12),
	(41, 'Harwell', 'Jefferys', '', 'hjefferys14@jimdo.com', 10),
	(42, 'Lanette', 'Buss', '', 'lbuss15@51.la', 4),
	(43, 'Lissie', 'Reddington', '', 'lreddington16@w3.org', 9),
	(44, 'Dore', 'Braidford', '', 'dbraidford17@google.com.br', 11),
	(45, 'Lizabeth', 'Di Franceshci', '', 'ldifranceshci18@mediafire.com', 8),
	(46, 'Felic', 'Sharland', '', 'fsharland19@myspace.com', 12),
	(47, 'Duff', 'Quail', '', 'dquail1a@vimeo.com', 9),
	(48, 'Brendis', 'Shivell', '', 'bshivell1b@un.org', 1),
	(49, 'Nevile', 'Schimaschke', '', 'nschimaschke1c@hexun.com', 10),
	(50, 'Jon', 'Calbaithe', '', 'jcalbaithe1d@netvibes.com', 4),
	(51, 'Emmery', 'Darben', '', 'edarben1e@mapquest.com', 10),
	(52, 'Staford', 'Whitesel', '', 'swhitesel1f@nasa.gov', 6),
	(53, 'Benjamin', 'Hawkslee', '', 'bhawkslee1g@hubpages.com', 7),
	(54, 'Myrle', 'Speer', '', 'mspeer1h@tripod.com', 3),
	(55, 'Matthus', 'Banfield', '', 'mbanfield1i@angelfire.com', 3),
	(56, 'Annadiana', 'Drance', '', 'adrance1j@omniture.com', 3),
	(57, 'Rinaldo', 'Fandrey', '', 'rfandrey1k@bbc.co.uk', 2),
	(58, 'Roanna', 'Standering', '', 'rstandering1l@cocolog-nifty.com', 3),
	(59, 'Lorrie', 'Fattorini', '', 'lfattorini1m@geocities.jp', 9),
	(60, 'Talbot', 'Andrassy', '', 'tandrassy1n@bigcartel.com', 4),
	(61, 'Cindi', 'Mannion', '', 'comannion1o@ameblo.jp', 11),
	(62, 'Pancho', 'Mullineux', '', 'pmullineux1p@webmd.com', 1),
	(63, 'Cynthy', 'Peyntue', '', 'cpeyntue1q@amazon.co.jp', 6),
	(64, 'Kristine', 'Christal', '', 'kchristal1r@behance.net', 8),
	(65, 'Dniren', 'Reboulet', '', 'dreboulet1s@360.cn', 7),
	(66, 'Aggy', 'Napier', '', 'anapier1t@sciencedirect.com', 3),
	(67, 'Gayleen', 'Hessay', '', 'ghessay1u@exblog.jp', 4),
	(68, 'Cull', 'Snoden', '', 'csnoden1v@so-net.ne.jp', 1),
	(69, 'Vlad', 'Crocombe', '', 'vcrocombe1w@mtv.com', 7),
	(70, 'Georgeanna', 'Joisce', '', 'gjoisce1x@google.com.au', 6),
	(71, 'Ursola', 'Berthomieu', '', 'uberthomieu1y@un.org', 4),
	(72, 'Mair', 'McKirdy', '', 'mmckirdy1z@ovh.net', 1),
	(73, 'Erma', 'Runnalls', '', 'erunnalls20@spiegel.de', 8),
	(74, 'Heida', 'Gallone', '', 'hgallone21@hostgator.com', 10),
	(75, 'Christina', 'Denge', '', 'cdenge22@canalblog.com', 12),
	(76, 'Wilone', 'Fredi', '', 'wfredi23@gizmodo.com', 7),
	(77, 'Stormie', 'Bolderstone', '', 'sbolderstone24@globo.com', 11),
	(78, 'Darryl', 'Pool', '', 'dpool25@vistaprint.com', 11),
	(79, 'Nikolas', 'Mager', '', 'nmager26@nifty.com', 5),
	(80, 'Brittney', 'Gaskal', '', 'bgaskal27@weather.com', 10),
	(81, 'Field', 'Gresty', '', 'fgresty28@networkadvertising.org', 4),
	(82, 'Martina', 'Tremoulet', '', 'mtremoulet29@sciencedaily.com', 3),
	(83, 'Robena', 'Ivanyutin', '', 'rivanyutin2a@mozilla.org', 2),
	(84, 'Reagen', 'Corner', '', 'rcorner2b@qq.com', 11),
	(85, 'Eveleen', 'Sulter', '', 'esulter2c@nature.com', 6),
	(86, 'Christy', 'Dunbobbin', '', 'cdunbobbin2d@feedburner.com', 8),
	(87, 'Winthrop', 'Lansley', '', 'wlansley2e@alibaba.com', 8),
	(88, 'Lissa', 'Insley', '', 'linsley2f@friendfeed.com', 3),
	(89, 'Shell', 'Risebarer', '', 'srisebarer2g@patch.com', 10),
	(90, 'Cherianne', 'Liddyard', '', 'cliddyard2h@com.com', 2),
	(91, 'Brendan', 'Fooks', '', 'bfooks2i@utexas.edu', 2),
	(92, 'Edmund', 'Tace', '', 'etace2j@hatena.ne.jp', 9),
	(93, 'Ki', 'Tomasini', '', 'ktomasini2k@cnbc.com', 10),
	(94, 'Chadd', 'McGettrick', '', 'cmcgettrick2l@simplemachines.org', 10),
	(95, 'Dulcie', 'Baudi', '', 'dbaudi2m@last.fm', 3),
	(96, 'Barnebas', 'Mowbray', '', 'bmowbray2n@cbslocal.com', 1),
	(97, 'Stefanie', 'Anker', '', 'sanker2o@hud.gov', 5),
	(98, 'Cherye', 'de Cullip', '', 'cdecullip2p@loc.gov', 10),
	(99, 'Sinclare', 'Deverall', '', 'sdeverall2q@ow.ly', 6),
	(100, 'Shae', 'Johncey', '', 'sjohncey2r@bluehost.com', 10);
/*!40000 ALTER TABLE `personnel` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
