/* global document */

'use strict';

const allNodeList = document.querySelectorAll('*');
const allElements = Array.prototype.slice.call(allNodeList, 0);

const prefixElements = document.querySelectorAll('.prefix');
const suffixElements = document.querySelectorAll('.suffix');
const suffixRuElements = document.querySelectorAll('.suffixru');

function el(selector) {
	return document.querySelector(selector);
}

function setClockElOn(selector) {
	el(selector).classList.add('on');
}

function setPrefixElOn(number) {
	if (parseInt(number, 10) === 10) { 
		prefixElements[number].classList.add('on');
	} else if (parseInt(number, 10) === 11) {
		prefixElements[number - 2].classList.add('on');
	} else {
		prefixElements[number - 1].classList.add('on');
	}
}

function setSuffixElOn(number) {
	if (parseInt(number, 10) === 13) {
		number = 1;
	}
	suffixElements[number - 1].classList.add('on');
}

function setSuffixRuElOn(number) {
	if (parseInt(number, 10) === 13) {
		number = 1;
	}

	if (parseInt(number, 10) === 10) {
		suffixRuElements[number].classList.add('on');
	} else if (parseInt(number, 10) === 11) {
		suffixRuElements[number - 2].classList.add('on');
	} else {
		suffixRuElements[number - 1].classList.add('on');
	}
}

function setMinutes(minutes) {
	minutes = minutes.toString().split('');

	switch (parseInt(minutes[0], 10)) { // eslint-disable-line default-case
		case 2:
			setClockElOn('.twenty-minutes');
			break;
		case 3:
			setClockElOn('.thirty-minutes');
			break;
		case 4:
			setClockElOn('.forty-minutes');
			break;
		case 5:
			setClockElOn('.fifty-minutes');
			break;
	}

	if (minutes % 10 !== 0) {
		setSuffixElOn(parseInt(minutes[1], 10));
	}
}

function clearClock() {
	allElements.forEach(element => {
		element.classList.remove('on');
	});
}

/** Main / Update Clock
----------------------------------------------------------------------------- */
function updateClock() {
	const date = new Date();
	let hour = date.getHours();
	const minutes = date.getMinutes();

	// Convert 24 hour time to 12 hour
	if (hour >= 13) {
		hour -= 12;
	}
	if (parseInt(hour, 10) === 0) {
		hour = 12;
	}

	// 'Turn off' all clock elements
	clearClock();

	// One minute past [hour]
	if (parseInt(minutes, 10) === 1) {
		//eng setClockElOn('.one');
		setClockElOn('.minute');
		setClockElOn('.past');
		setSuffixRuElOn(hour);
		return;
	}

	if (minutes === 2) {
		setClockElOn('.prefixru');
		setClockElOn('.minutesru');
		setClockElOn('.past');
		setSuffixRuElOn(hour);
		return;
	}
	// [minutes] past [hour]
	if (minutes >= 3 && minutes <= 12) {
		setPrefixElOn(minutes);
		if (minutes >= 3 && minutes <= 4) {
			setClockElOn('.minutesru');
		}
		else {
			setClockElOn('.minutes');
		}
		setClockElOn('.past');
		setSuffixRuElOn(hour);
		return;
	}

	switch (minutes) { // eslint-disable-line default-case
		// [hour] o'clock
		case 0:
			setPrefixElOn(hour);
			setClockElOn('.oclock');
			return;
		// [hour] [minutes]
		case 13:
			setPrefixElOn(hour);
			setClockElOn('.thirteen');
			return;
		case 14:
			setPrefixElOn(hour);
			setClockElOn('.fourteen');
			return;
		case 16:
			setPrefixElOn(hour);
			setClockElOn('.sixteen');
			return;
		case 17:
			setPrefixElOn(hour);
			setClockElOn('.seventeen');
			return;
		case 18:
			setPrefixElOn(hour);
			setClockElOn('.eighteen');
			return;
		case 19:
			setPrefixElOn(hour);
			setClockElOn('.nineteen');
			return;
		// Quarter past [hour]
		case 15:
			setClockElOn('.quarter');
			setClockElOn('.past');
			setSuffixRuElOn(hour);
			return;
		// Twenty past [hour]
		case 20:
			setClockElOn('.twenty');
			setClockElOn('.past');
			setSuffixRuElOn(hour);
			return;
		// Half past [hour]
		case 30:
			setClockElOn('.half');
			setClockElOn('.past');
			setSuffixRuElOn(hour);
			return;
		// Half to [next hour]
		case 40:
			setClockElOn('.twenty');
			setClockElOn('.to');
			setSuffixRuElOn(hour + 1);
			return;
		// Quarter to [next hour]
		case 45:
			setClockElOn('.quarter');
			setClockElOn('.to');
			setSuffixRuElOn(hour + 1);
			return;
		// Ten to [next hour]
		case 50:
			setClockElOn('.ten');
			setClockElOn('.to');
			setSuffixRuElOn(hour + 1);
			return;
		// Five to [next hour]
		case 55:
			setClockElOn('.five');
			setClockElOn('.to');
			setSuffixRuElOn(hour + 1);
			return;
	}

	// [hour] [minutes]
	setPrefixElOn(hour);
	setMinutes(minutes);
}

/** Tick / init
----------------------------------------------------------------------------- */
setInterval(updateClock, 1000);
updateClock();
