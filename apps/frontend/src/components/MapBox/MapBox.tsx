import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { LatLngLiteral, Icon } from 'leaflet';
import styles from './MapBox.module.css';

type Props = { coordinates: LatLngLiteral };

const markerIcon = new Icon({
  // eslint-disable-next-line global-require
  iconUrl: require('../../assets/icons/location(1).png'),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  tooltipAnchor: [0, -38],
});

export default function MapBox({ coordinates }: Props) {
  return (
    <MapContainer
      className={styles.mapContainer}
      center={coordinates}
      zoom={13}
      scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coordinates} icon={markerIcon}></Marker>
    </MapContainer>
  );
}
