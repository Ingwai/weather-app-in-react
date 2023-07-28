import React from 'react';
import { Day } from './Day';

export const Weather = ({ weather, displayLocation }) => {
	const { temperature_2m_max: max, temperature_2m_min: min, time: dates, weathercode: codes } = weather;

	return (
		<div>
			<h2>Weather {displayLocation}</h2>
			<ul className='weather'>
				{dates.map((date, i) => (
					<Day date={date} max={max[i]} min={min.at(i)} code={codes.at(i)} key={date} isToday={i === 0} />
				))}
			</ul>
		</div>
	);
};
