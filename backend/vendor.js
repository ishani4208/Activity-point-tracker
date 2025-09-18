import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pool from "./db.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---------------- VENDOR: Create Order ----------------
app.post("/order", async (req, res) => {
  console.log("Vendor request body:", req.body);
  const { studentName, phoneNo, items } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO orders (student_name, phone_no, items, status) VALUES ($1, $2, $3, $4) RETURNING id, status",
      [studentName, phoneNo, items, "pending"] // default status
    );

    res.json({
      orderId: result.rows[0].id,
      status: result.rows[0].status,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err.message);
    res.status(500).json({ error: "Error creating order" });
  }
});

// ---------------- VENDOR: Get All Orders ----------------
app.get("/orders", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching orders:", err.message);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

// ---------------- VENDOR: Mark Order as Ready ----------------
app.put("/order/:id/ready", async (req, res) => {
  const orderId = req.params.id;

  try {
    const result = await pool.query(
      "UPDATE orders SET status='completed' WHERE id=$1 RETURNING id, status",
      [orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      orderId: result.rows[0].id,
      status: result.rows[0].status,
      message: "Order marked as completed",
    });
  } catch (err) {
    console.error("❌ Error updating order:", err.message);
    res.status(500).json({ error: "Error updating order" });
  }
});

// ---------------- Start Vendor Server ----------------
app.listen(3000, () => {
  console.log("✅ Vendor server running on http://localhost:3000");
});
