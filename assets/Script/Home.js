$(document).ready(function () {

	var ctx = document.getElementById('myPieChart').getContext('2d');
	var myPieChart = new Chart(ctx, {
		type: 'pie',  // Type of chart (pie)
		data: {
			labels: ['Present', 'Absent', 'On Leave'],  // Labels for the data
			datasets: [{
				label: 'Employee Attendance',
				data: [65, 25, 10],  // Attendance data (adjust as needed)
				backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],  // Colors for the segments
				hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']  // Hover colors
			}]
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: 'top',  // Position of the legend
				},
				tooltip: {
					callbacks: {
						label: function (tooltipItem) {
							return tooltipItem.label + ': ' + tooltipItem.raw + '%';  // Display percentage in tooltip
						}
					}
				}
			}
		}

	})






	$("#Last_6_Month").on("click", function () {
		$.ajax({
			type: "POST",
			url: baseurl + "Grade_Master/Last_6_Month_Trainee_Incomplete",
			dataType: "json",
			success: function (response) {
				$("#last_6_month_trainee_list").empty();

				var Last_6_Month_Trainee_Incomplete =
					response.Last_6_Month_Trainee_Incomplete;

				$.each(Last_6_Month_Trainee_Incomplete, function (index, item) {
					var dojFormatted = item.DOJ;
					var durationFormatted = item.DurationFormatted;
					var experienceFormatted = item.ExperienceFormatted;
					var monthsActive = item.Months_Active;

					var row = `<tr>
                                <td>${item.DeptName}</td>
                                <td>${item.EmpNo}</td>
                                <td>${item.FirstName}</td>
                                <td>${dojFormatted}</td>
                                <td>${item.Category}</td>
                                <td>${item.Duration}</td>
                                <td>${experienceFormatted}</td>
                                <td>${monthsActive}</td>
                                <td class='text-center'>${durationFormatted}</td>
                            </tr>`;

					$("#last_6_month_trainee_list").append(row);
				});
			},
			error: function (xhr, status, error) {
				console.error("Error in AJAX request:", error);
			},
		});
	});


    $("#Last_12_Month").on("click", function () {
		$.ajax({
			type: "POST",
			url: baseurl + "Grade_Master/Last_12_Month_Trainee_Incomplete",
			dataType: "json",
			success: function (response) {
				$("#last_6_month_trainee_list").empty();

				var Last_12_Month_Trainee_Incomplete =
					response.Last_12_Month_Trainee_Incomplete;

				$.each(Last_12_Month_Trainee_Incomplete, function (index, item) {
					var dojFormatted = item.DOJ;
					var durationFormatted = item.DurationFormatted;
					var experienceFormatted = item.ExperienceFormatted;
					var monthsActive = item.Months_Active;

					var row = `<tr>
                                <td>${item.DeptName}</td>
                                <td>${item.EmpNo}</td>
                                <td>${item.FirstName}</td>
                                <td>${dojFormatted}</td>
                                <td>${item.Category}</td>
                                <td>${item.Duration}</td>
                                <td>${experienceFormatted}</td>
                                <td>${monthsActive}</td>
                                <td class='text-center'>${durationFormatted}</td>
                            </tr>`;

					$("#last_6_month_trainee_list").append(row);
				});
			},
			error: function (xhr, status, error) {
				console.error("Error in AJAX request:", error);
			},
		});
	});


	$("#Above_6_Month").on("click", function () {
		$.ajax({
			type: "POST",
			url: baseurl + "Grade_Master/Above_6_Month_Trainee_Incomplete",
			dataType: "json",
			success: function (response) {
				$("#last_6_month_trainee_list").empty();

				var Above_6_Month_Trainee_Incomplete = response.Above_6_Month_Trainee_Incomplete;

				$.each(Above_6_Month_Trainee_Incomplete, function (index, item) {
					var dojFormatted = item.DOJ;
					var durationFormatted = item.DurationFormatted;
					var experienceFormatted = item.ExperienceFormatted;
					var monthsActive = item.Months_Active;

					var row = `<tr>
                                <td>${item.DeptName}</td>
                                <td>${item.EmpNo}</td>
                                <td>${item.FirstName}</td>
                                <td>${dojFormatted}</td>
                                <td>${item.Category}</td>
                                <td>${item.Duration}</td>
                                <td>${experienceFormatted}</td>
                                <td>${monthsActive}</td>
                                <td class='text-center'>${durationFormatted}</td>
                            </tr>`;

					$("#last_6_month_trainee_list").append(row);
				});
			},
			error: function (xhr, status, error) {
				console.error("Error in AJAX request:", error);
			},
		});
	});


	$("#Above_12_Month").on("click", function () {
		$.ajax({
			type: "POST",
			url: baseurl + "Grade_Master/Above_12_Month_Trainee_Incomplete",
			dataType: "json",
			success: function (response) {
				$("#last_6_month_trainee_list").empty();

				var Above_12_Month_Trainee_Incomplete = response.Above_12_Month_Trainee_Incomplete;

				$.each(Above_12_Month_Trainee_Incomplete, function (index, item) {
					var dojFormatted = item.DOJ;
					var durationFormatted = item.DurationFormatted;
					var experienceFormatted = item.ExperienceFormatted;
					var monthsActive = item.Months_Active;

					var row = `<tr>
                                <td>${item.DeptName}</td>
                                <td>${item.EmpNo}</td>
                                <td>${item.FirstName}</td>
                                <td>${dojFormatted}</td>
                                <td>${item.Category}</td>
                                <td>${item.Duration}</td>
                                <td>${experienceFormatted}</td>
                                <td>${monthsActive}</td>
                                <td class='text-center'>${durationFormatted}</td>
                            </tr>`;

					$("#last_6_month_trainee_list").append(row);
				});
			},
			error: function (xhr, status, error) {
				console.error("Error in AJAX request:", error);
			},
		});
	});












});
