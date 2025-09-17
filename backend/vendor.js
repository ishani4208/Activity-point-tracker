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
      "INSERT INTO orders (student_name, phone_no, items) VALUES ($1, $2, $3) RETURNING id, status",
      [studentName, phoneNo, items]
    );
    res.json({
      orderId: result.rows[0].id,
      status: result.rows[0].status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
});

// ---------------- VENDOR: Mark Order as Ready ----------------
app.put("/order/:id/ready", async (req, res) => {
  const orderId = req.params.id;
  try {
    await pool.query("UPDATE orders SET status='completed' WHERE id=$1", [orderId]);
    res.json({ message: "Order marked as completed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating order");
  }
});

// ---------------- Start Vendor Server ----------------
app.listen(3000, () => {
  console.log("✅ Vendor server running on http://localhost:3000");
});
