import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pool from "./db.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---------------- STUDENT: Get Order by ID ----------------
app.get("/order/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, student_name, phone_no, items, status FROM orders WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(result.rows[0]); // ✅ frontend expects {items, status}
  } catch (err) {
    console.error("❌ Error fetching order:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Start Student Server ----------------
app.listen(4000, () => {
  console.log("✅ Student server running on http://localhost:4000");
});
