import React from 'react';
import PropTypes from 'prop-types';

import DefaultInput from '../UI/DefaultInput/DefaultInput';

const placeInput = props => (
	<DefaultInput
		placeholder="Place Name"
		value={props.placeData.value}
		valid={props.placeData.valid}
		touched={props.placeData.touched}
		onChangeText={props.onChangeText}
	/>
);

placeInput.propTypes = {
	placeData: PropTypes.shape({
		value: PropTypes.string.isRequired,
		valid: PropTypes.bool.isRequired,
		touched: PropTypes.bool.isRequired,
	}).isRequired,
	onChangeText: PropTypes.func.isRequired,
};

export default placeInput;
