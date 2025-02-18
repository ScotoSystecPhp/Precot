$(document).ready(function () {

    var currentDate = new Date().toISOString().split("T")[0];
    $("#Date").val(currentDate);

    $("#Shift_Closing_container").hide();
    $("#Shift_Closing_Section").hide();


    $.ajax({
        url: baseurl + "Work_Master/Shifts",
        type: "POST",
        success: function (response) {
            var responseData = JSON.parse(response);
            var Shifts = responseData.Shifts;

            var Shift = {};


            for (var i = 0; i < Shifts.length; i++) {
                var DName = Shifts[i];
                Shift[DName.ShiftDesc] = DName.ShiftDesc;
            }

            $.each(Shift, function (index, value) {
                $("#Shift").append($("<option></option>").attr("value", value).text(value));
            });

            $("#Shift option:first").prop("selected", true);


            var Shift = $("#Shift").val();

            $.ajax({
                url: baseurl + 'Work/Allocation_List',
                type: 'POST',
                data: {
                    Date: $("#Date").val(),
                    Shift
                },
                success: function (response) {
                    var response_Data = JSON.parse(response);
                    var Allocation_List = response_Data.Allocation_List;

                    if (Allocation_List.length == '0') {


                        $("#Shift_Employee_List tbody").empty();
                        swal({
                            type: 'warning',
                            title: 'Warning',
                            text: 'Employee Allocation List Not Found!',
                        });

                    } else {

                        $("#Shift_Closing_container").hide();
                        $("#Shift_Closing_Section").show();
                        $("#Shift_Employee_List tbody").empty();

                        var processedEmpNos = new Set();

                        $.each(Allocation_List, function (index, item) {
                            if (!processedEmpNos.has(item.EmpNo) && item.EmpNo) { // Check if EmpNo exists
                                processedEmpNos.add(item.EmpNo);

                                var row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.Department}</td>
                        <td>${item.WorkArea}</td>
                        <td>${item.Job_Card_No}</td>
                        <td data-EmployeeId="${item.EmpNo}">${item.EmpNo}</td>
                        <td data-EmployeeName="${item.FirstName}">${item.FirstName}</td>
                        <td><input type="checkbox" class="OTEmployeeCheckbox" data-empno="${item.EmpNo}"></td>
                    </tr>
                `;
                                $("#Shift_Employee_List tbody").append(row);
                            }
                        });

                        // Initialize DataTable after appending all rows
                        if (!$.fn.dataTable.isDataTable('#Shift_Employee_List')) {
                            $("#Shift_Employee_List").DataTable({
                                "paging": true,
                                "searching": true,
                                "ordering": true,
                                "info": true
                            });
                        }
                    }
                }

            })
        },
    });



$("#Shift_Employee_List_Update").on("click", function () {
    var Date = $("#Date").val();
    var Shift = $("#Shift").val();
    var employeesData = [];
    var remarks = $("#remarks").val(); // Assume there is an input for remarks

    // Loop through each row in the table and extract the necessary data
    $("#Shift_Employee_List tbody tr").each(function () {
        var departmentName = $(this).children().eq(1).text().trim(); // Get the 2nd column (index 1) for Department
        var workArea = $(this).children().eq(2).text().trim();       // Get the 3rd column (index 2) for Work Area
        var jobCardNo = $(this).children().eq(3).text().trim();      // Get the 4th column (index 3) for Job Card No
        var Employee_Id = $(this).find(".OTEmployeeCheckbox").data("empno");
        var isChecked = $(this).find(".OTEmployeeCheckbox").prop("checked") ? 1 : 0;

        // Push the data into the employeesData array with the employee-specific remarks
        employeesData.push({
            Date: Date,
            Shift : Shift,
            EmployeeId: Employee_Id,
            OTConfirm: isChecked,
            Department: departmentName,
            Work_Area: workArea,
            JobCardNo: jobCardNo,
            Remark: remarks // Send the remarks here
        });
    });

    // Make sure that we only send the necessary data in the request
    $.ajax({
        url: baseurl + "Work/Employee_Shift_Closings",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            Employees: employeesData,
        }),
        success: function (response) {
            var responseData = JSON.parse(response);
            if (responseData == "success") {
                swal({
                    icon: 'success',
                    title: 'Employee Shift Closing Successfully!',
                    text: 'Updated'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("Error: ", status, error);
            swal({
                icon: 'error',
                title: 'Error!',
                text: 'There was an issue with closing the shift. Please try again.'
            });
        },
    });
});


    $("#Shift").on("change", function () {


         var Shift = $("#Shift").val();

            $.ajax({
                url: baseurl + 'Work/Allocation_List',
                type: 'POST',
                data: {
                    Date: $("#Date").val(),
                    Shift
                },
                success: function (response) {
                    var response_Data = JSON.parse(response);
                    var Allocation_List = response_Data.Allocation_List;

                    if (Allocation_List.length == '0') {


                        $("#Shift_Employee_List tbody").empty();
                        swal({
                            type: 'warning',
                            title: 'Warning',
                            text: 'Employee Allocation List Not Found!',
                        });

                    } else {

                        $("#Shift_Closing_container").hide();
                        $("#Shift_Closing_Section").show();
                        $("#Shift_Employee_List tbody").empty();

                        var processedEmpNos = new Set();

                        $.each(Allocation_List, function (index, item) {
                            if (!processedEmpNos.has(item.EmpNo) && item.EmpNo) { // Check if EmpNo exists
                                processedEmpNos.add(item.EmpNo);

                                var row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.Department}</td>
                        <td>${item.WorkArea}</td>
                        <td>${item.Job_Card_No}</td>
                        <td data-EmployeeId="${item.EmpNo}">${item.EmpNo}</td>
                        <td data-EmployeeName="${item.FirstName}">${item.FirstName}</td>
                        <td><input type="checkbox" class="OTEmployeeCheckbox" data-empno="${item.EmpNo}"></td>
                    </tr>
                `;
                                $("#Shift_Employee_List tbody").append(row);
                            }
                        });

                        // Initialize DataTable after appending all rows
                        if (!$.fn.dataTable.isDataTable('#Shift_Employee_List')) {
                            $("#Shift_Employee_List").DataTable({
                                "paging": true,
                                "searching": true,
                                "ordering": true,
                                "info": true
                            });
                        }
                    }
                }

            })



    })












    })