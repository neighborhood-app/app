import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { SearchResult } from 'leaflet-geosearch/dist/providers/provider';
import styles from './MapBox.module.css';

type Props = {
  coordinates: SearchResult;
};

export default function MapBox({ coordinates }: Props) {
  return (
    <MapContainer
      className={styles.mapContainer}
      center={[coordinates.y, coordinates.x]}
      zoom={13}
      scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[coordinates.y, coordinates.x]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
