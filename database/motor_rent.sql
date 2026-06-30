-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 30, 2026 at 07:57 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `motor_rent`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `motorcycle_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','approved','rejected','completed','cancelled','cancel_requested') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `motorcycle_id`, `start_date`, `end_date`, `total_price`, `status`, `notes`, `admin_notes`, `created_at`, `updated_at`) VALUES
(1, 2, 5, '2026-06-30', '2026-07-01', 380.00, 'cancelled', NULL, NULL, '2026-06-30 05:42:50', '2026-06-30 05:53:53');

-- --------------------------------------------------------

--
-- Table structure for table `motorcycles`
--

CREATE TABLE `motorcycles` (
  `id` int(11) NOT NULL,
  `brand` varchar(80) NOT NULL,
  `model` varchar(80) NOT NULL,
  `year` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `daily_rate` decimal(10,2) NOT NULL,
  `capacity` int(11) NOT NULL DEFAULT 2,
  `engine_cc` int(11) DEFAULT NULL,
  `fuel_type` enum('petrol','electric','hybrid') DEFAULT 'petrol',
  `image_url` varchar(500) DEFAULT NULL,
  `status` enum('available','rented','maintenance') DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `motorcycles`
--

INSERT INTO `motorcycles` (`id`, `brand`, `model`, `year`, `description`, `daily_rate`, `capacity`, `engine_cc`, `fuel_type`, `image_url`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Honda', 'PCX 160', 2024, 'Stylish and fuel-efficient scooter perfect for city commuting.', 450.00, 2, 157, 'petrol', '/uploads/pcx160.png', 'available', '2026-06-30 05:18:38', '2026-06-30 05:25:34'),
(2, 'Yamaha', 'NMAX 155', 2024, 'Premium scooter with excellent comfort for daily rides.', 500.00, 2, 155, 'petrol', '/uploads/nmax155.png', 'available', '2026-06-30 05:18:38', '2026-06-30 05:25:34'),
(3, 'Kawasaki', 'Barako II', 2023, 'Reliable underbone motorcycle for long-distance travel.', 350.00, 2, 175, 'petrol', '/uploads/barako2.png', 'available', '2026-06-30 05:18:38', '2026-06-30 05:25:34'),
(4, 'Honda', 'Click 150i', 2023, 'Compact and easy to ride, ideal for beginners.', 400.00, 2, 149, 'petrol', '/uploads/click150i.png', 'available', '2026-06-30 05:18:38', '2026-06-30 05:25:34'),
(5, 'Yamaha', 'Mio Gear', 2024, 'Sporty design with great fuel economy.', 380.00, 2, 125, 'petrol', '/uploads/miogear.png', 'available', '2026-06-30 05:18:38', '2026-06-30 05:53:53'),
(6, 'Royal Enfield', 'Classic 350', 2023, 'Iconic cruiser for scenic road trips and touring.', 800.00, 2, 349, 'petrol', '/uploads/classic350.png', 'available', '2026-06-30 05:18:38', '2026-06-30 05:25:34');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'info',
  `booking_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `body`, `type`, `booking_id`, `is_read`, `created_at`) VALUES
(1, 1, 'New Booking Request', 'junril ubas requested to book Yamaha Mio Gear.', 'new_booking', 1, 1, '2026-06-30 05:42:50'),
(2, 2, 'Booking Approved!', 'Your booking for Yamaha Mio Gear has been approved. Enjoy your ride!', 'booking_approved', 1, 1, '2026-06-30 05:43:34'),
(3, 1, 'Cancel Request', 'junril ubas has requested to cancel their booking for Yamaha Mio Gear.', 'cancel_requested', 1, 1, '2026-06-30 05:53:43'),
(4, 2, 'Cancellation Approved', 'Your cancellation request for Yamaha Mio Gear has been approved.', 'cancel_approved', 1, 1, '2026-06-30 05:53:53');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','customer') NOT NULL DEFAULT 'customer',
  `phone` varchar(20) DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password_hash`, `role`, `phone`, `avatar_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'System Admin', 'admin@motorrent.com', '$2a$10$u/MU8gOB9WzMJTiVsHS2P.gKxmgZj.V1uV8jYIWIWOjq4AUk0YYpm', 'admin', '09000000001', NULL, 1, '2026-06-30 05:19:55', '2026-06-30 05:37:51'),
(2, 'junril ubas', 'ubasj27@gmail.com', '$2a$10$1AKDlNW9lLU20Mv6PWIAReHPaUagoOIu4XL1HRB4DHY7JAcZNt77C', 'customer', '09759575849', NULL, 1, '2026-06-30 05:30:28', '2026-06-30 05:30:28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `motorcycle_id` (`motorcycle_id`);

--
-- Indexes for table `motorcycles`
--
ALTER TABLE `motorcycles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `motorcycles`
--
ALTER TABLE `motorcycles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`motorcycle_id`) REFERENCES `motorcycles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
