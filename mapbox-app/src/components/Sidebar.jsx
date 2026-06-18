import React from "react";
import MarkerList from "./MarkerList";
import PolygonInfo from "./PolygonInfo";

const Sidebar = ({
  markers,
  polygonArea,
  clearAll,
  exportGeoJSON,
  importGeoJSON,
}) => {
  return (
    <div className="sidebar">
      <MarkerList markers={markers} />

      <hr />

      <PolygonInfo polygonArea={polygonArea} />

      <button onClick={clearAll}>
        Clear All
      </button>

      <br />
      <br />

      <button onClick={exportGeoJSON}>
        Export GeoJSON
      </button>

      <br />
      <br />

      <input
        type="file"
        accept=".geojson,.json"
        onChange={importGeoJSON}
      />
    </div>
  );
};

export default Sidebar;