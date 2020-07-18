import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import useGetLocation from './useGetLocation'

function FetchData() {
    const [data, setData] = useState({ hits: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const [pos, error] = useGetLocation();
    const endpoint = "https://fcc-weather-api.glitch.me/";
    const route = "/api/current?";
    const lat = pos.latitude;
    const lon = pos.longitude;
    const apiUrl = endpoint + route + "lon=" + lat + "&lat=" + lon;

    useEffect(() => {
        const fetchData = async () => {
            setIsError(false);
            setIsLoading(true);

            try {
                const result = await axios(apiUrl);

                setData(result.data);
            } catch (error) {
                setIsError(true);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [apiUrl]);
    const value = new Object(data.main);

    const handleSaveToPC = data => {
        const fileData = JSON.stringify(data);
        const blob = new Blob([fileData], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'filename.json';
        link.href = url;
        link.click();
    }

    return (


        <Fragment>
            {isError && <div>Something went wrong ...</div>
            }

            {
                isLoading ? (
                    <div>Loading ...</div>
                ) : (
                        <div>
                            <h1>{value.temp}</h1>
                        </div>
                    )
            }
        </Fragment >
    );
}

export default FetchData;