CREATE DATABASE estoque;

USE estoque;

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL,
    codigo VARCHAR(255) NOT NULL,
    categoria ENUM('doação', 'compra') NOT NULL,
    UNIQUE(codigo, categoria)
);
ALTER TABLE produtos ADD COLUMN data_entrada DATE;
ALTER TABLE produtos ADD COLUMN  dataEntrada DATE NOT NULL;

CREATE DATABASE IF NOT EXISTS estoque;

USE estoque;

DROP TABLE IF EXISTS produtos;

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL,
    codigo VARCHAR(255) NOT NULL,
    categoria ENUM('doação', 'compra') NOT NULL,
    UNIQUE(codigo, categoria)
);

ALTER TABLE produtos MODIFY dataEntrada DATE;
ALTER TABLE produtos ADD COLUMN dataSaida DATE;
ALTER TABLE produtos MODIFY dataSaida DATE null;


select*from produtos