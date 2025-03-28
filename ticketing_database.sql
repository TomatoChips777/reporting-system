-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 28, 2025 at 07:01 AM
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
-- Database: `ticketing_database`
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
(1, 2, 1, 'Maintenance Report', 'New report submitted  issue at Room 101', 0, '2025-03-28 03:16:36'),
(2, 2, 2, 'Maintenance Report', 'New report submitted  issue at Room 102', 0, '2025-03-28 03:32:18'),
(3, 2, 3, 'Maintenance Report', 'New report submitted  issue at Room 103', 0, '2025-03-28 03:36:12'),
(4, 2, 4, 'Maintenance Report', 'New report submitted  issue at Room 104', 0, '2025-03-28 03:52:22');

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
(1, 2, 2, 'found', 'Mobile Phone', 'electronics', 'Lost Mobile Phone', 'Room 102', '2025-03-28 11:33:15', 'open', '1743138502300-600398062.jpg', '', 0, 0),
(2, 2, 5, 'found', 'Bag', 'electronics', 'Description', 'Room 105', '2025-03-28 12:51:59', 'open', '1743138139236-755983815.jpg', 'None', 1, 0),
(3, 2, 6, 'found', 'Test', 'clothing', 'Test', 'Test', '2025-03-28 13:27:04', 'open', '1743139624705-411788355.jpg', 'Testt', 1, 0),
(4, 2, 7, 'found', 'Iphone', 'documents', 'Lost Iphone, Possible last location Room 101', 'Room 101', '2025-03-28 13:44:20', 'open', NULL, '', 1, 0);

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
(2, 4, 'Plumbing', 'Medium', '');

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
  `message_session_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_messages`
--

INSERT INTO `tbl_messages` (`id`, `sender_id`, `receiver_id`, `message`, `image_path`, `report_id`, `created_at`, `updated_at`, `message_session_id`) VALUES
(1, 1, 2, 'Thanks for notifying us!', NULL, 1, '2025-03-28 03:17:54', '2025-03-28 03:20:12', 1),
(2, 2, 1, 'No problem', NULL, 1, '2025-03-28 03:18:11', '2025-03-28 03:18:11', 1),
(3, 1, 2, 'Thanks for reporting. Our team is on the way', NULL, 1, '2025-03-28 03:54:02', '2025-03-28 03:54:02', 1),
(4, 1, 2, 'Thanks for notifying us!', NULL, 4, '2025-03-28 03:55:36', '2025-03-28 03:55:36', 2),
(5, 1, 2, 'Hello there! please provide more details about this issue, thanks!', NULL, 4, '2025-03-28 05:54:12', '2025-03-28 05:54:12', 2),
(6, 1, 2, 'At Room 104 one of the sofa have damage', NULL, 4, '2025-03-28 05:55:49', '2025-03-28 05:55:49', 2),
(7, 2, 1, 'Yes', NULL, 4, '2025-03-28 05:56:26', '2025-03-28 05:56:26', 2);

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
(1, 1, 2, '2025-03-28 03:17:54', 1),
(2, 1, 2, '2025-03-28 03:55:36', 4);

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
(1, 2, 'Room 101', 'Maintenance Report', 'Electrical Issue', NULL, 'in_progress', 0, '2025-03-28 03:16:36', '2025-03-28 03:16:58', 0),
(2, 2, 'Room 102', 'Lost And Found', 'Lost Mobile Phone', '1743138502300-600398062.jpg', 'in_progress', 0, '2025-03-28 03:32:18', '2025-03-28 05:08:22', 1),
(3, 2, 'Room 103', '', 'Leak Faucet', NULL, 'pending', 0, '2025-03-28 03:36:12', '2025-03-28 05:53:00', 0),
(4, 2, 'Room 104', 'Maintenance Report', 'Broken Chair ', NULL, 'in_progress', 0, '2025-03-28 03:52:22', '2025-03-28 03:55:03', 0),
(5, 2, 'Room 105', 'Lost And Found', 'Description', '1743138139236-755983815.jpg', 'pending', 1, '2025-03-28 04:51:59', '2025-03-28 05:45:51', 0),
(6, 2, 'Test', 'Lost And Found', 'Test', '1743139624705-411788355.jpg', 'pending', 1, '2025-03-28 05:27:04', '2025-03-28 05:46:19', 0),
(7, 2, 'Room 101', 'Lost And Found', 'Lost Iphone, Possible last location Room 101', NULL, 'in_progress', 1, '2025-03-28 05:44:20', '2025-03-28 05:44:20', 0);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_lost_found`
--
ALTER TABLE `tbl_lost_found`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_maintenance_reports`
--
ALTER TABLE `tbl_maintenance_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_messages`
--
ALTER TABLE `tbl_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_message_sessions`
--
ALTER TABLE `tbl_message_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_reports`
--
ALTER TABLE `tbl_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
