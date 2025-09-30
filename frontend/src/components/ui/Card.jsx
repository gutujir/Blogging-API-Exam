import React from "react";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded shadow p-4 ${className}`}>{children}</div>
);

export default Card;
