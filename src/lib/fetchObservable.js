import __fetch from "isomorphic-fetch";
import PausableObservable from "lib/PausableObservable";

function isString (thing) {
	return typeof thing === "string";
}

function isFunction (thing) {
	return typeof thing === "function";
}

/**
 * Calls the Fetch API and returns an Observable.
 *
 * @param {string|string[]} urls  URL or URLs array.
 * @param {object} options
 * @returns {PausableObservable|Observable}
 */
function fetchObservable (urls, options = {}) {
	const {refreshDelay = false} = options;

	let subscribers  = [];
	let timeout      = null;
	let singleResult = false;
	let iteration = 0;

	if (singleResult = isString(urls)) {
		urls = [urls];
	}

	const performFetch = function () {
		// Don't do anything if there are no subscribers.
		if (subscribers.length === 0 ||
		    observable.paused()) {
			return;
		}

		const _finally = function () {
			// If refreshing is disabled, complete subscribers and pause observable.
			if (!refreshDelay) {
				observable.pause();
				subscribers.map(subscriber => subscriber.complete());
				subscribers = [];
			}
			// If refreshing is enabled, set a timeout.
			else {
				timeout = setTimeout(
					performFetch,
					isFunction(refreshDelay) ? refreshDelay(iteration++) : refreshDelay
				);
			}
		};

		let fetches = urls.map(url => fetch(url, options));

		Promise.all(fetches).then(function (results) {
			subscribers.map(subscriber => subscriber.next(singleResult ? results[0] : results));
			_finally();
		}).catch(function (results) {
			subscribers.map(subscriber => subscriber.error(singleResult ? results[0] : results));
			_finally();
		});
	};

	const observable = new PausableObservable(function (subscriber) {
		subscribers.push(subscriber);

		if (subscribers.length) {
			observable.resume();
		}

		return function () {
			subscribers.splice(subscribers.indexOf(subscriber), 1);

			if (!subscribers.length) {
				observable.pause();
			}
		};
	}, {
		onPause () {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
		},
		onResume () {
			if (!timeout) {
				performFetch();
			}
		}
	});

	observable.resume();

	return observable;
}

export default fetchObservable;
