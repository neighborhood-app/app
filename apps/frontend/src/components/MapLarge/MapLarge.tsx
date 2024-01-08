/* eslint-disable global-require */
import { useNavigate } from 'react-router';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { Map, Icon } from 'leaflet';
import { Neighborhood } from '@neighborhood/backend/src/types';
import { useState, useEffect } from 'react';
import neighborhoodsServices from '../../services/neighborhoods';
import styles from './MapLarge.module.css';

const markerIcon = new Icon({
  iconUrl: require('../../assets/icons/location(1).png'),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export default function MapBox() {
  const navigate = useNavigate();

  const [map, setMap] = useState<Map | null>(null);
  const [visibleNeighborhoods, setVisibleNeighborhoods] = useState<Neighborhood[] | null>(null);

  useEffect(() => {
    if (!map) return;

    map.locate({ setView: true, maxZoom: 15 }).on('locationerror', () => {
      neighborhoodsServices
        .filterByLocation(map.getBounds())
        .then((result) => setVisibleNeighborhoods(result as unknown as Neighborhood[]));
    });

    map.on('locate', () => {
      neighborhoodsServices
        .filterByLocation(map.getBounds())
        .then((result) => setVisibleNeighborhoods(result as unknown as Neighborhood[]));
    });

    map.on('moveend', () => {
      neighborhoodsServices
        .filterByLocation(map.getBounds())
        .then((result) => setVisibleNeighborhoods(result as unknown as Neighborhood[]));
    });
  }, [map]);

  const markers = visibleNeighborhoods
    ? visibleNeighborhoods.map((neighborhood: Neighborhood) => (
        <Marker
          // @ts-ignore
          position={{ lat: neighborhood.location.y, lng: neighborhood.location.x }}
          icon={markerIcon}
          eventHandlers={{
            click: () => {
              navigate(`/neighborhoods/${neighborhood.id}`);
            },
          }}>
          <Tooltip direction="top">{neighborhood.name}</Tooltip>
        </Marker>
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
