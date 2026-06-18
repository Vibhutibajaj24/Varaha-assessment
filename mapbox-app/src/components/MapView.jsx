import React from "react";

const MapView = ({ mapContainer }) => {
  return (
    <div
      ref={mapContainer}
      className="map-container"
    />
  );
};

export default MapView;