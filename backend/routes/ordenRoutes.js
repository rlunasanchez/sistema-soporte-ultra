import express from "express";
import pool from "../config/db.js";
import XlsxPopulate from "xlsx-populate";
import PDFDocument from "pdfkit";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===============================
   OBTENER TÉCNICOS (PÚBLICO)
================================*/
router.get("/tecnicos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT usuario FROM usuarios WHERE activo = true ORDER BY usuario ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error obteniendo técnicos" });
  }
});

/* ===============================
   OBTENER VALORES PARA FILTROS (EQUIPO, MARCA, MODELO) - PÚBLICO
================================*/
router.get("/filtros-valores", async (req, res) => {
  try {
    const equipos = await pool.query(
      "SELECT DISTINCT equipo FROM informe_tecnico WHERE equipo IS NOT NULL AND equipo != '' ORDER BY equipo ASC"
    );
    const marcas = await pool.query(
      "SELECT DISTINCT marca FROM informe_tecnico WHERE marca IS NOT NULL AND marca != '' ORDER BY marca ASC"
    );
    const modelos = await pool.query(
      "SELECT DISTINCT modelo FROM informe_tecnico WHERE modelo IS NOT NULL AND modelo != '' ORDER BY modelo ASC"
    );

    res.json({
      equipos: equipos.rows.map(r => r.equipo),
      marcas: marcas.rows.map(r => r.marca),
      modelos: modelos.rows.map(r => r.modelo)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error obteniendo valores de filtro" });
  }
});

/* ===============================
   OBTENER VALORES PARA FORMULARIO (EQUIPO, MARCA, MODELO) - PÚBLICO
================================*/
router.get("/valores-formulario", async (req, res) => {
  try {
    const equipos = await pool.query(
      "SELECT DISTINCT equipo FROM informe_tecnico WHERE equipo IS NOT NULL AND equipo != '' ORDER BY equipo ASC"
    );
    const marcas = await pool.query(
      "SELECT DISTINCT marca FROM informe_tecnico WHERE marca IS NOT NULL AND marca != '' ORDER BY marca ASC"
    );
    const modelos = await pool.query(
      "SELECT DISTINCT modelo FROM informe_tecnico WHERE modelo IS NOT NULL AND modelo != '' ORDER BY modelo ASC"
    );

    res.json({
      equipos: equipos.rows.map(r => r.equipo),
      marcas: marcas.rows.map(r => r.marca),
      modelos: modelos.rows.map(r => r.modelo)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error obteniendo valores de formulario" });
  }
});

router.use(authMiddleware);

const formatDate = (d) =>
  d ? new Date(d).toISOString().slice(0, 19).replace("T", " ") : null;

const buildFilterQuery = (query, forExport = false) => {
  const {
    os,
    cliente,
    tecnico,
    estado,
    equipo,
    marca,
    modelo,
    fechaAsignacionDesde,
    fechaAsignacionHasta,
    fechaReparacionDesde,
    fechaReparacionHasta,
    fecha,
    page,
    limit,
  } = query;

  let sql = "SELECT * FROM informe_tecnico WHERE 1=1";
  let countSql = "SELECT COUNT(*) as total FROM informe_tecnico WHERE 1=1";
  const params = [];
  let paramIndex = 1;

  if (os) {
    sql += ` AND os LIKE $${paramIndex}`;
    countSql += ` AND os LIKE $${paramIndex}`;
    params.push(`%${os}%`);
    paramIndex++;
  }

  if (cliente) {
    sql += ` AND cliente LIKE $${paramIndex}`;
    countSql += ` AND cliente LIKE $${paramIndex}`;
    params.push(`%${cliente}%`);
    paramIndex++;
  }

  if (tecnico) {
    sql += ` AND tecnico LIKE $${paramIndex}`;
    countSql += ` AND tecnico LIKE $${paramIndex}`;
    params.push(`%${tecnico}%`);
    paramIndex++;
  }

  if (estado) {
    sql += ` AND estado_actual LIKE $${paramIndex}`;
    countSql += ` AND estado_actual LIKE $${paramIndex}`;
    params.push(`%${estado}%`);
    paramIndex++;
  }

  if (equipo) {
    sql += ` AND equipo LIKE $${paramIndex}`;
    countSql += ` AND equipo LIKE $${paramIndex}`;
    params.push(`%${equipo}%`);
    paramIndex++;
  }

  if (marca) {
    sql += ` AND marca LIKE $${paramIndex}`;
    countSql += ` AND marca LIKE $${paramIndex}`;
    params.push(`%${marca}%`);
    paramIndex++;
  }

  if (modelo) {
    sql += ` AND modelo LIKE $${paramIndex}`;
    countSql += ` AND modelo LIKE $${paramIndex}`;
    params.push(`%${modelo}%`);
    paramIndex++;
  }

  if (fechaAsignacionDesde) {
    sql += ` AND DATE(asignacion) >= $${paramIndex}`;
    countSql += ` AND DATE(asignacion) >= $${paramIndex}`;
    params.push(fechaAsignacionDesde);
    paramIndex++;
  }

  if (fechaAsignacionHasta) {
    sql += ` AND DATE(asignacion) <= $${paramIndex}`;
    countSql += ` AND DATE(asignacion) <= $${paramIndex}`;
    params.push(fechaAsignacionHasta);
    paramIndex++;
  }

  if (fechaReparacionDesde) {
    sql += ` AND DATE(fecha_reparacion) >= $${paramIndex}`;
    countSql += ` AND DATE(fecha_reparacion) >= $${paramIndex}`;
    params.push(fechaReparacionDesde);
    paramIndex++;
  }

  if (fechaReparacionHasta) {
    sql += ` AND DATE(fecha_reparacion) <= $${paramIndex}`;
    countSql += ` AND DATE(fecha_reparacion) <= $${paramIndex}`;
    params.push(fechaReparacionHasta);
    paramIndex++;
  }

  if (fecha) {
    sql += ` AND DATE(fecha) = $${paramIndex}`;
    countSql += ` AND DATE(fecha) = $${paramIndex}`;
    params.push(fecha);
    paramIndex++;
  }

  if (forExport) {
    sql += ` ORDER BY id DESC`;
    return { sql, params };
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 5;
  const offset = (pageNum - 1) * limitNum;

  sql += ` ORDER BY id DESC LIMIT ${limitNum} OFFSET ${offset}`;

  return { sql, countSql, params, page: pageNum, limit: limitNum };
};

/* ===============================
   OBTENER ÓRDENES
================================*/
router.get("/", async (req, res) => {
  try {
    const { sql, countSql, params, page, limit } = buildFilterQuery(req.query);
    
    const result = await pool.query(sql, params);
    const countResult = await pool.query(countSql, params);
    const total = countResult.rows[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error obteniendo órdenes" });
  }
});

/* ===============================
   CREAR NUEVA ORDEN
=================================*/
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    if (!data.os || data.os.trim() === "") {
      return res.status(400).json({ msg: "El campo OS es requerido" });
    }

    const sql = `
      INSERT INTO informe_tecnico (
        os, cliente, tecnico, asignacion, en_garantia, tipo,
        estado_actual, fecha_reparacion, solicitud_compra,
        n_denuncia, qty, anexo, fecha, equipo, marca,
        serie, modelo, procesador, disco, memoria,
        cargador, bateria, insumo, cabezal, otros,
        falla_informada, falla_detectada, conclusion, realizado_por,
        fecha_diagnostico, diagnostico
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31)
      RETURNING id
    `;

    const values = [
      data.os,
      data.cliente,
      data.tecnico,
      formatDate(data.asignacion),
      data.en_garantia,
      data.tipo,
      data.estado_actual,
      formatDate(data.fecha_reparacion),
      data.solicitud_compra,
      data.n_denuncia,
      data.qty,
      data.anexo,
      formatDate(data.fecha),
      data.equipo,
      data.marca,
      data.serie,
      data.modelo,
      data.procesador,
      data.disco,
      data.memoria,
      data.cargador,
      data.bateria,
      data.insumo,
      data.cabezal,
      data.otros,
      data.falla_informada,
      data.falla_detectada,
      data.conclusion,
      data.realizado_por,
      formatDate(data.fecha_diagnostico),
      data.diagnostico,
    ];

    const result = await pool.query(sql, values);

    res.status(201).json({
      msg: "Orden creada correctamente",
      id: result.rows[0].id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creando orden: " + err.message });
  }
});

/* ===============================
   ACTUALIZAR ORDEN
=================================*/
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const sql = `
      UPDATE informe_tecnico SET
        os = $1, cliente = $2, tecnico = $3, asignacion = $4, en_garantia = $5, tipo = $6,
        estado_actual = $7, fecha_reparacion = $8, solicitud_compra = $9,
        n_denuncia = $10, qty = $11, anexo = $12, fecha = $13, equipo = $14, marca = $15,
        serie = $16, modelo = $17, procesador = $18, disco = $19, memoria = $20,
        cargador = $21, bateria = $22, insumo = $23, cabezal = $24, otros = $25,
        falla_informada = $26, falla_detectada = $27, conclusion = $28, realizado_por = $29,
        fecha_diagnostico = $30, diagnostico = $31
      WHERE id = $32
    `;

    const values = [
      data.os,
      data.cliente,
      data.tecnico,
      formatDate(data.asignacion),
      data.en_garantia,
      data.tipo,
      data.estado_actual,
      formatDate(data.fecha_reparacion),
      data.solicitud_compra,
      data.n_denuncia,
      data.qty,
      data.anexo,
      formatDate(data.fecha),
      data.equipo,
      data.marca,
      data.serie,
      data.modelo,
      data.procesador,
      data.disco,
      data.memoria,
      data.cargador,
      data.bateria,
      data.insumo,
      data.cabezal,
      data.otros,
      data.falla_informada,
      data.falla_detectada,
      data.conclusion,
      data.realizado_por,
      formatDate(data.fecha_diagnostico),
      data.diagnostico,
      id,
    ];

    await pool.query(sql, values);

    res.json({ msg: "Orden actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error actualizando orden" });
  }
});

/* ===============================
   ELIMINAR ORDEN
=================================*/
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM informe_tecnico WHERE id = $1", [id]);

    res.json({ msg: "Orden eliminada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error eliminando orden" });
  }
});

/* ===============================
   EXPORTAR EXCEL NORMAL
=================================*/
router.get("/excel", async (req, res) => {
  try {
    const { sql, params } = buildFilterQuery(req.query, true);
    const result = await pool.query(sql, params);

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);

    sheet.name("Importacion FileMaker");

    const headers = [
      "Fecha Registro",
      "OS",
      "Fecha :",
      "OS :",
      "Cliente :",
      "Equipo.",
      "Marca",
      "Serie :",
      "Modelo :",
      "Cliente",
      "Procesador",
      "Disco",
      "Memoria",
      "Técnico",
      "Accesorios",
      "Otros",
      "Asignación",
      "Falla informada :",
      "Garantía",
      "Tipo",
      "Falla detectada :",
      "Estado Actual",
      "Conclusión",
      "Fecha Reparación",
      "Solicitud de Compra",
      "N° Denuncia",
      "Cantidad",
      "Anexo",
      "Realizado",
    ];

    headers.forEach((h, i) => sheet.cell(1, i + 1).value(h));

    result.rows.forEach((r, rowIndex) => {
      const rowNum = rowIndex + 2;

      const accesorios = [
        r.cargador ? "Cargador" : "",
        r.bateria ? "Batería" : "",
        r.insumo ? "Insumo" : "",
        r.cabezal ? "Cabezal" : "",
      ]
        .filter(Boolean)
        .join(", ");

      const values = [
        r.fecha ? new Date(r.fecha).toLocaleDateString("es-CL") : "",
        r.os,
        r.fecha ? new Date(r.fecha).toLocaleDateString("es-CL") : "",
        r.os,
        r.cliente,
        r.equipo,
        r.marca,
        r.serie,
        r.modelo,
        r.cliente,
        r.procesador,
        r.disco,
        r.memoria,
        r.tecnico,
        accesorios,
        r.otros,
        r.asignacion ? new Date(r.asignacion).toLocaleDateString("es-CL") : "",
        r.falla_informada,
        r.en_garantia,
        r.tipo,
        r.falla_detectada,
        r.estado_actual,
        r.conclusion,
        r.fecha_reparacion
          ? new Date(r.fecha_reparacion).toLocaleDateString("es-CL")
          : "",
        r.solicitud_compra,
        r.n_denuncia,
        r.qty,
        r.anexo,
        r.realizado_por,
      ];

      values.forEach((v, colIndex) => {
        sheet.cell(rowNum, colIndex + 1).value(v);
      });
    });

    const buffer = await workbook.outputAsync();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=informe_tecnico.xlsx"
    );

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error generando Excel" });
  }
});

/* ===============================
   EXPORTAR EXCEL CORREO
=================================*/
router.get("/excel-correo", async (req, res) => {
  try {
    const { sql, params } = buildFilterQuery(req.query, true);
    const result = await pool.query(sql, params);

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);

    sheet.name("Banco Estado");

    sheet.cell("A1").value("Equipos Banco Estado");
    sheet.range("A1:C1").merged(true).style({
      bold: true,
      fontSize: 16,
      horizontalAlignment: "center",
      verticalAlignment: "center",
      fill: "009EE3",
      fontColor: "FFFFFF",
    });

    sheet.row(1).height(30);

    const headers = [
      "Ticket Laboratorio",
      "Serie",
      "Observación"
    ];

    headers.forEach((h, i) => {
      sheet.cell(3, i + 1).value(h);
    });

    sheet.range("A3:C3").style({
      bold: true,
      fill: "E6F0FA",
      horizontalAlignment: "center",
      border: true,
      borderColor: "009EE3",
    });

    result.rows.forEach((r, i) => {
      const row = i + 4;

      sheet.cell(`A${row}`).value(r.os);
      sheet.cell(`B${row}`).value(r.serie);
      sheet.cell(`C${row}`).value("");

      sheet.range(`A${row}:C${row}`).style({
        horizontalAlignment: "center",
        border: true,
        borderColor: "E2E8F0",
      });

      if (i % 2 === 0) {
        sheet.range(`A${row}:C${row}`).style({
          fill: "F8FAFC",
        });
      }
    });

    sheet.column("A").width(22);
    sheet.column("B").width(25);
    sheet.column("C").width(35);

    const buffer = await workbook.outputAsync();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=equipos_banco_estado.xlsx"
    );

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error generando Excel correo" });
  }
});

/* ===============================
   EXPORTAR EXCEL RESPALDO
=================================*/
router.get("/excel-respaldo", async (req, res) => {
  try {
    const { sql, params } = buildFilterQuery(req.query, true);
    const result = await pool.query(sql, params);

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);

    sheet.name("Respaldo Banco Estado");

    sheet.cell("A1").value("Equipos Banco Estado - Respaldo Completo");
    sheet.range("A1:AC1").merged(true).style({
      bold: true,
      fontSize: 18,
      horizontalAlignment: "center",
      verticalAlignment: "center",
      fill: "009EE3",
      fontColor: "FFFFFF",
    });

    sheet.row(1).height(30);

    const headers = [
      "OS",
      "Cliente",
      "Técnico",
      "Asignación",
      "Garantía",
      "Tipo",
      "Estado",
      "Fecha Rep.",
      "Solicitud Compra",
      "N° Denuncia",
      "Qty",
      "Anexo",
      "Fecha",
      "Equipo",
      "Marca",
      "Serie",
      "Modelo",
      "Procesador",
      "Disco",
      "Memoria",
      "Cargador",
      "Batería",
      "Insumo",
      "Cabezal",
      "Otros",
      "Falla Informada",
      "Falla Detectada",
      "Conclusión",
      "Realizado Por",
    ];

    headers.forEach((h, i) => {
      sheet.cell(3, i + 1).value(h);
    });

    sheet.range("A3:AC3").style({
      bold: true,
      fill: "E6F0FA",
      horizontalAlignment: "center",
      border: true,
      borderColor: "009EE3",
      fontColor: "0C4A8C",
    });

    result.rows.forEach((r, i) => {
      const row = i + 4;

      const values = [
        r.os,
        r.cliente,
        r.tecnico,
        r.asignacion ? new Date(r.asignacion).toLocaleDateString("es-CL") : "",
        r.en_garantia,
        r.tipo,
        r.estado_actual,
        r.fecha_reparacion ? new Date(r.fecha_reparacion).toLocaleDateString("es-CL") : "",
        r.solicitud_compra,
        r.n_denuncia,
        r.qty,
        r.anexo,
        r.fecha ? new Date(r.fecha).toLocaleDateString("es-CL") : "",
        r.equipo,
        r.marca,
        r.serie,
        r.modelo,
        r.procesador,
        r.disco,
        r.memoria,
        r.cargador ? "✓" : "✗",
        r.bateria ? "✓" : "✗",
        r.insumo ? "✓" : "✗",
        r.cabezal ? "✓" : "✗",
        r.otros,
        r.falla_informada,
        r.falla_detectada,
        r.conclusion,
        r.realizado_por,
      ];

      values.forEach((v, c) => {
        sheet.cell(row, c + 1).value(v);
      });

      sheet.range(`A${row}:AC${row}`).style({
        horizontalAlignment: "center",
        border: true,
        borderColor: "E2E8F0",
      });

      if (i % 2 === 0) {
        sheet.range(`A${row}:AC${row}`).style({
          fill: "F9FAFB",
        });
      }
    });

    sheet.column("A").width(12);
    sheet.column("B").width(18);
    sheet.column("C").width(15);
    sheet.column("D").width(12);
    sheet.column("E").width(10);
    sheet.column("F").width(12);
    sheet.column("G").width(15);
    sheet.column("H").width(12);
    sheet.column("I").width(15);
    sheet.column("J").width(12);
    sheet.column("K").width(8);
    sheet.column("L").width(10);
    sheet.column("M").width(12);
    sheet.column("N").width(15);
    sheet.column("O").width(12);
    sheet.column("P").width(18);
    sheet.column("Q").width(15);
    sheet.column("R").width(15);
    sheet.column("S").width(12);
    sheet.column("T").width(12);
    sheet.column("U").width(10);
    sheet.column("V").width(10);
    sheet.column("W").width(10);
    sheet.column("X").width(10);
    sheet.column("Y").width(15);
    sheet.column("Z").width(20);
    sheet.column("AA").width(20);
    sheet.column("AB").width(20);
    sheet.column("AC").width(15);

    const buffer = await workbook.outputAsync();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=respaldo_banco_estado.xlsx"
    );

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error generando Excel respaldo" });
  }
});

/* ===============================
   EXPORTAR PDF INFORME TÉCNICO
================================*/
router.get("/pdf", async (req, res) => {
  try {
    const { sql, params } = buildFilterQuery(req.query, true);
    
    const result = await pool.query(sql, params);

    if (result.rows.length === 0) {
      return res.status(400).json({ msg: "No hay órdenes para exportar" });
    }

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'portrait',
      margins: { top: 15, bottom: 15, left: 20, right: 20 }
    });

    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=informes_tecnicos.pdf');
      res.send(pdfBuffer);
    });

    result.rows.forEach((orden, index) => {
      if (index > 0) {
        doc.addPage();
      }

      const leftX = 20;
      const col2X = 190;
      const col3X = 360;
      const width = 535;
      const rowH = 18;
      let y = 15;

      doc.rect(leftX, y, width, 30).fill('#0C4A8C');
      doc.fill('#FFFFFF');
      doc.fontSize(14);
      doc.font('Helvetica-Bold');
      doc.text('INFORME TÉCNICO', leftX, y + 8, { align: 'center', width: width });
      y += 35;

      doc.fill('#1a1a2e');
      doc.fontSize(9);

      const row = (label, value, x, rowY) => {
        doc.font('Helvetica-Bold').fill('#0C4A8C').text(label + ':', x, rowY, { width: 70 });
        doc.font('Helvetica').fill('#1a1a2e').text(value || '-', x + 75, rowY, { width: 110 });
      };

      row('OS', orden.os, leftX, y);
      doc.font('Helvetica-Bold').fill('#0C4A8C').text('Fecha:', col3X, y);
      doc.font('Helvetica').fill('#1a1a2e').text(orden.fecha ? new Date(orden.fecha).toLocaleDateString('es-CL') : '-', col3X + 50, y);
      y += rowH;

      row('Cliente', orden.cliente, leftX, y);
      row('Garantía', orden.en_garantia, col3X, y);
      y += rowH;

      row('Técnico', orden.tecnico, leftX, y);
      row('Tipo', orden.tipo, col3X, y);
      y += rowH;

      row('Fecha Asignación', orden.asignacion ? new Date(orden.asignacion).toLocaleDateString('es-CL') : '-', leftX, y);
      row('Estado', orden.estado_actual, col3X, y);
      y += rowH;

      row('Fecha Reparación', orden.fecha_reparacion ? new Date(orden.fecha_reparacion).toLocaleDateString('es-CL') : '-', leftX, y);
      row('Realizado Por', orden.realizado_por, col3X, y);
      y += rowH + 5;

      doc.rect(leftX, y, width, 18).fill('#f1f5f9');
      doc.fill('#0C4A8C');
      doc.fontSize(10);
      doc.font('Helvetica-Bold');
      doc.text('INFORMACIÓN TÉCNICA', leftX + 5, y + 3);
      y += 22;

      row('Fecha', orden.fecha ? new Date(orden.fecha).toLocaleDateString('es-CL') : '-', leftX, y);
      row('Solicitud Compra', orden.solicitud_compra, col2X, y);
      row('Anexo', orden.anexo, col3X, y);
      y += rowH;

      row('Equipo', orden.equipo, leftX, y);
      row('Cantidad', orden.qty, col3X, y);
      y += rowH;

      row('Marca', orden.marca, leftX, y);
      row('Modelo', orden.modelo, col2X, y);
      y += rowH;

      row('Serie', orden.serie, leftX, y);
      row('N° Denuncia', orden.n_denuncia, col2X, y);
      y += rowH;

      row('Procesador', orden.procesador, leftX, y);
      row('Memoria', orden.memoria, col2X, y);
      y += rowH;

      row('Disco', orden.disco, leftX, y);
      y += rowH + 5;

      const accesorios = [];
      if (orden.cargador) accesorios.push('Cargador');
      if (orden.bateria) accesorios.push('Batería');
      if (orden.insumo) accesorios.push('Insumo');
      if (orden.cabezal) accesorios.push('Cabezal');

      doc.font('Helvetica-Bold').fill('#0C4A8C').text('Accesorios:', leftX, y);
      doc.font('Helvetica').fill('#1a1a2e').text(accesorios.length > 0 ? accesorios.join(', ') : '-', leftX + 80, y, { width: 150 });

      doc.font('Helvetica-Bold').fill('#0C4A8C').text('Otros:', col2X, y);
      doc.font('Helvetica').fill('#1a1a2e').text(orden.otros || '-', col2X + 50, y, { width: 180 });
      y += rowH + 10;

      doc.rect(leftX, y, width, 2).fill('#e2e8f0');
      y += 10;

      doc.font('Helvetica-Bold').fill('#0C4A8C').text('Falla Informada:', leftX, y);
      y += 18;
      doc.font('Helvetica').fill('#1a1a2e').text(orden.falla_informada || '-', leftX, y, { width: width, lineGap: 5 });
      y = doc.y + 20;

      doc.font('Helvetica-Bold').fill('#0C4A8C').text('Falla Detectada:', leftX, y);
      y += 18;
      doc.font('Helvetica').fill('#1a1a2e').text(orden.falla_detectada || '-', leftX, y, { width: width, lineGap: 5 });
      y = doc.y + 20;

      doc.font('Helvetica-Bold').fill('#0C4A8C').text('Conclusión:', leftX, y);
      y += 18;
      doc.font('Helvetica').fill('#1a1a2e').text(orden.conclusion || '-', leftX, y, { width: width, lineGap: 5 });
      y = doc.y + 25;
      doc.rect(leftX, y, width, 2).fill('#009EE3');
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error generando PDF" });
  }
});

export default router;
