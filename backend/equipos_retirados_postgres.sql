-- Tabla para equipos_retirados (Retiro Bodega)
-- Banco Estado - PostgreSQL

CREATE TABLE IF NOT EXISTS equipos_retirados (
    id SERIAL PRIMARY KEY,
    fecha_retiro TIMESTAMP NOT NULL,
    serie_reversa VARCHAR(100) NOT NULL,
    equipo VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento en filtros por fecha
CREATE INDEX IF NOT EXISTS idx_fecha_retiro ON equipos_retirados(fecha_retiro);
