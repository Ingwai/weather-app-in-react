import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Input } from './components/Input';
import { Weather } from './components/Weather';

export function getWeatherIcon(wmoCode) {
	const icons = new Map([
		[[0], '☀️'],
		[[1], '🌤'],
		[[2], '⛅️'],
		[[3], '☁️'],
		[[45, 48], '🌫'],
		[[51, 56, 61, 66, 80], '🌦'],
		[[53, 55, 63, 65, 57, 67, 81, 82], '🌧'],
		[[71, 73, 75, 77, 85, 86], '🌨'],
		[[95], '🌩'],
		[[96, 99], '⛈'],
	]);
	const arr = [...icons.keys()].find(key => key.includes(wmoCode));
	if (!arr) return 'NOT FOUND';
	return icons.get(arr);
}

function convertToFlag(countryCode) {
	const codePoints = countryCode
		.toUpperCase()
		.split('')
		.map(char => 127397 + char.charCodeAt());
	return String.fromCodePoint(...codePoints);
}

export function formatDay(dateStr) {
	return new Intl.DateTimeFormat('en', {
		weekday: 'short',
	}).format(new Date(dateStr));
}

const App = () => {
	// const [location, setLocation] = useState('Kielce');
	const [isLoading, setIsLoading] = useState(false);
	const [displayLocation, setDisplayLocation] = useState('');
	const [weather, setWeather] = useState({});

	const [location, setLocation] = useLocalStorage('kielce', 'location');

	const setLocationHandler = e => {
		setLocation(e.target.value);
	};

	// useEffect(() => {
	// 	setLocation(localStorage.setItem('location', location));
	// }, [location]);

	// useEffect(() => {
	// 	const localStorageLocation = () => {
	// 		setLocation(localStorage.getItem('location', location || ''));
	// 	};
	// 	localStorageLocation();
	// }, [location]);

	useEffect(() => {
		const controller = new AbortController();
		const fetchWeather = async () => {
			try {
				setIsLoading(true);
				// 1) Getting location (geocoding)
				const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}`, {
					signal: controller.signal,
				});
				const geoData = await geoRes.json();
				if (!geoData.results) throw new Error('Location not found');

				const { latitude, longitude, timezone, name, country_code } = geoData.results.at(0);
				setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

				// 2) Getting actual weather
				const weatherRes = await fetch(
					`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
				);
				const weatherData = await weatherRes.json();

				setWeather(weatherData?.daily);
			} catch (err) {
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};
		fetchWeather();
		return () => controller.abort();
	}, [location]);

	return (
		<div className='app'>
			<h1>Classy Weather</h1>
			<Input location={location} onSetLocation={setLocationHandler} />

			{isLoading && <p className='loader'>LOADING...</p>}
			{weather?.weathercode && <Weather weather={weather} displayLocation={displayLocation} />}
		</div>
	);
};

export default App;
