$(document).ready(function () {
    let alarms = [];
    let alarmCheckInterval;
    let alienTime = modelData.alienTime; // Initial alien time from modelData

    // Update Alien clock display like a digital clock
    startAlienClock(alienTime); // Start the clock with the initial alien time


    

    // Set the default date to January 1st, 2028
    const defaultYear = alienTime.year;
    const defaultMonth = alienTime.month - 1;
    const defaultDay = alienTime.day;
    const defaultHour = alienTime.hour + 1;
    const defaultMinute = alienTime.minute + 1;
    const defaultDate = new Date(defaultYear, defaultMonth, defaultDay, defaultHour, defaultMinute); // January 1st

    // Format the date to the required input format (YYYY-MM-DDTHH:MM)
    const formattedDate = defaultDate.toISOString().slice(0, 16);

    // Set the input's value
    document.getElementById('alienTimeSet').value = formattedDate;

});

function startAlienClock(initialAlienTime) {
    let alienTime = { ...initialAlienTime }; // Clone the initial alien time

    // Update the display every alien second (e.g., 1000ms here assumes 1 Earth second equals 1 Alien second)
    setInterval(function () {
        incrementAlienTime(alienTime); // Increment the alien time by one "alien second"
        updateAlienTimeDisplay(alienTime); // Update the displayed alien time
    }, 1000); // You can adjust the interval here based on how fast alien seconds should pass
}

function incrementAlienTime(alienTime) {
    // Increment the alien seconds
    alienTime.second += 1;

    // Handle rollover for seconds, minutes, hours, and days based on alien time format
    if (alienTime.second >= 90) {
        alienTime.second = 0;
        alienTime.minute += 1;
    }
    if (alienTime.minute >= 90) {
        alienTime.minute = 0;
        alienTime.hour += 1;
    }
    if (alienTime.hour >= 36) {
        alienTime.hour = 0;
        alienTime.day += 1;
    }

    // Handle months and years if days overflow (assuming 44 days per month, adjust as needed)
    const daysInMonths = [44, 42, 48, 40, 48, 44, 40, 44, 42, 40, 40, 42, 44, 48, 42, 40, 44, 38];
    if (alienTime.day > daysInMonths[alienTime.month - 1]) {
        alienTime.day = 1; // Reset the day to 1 when the month changes
        alienTime.month += 1;
    }
    if (alienTime.month > 18) {
        alienTime.month = 1; // Reset to the first month if the year changes
        alienTime.year += 1;
    }
}

function updateAlienTimeDisplay(alienTime) {
    $('#alien-time-display').html(
        `<span class="time-part">${alienTime.day} - ${alienTime.month} - ${alienTime.year}</span><br />
         <span class="time-part">${String(alienTime.hour).padStart(2, '0')} : ${String(alienTime.minute).padStart(2, '0')} : ${String(alienTime.second).padStart(2, '0')}</span>`
    );
}

