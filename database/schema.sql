-- Suorita paikallisesti MariaDB:ssä käyttäjällä, joka saa luoda tietokantoja.
CREATE DATABASE IF NOT EXISTS opiskelijalounas
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE opiskelijalounas;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_data MEDIUMBLOB NULL,
  avatar_mime VARCHAR(30) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS favorites (
  user_id BIGINT UNSIGNED NOT NULL,
  restaurant_id VARCHAR(80) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, restaurant_id),
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Luo erillinen vähäoikeuksinen sovellustunnus MariaDB:hen itse, esim.:
-- CREATE USER 'lounas_app'@'localhost' IDENTIFIED BY 'OMA_VAHVA_SALASANA';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON opiskelijalounas.* TO 'lounas_app'@'localhost';
-- Älä suorita yllä olevia esimerkkikomentoja muuttamatta salasanaa.
