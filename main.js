import './main.css';

const dateSec = document.getElementById('date-s');
const timeSec = document.getElementById('time-s');
const fullSec = document.getElementById('full-s');
const ping = document.getElementById('ping');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
let fHate = 0;
let soundOn = 1;

// add 0 to numbers below ten: 9 -> 09, 12 -> 12, assumes all numbers are positive
const zeroPen = (num) => num < 10? `0${num.toString()}`: num.toString();

/*
* Extract date as: DD/MM/YYYY
* Extract time as: HH:MM
* Long form date as: Sunday, May 8 2022
* returns an object {'fullDate': 'DD/MM/YYYY', 'longFormDate': 'DAY, MONTH DD YYYY', 'fullTime': 'HH:MM'}
* */
function timeExtract () {
    // date
    const date = new Date();
    const day = days[date.getDay()];
    const month = months[date.getMonth()];

    // time
    const hours = date.getHours();
    const fHateMark = fHate ? hours > 11 ? ' PM' : ' AM' : '';

    return {
        'fullDate': `${zeroPen(date.getDate())}/${zeroPen(date.getMonth() + 1)}/${date.getFullYear()}`,
        'longFormDate': `${day}, ${month} ${date.getDate()} ${date.getFullYear()}`,
        'fullTime': `${zeroPen(hours - fHate)}:${zeroPen(date.getMinutes())}${fHateMark}`
    }
}

function updateValueOnTitle (timeS, dateS = null) {
    let intervalX = 0;

    // play sound at the top of an hour
    timeS.search(/:00/g) > 0 && ping && soundOn? ping.play(): void 0;
    // ping && soundOn? ping.play(): void 0;

    if (dateS) {
        document.title = dateS;
        intervalX = 10000;
    }

    setTimeout(() => document.title = timeS, intervalX);
}

function updateValueOnScreen () {
    const tvalue = timeExtract();
    // is this the start of the day? Midnight?
    const tod = tvalue.fullTime.search(/^00:00$|^12:00 PM$/g);

    dateSec.innerText = tvalue.fullDate;
    timeSec.innerText = tvalue.fullTime;
    fullSec.innerText = tvalue.longFormDate;

    updateValueOnTitle(tvalue.fullTime, tod > 0? tvalue.longFormDate: null);
    // updateValueOnTitle(tvalue.fullTime, tvalue.longFormDate);
}

updateValueOnScreen();
setInterval(updateValueOnScreen, 1000 * 60);

