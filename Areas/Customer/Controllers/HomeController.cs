using LoanEmiCalculator.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace LoanEmiCalculator.Controllers
{
    [Area("Customer")]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }


        public IActionResult Index()
        {
            LoanInput LoanInput = new LoanInput();
            return View(LoanInput);
        }

        [HttpPost]
        public IActionResult Index(LoanInput loanInput)
        {
            loanInput.MonthlyRateOfInterest = loanInput.RateOfInterest / 1200;

            loanInput.emi = loanInput.LoanAmount * ((loanInput.MonthlyRateOfInterest * Math.Pow((1 + loanInput.MonthlyRateOfInterest), loanInput.NoOfInstallments * 12)) / (Math.Pow(1 + loanInput.MonthlyRateOfInterest, loanInput.NoOfInstallments * 12) - 1));

            
            return View();
        }


        //AJAX Handler
        [HttpPost,ActionName("GetDetails")]
        public IActionResult GetEmiDetails(LoanInput userInput)
        {
            List<LoanTransaction> Loantransactions = new List<LoanTransaction>(Convert.ToInt32(userInput.NoOfInstallments * 12));

            LoanTransaction FirstTransaction = new LoanTransaction
            {
                Opening = userInput.LoanAmount,
                emi = userInput.emi,
                Interest = userInput.LoanAmount * userInput.MonthlyRateOfInterest
            };
            FirstTransaction.Principal = userInput.emi - FirstTransaction.Interest;
            FirstTransaction.Closing = FirstTransaction.Opening - FirstTransaction.Principal;
            FirstTransaction.CummulativeInterest = FirstTransaction.Interest;
            FirstTransaction.InstallmentNo = 1;
            Loantransactions.Add(FirstTransaction);

            for (int i = 1; i < Convert.ToInt32(userInput.NoOfInstallments); i++)
            {
                LoanTransaction transaction = new LoanTransaction
                {
                    InstallmentNo = i + 1,
                    emi = userInput.emi,
                    Opening = Loantransactions[i - 1].Opening - Loantransactions[i - 1].Principal
                };
                //transaction.Interest = transaction.Opening * userInput.MonthlyRateOfInterest;
                //transaction.Principal = transaction.emi - transaction.Interest;
                //transaction.Closing = transaction.Opening - transaction.Principal;
                //transaction.CummulativeInterest = userInput.emi * (i + 1);

                transaction.Interest = transaction.Opening * userInput.MonthlyRateOfInterest;
                transaction.Principal = userInput.emi - transaction.Interest;
                transaction.Closing = transaction.Opening - transaction.Principal;
                transaction.CummulativeInterest = Loantransactions[i - 1].CummulativeInterest + transaction.Interest;

                Loantransactions.Add(transaction);
            }

            return Json(new {
                loanTransactions = Loantransactions
            });
        }


        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
