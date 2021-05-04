using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace LoanEmiCalculator.Models
{
    public class LoanInput
    {
        [Key]
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public int Age { get; set; }

        public string State { get; set; }

        public string City { get; set; }

        public string TransactionDate { get; set; }

        [Required]
        [Display(Name = "Loan Amount")]
        public double LoanAmount { get; set; }

        [Required]
        [Display(Name = "Rate Of Interest")]
        public double RateOfInterest { get; set; }

        [Required]
        [Display(Name = "NO. Of Installments")]
        public double NoOfInstallments { get; set; }

        [Display(Name = "Monthly Rate Of Interest")]
        public double MonthlyRateOfInterest { get; set; }

        public double emi { get; set; }

    }
}
