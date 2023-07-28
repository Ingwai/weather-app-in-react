import React from 'react';

export const Input = ({ location, onSetLocation }) => {
	return <input type='text' placeholder='Search for location...' value={location} onChange={onSetLocation} />;
};
