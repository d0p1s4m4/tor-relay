const graph_error_elem = document.getElementById("graph-error");
const network_traffic_elem = document.getElementById("network-traffic");
const load_average_elem = document.getElementById("load-average");
const tor_version_elem = document.getElementById("version");
const load_average_loader_elem = document.getElementById("load-average-loader");
const network_traffic_loader_elem = document.getElementById("network-traffic-loader");

let show_sys_info = () => {
	fetch('/assets/json/sys.json')
		.then((res) => res.json())
		.then((data) => {
			if (data.tor_version !== undefined) {
				tor_version_elem.textContent = data.tor_version;
			}
		})
		.catch((err) => {
			console.error(err);
		});
}

let show_load_average_statistics = () => {
	fetch('/assets/json/loads.json')
		.then((res) => res.json())
		.then((data) => {
			const config = {
				type: 'line',
				data: {
					datasets: [
						{
							label: "1 minute",
							data: data.data.map(x => ({ x: x.date, y: x.load_1 })),
							borderColor: "#31B5BB"
						},
						{
							label: "5 minutes",
							data: data.data.map(x => ({ x: x.date, y: x.load_5 })),
							borderColor: "#bb31b5"
						},
						{
							label: "15 minutes",
							data: data.data.map(x => ({ x: x.date, y: x.load_15 })),
							borderColor: "#b5bb31"
						}
					]
				},
				options: {
					plugins: {
						title: {
							display: true,
							text: "load average"
						}
					}
				}
			};

			load_average_loader_elem.remove();

			new Chart(load_average_elem, config);
		})
		.catch((err) => {
			graph_error_elem.textContent = "Failed to fetch data";
			load_average_elem.remove();
			load_average_loader_elem.remove();

			console.error(err);
		});
}

let show_network_statistics = () => {
	fetch('/assets/json/network.json')
		.then((res) => res.json())
		.then((data) => {
			const config = {
				type: 'line',
				data: {
					datasets: [
						{
							label: "in",
							data: data.data.map(x => ({ x: x.date, y: x.in })),
							fill: true,
							backgroundColor: "rgba(49, 181, 187, .5)",
							borderColor: "#31B5BB"
						},
						{
							label: "out",
							data: data.data.map(x => ({ x: x.date, y: x.out })),
							fill: true,
							backgroundColor: "rgba(187 , 49, 53, .5)",
							borderColor: "#BB3135"
						}
					]
				},
				options: {
					plugins: {
						responsive: true,
						title: {
							display: true,
							text: `${data.iface} traffic`
						},
					},
					scales: {
						y: {
							display: true,
							title: {
								display: true,
								text: 'kbits in (+) / out (-) per second'
							}
						}
					}

				}
			};

			network_traffic_loader_elem.remove();

			new Chart(network_traffic_elem, config);
		})
		.catch((err) => {
			graph_error_elem.textContent = "Failed to fetch data";
			network_traffic_elem.remove();
			network_traffic_loader_elem.remove();
			console.error(err);
		})
}

show_sys_info();
show_load_average_statistics();
show_network_statistics();
