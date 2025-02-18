$(document).ready(function () {

	var currentDate = new Date().toISOString().split("T")[0];
	$("#Date").val(currentDate);

	$("#Alloacation_Section").hide();
	$("#Description_Section").hide();
	$("#Work_Type_Section").hide();
	$("#Frame_Type_Section").hide();
	$("#Frame_Section").hide();






	$("#Allocation_Type").on("change", function () {

		$.ajax({
			url: baseurl + "Work_Master/Depertments",
			type: "POST",
			success: function (response) {
				var responseData = JSON.parse(response);
				var Department_Data = responseData.Departments;

				var Department = { "": "" };

				for (var i = 0; i < Department_Data.length; i++) {
					var DName = Department_Data[i];
					Department[DName.Name] = DName.Name;
				}

				$("#Department").empty();

				$.each(Department, function (key, value) {
					$("#Department").append($("<option></option>").attr("value", key).text(value));
				});


			}
		})

	});


	$("#Department").on("change", function () {

		var Department = $("#Department").val();

		$.ajax({
			url: baseurl + "Work_Master/Work_Areas",
			type: "POST",
			data:
			{
				Department
			},

			success: function (response) {
				var responseData = JSON.parse(response);
				var Work_Areas = responseData.Work_Areas;

				var Work_Area = { "": "" };

				for (var i = 0; i < Work_Areas.length; i++) {
					var DName = Work_Areas[i];
					Work_Area[DName.WorkArea] = DName.WorkArea;
				}
				$("#Work_Area").empty();
				$("#JobCardNo").empty();
				$("#Employee_Type").empty();
				$("#Employee_Id").empty();
				$("#Frame").empty();
				$.each(Work_Area, function (key, value) {
					$("#Work_Area").append($("<option></option>").attr("value", key).text(value));
				});

				$("#Work_Area option:first").prop("selected", true);



			}
		})
	});


	$("#Work_Area").on("change", function () {


		var Department = $("#Department").val();
		var Work_Area = $("#Work_Area").val();

		$.ajax({
			url: baseurl + "Work_Master/JobCards",
			type: "POST",
			data:
			{
				Department,
				Work_Area
			},

			success: function (response) {
				var responseData = JSON.parse(response);
				var JobCards = responseData.JobCards;

				var JobCard = {};

				for (var i = 0; i < JobCards.length; i++) {
					var DName = JobCards[i];
					JobCard[DName.JobCard_No] = DName.JobCard_No;
				}


					$("#JobCardNo").empty();
				$("#Employee_Type").empty();
				$("#Employee_Id").empty();
				$("#Frame").empty();

				$.each(JobCard, function (key, value) {
					$("#JobCardNo").append($("<option></option>").attr("value", key).text(value));
				});


				$("#JobCardNo option:first").prop("selected", true);

				$.ajax({
					url: baseurl + "Work_Master/Wages",
					type: "POST",
					data:
					{
						Department,
					},

					success: function (response) {
						var responseData = JSON.parse(response);
						var Wages = responseData.Wages;

						var Wage = {"":""};

						for (var i = 0; i < Wages.length; i++) {
							var DName = Wages[i];
							Wage[DName.wages] = DName.wage_category;
						}

						$("#Employee_Type").empty();

						$.each(Wage, function (key, value) {
							$("#Employee_Type").append($("<option></option>").attr("value", key).text(value));
						});

						$("#Employee_Type option:first").prop("selected", true);

					}
				});

			}
		})

	});

	$("#Employee_Type").on('change', function () {

		var Date = $("#Date").val();
		var Department = $("#Department").val();
		var WorkArea = $("#Work_Area").val();
		var JobCard = $("#JobCardNo").val();
		var Assigning_Shift = $("#Shift").val();
		var Employee_Type = $("#Employee_Type").val();

		$.ajax({
			url: baseurl + "Allocation/Late_Employee_List",
			type: "POST",
			data:
			{
				Date,
				Department,
				WorkArea,
				JobCard,
				Assigning_Shift,
				Employee_Type
			},

			success: function (response) {
				var responseData = JSON.parse(response);
				var Late_Employee_List = responseData.Late_Employee_List;
				var Machines = responseData.Machines;



				if (responseData.status == 'error') {

					swal({
						type: 'warning',
						title: 'Warning',
						text: responseData.mesaage
					});

				} else {

					var Employee_Name = {};

					for (var i = 0; i < Late_Employee_List.length; i++) {
						var DName = Late_Employee_List[i];
						Employee_Name[DName.EmpNo] = DName.FirstName;
					}

					$("#Employee_Id").empty();

					$.each(Employee_Name, function (key, value) {
						$("#Employee_Id").append(
							$("<option></option>").attr("value", key).text(key + " =>" + value)
						);

					});

					var Machine_Id = {};

					for (var i = 0; i < Machines.length; i++) {
						var DName = Machines[i];
						Machine_Id[DName.Machine_Id] = DName.Machine_Id;
					}

					$("#Machine_Id")
						.empty()
						.append($("<option></option>").attr("value", "").text(""))
						.append($("<option></option>").attr("value", "NoWork").text("NoWork"))
						.append(
							$("<option></option>").attr("value", "Others").text("Others")
						);

					$.each(Machine_Id, function (key, value) {
						$("#Machine_Id").append(
							$("<option></option>").attr("value", key).text(value)
						);
					});

				}
			}
		});



			if ($("#Frame_Type").val() === "All") {
				$("#Machine_Id").trigger("change");
			}

		$("#Machine_Id").on("change", function () {


				var Work_Area = $("#Work_Area").val();
				var JobCardNo = $("#JobCardNo").val();
				var Department = $("#Department").val();
				var Date = $("#Date").val();
				var Shift = $("#Shift").val();
			var Machine_Id = $("#Machine_Id").val();


			if (Machine_Id == 'Others') {

	             $("#Description_Section").show();

			} else if (Machine_Id == 'NoWork') {

	            $("#Description_Section").hide();
				$("#Frame_Type_Section").hide();
				$("#Frame_Section").hide();

			} else if (Machine_Id == '') {

				  $("#Description_Section").hide();
				$("#Frame_Type_Section").hide();
				$("#Frame_Section").hide();

			}

			else {

	            $("#Description_Section").hide();
				$("#Frame_Type_Section").show();
	            $("#Frame_Section").show();


			}

				$.ajax({
					url: baseurl + "Work_Master/Machine_Frames",
					type: "POST",
					data: {
						Work_Area: Work_Area,
						JobCardNo: JobCardNo,
						Department: Department,
						Date: Date,
						Machine_Id: Machine_Id,
						Shift: Shift
					},
					success: function (response) {
						var responseData = JSON.parse(response);
						var Machine_Frames = responseData.Machine_Frames;

						$("#Frame").empty();

						if ($("#Frame_Type").val() == "All") {
							$.each(Machine_Frames, function (index, frameData) {
								var optionValue = frameData.Machine_Id;
								var optionText = frameData.Frame;

								var $option = $("<option></option>")
									.attr("value", optionValue)
									.text(optionText);

								$("#Frame").append($option);
							});

							$("#Frame").val($("#Frame option").map(function () {
								return $(this).val();
							}).get());
						} else if ($("#Frame_Type").val() === "Partial") {
							$("#Frame").val([]);
						}
					}










				});
			});

			$("#Frame_Type").on("change", function () {
				if ($(this).val() === "All") {
					$("#Machine_Id").trigger("change");
				} else if ($(this).val() === "Partial") {
					$("#Frame").val([]);
				}
			});


	});


	$("#Other_Work_Allocation_Save").on("click", function () {

		var tableData = [];

		var Date = $("#Date").val();
		var Shift = $("#Shift").val();
		var Department = $("#Department").val();
		var Work_Area = $("#Work_Area").val();
		var JobCardNo = $("#JobCardNo").val();
		var Employee_Id = $("#Employee_Id").val();
		var Machine_Id = $("#Machine_Id").val();
		var Frame_Method = $("#Frame_Type").val();
		var Frame = $("#Frame").val();
		var Work_Type = $("#Work_Type").val();
		var Description = $("#Description").val();
		var Allocation_Type = $("#Allocation_Type").val();




		 var allocationData = {
                Date: Date,
                Department: Department,
                Shift: Shift,
                Work_Area: Work_Area,
                JobCardNo: JobCardNo,
                EmployeeId: Employee_Id,
                MachineId: Machine_Id,
                FrameMethod: Frame_Method,
                Frames: Frame,
                WorkType: Work_Type,
			    Description: Description,
				Allocation_Type,
            };

            tableData.push(allocationData);

            var formData = {
                Allocations: tableData
		};

		$.ajax({
			url: baseurl + 'Allocation/Assign',
			type: 'POST',
			data: JSON.stringify(formData),
			contentType: 'application/json',
			success: function (response) {
				var responseData = JSON.parse(response);

			}
		})





	})




















})