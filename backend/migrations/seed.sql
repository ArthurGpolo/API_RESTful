-- ============================================================
--  Alexandria — Seed completo (idempotente)
--  Pode ser executado várias vezes sem erro
--------------------------------------------

--  Comando:
--    mysql -u root -p alexandria < migrations/seed.sql
-------------------------------------------------------

--  Usuários:
--    [admin@alexandria.com](mailto:admin@alexandria.com) / password
--    [ana@email.com](mailto:ana@email.com)        / password
--    [pedro@email.com](mailto:pedro@email.com)      / password
-- ============================================================

USE alexandria;

---

--  LIMPEZA DO BANCO (evita erro de UNIQUE uq_)

---

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE loans;
TRUNCATE TABLE books;
TRUNCATE TABLE authors;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

---

--  Usuários
--  Senha: "password" (hash bcrypt abaixo)

---

INSERT INTO users (name, email, password, role) VALUES
('Administrador', '[admin@alexandria.com](mailto:admin@alexandria.com)',
'$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Ana Souza', '[ana@email.com](mailto:ana@email.com)',
'$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Pedro Lima', '[pedro@email.com](mailto:pedro@email.com)',
'$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

---

--  Categorias

---

INSERT INTO categories (name, description) VALUES
('Romance', 'Obras de ficção com foco em relacionamentos e emoções'),
('Ficção Científica', 'Literatura especulativa com base em ciência e tecnologia'),
('Fantasia', 'Narrativas com elementos mágicos e mundos imaginários'),
('Clássicos', 'Obras consagradas da literatura mundial'),
('Poesia', 'Coleções de poemas e obras em verso'),
('Filosofia', 'Obras de pensamento filosófico e reflexão');

---

--  Autores

---

INSERT INTO authors (name, nationality, bio) VALUES
('Machado de Assis', 'Brasileiro',
'Considerado o maior nome da literatura brasileira, fundador da Academia Brasileira de Letras.'),
('Clarice Lispector', 'Brasileira',
'Uma das escritoras mais importantes do modernismo brasileiro, conhecida por sua prosa introspectiva.'),
('George Orwell', 'Britânico',
'Jornalista e escritor britânico, famoso por obras distópicas e ensaios políticos.'),
('J.R.R. Tolkien', 'Britânico',
'Filólogo e escritor, criador do universo de Terra-Média.'),
('Guimarães Rosa', 'Brasileiro',
'Autor do sertão mineiro, mestre da linguagem e do regionalismo literário.');

---

--  Livros
--  (author_id e category_id seguem a ordem de inserção acima)

---

INSERT INTO books (title, isbn, author_id, category_id, quantity, available_qty, published_year) VALUES
('Dom Casmurro', '9788525406958', 1, 4, 5, 5, 1899),
('Memórias Póstumas de Brás Cubas', '9788535910663', 1, 4, 3, 3, 1881),
('A Hora da Estrela', '9788503012119', 2, 1, 4, 4, 1977),
('Perto do Coração Selvagem', '9788532519443', 2, 1, 2, 2, 1943),
('1984', '9788535914849', 3, 2, 6, 6, 1949),
('A Revolução dos Bichos', '9788535906509', 3, 2, 4, 4, 1945),
('O Senhor dos Anéis', '9788533613379', 4, 3, 2, 2, 1954),
('O Hobbit', '9788533604667', 4, 3, 3, 3, 1937),
('Grande Sertão: Veredas', '9788520929069', 5, 4, 3, 3, 1956),
('Sagarana', '9788520913019', 5, 4, 2, 2, 1946);

---

--  Empréstimos de exemplo

---

INSERT INTO loans (user_id, book_id, due_date, status) VALUES
(2, 1, '2026-05-15', 'active'),
(3, 5, '2026-05-10', 'active'),
(2, 7, '2026-04-01', 'returned');

-- Atualiza data de devolução do empréstimo retornado
UPDATE loans
SET return_date = '2026-03-28 14:30:00'
WHERE id = 3;

-- ============================================================
--  FIM DO SEED
-- ============================================================
