/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
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

	let observers    = [];
	let timeout      = null;
	let singleResult = false;
	let iteration = 0;

	if (singleResult = isString(urls)) {
		urls = [urls];
	}

	const performFetch = function () {
		// Don't do anything if there are no observers.
		if (observers.length === 0 ||
		    observable.paused()) {
			return;
		}

		const _finally = function () {
			// If refreshing is disabled, complete observers and pause observable.
			if (!refreshDelay) {
				observable.pause();
				observers.map((observer) => observer.complete());
				observers = [];
			}
			// If refreshing is enabled, set a timeout.
			else {
				timeout = setTimeout(
					performFetch,
					isFunction(refreshDelay) ? refreshDelay(iteration++) : refreshDelay
				);
			}
		};

		// Map all URLs to Fetch API calls.
		let fetches = urls.map((url) => fetch(url, options));

		// Wait for all the results to come in, then notify observers.
		Promise.all(fetches).then(function (results) {
			observers.map((observer) => observer.next(singleResult ? results[0] : results));
			_finally();
		}).catch(function (error) {
			observers.map((observer) => observer.error(error));
			_finally();
		});
	};

	const observable = new PausableObservable(function (observer) {
		observers.push(observer);
		observable.resume();

		return function () {
			observers.splice(observers.indexOf(observer), 1);

			if (!observers.length) {
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

	return observable;
}

module.exports = fetchObservable;
