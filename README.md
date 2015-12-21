# fetchObservable()

Observable-based [Fetch API](https://github.com/whatwg/fetch) that automatically refreshes data and notifies subscribers.

## Features

- Uses the standard Fetch API.
- Uses Observable syntax from [ES Observable proposal](https://github.com/zenparsing/es-observable).
- Runs in Node and browsers. (BYO Fetch API and Promises polyfills though)

## Installation

```bash
	npm install --save fetch-observable
```

## Usage

````js
import fetchObservable from "fetch-observable";

// Creates a single observable for one or multiple URLs.
const liveFeed = fetchObservable(
	"http://example.org/live-feed.json", // <-- URL or array of URLs.
	{
		fetch: fetch,  // <-- Replacable fetch implementation.
		refreshDelay: (iteration) => iteration * 1000, // <-- Callback or just integer ms.
		method: "POST" // <-- Basic Fetch API options.
	}
).map((response) => response.json()); // map() resolves Promises.

// Subscribe-syntax of ES Observables activates the observable.
const subscription1 = liveFeed.subscribe({
	next (response) {
		console.dir(response.json());
	},
	error (error) {
		console.warn(error.stack || error);
	}
});

// Multiple subscriptions allowed. They all get the result.
const subscription2 = liveFeed.subscribe({next () {}});

// Observable can be paused and resumed manually.
liveFeed.pause();
liveFeed.resume();

// Observable will be paused automatically when no subscriptions left.
subscription1.unsubscribe();
subscription2.unsubscribe();

````

## Community

Let's start one together! After you ★Star this project, follow me [@Rygu](https://twitter.com/rygu)
on Twitter.

## License

BSD 3-Clause license. Copyright © 2015, Rick Wong. All rights reserved.
