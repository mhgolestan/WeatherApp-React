import { useState, useEffect } from "react";

const useGetLocation = () => {
    const [position, setPosition] = useState({});
    const [error, setError] = useState(null);

    const successHandler = ({ coords }) => {
        setPosition({
            latitude: coords.latitude,
            longitude: coords.longitude
        });
    };

    const errorHandler = error => {
        setError(error.message);
    };

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation might not be supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(successHandler, errorHandler);

        return () => { };
    }, []);

    return [position, error];
};

export default useGetLocation;