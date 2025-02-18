$(document).ready(function () {
	$(".selectpicker").selectpicker();

	$("#Employee_Work_Status").on("click", function () {
		var JobCardNo = $("#JobCardNo").val();
		var Department = $("#Department").val();
		var Shift = $("#Shift").val();
		var Date = $("#Date").val();
		var Machine = $("#Machine").val();
		$.ajax({
			url: baseurl + "Work_Master/Get_Employee_Work_Details",
			type: "POST",
			data: {
				Department: Department,
				JobCardNo: JobCardNo,
				Shift: Shift,
				Date: Date,
				Machine: Machine,
			},
			success: function (response) {
				var responseData = JSON.parse(response);
				$("#Employee_Power_Table").empty();

				var Get_Employee_Name = responseData.Get_Employee_Work_Details;
				var Get_Machine_No = responseData.Get_Machine_No;

				$.each(Get_Employee_Name, function (index, item) {
					var row = `<tr>
                                <td>${index + 1}</td>
                                <td>${item.EmpNo}</td>
                                <td>${item.FirstName}</td>
                                <td>${item.Machine_Id}</td>
                                <td>
                                    <div class="progress">
                                        <div class="progress-bar bg-warning" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </td>
                              
                               </tr>`;

					$("#Work_Status_Employee").append(row);
				});
			},
		});
	});

	$("#Get_Power_Employee").on("click", function () {
		var JobCardNo = $("#JobCardNo").val();
		var Department = $("#Department").val();
		var Shift = $("#Shift").val();
		var Date = $("#Date").val();
		var Machine = $("#Machine").val();
		$.ajax({
			url: baseurl + "Work_Master/Get_Employee_Work_Details",
			type: "POST",
			data: {
				Department: Department,
				JobCardNo: JobCardNo,
				Shift: Shift,
				Date: Date,
				Machine: Machine,
			},
			success: function (response) {
				var responseData = JSON.parse(response);
				$("#Employee_Power_Table").empty();

				var Get_Employee_Name = responseData.Get_Employee_Work_Details;
				var Get_Machine_No = responseData.Get_Machine_No;

				$.each(Get_Employee_Name, function (index, item) {
					var row = `<tr>
                                <td>${index + 1}</td>
                                <td>${item.Date}</td>
                                <td>${item.EmpNo}</td>
                                <td>${item.FirstName}</td>
                                <td>${item.Machine_Id}</td>
                                <td><input type="number" id="Power" class="form-control"></td>
                                <td><input type="number" id="Power" class="form-control"></td>
                                <td><input type="number" id="Power" class="form-control"></td>

                               </tr>`;

					$("#Employee_Power_Table").append(row);
				});
			},
		});
	});

	$("#Machine").on("change", function () {
		var JobCardNo = $("#JobCardNo").val();
		var Department = $("#Department").val();
		var Sub_Department = $("#sub_Department").val();
		var Shift = $("#Shift").val();
		var Date = $("#Date").val();

		$.ajax({
			url: baseurl + "Work_Master/Get_Employee_Name",
			type: "POST",
			data: {
				Department: Department,
				Sub_Department: Sub_Department,
				JobCardNo: JobCardNo,
				Shift: Shift,
				Date: Date,
			},
			success: function (response) {
				var responseData = JSON.parse(response);
				var Employee_Data = responseData.Get_Employee_Name;
				var Get_Machine_No = responseData.Get_Machine_No;

				var Employee_Name = {};

				for (var i = 0; i < Employee_Data.length; i++) {
					var DName = Employee_Data[i];
					Employee_Name[DName.EmpNo] = DName.FirstName;
				}

				$("#Employee_Name")
					.empty()
					.append($("<option></option>").attr("value", "").text("---Select--"));

				$.each(Employee_Name, function (key, value) {
					$("#Employee_Name").append(
						$("<option></option>").attr("value", key).text(value)
					);
				});

				var Machine_Id = {};

				for (var i = 0; i < Get_Machine_No.length; i++) {
					var DName = Get_Machine_No[i];
					Machine_Id[DName.Machine_Id] = DName.Machine_Id;
				}

				$("#Machine_Id")
					.empty()
					.append($("<option></option>").attr("value", "").text("---Select---"))
					.append($("<option></option>").attr("value", "NoWork").text("NoWork"))
					.append(
						$("<option></option>").attr("value", "Others").text("Others")
					);

				$.each(Machine_Id, function (key, value) {
					$("#Machine_Id").append(
						$("<option></option>").attr("value", key).text(value)
					);
				});
			},
		});
	});

	$("#Machine_L").on("change", function () {
		var JobCardNo = $("#JobCardNo").val();
		var Department = $("#Department").val();
		var Sub_Department = $("#sub_Department").val();
		var Shift = $("#Shift").val();
		var Date = $("#Date").val();

		$.ajax({
			url: baseurl + "Work_Master/Get_Late_Employee_Name",
			type: "POST",
			data: {
				Department: Department,
				Sub_Department: Sub_Department,
				JobCardNo: JobCardNo,
				Shift: Shift,
				Date: Date,
			},
			success: function (response) {
				var responseData = JSON.parse(response);
				var Employee_Data = responseData.Get_Employee_Name;
				var Get_Machine_No = responseData.Get_Machine_No;

				var Employee_Name = {};

				for (var i = 0; i < Employee_Data.length; i++) {
					var DName = Employee_Data[i];
					Employee_Name[DName.EmpNo] = DName.FirstName;
				}

				$("#Employee_Names")
					.empty()
					.append(
						$("<option></option>").attr("value", "").text("Select this option")
					);

				$.each(Employee_Name, function (key, value) {
					$("#Employee_Names").append(
						$("<option></option>").attr("value", key).text(value)
					);
				});

				var Machine_Id = {};

				for (var i = 0; i < Get_Machine_No.length; i++) {
					var DName = Get_Machine_No[i];
					Machine_Id[DName.Machine_Id] = DName.Machine_Id;
				}

				$("#Machine_Id")
					.empty()
					.append($("<option></option>").attr("value", "").text("---Select---"))
					.append($("<option></option>").attr("value", "NoWork").text("NoWork"))
					.append(
						$("<option></option>").attr("value", "Others").text("Others")
					);

				$.each(Machine_Id, function (key, value) {
					$("#Machine_Id").append(
						$("<option></option>").attr("value", key).text(value)
					);
				});
			},
		});
	});

	$("#Assign_Employee").on("click", function () {
		var JobCardNo = $("#JobCardNo").val();
		var Department = $("#Department").val();
		var Sub_Department = $("#sub_Department").val();
		var Shift = $("#Shift").val();
		var Date = $("#Date").val();
		var Employee_Name = $("#Employee_Name").val();
		var Machine_Id = $("#Machine_Id").val();
		var Machine_Name = $("#Machine").val();
		var Frame = $("#Frame").val();
		var Description = $("#Description").val();

		// First AJAX call to Work_Allocation
		$.ajax({
			url: baseurl + "Work_Master/Work_Allocation",
			type: "POST",
			data: {
				Department: Department,
				Sub_Department: Sub_Department,
				JobCardNo: JobCardNo,
				Shift: Shift,
				Date: Date,
				Employee_Name: Employee_Name,
				Machine_Id: Machine_Id,
				Machine_Name: Machine_Name,
				Frame: Frame,
				Description: Description,
			},
			success: function (response) {
				// Parse the response from Work_Allocation
				var responseData = JSON.parse(response);

				if (responseData.status == "success") {
					swal("Approved!", "Your Approval has been Updated.", "success");
				}

				// Second AJAX call to Assign_Employee
				$.ajax({
					url: baseurl + "Work_Master/Assign_Employee",
					type: "POST",
					data: {
						Department: Department,
						Sub_Department: Sub_Department,
						JobCardNo: JobCardNo,
						Shift: Shift,
						Date: Date,
						Employee_Name: Employee_Name,
						Machine_Id: Machine_Id,
						Machine_Name: Machine_Name,
					},
					success: function (response) {
						// Parse the Assign_Employee response
						var assignData = JSON.parse(response);
						var Assign_Employee = assignData.Assign_Employee;
						var tableRows = "";

						// Generate HTML for each employee row
						$.each(Assign_Employee, function (index, item) {
							tableRows += `<tr>
											<td>${index + 1}</td>
											<td>${item.DeptName}</td>
											<td>${item.Sub_Department}</td>
											<td>${item.Job_Card_No}</td>
											<td>${item.EmpNo}</td>
											<td>${item.FirstName}</td>
											<td>${item.Machine_Id}</td>
											<td>${item.Machine_Name}</td>
										  </tr>`;
						});

						// Update the table in one go
						$("#Employee_Assign_Table").html(tableRows);

						// Third AJAX call to Get_Employee_Name (to update dropdown options)
						$.ajax({
							url: baseurl + "Work_Master/Get_Employee_Name",
							type: "POST",
							data: {
								Department: Department,
								Sub_Department: Sub_Department,
								JobCardNo: JobCardNo,
								Shift: Shift,
								Date: Date,
							},
							success: function (response) {
								var empResponse = JSON.parse(response);
								var Employee_Data = empResponse.Get_Employee_Name;
								var Get_Machine_No = empResponse.Get_Machine_No;

								// Populate Employee_Name dropdown
								$("#Employee_Name")
									.empty()
									.append(
										$("<option></option>")
											.attr("value", "")
											.text("Select this option")
									);

								$.each(Employee_Data, function (index, emp) {
									$("#Employee_Name").append(
										$("<option></option>")
											.attr("value", emp.EmpNo)
											.text(emp.FirstName)
									);
								});

								$("#Frame").empty();
								$("Description").empty();

								// Clear existing Machine_Id options
								$("#Machine_Id")
									.empty()
									.append(
										$("<option></option>")
											.attr("value", "")
											.text("Select this option")
									)
									.append(
										$("<option></option>")
											.attr("value", "NoWork")
											.text("NoWork")
									)
									.append(
										$("<option></option>")
											.attr("value", "Others")
											.text("Others")
									);

								// Populate Machine_Id dropdown without duplicates
								$.each(Get_Machine_No, function (index, machine) {
									// Check if the machine is already in the dropdown
									if (
										$("#Machine_Id option[value='" + machine.Machine_Id + "']")
											.length === 0
									) {
										$("#Machine_Id").append(
											$("<option></option>")
												.attr("value", machine.Machine_Id)
												.text(machine.Machine_Id)
										);
									}
								});
							},
							error: function (jqXHR, textStatus, errorThrown) {
								console.error(
									"Error in Get_Employee_Name request:",
									textStatus,
									errorThrown
								);
							},
						});
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.error(
							"Error in Assign_Employee request:",
							textStatus,
							errorThrown
						);
					},
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(
					"Error in Work_Allocation request:",
					textStatus,
					errorThrown
				);
			},
		});
	});

	//Late Employee Assign
	$("#Department").on("change", function () {
		var Department = $("#Department").val();
		var Shift = $("#Shift").val();
		var Date = $("#Date").val();

		$.ajax({
			url: baseurl + "Work_Master/Get_Employee",
			type: "POST",
			data: {
				Department: Department,
				Shift: Shift,
				Date: Date,
			},
			success: function (response) {
				var responseData = JSON.parse(response);
				var EmpNo = {};

				for (var i = 0; i < responseData.length; i++) {
					var DName = responseData[i];
					EmpNo[DName.EmpNo] = DName.FirstName;
				}

				$("#Employee_Names")
					.empty()
					.append(
						$("<option></option>").attr("value", "").text("Select this option")
					);

				$.each(EmpNo, function (key, value) {
					$("#Employee_Names").append(
						$("<option></option>").attr("value", key).text(value)
					);
				});

				var Department = $("#Department").val();
				var Shift = $("#Shift").val();
				var Date = $("#Date").val();

				$.ajax({
					url: baseurl + "Work_Master/Late_Employee_List",
					type: "POST",
					data: {
						Department: Department,
						Shift: Shift,
						Date: Date,
					},
					success: function (response) {
						var responseData = JSON.parse(response);

						updateLateEmployeeList(response);

						if (responseData.status == "success") {
							swal("Approved!", "Your Approval has been Updated.", "success");
						}

						$.ajax({
							url: baseurl + "Work_Master/Get_Employee_Name",
							type: "POST",
							data: {
								Department: Department,
								Sub_Department: Sub_Department,
								JobCardNo: JobCardNo,
								Shift: Shift,
								Date: Date,
							},
							success: function (response) {
								var empResponse = JSON.parse(response);
								var Employee_Data = empResponse.Get_Employee_Name;
								var Get_Machine_No = empResponse.Get_Machine_No;

								// Populate Employee_Name dropdown
								$("#Employee_Name")
									.empty()
									.append(
										$("<option></option>")
											.attr("value", "")
											.text("Select this option")
									);

								$.each(Employee_Data, function (index, emp) {
									$("#Employee_Name").append(
										$("<option></option>")
											.attr("value", emp.EmpNo)
											.text(emp.FirstName)
									);
								});

								// Populate Machine_Id dropdown
								$("#Machine_Id")
									.empty()
									.append(
										$("<option></option>")
											.attr("value", "")
											.text("Select this option")
									)
									.append(
										$("<option></option>")
											.attr("value", "NoWork")
											.text("NoWork")
									)
									.append(
										$("<option></option>")
											.attr("value", "Others")
											.text("Others")
									);

								$.each(Get_Machine_No, function (index, machine) {
									$("#Machine_Id").append(
										$("<option></option>")
											.attr("value", machine.Machine_Id)
											.text(machine.Machine_Id)
									);
								});
							},
							error: function (jqXHR, textStatus, errorThrown) {
								console.error(
									"Error in Get_Employee_Name request:",
									textStatus,
									errorThrown
								);
							},
						});
					},
					error: function (error) {
						console.error("Error fetching late employee list:", error);
					},
				});

				// Function to update the late employee list
				function updateLateEmployeeList(response) {
					var responseData = JSON.parse(response);
					var Late_Employee_List = responseData.Late_Employee_List;
					var tableRows = "";

					$.each(Late_Employee_List, function (index, item) {
						tableRows += `<tr>
										<td>${index + 1}</td>
										<td>${item.Department}</td>
										<td>${item.FirstName}</td>
										<td>${item.EmpNo}</td>
										<td>${item.PunchTime}</td>
										<td>${item.Reason}</td>
										
									  </tr>`;
					});

					$("#Late_Employee_List").html(tableRows);

					// Event handler for approving late employees
					$("#Late_Employee_List")
						.off("click", ".sa-warning")
						.on("click", ".sa-warning", function () {
							var empId = $(this).data("emp-id");
							var department = $(this).data("department");
							var Shift = $("#Shift").val();
							var Date = $("#Date").val();

							swal({
								title: "Are you sure?",
								text: "You won't be able to revert this!",
								type: "warning",
								showCancelButton: true,
								confirmButtonClass: "btn btn-success",
								cancelButtonClass: "btn btn-danger",
								confirmButtonText: "Yes, Approve it!",
							}).then((willApprove) => {
								if (willApprove) {
									$.ajax({
										url: baseurl + "Work_Master/Late_Approved",
										type: "POST",
										data: {
											empId: empId,
											department: department,
											Shift: Shift,
											Date: Date,
										},
										success: function (response) {
											if (response == 1) {
												swal(
													"Approved!",
													"Your Approval has been Updated.",
													"success"
												);
												refreshLateEmployeeList();
											} else {
												swal(
													"Error!",
													"There was a problem updating the status.",
													"error"
												);
											}
										},
										error: function (error) {
											swal(
												"Error!",
												"There was a problem updating the status.",
												"error"
											);
										},
									});
								} else {
									swal("Cancelled", "The operation was cancelled.", "info");
								}
							});
						});
				}

				// Function to refresh the late employee list
				function refreshLateEmployeeList() {
					var Department = $("#Department").val();
					var Shift = $("#Shift").val();
					var Date = $("#Date").val();

					$.ajax({
						url: baseurl + "Work_Master/Late_Employee_List",
						type: "POST",
						data: {
							Department: Department,
							Shift: Shift,
							Date: Date,
						},
						success: function (response) {
							updateLateEmployeeList(response);
						},
						error: function (error) {
							console.error("Error refreshing late employee list:", error);
						},
					});
				}
			},
		});
	});

	$("#Frame_Cols").hide();

	$("#Machine_Id").on("change", function () {
		var Department = $("#Department").val();
		var WorkArea = $("#sub_Department").val();
		var Machine_Id = $("#Machine_Id").val();
		var Machine_Name = $("#Machine").val();

		$.ajax({
			url: baseurl + "Work_Master/Machine_Frames",
			type: "POST",
			data: {
				Department: Department,
				WorkArea: WorkArea,
				Machine_Id: Machine_Id,
				Machine_Name: Machine_Name,
			},
			success: function (response) {
				var responseData = JSON.parse(response);
				var Machine_Frames = responseData.Machine_Frames;

				if (Machine_Id == "") {
					$("#Frame").empty();
					$("#Frame").append(
						$("<option></option>").attr("value", "").text("--Select Frame--")
					);
					return;
				}

				if (Machine_Id == "NoWork" || Machine_Id == "Others") {
					$("#Frame_Col").hide();
					$("#Frame_Cols").show();
					return;
				} else {
					$("#Frame_Col").show();
					$("#Frame_Cols").hide();
				}

				$.each(Machine_Frames, function (index, frameData) {
					var optionText = frameData.Machine_Id + "    " + frameData.Frame;
					var optionValue = frameData.Machine_Id;
					$("#Frame").append(
						$("<option></option>")
							.attr(optionValue, optionValue)
							.text(optionText)
					);
				});
			},
			error: function (error) {
				console.error("Error retrieving machine frames:", error);
			},
		});
	});

	$("#Late_Employee").on("click", function () {
		var Department = $("#Department").val();
		var Shift = $("#Shift").val();
		var Date = $("#Date").val();
		var Employee_Id = $("#Employee_Names").val();
		var Reason = $("#Type").val();
		var JobCardNo = $("#JobCardNo").val();
		var Department = $("#Department").val();
		var Sub_Department = $("#sub_Department").val();
		var Shift = $("#Shift").val();
		var Date = $("#Date").val();
		var Employee_Name = $("#Employee_Names").val();
		var Machine_Id = $("#Machine_Id").val();
		var Machine_Name = $("#Machine").val();
		var Frame = $("#Frame").val();

		$.ajax({
			url: baseurl + "Work_Master/Late_Employee",
			type: "POST",
			data: {
				Department: Department,
				Shift: Shift,
				Date: Date,
				Employee_Id: Employee_Id,
				Reason: Reason,
				Department: Department,
				Sub_Department: Sub_Department,
				JobCardNo: JobCardNo,
				Shift: Shift,
				Date: Date,
				Employee_Name: Employee_Name,
				Machine_Id: Machine_Id,
				Machine_Name: Machine_Name,
				Frame: Frame,
			},
			success: function (response) {
				var responseData = JSON.parse(response);

				if (responseData == "error") {
					swal("Error!", "This Employee Already Work Allocated.", "error");
				} else {
					swal("Success!", "Employee Work Allocated Successfully.", "success");
					refreshLateEmployeeList();
				}
			},
			error: function (error) {
				console.error("Error submitting late employee:", error);
			},
		});

		// Function to refresh the late employee list
		function refreshLateEmployeeList() {
			var Department = $("#Department").val();
			var Shift = $("#Shift").val();
			var Date = $("#Date").val();

			$.ajax({
				url: baseurl + "Work_Master/Late_Employee_List",
				type: "POST",
				data: {
					Department: Department,
					Shift: Shift,
					Date: Date,
				},
				success: function (response) {
					var responseData = JSON.parse(response);
					var Late_Employee_List = responseData.Late_Employee_List;
					var tableRows = "";

					$.each(Late_Employee_List, function (index, item) {
						tableRows += `<tr>
										<td>${index + 1}</td>
										<td>${item.Department}</td>
										<td>${item.FirstName}</td>
										<td>${item.EmpNo}</td>
										<td>${item.PunchTime}</td>
										<td>${item.Reason}</td>
										
									  </tr>`;
					});

					$("#Late_Employee_List").html(tableRows);
					bindConfirmButton();
				},
				error: function (error) {
					console.error("Error fetching late employee list:", error);
				},
			});
		}

	
	});
});
