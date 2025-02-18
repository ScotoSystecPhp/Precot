$(document).ready(function () {



	$.ajax({
		type: "POST",
		url: baseurl + "Grade_Master/Chart_Fro_Attendance_Grade",
		success: function(data) {
			// Log the raw response data to check its structure
			console.log(data);

			try {
				var responseData = JSON.parse(data);
					if (Array.isArray(responseData.Attendance_List)) {
					const Attendance_List = responseData.Attendance_List;

					const gradeCount = {
						'A': 0,
						'A+': 0,
						'B': 0,
						'B+': 0,
						'C': 0,
						'T': 0,
						'N': 0
					};

					const gradeColors = {
						'A': 'rgb(61, 252, 61)',   // Green for A
						'A+': 'rgb(61, 252, 61)',  // Green for A+
						'B': 'rgb(254, 235, 63)', // Orange for B
						'B+': 'rgb(254, 235, 63)',// Orange for B+
						'C': 'rgb(255, 62, 62)',   // Red for C
						'T': 'rgb(188, 188, 188)', // Gray for Trainee
						'N': 'rgb(188, 188, 188)' // Gray for New
					};

					// Loop through the attendance list to count the grades
					Attendance_List.forEach(employee => {
						if (employee.Grade && gradeCount[employee.Grade] !== undefined) {
							gradeCount[employee.Grade]++;
						} else {
							console.warn(`Invalid or missing grade for employee: ${employee.FirstName}`);
						}
					});

					// Prepare data for the chart
					const dataForChart = {
						labels: ['A', 'A+', 'B', 'B+', 'C', 'Traine', 'New'],
						datasets: [{
							label: 'Employee Grade Distribution',
							data: [
								gradeCount['A'],
								gradeCount['A+'],
								gradeCount['B'],
								gradeCount['B+'],
								gradeCount['C'],
								gradeCount['T'],
								gradeCount['N']
							],
							backgroundColor: [
								gradeColors['A'],
								gradeColors['A+'],
								gradeColors['B'],
								gradeColors['B+'],
								gradeColors['C'],
								gradeColors['T'],
								gradeColors['N']
							],
							borderColor: [
								gradeColors['A'],
								gradeColors['A+'],
								gradeColors['B'],
								gradeColors['B+'],
								gradeColors['C'],
								gradeColors['T'],
								gradeColors['N']
							],
							borderWidth: 1
						}]
					};

					const options = {
						responsive: true,
						scales: {
							y: {
								beginAtZero: true
							}
						}
					};

					const ctx = document.getElementById('myBarChart').getContext('2d');
					const myBarChart = new Chart(ctx, {
						type: 'bar',  // Type of chart
						data: dataForChart,   // Data for the chart
						options: options // Configuration options
					});

				} else {
					console.error("Attendance_List is missing or not an array");
				}

			} catch (error) {
				console.error("Error parsing response data or creating chart:", error);
			}
		},
		error: function(xhr, status, error) {
			console.error("Error fetching data:", error);
		}
	});



// $.ajax({
//     type: "POST",
//     url: baseurl + "Grade_Master/All_Status",
//     success: function(data) {
//         // Log the raw response data to check its structure
//         console.log(data);

//         try {
//             var responseData = JSON.parse(data);

//             // Check if All_Status is an array
//             if (Array.isArray(responseData.All_Status)) {
//                 const Attendance_List = responseData.All_Status;

//                 // Initialize the status counters
//                 const statusCount = {
//                     'ACTIVE': 0,
//                     'INACTIVE': 0,
//                     'TRAINEE': 0,
//                     'NEW': 0,
//                     'EXPERIENCED': 0
//                 };

//                 // Status colors mapping
//                 const statusColors = {
//                     'ACTIVE': 'rgb(61, 252, 61)',   // Green for ACTIVE
//                     'INACTIVE': 'rgb(255, 62, 62)', // Red for INACTIVE
//                     'TRAINEE': 'rgb(255, 165, 0)',  // Orange for TRAINEE
//                     'NEW': 'rgb(0, 123, 255)',      // Blue for NEW
//                     'EXPERIENCED': 'rgb(66, 66, 66)' // Gray for EXPERIENCED
//                 };

//                 // Loop through the attendance list to count the statuses
//                 Attendance_List.forEach(employee => {
//                     // Ensure the employee has a valid status and it's part of statusCount
//                     if (employee.Status && statusCount[employee.Status] !== undefined) {
//                         statusCount[employee.Status]++;
//                     } else {
//                         console.warn(`Invalid or missing status for employee: ${employee.FirstName}`);
//                     }
//                 });

//                 // Prepare data for the chart
//                 const dataForChart = {
//                     labels: ['ACTIVE', 'INACTIVE', 'TRAINEE', 'NEW', 'EXPERIENCED'],
//                     datasets: [{
//                         label: 'Employee Status Distribution',
//                         data: [
//                             statusCount['ACTIVE'],
//                             statusCount['INACTIVE'],
//                             statusCount['TRAINEE'],
//                             statusCount['NEW'],
//                             statusCount['EXPERIENCED']
//                         ],
//                         backgroundColor: [
//                             statusColors['ACTIVE'],
//                             statusColors['INACTIVE'],
//                             statusColors['TRAINEE'],
//                             statusColors['NEW'],
//                             statusColors['EXPERIENCED']
//                         ],
//                         borderColor: [
//                             statusColors['ACTIVE'],
//                             statusColors['INACTIVE'],
//                             statusColors['TRAINEE'],
//                             statusColors['NEW'],
//                             statusColors['EXPERIENCED']
//                         ],
//                         borderWidth: 1
//                     }]
//                 };

//                 // Chart options to make it responsive
//                 const options = {
//                     responsive: true,
//                     scales: {
//                         y: {
//                             beginAtZero: true
//                         }
//                     }
//                 };

//                 // Get the context of the canvas and create the chart
//                 const ctx = document.getElementById('myBarChart1').getContext('2d');
//                 const myBarChart = new Chart(ctx, {
//                     type: 'bar',  // Type of chart
//                     data: dataForChart,   // Data for the chart
//                     options: options // Configuration options
//                 });

//             } else {
//                 console.error("All_Status is missing or not an array");
//             }

//         } catch (error) {
//             console.error("Error parsing response data or creating chart:", error);
//         }
//     },
//     error: function(xhr, status, error) {
//         console.error("Error fetching data:", error);
//     }
// });




	// index Page Section

	$("#Inactive").hide();
	$("#Inactive1").hide();
	$("#Trainee").hide();
	$("#Day_Wise_Visible").hide();

	$("#Card_InActives").hide();
	$("#Card_Active").hide();
	$("#Card_Traniee").hide();
	$("#Card_OnRoll").hide();
	$("#OnRoll_Day_Wise_Visible").hide();

	$("#Employee_Attendance_List_Grade").hide();

	$("#Employee_Status").on("change", function () {
		$("#Card_InActives").hide();
		$("#Card_Active").hide();
		$("#Card_Traniee").hide();
		$("#Card_OnRoll").hide();
		$("#Card_OnRoll").hide();
		$("#OnRoll_Day_Wise_Visible").hide();

		$("#Inactive").hide();
		$("#Inactive1").hide();
		$("#Trainee").hide();

		var Department = $("#Department").val();
		var Employee_Status = $("#Employee_Status").val();

		if (Employee_Status == "InActive") {
			$("#Button_Hide").hide();
			$("#Inactive").show();
			$("#Inactive1").show();
			$("#Day_Wise_Visible").show();
			$("#Card_InActives").show();
			$("#OnRoll_Day_Wise_Visible").hide();
		} else if (Employee_Status == "Active") {
			$("#Inactive").hide();
			$("#Inactive1").hide();
			$("#Day_Wise_Visible").hide();
			$("#Button_Hide").show();
			$("#OnRoll_Day_Wise_Visible").hide();
		} else if (Employee_Status == "Traniee") {
			$("#Inactive").hide();
			$("#Inactive1").hide();
			$("#Trainee").show();
			$("#Day_Wise_Visible").hide();
			$("#Button_Hide").show();
			$("#OnRoll_Day_Wise_Visible").hide();
		} else if (Employee_Status == "OnRoll") {
			// Show the 'From Date' and 'To Date' fields when 'OnRoll' is selected
			$("#Inactive").show();
			$("#Inactive1").show();
			$("#Card_OnRoll").show();

			// $("#Inactive").hide();
			// $("#Inactive1").hide();
			$("#Day_Wise_Visible").hide();
			$("#Button_Hide").hide();
			$("#OnRoll_Day_Wise_Visible").show();
		}
	});

	//Card Hide Section
	$("#Card_InActive").hide();
	$("#Card_Active").hide();

	$("#Employee_Statuss").on("click", function () {
		var Department = $("#Department").val();
		var Employee_Status = $("#Employee_Status").val();

		if (Employee_Status == "Active") {
			$("#Card_InActive").hide();
			$("#Card_Active").show();

			$.ajax({
				type: "POST",
				url: baseurl + "Grade_Master/Active",
				data: {
					Department: Department,
					Employee_Status: Employee_Status,
				},
				success: function (response) {
					var responseData = JSON.parse(response);
					$("#Active_Employee").empty();

					if (responseData.Active_Employee_List.length == 0) {
						$("#Card_Active").hide();

						swal({
							title: "Error!",
							text: "Details Not Found. Please check if the information exists in the database or try again later.",
							icon: "error",
							buttons: true,
							className: "swal-small", // Custom class for small size
						});
					} else {
						if ($.fn.dataTable.isDataTable(".table")) {
							$(".table").DataTable().clear().destroy();
						}

						var Active_Employee_List = responseData.Active_Employee_List;

						$.each(Active_Employee_List, function (index, item) {
							var badgeColor = item.IsActive ? "green" : "red";
							var badgeText = item.IsActive ? "Active" : "In Active";

							var row = `<tr>
								<td>${index + 1}</td>
								<td>${item.DeptName}</td>
								<td>${item.DOJ}</td>
								<td>${item.FirstName}</td>
								<td>${item.MachineID}</td>
								<td>${item.EmployeeMobile}</td>
								<td>
									<span style="background-color: ${badgeColor}; color: white; padding: 5px 10px; border-radius: 5px;">
										${badgeText}
									</span>
								</td>
								<td>${
									item.ExperienceYears
								} Years</td> <!-- Displaying the calculated experience -->
								<td>${
									item.ExperienceFormatted
								} Months</td> <!-- Displaying the calculated experience
							</tr>`;

							$("#Active_Employee").append(row);
						});

						var table = $(".table").DataTable({
							paging: true,
							ordering: true,
							info: true,
							searching: true,
							responsive: true

						});
					}
				},
				success: function (response) {
					var responseData = JSON.parse(response);
					$("#Active_Employee").empty();

					if (responseData.Active_Employee_List.length == 0) {
						$("#Card_Active").hide();

						swal({
							title: "Error!",
							text: "Details Not Found. Please check if the information exists in the database or try again later.",
							icon: "error",
							buttons: true,
							className: "swal-small", // Custom class for small size
						});
					} else {
						if ($.fn.dataTable.isDataTable(".table")) {
							$(".table").DataTable().clear().destroy();
						}

						var Active_Employee_List = responseData.Active_Employee_List;

						$.each(Active_Employee_List, function (index, item) {
							var badgeColor = item.IsActive ? "green" : "red";
							var badgeText = item.IsActive ? "Active" : "In Active";

							// Ensure the Experience is calculated and formatted as 'X Years Y Months'
							var experienceFormatted = item.ExperienceFormatted || "N/A"; // Example: '1 Years 6 Months'

							var row = `<tr>
								<td>${index + 1}</td>
								<td>${item.DeptName}</td>
								<td>${item.DOJ}</td>
								<td>${item.FirstName}</td>
								<td>${item.MachineID}</td>
			                    <td>${experienceFormatted}</td> <!-- Displaying the calculated experience in 'X Years Y Months' format -->

								<td>${item.EmployeeMobile}</td>
								<td>
									<span style="background-color: ${badgeColor}; color: white; padding: 5px 10px; border-radius: 5px;">
										${badgeText}
									</span>
								</td>
							</tr>`;

							$("#Active_Employee").append(row);
						});

						var table = $(".table").DataTable({
							paging: true,
							ordering: true,
							info: true,
							searching: true,
							responsive: true

						});
					}
				},
			});
		} else if (Employee_Status == "InActive") {
			$("#Card_InActive").show();
			$("#Card_Active").hide();

			var FromDate = $("#Fdate").val();
			var ToDate = $("#Tdate").val();

			$.ajax({
				type: "POST",
				url: baseurl + "Grade_Master/InActive",
				data: {
					Department: Department,
					Employee_Status: Employee_Status,
					FromDate: FromDate,
					ToDate: ToDate,
				},
				success: function (response) {
					$("#InActive_Employee").empty();

					var responseData = JSON.parse(response);
					var InActiveEmployee_List = responseData.InActiveEmployee_List;

					if (responseData.InActiveEmployee_List.length == 0) {
						$("#Card_InActive").hide();

						swal({
							title: "Error!",
							text: "Details Not Found. Please check if the information exists in the database or try again later.",
							icon: "error",
							buttons: true,
							className: "swal-small", // Custom class for small size
						});
					} else {
						if ($.fn.dataTable.isDataTable(".table")) {
							$(".table").DataTable().clear().destroy();
						}

						$.each(InActiveEmployee_List, function (index, item) {
							if (item.IsActive == "No") {
								var badgeColor = "red";
								var badgeText = "In Active";

								// Ensure that ExperienceFormatted is passed from backend
								var experienceFormatted = item.ExperienceFormatted || "N/A"; // Example: '1 Years 6 Months'

								var row = `<tr>
									<td>${index + 1}</td>
									<td>${item.DeptName}</td>
									<td>${item.DOJ}</td>
									<td>${item.DOR}</td>
									<td>${item.FirstName}</td>
									<td>${item.MachineID}</td>
									<td>${experienceFormatted}</td> <!-- Displaying experience in 'X Years Y Months' format -->
									<td>${item.EmployeeMobile}</td>
									<td>
										<span style="background-color: ${badgeColor}; color: white; padding: 5px 10px; border-radius: 5px;">
											${badgeText}
										</span>
									</td>

								</tr>`;

								$("#InActive_Employee").append(row);
							}
						});

						// Reinitialize the DataTable
						var table = $(".table").DataTable({
							paging: true,
							ordering: true,
							info: true,
							searching: true,
							responsive: true

						});
					}
				},
			});
		} else if (Employee_Status == "Traniee") {
			var Department = $("#Department").val();
			var Employee_Status = $("#Employee_Status").val();
			var TaineeMonth = $("#TaineeMonth").val();

			$.ajax({
				type: "POST",
				url: baseurl + "Grade_Master/Trainee",
				data: {
					Department: Department,
					Employee_Status: Employee_Status,
					TaineeMonth: TaineeMonth,
				},
				success: function (response) {
					$("#TraineeEmployee").empty();

					var responseData = JSON.parse(response);

					if (responseData.Trainee_Employee_List == 0) {
						$("#Card_Traniee").hide();

						swal({
							title: "Error!",
							text: "Details Not Found. Please check if the information exists in the database or try again later.",
							icon: "error",
							buttons: true,
							className: "swal-small", // Custom class for small size
						});
					} else {
						$("#Card_Traniee").show();

						if ($.fn.dataTable.isDataTable(".table")) {
							$(".table").DataTable().clear().destroy();
						}

						var Trainee_Employee_List = responseData.Trainee_Employee_List;

						$.each(Trainee_Employee_List, function (index, item) {
							// Format DOJ as DD-MM-YYYY
							var formattedDOJ = new Date(item.DOJ).toLocaleDateString("en-GB");

							var badgeColor = item.IsActive === "Yes" ? "green" : "red";
							var badgeText = item.IsActive === "Yes" ? "Active" : "In Active";

							var row = `<tr>
											<td>${index + 1}</td>
											<td>${item.DeptName}</td>
											<td>${formattedDOJ}</td>
											<td>${item.FirstName}</td>
											<td>${item.MachineID}</td>
											<td>${item.ExperienceFormatted}</td>
											<td>${item.EmployeeMobile}</td>
											<td class='text-center'>${item.Months_Active}</td>
											<td>
												<span style="background-color: ${badgeColor}; color: white; padding: 5px 10px; border-radius: 5px;">
													${badgeText}
												</span>
											</td>
										</tr>`;

							$("#TraineeEmployee").append(row);
						});

						var table = $(".table").DataTable({
							paging: true,
							ordering: true,
							info: true,
							searching: true,
							responsive: true

						});
					}
				},
			});
		} else if (Employee_Status == "OnRoll") {
			var Department = $("#Department").val();
			var Employee_Status = $("#Employee_Status").val();
			var FromDate = $("#Fdate").val();
			var ToDate = $("#Tdate").val();

			$.ajax({
				type: "POST",
				url: baseurl + "Grade_Master/OnRoll",
				data: {
					Department: Department,
					Employee_Status: Employee_Status,
					FromDate: FromDate,
					ToDate: ToDate,
				},
				success: function (response) {
					$("#OnrollEmployee").empty();

					var responseData = JSON.parse(response);

					if (responseData.OnRoll_Employee_List.length === 0) {
						$("#Card_OnRoll").hide();

						swal({
							title: "Error!",
							text: "No employees found with the given criteria.",
							icon: "error",
							buttons: true,
							className: "swal-small",
						});
					} else {
						$("#Card_OnRoll").show();

						if ($.fn.dataTable.isDataTable(".table")) {
							$(".table").DataTable().clear().destroy();
						}

						var OnRoll_Employee_List = responseData.OnRoll_Employee_List;

						$.each(OnRoll_Employee_List, function (index, item) {
							// Format DOJ and SixMonthsAfterDOJ as DD-MM-YYYY
							var formattedDOJ = new Date(item.DOJ).toLocaleDateString("en-GB");
							var formattedSixMonthsAfterDOJ = new Date(
								item.SixMonthsAfterDOJ
							).toLocaleDateString("en-GB");

							var badgeColor = item.IsActive === "Yes" ? "green" : "red";
							var badgeText = item.IsActive === "Yes" ? "Active" : "In Active";

							var row = `<tr>
										<td>${index + 1}</td>
										<td>${item.DeptName}</td>
										<td>${formattedDOJ}</td>
										<td>${item.FirstName}</td>
										<td>${item.MachineID}</td>
										<td>${item.ExperienceFormatted}</td>
										<td >${formattedSixMonthsAfterDOJ}</td>
										<td>${item.EmployeeMobile}</td>
										<td class='text-center'>${item.Months_Active}</td>


										<td>
											<span style="background-color: ${badgeColor}; color: white; padding: 5px 10px; border-radius: 5px;">
												${badgeText}
											</span>
										</td>
									</tr>`;

							$("#OnrollEmployee").append(row);
						});

						var table = $(".table").DataTable({
							paging: true,
							ordering: true,
							info: true,
							searching: true,
							responsive: true

						});
					}
				},
			});
		}
	});

	// -----------------------------------------Attendance - Sheet - Employee Details-----------------------------------------//

	var dataTableInitialized = false;

	$("#Attendance_Sheet_Tables").on("click", function () {
		var Department = $("#Department").val();

		$.ajax({
			type: "POST",
			url: baseurl + "Grade_Master/Attendance_Sheet",
			data: {
				Department: Department,
			},
			success: function (response) {
				$("#Attendance_Sheet_Table").empty();

				var responseData = JSON.parse(response);

				if (responseData.Attendance_List.length == 0) {
					$("#Card_Traniee").hide();
					$("#Employee_Attendance_List_Grade").hide();

					swal({
						title: "Error!",
						text: "Details Not Found. Please check if the information exists in the database or try again later.",
						icon: "error",
						buttons: true,
						className: "swal-small",
					});
				} else {
					$("#Employee_Attendance_List_Grade").show();

					// Data for the table
					var Attendance_List = responseData.Attendance_List;

					// Sort the list by ExistingCode
					Attendance_List.sort(function (a, b) {
						if (a.ExistingCode < b.ExistingCode) {
							return -1;
						}
						if (a.ExistingCode > b.ExistingCode) {
							return 1;
						}
						return 0;
					});

					// Function to render table rows
					function renderTable(filteredList) {
						var tableData = filteredList.map(function (item, index) {
							var badgeColor = "";

							// Determine badge color based on grade
							if (item.Grade === "A+" || item.Grade === "A") {
								badgeColor = "background-color: green; color: white;";
							} else if (item.Grade === "B+" || item.Grade === "B") {
								badgeColor = "background-color: orange; color: white;";
							} else if (item.Grade === "C") {
								badgeColor = "background-color: red; color: white;";
							} else if (item.Grade === "T") {
								badgeColor = "background-color: gray; color: white;";
							} else if (item.Grade === "N") {
								badgeColor = "background-color: white; color: black;";
							}

							return [
								index + 1,
								item.doj,
								item.ExistingCode,
								item.FirstName,
								item.WorkingMonths,
								item.Status,
								item.Average_Percentage + " %",
								`<span style="padding: 5px 10px; border-radius: 5px; ${badgeColor}">${item.Grade}</span>`,
							];
						});

						// If the DataTable is not initialized yet, initialize it
						if (!dataTableInitialized) {
							$(".table").DataTable({
								paging: true,
								ordering: true,
								info: true,
								searching: true,
								data: tableData,
								columns: [
									{ title: "#" },
									{ title: "Joining Date" },
									{ title: "Employee Id" },
									{ title: "Employee Name" },
									{ title: "Working Months" },
									{ title: "Status" },
									{ title: "Attendance Percentage" },
									{ title: "Employee Attendance Grade" },
								],
							});
							dataTableInitialized = true;
						} else {
							// If DataTable is already initialized, just update the rows
							var table = $(".table").DataTable();
							table.clear().rows.add(tableData).draw();
						}
					}

					renderTable(Attendance_List);

					// Event handler for "A Grade Group"
					$("#AGradeGroup").on("click", function () {
						var filteredList = Attendance_List.filter(function (item) {
							return item.Grade === "A" || item.Grade === "A+";
						});
						renderTable(filteredList);
					});

					// Event handler for "B Grade Group"
					$("#BGradegroup").on("click", function () {
						var filteredList = Attendance_List.filter(function (item) {
							return item.Grade === "B" || item.Grade === "B+";
						});
						renderTable(filteredList);
					});

					// Event handler for "C Grade Group"
					$("#CGradegroup").on("click", function () {
						var filteredList = Attendance_List.filter(function (item) {
							return item.Grade === "C";
						});
						renderTable(filteredList);
					});

					// Event handler for "Trainee Group"
					$("#TraineeGradegroup").on("click", function () {
						var filteredList = Attendance_List.filter(function (item) {
							return item.Grade === "T";
						});
						renderTable(filteredList);
					});

					// Event handler for "New Group"
					$("#NewGradegroup").on("click", function () {
						var filteredList = Attendance_List.filter(function (item) {
							return item.Grade === "N";
						});
						renderTable(filteredList);
					});

					// Event handler for "Default" button (view all data)
					$("#Default").on("click", function () {
						// Render the full data (no filters applied)
						renderTable(Attendance_List);
					});
				}
			},
		});
	});

	$("#JobCardNo").on("change", function () {
		var Date = $("#Date").val();
		var Department = $("#Department").val();
		var Shift = $("#Shift").val();
		var Sub_Department = $("#sub_Department").val();
		var JobCardNo = $("#JobCardNo").val();

		$.ajax({
			url: baseurl + "Work_Master/Shift_Employee",
			type: "POST",
			data: {
				Date: Date,
				Department: Department,
				Shift: Shift,
				Sub_Department: Sub_Department,
				JobCardNo: JobCardNo,
			},
			success: function (response) {
				var responseData = JSON.parse(response);

				$("#Shift_Employee_List").empty();

				// Destroy DataTable if it exists
				if ($.fn.dataTable.isDataTable(".table")) {
					$(".table").DataTable().clear().destroy();
				}

				var Shift_Employee = responseData.Shift_Employee;

				// Render table rows for Shift Employee
				$.each(Shift_Employee, function (index) {
					var row = `
					<tr>
						<td>${index + 1}</td>
						<td>${item.Sub_Department}</td>
						<td>${item.Job_Card_No}</td>
						<td>${item.EmpNo}</td>
						<td>${item.FirstName}</td>
					</tr>
				`;
					$("#Shift_Employee_List").append(row);
				});

				// Initialize DataTable after rendering the table
				$(".table").DataTable({
					paging: true,
					ordering: true,
					info: true,
					searching: true,
				});
			},

			error: function (xhr, status, error) {
				console.error("AJAX error: " + status + " - " + error);
			},
		});
	});

	// Inactive Employee List

	$("#Last_30").on("click", function () {
		var Department = $("#Department").val();

		$.ajax({
			url: baseurl + "Grade_Master/Last_thirdy",
			type: "POST",
			data: {
				Department: Department,
			},
			success: function (response) {
				$("#InActive_Employee").empty();

				var responseData = JSON.parse(response);
				var InActiveEmployee_List = responseData.Last_thirdy;

				if (InActiveEmployee_List.length == 0) {
					$("#Card_InActive").hide();

					swal({
						title: "Error!",
						text: "Details Not Found. Please check if the information exists in the database or try again later.",
						icon: "error",
						buttons: true,
						className: "swal-small", // Custom class for small size
					});
				} else {
					if ($.fn.dataTable.isDataTable(".table")) {
						$(".table").DataTable().clear().destroy();
					}

					$.each(InActiveEmployee_List, function (index, item) {
						if (item.IsActive == "No") {
							var badgeColor = "red";
							var badgeText = "In Active";

							// Ensure that ExperienceFormatted is passed from backend
							var experienceFormatted = item.ExperienceFormatted || "N/A"; // Example: '1 Years 6 Months'

							var row = `<tr>
								<td>${index + 1}</td>
								<td>${item.DeptName}</td>
								<td>${item.DOJ}</td>
								<td>${item.DOR}</td>
								<td>${item.FirstName}</td>
								<td>${item.MachineID}</td>
								<td>${item.Experience}</td>
								<td>${item.EmployeeMobile}</td>
								<td>
									<span style="background-color: ${badgeColor}; color: white; padding: 5px 10px; border-radius: 5px;">
										${badgeText}
									</span>
								</td>

							</tr>`;

							$("#InActive_Employee").append(row);
						}
					});

					// Reinitialize the DataTable
					var table = $(".table").DataTable({
						paging: true,
						ordering: true,
						info: true,
						searching: true,
					});
				}
			},
		});
	});

	$("#Last_60").on("click", function () {
		var Department = $("#Department").val();

		$.ajax({
			url: baseurl + "Grade_Master/Last_Sixty",
			type: "POST",
			data: {
				Department: Department,
			},
			success: function (response) {
				$("#InActive_Employee").empty();

				var responseData = JSON.parse(response);
				var InActiveEmployee_List = responseData.Last_Sixty;

				if (InActiveEmployee_List.length == 0) {
					$("#Card_InActive").hide();

					swal({
						title: "Error!",
						text: "Details Not Found. Please check if the information exists in the database or try again later.",
						icon: "error",
						buttons: true,
						className: "swal-small", // Custom class for small size
					});
				} else {
					if ($.fn.dataTable.isDataTable(".table")) {
						$(".table").DataTable().clear().destroy();
					}

					$.each(InActiveEmployee_List, function (index, item) {
						if (item.IsActive == "No") {
							var badgeColor = "red";
							var badgeText = "In Active";

							// Ensure that ExperienceFormatted is passed from backend
							var experienceFormatted = item.ExperienceFormatted || "N/A"; // Example: '1 Years 6 Months'

							var row = `<tr>
								<td>${index + 1}</td>
								<td>${item.DeptName}</td>
								<td>${item.DOJ}</td>
								<td>${item.DOR}</td>
								<td>${item.FirstName}</td>
								<td>${item.MachineID}</td>
								<td>${item.Experience}</td>
								<td>${item.EmployeeMobile}</td>
								<td>
									<span style="background-color: ${badgeColor}; color: white; padding: 5px 10px; border-radius: 5px;">
										${badgeText}
									</span>
								</td>

							</tr>`;

							$("#InActive_Employee").append(row);
						}
					});

					// Reinitialize the DataTable
					var table = $(".table").DataTable({
						paging: true,
						ordering: true,
						info: true,
						searching: true,
					});
				}
			},
		});
	});

	$("#Last_90").on("click", function () {
		var Department = $("#Department").val();

		$.ajax({
			url: baseurl + "Grade_Master/Last_Ninety",
			type: "POST",
			data: {
				Department: Department,
			},
			success: function (response) {
				$("#InActive_Employee").empty();

				var responseData = JSON.parse(response);
				var InActiveEmployee_List = responseData.Last_Ninety;

				if (InActiveEmployee_List.length == 0) {
					$("#Card_InActive").hide();

					swal({
						title: "Error!",
						text: "Details Not Found. Please check if the information exists in the database or try again later.",
						icon: "error",
						buttons: true,
						className: "swal-small", // Custom class for small size
					});
				} else {
					if ($.fn.dataTable.isDataTable(".table")) {
						$(".table").DataTable().clear().destroy();
					}

					$.each(InActiveEmployee_List, function (index, item) {
						if (item.IsActive == "No") {
							var badgeColor = "red";
							var badgeText = "In Active";

							// Ensure that ExperienceFormatted is passed from backend
							var experienceFormatted = item.ExperienceFormatted || "N/A"; // Example: '1 Years 6 Months'

							var row = `<tr>
								<td>${index + 1}</td>
								<td>${item.DeptName}</td>
								<td>${item.DOJ}</td>
								<td>${item.DOR}</td>
								<td>${item.FirstName}</td>
								<td>${item.MachineID}</td>
								<td>${item.Experience}</td>
								<td>${item.EmployeeMobile}</td>
								<td>
									<span style="background-color: ${badgeColor}; color: white; padding: 5px 10px; border-radius: 5px;">
										${badgeText}
									</span>
								</td>

							</tr>`;

							$("#InActive_Employee").append(row);
						}
					});

					// Reinitialize the DataTable
					var table = $(".table").DataTable({
						paging: true,
						ordering: true,
						info: true,
						searching: true,
					});
				}
			},
		});
	});

	// On Roll Employee List

	$("#On_Last_30").on("click", function () {
		var Department = $("#Department").val();

		$.ajax({
			url: baseurl + "Grade_Master/On_Last_thirdy",
			type: "POST",
			data: {
				Department: Department,
			},
			success: function (response) {
				$("#OnrollEmployee").empty();

				var responseData = JSON.parse(response);
				var OnRoll_Employee_List = responseData.On_Last_thirdy;

				if (OnRoll_Employee_List.length === 0) {
					$("#Card_OnRoll").hide();

					swal({
						title: "Error!",
						text: "No employees found with the given criteria.",
						icon: "error",
						buttons: true,
						className: "swal-small",
					});
				} else {
					$("#Card_OnRoll").show();

					if ($.fn.dataTable.isDataTable(".table")) {
						$(".table").DataTable().clear().destroy();
					}

					$.each(OnRoll_Employee_List, function (index, item) {
						// Format DOJ and SixMonthsAfterDOJ as DD-MM-YYYY
						var formattedDOJ = new Date(item.DOJ).toLocaleDateString("en-GB");
						var formattedSixMonthsAfterDOJ = new Date(
							item.SixMonthsAfterDOJ
						).toLocaleDateString("en-GB");

						var badgeColor = item.IsActive === "Yes" ? "green" : "red";
						var badgeText = item.IsActive === "Yes" ? "Active" : "In Active";

						var row = `<tr>
									<td>${index + 1}</td>
									<td>${item.DeptName}</td>
									<td>${formattedDOJ}</td>
									<td>${item.FirstName}</td>
									<td>${item.MachineID}</td>
									<td>${item.ExperienceFormatted}</td>
									<td >${formattedSixMonthsAfterDOJ}</td>
									<td>${item.EmployeeMobile}</td>
									<td class='text-center'>${item.Months_Active}</td>


									<td>
										<span style="background-color: ${badgeColor}; color: white; padding: 5px 10px; border-radius: 5px;">
											${badgeText}
										</span>
									</td>
								</tr>`;

						$("#OnrollEmployee").append(row);
					});

					var table = $(".table").DataTable({
						paging: true,
						ordering: true,
						info: true,
						searching: true,
					});
				}
			},
		});
	});

	$("#On_Last_60").on("click", function () {
		var Department = $("#Department").val();

		$.ajax({
			url: baseurl + "Grade_Master/On_Last_Sixty",
			type: "POST",
			data: {
				Department: Department,
			},
			success: function (response) {
				$("#OnrollEmployee").empty();

				var responseData = JSON.parse(response);
				var OnRoll_Employee_List = responseData.On_Last_Sixty;

				if (OnRoll_Employee_List.length === 0) {
					$("#Card_OnRoll").hide();

					swal({
						title: "Error!",
						text: "No employees found with the given criteria.",
						icon: "error",
						buttons: true,
						className: "swal-small",
					});
				} else {
					$("#Card_OnRoll").show();

					if ($.fn.dataTable.isDataTable(".table")) {
						$(".table").DataTable().clear().destroy();
					}

					$.each(OnRoll_Employee_List, function (index, item) {
						// Format DOJ and SixMonthsAfterDOJ as DD-MM-YYYY
						var formattedDOJ = new Date(item.DOJ).toLocaleDateString("en-GB");
						var formattedSixMonthsAfterDOJ = new Date(
							item.SixMonthsAfterDOJ
						).toLocaleDateString("en-GB");

						var badgeColor = item.IsActive === "Yes" ? "green" : "red";
						var badgeText = item.IsActive === "Yes" ? "Active" : "In Active";

						var row = `<tr>
									<td>${index + 1}</td>
									<td>${item.DeptName}</td>
									<td>${formattedDOJ}</td>
									<td>${item.FirstName}</td>
									<td>${item.MachineID}</td>
									<td>${item.ExperienceFormatted}</td>
									<td >${formattedSixMonthsAfterDOJ}</td>
									<td>${item.EmployeeMobile}</td>
									<td class='text-center'>${item.Months_Active}</td>


									<td>
										<span style="background-color: ${badgeColor}; color: white; padding: 5px 10px; border-radius: 5px;">
											${badgeText}
										</span>
									</td>
								</tr>`;

						$("#OnrollEmployee").append(row);
					});

					var table = $(".table").DataTable({
						paging: true,
						ordering: true,
						info: true,
						searching: true,
					});
				}
			},
		});
	});

	$("#On_Last_90").on("click", function () {
		var Department = $("#Department").val();

		$.ajax({
			url: baseurl + "Grade_Master/On_Last_Ninety",
			type: "POST",
			data: {
				Department: Department,
			},
			success: function (response) {
				$("#OnrollEmployee").empty();

				var responseData = JSON.parse(response);
				var OnRoll_Employee_List = responseData.On_Last_Ninety;

				if (OnRoll_Employee_List.length === 0) {
					$("#Card_OnRoll").hide();

					swal({
						title: "Error!",
						text: "No employees found with the given criteria.",
						icon: "error",
						buttons: true,
						className: "swal-small",
					});
				} else {
					$("#Card_OnRoll").show();

					if ($.fn.dataTable.isDataTable(".table")) {
						$(".table").DataTable().clear().destroy();
					}

					$.each(OnRoll_Employee_List, function (index, item) {
						// Format DOJ and SixMonthsAfterDOJ as DD-MM-YYYY
						var formattedDOJ = new Date(item.DOJ).toLocaleDateString("en-GB");
						var formattedSixMonthsAfterDOJ = new Date(
							item.SixMonthsAfterDOJ
						).toLocaleDateString("en-GB");

						var badgeColor = item.IsActive === "Yes" ? "green" : "red";
						var badgeText = item.IsActive === "Yes" ? "Active" : "In Active";

						var row = `<tr>
									<td>${index + 1}</td>
									<td>${item.DeptName}</td>
									<td>${formattedDOJ}</td>
									<td>${item.FirstName}</td>
									<td>${item.MachineID}</td>
									<td>${item.ExperienceFormatted}</td>
									<td >${formattedSixMonthsAfterDOJ}</td>
									<td>${item.EmployeeMobile}</td>
									<td class='text-center'>${item.Months_Active}</td>


									<td>
										<span style="background-color: ${badgeColor}; color: white; padding: 5px 10px; border-radius: 5px;">
											${badgeText}
										</span>
									</td>
								</tr>`;

						$("#OnrollEmployee").append(row);
					});

					var table = $(".table").DataTable({
						paging: true,
						ordering: true,
						info: true,
						searching: true,
					});
				}
			},
		});
	});



    $.ajax({
        url: baseurl + "Work_Master/Shifts",
        type: "POST",
        success: function (response) {
            var responseData = JSON.parse(response);
            var Shifts = responseData.Shifts;

            $("#Default_Shift").empty();
            $.each(Shifts, function (index, value) {
                $("#Default_Shift").append($("<option></option>").attr("value", value).text(value));
            });

			$("#Default_Shift option:first").prop("selected", true);

				var Default_Shift = $("#Default_Shift").val();
		$.ajax({
			type: "POST",
			data: {
				Default_Shift
			},
			url: baseurl + "Home/Work_Allocation_Details",

			success: function (

		) {
			// Log the raw response data to check its structure
			console.log(data);

			try {
				var responseData = JSON.parse(data);
					if (Array.isArray(responseData.Attendance_List)) {
					const Attendance_List = responseData.Attendance_List;

					const gradeCount = {
						'A': 0,
						'A+': 0,
						'B': 0,
						'B+': 0,
						'C': 0,
						'T': 0,
						'N': 0
					};

					const gradeColors = {
						'A': 'rgb(61, 252, 61)',   // Green for A
						'A+': 'rgb(61, 252, 61)',  // Green for A+
						'B': 'rgb(254, 235, 63)', // Orange for B
						'B+': 'rgb(254, 235, 63)',// Orange for B+
						'C': 'rgb(255, 62, 62)',   // Red for C
						'T': 'rgb(188, 188, 188)', // Gray for Trainee
						'N': 'rgb(188, 188, 188)' // Gray for New
					};

					// Loop through the attendance list to count the grades
					Attendance_List.forEach(employee => {
						if (employee.Grade && gradeCount[employee.Grade] !== undefined) {
							gradeCount[employee.Grade]++;
						} else {
							console.warn(`Invalid or missing grade for employee: ${employee.FirstName}`);
						}
					});

					// Prepare data for the chart
					const dataForChart = {
						labels: ['A', 'A+', 'B', 'B+', 'C', 'Traine', 'New'],
						datasets: [{
							label: 'Employee Grade Distribution',
							data: [
								gradeCount['A'],
								gradeCount['A+'],
								gradeCount['B'],
								gradeCount['B+'],
								gradeCount['C'],
								gradeCount['T'],
								gradeCount['N']
							],
							backgroundColor: [
								gradeColors['A'],
								gradeColors['A+'],
								gradeColors['B'],
								gradeColors['B+'],
								gradeColors['C'],
								gradeColors['T'],
								gradeColors['N']
							],
							borderColor: [
								gradeColors['A'],
								gradeColors['A+'],
								gradeColors['B'],
								gradeColors['B+'],
								gradeColors['C'],
								gradeColors['T'],
								gradeColors['N']
							],
							borderWidth: 1
						}]
					};

					const options = {
						responsive: true,
						scales: {
							y: {
								beginAtZero: true
							}
						}
					};

					const ctx = document.getElementById('myBarChart12').getContext('2d');
					const myBarChart = new Chart(ctx, {
						type: 'bar',  // Type of chart
						data: dataForChart,   // Data for the chart
						options: options // Configuration options
					});

				} else {
					console.error("Attendance_List is missing or not an array");
				}

			} catch (error) {
				console.error("Error parsing response data or creating chart:", error);
			}
		},
		error: function(xhr, status, error) {
			console.error("Error fetching data:", error);
		}
	});
        },
	});








});
