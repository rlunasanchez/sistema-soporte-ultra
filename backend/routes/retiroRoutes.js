import express from "express";
import pool from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import XlsxPopulate from "xlsx-populate";

const router = express.Router();

router.use(authMiddleware);

const formatDate = (d) =>
  d ? new Date(d).toISOString().slice(0, 19).replace("T", " ") : null;

/* ===============================
   OBTENER RETIROS CON PAGINACION
================================*/
router.get("/", async (req, res) => {
  try {
    const { fechaDesde, fechaHasta, page, limit } = req.query;

    let sql = "SELECT * FROM equipos_retirados WHERE 1=1";
    let countSql = "SELECT COUNT(*) as total FROM equipos_retirados WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    if (fechaDesde) {
      sql += ` AND fecha_retiro::date >= $${paramIndex}::date`;
      countSql += ` AND fecha_retiro::date >= $${paramIndex}::date`;
      params.push(fechaDesde);
      paramIndex++;
    }

    if (fechaHasta) {
      sql += ` AND fecha_retiro::date <= $${paramIndex}::date`;
      countSql += ` AND fecha_retiro::date <= $${paramIndex}::date`;
      params.push(fechaHasta);
      paramIndex++;
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 5;
    const offset = (pageNum - 1) * limitNum;

    sql += ` ORDER BY id DESC LIMIT ${limitNum} OFFSET ${offset}`;

    const result = await pool.query(sql, params);
    const rows = result.rows;
    
    const countResult = await pool.query(countSql, params);
    const total = countResult.rows[0].total;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      data: rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error obteniendo retiros" });
  }
});

/* ===============================
   CREAR NUEVO RETIRO
================================*/
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    const sql = `
      INSERT INTO equipos_retirados (fecha_retiro, serie_reversa, equipo)
      VALUES ($1, $2, $3)
      RETURNING id
    `;

    const values = [
      formatDate(data.fecha_retiro),
      data.serie_reversa,
      data.equipo,
    ];

    const result = await pool.query(sql, values);

    res.status(201).json({
      msg: "Retiro creado correctamente",
      id: result.rows[0].id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creando retiro" });
  }
});

/* ===============================
   ACTUALIZAR RETIRO
================================*/
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const sql = `
      UPDATE equipos_retirados SET
        fecha_retiro = $1,
        serie_reversa = $2,
        equipo = $3
      WHERE id = $4
    `;

    const values = [
      formatDate(data.fecha_retiro),
      data.serie_reversa,
      data.equipo,
      id,
    ];

    await pool.query(sql, values);

    res.json({ msg: "Retiro actualizado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error actualizando retiro" });
  }
});

/* ===============================
   ELIMINAR RETIRO
================================*/
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM equipos_retirados WHERE id = $1", [id]);

    res.json({ msg: "Retiro eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error eliminando retiro" });
  }
});

/* ===============================
   EXPORTAR EXCEL EQUIPOS RETIRADOS
================================*/
router.get("/excel", async (req, res) => {
  try {
    const { fechaDesde, fechaHasta } = req.query;

    let sql = "SELECT * FROM equipos_retirados WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    if (fechaDesde) {
      sql += ` AND DATE(fecha_retiro) >= $${paramIndex}`;
      params.push(fechaDesde);
      paramIndex++;
    }

    if (fechaHasta) {
      sql += ` AND DATE(fecha_retiro) <= $${paramIndex}`;
      params.push(fechaHasta);
      paramIndex++;
    }

    sql += " ORDER BY fecha_retiro DESC";

    const result = await pool.query(sql, params);
    const rows = result.rows;

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);

    sheet.name("Equipos Retirados");

    sheet.cell("A1").value("Equipos Retirados - Banco Estado");
    sheet.range("A1:D1").merged(true).style({
      bold: true,
      fontSize: 16,
      horizontalAlignment: "center",
      verticalAlignment: "center",
      fill: "059669",
      fontColor: "FFFFFF",
    });

    sheet.row(1).height(30);

    const headers = [
      "Fecha de Retiro",
      "Serie Reversa",
      "Equipo"
    ];

    headers.forEach((h, i) => {
      sheet.cell(3, i + 1).value(h);
    });

    sheet.range("A3:D3").style({
      bold: true,
      fill: "D1FAE5",
      horizontalAlignment: "center",
      border: true,
      borderColor: "059669",
      fontColor: "065F46",
    });

    rows.forEach((r, i) => {
      const row = i + 4;

      sheet.cell(`A${row}`).value(r.fecha_retiro ? new Date(r.fecha_retiro).toLocaleDateString("es-CL") : "");
      sheet.cell(`B${row}`).value(r.serie_reversa);
      sheet.cell(`C${row}`).value(r.equipo);

      sheet.range(`A${row}:D${row}`).style({
        horizontalAlignment: "center",
        verticalAlignment: "center",
        border: true,
        borderColor: "E2E8F0",
      });

      if (i % 2 === 0) {
        sheet.range(`A${row}:D${row}`).style({
          fill: "F0FDF4",
        });
      }
    });

    sheet.column("A").width(20);
    sheet.column("B").width(25);
    sheet.column("C").width(30);

    const buffer = await workbook.outputAsync();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Equipos Retirados.xlsx",
    );

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error generando Excel" });
  }
});

export default router;
