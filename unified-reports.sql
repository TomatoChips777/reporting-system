-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 25, 2025 at 06:06 AM
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
-- Database: `unified-reports`
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
(1, 2, 1, 'Maintenance Report', 'New report submitted plumbing issue at Building 101', 0, '2025-03-13 02:32:50'),
(3, 2, 3, 'Maintenance Report', 'New report submitted plumbing issue at asdasd', 0, '2025-03-13 03:39:12'),
(4, 2, 4, 'Maintenance Report', 'New report submitted electrical issue at sadasdsa', 0, '2025-03-13 03:39:24'),
(5, 2, 5, 'Maintenance Report', 'New report submitted electrical issue at test', 0, '2025-03-13 06:20:14'),
(6, 2, 6, 'Maintenance Report', 'New report submitted electrical issue at sadsad', 0, '2025-03-13 06:23:41'),
(7, 2, 7, 'Maintenance Report', 'New report submitted electrical issue at sadsad', 0, '2025-03-13 07:15:24'),
(8, 2, 8, 'Maintenance Report', 'New report submitted electrical issue at sadsad', 0, '2025-03-13 07:15:54'),
(9, 2, 9, 'Maintenance Report', 'New report submitted electrical issue at sadsad', 0, '2025-03-13 07:19:39'),
(10, 2, 10, 'Maintenance Report', 'New report submitted structural issue at sadsadssda', 0, '2025-03-13 07:48:53'),
(11, 2, 11, 'Maintenance Report', 'New report submitted structural issue at Data', 0, '2025-03-13 07:55:31'),
(12, 2, 12, 'Maintenance Report', 'New report submitted safety issue at sadsadssda', 0, '2025-03-13 07:59:05'),
(13, 2, 13, 'Maintenance Report', 'New report submitted safety issue at sadsadssda', 0, '2025-03-13 08:00:47'),
(14, 2, 14, 'Maintenance Report', 'New report submitted structural issue at Data', 0, '2025-03-14 00:31:19'),
(15, 2, 15, 'Maintenance Report', 'New report submitted safety issue at sadsadssda', 0, '2025-03-14 00:31:30'),
(16, 2, 16, 'Maintenance Report', 'New report submitted structural issue at Data', 0, '2025-03-14 00:35:49'),
(17, 2, 17, 'Maintenance Report', 'New report submitted structural issue at Data', 0, '2025-03-14 00:36:31'),
(18, 2, 18, 'Maintenance Report', 'New report submitted safety issue at sadsadssda', 0, '2025-03-14 00:36:44'),
(19, 2, 19, 'Maintenance Report', 'New report submitted electrical issue at sadsad', 0, '2025-03-14 00:37:02'),
(20, 2, 20, 'Maintenance Report', 'New report submitted electrical issue at sadsad', 0, '2025-03-14 00:37:23'),
(21, 2, 21, 'Maintenance Report', 'New report submitted electrical issue at sadsad', 0, '2025-03-14 00:44:37'),
(22, 2, 22, 'Maintenance Report', 'New report submitted electrical issue at sadsad', 0, '2025-03-14 00:45:32'),
(23, 2, 23, 'Maintenance Report', 'New report submitted safety issue at sadsadssda', 0, '2025-03-14 00:46:03'),
(24, 2, 24, 'Maintenance Report', 'New report submitted structural issue at sadsadssda', 0, '2025-03-14 00:46:39'),
(25, 2, 25, 'Maintenance Report', 'New report submitted structural issue at sadsadssda', 0, '2025-03-14 00:49:38'),
(26, 2, 26, 'Maintenance Report', 'New report submitted plumbing issue at Building 1', 0, '2025-03-14 03:21:20'),
(27, 2, 27, 'Maintenance Report', 'New report submitted plumbing issue at Building 1', 0, '2025-03-14 03:25:11'),
(28, 2, 28, 'Maintenance Report', 'New report submitted plumbing issue at Building 1', 0, '2025-03-14 03:33:19'),
(29, 2, 29, 'Maintenance Report', 'New report submitted plumbing issue at Building 1', 0, '2025-03-14 03:36:56'),
(30, 2, 30, 'Maintenance Report', 'New report submitted structural issue at sadsadssda', 0, '2025-03-14 03:40:37'),
(31, 2, 31, 'Maintenance Report', 'New report submitted structural issue at sadsadssda', 0, '2025-03-14 03:56:49'),
(32, 2, 32, 'Maintenance Report', 'New report submitted structural issue at sadsadssda', 0, '2025-03-14 04:57:40'),
(33, 2, 33, 'Maintenance Report', 'New report submitted structural issue at sadsadssda', 0, '2025-03-14 05:00:33'),
(34, 2, 34, 'Maintenance Report', 'New report submitted structural issue at sadsadssda', 0, '2025-03-14 05:01:24'),
(35, 2, 35, 'Maintenance Report', 'New report submitted structural issue at sadsadssda', 0, '2025-03-14 05:08:40'),
(36, 2, 36, 'Maintenance Report', 'New report submitted structural issue at sadsadssda', 0, '2025-03-14 05:10:02'),
(37, 2, 37, 'Maintenance Report', 'New report submitted structural issue at sadsadssda', 0, '2025-03-14 05:11:05'),
(38, 2, 38, 'Maintenance Report', 'New report submitted electrical issue at sadsad', 0, '2025-03-14 05:12:54'),
(39, 2, 39, 'Maintenance Report', 'New report submitted electrical issue at sadsad', 0, '2025-03-14 05:22:26'),
(40, 2, 40, 'Maintenance Report', 'New report submitted electrical issue at sadsad', 0, '2025-03-14 05:24:46'),
(41, 2, 41, 'Maintenance Report', 'New report submitted safety issue at sadsadssda', 0, '2025-03-14 05:24:53'),
(42, 2, 42, 'Maintenance Report', 'New report submitted structural issue at sadsadssda', 0, '2025-03-14 05:25:10'),
(57, 2, 4, 'Maintenance Report', 'New report submitted data issue at data', 0, '2025-03-17 01:25:23'),
(58, 2, 5, 'Maintenance Report', 'New report submitted data issue at data', 0, '2025-03-17 01:28:32'),
(59, 3, 6, 'Maintenance Report', 'New report submitted plumbing issue at Location', 0, '2025-03-17 01:56:00'),
(60, 3, 7, 'Maintenance Report', 'New report submitted test issue at test', 0, '2025-03-17 05:51:24'),
(61, 3, 8, 'Maintenance Report', 'New report submitted Data issue at Location', 0, '2025-03-17 05:51:31'),
(65, 1, 60, 'Lost And Found Report', 'A new found item \"test\" has been reported at test.', 0, '2025-03-17 07:37:04'),
(66, 2, 9, 'Maintenance Report', 'New report submitted plumbing issue at test', 0, '2025-03-17 07:38:03'),
(67, 1, 60, 'Lost And Found Report', 'A new lost item \"Lost Data\" has been reported at Localhost:5000.', 0, '2025-03-17 08:25:20'),
(68, 3, 10, 'Maintenance Report', 'New report submitted plumbing issue at asdsadasdasd', 0, '2025-03-18 01:30:06'),
(69, 3, 11, 'Maintenance Report', 'New report submitted electrical issue at asdasdas', 0, '2025-03-18 01:36:36'),
(70, 1, 60, 'Lost And Found Report', 'A new found item \"          \" has been reported at                       .', 0, '2025-03-18 03:18:12'),
(71, 1, 60, 'Lost And Found Report', 'A new lost item \"Test\" has been reported at test.', 0, '2025-03-18 03:48:53'),
(73, 3, 22, 'Lost And Found Report', 'A new found item \"asdasd\" has been reported at asdsad.', 0, '2025-03-18 06:40:48'),
(74, 3, 12, 'Maintenance Report', 'New report submitted asdasd issue at asdsad', 0, '2025-03-18 07:04:31'),
(75, 3, 13, 'Maintenance Report', 'New report submitted World issue at World', 0, '2025-03-18 07:04:42'),
(76, 3, 14, 'Maintenance Report', 'New report submitted electrical issue at asdsa', 0, '2025-03-18 07:54:45'),
(77, 3, 15, 'Maintenance Report', 'New report submitted cleaning issue at asdsadasa', 0, '2025-03-18 07:54:52');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_claim_items`
--

CREATE TABLE `tbl_claim_items` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `claimer_id` int(11) NOT NULL,
  `holder_id` int(11) NOT NULL,
  `status` enum('accepted','under_review','rejected') DEFAULT 'under_review',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_claim_items`
--

INSERT INTO `tbl_claim_items` (`id`, `item_id`, `claimer_id`, `holder_id`, `status`, `created_at`) VALUES
(1, 16, 2, 3, 'under_review', '2025-03-24 02:29:21'),
(2, 18, 2, 3, 'under_review', '2025-03-24 02:29:36'),
(3, 1, 3, 2, 'under_review', '2025-03-24 02:32:33'),
(4, 9, 3, 2, 'under_review', '2025-03-24 02:33:11'),
(5, 9, 2, 3, 'under_review', '2025-03-24 02:37:01'),
(6, 14, 3, 2, 'under_review', '2025-03-24 03:39:01'),
(7, 15, 2, 3, 'under_review', '2025-03-24 03:46:49'),
(8, 16, 3, 2, 'under_review', '2025-03-25 00:19:34'),
(9, 15, 3, 2, 'under_review', '2025-03-25 00:20:21'),
(10, 18, 3, 2, 'under_review', '2025-03-25 00:39:52'),
(11, 14, 2, 3, 'under_review', '2025-03-25 00:41:03'),
(12, 18, 4, 3, 'under_review', '2025-03-25 01:57:38'),
(13, 6, 4, 2, 'under_review', '2025-03-25 01:59:02'),
(14, 18, 3, 4, 'under_review', '2025-03-25 01:59:29'),
(15, 16, 4, 2, 'under_review', '2025-03-25 02:53:29'),
(16, 14, 4, 2, 'under_review', '2025-03-25 02:53:48'),
(17, 16, 2, 4, 'under_review', '2025-03-25 02:59:16'),
(18, 14, 2, 4, 'under_review', '2025-03-25 03:02:22'),
(19, 16, 2, 2, 'under_review', '2025-03-25 03:39:45');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_conversations`
--

CREATE TABLE `tbl_conversations` (
  `id` int(11) NOT NULL,
  `user1_id` int(11) NOT NULL,
  `user2_id` int(11) NOT NULL,
  `report_id` int(11) DEFAULT NULL,
  `last_message` text DEFAULT NULL,
  `last_message_time` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_found_items`
--

CREATE TABLE `tbl_found_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `archived` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_found_items`
--

INSERT INTO `tbl_found_items` (`id`, `user_id`, `item_id`, `location`, `description`, `image`, `created_at`, `archived`) VALUES
(1, 3, 11, 'test', 'test', '1742275631984-504264623.jpg', '2025-03-18 05:27:11', 0),
(2, 3, 11, 'tr', 'sasd', NULL, '2025-03-18 05:43:08', 0),
(3, 3, 10, 'zx', 'zxc', '1742277034015-709964448.jpg', '2025-03-18 05:50:34', 0),
(4, 3, 11, 'zczczc', 'zczczczc', NULL, '2025-03-18 05:50:40', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_lost_found`
--

CREATE TABLE `tbl_lost_found` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
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

INSERT INTO `tbl_lost_found` (`id`, `user_id`, `type`, `item_name`, `category`, `description`, `location`, `date_reported`, `status`, `image_path`, `contact_info`, `is_anonymous`, `archived`) VALUES
(1, 2, 'found', 'test', 'other', 'test', 'test', '2025-03-14 14:31:10', 'open', '1741933870270-993383866.jpg', 'test', 1, 0),
(2, 2, 'found', 'electrical', 'electronics', 'test', 'test', '2025-03-14 14:31:46', 'open', '1741933811366.jpg', 'testy', 1, 1),
(3, 2, 'found', 'data', 'clothing', 'data', 'data', '2025-03-14 15:15:57', 'open', NULL, 'data', 1, 1),
(4, 2, 'found', 'data', 'clothing', 'data', 'data', '2025-03-14 15:19:06', 'open', '1741936727753.jpg', 'Data', 1, 1),
(5, 2, 'found', 'data', 'clothing', 'data', 'data', '2025-03-14 15:20:17', 'open', '1741936817494-649589014.jpg', 'data', 1, 1),
(6, 2, 'found', 'Hello', 'electronics', 'test', 'test', '2025-03-17 09:35:39', 'open', NULL, 'test', 0, 0),
(7, 3, 'found', 'Data', 'clothing', 'Sample', 'Location', '2025-03-17 09:56:25', 'open', '1742176560143.jpg', 'Sample', 1, 1),
(8, 3, 'found', 'test', 'clothing', 'testastestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasddasdasdsadasdasd', 'test', '2025-03-17 09:57:29', 'open', NULL, 'test', 0, 1),
(9, 2, 'found', 'Hello World', 'bag', 'test', 'test', '2025-03-17 11:04:09', 'open', NULL, 'test', 1, 0),
(10, 2, 'lost', 'Data', 'accessories', 'Data', 'test', '2025-03-17 11:04:38', 'open', '1742180678406-514449952.jpg', 'Data', 1, 0),
(11, 2, 'lost', 'Test', 'clothing', 'Electronic', 'Sample', '2025-03-17 11:50:49', 'open', '1742183449460-757421667.jpg', 'Test', 1, 0),
(12, 3, 'found', 'Welcome to Localhost', 'accessories', 'Localhost Description', 'Location', '2025-03-17 15:05:42', 'open', '1742176560143.jpg', 'None', 1, 1),
(13, 3, 'found', 'Chicken', 'keys', 'Chicken Phone\r\n', 'Chicken', '2025-03-17 15:21:16', 'open', '1742196076589-744257297.jpg', 'Chicken', 1, 1),
(14, 2, 'found', '', 'other', 'Pork', 'Pork`', '2025-03-17 15:28:44', 'open', '1742196524834-639267848.jpg', 'Pork', 1, 0),
(15, 2, 'found', 'test', 'clothing', 'test', 'test', '2025-03-17 15:33:35', 'open', NULL, 'test', 1, 0),
(16, 2, 'found', 'test', 'electronics', 'test', 'test', '2025-03-17 15:37:04', 'open', NULL, 'test', 1, 0),
(17, 3, 'lost', 'Lost Data', 'other', 'Lost Data From Localhost', 'Localhost:5000', '2025-03-17 16:25:20', 'open', '1742199920344-281813429.jpg', 'Localhost:5000/api/users', 1, 1),
(18, 3, 'found', 'Data', 'electronics', 'Data', 'Data', '2025-03-18 11:18:12', 'open', NULL, 'Data', 1, 0),
(19, 3, 'lost', 'Test', 'electronics', 'test', 'test', '2025-03-18 11:48:53', 'open', '1742269733569-784827329.jpg', 'test', 1, 0),
(20, 3, 'lost', 'test', 'clothing', 'tssssssssssssssss', 'tesssssssssssssssssssssssssssssss', '2025-03-18 14:15:48', 'open', '1742278548521-728090441.jpg', 'tttttttttttttttttttttttt', 1, 0),
(21, 3, 'found', 'World', 'electronics', 'World', 'World', '2025-03-18 14:17:49', 'open', NULL, 'World', 1, 1),
(22, 3, 'found', 'asdasd', 'clothing', 'adsadsa', 'asdsad', '2025-03-18 14:40:48', 'open', NULL, 'asdassd', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_messages`
--

CREATE TABLE `tbl_messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `report_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_reports`
--

CREATE TABLE `tbl_reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `location` varchar(255) NOT NULL,
  `issue_type` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `status` enum('pending','in_progress','resolved') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archived` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_reports`
--

INSERT INTO `tbl_reports` (`id`, `user_id`, `location`, `issue_type`, `description`, `image_path`, `status`, `created_at`, `updated_at`, `archived`) VALUES
(1, 2, 'test', 'electrical', 'test', '1741933811366.jpg', 'pending', '2025-03-14 06:30:11', '2025-03-14 06:31:46', 1),
(3, 2, 'data', 'data', 'data', '1741936727753.jpg', 'pending', '2025-03-14 07:17:02', '2025-03-14 07:19:06', 1),
(4, 2, 'data', 'data', 'data', '1741936817494-649589014.jpg', 'pending', '2025-03-17 01:25:23', '2025-03-17 01:25:23', 0),
(5, 2, 'data', 'data', 'data', '1741936727753.jpg', 'pending', '2025-03-17 01:28:32', '2025-03-17 01:28:32', 0),
(6, 3, 'Location', 'plumbing', 'Sample', '1742176560143.jpg', 'pending', '2025-03-17 01:56:00', '2025-03-17 01:56:25', 1),
(7, 3, 'test', 'test', 'testastestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasdtestasdasdasdsadasdasddasdasdsadasdasd', 'null', 'resolved', '2025-03-17 05:51:24', '2025-03-18 01:29:02', 1),
(8, 3, 'Location', 'Data', 'Sample', '1742176560143.jpg', 'pending', '2025-03-17 05:51:31', '2025-03-17 07:05:42', 1),
(9, 2, 'test', 'plumbing', 'test', NULL, 'pending', '2025-03-17 07:38:03', '2025-03-17 07:38:03', 0),
(10, 3, 'asdsadasdasd', 'plumbing', 'tresadasd', NULL, 'pending', '2025-03-18 01:30:06', '2025-03-18 01:30:09', 1),
(11, 3, 'asdasdas', 'electrical', 'asdsadas', NULL, 'pending', '2025-03-18 01:36:36', '2025-03-18 01:38:19', 1),
(12, 3, 'asdsad', 'asdasd', 'adsadsa', 'null', 'pending', '2025-03-18 07:04:31', '2025-03-18 07:04:34', 1),
(13, 3, 'World', 'World', 'World', 'null', 'pending', '2025-03-18 07:04:42', '2025-03-18 07:04:42', 0),
(14, 3, 'asdsa', 'electrical', 'asdsad', NULL, 'pending', '2025-03-18 07:54:45', '2025-03-18 07:54:45', 0),
(15, 3, 'asdsadasa', 'cleaning', 'asdsaas', NULL, 'pending', '2025-03-18 07:54:52', '2025-03-18 07:54:52', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','student') NOT NULL DEFAULT 'student',
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
(3, 'Unknow User', 'cabase.1324@gmail.com', '', 'student', 'https://lh3.googleusercontent.com/a/ACg8ocK6u11IUPdidaPGNtYlTBkjkLCL0qB6c9FCLu0uir5Fmi1KPA=s96-c', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1ZjgyMTE3MTM3ODhiNjE0NTQ3NGI1MDI5YjAxNDFiZDViM2RlOWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1ODA1Njg3MjEwMTYtZjY5cWlxbzgyZGhsN3N1bG1zMWY1dWJyNTB0YnJmNmkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1ODA1Njg3MjEwMTYtaGFpNmkxdXBobXBlaDZqOW1vbTVpZjY2Nmg5dXY0MmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTgxMTU5NDA5NzE4OTMyNDcyOTciLCJlbWFpbCI6ImNhYmFzZS4xMzI0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiVW5rbm93IFVzZXIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSzZ1MTFJVVBkaWRhUEdOdFlsVEJramtMQ0wwcUI2YzlGQ0x1MHVpcjVGbWkxS1BBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlVua25vdyIsImZhbWlseV9uYW1lIjoiVXNlciIsImlhdCI6MTc0MTIyNDc4NCwiZXhwIjoxNzQxMjI4Mzg0fQ.GxwsRhnYGhFbQIlW5IYSrPrBRnOcPZu6a_QcUKNuLkLUD47ewC2l2k5Cmf5PBmRzZaVI-rlJuU0Ba3ir27isOgm7Aw-HS3dM2zmDyxeTTcsp_GM4LJcqDnqQfY4lolbv9-T41xs-jgznJzwmkiurynmgAYTZtbuzMh6J9O1UDptdyAUiLq-Ae-czLr-mn_eFhb_0fum04bZvyo1IGJ6Z6TI5mVAvwTJn5gwGRyyD3xfN9f77QJ2UgrM6dVFAkuoNF2Wf2OjqXT18kycA64migkLtZr5c1KF7t3FmAW8YsAe7AQgRrtVcZUWtRCqiAG74xpyoCjhwhw8f4fxQILVLzw', '2025-03-06 01:33:04'),
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
(1, 2, 4, 'Maintenance Report', 'Your report about electrical at sadasdsa has been marked as \"In Progress\".', 0, '2025-03-13 03:44:39', '2025-03-13 03:44:39', 0),
(5, 2, 23, 'Maintenance Report', 'Your report about safety at sadsadssda has been marked as \"In Progress\".', 0, '2025-03-14 03:06:48', '2025-03-14 03:06:48', 0),
(6, 2, 22, 'Maintenance Report', 'Your report about electrical at sadsad has been marked as \"Resolved\".', 0, '2025-03-14 03:06:57', '2025-03-14 03:06:57', 0),
(8, 3, 7, 'Maintenance Report', 'Your report about test at test has been marked as \"Resolved\".', 1, '2025-03-17 05:53:08', '2025-03-17 05:53:08', 0);

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
-- Indexes for table `tbl_claim_items`
--
ALTER TABLE `tbl_claim_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `claimer_id` (`claimer_id`),
  ADD KEY `holder_id` (`holder_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `tbl_conversations`
--
ALTER TABLE `tbl_conversations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_conversation` (`user1_id`,`user2_id`);

--
-- Indexes for table `tbl_found_items`
--
ALTER TABLE `tbl_found_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `tbl_lost_found`
--
ALTER TABLE `tbl_lost_found`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tbl_messages`
--
ALTER TABLE `tbl_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`),
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `tbl_claim_items`
--
ALTER TABLE `tbl_claim_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tbl_conversations`
--
ALTER TABLE `tbl_conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_found_items`
--
ALTER TABLE `tbl_found_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_lost_found`
--
ALTER TABLE `tbl_lost_found`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `tbl_messages`
--
ALTER TABLE `tbl_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_reports`
--
ALTER TABLE `tbl_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_user_notifications`
--
ALTER TABLE `tbl_user_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_admin_notifications`
--
ALTER TABLE `tbl_admin_notifications`
  ADD CONSTRAINT `tbl_admin_notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_claim_items`
--
ALTER TABLE `tbl_claim_items`
  ADD CONSTRAINT `tbl_claim_items_ibfk_1` FOREIGN KEY (`claimer_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_claim_items_ibfk_2` FOREIGN KEY (`holder_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_claim_items_ibfk_3` FOREIGN KEY (`item_id`) REFERENCES `tbl_lost_found` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_found_items`
--
ALTER TABLE `tbl_found_items`
  ADD CONSTRAINT `tbl_found_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_found_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `tbl_lost_found` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_lost_found`
--
ALTER TABLE `tbl_lost_found`
  ADD CONSTRAINT `tbl_lost_found_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_messages`
--
ALTER TABLE `tbl_messages`
  ADD CONSTRAINT `tbl_messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_messages_ibfk_3` FOREIGN KEY (`report_id`) REFERENCES `tbl_lost_found` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_reports`
--
ALTER TABLE `tbl_reports`
  ADD CONSTRAINT `tbl_reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_user_notifications`
--
ALTER TABLE `tbl_user_notifications`
  ADD CONSTRAINT `tbl_user_notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_user_notifications_ibfk_2` FOREIGN KEY (`report_id`) REFERENCES `tbl_reports` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
