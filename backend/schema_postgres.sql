-- Script para crear la base de datos y tablas del Sistema Soporte Ultra (PostgreSQL)
-- Ejecutar en Neon o cualquier servidor PostgreSQL

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'tecnico',
    activo BOOLEAN DEFAULT true,
    email VARCHAR(100),
    codigo_recuperacion VARCHAR(10),
    fecha_codigo TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS ordenes_servicio (
    id SERIAL PRIMARY KEY,
    os VARCHAR(50),
    cliente VARCHAR(100),
    tecnico VARCHAR(100),
    asignacion TIMESTAMP,
    en_garantia VARCHAR(20),
    tipo VARCHAR(50),
    estado_actual VARCHAR(50),
    fecha_reparacion TIMESTAMP,
    solicitud_compra VARCHAR(50),
    n_denuncia VARCHAR(50),
    qty VARCHAR(20),
    anexo VARCHAR(50),
    fecha TIMESTAMP,
    equipo VARCHAR(100),
    marca VARCHAR(50),
    serie VARCHAR(100),
    modelo VARCHAR(100),
    procesador VARCHAR(100),
    disco VARCHAR(100),
    memoria VARCHAR(50),
    cargador BOOLEAN DEFAULT false,
    bateria BOOLEAN DEFAULT false,
    insumo BOOLEAN DEFAULT false,
    cabezal BOOLEAN DEFAULT false,
    otros TEXT,
    falla_informada TEXT,
    falla_detectada TEXT,
    conclusion TEXT,
    realizado_por VARCHAR(100)
);

-- Insertar usuario admin por defecto (password: Rluna6498)
-- Password encriptado con bcrypt
INSERT INTO usuarios (usuario, password, rol, activo, email) VALUES 
('admin', '$2b$10$UU8e4CSQYOVS0xMTT4Vjr.mbdTbVDb0iF5xlQI6R8tNgO9iy.vsE2', 'admin', true, 'rodrigo.luna.analista@gmail.com')
ON CONFLICT (usuario) DO NOTHING;