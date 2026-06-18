import React from "react";

const MarkerList = ({ markers }) => {
  return (
    <>
      <h2>Markers</h2>

      {markers.length === 0 ? (
        <p>No markers added</p>
      ) : (
        markers.map((m, index) => (
          <div key={index}>
            {m.lat.toFixed(5)} , {m.lng.toFixed(5)}
          </div>
        ))
      )}
    </>
  );
};

export default MarkerList;