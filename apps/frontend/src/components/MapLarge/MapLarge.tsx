import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { LatLngLiteral } from 'leaflet';
import styles from './MapLarge.module.css';

// type Props = { coordinates: LatLngLiteral };

export default function MapBox() {
  return (
    <MapContainer
      className={styles.mapContainer}
      center={{ lat: 40, lng: 30 }}
      zoom={13}
      scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={{ lat: 40, lng: 30 }}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
