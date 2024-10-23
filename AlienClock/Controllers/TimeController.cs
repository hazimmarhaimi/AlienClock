using AlienClock.Models;
using AlienClock.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace AlienClock.Controllers
{
    public class TimeController : Controller
    {
        private readonly TimeService _timeService;
        private static DateTime _currentEarthTime = DateTime.Now;

        public TimeController(TimeService timeService)
        {
            _timeService = timeService;
            _currentEarthTime = DateTime.Now;
        }

        // This renders the initial view with both Earth and Alien time
        public IActionResult Index()
        {
            // Use the current Earth time if it has been set; otherwise, use DateTime.Now
            DateTime earthTime = _currentEarthTime != DateTime.MinValue ? _currentEarthTime : DateTime.Now;

            // Convert Earth time to Alien time using your service
            AlienTimeViewModel alienTime = _timeService.ConvertEarthToAlien(earthTime);

            var model = new TimeViewModel
            {
                EarthTime = earthTime,
                AlienTime = alienTime
            };

            return View(model);
        }


        // This is the new API endpoint to fetch real-time Alien time in JSON format
        [HttpPost]
        public IActionResult SetAlienTime(AlienTimeViewModel alienTime)
        {
            DateTime earthEquivalent = _timeService.ConvertAlienToEarth(alienTime);
            // Optionally update the Earth time display as well
            _currentEarthTime = earthEquivalent; // Update the current Earth time

            var model = new TimeViewModel
            {
                EarthTime = earthEquivalent,
                AlienTime = alienTime
            };
            return View("Index", model);
        }

        [HttpPost]
        public IActionResult SetEarthTime(DateTime earthTime)
        {
            // Store the new Earth time in session
            HttpContext.Session.SetString("EarthTime", earthTime.ToString("o")); // Store the Earth time as an ISO 8601 string

            // Convert Earth time to Alien time using your service
            AlienTimeViewModel alienTime = _timeService.ConvertEarthToAlien(earthTime);

            // Return the Earth and Alien times as JSON
            return Json(new
            {
                earthTime = new
                {
                    year = earthTime.Year,
                    month = earthTime.Month,
                    day = earthTime.Day,
                    hour = earthTime.Hour,
                    minute = earthTime.Minute,
                    second = earthTime.Second
                },
                alienTime = new
                {
                    year = alienTime.Year,
                    month = alienTime.Month,
                    day = alienTime.Day,
                    hour = alienTime.Hour,
                    minute = alienTime.Minute,
                    second = alienTime.Second
                }
            });
        }



        [HttpGet]
        public IActionResult GetCurrentAlienTime()
        {
            // Retrieve the Earth time from session as a string, or use the default if not found
            string earthTimeString = HttpContext.Session.GetString("EarthTime");
            DateTime earthTime;

            if (!string.IsNullOrEmpty(earthTimeString) && DateTime.TryParse(earthTimeString, out earthTime))
            {
                // Successfully parsed the Earth time from session
            } else
            {
                // Use the default Earth time
                earthTime = _currentEarthTime;
            }

            // Convert Earth time to Alien time using your service
            AlienTimeViewModel alienTime = _timeService.ConvertEarthToAlien(earthTime);

            // Return the alien time as JSON
            return Json(new
            {
                year = alienTime.Year,
                month = alienTime.Month,
                day = alienTime.Day,
                hour = alienTime.Hour,
                minute = alienTime.Minute,
                second = alienTime.Second
            });
        }



        [HttpGet]
        public IActionResult GetCurrentEarthTime()
        {
            // Retrieve the Earth time from session as a string
           
            DateTime earthTime = DateTime.Now;

            // Return the current Earth time as JSON
            return Json(new
            {
                year = earthTime.Year,
                month = earthTime.Month,
                day = earthTime.Day,
                hour = earthTime.Hour,
                minute = earthTime.Minute,
                second = earthTime.Second
            });
        }


        [HttpPost]
        public IActionResult ConvertAlienToEarth(AlienTimeViewModel alienTime)
        {
            DateTime earthTime = _timeService.ConvertAlienToEarth(alienTime);

            var model = new EarthTimeViewModel
            {
                AlienTime = alienTime,
                EarthTime = earthTime
            };

            return View("EarthTime", model); // Ensure the view name matches the file name
        }

    }
}
