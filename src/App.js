import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [cityName, setCityName] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isDayTime = () => {
    const hours = currentTime.getHours();
    return hours >= 6 && hours < 18;
  };

  const API_KEY = "d5c5f48857cdb113f32e5173c5195d50";

  const getWeather = () => {
    setIsLoading(true);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.cod === "404") {
          setError("City not found — please try again!");
          setWeather(null);
        } else {
          setWeather(response.data);
          setError("");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("City not found — please try again!");
        setWeather(null);
        setIsLoading(false);
      });
  };

  const getLocationWeather = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          axios
            .get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            )
            .then((response) => {
              console.log(response.data);
              setWeather(response.data);
              setError("");
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
              setError("Unable to fetch weather for your location!");
              setWeather(null);
              setIsLoading(false);
            });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError("Location access denied!");
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported!");
    }
  };

  const bgImageDay =
    "https://img.freepik.com/free-vector/gorgeous-clouds-background-with-blue-sky-design_1017-25501.jpg";
  const bgImageNight =
    "https://viewfindr.net/wp-content/uploads/2022/11/Dichter-nebel-ganz-einfach-mit-der-kamera-festgehalten.jpg";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "100vh",
        fontFamily: "'Arial', sans-serif",
        backgroundImage: `url('${isDayTime() ? bgImageDay : bgImageNight}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: "2rem",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            margin: "20px 0",
            padding: "15px 25px",
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "10px",
            border: "2px solid rgba(255,255,255,0.3)",
          }}
        >
          {currentTime.toLocaleTimeString()}
        </div>

        <h1
          style={{
            color: "white",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
            marginBottom: "30px",
            fontSize: "2.5rem",
          }}
        >
          Weather App
        </h1>

        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "500px",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <input
            style={{
              flex: 1,
              padding: "12px 15px",
              fontSize: "1rem",
              border: error ? "2px solid red" : "none",
              color: error ? "red" : "black",
              borderRadius: "4px",
              outline: "none",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
            type="text"
            value={error ? error : cityName}
            onChange={(e) => {
              setCityName(e.target.value);
              setError("");
            }}
            onFocus={() => {
              if (error) {
                setError(null);
                setCityName("");
              }
            }}
            placeholder="Enter City Name"
          />
          <button
            onClick={getWeather}
            style={{
              padding: "12px 20px",
              fontSize: "1rem",
              backgroundColor: "#FF8C00",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            Search
          </button>
          <button
            onClick={getLocationWeather}
            style={{
              padding: "12px 20px",
              fontSize: "1rem",
              backgroundColor: "#FF8C00",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            Use My Location
          </button>
        </div>

        {isLoading && (
          <p style={{ color: "white", fontSize: "1.2rem", marginTop: "20px" }}>
            Loading...
          </p>
        )}

        {weather && weather.main && !isLoading && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h2>{weather.name}</h2>
            <p>{weather.weather[0].description}</p>
            <p>Temperature: {weather.main.temp} °C</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind: {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>

      <div
        style={{
          width: "100%",
          padding: "15px 0",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          textAlign: "center",
          backdropFilter: "blur(5px)",
          position: "fixed",
          bottom: 0,
          left:0,
          right:0
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
            letterSpacing: "0.5px",
          }}
        >
          Developed with ❤️ by{" "}
          <span
            style={{
              color: "#FF8C00",
              textShadow: "0 0 5px rgba(255,140,0,0.5)",
           
            }}
          >
             Vaishnavi Garje
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;