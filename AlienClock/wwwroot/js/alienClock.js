$(document).ready(function () {
    let alarms = [];
    let alarmCheckInterval;
    let alienTime = modelData.alienTime; // Initial alien time from modelData

    // Update Alien clock display like a digital clock
    startAlienClock(alienTime); // Start the clock with the initial alien time

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
    $('#alien-time-display').html(
        `<span class="time-part">${alienTime.day} - ${alienTime.month} - ${alienTime.year}</span><br />
         <span class="time-part">${String(alienTime.hour).padStart(2, '0')} : ${String(alienTime.minute).padStart(2, '0')} : ${String(alienTime.second).padStart(2, '0')}</span>`
    );
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


