var loanAmount;
var roi;
var noi;
var monthlyRoi;
var emiCalculated;

$().ready(function () {
    $("input").each(function (index, elem) {
        $(elem).removeAttr("value");
    });
    $("#LoanAmount").focus();

    $("#userInput input").on("blur", function () {

        loanAmount = $("#LoanAmount").val();
        roi = $("#RateOfInterest").val();
        noi = $("#NoOfInstallments").val();

        //console.log(loanAmount, roi, noi);

        if (loanAmount !== "" && roi !== "" && noi !== "") {
            
            $("#MonthlyRateOfInterest").removeAttr("disabled");
            monthlyRoi = roi / (1200);
            $("#MonthlyRateOfInterest").val(monthlyRoi);
            $("#EMI").removeAttr("disabled");
           // emiCalculated = loanAmount * monthlyRoi * (1 + monthlyRoi) 
            emiCalculated = loanAmount *( (monthlyRoi * Math.pow(( 1+ monthlyRoi),noi*12))/(Math.pow(1 + monthlyRoi,noi*12) - 1));
            $("#EMI").val(emiCalculated);

        }
    });

    
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}