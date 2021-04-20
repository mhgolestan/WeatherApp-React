import React, { useState } from "react";
import ReactGlobe from "react-globe";
import "./App.css";

const api = {
  key: process.env.REACT_APP_Weather_API_KEY,
  base: "https://api.openweathermap.org/data/2.5/",
};

function getTooltipContent(marker) {
  return `CITY: ${marker.city} (Value: ${marker.value})`;
}

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});

  const search = (evt) => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then((res) => res.json())
        .then((res) => {
          setWeather(res);
          setQuery("");
          setMarkers([
            {
              id: 1,
              city: query,
              color: `hsl(100, 100%, 50%)`,
              coordinates: [res.coord.lat, res.coord.lon],
              value: [Math.floor(res.main.temp)],
            },
          ]);
        })
        .catch((err) => alert("City not found"));
    }
  };

  const dateBuilder = (d) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  const [markers, setMarkers] = useState([]);
  const [event, setEvent] = useState(null);
  const [details, setDetails] = useState(null);

  function onClickMarker(marker, markerObject, event) {
    setEvent({
      type: "CLICK",
      marker,
      markerObjectID: markerObject.uuid,
      pointerEventPosition: { x: event.clientX, y: event.clientY },
    });
    setDetails(getTooltipContent(marker));
  }

  function onDefocus(previousCoordinates, event) {
    setEvent({
      type: "DEFOCUS",
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
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          onKeyPress={search}
        />
      </div>
      {typeof weather.main != "undefined" ? (
        <div className="result-box">
          <div>
            <div>
              <strong>City: </strong>
              {weather.name}
            </div>
            <div>
              {" "}
              <strong>Date: </strong> {dateBuilder(new Date())}
            </div>
          </div>
          <div>
            <div>
              <strong>Temperature: </strong> {Math.round(weather.main.temp)}°c
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="React-Globe">
        <ReactGlobe
          focus={
            weather.coord ? [weather.coord.lat, weather.coord.lon] : undefined
          }
          markers={markers}
          markerOptions={{
            enableTooltip: true,
            getTooltipContent: (marker) =>
              `City: ${marker.city} (Temperature: ${marker.value} °c)`,
          }}
          onDefocus={onDefocus}
        />

        {details && (
          <div
            style={{
              background: "white",
              position: "absolute",
              fontSize: 200,
              top: 0,
              right: 0,
              padding: 0,
            }}
          >
            <p>{details}</p>
            <p>
              EVENT: type={event.type}, position=
              {JSON.stringify(event.pointerEventPosition)})
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
