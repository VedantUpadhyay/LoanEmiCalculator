

var loanAmount;
var roi;
var noi;
var monthlyRoi;
var emiCalculated;
var validateFlag = false;
var firstName;
var lastName;
var transactionDate;
var selectedCity;
var SelectedState;
var age;

var loanUserInput;
var loanTransactionsData;

var states = ["Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Lakshadweep",
    "Puducherry"];


$().ready(function () {
    //$("#getDetailsBtn").attr("disabled", "true");

    $("#AgeSlider").dxSlider({
        min: 0,
        max: 100,
        value: 23,
        rtlEnabled: false,
        tooltip: {
            enabled: true,
            format: function (value) {
                return `<b>${value}</b>`;
            },
            showMode: "always",
            position: "bottom"
        }
    });

    $("#StateDropDown").dxSelectBox({
        placeholder: "Select a State",
        dropDownOptions: {
            width: 500,
            height:200
        },
        searchEnabled: true
        ,
        items: states,
        onSelectionChanged: function (element) {
            var selectedState = element.selectedItem;
            $("#CityDropdown").dxSelectBox({
                items: cityMap[0][selectedState]
            });
            SelectedState = element.selectedItem;
        }
    });

    $("#CityDropdown").dxSelectBox({
        placeholder: "Select a City",
        searchEnabled: true,
        dropDownOptions: {
            width: 500,
            height: 200,
            searchEnabled: true
        },
        
        onSelectionChanged: function (element) {
            selectedCity = element.selectedItem;
        }
    });



    $("#FirstName").dxTextBox();
    $("#LastName").dxTextBox();
    $("#LoanAmount").dxNumberBox({
        showSpinButtons: false,
        showClearButton: true,
    });
    $("#RateOfInterest").dxNumberBox({
        showSpinButtons: false,
        showClearButton: true,
    });
    $("#emi").dxNumberBox({
        showSpinButtons: false,
        showClearButton: false,
        disabled: 'true'
    });
    $("#NoOfInstallments").dxNumberBox({
        showSpinButtons: false,
        showClearButton: true,

    });
    $("#MonthlyRateOfInterest").dxNumberBox({
        showSpinButtons: false,
        showClearButton: true,
        disabled: 'true'
    });

    $('input').keyup(function () {
        var empty = false;
        $('form > input').each(function () {
            if ($(this).val() == '') {
                empty = true;
            }
        });
        if (empty) {
            console.log('all fields are empty..');
            $('#postBackButton').dxButton({
                disabled: true
            });
        }
        else {
            $('#postBackButton').removeAttr('disabled');
        }
    });

    $("input").each(function (index, elem) {
        $(elem).val('');
        //$(elem).change(function () {
        //    $("#postBackButton").attr("disabled", "true");
        //    if (loanAmount !== "" && roi !== "" && noi !== "") {
        //        $("#getDetailsBtn").attr("disabled", "false");
        //    }
        //});
    });
    $("#LoanAmount").focus();

    $("#trDate").dxDateBox({
        type: "date",
        value: new Date()
    });

    $("#getDetailsBtn").dxButton({
        text: "Get Details",
        type: "default"
    });

    $("#postBackButton").dxButton({
        text: "Save To DataBase",
        type: "success",
        disabled: true
    })

    $("#userInput input").on("blur", function () {

        loanAmount = $("#LoanAmount").dxNumberBox('instance').option('value'); 
        roi = $("#RateOfInterest").dxNumberBox('instance').option('value'); 
        noi = $("#NoOfInstallments").dxNumberBox('instance').option('value'); 

        //console.log(loanAmount, roi, noi);

        if ((loanAmount !== 0) && (roi !== 0) && (noi !== 0)) {
            validateFlag = true;
            //$("#MonthlyRateOfInterest").removeAttr("disabled");
            monthlyRoi = roi / (1200);
            //$("#MonthlyRateOfInterest").val(monthlyRoi);
            $("#MonthlyRateOfInterest").dxNumberBox('instance').option('value',monthlyRoi);
            //$("#EMI").removeAttr("disabled");
            // emiCalculated = loanAmount * monthlyRoi * (1 + monthlyRoi) 
            emiCalculated = loanAmount * ((monthlyRoi * Math.pow((1 + monthlyRoi), noi * 12)) / (Math.pow(1 + monthlyRoi, noi * 12) - 1));
            $("#emi").dxNumberBox({
                value: parseFloat(emiCalculated.toFixed(2))
            });
            $("#loanSummaryTable").removeClass("displayNone");
        }
        else {
           // $("#postBackButton").attr("disabled", "true");
            $('#postBackButton').dxButton({
                disabled: true
            });
           // $("#getDetailsBtn").attr("disabled", "true");
        }
    });

    $(document).ajaxStart(function () {
        $('#loading').show();
    }).ajaxStop(function () {
        $('#loading').hide();
    });

    $('.dataTables_length').addClass('bs-select');

    $("#postBackButton").click(function () {
        $.ajax({
            method: 'post',
            url: '/Customer/Home/Index',
            data: {
                'firstName': firstName,
                'lastName': lastName,
                'age': age,
                'state': SelectedState,
                'city': selectedCity,
                'transactionDate': transactionDate,
                'loanAmount': loanAmount,
                'rateOfInterest': roi,
                /*'noOfInstallments': Math.ceil(noi * 12),*/
                'noOfInstallments': noi,
                'monthlyRateOfInterest': monthlyRoi,
                'emi': emiCalculated,
                'loanTransactions': loanTransactionsData
            },
            success: function (response) {
                console.log(response);
                loanTransactionsData = null;
                if (response.success == true) {
                    toastr.success('Data Saved Successfully.');
                }
                else if (response.success == false) {
                    toastr.info('Data Already Exists..');
                }
            }
        });
    });

    $("#getDetailsBtn").click(function () {

        loanAmount = $("#LoanAmount").dxNumberBox('instance').option('value');
        roi = $("#RateOfInterest").dxNumberBox('instance').option('value');
        noi = $("#NoOfInstallments").dxNumberBox('instance').option('value'); 
        age = $("#AgeSlider").dxSlider('instance').option('value');
        console.log(age);
        transactionDate = $("#trDate").dxDateBox('option', 'value').toLocaleDateString();
        firstName = $("#FirstName").dxTextBox('option','value');
        lastName = $("#LastName").dxTextBox('option', 'value');
      /*  selectedCity = $("StateDropDown").dxSelectBox('option','value');
        SelectedState = $("StateDropDown").dxSelectBox('option','value');*/
       // console.log(selectedCity + "  " + SelectedState);

        //console.log(loanAmount, roi, noi);

        if (loanAmount != 0 && roi != 0 && noi != 0) {

            $.ajax({
                method: 'post',
                url: '/Customer/Home/GetDetails',
                data: {
                    'firstName': firstName,
                    'lastName': lastName,
                    'age': age,
                    'state': SelectedState,
                    'city': selectedCity,
                    'transactionDate': transactionDate,
                    'loanAmount': loanAmount,
                    'rateOfInterest': roi,
                /*'noOfInstallments': Math.ceil(noi * 12),*/
                    'noOfInstallments': noi,
                    'monthlyRateOfInterest': monthlyRoi,
                    'emi': emiCalculated
                },
                success: function (response) {
                    loanUserInput = {
                        'loanAmount': loanAmount,
                        'rateOfInterest': roi,
                    /*'noOfInstallments': Math.ceil(noi * 12),*/
                        'noOfInstallments': noi,
                        'monthlyRateOfInterest': monthlyRoi,
                        'emi': emiCalculated
                    };

                    if (dataTableExists()) {
                        emptyDataTable();
                    }

                    loanTransactionsData = response.loanTransactions;
                   /* fillLoanTransactionsTable(response);

                    $("#loanTransactionsTable").fancyTable({
                        pagination: "true",
                        perPage: "10",
                        sortable: "false",
                        searchable: "false",
                        globalSearch: false
                    });
                    */

                    $("#loanTransactionsTable").dxDataGrid({
                        dataSource: loanTransactionsData,
                        showBorders: true,
                        paging: {
                            pageSize: 10
                        },
                        pager: {
                            showInfo: true
                        },
                        columns: ["installmentNo","opening", "principal", "interest", "emi", "closing","cummulativeInterest"]
                    });
                   // $("#postBackButton").removeAttr("disabled");
                    $("#loanTransactionsTable").removeClass("displayNone");
                    $('#postBackButton').dxButton({
                        disabled: false
                    });
                    console.log(response.loanTransactions);
                }
            });
        }
        else {
            toastr.warning("All the fields are required..");
        }
     
    });
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function fillLoanTransactionsTable(data) {
    data = data.loanTransactions;
    
    for (var i = 0; i < data.length; i++) {
        var row = "<tr>";
        row += `<td>${numberWithCommas(data[i].installmentNo)}</td>`;

        row += `<td>${numberWithCommas(data[i].opening.toFixed(2))}</td>`;

        row += `<td>${numberWithCommas(data[i].principal.toFixed(2))}</td>`;

        row += `<td>${numberWithCommas(data[i].interest.toFixed(2))}</td>`;

        row += `<td>${numberWithCommas(data[i].emi.toFixed(2))}</td>`;

        row += `<td>${numberWithCommas(data[i].closing.toFixed(2))}</td>`;

        row += `<td>${numberWithCommas(data[i].cummulativeInterest.toFixed(2))}</td>`;

        row += "</tr>";

        $("#loanTransactionsTable").append(row);
    }
    
}

function emptyDataTable() {
    $("#loanTransactionsTable").empty();
    $("#loanTransactionsTable").append(`<thead>
                        <tr class="bg-dark text-white">
                            <th style="width:10px">Installment</th>
                            <th>Opening</th>
                            <th>Principal</th>
                            <th>Interest</th>
                            <th>EMI</th>
                            <th>Closing</th>
                            <th>Cummulative Interest</th>
                        </tr>
                    </thead>`);
}

function dataTableExists() {
    if ($("#loanTransactionsTable").children().length > 1) {
        return true;
    }
    return false;
}