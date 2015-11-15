
import fetchObservable from "lib/fetchObservable";
import React from "react";
import ReactDOM from "react-dom";

let observable = fetchObservable(
	"http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=2de143494c0b295cca9337e1e96b00e0",
	{
		refreshDelay: 1500
	}
);

let subscriptions = {};

function toggleFetching (index) {
	if (subscriptions[index]) {
		subscriptions[index].unsubscribe();
		subscriptions[index].resubscribe();
	}
	else {
		subscriptions[index] = observable.subscribe({
			next: (...args) => {console.log(`subscriptions[${index}] next:`, ...args);},
			error: (...args) => {console.warn(`subscriptions[${index}] error:`, ...args);},
			complete: () => {console.log(`subscriptions[${index}] complete`); toggleFetching(index);}
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
				{subscriptions.A && subscriptions.A.active() ? "X Stop" : "√ Start"} fetching
			</button>
			<button key="B" onClick={toggleFetching.bind(null, "B")}>
				{subscriptions.B && subscriptions.B.active() ? "X Stop" : "√ Start"} fetching
			</button>
		</center>,
		document.getElementById("react-root")
	);
}

render();
