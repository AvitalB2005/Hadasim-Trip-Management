import { useEffect, useState } from 'react';
import { Box, Alert } from '@mui/material';
// הוספת CircleMarker לייבוא
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import fetchData from '../../service/FetchData.js';

// רכיב עזר לעדכון גבולות המפה (fitBounds)
function MapResizer({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
}

export default function MapPage() {
  const [locations, setLocations] = useState([]);
  const [teacherLocation, setTeacherLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([31.9, 34.9]); 
  const [error, setError] = useState('');

  async function getLocations() {
    try {
      const data = await fetchData('locations/all', 'GET');
      const students = Array.isArray(data?.students) ? data.students : [];
      const validStudents = students.filter(s => s.latitude && s.longitude);
      
      setLocations(validStudents);
      setTeacherLocation(data?.teacherLocation || null);

      if (data?.teacherLocation?.latitude) {
        setMapCenter([Number(data.teacherLocation.latitude), Number(data.teacherLocation.longitude)]);
      }
    } catch (err) {
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

  return (
    <Box sx={{ width: '100%', p: 1 }}>
      {error ? <Alert severity="error">{error}</Alert> : (
        <MapContainer 
          center={mapCenter} 
          zoom={10} 
          style={{ height: '65vh', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />          
          
          <MapResizer points={allPoints} />

          {/* סמנים רגילים לתלמידות */}
          {locations.map((student) => (
            <Marker key={student.user_id} position={[Number(student.latitude), Number(student.longitude)]}>
             <Popup>
               <div style={{ textAlign: 'right', direction: 'rtl', fontFamily: 'sans-serif' }}>
                <strong style={{ color: '#1976d2' }}>שם: </strong>{student.full_name}<br />
                <strong style={{ color: '#1976d2' }}>ת"ז: </strong>{student.user_id}<br />
               </div>
             </Popup>
            </Marker>
          ))}

          {/* החלפת המרקר של המורה בנקודה כחולה (CircleMarker) */}
          {teacherLocation && (
             <CircleMarker 
              center={[Number(teacherLocation.latitude), Number(teacherLocation.longitude)]}
              radius={10} // גודל הנקודה
              pathOptions={{ 
                color: '#1565c0',      // צבע מסגרת כחול כהה
                fillColor: '#2196f3',  // צבע מילוי כחול בהיר
                fillOpacity: 0.8,      // שקיפות המילוי
                weight: 2              // עובי המסגרת
              }}
             >
              <Popup>
               <div style={{ textAlign: 'right', direction: 'rtl', fontFamily: 'sans-serif' }}>
                <strong style={{ color: '#1976d2' }}>מורה: </strong>{teacherLocation.full_name}<br />
               </div>
              </Popup>            
             </CircleMarker>
          )}
        </MapContainer>
      )}
    </Box>
  );
}