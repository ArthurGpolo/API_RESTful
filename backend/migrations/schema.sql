-- ============================================================
--  Alexandria — Schema do banco de dados (PRODUÇÃO/DEV)
--  Execute ANTES do seed.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS alexandria
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE alexandria;

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL,
  password    VARCHAR(255)  NOT NULL,
  role        ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- AUTHORS
-- ============================================================

CREATE TABLE IF NOT EXISTS authors (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(150)  NOT NULL,
  nationality VARCHAR(100)  DEFAULT NULL,
  bio         TEXT          DEFAULT NULL,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_authors_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- CATEGORIES
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  description TEXT          DEFAULT NULL,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- BOOKS
-- ============================================================

CREATE TABLE IF NOT EXISTS books (
  id             INT           NOT NULL AUTO_INCREMENT,
  title          VARCHAR(255)  NOT NULL,
  isbn           VARCHAR(20)   DEFAULT NULL,
  author_id      INT           NOT NULL,
  category_id    INT           DEFAULT NULL,
  quantity       INT           NOT NULL DEFAULT 1,
  available_qty  INT           NOT NULL DEFAULT 1,
  published_year SMALLINT UNSIGNED DEFAULT NULL,
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  UNIQUE KEY uq_books_isbn (isbn),

  INDEX idx_books_author (author_id),
  INDEX idx_books_category (category_id),

  CONSTRAINT fk_books_author
    FOREIGN KEY (author_id)
    REFERENCES authors(id)
    ON DELETE RESTRICT,

  CONSTRAINT fk_books_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- LOANS
-- ============================================================

CREATE TABLE IF NOT EXISTS loans (
  id          INT       NOT NULL AUTO_INCREMENT,
  user_id     INT       NOT NULL,
  book_id     INT       NOT NULL,
  loan_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_date    DATE      NOT NULL,
  return_date TIMESTAMP NULL DEFAULT NULL,
  status      ENUM('active', 'returned', 'overdue') NOT NULL DEFAULT 'active',

  PRIMARY KEY (id),

  INDEX idx_loans_user (user_id),
  INDEX idx_loans_book (book_id),

  CONSTRAINT fk_loans_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_loans_book
    FOREIGN KEY (book_id)
    REFERENCES books(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;