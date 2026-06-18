This application is built using React and Mapbox GL JS. It allows users to:

- Add markers by clicking on the map
- View marker coordinates
- Draw polygons on the map
- Calculate polygon area using Turf.js
- Persist markers and polygons using Local Storage
- Export polygon data as GeoJSON
- Import GeoJSON files
- Clear all map data


Installation

1. Clone the repository.

2. Install dependencies.

    npm install

3. Install required packages.

    npm install mapbox-gl @mapbox/mapbox-gl-draw @turf/turf

4. Add your Mapbox access token in App.jsx.

    mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";

5. Start the application.

    npm start

The application will run at:

http://localhost:3000
