$(document).ready(function () {

    var currentDate = new Date().toISOString().split("T")[0];
    $("#Date").val(currentDate);

    $("#Shift_Closing_container").hide();
    $("#Shift_Closing_Section").hide();
    // $("#Partial_Close_List_Container").hide();



    $.ajax({
        url: baseurl + "Work_Master/Depertments",
        type: "POST",
        success: function (response) {
            var responseData = JSON.parse(response);
            var Department_Data = responseData.Departments;

            var Department = {"":""};

            for (var i = 0; i < Department_Data.length; i++) {
                var DName = Department_Data[i];
                Department[DName.Name] = DName.Name;
            }

            $("#Department").empty();


            $.each(Department, function (key, value) {
                $("#Department").append($("<option></option>").attr("value", key).text(value));
            });

        }
    });


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

            $("#Shift").empty();
            $.each(Shift, function (index, value) {
                $("#Shift").append($("<option></option>").attr("value", value).text(value));
            });

            $("#Shift option:first").prop("selected", true);
        },
     });


    $("#Department").on("change", function () {

        var Date = $("#Date").val();
        var Department = $("#Department").val();
        var Shift = $("#Shift").val();

        $.ajax({
            url: baseurl + "Allocation/Assgined_Employee_Id",
            type: "POST",
            data: {
                Date,
                Department,
                Shift
            },
            success: function (response) {

                var responseData = JSON.parse(response);


                if (responseData.status == 'error') {

                    // swal({
                    //     type: 'warning',
                    //     title: 'Warning',
                    //     text: responseData.mesaage
                    // });

                } else {

                var Employee_Name = {" ":" "};

				for (var i = 0; i < responseData.length; i++) {
					var DName = responseData[i];
					Employee_Name[DName.EmpNo] = DName.FirstName;
				}

                    $("#Employee_Id").empty();

                    $.each(Employee_Name, function (key, value) {
					$("#Employee_Id").append(
                        $("<option></option>").attr("value", key).text(key + "-" + value)

					);
				});

                }
            }

        })
    })


    $("#Partial_Close_Shift").on("click", function () {

        var Date = $("#Date").val();
        var Shift = $("#Shift").val();
        var Department = $("#Department").val();
        var Employee_Id = $("#Employee_Id").val();
        var Reason = $("#Reason").val();
        var Work_Time = $("#Work_Timing").val();

        $.ajax({
            url: baseurl + 'Allocation/Partial_Close',
            type: 'POST',
            data:
            {
                Date,
                Shift,
                Department,
                Employee_Id,
                Reason,
                Work_Time

            },
            success: function (response) {

                var responseData = JSON.parse(response);

                if (responseData.status == 'success') {

                     swal({
                        type: 'success',
                        title: 'Good',
                        text: responseData.mesaage
                    });

                } else {

                     swal({
                        type: 'warning',
                        title: 'Warning',
                        text: responseData.mesaage
                    });
                }


            }
        })


    })


    $("#Shift").on("change", function () {

    $("#Partial_Close_List_Table tbody").empty();


    var Date = $("#Date").val();
    var Shift = $("#Shift").val();

    $.ajax({
        url: baseurl + 'Allocation/Partial_Close_List',
        type: 'POST',
        data: {
            Date,
            Shift,
        },
        success: function (response) {
            var responseData = JSON.parse(response);

            if (responseData.status = 'error') {

                            $("#Partial_Close_List_Table tbody").empty();

            }

            $("#Partial_Close_List_Table tbody").empty();

            $.each(responseData, function (index, item) {
                var row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.EmpNo}</td>
                        <td>${item.FirstName}</td>
                        <td>${item.Department}</td>
                        <td>${item.WorkArea}</td>
                        <td>${item.Job_Card_No}</td>
                        <td>${item.Reason}</td>
                        <td>${item.Work_Duration}</td>
                    </tr>
                `;
                $("#Partial_Close_List_Table tbody").append(row);
            });

            // if ($.fn.dataTable.isDataTable('#Partial_Close_List_Table')) {
            //     $('#Partial_Close_List_Table').DataTable().clear().destroy();
            // }

            // $("#Partial_Close_List_Table").DataTable({
            //     "paging": true,
            //     "searching": true,
            //     "ordering": true,
            //     "info": true
            // });
        }
    });
});

$("#Date").on("change", function () {
    var Date = $("#Date").val();
    var Shift = $("#Shift").val();

    $.ajax({
        url: baseurl + 'Allocation/Partial_Close_List',
        type: 'POST',
        data: {
            Date,
            Shift,
        },
        success: function (response) {
            var responseData = JSON.parse(response);

            if (responseData.status == 'error') {
                $("#Partial_Close_List_Table tbody").empty();
            } else {
                $("#Partial_Close_List_Table tbody").empty();

                $.each(responseData, function (index, item) {
                    var row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.EmpNo}</td>
                            <td>${item.FirstName}</td>
                            <td>${item.Department}</td>
                            <td>${item.WorkArea}</td>
                            <td>${item.Job_Card_No}</td>
                            <td>${item.Reason}</td>
                            <td>${item.Work_Duration}</td>
                        </tr>
                    `;
                    $("#Partial_Close_List_Table tbody").append(row);
                });

                // if ($.fn.dataTable.isDataTable('#Partial_Close_List_Table')) {
                //     $('#Partial_Close_List_Table').DataTable().clear().destroy();
                // }

                // $("#Partial_Close_List_Table").DataTable({
                //     "paging": true,
                //     "searching": true,
                //     "ordering": true,
                //     "info": true
                // });
            }
        }
    });
});


})