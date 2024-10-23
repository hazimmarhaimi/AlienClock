$(document).ready(function () {
    // Function to update the Alien clock by fetching the time from the backend every 0.5 seconds
    

    // Set interval to update the Alien time every 0.5 seconds
    setInterval(updateAlienClock, 500);

    // Handle the alarm form submission
    $('#alarm-form').submit(function (e) {
        e.preventDefault();
        const alarmTimeInput = $('#alarmTime').val();

        // Check the alarm every second
        const alarmCheckInterval = setInterval(function () {
            // Fetch current Alien time to compare with the alarm
            $.get('/Time/GetCurrentAlienTime', function (alienTime) {
                // Convert Alien time to Earth's time format (HH:MM:SS)
                const currentTime = `${String(alienTime.hour).padStart(2, '0')}:${String(alienTime.minute).padStart(2, '0')}:${String(alienTime.second).padStart(2, '0')}`;

                if (currentTime === alarmTimeInput) {
                    $('#alarm-message').show();
                    clearInterval(alarmCheckInterval); // Stop checking once alarm goes off
                }
            }).fail(function () {
                console.error('Error fetching Alien time for alarm check.');
            });
        }, 1000); // Check every second
    });
});

function updateAlienClock() {
    $.get('/Time/GetCurrentAlienTime', function (alienTime) {
        $('#alien-time-display').html(
            `Year: ${alienTime.year}, Month: ${alienTime.month}, Day: ${alienTime.day} <br /> 
                     ${alienTime.hour}:${String(alienTime.minute).padStart(2, '0')}:${String(alienTime.second).padStart(2, '0')}`
        );

        // Update the input fields with the new Alien time
        //$('#yearInput').val(alienTime.year);
        //$('#monthInput').val(alienTime.month);
        //$('#dayInput').val(alienTime.day);
        //$('#hourInput').val(alienTime.hour);
        //$('#minuteInput').val(alienTime.minute);
        //$('#secondInput').val(alienTime.second);
    }).fail(function () {
        console.error('Error fetching Alien time.');
    });
}