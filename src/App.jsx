import React, { useState } from "react";
import { Card, CardContent } from "@mui/material"; // Using Material UI cards
import TextField from "@mui/material/TextField"; // Using Material UI text field
import Button from "@mui/material/Button"; // Using Material UI button
import Grid from "@mui/material/Grid"; // Using Material UI grid
import Typography from "@mui/material/Typography"; // Using Material UI typography
import CircularProgress from "@mui/material/CircularProgress"; // Using Material UI loading indicator

const apiKey = "fb908565af4964151fc930b967e3b18f";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [nearbyWeather, setNearbyWeather] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkWeather = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError(
            "City not found. Please check the spelling or try a different city."
          );
        } else {
          setError("An error occurred while fetching weather data.");
        }
        setWeatherData(null);
        setNearbyWeather([]);
      } else {
        const data = await response.json();
        setWeatherData(data);
        fetchNearbyWeather(data.coord.lat, data.coord.lon);
        setCity("");
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError(
        "Failed to fetch weather data. Please check your network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyWeather = async (lat, lon) => {
    const nearbyUrl = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&units=metric&appid=${apiKey}`;
    try {
      const response = await fetch(nearbyUrl);
      const data = await response.json();
      setNearbyWeather(data.list);
    } catch (err) {
      console.error("Error fetching nearby weather:", err);
    }
  };

  return (
    <>
      <div className="w-full mt-6 mb-6 lg:items-center ">
        <div className="justify-center items-center">
          <div className="mx-auto max-w-md overflow-hidden rounded-xl shadow-md md:max-w-2xl flex justify-items-center p-4 gap-6">
            <TextField
              label="Enter city..."
              variant="outlined"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => checkWeather(city)}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Search"}
            </Button>
          </div>
        </div>
        {error && (
          <Typography variant="body2" color="error" className="mt-16">
            {error}
          </Typography>
        )}

        {weatherData && (
          <Card className="mt-10">
            <CardContent>
              <Typography variant="h5" className="text-blue-500" component="h2">
                {weatherData.name}
              </Typography>
              <Typography variant="body1">
                {Math.round(weatherData.main.temp)}&deg;C
              </Typography>
              <Typography variant="body1">
                Humidity: {weatherData.main.humidity}%
              </Typography>
              <Typography variant="body1">
                Wind: {weatherData.wind.speed} km/h
              </Typography>
            </CardContent>
          </Card>
        )}

        {nearbyWeather.length > 0 && (
          <div className="mt-6">
            <Typography variant="h6" component="h3">
              Nearest Areas:
            </Typography>
            <Grid container spacing={2} className="mt-2">
              {nearbyWeather.map((area) => (
                <Grid item xs={12} sm={6} md={4} key={area.id}>
                  <Card>
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        className="text-green-200 font-medium"
                        component="h4"
                      >
                        {area.name}
                      </Typography>
                      <Typography variant="body1">
                        {Math.round(area.main.temp)}&deg;C
                      </Typography>
                      <Typography variant="body1">
                        Humidity: {area.main.humidity}%
                      </Typography>
                      <Typography variant="body1">
                        Wind: {area.wind.speed} km/h
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        )}
        {nearbyWeather.length === 0 && weatherData && (
          <Typography variant="body2" className="mt-6">
            No nearby weather information available.
          </Typography>
        )}
      </div>
    </>
  );
};

export default WeatherApp;
