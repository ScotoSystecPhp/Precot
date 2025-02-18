$(document).ready(function () {


    $.ajax({
        url: baseurl + 'Charts/Work_Allocation_Report',
        method: 'POST',
        success: function (response) {

            var responseData = JSON.parse(response);



            // if (responseData.length > 0) {


// Data for departments and their shift workers count
const departmentData = [
  { department: 'BLOW ROOM', shift1: 2, shift2: 0, shift3: 0 },
  { department: 'CARDING', shift1: 1, shift2: 0, shift3: 0 },
  { department: 'COMBER', shift1: 2, shift2: 0, shift3: 0 },
  { department: 'PREP-MNT', shift1: 1, shift2: 0, shift3: 0 },
  { department: 'SEGREGATION', shift1: 6, shift2: 0, shift3: 0 },
  { department: 'SIMPLEX', shift1: 1, shift2: 0, shift3: 0 }
];

// Extracting the shift-wise worker counts for each department
const shift1Data = departmentData.map(item => item.shift1);
const shift2Data = departmentData.map(item => item.shift2);
const shift3Data = departmentData.map(item => item.shift3);
const departmentNames = departmentData.map(item => item.department);

// Chart options
var options3 = {
  series: [{
    name: 'Shift 1',
    data: shift1Data
  }, {
    name: 'Shift 2',
    data: shift2Data
  }, {
    name: 'Shift 3',
    data: shift3Data
  }],
  chart: {
    type: 'bar',
    height: 350,
    toolbar: {
      show: false,
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '25%',
      endingShape: 'rounded'
    },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: departmentNames, // Use department names as x-axis categories
    title: {
      text: 'Departments'
    }
  },
  yaxis: {
    title: {
      text: 'Workers Count'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " workers"
      }
    }
  }
};

// Create and render the chart
var chart = new ApexCharts(document.querySelector("#Worked_Data"), options3);
chart.render();




    //         } else {

    //         }

        }
    });






    var options8 = {
	series: [44, 55, 41, 17, 15],
	chart: {
		type: 'donut',
	},
	responsive: [{
		breakpoint: 480,
		options: {
			chart: {
				width: 200
			},
			legend: {
				position: 'bottom'
			}
		}
	}]
};
var chart = new ApexCharts(document.querySelector("#chart8"), options8);
chart.render();



})