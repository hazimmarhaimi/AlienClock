namespace AlienClock.Models
{
    public class TimeViewModel
    {
        public DateTime EarthTime { get; set; }   // Holds the current Earth time
        public AlienTimeViewModel AlienTime { get; set; }   // Holds the current Alien time
    }

    public class AlienTimeViewModel
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }
        public int Hour { get; set; }
        public int Minute { get; set; }
        public int Second { get; set; }
    }

    public class EarthTimeViewModel
    {
        public AlienTimeViewModel AlienTime { get; set; } // Holds Alien time input
        public DateTime EarthTime { get; set; }           // Holds corresponding Earth time
    }
}
