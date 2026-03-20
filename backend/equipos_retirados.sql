-- Tabla para equipos_retirados (Retiro Bodega)
-- Banco Estado

CREATE TABLE IF NOT EXISTS equipos_retirados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_retiro DATETIME NOT NULL,
    serie_reversa VARCHAR(100) NOT NULL,
    ticket_laboratorio VARCHAR(100) NOT NULL,
    equipo VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento en filtros por fecha
CREATE INDEX idx_fecha_retiro ON equipos_retirados(fecha_retiro);
