import React, { useState } from "react";
import api from "./api"; // Import API configuration

function App() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const checkOrderStatus = async () => {
    if (!phoneNumber) {
      setErrorMessage("กรุณากรอกหมายเลขโทรศัพท์");
      setOrders([]);
      return;
    }

    let updatedPhoneNumber = phoneNumber;
    if (phoneNumber.charAt(0) === "0") {
      updatedPhoneNumber = "+66" + phoneNumber.slice(1);
    }

    setErrorMessage("");

    try {
      // Step 1: Get today's date range (00:00 - 23:59 UTC)
      const today = new Date();
      const from = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()-2, 0, 0, 0)).toISOString();
      const to = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)).toISOString();

      // Step 2: Get all transactions for today
      const transactionsResponse = await api.get(`/transactions?from=${from}&to=${to}&includeOnline=true`);
      if (!transactionsResponse.data || transactionsResponse.data.length === 0) {
        setErrorMessage("ยังไม่พบออเดอร์ไดๆ กรุณาติดต่อแอดมิน");
        return;
      }

      // Step 3: Filter transactions by phone number
      const customerOrders = transactionsResponse.data.filter(
        order =>
          order.contactDetail.phone === updatedPhoneNumber &&
          order.status !== "paymentCancelled" &&
          order.status !== "cancelled"
      );      

      //console.log(transactionsResponse.data.filter(order => order.contactDetail.phone));

      if (customerOrders.length < 1) {
        setErrorMessage("ไม่พบรายการสั่งซื้อของคุณลูกค้า");
        setOrders([]);
        return;
      }

      setOrders(customerOrders);
    } catch (error) {
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      setOrders([]);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Order Tracker</h1>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="กรอกหมายเลขโทรศัพท์"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button className="btn btn-primary" onClick={checkOrderStatus}>
        ตรวจสอบ
      </button>

      {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}

      {orders.length > 0 && (
        <div className="mt-3">
          <h3>รายการสั่งซื้อ</h3>
          <ul className="list-group">
            {orders.map((order, index) => (
              <li key={index} className="list-group-item">
                <strong>หมายเลขคำสั่งซื้อ:</strong> {order.invoiceNumber} <br />
                <strong>เวลาสั่งซื้อ:</strong> {new Date(order.transactionTime).toLocaleString("th-TH")} <br />
                <strong>สถานะออเดอร์:</strong> {order.status === "pickedUp" ? "Ready" : order.status === "confirmed" ? "Cooking" : order.status === "pendingPickUp" ? "Ordered" : order.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
