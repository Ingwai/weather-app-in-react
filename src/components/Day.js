import React from 'react';
import { getWeatherIcon, formatDay } from '../App';

export const Day = props => {
	const { date, max, min, code, isToday } = props;
	return (
		<li className='day'>
			<span>{getWeatherIcon(code)}</span>
			<p>{isToday ? 'Today' : formatDay(date)}</p>
			<p>
				{Math.floor(min)}&deg; &mdash; <b>{Math.ceil(max)}&deg;</b>
			</p>
		</li>
	);
};
