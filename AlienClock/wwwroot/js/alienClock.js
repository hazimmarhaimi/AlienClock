$(document).ready(function () {
    let alarmTime; 
    let alarms = []; // Initialize alarms as an empty array
    let alarmCheckInterval;
    let alienTime = modelData.alienTime; // Initial alien time from modelData

    // Update Alien clock display like a digital clock
    startAlienClock(alienTime); // Start the clock with the initial alien time

    const currentYear = new Date().getFullYear(); // Get the current year
    const yearsToShow = 1000; // Number of future years to show in the dropdown

    // Populate the year dropdown with years greater than the current year
    for (let i = 1; i <= yearsToShow; i++) {
        $('#alienYear').append(new Option(currentYear + i, currentYear + i));
    }

    // Define the number of days in each month as per the Alien calendar
    const alienMonths = [
        { month: 1, days: 44 },
        { month: 2, days: 42 },
        { month: 3, days: 48 },
        { month: 4, days: 40 },
        { month: 5, days: 48 },
        { month: 6, days: 44 },
        { month: 7, days: 40 },
        { month: 8, days: 44 },
        { month: 9, days: 42 },
        { month: 10, days: 40 },
        { month: 11, days: 40 },
        { month: 12, days: 42 },
        { month: 13, days: 44 },
        { month: 14, days: 48 },
        { month: 15, days: 42 },
        { month: 16, days: 40 },
        { month: 17, days: 44 },
        { month: 18, days: 38 }
    ];

    // Populate the #alienMonth dropdown with 18 months
    const monthDropdown = $('#alienMonth');
    alienMonths.forEach(function (month) {
        monthDropdown.append(new Option('Month ' + month.month, month.month));
    });

    // Update the #alienDay dropdown when a month is selected
    $('#alienMonth').change(function () {
        const selectedMonth = $(this).val();
        const daysInSelectedMonth = alienMonths.find(m => m.month == selectedMonth).days;

        // Clear the current days and add the new options for the selected month
        const dayDropdown = $('#alienDay');
        dayDropdown.empty(); // Clear current day options
        for (let i = 1; i <= daysInSelectedMonth; i++) {
            dayDropdown.append(new Option(i, i)); // Add day options dynamically
        }
    });

    // Trigger the day dropdown to update on page load based on the initially selected month (if any)
    $('#alienMonth').trigger('change');

    for (let i = 0; i <= 35; i++) {
        $('#alienHour').append(new Option(i, i));
    }

    // Populate Minute options
    for (let i = 0; i <= 89; i++) {
        $('#alienMinute').append(new Option(i, i));
    }

    // Populate Second options
    for (let i = 0; i <= 89; i++) {
        $('#alienSecond').append(new Option(i, i));
    }
    for (let i = 0; i <= 35; i++) {
        $('#hourInput').append(new Option(i, i));
    }

    // Populate the minute select options from 0 to 90
    for (let i = 0; i <= 90; i++) {
        $('#minuteInput').append(new Option(i, i));
    }

    // Set the default Alien time based on initial alienTime
    $('#alienYear').val(alienTime.year);
    $('#alienMonth').val(alienTime.month);
    $('#alienDay').val(alienTime.day);
    $('#alienHour').val(alienTime.hour);
    $('#alienMinute').val(alienTime.minute);
    $('#alienSecond').val(alienTime.second);

    // Handle form submission to set new Alien time
    $('#setAlienTime').on('submit', function (event) {
        event.preventDefault(); // Prevent form submission from reloading the page

        // Get the new Alien time values from the form inputs
        const newAlienYear = parseInt($('#alienYear').val());
        const newAlienMonth = parseInt($('#alienMonth').val());
        const newAlienDay = parseInt($('#alienDay').val());
        const newAlienHour = parseInt($('#alienHour').val());
        const newAlienMinute = parseInt($('#alienMinute').val());
        const newAlienSecond = parseInt($('#alienSecond').val());

        // Update the alienTime object with the new values
        alienTime = {
            year: newAlienYear,
            month: newAlienMonth,
            day: newAlienDay,
            hour: newAlienHour,
            minute: newAlienMinute,
            second: newAlienSecond
        };

        // Restart the Alien clock with the newly set time
        startAlienClock(alienTime); // Reset the clock with the new time
        updateEarthTimeDisplay(alienTime);
    });

    $('#alarmIcon').on('click', function () {
        // Define the SweetAlert content
        const content = `
        <form id="alarm-form" style="display: flex; flex-direction: column; align-items:center;">
            <div class="form-group">
                <label for="hourInput">Hour:</label>
                <select id="hourInput" class="form-control" required>
                    <option value="" disabled selected>Select hour</option>
                    ${Array.from({ length: 36 }, (_, i) => `<option value="${i}">${i}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="minuteInput">Minute:</label>
                <select id="minuteInput" class="form-control" required>
                    <option value="" disabled selected>Select minute</option>
                    ${Array.from({ length: 90 }, (_, i) => `<option value="${i}">${i}</option>`).join('')}
                </select>
            </div>
        </form>
    `;

        // Display SweetAlert with form content
        Swal.fire({
            title: 'Set Alarm',
            html: content,
            focusConfirm: false,
            width: '300px',
            customClass: {
                popup: 'small-swal',
                confirmButton: 'button-alien',
                cancelButton: 'button-alien' 
            },
            preConfirm: () => {
                const hour = $('#hourInput').val();
                const minute = $('#minuteInput').val();

                if (!hour || !minute) {
                    Swal.showValidationMessage('Please select both hour and minute');
                    return false;
                }

                // Store selected values in hidden inputs
                $('#alarms-hour').val(hour);
                $('#alarms-minute').val(minute);

                // Show a confirmation message
                Swal.fire({
                    icon: 'success',
                    title: 'Alarm Set!',
                    text: `Alarm has been set for ${hour} hours and ${minute} minutes.`,
                    customClass: {
                        popup: 'small-swal',
                        confirmButton: 'button-alien',
                    },
                });
            },
            showCancelButton: true,
            confirmButtonText: 'Set Alarm',
            cancelButtonText: 'Cancel',
        });
    });

    

    setInterval(checkAlarm, 1000); 

});

function startAlienClock(initialAlienTime) {
    let alienTime = { ...initialAlienTime }; // Clone the initial alien time

    // Clear any existing intervals to avoid multiple timers running at the same time
    clearInterval(window.alienClockInterval);

    // Update the display every 0.5 Earth seconds (for Alien seconds)
    window.alienClockInterval = setInterval(function () {
        incrementAlienTime(alienTime); // Increment the alien time by one "alien second"
        updateAlienTimeDisplay(alienTime); // Update the displayed alien time
        //updateEarthTimeDisplay(alienTime); // Update the displayed Earth time
    }, 500); // Alien seconds pass every 0.5 Earth seconds
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

    // Handle months and years if days overflow (according to alien months)
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
    // Update the display of Alien time
    $('#alien-time-display').html(
        `<span class="time-part">${alienTime.day} - ${alienTime.month} - ${alienTime.year}</span><br />
         <span class="time-part">${String(alienTime.hour).padStart(2, '0')} : ${String(alienTime.minute).padStart(2, '0')} : ${String(alienTime.second).padStart(2, '0')}</span>`
    );

    // Update hidden inputs with the current Alien time
    $('#current-alien-hour').val(alienTime.hour); // Update hidden hour input
    $('#current-alien-minute').val(alienTime.minute); // Update hidden minute input
}


function updateEarthTimeDisplay(alienTime) {
    // Create a FormData object to send alienTime data
    const formData = new FormData();
    formData.append('year', alienTime.year);
    formData.append('month', alienTime.month);
    formData.append('day', alienTime.day);
    formData.append('hour', alienTime.hour);
    formData.append('minute', alienTime.minute);
    formData.append('second', alienTime.second);

    // Make AJAX call to send alien time to the controller
    $.ajax({
        url: '/Time/ConvertAlienToEarth', // Replace with the correct path to your controller method
        type: 'POST',
        processData: false, // Don't process the data (required for FormData)
        contentType: false, // Prevent jQuery from overriding the content type
        data: formData, // Send the FormData object
        success: function (response)
        {
            console.log("testtest",response);
            // Assuming the response contains the converted Earth time in a JSON object
            //const earthTime = new Date(response.year, response.month - 1, response.day, response.hour, response.minute, response.second);

            const dateObject = new Date(response.earthTime);
            // Extract date components
            const year = dateObject.getFullYear(); // Get full year
            const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Month (0-11, so +1)
            const day = String(dateObject.getDate()).padStart(2, '0'); // Day (1-31)

            // Extract time components
            const hours = String(dateObject.getHours()).padStart(2, '0'); // Hours (0-23)
            const minutes = String(dateObject.getMinutes()).padStart(2, '0'); // Minutes (0-59)
            const seconds = String(dateObject.getSeconds()).padStart(2, '0'); // Seconds (0-59)

            // Create date and time strings
            const datePart = `${day} - ${month} - ${year}`; // "1930-07-22"
            const timePart = `${hours} : ${minutes} : ${seconds}`; // "19:54:16"
            // Update the Earth time display with the new time
            $('#earth-time-display').html(
                `<span class="time-part">${datePart}</span><br />
                 <span class="time-part">${timePart}</span>`
            );
        },
        error: function (xhr, status, error) {
            console.error('Error converting alien time to earth time:', error);
        }
    });
}
// Assuming you have the alienTime object available with the current Alien time
function checkAlarm() {
    // Get the current Alien time from hidden inputs
    const currentAlienHour = parseInt($('#current-alien-hour').val()); // Retrieve and parse the hour from hidden input
    const currentAlienMinute = parseInt($('#current-alien-minute').val()); // Retrieve and parse the minute from hidden input

    // Get the alarm values from the hidden inputs
    const alarmHour = parseInt($('#alarms-hour').val()); // Retrieve and parse the alarm hour
    const alarmMinute = parseInt($('#alarms-minute').val()); // Retrieve and parse the alarm minute

    // Check if current Alien time matches the alarm time
    if (currentAlienHour === alarmHour && currentAlienMinute === alarmMinute) {
        // Trigger SweetAlert
        Swal.fire({
            icon: 'info',
            title: 'Time is Reached!!',
            text: 'Your set Alien time has been reached!',
            customClass: {
                popup: 'small-swal',
                confirmButton: 'button-alien',
            },
        }).then(() => {
            // Clear the alarm inputs after the alert is closed
            $('#alarms-hour').val('');
            $('#alarms-minute').val('');
        });

        // Play alarm sound
        const alarmSound = document.getElementById('alarmSound');
        alarmSound.play();
    }
}




