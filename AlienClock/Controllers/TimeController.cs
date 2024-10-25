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

        public IActionResult Index()
        {

            // Convert Earth time to Alien time initial
            AlienTimeViewModel alienTime = _timeService.ConvertEarthToAlien();

            var model = new TimeViewModel
            {
                EarthTime = _currentEarthTime,
                AlienTime = alienTime
            };

            return View(model);
        }


        [HttpGet]
        public IActionResult GetCurrentEarthTime()
        {
            DateTime earthTime = DateTime.Now;

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

            return Json(model);
        }

    }
}
