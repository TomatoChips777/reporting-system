-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 11, 2025 at 09:30 AM
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
-- Database: `lc-wm-database`
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
(1, 2, 96, 'Maintenance Report', 'New report submitted cleaning issue at Test', 1, '2025-03-11 00:41:04'),
(2, 2, 97, 'Maintenance Report', 'New report submitted electrical issue at Test Report', 1, '2025-03-11 00:59:07'),
(3, 2, 98, 'Maintenance Report', 'New report submitted electrical issue at Report', 1, '2025-03-11 00:59:22'),
(4, 2, 99, 'Maintenance Report', 'New report submitted plumbing issue at asdsasad', 1, '2025-03-11 01:19:20'),
(5, 2, 100, 'Maintenance Report', 'New report submitted electrical issue at Test', 1, '2025-03-11 01:41:25'),
(6, 3, 101, 'Maintenance Report', 'New report submitted structural issue at edsadas', 0, '2025-03-11 06:56:09'),
(7, 3, 102, 'Maintenance Report', 'New report submitted electrical issue at zxcxzczxzxc', 0, '2025-03-11 06:56:30');

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
  `is_anonymous` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_lost_found`
--

INSERT INTO `tbl_lost_found` (`id`, `user_id`, `type`, `item_name`, `category`, `description`, `location`, `date_reported`, `status`, `image_path`, `contact_info`, `is_anonymous`) VALUES
(1, 2, 'lost', 'asdas', 'asdsad', 'asdasda', 'asdsa', '2025-03-11 11:49:05', NULL, NULL, 'asdas', 0),
(2, 2, 'found', 'test', 'test', 'test', 'test', '2025-03-11 11:58:05', 'open', NULL, 'test', 1),
(3, 2, 'found', 'test', 'test', 'test', 'trst', '2025-03-11 11:58:23', 'open', NULL, 'test', 1),
(4, 2, 'lost', 'test', 'test', 'tsaeds', 'asdaas', '2025-03-11 11:59:02', 'open', '1741665542698-383846338.jpg', 'asdada', 1),
(5, 2, 'found', 'Test', 'test', 'test', 'Test 5', '2025-03-11 12:00:10', 'open', NULL, 'terst', 1),
(6, 2, 'found', 'Test', 'Test', 'Test', 'Test', '2025-03-11 13:11:57', 'open', NULL, 'Test', 0),
(7, 2, 'found', 'Test', 'test', 'trst', 'test', '2025-03-11 13:12:13', 'open', NULL, 'test', 1),
(8, 3, 'found', 'te4st', 'tasdas', 'asdasdas', 'asdasas', '2025-03-11 16:13:57', 'open', NULL, 'adasas', 0);

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_reports`
--

INSERT INTO `tbl_reports` (`id`, `user_id`, `location`, `issue_type`, `description`, `image_path`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 'Building 101', 'structural', 'Electrical Problems', '1741660670010.png', 'pending', '2025-03-06 01:21:17', '2025-03-11 02:37:50'),
(3, 2, 'Building 103', 'structural', 'Building 103', '1741225676129.png', 'in_progress', '2025-03-06 01:47:56', '2025-03-06 02:18:17'),
(4, 2, 'Building 104', 'plumbing', 'Building 104', '1741227439298.png', 'resolved', '2025-03-06 02:17:01', '2025-03-06 02:18:10'),
(5, 2, 'Building 105', 'structural', 'Building 105', '1741660713557.png', 'pending', '2025-03-06 02:29:27', '2025-03-11 02:38:33'),
(6, 2, 'Building 106', 'cleaning', 'Building 106', '1741228264648.png', 'resolved', '2025-03-06 02:31:04', '2025-03-11 00:39:51'),
(7, 2, 'Building Web 101', 'safety', 'Building Web 101', '1741238864538.jpg', 'pending', '2025-03-06 04:55:19', '2025-03-07 00:45:41'),
(8, 2, 'Building Web 102', 'structural', 'Building Web 102', '1741237316659.jpg', 'pending', '2025-03-06 04:56:44', '2025-03-06 05:01:56'),
(9, 2, 'Building Web 103', 'other', 'Building Web 103\r\n', '1741237406581.jpg', 'in_progress', '2025-03-06 05:03:26', '2025-03-07 05:17:34'),
(10, 2, 'Building Web 105', 'structural', 'Building Web 105', '1741237537811.jpg', 'pending', '2025-03-06 05:05:37', '2025-03-06 07:27:30'),
(11, 2, 'Building Web 105', 'structural', 'Building Web 105', '1741237983948.jpg', 'pending', '2025-03-06 05:13:03', '2025-03-07 01:45:10'),
(12, 2, 'Building Web 106', 'safety', 'Building Web 106', '1741239553276.jpg', 'pending', '2025-03-06 05:39:13', '2025-03-06 06:44:30'),
(13, 2, 'Building Web 107', 'safety', 'Building Web 107', '1741239700248.jpg', 'pending', '2025-03-06 05:41:40', '2025-03-06 06:48:00'),
(14, 2, 'Building Web 108', 'structural', 'Building Web 108', '1741243717585.jpg', 'pending', '2025-03-06 06:48:37', '2025-03-06 07:27:37'),
(15, 2, 'Building Web 109', 'plumbing', 'Building 109', '1741246096590.jpg', 'pending', '2025-03-06 07:28:16', '2025-03-06 07:28:16'),
(16, 2, 'Building Web 111', 'plumbing', 'Building Web 111', '1741246207471.jpg', 'in_progress', '2025-03-06 07:30:07', '2025-03-10 01:11:00'),
(17, 2, 'Building Web 112', 'electrical', 'Building Web 112', NULL, 'resolved', '2025-03-06 07:32:10', '2025-03-10 08:12:52'),
(18, 2, 'Building Web 113', 'plumbing', 'Building Web 113', NULL, 'pending', '2025-03-06 07:35:28', '2025-03-06 07:38:24'),
(19, 2, 'Building Web 114', 'structural', 'Building Web 114', NULL, 'in_progress', '2025-03-06 07:36:33', '2025-03-10 08:12:57'),
(20, 2, 'Building Web 115', 'safety', 'Building Web 115', NULL, 'pending', '2025-03-06 07:37:41', '2025-03-06 07:38:38'),
(21, 2, 'Building Web 116', 'structural', 'Building Web 116', NULL, 'in_progress', '2025-03-06 07:37:55', '2025-03-10 08:12:48'),
(22, 2, 'Building Web 117', 'electrical', 'Building Web 118', '1741246940977.jpg', 'in_progress', '2025-03-06 07:42:20', '2025-03-07 07:01:24'),
(23, 2, 'Building Web 117', 'plumbing', 'Building Web 117', NULL, 'resolved', '2025-03-06 07:45:00', '2025-03-07 07:01:21'),
(24, 2, 'Building Web 117', 'plumbing', 'Building Web 117', NULL, 'in_progress', '2025-03-06 07:45:34', '2025-03-07 02:48:50'),
(25, 2, 'Building Web 121', 'electrical', 'Building Web 121', NULL, 'in_progress', '2025-03-06 07:46:02', '2025-03-11 00:38:49'),
(26, 2, 'Building Web 122', 'electrical', 'Building Web 122', NULL, 'in_progress', '2025-03-06 07:46:54', '2025-03-10 08:12:42'),
(67, 2, 'Test', 'safety', 'Test', '1741319796596.jpg', 'in_progress', '2025-03-07 03:32:29', '2025-03-07 07:01:03'),
(69, 2, 'Data', 'electrical', 'FDAta', '1741319774810.jpg', 'in_progress', '2025-03-07 03:56:14', '2025-03-07 07:00:59'),
(70, 2, 'Test UI', 'cleaning', 'Test UI', '1741324678250.png', 'in_progress', '2025-03-07 05:17:58', '2025-03-07 07:00:54'),
(71, 3, 'Hello World', 'electrical', 'Hello World', '1741329004478.jpg', 'in_progress', '2025-03-07 06:30:04', '2025-03-07 07:00:42'),
(72, 3, 'Building 101 Room 101', 'electrical', 'New Report ', '1741568880327.jpg', 'resolved', '2025-03-10 01:08:00', '2025-03-10 01:11:18'),
(73, 3, 'New Rport 101', 'plumbing', 'New Report 101', '1741568918725.jpg', 'in_progress', '2025-03-10 01:08:38', '2025-03-10 01:11:13'),
(74, 3, 'Test', 'plumbing', 'Test', '1741569671178.jpg', 'resolved', '2025-03-10 01:21:11', '2025-03-11 00:38:37'),
(75, 3, 'test', 'electrical', 'tresst', '1741569710988.jpg', 'resolved', '2025-03-10 01:21:51', '2025-03-10 01:36:55'),
(79, 2, 'Test', 'structural', 'TEst', '1741574575637.png', 'pending', '2025-03-10 02:42:55', '2025-03-10 02:42:55'),
(80, 2, 'test', 'electrical', 'test', NULL, 'resolved', '2025-03-10 03:18:19', '2025-03-10 07:13:22'),
(81, 2, 'test', 'electrical', 'tsest', NULL, 'resolved', '2025-03-10 03:20:06', '2025-03-11 00:58:09'),
(82, 2, 'asdasda', 'structural', 'sdsadasd', NULL, 'in_progress', '2025-03-10 03:20:55', '2025-03-10 05:29:36'),
(83, 2, 'asdsadas', 'structural', 'asdasdasd', NULL, 'in_progress', '2025-03-10 03:21:15', '2025-03-11 00:57:08'),
(84, 2, 'Test', 'electrical', 'Test', NULL, 'in_progress', '2025-03-10 03:31:36', '2025-03-11 00:54:26'),
(85, 2, 'asdsaa', 'electrical', 'dadasdas', NULL, 'resolved', '2025-03-10 03:36:10', '2025-03-10 06:45:57'),
(86, 2, 'adasa', 'electrical', 'dsadasda', NULL, 'resolved', '2025-03-10 03:37:33', '2025-03-10 05:22:17'),
(87, 2, 'xasdsa', 'electrical', 'asdadasda', NULL, 'resolved', '2025-03-10 03:37:46', '2025-03-10 05:29:28'),
(88, 2, 'asdasasas', 'electrical', 'asdsadasasas', NULL, 'resolved', '2025-03-10 03:37:57', '2025-03-10 06:47:54'),
(89, 2, 'Test', 'electrical', 'Test', '1741577910428.png', 'resolved', '2025-03-10 03:38:30', '2025-03-10 06:46:07'),
(90, 2, 'New Building Floor 1', 'electrical', 'No electricity', '1741577971350.png', 'resolved', '2025-03-10 03:39:31', '2025-03-10 08:10:29'),
(91, 3, 'Test', 'electrical', 'Test', '1741584985791.png', 'in_progress', '2025-03-10 05:36:25', '2025-03-11 00:38:26'),
(92, 3, 'Test', 'structural', 'Test', '1741585012311.png', 'in_progress', '2025-03-10 05:36:52', '2025-03-10 07:59:40'),
(94, 2, 'Test', 'electrical', 'test', NULL, 'resolved', '2025-03-10 06:00:04', '2025-03-11 00:37:58'),
(95, 3, 'test', 'electrical', 'test', NULL, 'resolved', '2025-03-10 06:24:21', '2025-03-10 08:31:08'),
(96, 2, 'Test', 'cleaning', 'Test', NULL, 'resolved', '2025-03-11 00:41:04', '2025-03-11 02:37:14'),
(97, 2, 'Test Report', 'electrical', 'Test Report', NULL, 'resolved', '2025-03-11 00:59:07', '2025-03-11 02:30:09'),
(98, 2, 'Report', 'electrical', 'Report', '1741654762883.png', 'resolved', '2025-03-11 00:59:22', '2025-03-11 01:40:54'),
(99, 2, 'asdsasad', 'plumbing', 'asdsaasda', NULL, 'in_progress', '2025-03-11 01:19:20', '2025-03-11 01:36:30'),
(100, 2, 'Test', 'electrical', 'test', '1741657285818.png', 'resolved', '2025-03-11 01:41:25', '2025-03-11 01:42:09'),
(101, 3, 'edsadas', 'structural', 'dsadadasa', NULL, 'pending', '2025-03-11 06:56:09', '2025-03-11 06:56:09'),
(102, 3, 'zxcxzczxzxc', 'electrical', 'aaaasa', '1741676190330.png', 'pending', '2025-03-11 06:56:30', '2025-03-11 06:56:46');

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
(3, 'Unknow User', 'cabase.1324@gmail.com', '', 'student', 'https://lh3.googleusercontent.com/a/ACg8ocK6u11IUPdidaPGNtYlTBkjkLCL0qB6c9FCLu0uir5Fmi1KPA=s96-c', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1ZjgyMTE3MTM3ODhiNjE0NTQ3NGI1MDI5YjAxNDFiZDViM2RlOWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1ODA1Njg3MjEwMTYtZjY5cWlxbzgyZGhsN3N1bG1zMWY1dWJyNTB0YnJmNmkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1ODA1Njg3MjEwMTYtaGFpNmkxdXBobXBlaDZqOW1vbTVpZjY2Nmg5dXY0MmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTgxMTU5NDA5NzE4OTMyNDcyOTciLCJlbWFpbCI6ImNhYmFzZS4xMzI0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiVW5rbm93IFVzZXIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSzZ1MTFJVVBkaWRhUEdOdFlsVEJramtMQ0wwcUI2YzlGQ0x1MHVpcjVGbWkxS1BBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlVua25vdyIsImZhbWlseV9uYW1lIjoiVXNlciIsImlhdCI6MTc0MTIyNDc4NCwiZXhwIjoxNzQxMjI4Mzg0fQ.GxwsRhnYGhFbQIlW5IYSrPrBRnOcPZu6a_QcUKNuLkLUD47ewC2l2k5Cmf5PBmRzZaVI-rlJuU0Ba3ir27isOgm7Aw-HS3dM2zmDyxeTTcsp_GM4LJcqDnqQfY4lolbv9-T41xs-jgznJzwmkiurynmgAYTZtbuzMh6J9O1UDptdyAUiLq-Ae-czLr-mn_eFhb_0fum04bZvyo1IGJ6Z6TI5mVAvwTJn5gwGRyyD3xfN9f77QJ2UgrM6dVFAkuoNF2Wf2OjqXT18kycA64migkLtZr5c1KF7t3FmAW8YsAe7AQgRrtVcZUWtRCqiAG74xpyoCjhwhw8f4fxQILVLzw', '2025-03-06 01:33:04');

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user_notifications`
--

INSERT INTO `tbl_user_notifications` (`id`, `user_id`, `report_id`, `title`, `message`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 3, 95, 'Maintenance Report', 'Your report about electrical at test has been marked as \"In Progress\".', 0, '2025-03-10 07:30:53', '2025-03-11 00:52:54'),
(4, 3, 92, 'Maintenance Report', 'Your report about structural at Test has been marked as \"In Progress\".', 0, '2025-03-10 07:59:40', '2025-03-11 00:52:54'),
(13, 3, 95, 'Maintenance Report', 'Your report about electrical at test has been marked as \"Resolved\".', 1, '2025-03-10 08:31:08', '2025-03-11 00:52:54'),
(16, 3, 91, 'Maintenance Report', 'Your report about electrical at Test has been marked as \"In Progress\".', 1, '2025-03-11 00:38:26', '2025-03-11 00:52:54'),
(17, 3, 74, 'Maintenance Report', 'Your report about plumbing at Test has been marked as \"Resolved\".', 1, '2025-03-11 00:38:37', '2025-03-11 00:52:54'),
(31, 2, 98, 'Maintenance Report', 'Your report about electrical at Report has been marked as \"Pending\".', 1, '2025-03-11 01:39:13', '2025-03-11 01:39:13'),
(32, 2, 98, 'Maintenance Report', 'Your report about electrical at Report has been marked as \"Resolved\".', 1, '2025-03-11 01:40:54', '2025-03-11 01:40:54'),
(33, 2, 100, 'Maintenance Report', 'Your report about electrical at Test has been marked as \"Resolved\".', 1, '2025-03-11 01:42:09', '2025-03-11 01:42:09'),
(34, 2, 5, 'Maintenance Report', 'Your report about structural at Building 105 has been marked as \"Resolved\".', 1, '2025-03-11 01:48:06', '2025-03-11 01:48:06'),
(35, 2, 97, 'Maintenance Report', 'Your report about electrical at Test Report has been marked as \"Resolved\".', 0, '2025-03-11 02:30:09', '2025-03-11 02:30:09'),
(36, 2, 96, 'Maintenance Report', 'Your report about cleaning at Test has been marked as \"Resolved\".', 0, '2025-03-11 02:37:14', '2025-03-11 02:37:14'),
(37, 2, 5, 'Maintenance Report', 'Your report about structural at Building 105 has been marked as \"Pending\".', 0, '2025-03-11 02:38:19', '2025-03-11 02:38:19');

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
  ADD KEY `user_id` (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_lost_found`
--
ALTER TABLE `tbl_lost_found`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_reports`
--
ALTER TABLE `tbl_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_user_notifications`
--
ALTER TABLE `tbl_user_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_admin_notifications`
--
ALTER TABLE `tbl_admin_notifications`
  ADD CONSTRAINT `tbl_admin_notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_admin_notifications_ibfk_2` FOREIGN KEY (`report_id`) REFERENCES `tbl_reports` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_lost_found`
--
ALTER TABLE `tbl_lost_found`
  ADD CONSTRAINT `tbl_lost_found_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE;

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
