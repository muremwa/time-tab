import './main.css';

const dateSec = document.getElementById('date-s');
const timeSec = document.getElementById('time-s');
const fullSec = document.getElementById('full-s');
const ping = document.getElementById('ping');
const optionsForm = document.forms['options-form'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
let fHate = 0;
let soundOn = 1;

// reset form
if (optionsForm) optionsForm.reset();

// retrieve cookies
const cookie = document.cookie.toString();
const system = cookie.match(/sys=(?<system>\d{2})/);
const sound = cookie.match(/sound=(?<sound>[0-1])/);

// listen for ping warning
const alarmOptionDiv = document.getElementById('alarm');

// last saved options for ping
if (sound) {
    alarmOptionDiv.value = sound.groups.sound;
    soundOn = parseInt(sound.groups.sound);
}

if (alarmOptionDiv) {
    alarmOptionDiv.addEventListener('change', () => {
        const svalue = parseInt(alarmOptionDiv.value);
        soundOn = svalue;
        document.cookie = `sound=${svalue}; SameSite=None; Secure`;
    });
}


// change hour system
const hrSysDiv = document.getElementById('hour-system');
// last saved system
if (system) {
    hrSysDiv.value = system.groups.system;
    fHate = system.groups.system;
}

if (hrSysDiv) {
    hrSysDiv.addEventListener('change', () => {
        const hvalue = parseInt(hrSysDiv.value);
        fHate = hvalue;
        document.cookie = `sys=${hvalue}; SameSite=None; Secure`;
        updateValueOnScreen()
    });
}


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
    const date = new Date('2012-12-06 00:00:00');
    const day = days[date.getDay()];
    const month = months[date.getMonth()];

    // time
    let hours = date.getHours();
    const fHateMark = fHate ? hours > 11 ? ' PM' : ' AM' : '';
    const tempfhate = hours > 0 && hours < 13? 0: fHate;
    hours = hours === 0 && fHate? 24: hours;

    return {
        'fullDate': `${zeroPen(date.getDate())}/${zeroPen(date.getMonth() + 1)}/${date.getFullYear()}`,
        'longFormDate': `${day}, ${month} ${date.getDate()} ${date.getFullYear()}`,
        'fullTime': `${zeroPen(hours - tempfhate)}:${zeroPen(date.getMinutes())}${fHateMark}`
    }
}

function updateValueOnTitle (timeS, dateX, dateS = null) {
    let intervalX = 0;

    // play sound at the top of an hour
    timeS.search(/:00/g) > -1 && ping && soundOn? ping.play(): void 0;

    if (dateS) {
        document.title = dateS;
        intervalX = 10000;
    }

    setTimeout(() => document.title = `${timeS} - ${dateX}`, intervalX);
}

function updateValueOnScreen () {
    const tvalue = timeExtract();
    // is this the start of the day? Midnight?
    const tod = tvalue.fullTime.search(/^00:00$|^12:00 AM$/g);

    dateSec.innerText = tvalue.fullDate;
    timeSec.innerText = tvalue.fullTime;
    fullSec.innerText = tvalue.longFormDate;

    updateValueOnTitle(tvalue.fullTime, tvalue.fullDate,tod > -1? tvalue.longFormDate: null);
}

updateValueOnScreen();
setInterval(updateValueOnScreen, 1000 * 15);