using AlienClock.Models;

namespace AlienClock.Services
{
    public class TimeService
    {
        public static int alienUnixSecond = 88;
        public static int alienUnixMinute = 2;
        public static int alienUnixHour = 2;
        public static int alienUnixDay = 31;
        public static int alienUnixMonth = 18;
        public static int alienUnixYear = 2804;

        public static int alienSecondsToMinute = 90;
        public static int alienMinutesToHour = 90;
        public static int alienHoursToDay = 36;
        public static int alienDaysToMonth = 770;
        public static int alienMonthsToYear = 18;

        public AlienTimeViewModel ConvertEarthToAlien()
        {
            long alienSecondNow = GetAlienSecondsNow();

            return GetAlienTimeNow(alienSecondNow);
        }
        public DateTime GetEarthTimeBasedOnAlienTime(AlienTimeViewModel alienTime)
        {
            // Constants for conversion
            const int alienSecondsToMinute = 90;
            const int alienMinutesToHour = 36;
            const int alienHoursToDay = 36;

            // Start with the alien Unix epoch values as a base for calculations
            int totalDays = 0;

            // Calculate days for the difference in years
            for (int year = alienUnixYear; year < alienTime.Year; year++)
            {
                for (int month = 1; month <= alienMonthsToYear; month++)
                {
                    totalDays += GetDaysInMonth(month);
                }
            }

            // Add days for the difference in months
            for (int month = 1; month < alienTime.Month; month++)
            {
                totalDays += GetDaysInMonth(month);
            }

            // Add the days in the current month
            totalDays += alienTime.Day - alienUnixDay;

            // Calculate the total Alien seconds from days, hours, minutes, and seconds
            long totalAlienSeconds = totalDays * alienHoursToDay * alienMinutesToHour * alienSecondsToMinute;
            totalAlienSeconds += alienTime.Hour * alienMinutesToHour * alienSecondsToMinute;
            totalAlienSeconds += alienTime.Minute * alienSecondsToMinute;
            totalAlienSeconds += alienTime.Second;

            // Convert Alien seconds to Earth seconds (assuming 1 Alien second = 0.5 Earth seconds)
            long earthSeconds = totalAlienSeconds / 2;

            // Calculate the Earth DateTime based on Unix epoch
            DateTime earthDateTime = DateTimeOffset.FromUnixTimeSeconds(earthSeconds).UtcDateTime;

            return earthDateTime;
        }
        public long GetAlienSecondsNow()
        {
            long secondsNow = ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeSeconds();
            long alienSecondsNow = secondsNow * 2;

            return alienSecondsNow;
        }
        public AlienTimeViewModel GetAlienTimeNow(long alienSecondsNow)
        {
            var minutesRemainder = (long)(alienSecondsNow / alienSecondsToMinute);
            var secondsRemainder = alienSecondsNow - (minutesRemainder * alienSecondsToMinute);

            var seconds = secondsRemainder + alienUnixSecond;
            if (seconds > alienSecondsToMinute)
            {
                seconds -= alienSecondsToMinute;
                minutesRemainder++;
            }

            var hoursRemainder = (long)(minutesRemainder / alienMinutesToHour);
            minutesRemainder = minutesRemainder - (hoursRemainder * alienMinutesToHour);
            if (minutesRemainder > alienMinutesToHour)
            {
                minutesRemainder -= alienMinutesToHour;
                hoursRemainder++;
            }

            var daysRemainder = (long)(hoursRemainder / alienHoursToDay);
            hoursRemainder = hoursRemainder - (daysRemainder * alienHoursToDay);

            var currentMonth = alienUnixMonth;
            var currentYear = alienUnixYear;
            var months = 0;

            while (true)
            {
                var currentDaysToMonth = GetDaysInMonth(currentMonth);

                if (daysRemainder > currentDaysToMonth)
                {
                    daysRemainder -= currentDaysToMonth;
                    months++;
                    currentMonth++;
                } else break;

                if (currentMonth > 18) {
                    currentMonth = 1;
                    currentYear++;
                }
            }

            var alienTimeViewModel = new AlienTimeViewModel
            {
                Year = currentYear,
                Month = currentMonth,
                Day = (int)daysRemainder,          // Convert to int
                Hour = (int)hoursRemainder,        // Convert to int
                Minute = (int)minutesRemainder,    // Convert to int
                Second = (int)seconds               // Convert to int
            };


            return alienTimeViewModel;
        }
        public int GetDaysInMonth(int month)
        {
            switch (month)
            {
                case 1: return 44;
                case 2: return 42;
                case 3: return 48;
                case 4: return 40;
                case 5: return 48;
                case 6: return 44;
                case 7: return 40;
                case 8: return 44;
                case 9: return 42;
                case 10: return 40;
                case 11: return 40;
                case 12: return 42;
                case 13: return 44;
                case 14: return 48;
                case 15: return 42;
                case 16: return 40;
                case 17: return 44;
                case 18: return 38;
                default: throw new NotImplementedException();
            }
        }

    }
}
