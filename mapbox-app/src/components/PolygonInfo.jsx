import React from "react";

const PolygonInfo = ({ polygonArea }) => {
  return (
    <>
      <h3>Polygon Area</h3>
      <p>{polygonArea} m²</p>
    </>
  );
};

export default PolygonInfo;