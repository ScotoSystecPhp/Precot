$(document).ready(function () {

	document.getElementById('Date').value = new Date().toISOString().split('T')[0];
	$.ajax({
		url: baseurl + "Master/Eb_Servive_No",
		type: "POST",
		success: function (response) {
			var responseData = JSON.parse(response);
			var Service_No = { "": "" };

			for (var i = 0; i < responseData.length; i++) {
				var DName = responseData[i];
				Service_No[DName.Service_No] = DName.Service_No;
			}

			$.each(Service_No, function (key, value) {
				$("#Service_No").append(
					$("<option></option>").attr("value", key).text(value)
				);
			});
		},
	});

	$("#EB_List_Card").hide();

	$("#Service_No").on("change", function () {
		var Service_No = $(this).val();
		$.ajax({
			url: baseurl + "Master/Eb_Servive_Detail",
			type: "POST",
			data: { Service_No: Service_No },
			success: function (response) {

				$("#EB_List").DataTable().clear().destroy(); // Clear and destroy the existing table data to avoid re-initialization
			
				$("#EB_List tbody").empty(); // Empty the table body before appending new rows
			
				var responseData = JSON.parse(response);
				var Service_Name = responseData.EB_Servive_Name[0].Service_Name;
				var PowerList = responseData.Power_List;
				var Electric_Power_Rate = responseData.Electric_Power_Rate;

				var Master_Rate = Electric_Power_Rate[0].Rate;

				$("#Rate_Amount").val(Master_Rate);

				$("#EB_List_Card").show();

			
				$.each(PowerList, function (index, item) {
					var row = `<tr>
									<td>${index + 1}</td>
									<td>${item.Date}</td>
									<td>${item.Service_No}</td>
									<td>${item.Previous_Day}</td>
									<td>${item.Current_Day}</td>
									<td>${item.Running_Unit}</td>
									<td>${item.EB_Rate}</td>
									<td>${item.Amount}</td>
							   </tr>`;
			
					$("#EB_List tbody").append(row); // Add rows to the table body
				});
			
				// Initialize DataTable after appending new rows
				$('#EB_List').DataTable({
					"paging": true,
					"searching": true,
					"ordering": true,
					"info": true,
					"autoWidth": false,
					"lengthChange": false
				});
			
				$("#Service_Name").val(Service_Name);
			
				var Date = $("#Date").val();
			
				$.ajax({
					url: baseurl + "Master/Previous_Date_EB",
					type: "POST",
					data: {
						Service_No: Service_No,
						Date: Date,
						Service_Name: Service_Name,
					},
					success: function (response) {
						var responseData = JSON.parse(response);
						var Current_Day = responseData.Previous_Date[0].Current_Day;
			
						$("#Previous_Day_Unit").val(Current_Day);
			
						var Service_No = $("#Service_No").val();
						var Service_Name = $("#Service_Name").val();
						var Date = $("#Date").val();
						var Previous_Day_Unit = $("#Previous_Day_Unit").val();
			
						var Actual; 
			
						$("#Current_Day_Unit").on("keyup", function () {
							var Current_Day_Unit = parseFloat($("#Current_Day_Unit").val());
							var Previous_Day_Unit = parseFloat($("#Previous_Day_Unit").val());
			
							Actual = Math.abs(Previous_Day_Unit - Current_Day_Unit);
			
							$("#Actual_Unit").val(Actual);

							var Rate = parseFloat($("#Rate_Amount").val());
							if (isNaN(Rate) || isNaN(Actual)) return;
			
							var Total_Amount = Actual * Rate;
			
							$("#Unit_Amount").val(Total_Amount);

						});
			
						
					},
				});
			},
			
			
		});
	});

	$("#EB_Calculation_Save").on("click", function () {
		var Service_No = $("#Service_No").val();
		var Service_Name = $("#Service_Name").val();
		var Date = $("#Date").val();
		var Previous_Day_Unit = $("#Previous_Day_Unit").val();
		var Current_Day_Unit = $("#Current_Day_Unit").val();
		var Actual_Unit = $("#Actual_Unit").val();
		var Rate_Amount = $("#Rate_Amount").val();
		var Unit_Amount = $("#Unit_Amount").val();

		$.ajax({
			type: "POST",
			url: baseurl + "Master/EB_Calculation_Save",
			data: {
				Service_No: Service_No,
				Service_Name: Service_Name,
				Date: Date,
				Previous_Day_Unit: Previous_Day_Unit,
				Current_Day_Unit: Current_Day_Unit,
				Actual_Unit: Actual_Unit,
				Rate_Amount: Rate_Amount,
				Unit_Amount: Unit_Amount,
			},
			success: function (response) {
				var responseData = JSON.parse(response);



				if (responseData == "Success") {
					swal("Success!", "EB Calculation Saved Successfully.", "success");
				} else if(responseData == "Already"){
					swal("Error!","Already This Serial Number Updated For This Date.","error");
				}
			},
		});
	});
});
