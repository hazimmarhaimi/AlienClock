using AlienClock.Models;

namespace AlienClock.Services
{
    public class TimeService
    {
        private static readonly DateTime EarthBaseTime = new DateTime(1970, 1, 1, 0, 0, 0);
        private static readonly AlienTimeViewModel AlienBaseTime = new AlienTimeViewModel { Year = 2804, Month = 18, Day = 31, Hour = 2, Minute = 2, Second = 88 };

        private static readonly int[] DaysInMonth = { 44, 42, 48, 40, 48, 44, 40, 44, 42, 40, 40, 42, 44, 48, 42, 40, 44, 38 };

        public AlienTimeViewModel ConvertEarthToAlien(DateTime earthTime)
        {
            TimeSpan timeDifference = earthTime - EarthBaseTime;
            double alienSeconds = timeDifference.TotalSeconds / 0.5;
            return GetAlienTimeViewModelFromSeconds(alienSeconds);
        }

        public DateTime ConvertAlienToEarth(AlienTimeViewModel alienTime)
        {
            double totalAlienSeconds = CalculateTotalAlienSeconds(alienTime);
            double earthSeconds = totalAlienSeconds * 0.5;
            return EarthBaseTime.AddSeconds(earthSeconds);
        }

        private double CalculateTotalAlienSeconds(AlienTimeViewModel alienTime)
        {
            double totalSeconds = 0;

            // Calculate seconds from years
            int yearsDiff = alienTime.Year - AlienBaseTime.Year;
            totalSeconds += yearsDiff * GetTotalSecondsInOneAlienYear();

            // Calculate seconds from months
            for (int i = 0; i < alienTime.Month - 1; i++)
            {
                totalSeconds += DaysInMonth[i] * 36 * 90 * 90;
            }

            // Calculate seconds from days
            totalSeconds += (alienTime.Day - 1) * 36 * 90 * 90;

            // Calculate seconds from hours
            totalSeconds += alienTime.Hour * 90 * 90;

            // Calculate seconds from minutes
            totalSeconds += alienTime.Minute * 90;

            // Add remaining seconds
            totalSeconds += alienTime.Second;

            return totalSeconds;
        }

        private AlienTimeViewModel GetAlienTimeViewModelFromSeconds(double totalSeconds)
        {
            AlienTimeViewModel alienTime = new AlienTimeViewModel();
            double remainingSeconds = totalSeconds;

            // Calculate year
            int alienYearSeconds = GetTotalSecondsInOneAlienYear();
            alienTime.Year = AlienBaseTime.Year + (int)(remainingSeconds / alienYearSeconds);
            remainingSeconds %= alienYearSeconds;

            // Calculate month
            for (int i = 0; i < DaysInMonth.Length; i++)
            {
                double secondsInMonth = DaysInMonth[i] * 36 * 90 * 90;
                if (remainingSeconds >= secondsInMonth)
                {
                    remainingSeconds -= secondsInMonth;
                    alienTime.Month++;
                } else
                {
                    break;
                }
            }

            // Calculate day
            alienTime.Day = (int)(remainingSeconds / (36 * 90 * 90)) + 1;
            remainingSeconds %= (36 * 90 * 90);

            // Calculate hour
            alienTime.Hour = (int)(remainingSeconds / (90 * 90));
            remainingSeconds %= (90 * 90);

            // Calculate minute
            alienTime.Minute = (int)(remainingSeconds / 90);
            remainingSeconds %= 90;

            // Remaining seconds
            alienTime.Second = (int)remainingSeconds;

            return alienTime;
        }

        private int GetTotalSecondsInOneAlienYear()
        {
            // Total seconds in one alien year considering all months
            int totalDaysInYear = 0;
            foreach (int days in DaysInMonth)
            {
                totalDaysInYear += days;
            }

            return totalDaysInYear * 36 * 90 * 90; // 36 hours/day, 90 minutes/hour, 90 seconds/minute
        }
    }
}
