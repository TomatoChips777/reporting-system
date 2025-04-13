-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 13, 2025 at 03:18 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lc-ticketing-db-2`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_admin_notifications`
--

CREATE TABLE `tbl_admin_notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_admin_notifications`
--

INSERT INTO `tbl_admin_notifications` (`id`, `user_id`, `report_id`, `title`, `message`, `is_read`, `created_at`) VALUES
(1, 2, 1, 'Maintenance Report', 'New report submitted  issue at Room 101 ', 1, '2025-03-31 01:02:47'),
(2, 2, 9, 'Maintenance Report', 'New report submitted  issue at Room 105', 1, '2025-03-31 03:46:50'),
(3, 2, 10, 'Maintenance Report', 'New report submitted  issue at Room 107', 1, '2025-03-31 03:47:11'),
(4, 2, 11, 'Maintenance Report', 'New report submitted  issue at Room 106', 1, '2025-03-31 03:47:26'),
(5, 2, 12, 'Maintenance Report', 'New report submitted  issue at Room 108', 1, '2025-03-31 03:47:43'),
(6, 2, 13, 'Maintenance Report', 'New report submitted  issue at Room 105', 1, '2025-03-31 05:06:29'),
(7, 2, 14, 'Maintenance Report', 'New report submitted  issue at Test', 1, '2025-04-06 00:41:29'),
(8, 2, 16, 'Maintenance Report', 'New report submitted  issue at test', 1, '2025-04-12 09:12:26'),
(9, 2, 20, 'Maintenance Report', 'New report submitted  issue at test123456', 1, '2025-04-12 10:55:13'),
(10, 2, 21, 'Maintenance Report', 'New report submitted  issue at test 123454', 1, '2025-04-12 10:58:04'),
(11, 2, 22, 'Reports', 'A new report has been submitted regarding an issue at Room 107.', 1, '2025-04-12 12:11:06'),
(12, 2, 22, 'Maintenance Report', 'New maintenance report at Room 107 for Plumbing (Urgent priority).', 1, '2025-04-12 12:11:31'),
(13, 2, 25, 'Lost And Found', 'New lost item reported: \"Purple Bag\" at Library.', 1, '2025-04-12 12:17:37'),
(14, 1, 26, 'Lost And Found', 'New lost item reported: \"Test\" at Test.', 1, '2025-04-12 13:21:24'),
(15, 2, 7, 'Lost and Found', 'Angelo cabase has sent a claim request for item ID 7.', 1, '2025-04-13 03:51:32'),
(16, 2, 7, 'Lost and Found', 'Angelo cabase has sent a claim request for \"found Blue Tumbler at Room 107\" (Ref.ID7).', 1, '2025-04-13 03:53:52'),
(17, 2, 7, 'Lost and Found', 'Angelo cabase has sent a claim request for \"found Blue Tumbler at Room 107\" (Ref.ID7).', 1, '2025-04-13 03:57:07'),
(18, 2, 7, 'Lost and Found', 'Angelo cabase has sent a claim request for \"found Blue Tumbler at Room 107\" (Ref.ID7).', 1, '2025-04-13 03:57:23'),
(19, 2, 6, 'Lost and Found', 'Angelo cabase has sent a claim request for \"found Iphone at Room 105\" (Ref.ID6).', 1, '2025-04-13 04:18:35'),
(20, 1, 27, 'Lost And Found', 'New found item reported: \"Test\" at test.', 1, '2025-04-13 04:29:39'),
(21, 2, 16, 'Lost and Found', 'Angelo cabase has sent a claim request for \"found Test at test\" (Ref.ID 16).', 1, '2025-04-13 04:29:58'),
(22, 2, 16, 'Lost and Found', 'Angelo cabase has sent a claim request for \"found Test at test\" (Ref.ID 16).', 1, '2025-04-13 04:30:08'),
(23, 2, 28, 'Reports', 'A new report has been submitted regarding an issue at Test.', 1, '2025-04-13 10:20:57'),
(24, 2, 28, 'Incident Report', 'New incident report at Test for Harassment (Medium priority).', 1, '2025-04-13 10:21:21'),
(25, 2, 16, 'Lost and Found', 'Angelo cabase has sent a claim request for \"found Test at test\" (Ref.ID 16).', 0, '2025-04-13 13:17:34');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_claims`
--

CREATE TABLE `tbl_claims` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `claimer_id` int(11) NOT NULL,
  `holder_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `status` enum('accepted','under_review','rejected') DEFAULT 'under_review',
  `remarks` enum('unclaimed','claimed') NOT NULL DEFAULT 'unclaimed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_claims`
--

INSERT INTO `tbl_claims` (`id`, `item_id`, `claimer_id`, `holder_id`, `description`, `status`, `remarks`, `created_at`) VALUES
(22, 7, 1, 2, 'Test', 'rejected', 'unclaimed', '2025-04-11 13:58:38'),
(23, 6, 2, 1, 'test', 'rejected', 'unclaimed', '2025-04-11 13:59:25'),
(24, 1, 1, 2, 'mine', 'rejected', 'unclaimed', '2025-04-12 01:10:36'),
(26, 1, 1, 2, '', 'rejected', 'unclaimed', '2025-04-12 01:31:31'),
(27, 4, 2, 1, '', 'rejected', 'unclaimed', '2025-04-12 01:52:05'),
(30, 9, 2, 1, 'test', 'rejected', 'unclaimed', '2025-04-12 10:25:29'),
(31, 1, 2, 1, 'tests', 'under_review', 'unclaimed', '2025-04-12 10:48:48'),
(32, 3, 1, 2, '', 'rejected', 'unclaimed', '2025-04-13 03:24:31'),
(35, 7, 2, 1, 'Mine', 'rejected', 'unclaimed', '2025-04-13 03:53:52'),
(36, 7, 2, 1, 'test', 'rejected', 'unclaimed', '2025-04-13 03:57:07'),
(37, 7, 2, 1, 'test', 'rejected', 'unclaimed', '2025-04-13 03:57:23'),
(38, 6, 2, 1, 'test', 'rejected', 'unclaimed', '2025-04-13 04:18:35'),
(39, 16, 2, 1, 'Mine', 'rejected', 'unclaimed', '2025-04-13 04:29:58'),
(40, 16, 2, 1, 'Mine 2', 'rejected', 'unclaimed', '2025-04-13 04:30:08'),
(41, 16, 2, 1, 'test', 'under_review', 'unclaimed', '2025-04-13 13:17:34');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_incident_reports`
--

CREATE TABLE `tbl_incident_reports` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `category` enum('Theft','Vandalism','Harassment','Bullying','Verbal abuse','Fire incident','Medical emergency','Cyberbullying','Property damage','Trespassing','Accident/Injury','Other') NOT NULL,
  `priority` enum('Low','Medium','High','Urgent') DEFAULT 'Medium',
  `assigned_staff` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_incident_reports`
--

INSERT INTO `tbl_incident_reports` (`id`, `report_id`, `category`, `priority`, `assigned_staff`) VALUES
(1, 28, 'Harassment', 'Medium', '');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_lost_found`
--

CREATE TABLE `tbl_lost_found` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `type` enum('lost','found') NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `date_reported` datetime DEFAULT current_timestamp(),
  `status` enum('open','closed','claimed') DEFAULT 'open',
  `image_path` varchar(255) DEFAULT NULL,
  `contact_info` varchar(255) DEFAULT NULL,
  `is_anonymous` tinyint(1) DEFAULT 0,
  `archived` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_lost_found`
--

INSERT INTO `tbl_lost_found` (`id`, `user_id`, `report_id`, `type`, `item_name`, `category`, `description`, `location`, `date_reported`, `status`, `image_path`, `contact_info`, `is_anonymous`, `archived`) VALUES
(1, 1, 2, 'found', 'Backpack', 'bag', 'Found a backpack at room 102', 'Room 102', '2025-03-31 09:08:56', 'open', NULL, '', 1, 0),
(2, 2, 3, 'lost', 'Iphone', 'accessories', 'Iphone with black color with stickers', 'Room 105', '2025-03-31 09:16:57', 'open', NULL, '', 0, 0),
(3, 2, 4, 'lost', 'Tumbler', 'accessories', 'Lost my tumbler i think around room 107', 'Room 107', '2025-03-31 09:20:22', 'open', NULL, '', 1, 0),
(4, 2, 5, 'lost', 'Envelopes', 'stationery', 'Found envelops around library', 'Library', '2025-03-31 09:22:34', 'open', NULL, '', 0, 0),
(5, 2, 6, 'found', 'Mobile Phone', 'accessories', 'Found mobile phone at room 102', 'Room 102', '2025-03-31 09:24:04', 'open', NULL, '', 0, 0),
(6, 1, 7, 'found', 'Iphone', 'accessories', 'Found Iphone at room 105', 'Room 105', '2025-03-31 09:40:39', 'open', NULL, '', 1, 0),
(7, 1, 8, 'found', 'Blue Tumbler', 'other', 'Found Blue tumbler at room 107', 'Room 107', '2025-03-31 09:52:55', 'open', NULL, '', 0, 0),
(8, 2, 15, 'found', 'Bag', 'bag', 'Bags', 'room 101', '2025-04-12 16:57:38', 'open', NULL, '', 0, 0),
(9, 1, 17, 'lost', 'test', 'electronics', 'test', 'test', '2025-04-12 18:11:24', 'open', NULL, '', 0, 0),
(10, 2, 18, 'lost', 'test', 'accessories', 'test', 'test', '2025-04-12 18:26:12', 'open', NULL, 'tests', 0, 0),
(11, 2, 19, 'lost', 'test', 'clothing', 'tests', 'test', '2025-04-12 18:29:44', 'open', NULL, '', 0, 0),
(12, 2, 23, 'lost', 'Bag', 'bag', 'Red sling bag', 'library', '2025-04-12 20:13:51', 'open', NULL, 'sample@gmail.com', 0, 0),
(13, 2, 24, 'lost', 'Bag', 'bag', 'Red sling bag', 'Library', '2025-04-12 20:14:41', 'open', NULL, 'sample@gmail.com', 0, 0),
(14, 2, 25, 'lost', 'Purple Bag', 'bag', 'A purple bag with a water bottle', 'Library', '2025-04-12 20:17:37', 'open', NULL, 'yahoo@gmail.com', 0, 0),
(15, 1, 26, 'lost', 'Test', 'accessories', 'Test', 'Test', '2025-04-12 21:21:24', 'open', NULL, '', 0, 0),
(16, 1, 27, 'found', 'Test', 'electronics', 'test', 'test', '2025-04-13 12:29:39', 'open', NULL, 'test', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_maintenance_reports`
--

CREATE TABLE `tbl_maintenance_reports` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `category` enum('Electrical','Plumbing','Cleaning','General Repair','Other') NOT NULL,
  `priority` enum('Low','Medium','High','Urgent') DEFAULT 'Medium',
  `assigned_staff` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_maintenance_reports`
--

INSERT INTO `tbl_maintenance_reports` (`id`, `report_id`, `category`, `priority`, `assigned_staff`) VALUES
(1, 1, 'Electrical', 'Medium', ''),
(2, 12, 'Cleaning', 'Medium', ''),
(3, 11, 'General Repair', 'Urgent', ''),
(4, 10, 'Plumbing', 'Medium', ''),
(5, 9, 'Electrical', 'Medium', ''),
(6, 13, 'General Repair', 'Urgent', ''),
(7, 14, 'Plumbing', 'Low', 'yes'),
(9, 16, 'Other', 'Low', ''),
(10, 22, 'Plumbing', 'Urgent', '');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_messages`
--

CREATE TABLE `tbl_messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `report_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `message_session_id` int(11) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `action` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_messages`
--

INSERT INTO `tbl_messages` (`id`, `sender_id`, `receiver_id`, `message`, `image_path`, `report_id`, `created_at`, `updated_at`, `message_session_id`, `status`, `action`) VALUES
(1, 1, 2, 'Test message', NULL, 1, '2025-03-31 01:04:08', '2025-04-10 11:28:04', 1, 'read', ''),
(2, 1, 2, 'Test message 2', NULL, 1, '2025-03-31 01:04:19', '2025-04-10 11:28:04', 1, 'read', ''),
(3, 1, 2, 'Test message 3', NULL, 1, '2025-03-31 01:04:28', '2025-04-10 11:28:04', 1, 'read', ''),
(4, 1, 2, 'Test message 4', NULL, 1, '2025-03-31 01:04:49', '2025-04-10 11:28:04', 1, 'read', ''),
(5, 1, 2, 'Test message 5', NULL, 1, '2025-03-31 01:04:56', '2025-04-10 11:28:04', 1, 'read', ''),
(6, 2, 1, 'goodmorning', NULL, 1, '2025-03-31 01:47:58', '2025-04-10 11:09:47', 1, 'read', ''),
(7, 2, 1, 'Test message', NULL, 1, '2025-03-31 01:48:24', '2025-04-10 11:09:47', 1, 'read', ''),
(8, 2, 1, 'Test message 2', NULL, 1, '2025-03-31 01:48:32', '2025-04-10 11:09:47', 1, 'read', ''),
(10, 1, 2, 'Test message from lost and found', NULL, 6, '2025-03-31 01:49:21', '2025-04-10 11:24:10', 3, 'read', ''),
(11, 2, 1, 'check mic', NULL, 6, '2025-03-31 01:50:06', '2025-04-10 11:09:44', 3, 'read', ''),
(13, 2, 1, 'Test', NULL, 7, '2025-03-31 01:51:51', '2025-04-10 11:09:45', 4, 'read', ''),
(15, 1, 2, 'Test from lost and found dashboard', NULL, 6, '2025-03-31 02:05:50', '2025-04-10 11:24:10', 3, 'read', ''),
(16, 2, 1, 'test', NULL, 6, '2025-03-31 02:05:57', '2025-04-10 11:09:44', 3, 'read', ''),
(17, 1, 2, 'test', NULL, 6, '2025-03-31 02:06:03', '2025-04-10 11:24:10', 3, 'read', ''),
(18, 1, 2, 'Test 2', NULL, 6, '2025-03-31 02:06:13', '2025-04-10 11:24:10', 3, 'read', ''),
(19, 2, 1, 'Hello world', NULL, 6, '2025-03-31 02:46:36', '2025-04-10 11:09:44', 3, 'read', ''),
(20, 1, 2, 'localhost', NULL, 6, '2025-03-31 02:48:08', '2025-04-10 11:24:10', 3, 'read', ''),
(21, 1, 2, 'localhost:5000', NULL, 6, '2025-03-31 02:48:19', '2025-04-10 11:24:10', 3, 'read', ''),
(22, 1, 2, 'api/message/get-messages/2', NULL, 6, '2025-03-31 02:48:36', '2025-04-10 11:24:10', 3, 'read', ''),
(23, 1, 2, '`${data}``````', NULL, 6, '2025-03-31 02:48:59', '2025-04-10 11:24:10', 3, 'read', ''),
(24, 2, 1, '????', NULL, 6, '2025-03-31 02:49:36', '2025-04-10 11:09:44', 3, 'read', ''),
(25, 2, 1, '????????????????????????????????????????????????????????', NULL, 6, '2025-03-31 02:49:41', '2025-04-10 11:09:44', 3, 'read', ''),
(26, 2, 1, 'test', NULL, 6, '2025-03-31 03:01:01', '2025-04-10 11:09:44', 3, 'read', ''),
(27, 1, 2, '<><><><><><><><><><><><>><><><><>><<>', NULL, 6, '2025-03-31 03:01:13', '2025-04-10 11:24:10', 3, 'read', ''),
(28, 2, 1, 'aaaaaaaaaaaaaaaaaaaaaaaaaa', NULL, 6, '2025-03-31 03:01:17', '2025-04-10 11:09:44', 3, 'read', ''),
(29, 2, 1, 'Message test', NULL, 7, '2025-03-31 03:08:25', '2025-04-10 11:09:45', 4, 'read', ''),
(30, 2, 1, '', '1743390515772.jpg', 6, '2025-03-31 03:08:35', '2025-04-10 11:09:44', 3, 'read', ''),
(31, 2, 1, 'Message text', NULL, 1, '2025-03-31 03:08:47', '2025-04-10 11:09:47', 1, 'read', ''),
(32, 2, 1, 'Messages count', NULL, 1, '2025-03-31 03:10:44', '2025-04-10 11:09:47', 1, 'read', ''),
(33, 1, 2, 'test', NULL, 1, '2025-03-31 05:37:01', '2025-04-10 11:28:04', 1, 'read', ''),
(34, 1, 2, 'aa', NULL, 6, '2025-03-31 05:50:59', '2025-04-10 11:24:10', 3, 'read', ''),
(35, 1, 2, 'Requesting to claim this item', NULL, 6, '2025-03-31 05:54:34', '2025-04-10 11:24:10', 3, 'read', ''),
(36, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 05:54:51', '2025-04-10 11:09:44', 3, 'read', ''),
(37, 1, 2, 'Requesting to claim this item', NULL, 6, '2025-03-31 05:55:39', '2025-04-10 11:24:10', 3, 'read', ''),
(38, 2, 1, 'Requesting to claim this item', NULL, 6, '2025-03-31 05:55:48', '2025-04-10 11:09:44', 3, 'read', ''),
(39, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-03-31 05:56:01', '2025-04-10 11:24:10', 3, 'read', ''),
(40, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 05:56:12', '2025-04-10 11:09:44', 3, 'read', ''),
(41, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 05:58:15', '2025-04-10 11:09:44', 3, 'read', ''),
(42, 2, 1, 'senderId.', NULL, 6, '2025-03-31 05:59:35', '2025-04-10 11:09:44', 3, 'read', ''),
(43, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 05:59:42', '2025-04-10 11:09:44', 3, 'read', ''),
(44, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:00:09', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(45, 1, 2, 'test', NULL, 6, '2025-03-31 06:14:04', '2025-04-10 11:24:10', 3, 'read', ''),
(46, 2, 1, 'test', NULL, 6, '2025-03-31 06:14:41', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(47, 1, 2, 'test', NULL, 6, '2025-03-31 06:15:14', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(48, 2, 1, 'adad', NULL, 6, '2025-03-31 06:44:19', '2025-04-10 11:09:44', 3, 'read', NULL),
(49, 2, 1, 'test', NULL, 6, '2025-03-31 06:44:26', '2025-04-10 11:09:44', 3, 'read', NULL),
(50, 2, 1, 'www', NULL, 6, '2025-03-31 06:44:28', '2025-04-10 11:09:44', 3, 'read', NULL),
(51, 2, 1, 'a', NULL, 6, '2025-03-31 06:44:29', '2025-04-10 11:09:44', 3, 'read', NULL),
(52, 2, 1, 's', NULL, 6, '2025-03-31 06:44:30', '2025-04-10 11:09:44', 3, 'read', NULL),
(53, 2, 1, 'd', NULL, 6, '2025-03-31 06:44:31', '2025-04-10 11:09:44', 3, 'read', NULL),
(54, 2, 1, 'e', NULL, 6, '2025-03-31 06:44:32', '2025-04-10 11:09:44', 3, 'read', NULL),
(55, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:54:05', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(56, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:54:24', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(57, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:54:58', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(58, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:32', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(59, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:39', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(60, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:44', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(61, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:45', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(62, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:45', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(63, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:46', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(64, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:46', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(65, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:46', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(66, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:46', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(67, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:46', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(68, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:57:20', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(69, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:57:59', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(70, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 07:04:02', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(71, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 07:04:07', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(72, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 07:07:16', '2025-04-10 11:09:44', 3, 'read', 'claim'),
(73, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:08:38', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(74, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:16:51', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(75, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:18:13', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(76, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:25:40', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(77, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:27:51', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(78, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:35:35', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(79, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:08', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(80, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:15', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(81, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:15', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(82, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:15', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(83, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:15', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(84, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:15', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(85, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:15', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(86, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:16', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(87, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:16', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(88, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:16', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(89, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:16', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(90, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:16', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(91, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:17', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(92, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:17', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(93, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:17', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(94, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:17', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(95, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:23', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(96, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:24', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(97, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:24', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(98, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:24', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(99, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:25', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(100, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:25', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(101, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:25', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(102, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:26', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(103, 1, 2, 'test', NULL, 1, '2025-03-31 07:38:28', '2025-04-10 11:28:04', 1, 'read', NULL),
(104, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:28', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(105, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:29', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(106, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:29', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(107, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:30', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(108, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:30', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(109, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:30', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(110, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:31', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(111, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:31', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(112, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:31', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(113, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:32', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(114, 1, 2, 'test', NULL, 1, '2025-03-31 07:38:34', '2025-04-10 11:28:04', 1, 'read', NULL),
(115, 1, 2, '', '1743406719156.jpg', 1, '2025-03-31 07:38:39', '2025-04-10 11:28:04', 1, 'read', NULL),
(116, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:39', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(117, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:40', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(118, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:41', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(119, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:41', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(120, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:42', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(121, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:42', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(122, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:43:04', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(123, 2, 1, 'test', NULL, 1, '2025-03-31 07:43:40', '2025-04-10 11:09:47', 1, 'read', NULL),
(124, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:43:51', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(125, 2, 1, 'A', NULL, 1, '2025-03-31 08:07:02', '2025-04-10 11:09:47', 1, 'read', NULL),
(126, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 08:07:05', '2025-04-10 11:28:04', 1, 'read', 'claim'),
(127, 2, 1, 'show proof that this item is belong to you', NULL, 1, '2025-03-31 08:08:06', '2025-04-10 11:09:47', 1, 'read', NULL),
(128, 2, 1, 'Requesting to claim this item.', NULL, 1, '2025-03-31 08:23:26', '2025-04-10 11:09:47', 1, 'read', 'claim'),
(129, 1, 2, 'Thanks for notifying us, Our team is on progress', NULL, 6, '2025-04-06 00:11:01', '2025-04-10 11:24:10', 3, 'read', NULL),
(130, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:11:12', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(131, 1, 1, 'Test', NULL, 8, '2025-04-06 00:11:52', '2025-04-13 01:01:03', 8, 'read', NULL),
(132, 2, 1, 'Requesting to claim this item.', NULL, 7, '2025-04-06 00:17:52', '2025-04-10 11:09:45', 4, 'read', 'claim'),
(133, 2, 1, 'Requesting to claim this item.', NULL, 1, '2025-04-06 00:18:18', '2025-04-10 11:09:47', 1, 'read', 'claim'),
(134, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:20:11', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(135, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:25:30', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(136, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:25:46', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(137, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:26:07', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(138, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:26:08', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(139, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:26:09', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(140, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:26:09', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(141, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:36', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(142, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:37', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(143, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:38', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(144, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:38', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(145, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:39', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(146, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:40', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(147, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:40', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(148, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:40', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(149, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:40', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(150, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:40', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(151, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:40', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(152, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:41', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(153, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:41', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(154, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:41', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(155, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:41', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(156, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:41', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(157, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:42', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(158, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:42', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(159, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:42', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(160, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:42', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(161, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:42', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(162, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:42', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(163, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:55', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(164, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:55', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(165, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:55', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(166, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:56', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(167, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:56', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(168, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:56', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(169, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:56', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(170, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:56', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(171, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:57', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(172, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:57', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(173, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:57', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(174, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:57', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(175, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:57', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(176, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:58', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(177, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:58', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(178, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:58', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(179, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:58', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(180, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:59', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(181, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:59', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(182, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:59', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(183, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:59', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(184, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:27:59', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(185, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:28:00', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(186, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:28:00', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(187, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:28:00', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(188, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:28:00', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(189, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:28:00', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(190, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:28:00', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(191, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:28:01', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(192, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:28:01', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(193, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:28:01', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(194, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:28:01', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(195, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:28:01', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(196, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 00:28:02', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(197, 2, 1, 'Requesting to claim this item.', NULL, 1, '2025-04-06 00:39:08', '2025-04-10 11:09:47', 1, 'read', 'claim'),
(198, 1, 2, 'Test', NULL, 14, '2025-04-06 00:42:01', '2025-04-13 11:52:06', 9, 'read', NULL),
(199, 2, 1, 'Requesting to claim this item.', NULL, 1, '2025-04-06 00:45:48', '2025-04-10 11:09:47', 1, 'read', 'claim'),
(200, 2, 1, 'Requesting to claim this item.', NULL, 1, '2025-04-06 00:45:55', '2025-04-10 11:09:47', 1, 'read', 'claim'),
(201, 2, 1, 'Requesting to claim this item.', NULL, 1, '2025-04-06 00:46:06', '2025-04-10 11:09:47', 1, 'read', 'claim'),
(202, 2, 1, 'Requesting to claim this item.', NULL, 1, '2025-04-06 00:46:08', '2025-04-10 11:09:47', 1, 'read', 'claim'),
(203, 2, 1, 'Requesting to claim this item.', NULL, 7, '2025-04-06 01:02:38', '2025-04-10 11:09:45', 4, 'read', 'claim'),
(204, 2, 1, 'Requesting to claim this item.', NULL, 1, '2025-04-06 01:02:41', '2025-04-10 11:09:47', 1, 'read', 'claim'),
(205, 2, 1, 'Requesting to claim this item.', NULL, 7, '2025-04-06 01:10:16', '2025-04-10 11:09:45', 4, 'read', 'claim'),
(206, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:10:34', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(207, 1, 2, 'tet', NULL, 1, '2025-04-06 01:10:44', '2025-04-10 11:28:04', 1, 'read', NULL),
(208, 2, 1, 'test', NULL, 1, '2025-04-06 01:10:48', '2025-04-10 11:09:47', 1, 'read', NULL),
(209, 2, 1, 'adadad', NULL, 1, '2025-04-06 01:10:55', '2025-04-10 11:09:47', 1, 'read', NULL),
(210, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:11:08', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(211, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:16:24', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(212, 2, 1, 'test', NULL, 6, '2025-04-06 01:16:31', '2025-04-10 11:09:44', 3, 'read', NULL),
(213, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:16:33', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(214, 2, 1, 'test', NULL, 6, '2025-04-06 01:16:35', '2025-04-10 11:09:44', 3, 'read', NULL),
(215, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:16:36', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(216, 2, 1, 'hello world', NULL, 6, '2025-04-06 01:16:41', '2025-04-10 11:09:44', 3, 'read', NULL),
(217, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:16:43', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(218, 1, 2, 'test', NULL, 6, '2025-04-06 01:16:45', '2025-04-10 11:24:10', 3, 'read', NULL),
(219, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:16:50', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(220, 2, 1, 'aasda', NULL, 6, '2025-04-06 01:16:54', '2025-04-10 11:09:44', 3, 'read', NULL),
(221, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:16:55', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(222, 2, 1, 'yes', NULL, 6, '2025-04-06 01:17:38', '2025-04-10 11:09:44', 3, 'read', NULL),
(223, 1, 2, 'hey', NULL, 6, '2025-04-06 01:17:45', '2025-04-10 11:24:10', 3, 'read', NULL),
(224, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:47', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(225, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:47', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(226, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:47', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(227, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:48', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(228, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:48', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(229, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:48', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(230, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:48', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(231, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:48', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(232, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:49', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(233, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:49', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(234, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:49', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(235, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:49', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(236, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:49', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(237, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:50', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(238, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:50', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(239, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:50', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(240, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:50', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(241, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:50', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(242, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:51', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(243, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:51', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(244, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:51', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(245, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:51', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(246, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:51', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(247, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-04-06 01:17:52', '2025-04-10 11:24:10', 3, 'read', 'claim'),
(248, 1, 2, 'Hello Wolrd', NULL, 14, '2025-04-06 01:36:28', '2025-04-13 11:52:06', 9, 'read', NULL),
(249, 1, 2, 'test', NULL, 6, '2025-04-06 01:40:28', '2025-04-10 11:24:10', 3, 'read', NULL),
(250, 1, 2, 'adad', NULL, 6, '2025-04-06 01:40:34', '2025-04-10 11:24:10', 3, 'read', NULL),
(251, 1, 2, 'a', NULL, 6, '2025-04-06 01:40:42', '2025-04-10 11:24:10', 3, 'read', NULL),
(252, 2, 1, 's', NULL, 6, '2025-04-06 01:40:46', '2025-04-10 11:09:44', 3, 'read', NULL),
(253, 2, 1, 'Requesting to claim this item.', NULL, 7, '2025-04-06 01:49:49', '2025-04-10 11:09:45', 4, 'read', 'claim'),
(254, 2, 1, 'Requesting to claim this item.', NULL, 7, '2025-04-06 01:49:52', '2025-04-10 11:09:45', 4, 'read', 'claim'),
(255, 2, 1, 'Requesting to claim this item.', NULL, 7, '2025-04-06 01:49:57', '2025-04-10 11:09:45', 4, 'read', 'claim'),
(256, 1, 2, 'w', NULL, 6, '2025-04-06 10:19:10', '2025-04-10 11:24:10', 3, 'read', NULL),
(257, 2, 1, 'test', NULL, 7, '2025-04-10 11:10:50', '2025-04-10 11:11:27', 4, 'read', NULL),
(258, 2, 1, 'test', NULL, 7, '2025-04-10 11:24:23', '2025-04-12 05:51:20', 4, 'read', NULL),
(259, 2, 1, 'test', NULL, 7, '2025-04-10 11:24:31', '2025-04-12 05:51:20', 4, 'read', NULL),
(260, 2, 1, 'hello world', NULL, 7, '2025-04-10 11:24:41', '2025-04-12 05:51:20', 4, 'read', NULL),
(261, 2, 1, 'test', NULL, 7, '2025-04-10 11:24:56', '2025-04-12 05:51:20', 4, 'read', NULL),
(262, 2, 1, 'hwllo', NULL, 7, '2025-04-10 11:25:06', '2025-04-12 05:51:20', 4, 'read', NULL),
(263, 2, 1, 'adad', NULL, 7, '2025-04-10 11:25:08', '2025-04-12 05:51:20', 4, 'read', NULL),
(264, 2, 1, 'aaa', NULL, 7, '2025-04-10 11:25:10', '2025-04-12 05:51:20', 4, 'read', NULL),
(265, 2, 1, 'test', NULL, 7, '2025-04-10 11:34:02', '2025-04-12 05:51:20', 4, 'read', NULL),
(266, 2, 1, 'hello world', NULL, 7, '2025-04-10 11:34:15', '2025-04-12 05:51:20', 4, 'read', NULL),
(267, 2, 1, 'test', NULL, 6, '2025-04-10 11:40:54', '2025-04-12 03:37:05', 3, 'read', NULL),
(268, 2, 1, 'test', NULL, 1, '2025-04-10 11:40:59', '2025-04-10 12:32:43', 1, 'read', NULL),
(269, 2, 1, 'test', NULL, 1, '2025-04-10 11:41:26', '2025-04-10 12:32:43', 1, 'read', NULL),
(270, 2, 1, 'aaa', NULL, 1, '2025-04-10 11:41:33', '2025-04-10 12:32:43', 1, 'read', NULL),
(271, 2, 1, 'aaa', NULL, 1, '2025-04-10 11:41:59', '2025-04-10 12:32:43', 1, 'read', NULL),
(272, 2, 1, 'test', NULL, 1, '2025-04-10 11:47:49', '2025-04-10 12:32:43', 1, 'read', NULL),
(273, 2, 1, 'meow', NULL, 1, '2025-04-10 11:48:00', '2025-04-10 12:32:43', 1, 'read', NULL),
(274, 2, 1, 'aadadsa', NULL, 1, '2025-04-10 11:48:02', '2025-04-10 12:32:43', 1, 'read', NULL),
(275, 2, 1, 'aadadas', NULL, 1, '2025-04-10 11:48:05', '2025-04-10 12:32:43', 1, 'read', NULL),
(276, 2, 1, 'aaaa', NULL, 1, '2025-04-10 11:48:08', '2025-04-10 12:32:43', 1, 'read', NULL),
(277, 2, 1, 'a', NULL, 1, '2025-04-10 11:52:42', '2025-04-10 12:32:43', 1, 'read', NULL),
(278, 2, 1, 'a', NULL, 1, '2025-04-10 11:52:45', '2025-04-10 12:32:43', 1, 'read', NULL),
(279, 2, 1, 'a', NULL, 1, '2025-04-10 11:52:49', '2025-04-10 12:32:43', 1, 'read', NULL),
(282, 1, 2, 'test', NULL, 5, '2025-04-12 01:58:28', '2025-04-12 03:37:28', 20, 'read', NULL),
(283, 1, 2, '1', NULL, 6, '2025-04-12 03:37:17', '2025-04-12 07:02:11', 3, 'read', NULL),
(284, 1, 2, '1', NULL, 6, '2025-04-12 03:37:17', '2025-04-12 07:02:11', 3, 'read', NULL),
(285, 2, 1, '1', NULL, 5, '2025-04-12 03:37:30', '2025-04-12 06:00:26', 20, 'read', NULL),
(286, 2, 1, '111', NULL, 1, '2025-04-12 03:37:39', '2025-04-12 06:00:26', 1, 'read', NULL),
(287, 2, 1, 'aadas', NULL, 5, '2025-04-12 03:37:49', '2025-04-12 06:00:26', 20, 'read', NULL),
(288, 2, 1, 'aaa', NULL, 5, '2025-04-12 03:37:50', '2025-04-12 06:00:26', 20, 'read', NULL),
(289, 2, 1, 'ds', NULL, 5, '2025-04-12 03:37:50', '2025-04-12 06:00:26', 20, 'read', NULL),
(290, 2, 1, 'd', NULL, 5, '2025-04-12 03:37:50', '2025-04-12 06:00:26', 20, 'read', NULL),
(291, 2, 1, 'd', NULL, 5, '2025-04-12 03:37:50', '2025-04-12 06:00:26', 20, 'read', NULL),
(292, 2, 1, 'd', NULL, 5, '2025-04-12 03:37:51', '2025-04-12 06:00:26', 20, 'read', NULL),
(293, 2, 1, 'dasd', NULL, 5, '2025-04-12 03:37:51', '2025-04-12 06:00:26', 20, 'read', NULL),
(294, 2, 1, 'dsad', NULL, 5, '2025-04-12 03:37:51', '2025-04-12 06:00:26', 20, 'read', NULL),
(295, 2, 1, 'dsadasd', NULL, 5, '2025-04-12 03:37:52', '2025-04-12 06:00:26', 20, 'read', NULL),
(296, 2, 1, 's', NULL, 5, '2025-04-12 03:37:52', '2025-04-12 06:00:26', 20, 'read', NULL),
(297, 2, 1, 's', NULL, 5, '2025-04-12 03:37:52', '2025-04-12 06:00:26', 20, 'read', NULL),
(298, 2, 1, 'dsadd', NULL, 5, '2025-04-12 03:37:52', '2025-04-12 06:00:26', 20, 'read', NULL),
(299, 1, 2, 'is this yours?', NULL, 8, '2025-04-12 04:52:43', '2025-04-12 04:53:26', 21, 'read', NULL),
(300, 2, 1, 'yes sir i have a proof this is mine ', '1744433636215.png', 8, '2025-04-12 04:53:56', '2025-04-12 04:54:07', 21, 'read', NULL),
(301, 1, 2, 'test', NULL, 8, '2025-04-12 05:50:55', '2025-04-12 06:12:13', 21, 'read', NULL),
(302, 1, 2, 'test', NULL, 7, '2025-04-12 05:51:16', '2025-04-12 05:51:51', 4, 'read', NULL),
(303, 1, 2, 'Please have proof', NULL, 7, '2025-04-12 05:51:43', '2025-04-12 05:51:51', 4, 'read', NULL),
(304, 1, 2, 'You can now claimed your lost item at office 101', NULL, 7, '2025-04-12 05:53:03', '2025-04-12 06:02:03', 4, 'read', NULL),
(305, 1, 2, 'test', NULL, 7, '2025-04-12 05:57:49', '2025-04-12 06:02:03', 4, 'read', NULL),
(306, 1, 2, 'test', NULL, 7, '2025-04-12 06:01:32', '2025-04-12 06:02:03', 4, 'read', NULL),
(307, 1, 2, 'test', NULL, 7, '2025-04-12 06:02:27', '2025-04-12 06:02:37', 4, 'read', NULL),
(308, 1, 2, '12345', NULL, 7, '2025-04-12 06:02:33', '2025-04-12 06:02:37', 4, 'read', NULL),
(309, 2, 1, 'test', NULL, 7, '2025-04-12 06:02:37', '2025-04-12 06:20:52', 4, 'read', NULL),
(310, 2, 1, 'aasda', NULL, 7, '2025-04-12 06:02:41', '2025-04-12 06:20:52', 4, 'read', NULL),
(311, 2, 1, 'restr', NULL, 7, '2025-04-12 06:12:10', '2025-04-12 06:20:52', 4, 'read', NULL),
(312, 2, 1, 'test', NULL, 7, '2025-04-12 06:12:29', '2025-04-12 06:20:52', 4, 'read', NULL),
(313, 2, 1, 'test', NULL, 7, '2025-04-12 06:12:34', '2025-04-12 06:20:52', 4, 'read', NULL),
(314, 2, 1, 'sss', NULL, 7, '2025-04-12 06:12:37', '2025-04-12 06:20:52', 4, 'read', NULL),
(315, 1, 2, 'aa', NULL, 7, '2025-04-12 06:20:56', '2025-04-12 06:24:32', 4, 'read', NULL),
(316, 1, 2, 'test', NULL, 7, '2025-04-12 06:24:30', '2025-04-12 06:24:32', 4, 'read', NULL),
(317, 2, 1, 'test', NULL, 7, '2025-04-12 06:24:41', '2025-04-12 06:24:41', 4, '', NULL),
(318, 2, 1, 'test', NULL, 7, '2025-04-12 06:24:44', '2025-04-12 06:24:44', 4, '', NULL),
(319, 1, 2, 'test', NULL, 7, '2025-04-12 06:29:05', '2025-04-12 06:29:22', 4, 'read', NULL),
(320, 2, 1, 'test', NULL, 7, '2025-04-12 06:29:25', '2025-04-12 06:29:25', 4, '', NULL),
(321, 2, 1, 'tes', NULL, 7, '2025-04-12 06:34:26', '2025-04-12 06:34:26', 4, '', NULL),
(322, 2, 1, 'test', NULL, 7, '2025-04-12 06:38:23', '2025-04-12 06:38:23', 4, '', NULL),
(323, 2, 1, 't', NULL, 7, '2025-04-12 06:38:25', '2025-04-12 06:38:25', 4, '', NULL),
(324, 2, 1, 'test', NULL, 7, '2025-04-12 06:39:53', '2025-04-12 06:39:53', 4, '', NULL),
(325, 2, 1, 'test', NULL, 7, '2025-04-12 06:39:54', '2025-04-12 06:39:54', 4, '', NULL),
(326, 2, 1, 'test', NULL, 7, '2025-04-12 07:01:55', '2025-04-12 07:01:55', 4, '', NULL),
(327, 2, 1, 'test', NULL, 7, '2025-04-12 07:02:48', '2025-04-12 07:02:48', 4, '', NULL),
(328, 2, 1, 'hellowolrd', NULL, 7, '2025-04-12 07:02:58', '2025-04-12 07:02:58', 4, '', NULL),
(329, 1, 2, 'test', NULL, 6, '2025-04-12 07:05:19', '2025-04-12 07:05:35', 3, 'read', NULL),
(330, 1, 2, 'test', NULL, 6, '2025-04-12 07:05:24', '2025-04-12 07:05:35', 3, 'read', NULL),
(331, 2, 1, 'test', NULL, 6, '2025-04-12 07:05:38', '2025-04-12 07:05:41', 3, 'read', NULL),
(332, 1, 2, 'est', NULL, 6, '2025-04-12 07:05:43', '2025-04-12 07:05:43', 3, '', NULL),
(333, 1, 2, 'test', NULL, 5, '2025-04-12 07:07:10', '2025-04-12 07:15:41', 20, 'read', NULL),
(334, 1, 2, 'test', NULL, 5, '2025-04-12 07:12:38', '2025-04-12 07:15:41', 20, 'read', NULL),
(335, 1, 1, 'test', NULL, 2, '2025-04-12 07:15:07', '2025-04-13 01:05:17', 22, 'read', NULL),
(336, 1, 1, 'test', NULL, 2, '2025-04-12 07:15:37', '2025-04-13 01:05:17', 22, 'read', NULL),
(337, 2, 1, 'test', NULL, 5, '2025-04-12 07:16:06', '2025-04-13 00:38:42', 20, 'read', NULL),
(338, 2, 1, 'a', NULL, 5, '2025-04-12 09:54:37', '2025-04-13 00:38:42', 20, 'read', NULL),
(339, 2, 1, 'asa', NULL, 5, '2025-04-12 09:54:40', '2025-04-13 00:38:42', 20, 'read', NULL),
(340, 1, 2, 'test', NULL, 5, '2025-04-12 10:25:21', '2025-04-12 11:23:01', 20, 'read', NULL),
(341, 2, 1, 'test', NULL, 5, '2025-04-12 11:23:03', '2025-04-13 00:38:42', 20, 'read', NULL),
(346, 2, 1, 'test', NULL, 5, '2025-04-13 00:42:12', '2025-04-13 01:02:02', 20, 'read', NULL),
(347, 1, 2, 'test', NULL, 1, '2025-04-13 01:00:24', '2025-04-13 04:28:29', 1, 'read', NULL),
(348, 1, 2, 'test', NULL, 1, '2025-04-13 01:00:56', '2025-04-13 04:28:29', 1, 'read', NULL),
(349, 1, 1, 'test', NULL, 8, '2025-04-13 01:01:52', '2025-04-13 01:01:59', 8, 'read', NULL),
(350, 1, 2, 'test', NULL, 1, '2025-04-13 01:01:55', '2025-04-13 04:28:29', 1, 'read', NULL),
(351, 1, 2, 'aa', NULL, 1, '2025-04-13 01:01:56', '2025-04-13 04:28:29', 1, 'read', NULL),
(352, 1, 2, 'ssas', NULL, 1, '2025-04-13 01:01:58', '2025-04-13 04:28:29', 1, 'read', NULL),
(353, 1, 1, 'test', NULL, 8, '2025-04-13 01:02:02', '2025-04-13 01:03:48', 8, 'read', NULL),
(354, 1, 2, 'test', NULL, 5, '2025-04-13 01:02:04', '2025-04-13 04:27:06', 20, 'read', NULL),
(355, 1, 2, 'test', NULL, 5, '2025-04-13 01:02:06', '2025-04-13 04:27:06', 20, 'read', NULL),
(356, 1, 2, 'test', NULL, 5, '2025-04-13 01:02:07', '2025-04-13 04:27:06', 20, 'read', NULL),
(357, 1, 2, 'test', NULL, 5, '2025-04-13 01:02:07', '2025-04-13 04:27:06', 20, 'read', NULL),
(358, 1, 2, 'test', NULL, 5, '2025-04-13 01:02:09', '2025-04-13 04:27:06', 20, 'read', NULL),
(359, 1, 2, 'Hello world', NULL, 14, '2025-04-13 01:03:33', '2025-04-13 11:52:06', 9, 'read', NULL),
(360, 1, 2, 'test', NULL, 1, '2025-04-13 01:04:20', '2025-04-13 04:28:29', 1, 'read', NULL),
(361, 1, 2, 'aaa', NULL, 1, '2025-04-13 01:05:02', '2025-04-13 04:28:29', 1, 'read', NULL),
(362, 1, 1, 'asd', NULL, 8, '2025-04-13 01:05:12', '2025-04-13 01:43:22', 8, 'read', NULL),
(363, 2, 4, 'test', 'test', NULL, '2025-04-13 01:22:00', '2025-04-13 01:22:00', NULL, '', NULL),
(364, 1, 2, 'test', NULL, 10, '2025-04-13 01:42:34', '2025-04-13 04:28:27', 31, 'read', NULL),
(365, 1, 2, 'ss', NULL, 1, '2025-04-13 01:42:48', '2025-04-13 04:28:29', 1, 'read', NULL),
(366, 1, 2, 'sa', NULL, 10, '2025-04-13 01:43:03', '2025-04-13 04:28:27', 31, 'read', NULL),
(367, 1, 2, '1111111111111111', NULL, 5, '2025-04-13 02:23:16', '2025-04-13 04:27:06', 20, 'read', NULL),
(368, 1, 2, '123456788888', NULL, 5, '2025-04-13 04:26:51', '2025-04-13 04:27:06', 20, 'read', NULL),
(369, 2, 1, 'why?', NULL, 5, '2025-04-13 04:27:09', '2025-04-13 04:27:09', 20, '', NULL),
(370, 2, 1, 'test', NULL, 10, '2025-04-13 06:47:17', '2025-04-13 11:35:55', 31, 'read', NULL),
(371, 2, 1, 'test', NULL, 10, '2025-04-13 06:47:20', '2025-04-13 11:35:55', 31, 'read', NULL),
(372, 1, 2, 'test', NULL, 28, '2025-04-13 11:34:18', '2025-04-13 11:36:10', 32, 'read', NULL),
(373, 2, 1, 'how are you?', NULL, 28, '2025-04-13 11:36:17', '2025-04-13 11:37:21', 32, 'read', NULL),
(374, 1, 2, 'Test', '1744544239263.png', 28, '2025-04-13 11:37:19', '2025-04-13 11:41:05', 32, 'read', NULL),
(375, 1, 2, 'test', NULL, 28, '2025-04-13 11:41:09', '2025-04-13 11:41:09', 32, '', NULL),
(376, 2, 1, 'test', NULL, 14, '2025-04-13 11:52:08', '2025-04-13 11:52:08', 9, '', NULL),
(377, 1, 2, 'test', NULL, 28, '2025-04-13 11:52:26', '2025-04-13 11:52:26', 32, '', NULL),
(378, 1, 2, 'test', NULL, 28, '2025-04-13 11:52:38', '2025-04-13 11:52:38', 32, '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_message_sessions`
--

CREATE TABLE `tbl_message_sessions` (
  `id` int(11) NOT NULL,
  `user1_id` int(11) NOT NULL,
  `user2_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `report_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_message_sessions`
--

INSERT INTO `tbl_message_sessions` (`id`, `user1_id`, `user2_id`, `created_at`, `report_id`) VALUES
(1, 1, 2, '2025-03-31 01:04:08', 1),
(3, 1, 2, '2025-03-31 01:49:21', 6),
(4, 2, 1, '2025-03-31 01:51:51', 7),
(8, 1, 1, '2025-04-06 00:11:52', 8),
(9, 1, 2, '2025-04-06 00:42:01', 14),
(19, 1, 2, '2025-04-12 00:50:37', 0),
(20, 1, 2, '2025-04-12 01:58:28', 5),
(21, 1, 2, '2025-04-12 04:52:43', 8),
(22, 1, 1, '2025-04-12 07:15:07', 2),
(31, 1, 2, '2025-04-13 01:42:34', 10),
(32, 1, 2, '2025-04-13 11:34:18', 28);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_reports`
--

CREATE TABLE `tbl_reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `location` varchar(255) NOT NULL,
  `report_type` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `status` enum('pending','in_progress','resolved') DEFAULT 'pending',
  `is_anonymous` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archived` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_reports`
--

INSERT INTO `tbl_reports` (`id`, `user_id`, `location`, `report_type`, `description`, `image_path`, `status`, `is_anonymous`, `created_at`, `updated_at`, `archived`) VALUES
(1, 2, 'Room 101 ', 'Maintenance Report', 'Short circuit', NULL, 'resolved', 1, '2025-03-23 01:02:47', '2025-04-13 13:03:21', 0),
(2, 1, 'Room 102', 'Lost And Found', 'Found a backpack at room 102', NULL, 'in_progress', 1, '2025-03-31 01:08:56', '2025-04-12 07:16:22', 0),
(3, 2, 'Room 105', 'Lost And Found', 'Iphone with black color with stickers', NULL, 'in_progress', 0, '2025-03-31 01:16:57', '2025-03-31 01:16:57', 0),
(4, 2, 'Room 107', 'Lost And Found', 'Lost my tumbler i think around room 107', NULL, 'in_progress', 0, '2025-03-31 01:20:22', '2025-03-31 01:20:22', 0),
(5, 2, 'Library', 'Lost And Found', 'Found envelops around library', NULL, 'in_progress', 0, '2025-03-31 01:22:34', '2025-04-13 02:22:00', 0),
(6, 2, 'Room 102', 'Lost And Found', 'Found mobile phone at room 102', NULL, 'in_progress', 0, '2025-03-31 01:24:04', '2025-03-31 01:24:04', 0),
(7, 1, 'Room 105', 'Lost And Found', 'Found Iphone at room 105', NULL, 'in_progress', 1, '2025-03-31 01:40:39', '2025-04-12 07:19:05', 0),
(8, 1, 'Room 107', 'Lost And Found', 'Found Blue tumbler at room 107', NULL, 'in_progress', 0, '2025-03-31 01:52:55', '2025-04-12 10:14:40', 0),
(9, 2, 'Room 105', 'Maintenance Report', 'No current', NULL, 'in_progress', 0, '2025-04-01 03:46:50', '2025-03-31 03:58:32', 0),
(10, 2, 'Room 107', 'Maintenance Report', 'AC not working', NULL, 'resolved', 0, '2025-03-24 03:47:11', '2025-04-13 13:04:41', 0),
(11, 2, 'Room 106', 'Maintenance Report', 'No wifi', NULL, 'resolved', 0, '2025-03-30 03:47:26', '2025-04-13 13:05:11', 0),
(12, 2, 'Room 108', 'Maintenance Report', 'Dirty chairs', NULL, 'resolved', 0, '2025-03-31 03:47:43', '2025-04-13 13:04:57', 0),
(13, 2, 'Room 105', 'Maintenance Report', 'Broken glass', NULL, 'in_progress', 1, '2025-03-31 05:06:29', '2025-03-31 05:06:45', 0),
(14, 2, 'Test', 'Maintenance Report', 'ts', NULL, 'resolved', 0, '2025-04-06 00:41:29', '2025-04-13 12:20:49', 0),
(15, 2, 'room 101', 'Lost And Found', 'Bags', NULL, 'in_progress', 0, '2025-04-12 08:57:38', '2025-04-12 10:30:13', 0),
(16, 2, 'test', 'Maintenance Report', 'test', NULL, 'in_progress', 0, '2025-04-12 09:12:26', '2025-04-12 11:43:23', 1),
(17, 1, 'test', 'Lost And Found', 'test', NULL, 'in_progress', 0, '2025-04-12 10:11:24', '2025-04-13 02:20:12', 0),
(18, 2, 'test', 'Lost And Found', 'test', NULL, 'in_progress', 0, '2025-04-12 10:26:12', '2025-04-12 10:26:12', 0),
(19, 2, 'test', 'Lost And Found', 'tests', NULL, 'in_progress', 0, '2025-04-12 10:29:44', '2025-04-12 10:29:51', 0),
(20, 2, 'test123456', '', '123456', NULL, 'pending', 0, '2025-04-12 10:55:13', '2025-04-12 10:55:45', 1),
(21, 2, 'test 123454', '', '12345', NULL, 'pending', 0, '2025-04-12 10:58:04', '2025-04-12 10:58:08', 1),
(22, 2, 'Room 107', 'Maintenance Report', 'Leak Faucet', NULL, 'pending', 1, '2025-04-12 12:11:06', '2025-04-13 00:17:23', 1),
(23, 2, 'library', 'Lost And Found', 'Red sling bag', NULL, 'in_progress', 0, '2025-04-12 12:13:51', '2025-04-12 12:13:51', 0),
(24, 2, 'Library', 'Lost And Found', 'Red sling bag', NULL, 'in_progress', 0, '2025-04-12 12:14:41', '2025-04-12 13:37:23', 0),
(25, 2, 'Library', 'Lost And Found', 'A purple bag with a water bottle', NULL, 'in_progress', 0, '2025-04-12 12:17:37', '2025-04-12 12:17:37', 0),
(26, 1, 'Test', 'Lost And Found', 'Test', NULL, 'in_progress', 0, '2025-04-12 13:21:24', '2025-04-12 13:21:24', 0),
(27, 1, 'test', 'Lost And Found', 'test', NULL, 'in_progress', 1, '2025-04-13 04:29:39', '2025-04-13 04:29:39', 0),
(28, 2, 'Test', 'Incident Report', 'Test', NULL, 'resolved', 1, '2025-04-13 10:20:57', '2025-04-13 12:54:11', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','report-manager','maintenance-report-manager','lost-and-found-manager','incident-report-manager','user') NOT NULL DEFAULT 'user',
  `image_url` text DEFAULT NULL,
  `token` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `name`, `email`, `password`, `role`, `image_url`, `token`, `status`, `created_at`) VALUES
(1, 'Angelo Cabase', 'gelocabase1324@gmail.com', '', 'admin', 'profile/1744338209565.jpg', '117007367720928788994', 1, '2025-03-06 01:20:12'),
(2, 'angelo cabase', 'goldengrape777@gmail.com', '', 'user', 'profile/1744338228306.jpg', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1ZjgyMTE3MTM3ODhiNjE0NTQ3NGI1MDI5YjAxNDFiZDViM2RlOWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1ODA1Njg3MjEwMTYtZjY5cWlxbzgyZGhsN3N1bG1zMWY1dWJyNTB0YnJmNmkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1ODA1Njg3MjEwMTYtaGFpNmkxdXBobXBlaDZqOW1vbTVpZjY2Nmg5dXY0MmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE1MjE5NDM4MzQ1MDU0MDM0MjgiLCJlbWFpbCI6ImdvbGRlbmdyYXBlNzc3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiYW5nZWxvIGNhYmFzZSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKT3hIenhTV3NFMlk5bFpibzNlaEpSdlhYZC1NZkNHM1hKcnJHY1pIalRtaUNiMGc9czk2LWMiLCJnaXZlbl9uYW1lIjoiYW5nZWxvIiwiZmFtaWx5X25hbWUiOiJjYWJhc2UiLCJpYXQiOjE3NDEyMjA5MjMsImV4cCI6MTc0MTIyNDUyM30.JkFjD2Slon2KIJREvqC7jria-SrBPwk_fny2-lQ00oSf-tC8dvy1SjYFp9qFExKJdGZWEUKuKvR_mzP8tjyAlAqT1w9Q3Q1W5MH76uNAApb-UtrnlzNLSvzebCBQ1U-cRX3uLf-x26UEIl09803QT5YfjUwHXW8hIcgwQwbZ5Qc6FLFWhMBKi3Qa_qkLylG0D-QrBaZ5lgRq_OaraMyiuOi9WCkN8Jz8_ufEjPuFAhowYQUW6il1P6rmohsLwuld9MXxru5CJxRz_LgHH3lLqO1gDzwzFlakrpdG5QvZxZeNbIuqdG9eSm2n8Q4BREXCseovEPjSme6sXfqiTALy7g', 1, '2025-03-06 01:20:45'),
(3, 'Unknow User', 'cabase.1324@gmail.com', '', 'user', 'profile/1744338221459.jpg', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1ZjgyMTE3MTM3ODhiNjE0NTQ3NGI1MDI5YjAxNDFiZDViM2RlOWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1ODA1Njg3MjEwMTYtZjY5cWlxbzgyZGhsN3N1bG1zMWY1dWJyNTB0YnJmNmkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1ODA1Njg3MjEwMTYtaGFpNmkxdXBobXBlaDZqOW1vbTVpZjY2Nmg5dXY0MmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTgxMTU5NDA5NzE4OTMyNDcyOTciLCJlbWFpbCI6ImNhYmFzZS4xMzI0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiVW5rbm93IFVzZXIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSzZ1MTFJVVBkaWRhUEdOdFlsVEJramtMQ0wwcUI2YzlGQ0x1MHVpcjVGbWkxS1BBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlVua25vdyIsImZhbWlseV9uYW1lIjoiVXNlciIsImlhdCI6MTc0MTIyNDc4NCwiZXhwIjoxNzQxMjI4Mzg0fQ.GxwsRhnYGhFbQIlW5IYSrPrBRnOcPZu6a_QcUKNuLkLUD47ewC2l2k5Cmf5PBmRzZaVI-rlJuU0Ba3ir27isOgm7Aw-HS3dM2zmDyxeTTcsp_GM4LJcqDnqQfY4lolbv9-T41xs-jgznJzwmkiurynmgAYTZtbuzMh6J9O1UDptdyAUiLq-Ae-czLr-mn_eFhb_0fum04bZvyo1IGJ6Z6TI5mVAvwTJn5gwGRyyD3xfN9f77QJ2UgrM6dVFAkuoNF2Wf2OjqXT18kycA64migkLtZr5c1KF7t3FmAW8YsAe7AQgRrtVcZUWtRCqiAG74xpyoCjhwhw8f4fxQILVLzw', 1, '2025-03-06 01:33:04'),
(4, 'Gelo cabase', 'silverlemon777@gmail.com', '', 'maintenance-report-manager', 'profile/1744375756219.jpg', '115140714590763332758', 1, '2025-03-25 01:57:28'),
(5, 'Test', 'sample@gmail.com', '', 'user', NULL, '', 1, '2025-04-11 12:53:43'),
(6, 'test', 'test@gmail.com', '', 'user', NULL, '', 1, '2025-04-12 09:50:03'),
(7, 'Test', 'test2@gmail.com', '', 'user', NULL, '', 0, '2025-04-12 12:49:22');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_notifications`
--

CREATE TABLE `tbl_user_notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `archived` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user_notifications`
--

INSERT INTO `tbl_user_notifications` (`id`, `user_id`, `report_id`, `title`, `message`, `is_read`, `created_at`, `updated_at`, `archived`) VALUES
(1, 2, 14, 'Report', 'Your report about Plumbing at Test has been marked as \"Resolved\".', 1, '2025-04-06 01:37:55', '2025-04-06 01:37:55', 0),
(2, 2, 16, 'Report', 'Your report about Other at test has been marked as \"In Progress\".', 1, '2025-04-12 09:18:06', '2025-04-12 09:18:06', 0),
(3, 2, 22, 'Deleted Report', 'The report titled \"Leak Faucet at Room 107\" has been removed.', 1, '2025-04-13 00:17:23', '2025-04-13 00:17:23', 0),
(4, 1, 9, 'Lost and Found', 'Your lost item at test has been marked as \"claimed\".', 0, '2025-04-13 02:19:18', '2025-04-13 02:19:18', 0),
(5, 2, 4, 'Lost and Found', 'Your lost item at Library has been marked as \"claimed\".', 1, '2025-04-13 02:20:20', '2025-04-13 02:20:20', 0),
(6, 1, 1, 'Lost and Found', 'Your found item at Room 102 has been marked as \"claimed\".', 0, '2025-04-13 02:22:25', '2025-04-13 02:22:25', 0),
(7, 2, 4, 'Lost and Found', 'Your lost item at Library has been marked as \"claimed\".', 1, '2025-04-13 02:22:51', '2025-04-13 02:22:51', 0),
(8, 2, 4, 'Lost and Found', 'Your lost item at Library has been marked as \"claimed\".', 1, '2025-04-13 02:23:35', '2025-04-13 02:23:35', 0),
(9, 1, 9, 'Lost and Found', 'Your lost item at test has been marked as \"claimed\".', 0, '2025-04-13 02:26:05', '2025-04-13 02:26:05', 0),
(10, 1, 7, 'Lost and Found', 'Your found item at Room 107 has been marked as \"claimed\".', 0, '2025-04-13 02:26:27', '2025-04-13 02:26:27', 0),
(11, 1, 6, 'Lost and Found', 'Your found item at Room 105 has been marked as \"claimed\".', 0, '2025-04-13 02:26:45', '2025-04-13 02:26:45', 0),
(12, 1, 1, 'Lost and Found', 'Your found item at Room 102 has been marked as \"claimed\".', 0, '2025-04-13 02:27:03', '2025-04-13 02:27:03', 0),
(13, 2, 6, 'Lost and Found', 'Your found item at Room 102 has been marked as \"claimed\".', 1, '2025-04-13 02:32:16', '2025-04-13 02:32:16', 0),
(14, 2, 4, 'Lost and Found', 'Your lost item at Room 107 has been marked as \"claimed\".', 1, '2025-04-13 02:32:29', '2025-04-13 02:32:29', 0),
(15, 1, 7, 'Lost and Found', 'Your found item at Room 105 has been marked as \"claimed\".', 0, '2025-04-13 02:32:49', '2025-04-13 02:32:49', 0),
(16, 2, 6, 'Lost and Found', 'Your found item at Room 102 has been marked as \"claimed\".', 1, '2025-04-13 02:40:34', '2025-04-13 02:40:34', 0),
(17, 2, 4, 'Lost and Found', 'Your lost item at Room 107 has been marked as \"claimed\".', 1, '2025-04-13 02:41:19', '2025-04-13 02:41:19', 0),
(18, 1, 7, 'Lost and Found', 'Your found item at Room 105 has been marked as \"claimed\".', 0, '2025-04-13 02:41:38', '2025-04-13 02:41:38', 0),
(19, 2, 4, 'Lost and Found', 'Your request in lost item at Library has been marked as \"accepted\".', 1, '2025-04-13 02:47:40', '2025-04-13 02:47:40', 0),
(20, 2, 9, 'Lost and Found', 'Your request in lost item at test has been marked as \"accepted\".', 1, '2025-04-13 02:48:15', '2025-04-13 02:48:15', 0),
(21, 1, 7, 'Lost and Found', 'Your request in found item at Room 107 has been marked as \"accepted\".', 0, '2025-04-13 02:48:36', '2025-04-13 02:48:36', 0),
(22, 2, 6, 'Lost and Found', 'Your request in found item at Room 105 has been marked as \"accepted\".', 1, '2025-04-13 02:48:43', '2025-04-13 02:48:43', 0),
(23, 2, 4, 'Lost and Found', 'Your request to return the lost item at Library has been accepted. Please coordinate with the holder for retrieval.', 1, '2025-04-13 03:06:12', '2025-04-13 03:06:12', 0),
(24, 2, 1, 'Lost and Found', 'Your request to claim the found item at Room 102 has been accepted. \n                    Please coordinate with the holder for retrieval.', 1, '2025-04-13 03:08:50', '2025-04-13 03:08:50', 0),
(25, 2, 9, 'Lost and Found', 'Your request to return the lost item at test has been accepted. \n                    Please coordinate with the claimer for retrieval.', 1, '2025-04-13 03:10:01', '2025-04-13 03:10:01', 0),
(26, 1, 3, 'Lost and Found', 'Your request to return the lost item at Room 107 has been accepted. Please coordinate with the holder for retrieval.', 0, '2025-04-13 03:24:43', '2025-04-13 03:24:43', 0),
(27, 2, 3, 'Lost and Found', 'The item you reported as lost at Room 107 has been marked as claimed. Please coordinate with the owner to complete the return.', 1, '2025-04-13 03:24:43', '2025-04-13 03:24:43', 0),
(28, 2, 9, 'Lost and Found', 'Your request to return the lost test at test has been accepted. Please coordinate with the holder for retrieval.', 1, '2025-04-13 03:28:26', '2025-04-13 03:28:26', 0),
(29, 1, 9, 'Lost and Found', 'The test you reported as lost at test has been marked as claimed. Please coordinate with the owner to complete the return.', 0, '2025-04-13 03:28:26', '2025-04-13 03:28:26', 0),
(30, 1, 3, 'Lost and Found', 'Your request to return the lost Tumbler at Room 107 has been accepted. Please coordinate with the holder for retrieval.', 0, '2025-04-13 03:28:38', '2025-04-13 03:28:38', 0),
(31, 2, 3, 'Lost and Found', 'The Tumbler you reported as lost at Room 107 has been marked as claimed. Please coordinate with the owner to complete the return.', 1, '2025-04-13 03:28:38', '2025-04-13 03:28:38', 0),
(32, 2, 1, 'Lost and Found', 'Your request to claim the found Backpack at Room 102 has been accepted. Please coordinate with the reporter for retrieval.', 1, '2025-04-13 03:30:12', '2025-04-13 03:30:12', 0),
(33, 1, 1, 'Lost and Found', 'The Backpack you reported as found at Room 102 has been marked as claimed. Please coordinate with the claimer to complete the return.', 0, '2025-04-13 03:30:12', '2025-04-13 03:30:12', 0),
(34, 2, 7, 'Lost and Found', 'Your request to claim the found Blue Tumbler at Room 107 has been accepted. Please coordinate with the reporter for retrieval.', 1, '2025-04-13 03:54:23', '2025-04-13 03:54:23', 0),
(35, 1, 7, 'Lost and Found', 'The Blue Tumbler you reported as found at Room 107 has been marked as claimed. Please coordinate with the claimer to complete the return.', 0, '2025-04-13 03:54:23', '2025-04-13 03:54:23', 0),
(36, 2, 6, 'Lost and Found', 'Your request to claim the found Iphone at Room 105 has been accepted. Please coordinate with the reporter for retrieval.', 1, '2025-04-13 04:07:05', '2025-04-13 04:07:05', 0),
(37, 1, 6, 'Lost and Found', 'The Iphone you reported as found at Room 105 has been marked as claimed. Please coordinate with the claimer to complete the return.', 0, '2025-04-13 04:07:05', '2025-04-13 04:07:05', 0),
(38, 2, 4, 'Lost and Found', 'Your request to return the lost Envelopes at Library has been accepted. Please coordinate with the holder for retrieval.', 1, '2025-04-13 04:07:26', '2025-04-13 04:07:26', 0),
(39, 1, 4, 'Lost and Found', 'The Envelopes you reported as lost at Library has been marked as claimed. Please coordinate with the owner to complete the return.', 0, '2025-04-13 04:07:26', '2025-04-13 04:07:26', 0),
(40, 2, 7, 'Lost and Found', 'Your request to claim the found Blue Tumbler at Room 107 has been accepted. Please coordinate with the reporter for retrieval.', 1, '2025-04-13 04:07:43', '2025-04-13 04:07:43', 0),
(41, 1, 7, 'Lost and Found', 'The Blue Tumbler you reported as found at Room 107 has been marked as claimed. Please coordinate with the claimer to complete the return.', 0, '2025-04-13 04:07:43', '2025-04-13 04:07:43', 0),
(42, 2, 9, 'Lost and Found', 'Your return request for the lost \"test\" at test has been rejected.', 1, '2025-04-13 04:09:01', '2025-04-13 04:09:01', 0),
(43, 2, 9, 'Lost and Found', 'Your return request for the lost \"test\" at test has been rejected.', 1, '2025-04-13 04:09:14', '2025-04-13 04:09:14', 0),
(44, 2, 7, 'Lost and Found', 'Your claim request for the found \"Blue Tumbler\" at Room 107 has been rejected.', 1, '2025-04-13 04:09:20', '2025-04-13 04:09:20', 0),
(45, 2, 7, 'Lost and Found', 'Your claim request for the found \"Blue Tumbler\" at Room 107 has been rejected.', 1, '2025-04-13 04:16:39', '2025-04-13 04:16:39', 0),
(46, 2, 7, 'Lost and Found', 'Your claim request for the found \"Blue Tumbler\" at Room 107 has been rejected.', 1, '2025-04-13 04:16:41', '2025-04-13 04:16:41', 0),
(47, 1, 7, 'Lost and Found', 'Your claim request for the found \"Blue Tumbler\" at Room 107 has been rejected.', 0, '2025-04-13 04:16:43', '2025-04-13 04:16:43', 0),
(48, 2, 6, 'Lost and Found', 'Your claim request for the found \"Iphone\" at Room 105 has been rejected.', 1, '2025-04-13 04:16:45', '2025-04-13 04:16:45', 0),
(49, 2, 9, 'Lost and Found', 'Your return request for the lost \"test\" at test has been rejected.', 1, '2025-04-13 04:19:38', '2025-04-13 04:19:38', 0),
(50, 2, 6, 'Lost and Found', 'Your claim request for the found \"Iphone\" at Room 105 has been rejected.', 1, '2025-04-13 04:25:57', '2025-04-13 04:25:57', 0),
(51, 1, 3, 'Lost and Found', 'Your return request for the lost \"Tumbler\" at Room 107 has been rejected.', 0, '2025-04-13 04:26:01', '2025-04-13 04:26:01', 0),
(52, 2, 4, 'Lost and Found', 'Your return request for the lost \"Envelopes\" at Library has been rejected.', 1, '2025-04-13 04:27:01', '2025-04-13 04:27:01', 0),
(53, 2, 16, 'Lost and Found', 'Your claim request for the found \"Test\" at test has been rejected.', 1, '2025-04-13 04:30:02', '2025-04-13 04:30:02', 0),
(54, 2, 14, 'Report', 'Your report about Plumbing at Test has been marked as \"Pending\".', 1, '2025-04-13 06:39:22', '2025-04-13 06:39:22', 0),
(55, 2, 28, 'Report', 'Your report about Harassment at Test has been marked as \"Resolved\".', 1, '2025-04-13 11:48:20', '2025-04-13 11:48:20', 0),
(56, 2, 28, 'Incident Report', 'Your report about Harassment at Test has been marked as \"In Progress\".', 1, '2025-04-13 11:51:09', '2025-04-13 11:51:09', 0),
(57, 2, 28, 'Incident Report', 'Your report about Harassment at Test has been marked as \"Resolved\".', 1, '2025-04-13 11:51:30', '2025-04-13 11:51:30', 0),
(58, 2, 28, 'Incident Report', 'Your report about Harassment at Test has been marked as \"In Progress\".', 1, '2025-04-13 12:01:50', '2025-04-13 12:01:50', 0),
(59, 2, 28, 'Incident Report', 'Your report about Harassment at Test has been marked as \"Resolved\".', 1, '2025-04-13 12:01:54', '2025-04-13 12:01:54', 0),
(60, 2, 14, 'Report', 'Your report about Plumbing at Test has been marked as \"Resolved\".', 1, '2025-04-13 12:20:49', '2025-04-13 12:20:49', 0),
(61, 2, 16, 'Lost and Found', 'Your request to claim the found Test at test has been accepted. Please coordinate with the reporter for retrieval.', 1, '2025-04-13 12:24:07', '2025-04-13 12:24:07', 0),
(62, 1, 16, 'Lost and Found', 'The Test you reported as found at test has been marked as claimed. Please coordinate with the claimer to complete the return.', 0, '2025-04-13 12:24:07', '2025-04-13 12:24:07', 0),
(63, 2, 16, 'Lost and Found', 'Your claim request for the found \"Test\" at test has been rejected.', 1, '2025-04-13 12:24:36', '2025-04-13 12:24:36', 0),
(64, 2, 1, 'Lost and Found', 'Your request to claim the found Backpack at Room 102 has been accepted. Please coordinate with the reporter for retrieval.', 1, '2025-04-13 12:24:44', '2025-04-13 12:24:44', 0),
(65, 1, 1, 'Lost and Found', 'The Backpack you reported as found at Room 102 has been marked as claimed. Please coordinate with the claimer to complete the return.', 0, '2025-04-13 12:24:44', '2025-04-13 12:24:44', 0),
(66, 1, 1, 'Lost and Found', 'Your claim request for the found \"Backpack\" at Room 102 has been rejected.', 0, '2025-04-13 12:29:59', '2025-04-13 12:29:59', 0),
(67, 2, 1, 'Lost and Found', 'Your request to claim the found Backpack at Room 102 has been accepted. Please coordinate with the reporter for retrieval.', 1, '2025-04-13 12:30:05', '2025-04-13 12:30:05', 0),
(68, 1, 1, 'Lost and Found', 'The Backpack you reported as found at Room 102 has been marked as claimed. Please coordinate with the claimer to complete the return.', 0, '2025-04-13 12:30:05', '2025-04-13 12:30:05', 0),
(69, 2, 1, 'Lost and Found', 'Your request to claim the found Backpack at Room 102 has been accepted. Please coordinate with the reporter for retrieval.', 1, '2025-04-13 12:34:04', '2025-04-13 12:34:04', 0),
(70, 1, 1, 'Lost and Found', 'The Backpack you reported as found at Room 102 has been marked as claimed. Please coordinate with the claimer to complete the return.', 0, '2025-04-13 12:34:04', '2025-04-13 12:34:04', 0),
(71, 2, 1, 'Lost and Found', 'Your claim request for the undefined item \"undefined\" at undefined was previously accepted in error. It has now been reverted and the item is available again for claiming. We apologize for the inconvenience.', 1, '2025-04-13 12:40:52', '2025-04-13 12:40:52', 0),
(72, 2, 1, 'Lost and Found', 'Your request to claim the found Backpack at Room 102 has been accepted. Please coordinate with the reporter for retrieval.', 1, '2025-04-13 12:43:11', '2025-04-13 12:43:11', 0),
(73, 1, 1, 'Lost and Found', 'The Backpack you reported as found at Room 102 has been marked as claimed. Please coordinate with the claimer to complete the return.', 0, '2025-04-13 12:43:11', '2025-04-13 12:43:11', 0),
(74, 2, 1, 'Lost and Found', 'Your claim request for the found item \"Backpack\" at Room 102 was previously accepted in error. It has now been reverted and the item is available again for claiming. We apologize for the inconvenience.', 1, '2025-04-13 12:43:15', '2025-04-13 12:43:15', 0),
(75, 2, 28, 'Incident Report', 'Your report about Harassment at Test has been marked as \"In Progress\".', 1, '2025-04-13 12:46:20', '2025-04-13 12:46:20', 0),
(76, 2, 28, 'Incident Report', 'Your report about Harassment at Test has been marked as \"Resolved\".', 1, '2025-04-13 12:46:32', '2025-04-13 12:46:32', 0),
(77, 2, 28, 'Deleted Report', 'The report titled \"Test at Test\" has been removed.', 1, '2025-04-13 12:54:11', '2025-04-13 12:54:11', 0),
(78, 2, 11, 'Report', 'Your report about General Repair at Room 106 has been marked as \"In Progress\".', 1, '2025-04-13 12:59:50', '2025-04-13 12:59:50', 0),
(79, 2, 1, 'Report', 'Your report about Electrical at Room 101  has been marked as \"Resolved\".', 1, '2025-04-13 12:59:54', '2025-04-13 12:59:54', 0),
(80, 2, 1, 'Maintenance Report', 'Your report about Electrical at Room 101  has been marked as \"Pending\".', 0, '2025-04-13 13:02:07', '2025-04-13 13:02:07', 0),
(81, 2, 1, 'Maintenance Report', 'Your report about Electrical at Room 101  has been marked as \"Resolved\".', 0, '2025-04-13 13:03:21', '2025-04-13 13:03:21', 0),
(82, 2, 10, 'Maintenance Report', 'Your report about Plumbing at Room 107 has been marked as \"Resolved\".', 0, '2025-04-13 13:04:41', '2025-04-13 13:04:41', 0),
(83, 2, 12, 'Maintenance Report', 'Your report about Cleaning at Room 108 has been marked as \"Resolved\".', 0, '2025-04-13 13:04:57', '2025-04-13 13:04:57', 0),
(84, 2, 11, 'Maintenance Report', 'Your report about General Repair at Room 106 has been marked as \"Resolved\".', 0, '2025-04-13 13:05:11', '2025-04-13 13:05:11', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_admin_notifications`
--
ALTER TABLE `tbl_admin_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `tbl_claims`
--
ALTER TABLE `tbl_claims`
  ADD PRIMARY KEY (`id`),
  ADD KEY `claimer_id` (`claimer_id`),
  ADD KEY `holder_id` (`holder_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `tbl_incident_reports`
--
ALTER TABLE `tbl_incident_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `tbl_lost_found`
--
ALTER TABLE `tbl_lost_found`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `tbl_maintenance_reports`
--
ALTER TABLE `tbl_maintenance_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `tbl_messages`
--
ALTER TABLE `tbl_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`),
  ADD KEY `report_id` (`report_id`),
  ADD KEY `message_session_id` (`message_session_id`);

--
-- Indexes for table `tbl_message_sessions`
--
ALTER TABLE `tbl_message_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user1_id` (`user1_id`),
  ADD KEY `user2_id` (`user2_id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `tbl_reports`
--
ALTER TABLE `tbl_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `tbl_user_notifications`
--
ALTER TABLE `tbl_user_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `report_id` (`report_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_admin_notifications`
--
ALTER TABLE `tbl_admin_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `tbl_claims`
--
ALTER TABLE `tbl_claims`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `tbl_incident_reports`
--
ALTER TABLE `tbl_incident_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_lost_found`
--
ALTER TABLE `tbl_lost_found`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tbl_maintenance_reports`
--
ALTER TABLE `tbl_maintenance_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_messages`
--
ALTER TABLE `tbl_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=379;

--
-- AUTO_INCREMENT for table `tbl_message_sessions`
--
ALTER TABLE `tbl_message_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `tbl_reports`
--
ALTER TABLE `tbl_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_user_notifications`
--
ALTER TABLE `tbl_user_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_admin_notifications`
--
ALTER TABLE `tbl_admin_notifications`
  ADD CONSTRAINT `tbl_admin_notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_claims`
--
ALTER TABLE `tbl_claims`
  ADD CONSTRAINT `tbl_claim_items_ibfk_1` FOREIGN KEY (`claimer_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_claim_items_ibfk_2` FOREIGN KEY (`holder_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_claim_items_ibfk_3` FOREIGN KEY (`item_id`) REFERENCES `tbl_lost_found` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_incident_reports`
--
ALTER TABLE `tbl_incident_reports`
  ADD CONSTRAINT `tbl_incident_reports_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `tbl_reports` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_lost_found`
--
ALTER TABLE `tbl_lost_found`
  ADD CONSTRAINT `tbl_lost_found_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_lost_found_ibfk_2` FOREIGN KEY (`report_id`) REFERENCES `tbl_reports` (`id`);

--
-- Constraints for table `tbl_maintenance_reports`
--
ALTER TABLE `tbl_maintenance_reports`
  ADD CONSTRAINT `tbl_maintenance_reports_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `tbl_reports` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_messages`
--
ALTER TABLE `tbl_messages`
  ADD CONSTRAINT `FK_PersonOrder` FOREIGN KEY (`report_id`) REFERENCES `tbl_reports` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_messages_ibfk_4` FOREIGN KEY (`message_session_id`) REFERENCES `tbl_message_sessions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_message_sessions`
--
ALTER TABLE `tbl_message_sessions`
  ADD CONSTRAINT `tbl_message_sessions_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_message_sessions_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_reports`
--
ALTER TABLE `tbl_reports`
  ADD CONSTRAINT `tbl_reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
