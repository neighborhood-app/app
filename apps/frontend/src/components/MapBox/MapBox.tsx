import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import styles from './MapBox.module.css';

export default function MapBox() {
  return (
    <MapContainer
      className={styles.mapContainer}
      center={[44.41564, 26.0355]}
      zoom={13}
      scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[44.41564, 26.0355]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
