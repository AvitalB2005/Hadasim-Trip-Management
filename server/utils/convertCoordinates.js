const convertCoordinates = (coords) => {
    // חישוב קו רוחב - Latitude
    const latDegrees = Number(coords.Latitude.Degrees);
    const latMinutes = Number(coords.Latitude.Minutes);
    const latSeconds = Number(coords.Latitude.Seconds);
    const latDecimal = latDegrees + (latMinutes / 60) + (latSeconds / 3600);

    // חישוב קו אורך - Longitude
    const lngDegrees = Number(coords.Longitude.Degrees);
    const lngMinutes = Number(coords.Longitude.Minutes);
    const lngSeconds = Number(coords.Longitude.Seconds);
    const lngDecimal = lngDegrees + (lngMinutes / 60) + (lngSeconds / 3600);

    return {
        latitude: latDecimal,
        longitude: lngDecimal
    };
};

export default convertCoordinates;