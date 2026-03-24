-- PostgreSQL dump for Sistema Soporte Ultra
-- Base de datos migrada de MySQL a PostgreSQL

-- Crear tabla de usuarios
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

-- Crear tabla de órdenes
CREATE TABLE IF NOT EXISTS informe_tecnico (
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
    realizado_por VARCHAR(100),
    fecha_diagnostico TIMESTAMP,
    diagnostico TEXT
);

-- Insertar usuarios
INSERT INTO usuarios (usuario, password, rol, activo, email) VALUES 
('admin', '$2b$10$UU8e4CSQYOVS0xMTT4Vjr.mbdTbVDb0iF5xlQI6R8tNgO9iy.vsE2', 'admin', true, 'rodrigo.luna.analista@gmail.com'),
('rodrigo', '$2b$10$RQDQWLcM14LHUaIcuVIzleZyGLkHaq0k016q1Ir113HdAoveY6rba', 'tecnico', true, 'rluna.msys@gmail.com'),
('diego', '$2b$10$BrP4VoUgX0Qb1/gUz75pU.3NIQ6Al2Prl0Km3BYadnaVuXRQeFUJC', 'tecnico', true, NULL)
ON CONFLICT (usuario) DO NOTHING;

-- Insertar órdenes
INSERT INTO ordenes_servicio (os, cliente, tecnico, asignacion, en_garantia, tipo, estado_actual, fecha_reparacion, solicitud_compra, n_denuncia, qty, anexo, fecha, equipo, marca, serie, modelo, procesador, disco, memoria, cargador, bateria, insumo, cabezal, otros, falla_informada, falla_detectada, conclusion, realizado_por) VALUES 
('DOA-2520','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en Bodega','2026-03-04','','','','','2026-03-04','Impresora Termica','Sewoo','SW15AST001986','LK-T200','','','',false,false,false,false,'','No informada','Falta mantencion y ajustes mecanicos.','EQUIPO REPARADO. Se realizo mantencion general y revision de puertos dejando equipo operativo.','Rodrigo Luna'),
('DOA-2521','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-04','','','','','2026-03-04','Impresora termica','Sewoo','SW19GST071368','LK-T200','','','',false,false,false,false,'','No informada','Falta mantencion y ajustes mecanicos.','EQUIPO REPARADO. Se realizo mantencion general y revision de puertos dejando equipo operativo.','Rodrigo Luna'),
('DOA-2522','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-04','','','','','2026-03-04','Impresora termica','Sewoo','SW22CST042999','LK-T200','','','',false,false,false,false,'','No informada','Falta mantencion y ajustes mecanicos.','EQUIPO REPARADO. Se realizo mantencion general y revision de puertos dejando equipo operativo.','Rodrigo Luna'),
('DOA-2524','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-04','','','','','2026-03-04','Impresora termica','Sewoo','SW17IST198553','LK-T200','','','',false,false,false,false,'','No informada','Falta mantencion y ajustes mecanicos.','EQUIPO REPARADO. Se realizo mantencion general y revision de puertos dejando equipo operativo.','Rodrigo Luna'),
('DOA-2525','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-04','','','','','2026-03-04','Impresora termica','Sewoo','SW20HST051114','LK-T200','','','',false,false,false,false,'','No informada','Falta mantencion y ajustes mecanicos.','EQUIPO REPARADO. Se realizo mantencion general y revision de puertos dejando equipo operativo.','Rodrigo Luna'),
('DOA-2526','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-04','','','','','2026-03-04','Impresora terminca','Sewoo','SW24DST019203','LK-T200','','','',false,false,false,false,'','No informada','Falta mantencion y ajustes mecanicos.','EQUIPO REPARADO. Se realizo mantencion general y revision de puertos dejando equipo operativo.','Rodrigo Luna'),
('DOA-2527','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-04','','','','','2026-03-04','Impresora termica','Sewoo','SW18BST021057','LK-T200','','','',false,false,false,false,'','No informada','Falta mantencion y ajustes mecanicos.','EQUIPO REPARADO. Se realizo mantencion general y revision de puertos dejando equipo operativo.','Rodrigo Luna'),
('DOA-2523','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Equipo irreparable en bodega',NULL,'','','','','2026-03-04','Impresora termica','Sewoo','SW19DST041800','LK-T200','','','',false,false,false,false,'','No Informada','Cabezal termico defectuoso, no imprime correctamente los caracteres, falta mantencion.','Para dejar maquina operativa es necesario cambiar cabezal','Rodrigo Luna'),
('DOA-2528','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Equipo irreparable en bodega',NULL,'','','','','2026-03-06','Scanner','SmartSource','900376610','SSP1','','','',false,false,false,false,'','No informada','Equipo con daño fisico y problemas en mainboard.','Equipo irreparable','Rodrigo Luna'),
('DOA-2529','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Equipo irreparable en bodega',NULL,'','','','','2026-03-06','Scanner','SmartSource','900311373','SSP1','','','',false,false,false,false,'','No informada','Equipo con daño fisico y problemas en mainboard.','Equipo irreparable','Rodrigo Luna'),
('DOA-2530','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-06','','','','','2026-03-06','Scanner','SmartSource','900349161','SSP1','','','',false,false,false,false,'','No informada','Se realizo pruebas de lectura de datos y mantencion general al equipo.','Equipo reparado','Rodrigo Luna'),
('DOA-2531','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-06','','','','','2026-03-06','Scanner','SmartSoruce','900373209','SSP1','','','',false,false,false,false,'','No informada','Se realizo pruebas de lectura de datos y mantencion general al equipo.','Equipo reparado','Rodrigo Luna'),
('DOA-2532','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-06','','','','','2026-03-06','Lector de cheque','Uniform','207121200662','8310-50KR USB','','','',false,false,false,false,'','No informada','Se realizo pruebas de lectura de datos y mantencion general al equipo.','Equipo reparado','Rodrigo Luna'),
('DOA-2533','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Equipo irreparable en bodega',NULL,'','','','','2026-03-06','Lector de cheque','Uniform','70483','8310-50KR USB','','','',false,false,false,false,'','No informada','Puerto de red dañado, problemas con la lectura de datos.','Equipo irreparable','Rodrigo Luna'),
('DOA-2534','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-06','','','','','2026-03-06','Lector de cheque','Uniform','207150500307','8310-50KR USB','','','',false,false,false,false,'','No informada','Se realizo pruebas de lectura de datos y mantencion general.','Equipo reparado','Rodrigo Luna'),
('DOA-2535','Banco Estado','Rodrigo Luna','2026-03-02','NO','REPARACION','Reparado en bodega','2026-03-06','','','','','2026-03-06','Lector de cheque ','Uniform','207180600644','8310-50KR USBs','','','',false,false,false,false,'','No informada','Se realizo pruebas de lectura de datos y mantencion general','Equipo reparado','Rodrigo Luna'),
('DOA-2536','Banco Estado','Rodrigo Luna','2026-03-09','NO','REPARACION','Reparado en bodega','2026-03-11','','','','','2026-03-11','Impresora Matriz','Olivetti','8103096','PR2-PLUS','','','',false,false,false,false,'','No informada','Falta mantencion general y pruebas de funcionamiento.','Maquina reparada. Se realizan ajustes mecanicos, mantencion general y pruebas de funcionamiento dejando equipo operativo.','Rodrigo Luna'),
('DOA-2537','Banco Estado','Rodrigo Luna','2026-03-09','NO','REPARACION','Equipo irreparable en bodega',NULL,'','','','','2026-03-11','Impresora Termica','Olivetti','8103009','PR2-PLUS','','','',false,false,false,false,'','No informada','Problema en la toma de papel.','Equipo enviado a servicio externo','Rodrigo Luna'),
('DOA-2538','Banco Estado','Rodrigo Luna','2026-03-09','NO','REPARACION','Equipo irreparable en bodega',NULL,'','','','','2026-03-11','Scanner','SmartSource','900377929','SSP1','','','',false,false,false,false,'','No informada','Equipo con daño fisico y problemas en la mainboard','Equipo irreparable','Rodrigo Luna'),
('DOA-2539','Banco Estado ','Rodrigo Luna','2026-03-09','NO','REPARACION','Reparado en bodega','2026-03-11','','','','','2026-03-11','Scanner','SmartSource','900377912','SSP1','','','',false,false,false,false,'','No informada','Falta mantencion general y pruebas de funcionamiento.','Equipo reparado. Se realizo mantencion general y pruebas de funcionamiento dejando equipo operativo.','Rodrigo Luna'),
('DOA-2540','Banco Estado','Rodrigo Luna','2026-03-09','NO','REPARACION','Reparado en bodega','2026-03-11','','','','','2026-03-11','Impresora termica','Sewoo','SW13089578','LK-T200','','','',false,false,false,false,'','No informada','Falta mantencion general y pruebas de funcionamiento','Equipo reparado. Se realizo mantencion general y prueba de funcionamiento dejando equipo reparado.','Rodrigo Luna');
