using LoanEmiCalculator.Data;
using LoanEmiCalculator.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        private readonly ApplicationDbContext _db;

        public HomeController(ILogger<HomeController> logger, ApplicationDbContext db)
        {
            _logger = logger;
            _db = db;
        }

        public bool IsLoanInputEmpty(LoanInput UserInput)
        {
            if(UserInput.emi != 0 && UserInput.LoanAmount != 0 && UserInput.MonthlyRateOfInterest != 0 && UserInput.NoOfInstallments != 0 && UserInput.RateOfInterest != 0)
            {
                return false;
            }
            return true;
        }


        public IActionResult Index()
        {
            LoanInput LoanInput = new LoanInput();
            return View(LoanInput);
        }

        [HttpPost]
        public IActionResult Index(LoanInput loanInput)
        {
            // loanInput.MonthlyRateOfInterest = loanInput.RateOfInterest / 1200;
            /*
            loanInput.emi = loanInput.LoanAmount * ((loanInput.MonthlyRateOfInterest * Math.Pow((1 + loanInput.MonthlyRateOfInterest), loanInput.NoOfInstallments * 12)) / (Math.Pow(1 + loanInput.MonthlyRateOfInterest, loanInput.NoOfInstallments * 12) - 1));
            */
            List<LoanTransaction> LoanTransactions = PopulateTransactions(loanInput);
            if(!IsLoanInputEmpty(loanInput))
            {
                var inputFromDb = _db.LoanInputs.FirstOrDefault(obj => obj.LoanAmount == loanInput.LoanAmount && obj.NoOfInstallments == loanInput.NoOfInstallments && loanInput.RateOfInterest == obj.RateOfInterest);

                //No duplication
                if (inputFromDb == null)
                {
                    _db.LoanInputs.Add(loanInput);
                    _db.SaveChanges();

                    var getLoanId = _db.LoanInputs.FirstOrDefault(obj => obj.LoanAmount == loanInput.LoanAmount && obj.NoOfInstallments == loanInput.NoOfInstallments && loanInput.RateOfInterest == obj.RateOfInterest);

                    foreach (var item in LoanTransactions)
                    {
                        item.LoanId = getLoanId.Id;

                        _db.LoanTransactions.Add(item);
                        _db.SaveChanges();
                    }
                    
                }

                //Duplicate record exists
                else
                {
                    return Json(new
                    {
                        inValidateData = false,
                        isExists = true,
                        success = false
                    });
                }
            }

            //server side model validation
            else
            {
                return Json(new {
                    inValidateData = true,
                    isExists = false,
                    success = false
                });
            }

            return Json(new
            {
                inValidateData = false,
                isExists = false,
                success = true
            });
        }


        //AJAX Handler
        [HttpPost,ActionName("GetDetails")]
        public IActionResult GetEmiDetails(LoanInput userInput)
        {
            List<LoanTransaction> Loantransactions = PopulateTransactions(userInput);

            return Json(new {
                loanTransactions = Loantransactions
            });
        }

        public List<LoanTransaction> PopulateTransactions(LoanInput userInput)
        {
            List<LoanTransaction> Loantransactions = new List<LoanTransaction>(Convert.ToInt32(userInput.NoOfInstallments * 12));
            LoanTransaction FirstTransaction = new LoanTransaction
            {
                Opening = userInput.LoanAmount,
                emi = userInput.emi,
                Interest = userInput.LoanAmount * userInput.MonthlyRateOfInterest
            };
            FirstTransaction.Principal = userInput.emi - FirstTransaction.Interest;
            FirstTransaction.Closing = Math.Round(FirstTransaction.Opening,2) - Math.Round(FirstTransaction.Principal,2);
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

            return Loantransactions;
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
