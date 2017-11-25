function randomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

function randomBoxPlot() {
	const min =
	return {
		min,
		max,
		median,
		q1,
		q3
	};
}

const data = [randomBoxPlot()];

const ctx = document.getElementById("chart1").getContext("2d");
ctx.canvas.width = 1000;
ctx.canvas.height = 300;
new Chart(ctx, {
	type: 'boxplot',
	data: {
		datasets: [{
			label: "CHRT - Chart.js Corporation",
			data: data
		}]
	}
});
