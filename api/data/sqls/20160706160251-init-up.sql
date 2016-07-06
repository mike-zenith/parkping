CREATE DATABASE IF NOT EXISTS parkping;

USE parkping;

CREATE TABLE `user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `karma` INT NOT NULL DEFAULT 0,
  `avatars` VARCHAR(266) NULL,
  `wallet` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC)
);

CREATE TABLE `spot` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(128) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `approved` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
  `location_type` VARCHAR(45) NULL DEFAULT 'gps',
  `rating` INT UNSIGNED NOT NULL DEFAULT 0,
  `long` FLOAT(10,6) NOT NULL DEFAULT 0,
  `lat` FLOAT(10,6) NOT NULL DEFAULT 0,
  `pictures` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id` (`user_id` ASC),
  INDEX `location` (`long` ASC, `lat` ASC)
);

CREATE TABLE `spot_schedule` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `spot_id` INT UNSIGNED NOT NULL,
  `startDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `endDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `spot_id` (`spot_id` ASC),
  INDEX `date` (`endDate` ASC)
);

CREATE TABLE `bookings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `spot_id` INT UNSIGNED NOT NULL,
  `startDate` TIMESTAMP NOT NULL,
  `endDate` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  INDEX `spotIdDates` (`spot_id` ASC, `startDate` ASC)
);

