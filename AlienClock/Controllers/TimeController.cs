using AlienClock.Models;
using AlienClock.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace AlienClock.Controllers
{
    public class TimeController : Controller
    {
        private readonly TimeService _timeService;
        private DateTime? _currentEarthTime;

        public TimeController(TimeService timeService)
        {
            _timeService = timeService;
            _currentEarthTime = DateTime.Now;
        }

        // This renders the initial view with both Earth and Alien time
        public IActionResult Index()
        {
            // Use the current Earth time
            DateTime earthTime = _currentEarthTime ?? DateTime.Now;
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
            _currentEarthTime = earthTime; // Update the current Earth time
            AlienTimeViewModel alienTime = _timeService.ConvertEarthToAlien(earthTime);

            var model = new TimeViewModel
            {
                EarthTime = earthTime,
                AlienTime = alienTime
            };

            return View("Index", model);
        }

        [HttpGet]
        public IActionResult GetCurrentAlienTime()
        {
            // Use the new Earth time if it has been set; otherwise, use the current time
            DateTime earthTime = _currentEarthTime ?? DateTime.Now;
            AlienTimeViewModel alienTime = _timeService.ConvertEarthToAlien(earthTime);

            return Json(alienTime); // Return the current Alien time as JSON
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
