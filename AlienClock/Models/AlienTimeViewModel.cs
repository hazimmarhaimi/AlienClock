namespace AlienClock.Models
{
    public class TimeViewModel
    {
        public DateTime EarthTime { get; set; }
        public AlienTimeViewModel AlienTime { get; set; } 
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
        public AlienTimeViewModel AlienTime { get; set; } 
        public DateTime EarthTime { get; set; }
    }
}
