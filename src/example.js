/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import __fetch from "isomorphic-fetch";
import fetchObservable from "lib/fetchObservable";
import React from "react";
import ReactDOM from "react-dom";

try {
	let observable = fetchObservable(
		"http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=2de143494c0b295cca9337e1e96b00e0", {
			refreshDelay: 1500
		}
	).map(a=>a).map(a=>a).map(a=>a).map(a=>a).map(a=>a).map((response) => response.json());

	let subscriptions = {};

	global.o = observable;

	function toggleFetching (index) {
		if (subscriptions[index]) {
			subscriptions[index].unsubscribe();
			delete subscriptions[index];
		}
		else {
			subscriptions[index] = observable.subscribe({
				next:     (...args) => {
					console.log(`subscriptions[${index}] next:`, ...args);
				},
				error:    (...args) => {
					console.warn(`subscriptions[${index}] error:`, ...args);
				},
				complete: () => {
					console.log(`subscriptions[${index}] complete`);
					toggleFetching(index);
				}
			});
		}

		render();
	}

	function render () {
		ReactDOM.render(
			<center>
				<br />
				<br />
				<button key="A" onClick={toggleFetching.bind(null, "A")}>
					{subscriptions.A ? "X Stop" : "√ Start"} fetching
				</button>
				<button key="B" onClick={toggleFetching.bind(null, "B")}>
					{subscriptions.B ? "X Stop" : "√ Start"} fetching
				</button>
			</center>,
			document.getElementById("react-root")
		);
	}

	render();
}
catch (error)
{
	throw error;
}
