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
        public int Key { get; set; }

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

        public double EMI { get; set; }

    }
}
