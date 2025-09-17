import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [view, setView] = useState("vendor");

  return (
    <div className="app-container">
      {/* Left side: app content */}
      <div className="left-panel">
        <h1 className="heading">Canteen Order System</h1>
        <div className="toggle-group">
          <button
            onClick={() => setView("vendor")}
            className={view === "vendor" ? "toggle-btn active" : "toggle-btn"}
          >
            Vendor View
          </button>
          <button
            onClick={() => setView("student")}
            className={view === "student" ? "toggle-btn active" : "toggle-btn"}
          >
            Student View
          </button>
        </div>
        <div className="content-center">
          {view === "vendor" ? <Vendor /> : <Student />}
        </div>
      </div>
      {/* Right side: image */}
      <div className="right-panel">
        <img
          src="/fast-food-meal-set-vector-removebg-preview.png"
          alt="Canteen background"
          className="canteen-img"
        />
      </div>
    </div>
  );
}

function Vendor() {
  const [studentName, setStudentName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [items, setItems] = useState("");
  const [orderId, setOrderId] = useState(null);

  const createOrder = async () => {
  try {
    const res = await axios.post("http://localhost:3000/order", {
      studentName,
      phoneNo,
      items,
    });
    setOrderId(res.data.orderId);
    alert("Order created successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to create order. Please try again.");
  }
};

  const markReady = async () => {
    await axios.put(`http://localhost:5000/order/${orderId}/ready`);
    alert("Order marked as ready!");
  };

  return (
    <div className="vendor-form">
      <input
        placeholder="Student Name"
        className="input"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />
      <input
        placeholder="Phone No"
        className="input"
        value={phoneNo}
        onChange={(e) => setPhoneNo(e.target.value)}
      />
      <input
        placeholder="Items Ordered"
        className="input"
        value={items}
        onChange={(e) => setItems(e.target.value)}
      />
      <button
        onClick={createOrder}
        className="btn btn-green"
      >
        Create Order
      </button>
      {orderId && (
        <div>
          <p>Order ID: {orderId}</p>
          <button
            onClick={markReady}
            className="btn btn-blue"
          >
            Mark Ready
          </button>
        </div>
      )}
    </div>
  );
}

function Student() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/order/${orderId}`);
      setOrder(res.data);
    } catch {
      alert("Order not found");
    }
  };

  return (
    <div className="student-form">
      <input
        placeholder="Enter Order ID"
        className="input"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />
      <button
        onClick={fetchOrder}
        className="btn btn-purple"
      >
        Check Status
      </button>
      {order && (
        <div className="order-status">
          <p>
            <b>Items:</b> {order.items}
          </p>
          <p>
            <b>Status:</b> {order.status}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;