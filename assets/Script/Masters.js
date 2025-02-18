$(document).ready(function () {

    var currentDate = new Date().toISOString().split("T")[0];
    $("#Date").val(currentDate);

    // Populate Department dropdown
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

            $.each(Department, function (key, value) {
                $("#Department").append($("<option></option>").attr("value", key).text(value));
            });
        }
    });

    // Handle Department change
    $("#Department").on("change", function () {
        var selectedDepartment = $("#Department").val();  // Get selected department value

        // Clear Work Area dropdown before repopulating
        $("#Work_Area").empty().append($("<option></option>").attr("value", "").text("Select Work Area"));

        if (selectedDepartment) {
            $.ajax({
                url: baseurl + "Work_Master/Work_Areas",
                type: "POST",
                data: { Department: selectedDepartment },  // Pass the selected department
                success: function (response) {
                    var responseData = JSON.parse(response);
                    var Work_Areas = responseData.Work_Areas;

                    var Work_Area = {};

                    for (var i = 0; i < Work_Areas.length; i++) {
                        var DName = Work_Areas[i];
                        Work_Area[DName.WorkArea] = DName.WorkArea;
                    }

                    $.each(Work_Area, function (key, value) {
                        $("#Work_Area").append($("<option></option>").attr("value", key).text(value));
                    });
                }
            });
        }
    });

    // Handle Work Area change
    $("#Work_Area").on("change", function () {
        var Department = $("#Department").val();
        var Sub_Department = $("#Work_Area").val();

        if (Department && Sub_Department) {
            $.ajax({
                url: baseurl + "JobCard/Generate_New",
                type: "POST",
                data: {
                    Department: Department,
                    Sub_Department: Sub_Department,
                },
                success: function (response) {
                    var responseData = JSON.parse(response);
                    var Job_Card_No = responseData.Job_Card_No;

                    // Uncomment and customize the error handling if needed
                    // if(responseData == 'error'){
                    //     swal({
                    //         title: "Error!",
                    //         text: "This Work Area Already Created For Job Card No, Please Check.",
                    //         icon: "error",
                    //         buttons: true,
                    //         className: "swal-small", // Custom class for small size
                    //     });
                    // }

                    // Uncomment to display the generated Job Card Number
                    $("#jobcardno").val(Job_Card_No);
                },
            });
        }
    });


    $("#FrameType").on("change", function () {
		var Department = $("#Departments").val();
		var Sub_Department = $("#sub_Department").val();

		$.ajax({
			url: baseurl + "JobCard/Generete_Machine_id",
			type: "POST",
			data: {
				Department: Department,
				Sub_Department: Sub_Department,
			},
			success: function (response) {
				var responseData = JSON.parse(response);
				var Machine_id = responseData.Machine_Id;

				$("#Machine_Model_No").val(Machine_id);
			},
		});
	});

});
