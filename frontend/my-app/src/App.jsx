import React, { useState, useEffect } from "react";
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
  const [orders, setOrders] = useState([]);

  // fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // create new order
  const createOrder = async () => {
    try {
      await axios.post("http://localhost:3000/order", {
        studentName,
        phoneNo,
        items,
      });
      setStudentName("");
      setPhoneNo("");
      setItems("");
      fetchOrders();
      alert("Order created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create order. Please try again.");
    }
  };

  // mark order ready
  const markReady = async (id) => {
    try {
      await axios.put(`http://localhost:3000/order/${id}/ready`);
      fetchOrders();
      alert(`Order ${id} marked as ready!`);
    } catch (err) {
      console.error(err);
      alert("Failed to update order.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const pendingOrders = orders.filter((o) => o.status !== "completed");
  const completedOrders = orders.filter((o) => o.status === "completed");

  return (
    <div className="vendor-form">
      {/* Create Order Form */}
      <h2 className="subheading">Create New Order</h2>
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
      <button onClick={createOrder} className="btn btn-green">
        Create Order
      </button>

      {/* Pending Orders */}
      <h2 className="subheading">Pending Orders</h2>
      {pendingOrders.length === 0 ? (
        <p className="info-text">No pending orders</p>
      ) : (
        <ul className="orders-list">
          {pendingOrders.map((order) => (
            <li key={order.id} className="order-card">
              <p><b>ID:</b> {order.id}</p>
              <p><b>Student:</b> {order.student_name}</p>
              <p><b>Phone:</b> {order.phone_no}</p>
              <p><b>Items:</b> {order.items}</p>
              <p><b>Status:</b> {order.status}</p>
              <button
                onClick={() => markReady(order.id)}
                className="btn btn-blue"
              >
                Mark Ready
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Completed Orders */}
      <h2 className="subheading">Completed Orders</h2>
      {completedOrders.length === 0 ? (
        <p className="info-text">No completed orders yet</p>
      ) : (
        <ul className="orders-list">
          {completedOrders.map((order) => (
            <li key={order.id} className="order-card completed">
              <p><b>ID:</b> {order.id}</p>
              <p><b>Student:</b> {order.student_name}</p>
              <p><b>Phone:</b> {order.phone_no}</p>
              <p><b>Items:</b> {order.items}</p>
              <p><b>Status:</b> {order.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Student() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/order/${orderId}`);
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
      <button onClick={fetchOrder} className="btn btn-purple">
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
