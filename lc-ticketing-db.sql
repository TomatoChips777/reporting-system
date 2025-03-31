-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2025 at 10:25 AM
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
(1, 2, 1, 'Maintenance Report', 'New report submitted  issue at Room 101 ', 1, '2025-03-31 01:02:47'),
(2, 2, 9, 'Maintenance Report', 'New report submitted  issue at Room 105', 0, '2025-03-31 03:46:50'),
(3, 2, 10, 'Maintenance Report', 'New report submitted  issue at Room 107', 0, '2025-03-31 03:47:11'),
(4, 2, 11, 'Maintenance Report', 'New report submitted  issue at Room 106', 0, '2025-03-31 03:47:26'),
(5, 2, 12, 'Maintenance Report', 'New report submitted  issue at Room 108', 0, '2025-03-31 03:47:43'),
(6, 2, 13, 'Maintenance Report', 'New report submitted  issue at Room 105', 0, '2025-03-31 05:06:29');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_claims`
--

CREATE TABLE `tbl_claims` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `claimer_id` int(11) NOT NULL,
  `holder_id` int(11) NOT NULL,
  `status` enum('accepted','under_review','rejected') DEFAULT 'under_review',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 2, 2, 'found', 'Backpack', 'bag', 'Found a backpack at room 102', 'Room 102', '2025-03-31 09:08:56', 'open', NULL, '', 1, 0),
(2, 2, 3, 'lost', 'Iphone', 'accessories', 'Iphone with black color with stickers', 'Room 105', '2025-03-31 09:16:57', 'open', NULL, '', 0, 0),
(3, 2, 4, 'lost', 'Tumbler', 'accessories', 'Lost my tumbler i think around room 107', 'Room 107', '2025-03-31 09:20:22', 'open', NULL, '', 1, 0),
(4, 2, 5, 'found', 'Envelopes', 'stationery', 'Found envelops around library', 'Library', '2025-03-31 09:22:34', 'open', NULL, '', 0, 0),
(5, 2, 6, 'found', 'Mobile Phone', 'accessories', 'Found mobile phone at room 102', 'Room 102', '2025-03-31 09:24:04', 'open', NULL, '', 0, 0),
(6, 1, 7, 'found', 'Iphone', 'accessories', 'Found Iphone at room 105', 'Room 105', '2025-03-31 09:40:39', 'open', NULL, '', 1, 0),
(7, 1, 8, 'found', 'Blue Tumbler', 'other', 'Found Blue tumbler at room 107', 'Room 107', '2025-03-31 09:52:55', 'open', NULL, '', 0, 0);

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
(1, 1, 'Electrical', 'Medium', ''),
(2, 12, 'Cleaning', 'Medium', ''),
(3, 11, 'General Repair', 'Urgent', ''),
(4, 10, 'Plumbing', 'Medium', ''),
(5, 9, 'Electrical', 'Medium', ''),
(6, 13, 'General Repair', 'Urgent', '');

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
  `status` varchar(20) NOT NULL,
  `action` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_messages`
--

INSERT INTO `tbl_messages` (`id`, `sender_id`, `receiver_id`, `message`, `image_path`, `report_id`, `created_at`, `updated_at`, `message_session_id`, `status`, `action`) VALUES
(1, 1, 2, 'Test message', NULL, 1, '2025-03-31 01:04:08', '2025-03-31 01:47:48', 1, 'read', ''),
(2, 1, 2, 'Test message 2', NULL, 1, '2025-03-31 01:04:19', '2025-03-31 01:47:48', 1, 'read', ''),
(3, 1, 2, 'Test message 3', NULL, 1, '2025-03-31 01:04:28', '2025-03-31 01:47:48', 1, 'read', ''),
(4, 1, 2, 'Test message 4', NULL, 1, '2025-03-31 01:04:49', '2025-03-31 01:47:48', 1, 'read', ''),
(5, 1, 2, 'Test message 5', NULL, 1, '2025-03-31 01:04:56', '2025-03-31 01:47:48', 1, 'read', ''),
(6, 2, 1, 'goodmorning', NULL, 1, '2025-03-31 01:47:58', '2025-03-31 01:48:08', 1, 'read', ''),
(7, 2, 1, 'Test message', NULL, 1, '2025-03-31 01:48:24', '2025-03-31 03:01:27', 1, 'read', ''),
(8, 2, 1, 'Test message 2', NULL, 1, '2025-03-31 01:48:32', '2025-03-31 03:01:27', 1, 'read', ''),
(10, 1, 2, 'Test message from lost and found', NULL, 6, '2025-03-31 01:49:21', '2025-03-31 01:49:27', 3, 'read', ''),
(11, 2, 1, 'check mic', NULL, 6, '2025-03-31 01:50:06', '2025-03-31 02:06:00', 3, 'read', ''),
(13, 2, 1, 'Test', NULL, 7, '2025-03-31 01:51:51', '2025-03-31 02:50:12', 4, 'read', ''),
(15, 1, 2, 'Test from lost and found dashboard', NULL, 6, '2025-03-31 02:05:50', '2025-03-31 02:05:55', 3, 'read', ''),
(16, 2, 1, 'test', NULL, 6, '2025-03-31 02:05:57', '2025-03-31 02:06:00', 3, 'read', ''),
(17, 1, 2, 'test', NULL, 6, '2025-03-31 02:06:03', '2025-03-31 02:46:26', 3, 'read', ''),
(18, 1, 2, 'Test 2', NULL, 6, '2025-03-31 02:06:13', '2025-03-31 02:46:26', 3, 'read', ''),
(19, 2, 1, 'Hello world', NULL, 6, '2025-03-31 02:46:36', '2025-03-31 02:47:59', 3, 'read', ''),
(20, 1, 2, 'localhost', NULL, 6, '2025-03-31 02:48:08', '2025-03-31 02:49:35', 3, 'read', ''),
(21, 1, 2, 'localhost:5000', NULL, 6, '2025-03-31 02:48:19', '2025-03-31 02:49:35', 3, 'read', ''),
(22, 1, 2, 'api/message/get-messages/2', NULL, 6, '2025-03-31 02:48:36', '2025-03-31 02:49:35', 3, 'read', ''),
(23, 1, 2, '`${data}``````', NULL, 6, '2025-03-31 02:48:59', '2025-03-31 02:49:35', 3, 'read', ''),
(24, 2, 1, '????', NULL, 6, '2025-03-31 02:49:36', '2025-03-31 02:50:10', 3, 'read', ''),
(25, 2, 1, '????????????????????????????????????????????????????????', NULL, 6, '2025-03-31 02:49:41', '2025-03-31 02:50:10', 3, 'read', ''),
(26, 2, 1, 'test', NULL, 6, '2025-03-31 03:01:01', '2025-03-31 03:01:06', 3, 'read', ''),
(27, 1, 2, '<><><><><><><><><><><><>><><><><>><<>', NULL, 6, '2025-03-31 03:01:13', '2025-03-31 03:01:17', 3, 'read', ''),
(28, 2, 1, 'aaaaaaaaaaaaaaaaaaaaaaaaaa', NULL, 6, '2025-03-31 03:01:17', '2025-03-31 03:01:23', 3, 'read', ''),
(29, 2, 1, 'Message test', NULL, 7, '2025-03-31 03:08:25', '2025-03-31 05:37:13', 4, 'read', ''),
(30, 2, 1, '', '1743390515772.jpg', 6, '2025-03-31 03:08:35', '2025-03-31 05:37:08', 3, 'read', ''),
(31, 2, 1, 'Message text', NULL, 1, '2025-03-31 03:08:47', '2025-03-31 03:08:57', 1, 'read', ''),
(32, 2, 1, 'Messages count', NULL, 1, '2025-03-31 03:10:44', '2025-03-31 05:36:55', 1, 'read', ''),
(33, 1, 2, 'test', NULL, 1, '2025-03-31 05:37:01', '2025-03-31 05:38:03', 1, 'read', ''),
(34, 1, 2, 'aa', NULL, 6, '2025-03-31 05:50:59', '2025-03-31 05:51:10', 3, 'read', ''),
(35, 1, 2, 'Requesting to claim this item', NULL, 6, '2025-03-31 05:54:34', '2025-03-31 05:54:46', 3, 'read', ''),
(36, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 05:54:51', '2025-03-31 05:55:21', 3, 'read', ''),
(37, 1, 2, 'Requesting to claim this item', NULL, 6, '2025-03-31 05:55:39', '2025-03-31 05:55:44', 3, 'read', ''),
(38, 2, 1, 'Requesting to claim this item', NULL, 6, '2025-03-31 05:55:48', '2025-03-31 05:55:55', 3, 'read', ''),
(39, 1, 2, 'Requesting to claim this item.', NULL, 6, '2025-03-31 05:56:01', '2025-03-31 05:56:08', 3, 'read', ''),
(40, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 05:56:12', '2025-03-31 05:56:18', 3, 'read', ''),
(41, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 05:58:15', '2025-03-31 05:59:00', 3, 'read', ''),
(42, 2, 1, 'senderId.', NULL, 6, '2025-03-31 05:59:35', '2025-03-31 06:08:34', 3, 'read', ''),
(43, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 05:59:42', '2025-03-31 06:08:34', 3, 'read', ''),
(44, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:00:09', '2025-03-31 06:08:34', 3, 'read', 'claim'),
(45, 1, 2, 'test', NULL, 6, '2025-03-31 06:14:04', '2025-03-31 06:14:41', 3, 'read', ''),
(46, 2, 1, 'test', NULL, 6, '2025-03-31 06:14:41', '2025-03-31 06:15:07', 3, 'read', 'claim'),
(47, 1, 2, 'test', NULL, 6, '2025-03-31 06:15:14', '2025-03-31 06:15:40', 3, 'read', 'claim'),
(48, 2, 1, 'adad', NULL, 6, '2025-03-31 06:44:19', '2025-03-31 06:54:20', 3, 'read', NULL),
(49, 2, 1, 'test', NULL, 6, '2025-03-31 06:44:26', '2025-03-31 06:54:20', 3, 'read', NULL),
(50, 2, 1, 'www', NULL, 6, '2025-03-31 06:44:28', '2025-03-31 06:54:20', 3, 'read', NULL),
(51, 2, 1, 'a', NULL, 6, '2025-03-31 06:44:29', '2025-03-31 06:54:20', 3, 'read', NULL),
(52, 2, 1, 's', NULL, 6, '2025-03-31 06:44:30', '2025-03-31 06:54:20', 3, 'read', NULL),
(53, 2, 1, 'd', NULL, 6, '2025-03-31 06:44:31', '2025-03-31 06:54:20', 3, 'read', NULL),
(54, 2, 1, 'e', NULL, 6, '2025-03-31 06:44:32', '2025-03-31 06:54:20', 3, 'read', NULL),
(55, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:54:05', '2025-03-31 06:54:20', 3, 'read', 'claim'),
(56, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:54:24', '2025-03-31 06:54:56', 3, 'read', 'claim'),
(57, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:54:58', '2025-03-31 06:56:35', 3, 'read', 'claim'),
(58, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:32', '2025-03-31 06:56:35', 3, 'read', 'claim'),
(59, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:39', '2025-03-31 06:57:17', 3, 'read', 'claim'),
(60, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:44', '2025-03-31 06:57:17', 3, 'read', 'claim'),
(61, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:45', '2025-03-31 06:57:17', 3, 'read', 'claim'),
(62, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:45', '2025-03-31 06:57:17', 3, 'read', 'claim'),
(63, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:46', '2025-03-31 06:57:17', 3, 'read', 'claim'),
(64, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:46', '2025-03-31 06:57:17', 3, 'read', 'claim'),
(65, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:46', '2025-03-31 06:57:17', 3, 'read', 'claim'),
(66, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:46', '2025-03-31 06:57:17', 3, 'read', 'claim'),
(67, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:56:46', '2025-03-31 06:57:17', 3, 'read', 'claim'),
(68, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:57:20', '2025-03-31 06:57:54', 3, 'read', 'claim'),
(69, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 06:57:59', '2025-03-31 06:59:27', 3, 'read', 'claim'),
(70, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 07:04:02', '2025-03-31 07:04:02', 3, '', 'claim'),
(71, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 07:04:07', '2025-03-31 07:04:07', 3, '', 'claim'),
(72, 2, 1, 'Requesting to claim this item.', NULL, 6, '2025-03-31 07:07:16', '2025-03-31 07:07:16', 3, '', 'claim'),
(73, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:08:38', '2025-03-31 07:25:33', 1, 'read', 'claim'),
(74, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:16:51', '2025-03-31 07:25:33', 1, 'read', 'claim'),
(75, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:18:13', '2025-03-31 07:25:33', 1, 'read', 'claim'),
(76, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:25:40', '2025-03-31 07:27:44', 1, 'read', 'claim'),
(77, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:27:51', '2025-03-31 07:34:36', 1, 'read', 'claim'),
(78, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:35:35', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(79, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:08', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(80, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:15', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(81, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:15', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(82, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:15', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(83, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:15', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(84, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:15', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(85, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:15', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(86, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:16', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(87, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:16', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(88, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:16', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(89, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:16', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(90, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:16', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(91, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:17', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(92, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:17', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(93, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:17', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(94, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:17', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(95, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:23', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(96, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:24', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(97, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:24', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(98, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:24', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(99, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:25', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(100, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:25', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(101, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:25', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(102, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:26', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(103, 1, 2, 'test', NULL, 1, '2025-03-31 07:38:28', '2025-03-31 07:43:01', 1, 'read', NULL),
(104, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:28', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(105, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:29', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(106, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:29', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(107, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:30', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(108, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:30', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(109, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:30', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(110, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:31', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(111, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:31', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(112, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:31', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(113, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:32', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(114, 1, 2, 'test', NULL, 1, '2025-03-31 07:38:34', '2025-03-31 07:43:01', 1, 'read', NULL),
(115, 1, 2, '', '1743406719156.jpg', 1, '2025-03-31 07:38:39', '2025-03-31 07:43:01', 1, 'read', NULL),
(116, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:39', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(117, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:40', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(118, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:41', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(119, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:41', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(120, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:42', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(121, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:38:42', '2025-03-31 07:43:01', 1, 'read', 'claim'),
(122, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:43:04', '2025-03-31 07:43:40', 1, 'read', 'claim'),
(123, 2, 1, 'test', NULL, 1, '2025-03-31 07:43:40', '2025-03-31 08:06:53', 1, 'read', NULL),
(124, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 07:43:51', '2025-03-31 08:06:54', 1, 'read', 'claim'),
(125, 2, 1, 'A', NULL, 1, '2025-03-31 08:07:02', '2025-03-31 08:11:47', 1, 'read', NULL),
(126, 1, 2, 'Requesting to claim this item.', NULL, 1, '2025-03-31 08:07:05', '2025-03-31 08:08:06', 1, 'read', 'claim'),
(127, 2, 1, 'show proof that this item is belong to you', NULL, 1, '2025-03-31 08:08:06', '2025-03-31 08:11:47', 1, 'read', NULL),
(128, 2, 1, 'Requesting to claim this item.', NULL, 1, '2025-03-31 08:23:26', '2025-03-31 08:23:26', 1, '', 'claim');

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
(4, 2, 1, '2025-03-31 01:51:51', 7);

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
(1, 2, 'Room 101 ', 'Maintenance Report', 'Short circuit', NULL, 'in_progress', 1, '2025-03-23 01:02:47', '2025-03-31 03:58:14', 0),
(2, 2, 'Room 102', 'Lost And Found', 'Found a backpack at room 102', NULL, 'in_progress', 1, '2025-03-31 01:08:56', '2025-03-31 01:08:56', 0),
(3, 2, 'Room 105', 'Lost And Found', 'Iphone with black color with stickers', NULL, 'in_progress', 0, '2025-03-31 01:16:57', '2025-03-31 01:16:57', 0),
(4, 2, 'Room 107', 'Lost And Found', 'Lost my tumbler i think around room 107', NULL, 'in_progress', 0, '2025-03-31 01:20:22', '2025-03-31 01:20:22', 0),
(5, 2, 'Library', 'Lost And Found', 'Found envelops around library', NULL, 'in_progress', 0, '2025-03-31 01:22:34', '2025-03-31 01:22:34', 0),
(6, 2, 'Room 102', 'Lost And Found', 'Found mobile phone at room 102', NULL, 'in_progress', 0, '2025-03-31 01:24:04', '2025-03-31 01:24:04', 0),
(7, 1, 'Room 105', 'Lost And Found', 'Found Iphone at room 105', NULL, 'in_progress', 1, '2025-03-31 01:40:39', '2025-03-31 01:40:39', 0),
(8, 1, 'Room 107', 'Lost And Found', 'Found Blue tumbler at room 107', NULL, 'in_progress', 0, '2025-03-31 01:52:55', '2025-03-31 01:55:55', 0),
(9, 2, 'Room 105', 'Maintenance Report', 'No current', NULL, 'in_progress', 0, '2025-04-01 03:46:50', '2025-03-31 03:58:32', 0),
(10, 2, 'Room 107', 'Maintenance Report', 'AC not working', NULL, 'in_progress', 0, '2025-03-24 03:47:11', '2025-03-31 03:58:36', 0),
(11, 2, 'Room 106', 'Maintenance Report', 'No wifi', NULL, 'in_progress', 0, '2025-03-30 03:47:26', '2025-03-31 03:58:40', 0),
(12, 2, 'Room 108', 'Maintenance Report', 'Dirty chairs', NULL, 'in_progress', 0, '2025-03-31 03:47:43', '2025-03-31 03:48:07', 0),
(13, 2, 'Room 105', 'Maintenance Report', 'Broken glass', NULL, 'in_progress', 1, '2025-03-31 05:06:29', '2025-03-31 05:06:45', 0);

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
(4, 'Gelo cabase', 'silverlemon777@gmail.com', '', 'maintenance-report-manager', 'https://lh3.googleusercontent.com/a/ACg8ocITGbrRqZygX5MG44XXn4gmpMGd6-bJTC0xK1yUWw6VDYxTfg=s96-c', '115140714590763332758', '2025-03-25 01:57:28');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbl_claims`
--
ALTER TABLE `tbl_claims`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tbl_lost_found`
--
ALTER TABLE `tbl_lost_found`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_maintenance_reports`
--
ALTER TABLE `tbl_maintenance_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbl_messages`
--
ALTER TABLE `tbl_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;

--
-- AUTO_INCREMENT for table `tbl_message_sessions`
--
ALTER TABLE `tbl_message_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_reports`
--
ALTER TABLE `tbl_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_user_notifications`
--
ALTER TABLE `tbl_user_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
