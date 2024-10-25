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

        private static readonly DateTime EarthBaseTime = new DateTime(1970, 1, 1, 0, 0, 0);
        private static readonly AlienTimeViewModel AlienBaseTime = new AlienTimeViewModel { Year = 2804, Month = 18, Day = 31, Hour = 2, Minute = 2, Second = 88 };

        private static readonly int[] DaysInMonth = { 44, 42, 48, 40, 48, 44, 40, 44, 42, 40, 40, 42, 44, 48, 42, 40, 44, 38 };

        public AlienTimeViewModel ConvertEarthToAlien()
        {
            long alienSecondNow = GetAlienSecondsNow();

            return GetAlienTimeNow(alienSecondNow);
        }

        public double ConvertDateToSeconds(DateTime targetDate)
        {
            DateTime epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            TimeSpan timeDifference = targetDate - epoch;
            return timeDifference.TotalSeconds;
        }

        public DateTime ConvertAlienToEarth(AlienTimeViewModel alienTime)
        {
            // Calculate total Alien seconds
            double totalAlienSeconds = CalculateTotalAlienSeconds(alienTime);

            // Convert Alien seconds to Earth seconds
            double earthSeconds = totalAlienSeconds / 2; // Ensure correct conversion rate

            DateTime unixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            // Add the seconds to the epoch
            DateTime newDate = unixEpoch.AddSeconds(earthSeconds);
            // Convert to Earth DateTime
            return newDate;
        }


        private double CalculateTotalAlienSeconds(AlienTimeViewModel alienTime)
        {
            double totalAlienSeconds = 0;

            // Constants for your Alien calendar
            const int secondsPerMinute = 90;
            const int secondsPerHour = 36 * secondsPerMinute;
            const int secondsPerDay = 36 * secondsPerHour;

            const int oneMin = 90; // 90sec
            const int oneHour = 90; // 90min
            const int oneDay = 36; // 36Hours
            const int oneYear = 770; // 770days

            // Get the total alien seconds in the base year (i.e., 0 year offset)
            totalAlienSeconds += (alienTime.Year -1) * GetTotalSecondsInOneAlienYear();

            // Total seconds from months
            for (int i = 0; i < alienTime.Month - 1; i++)
            {
                totalAlienSeconds += DaysInMonth[i] * secondsPerDay;
            }

            // Total seconds from days
            totalAlienSeconds += (alienTime.Day - 1) * secondsPerDay;

            // Total seconds from hours, minutes, and seconds
            totalAlienSeconds += alienTime.Hour * secondsPerHour;
            totalAlienSeconds += alienTime.Minute * secondsPerMinute;
            totalAlienSeconds += alienTime.Second;

            // Return total alien seconds converted to Earth seconds
            return totalAlienSeconds; // Assuming 1 Earth second = 2 Alien seconds.
        }

        private int GetTotalSecondsInOneAlienYear()
        {
            // Sum up all days across each month in the Alien calendar
            int totalDaysInYear = DaysInMonth.Sum();
            return totalDaysInYear * 36 * 90 * 90; // 36 hours/day, 90 minutes/hour, 90 seconds/minute
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
