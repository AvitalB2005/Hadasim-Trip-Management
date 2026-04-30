import { useEffect, useState } from 'react';
import { Box, Alert, Typography, Paper, Chip, Divider, Stack } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import fetchData from '../../service/FetchData.js';
import calculateDistance from '../../service/calculateDistance.js';

const createCustomIcon = (color) =>
  new L.divIcon({
    html: `
      <svg width="30" height="42" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C7.58 0 4 3.58 4 8C4 13.54 12 24 12 24C12 24 20 13.54 20 8C20 3.58 16.42 0 12 0ZM12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11Z"
          stroke="white" stroke-width="1"/>
      </svg>`,
    className: 'custom-marker',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40]
  });

function MapResizer({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points?.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [Number(p.latitude), Number(p.longitude)]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
}

const popupRowSx = {
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: 1
};

function StudentPopupBody({ student, distance, isTooFar }) {
  if (!isTooFar) {
    return (
      <Box sx={{ p: 1, minWidth: 120 }}>
        <Stack spacing={0.5}>
          <Box sx={popupRowSx}>
            <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 'bold' }}>:שם</Typography>
            <Typography variant="subtitle2">{student.full_name}</Typography>
          </Box>
          <Box sx={popupRowSx}>
            <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              {':ת"ז'}
            </Typography>
            <Typography variant="subtitle2">{student.user_id}</Typography>
          </Box>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1, minWidth: 120 }}>
      <Stack spacing={0.5}>
        <Box sx={popupRowSx}>
          <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 'bold' }}>:שם</Typography>
          <Typography variant="subtitle2">{student.full_name}</Typography>
        </Box>
        <Box sx={popupRowSx}>
          <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
            {':ת"ז'}
          </Typography>
          <Typography variant="subtitle2">{student.user_id}</Typography>
        </Box>
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Stack spacing={1} alignItems="flex-start">
        <Chip
          label={`מרחק: ${distance.toFixed(1)} ק"מ`}
          size="small"
          color="error"
          variant="filled"
          sx={{ fontSize: '0.75rem', width: '100%', borderRadius: '4px' }}
        />
        <Typography
          variant="caption"
          color="error.main"
          sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <span>⚠️</span>
          <span>חריגה מהטווח המותר</span>
        </Typography>
      </Stack>
    </Box>
  );
}

function StudentMapMarker({ student, teacherLocation }) {
  let distance = 0;
  if (teacherLocation) {
    distance = calculateDistance(
      Number(teacherLocation.latitude),
      Number(teacherLocation.longitude),
      Number(student.latitude),
      Number(student.longitude)
    );
  }
  const isTooFar = distance > 3;
  const markerColor = isTooFar ? '#d32f2f' : '#1976d2';

  return (
    <Marker
      position={[Number(student.latitude), Number(student.longitude)]}
      icon={createCustomIcon(markerColor)}
    >
      <Popup>
        <StudentPopupBody student={student} distance={distance} isTooFar={isTooFar} />
      </Popup>
    </Marker>
  );
}

function TeacherMapMarker({ teacherLocation }) {
  return (
    <CircleMarker
      center={[Number(teacherLocation.latitude), Number(teacherLocation.longitude)]}
      radius={10}
      pathOptions={{
        color: '#757575',
        fillColor: '#ffffff',
        fillOpacity: 1,
        weight: 2
      }}
    >
      <Popup>
        <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          מקומך הנוכחי
        </Typography>
      </Popup>
    </CircleMarker>
  );
}

export default function MapPage({ embedded = false }) {
  const [locations, setLocations] = useState([]);
  const [teacherLocation, setTeacherLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([31.9, 34.9]);
  const [error, setError] = useState('');

  async function getLocations() {
    try {
      const data = await fetchData('locations/all', 'GET');
      const students = Array.isArray(data?.students) ? data.students : [];
      const validStudents = students.filter((s) => s.latitude && s.longitude);

      setLocations(validStudents);
      setTeacherLocation(data?.teacherLocation || null);

      if (data?.teacherLocation?.latitude) {
        setMapCenter([
          Number(data.teacherLocation.latitude),
          Number(data.teacherLocation.longitude)
        ]);
      }
    } catch {
      setError('שגיאה בטעינת נתונים');
    }
  }

  useEffect(() => {
    getLocations();
    const intervalId = setInterval(getLocations, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const allPoints = [...locations];
  if (teacherLocation) allPoints.push(teacherLocation);

  if (error) {
    return (
      <Box sx={{ width: '100%', p: embedded ? 0 : 2, direction: 'rtl' }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: embedded ? 0 : 2, direction: 'rtl' }}>
      <Paper elevation={3} sx={{ p: 1, borderRadius: 2, overflow: 'hidden' }}>
        <MapContainer center={mapCenter} zoom={10} style={{ height: '70vh', width: '100%', borderRadius: '8px' }}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          <MapResizer points={allPoints} />
          {locations.map((student) => (
            <StudentMapMarker key={student.user_id} student={student} teacherLocation={teacherLocation} />
          ))}
          {teacherLocation ? <TeacherMapMarker teacherLocation={teacherLocation} /> : null}
        </MapContainer>
      </Paper>
    </Box>
  );
}
