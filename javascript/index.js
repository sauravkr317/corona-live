const url = "https://api.covid19india.org/data.json";
fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    let case_time = data["cases_time_series"];
    let states = data["statewise"];
    let remove_state = states.shift();
    ConfirmedLine(case_time);
    ActiveLine(case_time);
    RecoveredLine(case_time);
    DeathLine(case_time);
    ShowData(remove_state);
    pieChart(remove_state);
    getData(states);
    // chart(states);
    Line(case_time);
  });

// fetch('https://api.covid19india.org/data.json').then((response) => {
// 	return response.json();
// }).then((data) => {
// 	console.log(data);
// })

function ShowData(remove_state) {
  	document.getElementById("numspan").innerHTML = `+${formatNumber(
    remove_state["deltaconfirmed"]
  	)}`;
  	document.getElementById("total").innerHTML = `${formatNumber(
    remove_state["confirmed"]
  )}`;

  	document.getElementById("numspan_recover").innerHTML = `+${formatNumber(
    remove_state["deltarecovered"]
  	)}`;
  	document.getElementById("total3").innerHTML = `${formatNumber(
    remove_state["recovered"]
  )}`;
  	document.getElementById("numspan_death").innerHTML = `+${formatNumber(
    remove_state["deltadeaths"]
  )}`;
  	document.getElementById("total4").innerHTML = `${formatNumber(
    remove_state["deaths"]
  )}`;
  document.getElementById("total2").innerHTML = `${formatNumber(
    remove_state["active"]
  )}`;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getData(states) {
  let table_body = document.getElementById("table-body");
  let html = "";
  states.forEach(function (element) {
    let recovery = (element["recovered"] / element["confirmed"]) * 100;
    let exact_recovery = recovery.toFixed(2);
    if (element["active"] > 0) {
      let uistring = `<tr>
		      			<td style="width: 230px;border-radius: 5px;">${formatNumber(element["state"])}</td>
		      			<td style="width: 150px;">${formatNumber(element["active"])}</td>
		      			<td style="width: 150px;">${formatNumber(element["confirmed"])}<sup class="font-weight-bolder text-danger">&uarr;${formatNumber(element["deltaconfirmed"])}</sup></td>
		      			<td style="width: 150px;">${formatNumber(element["recovered"])}<sup class="font-weight-bolder text-success">&uarr;${formatNumber(element["deltarecovered"])}</sup></td>
		      			<td style="width: 150px;">${formatNumber(element["deaths"])}<sup class="font-weight-bolder text-danger">&darr;${formatNumber(element["deltadeaths"])}</sup></td>
		      			<td class="text-success" style="width: 150px;">${exact_recovery}%</td>
		    			</tr>`;
      html += uistring;
    } else {
      let uistring = `<tr>
		      			<td style="width: 230px;">${formatNumber(element["state"])}</td>
		      			<td style="width: 150px;">${formatNumber(element["active"])}</td>
		      			<td style="width: 150px;">${formatNumber(element["confirmed"])}</td>
		      			<td style="width: 150px;">${formatNumber(element["recovered"])}</td>
		      			<td style="width: 150px;">${formatNumber(element["deaths"])}</td>
		      			<td style="width: 150px;">0%</td>
		    			</tr>`;
      html += uistring;
    }
  });
  table_body.innerHTML = html;
}

function pieChart(remove_state) {
  var ctx = document.getElementById("pieChart").getContext("2d");
  let arr = ["active", "confirmed", "deaths", "recovered"];
  let arrdata = [
    remove_state["active"],
    remove_state["confirmed"],
    remove_state["deaths"],
    remove_state["recovered"],
  ];
  var data = {
    labels: arr,
    datasets: [
      {
        label: "State-Wise Cases",
        data: arrdata,
        backgroundColor: ["#be2edd", "#ff7979", "#eb4d4b", "#6ab04c"],
        borderWidth: 0,
      },
    ],
  };

  var option = {
    title: {
      display: true,
      position: "top",
      text: "Pie Chart",
      fontSize: 18,
      fontColor: "#000",
    },
    scales: {
    	xAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        },
      ],
    },
    legend: {
      display: false,
      position: "bottom",
    },
  };
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "doughnut",

    // The data for our dataset
    data: data,

    // Configuration options go here
    options: option,
  });
}

function Line(case_time) {
  let arr = [];
  let arrdate = [];
  let recover_arr = [];
  let deceased_arr = [];
  case_time.forEach(function (element) {
    arr.push(element["totalconfirmed"]);
    arrdate.push(element["date"]);
    recover_arr.push(element["totalrecovered"]);
    deceased_arr.push(element["totaldeceased"]);
  });
  let last_date = arrdate.length - 1;
  var ctx = document.getElementById("LineChart").getContext("2d");
  var data = {
    labels: arrdate,
    datasets: [
      {
        label: "Covid Growth Rate",
        data: arr,
        backgroundColor: "#ff7979",
        borderColor: "#ff7979",
        fill: false,
        lineTension: 0,
        pointRadius: 1,
      },
      {
        label: "Covid Recovery Rate",
        data: recover_arr,
        backgroundColor: "#6ab04c",
        borderColor: "#6ab04c",
        fill: false,
        lineTension: 0,
        pointRadius: 1,
      },
      {
        label: "Covid Death Rate",
        data: deceased_arr,
        backgroundColor: "#eb4d4b",
        borderColor: "#eb4d4b",
        fill: false,
        lineTension: 0,
        pointRadius: 1,
      },
    ],
  };

  var option = {
    title: {
      display: true,
      position: "top",
      text: "Line Graph",
      fontSize: 18,
      fontColor: "#000",
    },
    scales: {
      xAxes: [
        {
          ticks: {
            min: "30 March ",
            max: arrdate[last_date],
            display: false,
          },
          gridLines: {
            display: false,
            drawBorder:false
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
            drawBorder:false
          },
        },
      ],
    },
    legend: {
      display: false,
      position: "top",
    },
  };
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: data,

    // Configuration options go here
    options: option,
  });
}

function ConfirmedLine(case_time) {
  let arr = [];
  let arrdate = [];
  let pointRadius = [];
  case_time.forEach(function (element) {
    arr.push(element["dailyconfirmed"]);
    arrdate.push(element["date"]);
  });
  for (let i = 0; i < arr.length; i++) {
  if (i == arr.length-1) {
    	pointRadius.push(5);
    }
    else {
    	pointRadius.push(0);
    }
   }
  let last_date = arrdate.length - 1;
  var ctx = document.getElementById("ConfirmedChart").getContext("2d");
  var data = {
    labels: arrdate.slice(last_date - 30, arrdate.length),
    datasets: [
      {
        label: "Daily Cases",
        data: arr.slice(last_date - 30, arrdate.length),
        backgroundColor: "#ff7979",
        borderColor: "#ff7979",
        fill: false,
        lineTension: 0.5,
        pointRadius: pointRadius.slice(last_date - 30, pointRadius.length),
      },
    ],
  };
  console.log(data.labels);

  var option = {
    responsive: true,
    maintainAspectRatio: true,
    title: {
      display: false,
      position: "top",
      text: "Line Graph",
      fontSize: 18,
      fontColor: "#000",
    },
    scales: {
      xAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
    },
    legend: {
      display: false,
      position: "bottom",
    },
  };
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: data,

    // Configuration options go here
    options: option,
  });
}

function ActiveLine(case_time) {
  let arr = [];
  let arrdate = [];
  let pointRadius = [];
  case_time.forEach(function (element) {
    arr.push(element["dailyconfirmed"] - element["dailyrecovered"]);
    arrdate.push(element["date"]);
  });
  for (let i = 0; i < arr.length; i++) {
  if (i == arr.length-1) {
    	pointRadius.push(5);
    }
    else {
    	pointRadius.push(0);
    }
   }
  let last_date = arrdate.length - 1;
  var ctx = document.getElementById("ActiveChart").getContext("2d");
  var data = {
    labels: arrdate.slice(last_date - 30, arrdate.length),
    datasets: [
      {
        label: "Active Cases",
        data: arr.slice(last_date - 30, arrdate.length),
        backgroundColor: "#3498db",
        borderColor: "#3498db",
        fill: false,
        lineTension: 0.5,
        pointRadius: pointRadius.slice(last_date - 30, pointRadius.length),
      },
    ],
  };

  var option = {
    responsive: true,
    maintainAspectRatio: true,
    title: {
      display: false,
      position: "top",
      text: "Line Graph",
      fontSize: 18,
      fontColor: "#000",
    },
    scales: {
      xAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
    },
    legend: {
      display: false,
      position: "bottom",
    },
  };
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: data,

    // Configuration options go here
    options: option,
  });
}

function RecoveredLine(case_time) {
  let arr = [];
  let arrdate = [];
  let pointRadius = [];
  case_time.forEach(function (element) {
    arr.push(element["dailyrecovered"]);
    arrdate.push(element["date"]);
  });
  for (let i = 0; i < arr.length; i++) {
  if (i == arr.length-1) {
    	pointRadius.push(5);
    }
    else {
    	pointRadius.push(0);
    }
   }
  let last_date = arrdate.length - 1;
  var ctx = document.getElementById("RecoveredChart").getContext("2d");
  var data = {
    labels: arrdate.slice(last_date - 30, arrdate.length),
    datasets: [
      {
        label: "Daily Recovery",
        data: arr.slice(last_date - 30, arrdate.length),
        backgroundColor: "rgba(40, 167, 69, 0.7)",
        borderColor: "rgba(40, 167, 69, 0.7)",
        fill: false,
        lineTension: 0.5,
        pointRadius: pointRadius.slice(last_date - 30, pointRadius.length),
      },
    ],
  };

  var option = {
    responsive: true,
    maintainAspectRatio: true,
    title: {
      display: false,
      position: "top",
      text: "Line Graph",
      fontSize: 18,
      fontColor: "#000",
    },
    scales: {
      xAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
    },
    legend: {
      display: false,
      position: "bottom",
    },
  };
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: data,

    // Configuration options go here
    options: option,
  });
}

function DeathLine(case_time) {
  let arr = [];
  let arrdate = [];
  let pointRadius = [];
  case_time.forEach(function (element, index) {
    arr.push(element["dailydeceased"]);
    arrdate.push(element["date"]);
  });

  for (let i = 0; i < arr.length; i++) {
  if (i == arr.length-1) {
    	pointRadius.push(5);
    }
    else {
    	pointRadius.push(0);
    }
   }
  let last_date = arrdate.length - 1;
  var ctx = document.getElementById("DeathChart").getContext("2d");
  var data = {
    labels: arrdate.slice(last_date - 30, arrdate.length),
    datasets: [
      {
        label: "Daily Death",
        data: arr.slice(last_date - 30, arrdate.length),
        backgroundColor: "rgba(108,117,125,.7)",
        borderColor: "rgba(108,117,125,.7)",
        fill: false,
        lineTension: 0.5,
        pointRadius: pointRadius.slice(last_date - 30, pointRadius.length),
      },
    ],
  };

  var option = {
    responsive: true,
    maintainAspectRatio: true,
    title: {
      display: false,
      position: "top",
      text: "Line Graph",
      fontSize: 18,
      fontColor: "#000",
    },
    scales: {
      xAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
    },
    legend: {
      display: false,
      position: "bottom",
    },
  };
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: data,

    // Configuration options go here
    options: option,
  });
}
