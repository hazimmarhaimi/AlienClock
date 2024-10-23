using AlienClock.Models;
using AlienClock.Services;
using Microsoft.AspNetCore.Mvc;
using System;

namespace AlienClock.Controllers
{
    public class TimeController : Controller
    {
        private readonly TimeService _timeService;

        public TimeController(TimeService timeService)
        {
            _timeService = timeService;
        }

        // This renders the initial view with both Earth and Alien time
        public IActionResult Index()
        {
            DateTime earthTime = DateTime.Now;
            AlienTimeViewModel alienTime = _timeService.ConvertEarthToAlien(earthTime);

            var model = new TimeViewModel
            {
                EarthTime = earthTime,
                AlienTime = alienTime
            };

            return View(model);
        }

        // This is the new API endpoint to fetch real-time Alien time in JSON format
        [HttpGet]
        public IActionResult GetCurrentAlienTime()
        {
            DateTime earthTime = DateTime.Now;
            AlienTimeViewModel alienTime = _timeService.ConvertEarthToAlien(earthTime);

            return Json(alienTime); // Return the current Alien time as JSON
        }

        [HttpPost]
        public IActionResult SetAlienTime(AlienTimeViewModel alienTime)
        {
            DateTime earthEquivalent = _timeService.ConvertAlienToEarth(alienTime);
            // Set the clock accordingly
            return RedirectToAction("Index");
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
