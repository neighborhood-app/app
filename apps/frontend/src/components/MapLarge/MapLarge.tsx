// @ts-nocheck
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useState, useEffect } from 'react';
// import { LatLngLiteral } from 'leaflet';
// import { Neighborhood } from '@prisma/client';
import neighborhoodsServices from '../../services/neighborhoods';
import styles from './MapLarge.module.css';
// import AlertBox from '../AlertBox/AlertBox';

export default function MapBox() {
  const [map, setMap] = useState(null);
  const [visibleNeighborhoods, setVisibleNeighborhoods] = useState(null);

  console.log(visibleNeighborhoods);

  useEffect(() => {
    if (!map) return;
    map.on('moveend', async () => {
      setVisibleNeighborhoods(await neighborhoodsServices.filterByLocation(map.getBounds()));
    });
  }, [map]);

  const markers = visibleNeighborhoods
    ? visibleNeighborhoods.map((neighborhood) => (
        <Marker position={{ lat: neighborhood.location.y, lng: neighborhood.location.x }}></Marker>
      ))
    : null;

  return (
    <>
      {/* {errorMsg && <AlertBox text={errorMsg} variant="danger" />} */}
      <MapContainer
        className={styles.mapContainer}
        center={{ lat: 44.4265238, lng: 26.1022403 }}
        zoom={13}
        scrollWheelZoom={false}
        ref={setMap}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers}
      </MapContainer>
    </>
  );
}
