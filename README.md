# fetchObservable

Observable-based [Fetch API](https://github.com/whatwg/fetch) that automatically refreshes data.

## Features

- API similar to the standard Fetch API.
- Uses Observable syntax from [ES Observable proposal](https://github.com/zenparsing/es-observable).
- Runs in Node and browsers.

## Installation

```bash
	# For web or Node:
	npm install --save fetch-observable
```

## Usage

````js
import fetchObservable from "fetch-observable";

// Creates a single fetchObservable for one or multiple URLs.
const liveFeed = fetchObservable(
	"http://example.org/live-feed.json",
	{refreshDelay (iteration) { return iteration * 1000; }}
);

// Subscribe-syntax like ES Observables.
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
````

## Community

Let's start one together! After you ★Star this project, follow me [@Rygu](https://twitter.com/rygu)
on Twitter.

## License

BSD 3-Clause license. Copyright © 2015, Rick Wong. All rights reserved.
