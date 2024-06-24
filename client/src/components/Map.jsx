import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";

const Map = ({ setBounds, userLocation, data, setChild }) => {
  return (
    <div className="w-full" style={{ height: "35vh" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        defaultCenter={userLocation}
        center={userLocation}
        defaultZoom={11}
        margin={[50, 50, 50, 50]}
        onChange={(e) => {
          setBounds({
            sw: { lat: e.bounds.sw.lat, lng: e.bounds.sw.lng },
            ne: { lat: e.bounds.ne.lat, lng: e.bounds.ne.lng },
          });
        }}
        onChildClick={(e) => {
          setChild(e);
        }}
      ></GoogleMapReact>
    </div>
  );
};

export default Map;
