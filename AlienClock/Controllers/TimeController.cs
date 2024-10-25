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
            AlienTimeViewModel alienTime = _timeService.ConvertEarthToAlien();

            var model = new TimeViewModel
            {
                EarthTime = earthTime,
                AlienTime = alienTime
            };

            return View(model);
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
            DateTime earthTime = _timeService.GetEarthTimeBasedOnAlienTime(alienTime);

            var model = new EarthTimeViewModel
            {
                AlienTime = alienTime,
                EarthTime = earthTime
            };

            // Return the model data as JSON
            return Json(model);
        }

    }
}
