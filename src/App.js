import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import GitHubIcon from '@mui/icons-material/GitHub';

import { Box, Container, Grid, IconButton, Link, Typography } from '@mui/material';
import { useState } from 'react';

import { fetchWeatherData } from './api/OpenWeatherService';
import Logo from './assets/logo.png';
import ErrorBox from './components/Reusable/ErrorBox';
import LoadingBox from './components/Reusable/LoadingBox';
import UTCDatetime from './components/Reusable/UTCDatetime';
import Search from './components/Search/Search';
import TodayWeather from './components/TodayWeather/TodayWeather';
import WeeklyForecast from './components/WeeklyForecast/WeeklyForecast';

import {
  getTodayForecastWeather,
  getWeekForecastWeather,
} from './utilities/DataUtils';

import { ALL_DESCRIPTIONS } from './utilities/DateConstants';
import { transformDateFormat } from './utilities/DatetimeUtils';

function App() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  const searchChangeHandler = async (enteredData) => {
    const [latitude, longitude] = enteredData.value.split(' ');

    setIsLoading(true);
    setError(false);

    const currentDate = transformDateFormat();
    const date = new Date();
    let dt_now = Math.floor(date.getTime() / 1000);

    try {
      const [todayWeatherResponse, weekForecastResponse] =
        await fetchWeatherData(latitude, longitude);

      const all_today_forecasts_list = getTodayForecastWeather(
        weekForecastResponse,
        currentDate,
        dt_now
      );

      const all_week_forecasts_list = getWeekForecastWeather(
        weekForecastResponse,
        ALL_DESCRIPTIONS
      );

      setTodayForecast([...all_today_forecasts_list]);
      setTodayWeather({ city: enteredData.label, ...todayWeatherResponse });
      setWeekForecast({
        city: enteredData.label,
        list: all_week_forecasts_list,
      });
    } catch (error) {
      setError(true);
    }

    setIsLoading(false);
  };


  const lightModeApp = (
    <Container
      sx={{
        maxWidth: { xs: '95%', sm: '80%', md: '1100px' },
        width: '100%',
        height: '100%',
        margin: '0 auto',
        marginTop: '2rem',
        padding: '1rem 0 3rem',
        marginBottom: '1rem',
        borderRadius: { xs: 'none', sm: '0 0 1rem 1rem' },
        boxShadow: {
          xs: 'none',
          sm: 'rgba(0,0,0, 0.5) 0px 10px 15px -3px, rgba(0,0,0, 0.5) 0px 4px 6px -2px',
        },
      }}
    >
      <Grid container columnSpacing={2}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: '100%', marginBottom: '1rem' }}
          >
            <Box
              component="img"
              sx={{
                height: { xs: '16px', sm: '22px', md: '26px' },
                width: 'auto',
              }}
              alt="logo"
              src={Logo}
            />

            <UTCDatetime />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                sx={{ color: 'white' }}
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>

              <Link
                href="https://github.com/PavaniLanka22"
                target="_blank"
                underline="none"
                sx={{ display: 'flex' }}
              >
                <GitHubIcon
                  sx={{
                    fontSize: { xs: '20px', sm: '22px', md: '26px' },
                    color: 'white',
                    '&:hover': { color: '#2d95bd' },
                  }}
                />
              </Link>
            </Box>
          </Box>

          <Search onSearchChange={searchChangeHandler} />
        </Grid>

        {isLoading && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', marginTop: '3rem' }}>
              <LoadingBox value="1">
                <Typography>Loading...</Typography>
              </LoadingBox>
            </Box>
          </Grid>
        )}

        {error && (
          <Grid item xs={12}>
            <ErrorBox margin="3rem auto" errorMessage="Something went wrong" />
          </Grid>
        )}

        {!isLoading && !error && todayWeather && weekForecast && (
          <>
            <Grid item xs={12} md={6}>
              <TodayWeather
                data={todayWeather}
                forecastList={todayForecast}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <WeeklyForecast data={weekForecast} />
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );

  
  const darkModeWrapper = {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#000000', // full black screen
    paddingTop: '2rem', // top spacing ALSO dark
    transition: '0.3s ease',
  };

  const lightModeWrapper = {
    minHeight: '100vh',
    width: '100%',
    background:
      'linear-gradient(to right, #0f2027, #203a43, #2c5364)', // original feel preserved
    paddingTop: '2rem',
  };

  return (
    <Box sx={darkMode ? darkModeWrapper : lightModeWrapper}>
      {lightModeApp}
    </Box>
  );
}

export default App;