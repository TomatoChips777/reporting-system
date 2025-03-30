-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 30, 2025 at 03:15 PM
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
-- Database: `lc-ticketing-db`
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
(1, 2, 1, 'Maintenance Report', 'New report submitted  issue at Room 101', 1, '2025-03-28 10:38:40'),
(2, 3, 4, 'Maintenance Report', 'New report submitted  issue at Test', 1, '2025-03-28 13:21:28'),
(3, 2, 6, 'Maintenance Report', 'New report submitted  issue at Test', 1, '2025-03-28 13:25:14'),
(4, 2, 7, 'Maintenance Report', 'New report submitted  issue at asdsadsa', 1, '2025-03-28 13:25:21'),
(5, 2, 9, 'Maintenance Report', 'New report submitted  issue at 1234567890', 1, '2025-03-29 03:06:18'),
(6, 2, 10, 'Maintenance Report', 'New report submitted  issue at ada', 0, '2025-03-30 04:30:55'),
(7, 2, 11, 'Maintenance Report', 'New report submitted  issue at Room 101', 0, '2025-03-30 05:32:06'),
(8, 2, 12, 'Maintenance Report', 'New report submitted  issue at Room 101', 0, '2025-03-30 05:36:53'),
(9, 2, 13, 'Maintenance Report', 'New report submitted  issue at Room 102', 0, '2025-03-30 05:37:33'),
(10, 2, 14, 'Maintenance Report', 'New report submitted  issue at Room 101', 0, '2025-03-30 05:39:56'),
(11, 2, 15, 'Maintenance Report', 'New report submitted  issue at CLI Building Room 101', 0, '2025-03-30 05:50:21'),
(12, 2, 2, 'Maintenance Report', 'New report submitted  issue at Room 102', 0, '2025-03-30 06:08:34'),
(13, 2, 3, 'Maintenance Report', 'New report submitted  issue at Room 103', 0, '2025-03-30 06:09:43'),
(14, 2, 4, 'Maintenance Report', 'New report submitted  issue at Room 105', 0, '2025-03-30 07:57:32'),
(15, 2, 5, 'Maintenance Report', 'New report submitted  issue at Rw', 0, '2025-03-30 10:39:06'),
(16, 2, 6, 'Maintenance Report', 'New report submitted  issue at Room 109', 0, '2025-03-30 12:55:54');

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
(1, 2, 1, 'lost', 'Charger', 'electronics', 'Lost Charger', 'Room 101', '2025-03-30 14:07:34', 'open', NULL, '', 1, 0),
(2, 2, 2, 'lost', 'Iphone', 'accessories', 'Lost Iphone', 'Room 102', '2025-03-30 14:08:51', 'open', NULL, '', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_maintenance_reports`
--

CREATE TABLE `tbl_maintenance_reports` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `category` enum('Electrical','Plumbing','Cleaning','General Repair') NOT NULL,
  `priority` enum('Low','Medium','High','Urgent') DEFAULT 'Medium',
  `assigned_staff` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_maintenance_reports`
--

INSERT INTO `tbl_maintenance_reports` (`id`, `report_id`, `category`, `priority`, `assigned_staff`) VALUES
(1, 3, 'General Repair', 'Urgent', ''),
(2, 2, 'Electrical', 'Medium', NULL),
(3, 4, 'Electrical', 'Medium', ''),
(4, 5, 'Electrical', 'Medium', 'TEst');

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
  `report_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `message_session_id` int(11) DEFAULT NULL,
  `status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_messages`
--

INSERT INTO `tbl_messages` (`id`, `sender_id`, `receiver_id`, `message`, `image_path`, `report_id`, `created_at`, `updated_at`, `message_session_id`, `status`) VALUES
(1, 1, 2, 'Hello there', NULL, 1, '2025-03-30 06:07:56', '2025-03-30 08:55:08', 1, 'read'),
(2, 1, 2, 'Iphone', NULL, 2, '2025-03-30 06:09:05', '2025-03-30 08:55:20', 2, 'read'),
(5, 1, 2, 'Maintenance Report test message', NULL, 3, '2025-03-30 06:14:28', '2025-03-30 08:54:51', 4, 'read'),
(6, 1, 2, 'Hello world', NULL, 3, '2025-03-30 06:15:37', '2025-03-30 08:54:51', 4, 'read'),
(7, 2, 1, 'Yes?', NULL, 3, '2025-03-30 06:15:46', '2025-03-30 08:54:35', 4, 'read'),
(8, 1, 2, 'test', NULL, 2, '2025-03-30 06:17:44', '2025-03-30 08:55:20', 2, 'read'),
(9, 1, 2, 'Hello there', NULL, 4, '2025-03-30 08:09:46', '2025-03-30 08:48:11', 5, ''),
(10, 2, 1, 'Hi', NULL, 4, '2025-03-30 08:10:10', '2025-03-30 08:48:11', 5, ''),
(11, 1, 2, 'test', NULL, 1, '2025-03-30 08:14:32', '2025-03-30 08:55:08', 1, 'read'),
(12, 1, 2, 'aaa', NULL, 1, '2025-03-30 08:14:36', '2025-03-30 08:55:08', 1, 'read'),
(13, 1, 2, 'yes', NULL, 1, '2025-03-30 08:14:52', '2025-03-30 08:55:08', 1, 'read'),
(14, 1, 2, 'test', NULL, 1, '2025-03-30 08:38:38', '2025-03-30 08:55:08', 1, 'read'),
(15, 1, 2, 'hello world', NULL, 3, '2025-03-30 08:54:46', '2025-03-30 08:54:51', 4, 'read'),
(16, 2, 1, 's', NULL, 3, '2025-03-30 08:54:54', '2025-03-30 08:56:54', 4, 'read'),
(17, 1, 2, 's', NULL, 3, '2025-03-30 08:54:58', '2025-03-30 08:55:20', 4, 'read'),
(18, 2, 1, 's', NULL, 3, '2025-03-30 08:55:00', '2025-03-30 08:56:54', 4, 'read'),
(19, 2, 1, 'test', NULL, 1, '2025-03-30 08:55:09', '2025-03-30 08:56:53', 1, 'read'),
(20, 2, 1, 'test', NULL, 1, '2025-03-30 08:56:46', '2025-03-30 08:56:53', 1, 'read'),
(21, 1, 2, 'test', NULL, 1, '2025-03-30 08:58:40', '2025-03-30 08:58:41', 1, 'read'),
(22, 2, 1, 'hello world', NULL, 1, '2025-03-30 08:58:45', '2025-03-30 08:59:05', 1, 'read'),
(23, 2, 1, 'sup', NULL, 1, '2025-03-30 08:58:52', '2025-03-30 08:59:05', 1, 'read'),
(24, 2, 1, 'kumusta', NULL, 1, '2025-03-30 08:58:56', '2025-03-30 08:59:05', 1, 'read'),
(25, 1, 2, 'ayus lang', NULL, 1, '2025-03-30 08:59:08', '2025-03-30 08:59:26', 1, 'read'),
(26, 1, 2, 'sige', NULL, 1, '2025-03-30 08:59:17', '2025-03-30 08:59:26', 1, 'read'),
(27, 2, 1, 'opo', NULL, 1, '2025-03-30 08:59:20', '2025-03-30 09:02:50', 1, 'read'),
(28, 2, 1, 'yes', NULL, 1, '2025-03-30 08:59:24', '2025-03-30 09:02:50', 1, 'read'),
(29, 1, 2, 'opo', NULL, 1, '2025-03-30 08:59:44', '2025-03-30 09:02:33', 1, 'read'),
(30, 2, 1, 'test', NULL, 1, '2025-03-30 09:02:35', '2025-03-30 09:02:50', 1, 'read'),
(31, 1, 2, 'tes', NULL, 1, '2025-03-30 09:02:39', '2025-03-30 09:02:39', 1, 'read'),
(32, 1, 2, 'aaa', NULL, 1, '2025-03-30 09:02:45', '2025-03-30 09:02:45', 1, 'read'),
(33, 2, 1, 'test', NULL, 1, '2025-03-30 09:03:55', '2025-03-30 09:03:55', 1, 'read'),
(34, 2, 1, 'test', NULL, 1, '2025-03-30 09:04:07', '2025-03-30 09:04:09', 1, 'read'),
(35, 1, 2, 'test', NULL, 1, '2025-03-30 09:04:11', '2025-03-30 09:04:29', 1, 'read'),
(36, 2, 1, 'aa', NULL, 1, '2025-03-30 09:04:13', '2025-03-30 09:05:34', 1, 'read'),
(37, 1, 2, 'adsa', NULL, 1, '2025-03-30 09:04:15', '2025-03-30 09:04:29', 1, 'read'),
(38, 2, 1, 'asdas', NULL, 1, '2025-03-30 09:04:16', '2025-03-30 09:05:34', 1, 'read'),
(39, 1, 2, 'adaaa', NULL, 1, '2025-03-30 09:04:19', '2025-03-30 09:04:29', 1, 'read'),
(40, 2, 1, 'aa', NULL, 1, '2025-03-30 09:04:21', '2025-03-30 09:05:34', 1, 'read'),
(41, 1, 2, 'aaa', NULL, 1, '2025-03-30 09:04:23', '2025-03-30 09:04:29', 1, 'read'),
(42, 1, 2, 'adad', NULL, 1, '2025-03-30 09:04:26', '2025-03-30 09:04:29', 1, 'read'),
(43, 2, 1, 'dasdsad', NULL, 1, '2025-03-30 09:04:28', '2025-03-30 09:05:34', 1, 'read'),
(44, 2, 1, 'aaa', NULL, 1, '2025-03-30 09:05:31', '2025-03-30 09:05:34', 1, 'read'),
(45, 1, 2, 'a', NULL, 1, '2025-03-30 09:05:39', '2025-03-30 09:07:53', 1, 'read'),
(46, 2, 1, 'as', NULL, 1, '2025-03-30 09:05:41', '2025-03-30 09:07:50', 1, 'read'),
(47, 1, 2, '2', NULL, 1, '2025-03-30 09:05:43', '2025-03-30 09:07:53', 1, 'read'),
(48, 2, 1, 'a', NULL, 1, '2025-03-30 09:05:45', '2025-03-30 09:07:50', 1, 'read'),
(49, 1, 2, 'asd', NULL, 1, '2025-03-30 09:05:47', '2025-03-30 09:07:53', 1, 'read'),
(50, 2, 1, 'test', NULL, 1, '2025-03-30 09:08:00', '2025-03-30 09:08:05', 1, 'read'),
(51, 1, 2, 'hello world', NULL, 1, '2025-03-30 09:08:05', '2025-03-30 09:08:08', 1, 'read'),
(52, 2, 1, 'sup', NULL, 1, '2025-03-30 09:08:08', '2025-03-30 09:08:37', 1, 'read'),
(53, 1, 2, 'se', NULL, 3, '2025-03-30 09:08:14', '2025-03-30 09:08:58', 4, 'read'),
(54, 2, 1, 'data', NULL, 1, '2025-03-30 09:08:18', '2025-03-30 09:08:37', 1, 'read'),
(55, 2, 1, 'aaaadadad', NULL, 1, '2025-03-30 09:08:27', '2025-03-30 09:08:37', 1, 'read'),
(56, 2, 1, 'how are you', NULL, 1, '2025-03-30 09:08:33', '2025-03-30 09:08:37', 1, 'read'),
(57, 1, 2, 'im fine', NULL, 1, '2025-03-30 09:08:41', '2025-03-30 09:08:45', 1, 'read'),
(58, 2, 1, 'okay', NULL, 1, '2025-03-30 09:08:47', '2025-03-30 09:08:51', 1, 'read'),
(59, 1, 2, 'yes', NULL, 1, '2025-03-30 09:08:51', '2025-03-30 09:08:57', 1, 'read'),
(60, 1, 2, 'test', NULL, 1, '2025-03-30 09:14:18', '2025-03-30 09:14:50', 1, 'read'),
(61, 1, 2, 'Hey', NULL, 3, '2025-03-30 09:14:29', '2025-03-30 09:14:38', 4, 'read'),
(62, 1, 2, 'sup', NULL, 2, '2025-03-30 09:14:35', '2025-03-30 09:14:50', 2, 'read'),
(63, 2, 1, 'hey', NULL, 3, '2025-03-30 09:14:41', '2025-03-30 09:29:42', 4, 'read'),
(64, 1, 2, 'test', NULL, 1, '2025-03-30 09:26:40', '2025-03-30 09:33:55', 1, 'read'),
(65, 1, 2, 'adasd', NULL, 1, '2025-03-30 09:26:56', '2025-03-30 09:33:55', 1, 'read'),
(66, 1, 2, 'adsadas', NULL, 1, '2025-03-30 09:27:00', '2025-03-30 09:33:55', 1, 'read'),
(67, 1, 2, 'adadas', NULL, 2, '2025-03-30 09:27:04', '2025-03-30 09:33:59', 2, 'read'),
(68, 1, 2, 'adad', NULL, 3, '2025-03-30 09:33:51', '2025-03-30 09:33:59', 4, 'read'),
(69, 2, 1, 'test', NULL, 1, '2025-03-30 09:33:57', '2025-03-30 09:34:03', 1, 'read'),
(70, 2, 1, 'asdasd', NULL, 2, '2025-03-30 09:34:01', '2025-03-30 09:34:04', 2, 'read'),
(71, 2, 1, 'aa', NULL, 2, '2025-03-30 09:34:14', '2025-03-30 09:36:06', 2, 'read'),
(72, 2, 1, 'aaa', NULL, 2, '2025-03-30 09:34:28', '2025-03-30 09:36:06', 2, 'read'),
(73, 1, 2, 'test', NULL, 1, '2025-03-30 09:35:56', '2025-03-30 09:36:11', 1, 'read'),
(74, 2, 1, 'dadas', NULL, 2, '2025-03-30 09:36:04', '2025-03-30 09:36:06', 2, 'read'),
(75, 1, 2, 'aa', NULL, 2, '2025-03-30 09:36:08', '2025-03-30 09:36:10', 2, 'read'),
(76, 1, 2, 'addsa', NULL, 3, '2025-03-30 09:37:46', '2025-03-30 09:37:49', 4, 'read'),
(77, 2, 1, 'test', NULL, 3, '2025-03-30 09:37:51', '2025-03-30 09:38:24', 4, 'read'),
(78, 2, 1, 'asdsdsa', NULL, 3, '2025-03-30 09:38:13', '2025-03-30 09:38:24', 4, 'read'),
(79, 2, 1, 'aaa', NULL, 3, '2025-03-30 09:38:22', '2025-03-30 09:38:24', 4, 'read'),
(80, 1, 2, 'adas', NULL, 3, '2025-03-30 09:38:24', '2025-03-30 09:38:27', 4, 'read'),
(81, 2, 1, 'adasdsa', NULL, 3, '2025-03-30 09:38:27', '2025-03-30 09:38:43', 4, 'read'),
(82, 2, 1, 'adssad', NULL, 3, '2025-03-30 09:38:38', '2025-03-30 09:38:43', 4, 'read'),
(83, 2, 1, 'adad', NULL, 3, '2025-03-30 09:38:41', '2025-03-30 09:38:43', 4, 'read'),
(84, 1, 2, 'dadas', NULL, 3, '2025-03-30 09:38:43', '2025-03-30 09:38:45', 4, 'read'),
(85, 2, 1, 'sdaasdsa', NULL, 3, '2025-03-30 09:38:45', '2025-03-30 09:38:51', 4, 'read'),
(86, 2, 1, 'asdads', NULL, 3, '2025-03-30 09:38:48', '2025-03-30 09:38:51', 4, 'read'),
(87, 1, 2, 'sadasdsa', NULL, 3, '2025-03-30 09:38:51', '2025-03-30 09:38:52', 4, 'read'),
(88, 2, 1, 'sadsadsad', NULL, 3, '2025-03-30 09:38:52', '2025-03-30 09:38:56', 4, 'read'),
(89, 1, 2, 'asdsad', NULL, 3, '2025-03-30 09:38:56', '2025-03-30 09:40:37', 4, 'read'),
(90, 1, 2, 'asasdada', NULL, 3, '2025-03-30 09:38:59', '2025-03-30 09:40:37', 4, 'read'),
(91, 1, 2, 'aaaa', NULL, 3, '2025-03-30 09:39:01', '2025-03-30 09:40:37', 4, 'read'),
(92, 1, 2, 'adasda', NULL, 3, '2025-03-30 09:39:04', '2025-03-30 09:40:37', 4, 'read'),
(93, 1, 2, 'aadas', NULL, 2, '2025-03-30 09:39:12', '2025-03-30 09:40:38', 2, 'read'),
(94, 2, 1, 'ada', NULL, 3, '2025-03-30 09:40:37', '2025-03-30 09:40:44', 4, 'read'),
(95, 2, 1, 'adsa', NULL, 2, '2025-03-30 09:40:39', '2025-03-30 09:42:09', 2, 'read'),
(96, 1, 2, 'ada', NULL, 3, '2025-03-30 09:40:45', '2025-03-30 09:41:53', 4, 'read'),
(97, 1, 2, 'aa', NULL, 1, '2025-03-30 09:40:58', '2025-03-30 09:44:50', 1, 'read'),
(98, 1, 2, 'test', NULL, 1, '2025-03-30 09:41:49', '2025-03-30 09:44:50', 1, 'read'),
(99, 2, 1, 'test', NULL, 3, '2025-03-30 09:41:55', '2025-03-30 09:41:59', 4, 'read'),
(100, 2, 1, 'adsad', NULL, 3, '2025-03-30 09:41:57', '2025-03-30 09:41:59', 4, 'read'),
(101, 1, 2, 'test', NULL, 3, '2025-03-30 09:42:03', '2025-03-30 09:42:29', 4, 'read'),
(102, 1, 2, 'test', NULL, 3, '2025-03-30 09:42:23', '2025-03-30 09:42:29', 4, 'read'),
(103, 2, 1, 'aaadada', NULL, 3, '2025-03-30 09:42:29', '2025-03-30 09:42:34', 4, 'read'),
(104, 1, 2, 'test', NULL, 3, '2025-03-30 09:42:34', '2025-03-30 09:44:05', 4, 'read'),
(105, 1, 2, 'test', NULL, 3, '2025-03-30 09:43:59', '2025-03-30 09:44:05', 4, 'read'),
(106, 2, 1, 'a', NULL, 3, '2025-03-30 09:44:05', '2025-03-30 09:44:08', 4, 'read'),
(107, 1, 2, 'adad', NULL, 3, '2025-03-30 09:44:23', '2025-03-30 09:44:27', 4, 'read'),
(108, 2, 1, 'asda', NULL, 3, '2025-03-30 09:44:29', '2025-03-30 09:44:32', 4, 'read'),
(109, 1, 2, 'aaa', NULL, 3, '2025-03-30 09:44:32', '2025-03-30 09:44:36', 4, 'read'),
(110, 2, 1, 'adasd', NULL, 1, '2025-03-30 09:44:52', '2025-03-30 09:44:55', 1, 'read'),
(111, 2, 1, 'adasd', NULL, 1, '2025-03-30 09:45:14', '2025-03-30 09:45:22', 1, 'read'),
(112, 2, 1, 'addsa', NULL, 1, '2025-03-30 09:46:18', '2025-03-30 09:46:24', 1, 'read'),
(113, 1, 2, 'aa', NULL, 1, '2025-03-30 09:46:24', '2025-03-30 09:46:27', 1, 'read'),
(114, 2, 1, 'aa', NULL, 1, '2025-03-30 09:47:10', '2025-03-30 09:48:23', 1, 'read'),
(115, 2, 1, 'aaa', NULL, 2, '2025-03-30 09:48:19', '2025-03-30 09:48:52', 2, 'read'),
(116, 1, 2, 'a', NULL, 1, '2025-03-30 09:48:23', '2025-03-30 09:51:44', 1, 'read'),
(117, 2, 1, 'test', NULL, 1, '2025-03-30 09:51:47', '2025-03-30 09:51:51', 1, 'read'),
(118, 1, 2, 'test', NULL, 1, '2025-03-30 09:51:53', '2025-03-30 10:21:52', 1, 'read'),
(119, 2, 1, 'asdsad', NULL, 3, '2025-03-30 09:51:56', '2025-03-30 09:52:10', 4, 'read'),
(120, 2, 1, 'adasdsa', NULL, 3, '2025-03-30 09:52:00', '2025-03-30 09:52:10', 4, 'read'),
(121, 2, 1, 'adsad', NULL, 2, '2025-03-30 09:52:05', '2025-03-30 09:52:12', 2, 'read'),
(122, 2, 1, 'test', NULL, 2, '2025-03-30 10:29:47', '2025-03-30 10:30:31', 2, 'read'),
(123, 2, 1, 'is it already done?', NULL, 2, '2025-03-30 10:30:06', '2025-03-30 10:30:31', 2, 'read'),
(124, 2, 1, 'test count', NULL, 3, '2025-03-30 10:30:13', '2025-03-30 10:30:21', 4, 'read'),
(130, 1, 2, 'Mobile', NULL, 5, '2025-03-30 10:46:38', '2025-03-30 11:10:05', 8, 'read'),
(131, 1, 2, '', '1743332996543.png', 5, '2025-03-30 11:09:56', '2025-03-30 11:10:05', 8, 'read'),
(132, 1, 2, 'ada', '1743339066294.jpg', 5, '2025-03-30 12:51:06', '2025-03-30 12:53:35', 8, 'read'),
(133, 1, 2, '', '1743339077211.jpg', 5, '2025-03-30 12:51:17', '2025-03-30 12:53:35', 8, 'read'),
(134, 1, 2, 'Hello there', NULL, 5, '2025-03-30 12:53:53', '2025-03-30 12:54:32', 8, 'read'),
(135, 2, 1, 'Hello there', NULL, 3, '2025-03-30 12:54:00', '2025-03-30 12:54:38', 4, 'read'),
(136, 1, 2, 'What sup', NULL, 5, '2025-03-30 12:54:05', '2025-03-30 12:54:32', 8, 'read'),
(137, 2, 1, 'yes?', NULL, 3, '2025-03-30 12:54:10', '2025-03-30 12:54:38', 4, 'read'),
(138, 2, 1, 'how are you?', NULL, 3, '2025-03-30 12:54:15', '2025-03-30 12:54:38', 4, 'read'),
(139, 3, 2, 'Pardon?', NULL, 6, '2025-03-30 12:56:07', '2025-03-30 12:56:16', 9, 'read'),
(140, 2, 3, 'Yes', NULL, 6, '2025-03-30 12:56:22', '2025-03-30 12:56:26', 9, 'read');

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
(1, 1, 2, '2025-03-30 06:07:56', 1),
(2, 1, 2, '2025-03-30 06:09:05', 2),
(3, 1, 2, '2025-03-30 06:10:40', 0),
(4, 1, 2, '2025-03-30 06:14:28', 3),
(5, 1, 2, '2025-03-30 08:09:46', 4),
(8, 1, 2, '2025-03-30 10:46:38', 5),
(9, 3, 2, '2025-03-30 12:56:07', 6);

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
(1, 2, 'Room 101', 'Lost And Found', 'Lost Charger', NULL, 'in_progress', 1, '2025-03-30 06:07:34', '2025-03-30 06:22:10', 0),
(2, 2, 'Room 102', 'Lost And Found', 'Lost Iphone', NULL, 'in_progress', 1, '2025-03-30 06:08:34', '2025-03-30 06:17:53', 0),
(3, 2, 'Room 103', 'Maintenance Report', 'Wifi Connection not reach', NULL, 'in_progress', 1, '2025-03-30 06:09:43', '2025-03-30 06:10:01', 0),
(4, 2, 'Room 105', 'Maintenance Report', 'No electricity', '1743321452847.jpg', 'resolved', 1, '2025-03-30 07:57:32', '2025-03-30 08:10:35', 0),
(5, 2, 'Rw', 'Maintenance Report', 'tesre', NULL, 'in_progress', 0, '2025-03-30 10:39:06', '2025-03-30 12:50:41', 0),
(6, 2, 'Room 109', '', 'Wifi connection', NULL, 'pending', 0, '2025-03-30 12:55:54', '2025-03-30 12:55:54', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','report-manager','maintenance-report-manager','incident-report-manager','student') NOT NULL DEFAULT 'student',
  `image_url` text DEFAULT NULL,
  `token` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `name`, `email`, `password`, `role`, `image_url`, `token`, `created_at`) VALUES
(1, 'Angelo Cabase', 'gelocabase1324@gmail.com', '', 'admin', 'https://lh3.googleusercontent.com/a/ACg8ocIlv3cFUPOQKg8WqnKj-4MmxKurV7cafCdGYdyn7gnylUmdKw=s96-c', '117007367720928788994', '2025-03-06 01:20:12'),
(2, 'angelo cabase', 'goldengrape777@gmail.com', '', 'student', 'https://lh3.googleusercontent.com/a/ACg8ocJOxHzxSWsE2Y9lZbo3ehJRvXXd-MfCG3XJrrGcZHjTmiCb0g=s96-c', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1ZjgyMTE3MTM3ODhiNjE0NTQ3NGI1MDI5YjAxNDFiZDViM2RlOWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1ODA1Njg3MjEwMTYtZjY5cWlxbzgyZGhsN3N1bG1zMWY1dWJyNTB0YnJmNmkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1ODA1Njg3MjEwMTYtaGFpNmkxdXBobXBlaDZqOW1vbTVpZjY2Nmg5dXY0MmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE1MjE5NDM4MzQ1MDU0MDM0MjgiLCJlbWFpbCI6ImdvbGRlbmdyYXBlNzc3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiYW5nZWxvIGNhYmFzZSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKT3hIenhTV3NFMlk5bFpibzNlaEpSdlhYZC1NZkNHM1hKcnJHY1pIalRtaUNiMGc9czk2LWMiLCJnaXZlbl9uYW1lIjoiYW5nZWxvIiwiZmFtaWx5X25hbWUiOiJjYWJhc2UiLCJpYXQiOjE3NDEyMjA5MjMsImV4cCI6MTc0MTIyNDUyM30.JkFjD2Slon2KIJREvqC7jria-SrBPwk_fny2-lQ00oSf-tC8dvy1SjYFp9qFExKJdGZWEUKuKvR_mzP8tjyAlAqT1w9Q3Q1W5MH76uNAApb-UtrnlzNLSvzebCBQ1U-cRX3uLf-x26UEIl09803QT5YfjUwHXW8hIcgwQwbZ5Qc6FLFWhMBKi3Qa_qkLylG0D-QrBaZ5lgRq_OaraMyiuOi9WCkN8Jz8_ufEjPuFAhowYQUW6il1P6rmohsLwuld9MXxru5CJxRz_LgHH3lLqO1gDzwzFlakrpdG5QvZxZeNbIuqdG9eSm2n8Q4BREXCseovEPjSme6sXfqiTALy7g', '2025-03-06 01:20:45'),
(3, 'Unknow User', 'cabase.1324@gmail.com', '', 'report-manager', 'https://lh3.googleusercontent.com/a/ACg8ocK6u11IUPdidaPGNtYlTBkjkLCL0qB6c9FCLu0uir5Fmi1KPA=s96-c', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1ZjgyMTE3MTM3ODhiNjE0NTQ3NGI1MDI5YjAxNDFiZDViM2RlOWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1ODA1Njg3MjEwMTYtZjY5cWlxbzgyZGhsN3N1bG1zMWY1dWJyNTB0YnJmNmkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1ODA1Njg3MjEwMTYtaGFpNmkxdXBobXBlaDZqOW1vbTVpZjY2Nmg5dXY0MmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTgxMTU5NDA5NzE4OTMyNDcyOTciLCJlbWFpbCI6ImNhYmFzZS4xMzI0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiVW5rbm93IFVzZXIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSzZ1MTFJVVBkaWRhUEdOdFlsVEJramtMQ0wwcUI2YzlGQ0x1MHVpcjVGbWkxS1BBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlVua25vdyIsImZhbWlseV9uYW1lIjoiVXNlciIsImlhdCI6MTc0MTIyNDc4NCwiZXhwIjoxNzQxMjI4Mzg0fQ.GxwsRhnYGhFbQIlW5IYSrPrBRnOcPZu6a_QcUKNuLkLUD47ewC2l2k5Cmf5PBmRzZaVI-rlJuU0Ba3ir27isOgm7Aw-HS3dM2zmDyxeTTcsp_GM4LJcqDnqQfY4lolbv9-T41xs-jgznJzwmkiurynmgAYTZtbuzMh6J9O1UDptdyAUiLq-Ae-czLr-mn_eFhb_0fum04bZvyo1IGJ6Z6TI5mVAvwTJn5gwGRyyD3xfN9f77QJ2UgrM6dVFAkuoNF2Wf2OjqXT18kycA64migkLtZr5c1KF7t3FmAW8YsAe7AQgRrtVcZUWtRCqiAG74xpyoCjhwhw8f4fxQILVLzw', '2025-03-06 01:33:04'),
(4, 'Gelo cabase', 'silverlemon777@gmail.com', '', 'student', 'https://lh3.googleusercontent.com/a/ACg8ocITGbrRqZygX5MG44XXn4gmpMGd6-bJTC0xK1yUWw6VDYxTfg=s96-c', '115140714590763332758', '2025-03-25 01:57:28');

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
(1, 2, 4, 'Report', 'Your report about Electrical at Room 105 has been marked as \"Resolved\".', 1, '2025-03-30 08:10:35', '2025-03-30 08:10:35', 0);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tbl_lost_found`
--
ALTER TABLE `tbl_lost_found`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_maintenance_reports`
--
ALTER TABLE `tbl_maintenance_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_messages`
--
ALTER TABLE `tbl_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- AUTO_INCREMENT for table `tbl_message_sessions`
--
ALTER TABLE `tbl_message_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tbl_reports`
--
ALTER TABLE `tbl_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_user_notifications`
--
ALTER TABLE `tbl_user_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_admin_notifications`
--
ALTER TABLE `tbl_admin_notifications`
  ADD CONSTRAINT `tbl_admin_notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE;

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
