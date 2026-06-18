import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";

import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "./App.css";

mapboxgl.accessToken =
  "YOUR_MAPBOX_ACCESS_TOKEN";

function App() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const drawRef = useRef(null);
  const markersRef = useRef([]);

  const [markers, setMarkers] = useState([]);
  const [polygonArea, setPolygonArea] =
    useState(0);

  useEffect(() => {
    const savedMarkers =
      JSON.parse(
        localStorage.getItem("markers")
      ) || [];

    const savedPolygon =
      JSON.parse(
        localStorage.getItem("polygon")
      ) || null;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style:
        "mapbox://styles/mapbox/streets-v12",
      center: [77.209, 28.6139],
      zoom: 10,
    });

    mapRef.current = map;

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    drawRef.current = draw;

    map.addControl(draw);

    map.on("load", () => {
      savedMarkers.forEach((m) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([m.lng, m.lat])
          .setPopup(
            new mapboxgl.Popup().setText(
              `${m.lat}, ${m.lng}`
            )
          )
          .addTo(map);

        m.marker = marker;
      });

      setMarkers(savedMarkers);

      markersRef.current = savedMarkers;

      if (savedPolygon) {
        draw.add(savedPolygon);

        const area =
          turf.area(savedPolygon);

        setPolygonArea(
          area.toFixed(2)
        );
      }
    });

    map.on("click", (e) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([
          e.lngLat.lng,
          e.lngLat.lat,
        ])
        .setPopup(
          new mapboxgl.Popup().setText(
            `${e.lngLat.lat}, ${e.lngLat.lng}`
          )
        )
        .addTo(map);

      const newMarker = {
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
        marker,
      };

      const updated = [
        ...markersRef.current,
        newMarker,
      ];

      markersRef.current = updated;

      setMarkers(updated);

      localStorage.setItem(
        "markers",
        JSON.stringify(
          updated.map((m) => ({
            lat: m.lat,
            lng: m.lng,
          }))
        )
      );
    });

    const updateArea = () => {
      const data = draw.getAll();

      if (data.features.length > 0) {
        const area = turf.area(data);

        setPolygonArea(
          area.toFixed(2)
        );

        localStorage.setItem(
          "polygon",
          JSON.stringify(
            data.features[0]
          )
        );
      } else {
        setPolygonArea(0);

        localStorage.removeItem(
          "polygon"
        );
      }
    };

    map.on(
      "draw.create",
      updateArea
    );
    map.on(
      "draw.update",
      updateArea
    );
    map.on(
      "draw.delete",
      updateArea
    );

    return () => map.remove();
  }, []);

  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  const clearAll = () => {
    markers.forEach((m) => {
      if (m.marker) {
        m.marker.remove();
      }
    });

    drawRef.current.deleteAll();

    setMarkers([]);
    setPolygonArea(0);

    localStorage.removeItem(
      "markers"
    );

    localStorage.removeItem(
      "polygon"
    );
  };

  const exportGeoJSON = () => {
    const data =
      drawRef.current.getAll();

    const blob = new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download =
      "map-data.geojson";

    a.click();
  };

  const importGeoJSON = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = (event) => {
      const geojson = JSON.parse(
        event.target.result
      );

      drawRef.current.deleteAll();

      drawRef.current.add(
        geojson
      );

      const area =
        turf.area(geojson);

      setPolygonArea(
        area.toFixed(2)
      );
    };

    reader.readAsText(file);
  };

  return (
    <div className="app">
      <MapView
        mapContainer={
          mapContainer
        }
      />

      <Sidebar
        markers={markers}
        polygonArea={
          polygonArea
        }
        clearAll={clearAll}
        exportGeoJSON={
          exportGeoJSON
        }
        importGeoJSON={
          importGeoJSON
        }
      />
    </div>
  );
}

export default App;