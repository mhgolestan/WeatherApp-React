import React, { useState } from 'react';
import ReactGlobe from 'react-globe';
import defaultMarkers from './markers';
import "./App.css"

const api = {
  key: "f23aee746d1da84801efc50791300a95",
  base: "https://api.openweathermap.org/data/2.5/"
}



function getTooltipContent(marker) {
  return `CITY: ${marker.city} (Value: ${marker.value})`;
}


function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});


  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
          setMarkers([{
            id: 1,
            city: query,
            color: `hsl(100, 100%, 50%)`,
            coordinates: [result.coord.lat, result.coord.lon],
            value: [Math.floor(result.main.temp)],
          }])
        });
    }
  }

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }


  const randomMarkers = defaultMarkers.map(marker => ({
    ...marker,
    value: Math.floor(Math.random() * 100),
  }));



  const [markers, setMarkers] = useState([]);
  const [event, setEvent] = useState(null);
  const [details, setDetails] = useState(null);

  function onClickMarker(marker, markerObject, event) {
    setEvent({
      type: 'CLICK',
      marker,
      markerObjectID: markerObject.uuid,
      pointerEventPosition: { x: event.clientX, y: event.clientY },
    });
    setDetails(getTooltipContent(marker));
  }

  function onDefocus(previousCoordinates, event) {
    setEvent({
      type: 'DEFOCUS',
      previousCoordinates,
      pointerEventPosition: { x: event.clientX, y: event.clientY },
    });
    setDetails(null);
  }

  return (
    <div>
      <div className="search-box">
        <input
          type="text"
          className="search-bar"
          placeholder="Search..."
          onChange={e => setQuery(e.target.value)}
          value={query}
          onKeyPress={search}
        />
      </div>
      {(typeof weather.main != "undefined") ? (
        <div>
          <div className="location-box">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
          </div>
          <div className="weather-box">
            <div className="temp">
              {Math.round(weather.main.temp)}°c
            </div>
            <div className="temp">
              {weather.coord.lat}
            </div>
            <div className="weather">{weather.weather[0].main}</div>
          </div>
        </div>
      ) : ('')}




      <div className="React-Globe" >
        <ReactGlobe
          focus={weather.coord ? [weather.coord.lat, weather.coord.lon] : undefined}
          markers={markers}
          markerOptions={{
            enableTooltip: true,
            getTooltipContent: marker => `City: ${marker.city} (Temperature: ${marker.value} °c)`,
          }}
          onClickMarker={onClickMarker}
          onDefocus={onDefocus}
        />


        {details && (
          <div
            style={{
              background: 'white',
              position: 'absolute',
              fontSize: 20,
              top: 0,
              right: 0,
              padding: 0,
            }}>
            <p>{details}</p>
            <p>
              EVENT: type={event.type}, position=
          {JSON.stringify(event.pointerEventPosition)})
        </p>
          </div>
        )}


        <button
          disabled={markers.length === 0}
          onClick={() => setMarkers(markers.slice(0, markers.length - 1))}>
          Local Weather
        </button>





      </div>
    </div >
  );
}

export default App;
