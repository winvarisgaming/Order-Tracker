import React from "react";

function OrderStatus({ status }) {
  return (
    status && (
      <div className="alert alert-success text-center mt-3">
        <h4 className="alert-heading">Order Status</h4>
        <p>{status}</p>
      </div>
    )
  );
}

export default OrderStatus;
