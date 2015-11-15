# fetchObservable()

Observable-based [Fetch API](https://github.com/whatwg/fetch) that automatically refreshes data and notifies subscribers.

## Features

- Uses the standard Fetch API.
- Uses Observable syntax from [ES Observable proposal](https://github.com/zenparsing/es-observable).
- Runs in Node and browsers. (BYO Promises though)

## Installation

```bash
	npm install --save fetch-observable
```

## Usage

````js
import fetchObservable from "fetch-observable";

// Creates a single observable for one or multiple URLs.
const liveFeed = fetchObservable(
	"http://example.org/live-feed.json",
	{
		refreshDelay: (iteration) => iteration * 1000 // <-- Callback or just integer ms.
	}
);

// Subscribe-syntax of ES Observables.
const subscription1 = liveFeed.subscribe({
	next (response) {
		console.dir(response.json());
	},
	error (error) {
		console.warn(error.stack || error);
	}
});

// Multiple subscriptions allowed.
const subscription2 = liveFeed.subscribe({next () {}});

subscription1.unsubscribe();
subscription2.unsubscribe(); // <-- Observable pauses on 0 subscriptions.

subscription1.resubscribe(); // <-- Observable resumes on 1 subscription.

liveFeed.pause(); // <-- Observable can be paused manually.
liveFeed.resume();
````

## Community

Let's start one together! After you ★Star this project, follow me [@Rygu](https://twitter.com/rygu)
on Twitter.

## License

BSD 3-Clause license. Copyright © 2015, Rick Wong. All rights reserved.
