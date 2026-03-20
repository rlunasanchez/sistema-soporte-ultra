-- Script para crear la base de datos y tablas del Sistema Soporte Ultra
-- Ejecutar en phpMyAdmin o MySQL

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS soporte_ultra_db;
USE soporte_ultra_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'tecnico') DEFAULT 'tecnico',
    activo TINYINT(1) DEFAULT 1,
    email VARCHAR(100),
    codigo_recuperacion VARCHAR(10),
    fecha_codigo DATETIME,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS ordenes_ultra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    os VARCHAR(50),
    cliente VARCHAR(100),
    tecnico VARCHAR(100),
    asignacion DATETIME,
    en_garantia VARCHAR(20),
    tipo VARCHAR(50),
    estado_actual VARCHAR(50),
    fecha_reparacion DATETIME,
    solicitud_compra VARCHAR(50),
    n_denuncia VARCHAR(50),
    qty VARCHAR(20),
    anexo VARCHAR(50),
    fecha DATETIME,
    equipo VARCHAR(100),
    marca VARCHAR(50),
    serie VARCHAR(100),
    modelo VARCHAR(100),
    procesador VARCHAR(100),
    disco VARCHAR(100),
    memoria VARCHAR(50),
    cargador TINYINT(1) DEFAULT 0,
    bateria TINYINT(1) DEFAULT 0,
    insumo TINYINT(1) DEFAULT 0,
    cabezal TINYINT(1) DEFAULT 0,
    otros TEXT,
    falla_informada TEXT,
    falla_detectada TEXT,
    conclusion TEXT,
    realizado_por VARCHAR(100)
);

-- Insertar usuario admin por defecto (password: Rluna6498)
-- Password encriptado con bcrypt
INSERT INTO usuarios (usuario, password, rol, activo, email) VALUES 
('admin', '$2b$10$UU8e4CSQYOVS0xMTT4Vjr.mbdTbVDb0iF5xlQI6R8tNgO9iy.vsE2', 'admin', 1, 'rodrigo.luna.analista@gmail.com');
