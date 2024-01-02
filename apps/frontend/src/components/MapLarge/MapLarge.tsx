import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { LatLngLiteral } from 'leaflet';
import styles from './MapLarge.module.css';
import AlertBox from '../AlertBox/AlertBox';

function GetBounds() {
  const map = useMap();
  console.log(map.getBounds());
  return null;
}

function ChangeView({ center }: { center: LatLngLiteral }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

export default function MapBox() {
  const [userLocation, setUserLocation] = useState({ lat: 44.4265238, lng: 26.1022403 });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    } else {
      setErrorMsg('Browser does not support geolocation');
    }
  }, []);

  return (
    <>
      {errorMsg && <AlertBox text={errorMsg} variant="danger" />}
      <MapContainer
        className={styles.mapContainer}
        center={userLocation}
        zoom={13}
        scrollWheelZoom={false}>
        <ChangeView center={userLocation} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={userLocation}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <GetBounds />
      </MapContainer>
    </>
  );
}
