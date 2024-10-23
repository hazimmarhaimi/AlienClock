$(document).ready(function () {
    let alarms = []; // Array to store alarm times
    let alarmCheckInterval; // Variable for checking alarms

    // Function to update the clocks by fetching the time from the backend every 0.5 seconds
    setInterval(updateClocks, 500);

    $('#setEarthTime').submit(function (e) {
        e.preventDefault();

        const earthTimeInput = $('input[name="EarthTime"]').val();
        const parsedDate = new Date(earthTimeInput);

        // Validate Earth time input format
        if (isNaN(parsedDate.getTime())) {
            console.error('Invalid Earth time input');
            return;
        }

        // Send the new Earth time to the backend
        $.ajax({
            url: '/Time/SetEarthTime',
            type: 'POST',
            data: { earthTime: parsedDate.toISOString() }, // Ensure ISO string format for the DateTime
            success: function (response) {
                // Update alien time display
                $('#alien-time-display').html(
                    `<span class="time-part">${response.alienTime.day} - ${response.alienTime.month} - ${response.alienTime.year}</span><br />
                    <span class="time-part">${response.alienTime.hour} : ${String(response.alienTime.minute).padStart(2, '0')} : ${String(response.alienTime.second).padStart(2, '0')}</span>`
                );

                // Store the new Earth time in sessionStorage
                const newEarthTime = {
                    day: response.earthTime.day,
                    month: response.earthTime.month,
                    year: response.earthTime.year,
                    hour: response.earthTime.hour,
                    minute: response.earthTime.minute,
                    second: response.earthTime.second
                };

                // Store the new Earth time in the hidden input
                $('#newEarthTime').val(JSON.stringify(newEarthTime));

                console.log('Earth time successfully set and Alien time updated.');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error setting Earth time:', textStatus, errorThrown);
                console.error('Response:', jqXHR.responseText);
                alert('Failed to set Earth time. Please try again.'); // User feedback
            }
        });
    });

    $('#alarm-form').submit(function (e) {
        e.preventDefault();
        const alarmTimeInput = $('#alarmTime').val();

        // Validate alarm input
        if (!alarmTimeInput) {
            console.error('Invalid alarm time input');
            return;
        }

        // Clear the alarms array before adding the new alarm
        alarms.length = 0; // Clear the array

        // Add the new alarm to the alarms array
        alarms.push(alarmTimeInput);

        // Store alarms in hidden input
        $('#alarms').val(JSON.stringify(alarms));

        // Clear any previous alarm check interval
        clearInterval(alarmCheckInterval);

        // Start checking alarms every second
        alarmCheckInterval = setInterval(checkAlarms, 1000); // Check every second
        // Display SweetAlert2 notification
        Swal.fire({
            title: 'Alarm Set!',
            text: 'Alarm was set for ' + alarmTimeInput,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    });
    function checkAlarms() {
        $.get('/Time/GetCurrentEarthTime', function (earthTime) {
            const currentTime = `${String(earthTime.hour).padStart(2, '0')}:${String(earthTime.minute).padStart(2, '0')}`;

            // Check if current time matches any alarm time
            if (alarms.includes(currentTime)) {
                // Play the alarm sound
                const alarmSound = document.getElementById('alarm-sound');
                alarmSound.play(); // Play the sound

                Swal.fire({
                    title: 'Alarm!',
                    text: 'The time is now ' + currentTime,
                    icon: 'info',
                    confirmButtonText: 'OK'
                });

                clearInterval(alarmCheckInterval); // Stop checking once alarm goes off
            }
        }).fail(function () {
            console.error('Error fetching Earth time for alarm check.');
        });
    }


});

function updateClocks() {
    updateEarthClock(); // Update Earth clock
    generateAlienClockFromStoredTime(); // Update Alien clock based on stored Earth time
}

function updateEarthClock() {
    $.get('/Time/GetCurrentEarthTime', function (earthTime) {
        const earthTimeString = JSON.stringify(earthTime);
        sessionStorage.setItem('EarthTime', earthTimeString); // Use sessionStorage here

        $('#earth-time-display').html(
            `<span class="time-part">${earthTime.day} - ${earthTime.month} - ${earthTime.year}</span><br />
             <span class="time-part">${earthTime.hour} : ${String(earthTime.minute).padStart(2, '0')} : ${String(earthTime.second).padStart(2, '0')}</span>`
        );
    }).fail(function () {
        console.error('Error fetching Earth time.');
    });
}

function generateAlienClockFromStoredTime() {
    const earthTimeString = $('#newEarthTime').val(); // Get Earth time from hidden input

    if (earthTimeString) {
        const earthTime = JSON.parse(earthTimeString); // Parse the JSON string from the hidden input
        updateAlienTimeDisplay(earthTime); // Update alien time display
    } else {
        // If no time in hidden input, fetch current Earth time
        $.get('/Time/GetCurrentEarthTime', function (earthTime) {
            updateAlienTimeDisplay(earthTime); // Update alien time display with fetched time
        }).fail(function () {
            console.error('Error fetching current Earth time.');
        });
    }
}
function updateAlienTimeDisplay(earthTime) {
    const alienTime = calculateAlienTime(earthTime); // Calculate the alien time based on the Earth time

    $('#alien-time-display').html(
        `<span class="time-part">${alienTime.day} - ${alienTime.month} - ${alienTime.year}</span><br />
         <span class="time-part">${alienTime.hour} : ${String(alienTime.minute).padStart(2, '0')} : ${String(alienTime.second).padStart(2, '0')}</span>`
    );
}

function calculateAlienTime(earthTime) {
    // Reference: Earth time at 1970-01-01, 12:00:00 AM
    const referenceEarthDate = new Date(1970, 0, 1, 0, 0, 0);
    const referenceAlienTime = {
        year: 2804,
        month: 18,
        day: 31,
        hour: 2,
        minute: 2,
        second: 88
    };

    // Calculate the difference in seconds between the given Earth time and the reference time
    const currentEarthDate = new Date(earthTime.year, earthTime.month - 1, earthTime.day, earthTime.hour, earthTime.minute, earthTime.second);
    const timeDifferenceInSeconds = (currentEarthDate - referenceEarthDate) / 1000; // Difference in seconds

    // Convert time difference from Earth seconds to Alien seconds
    const alienTimeDifferenceInSeconds = timeDifferenceInSeconds * 2; // 1 Earth second = 2 Alien seconds

    // Calculate total Alien time from the reference
    let totalAlienSeconds = referenceAlienTime.second + alienTimeDifferenceInSeconds;

    // Convert Alien seconds to Alien time
    let alienSecond = totalAlienSeconds % 90; // 90 seconds in a minute
    let totalMinutes = Math.floor(totalAlienSeconds / 90);
    let alienMinute = totalMinutes % 90; // 90 minutes in an hour
    let totalHours = Math.floor(totalMinutes / 90);
    let alienHour = totalHours % 36; // 36 hours in a day
    let totalDays = Math.floor(totalHours / 36);

    // Calculate Alien days and wrap around months
    let alienDay = (referenceAlienTime.day + totalDays - 1) % 44 + 1; // Days wrap-around calculation
    let alienMonth = referenceAlienTime.month + Math.floor((referenceAlienTime.day + totalDays - 1) / 44); // Month calculation
    let alienYear = referenceAlienTime.year;

    // Adjust month and year based on days and months
    while (alienMonth > 18) {
        alienMonth -= 18; // Wrap around to the first month
        alienYear += 1;   // Increment the year
    }

    // Adjust the day based on the number of days in the calculated month
    const daysInMonths = [44, 42, 48, 40, 48, 44, 40, 44, 42, 40, 40, 42, 44, 48, 42, 40, 44, 38];
    if (alienDay > daysInMonths[alienMonth - 1]) {
        alienDay = 1; // Reset day to 1 if it exceeds the max days of the month
    }

    return {
        year: alienYear,
        month: alienMonth,
        day: alienDay,
        hour: alienHour,
        minute: alienMinute,
        second: alienSecond
    };
}
