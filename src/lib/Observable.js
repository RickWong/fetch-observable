/**
 * Observable.js from zenparsing/es-observable.
 *
 * @copyright © zenparsing
 * @homepage https://github.com/zenparsing/es-observable
 * @file https://github.com/zenparsing/es-observable/blob/bed0248bf84818bbda26c051f156e51ab9f7671e/src/Observable.js
 */

// === Non-Promise Job Queueing ===

const enqueueJob = (function() {

	// Node
	if (typeof global !== "undefined" &&
	    typeof process !== "undefined" &&
	    process.nextTick) {

		return global.setImmediate ?
		       fn => { global.setImmediate(fn) } :
		       fn => { process.nextTick(fn) };
	}

	// Newish Browsers
	let Observer = self.MutationObserver || self.WebKitMutationObserver;

	if (Observer) {

		let div = document.createElement("div"),
		    twiddle = _=> div.classList.toggle("x"),
		    queue = [];

		let observer = new Observer(_=> {

			if (queue.length > 1)
				twiddle();

			while (queue.length > 0)
				queue.shift()();
		});

		observer.observe(div, { attributes: true });

		return fn => {

			queue.push(fn);

			if (queue.length === 1)
				twiddle();
		};
	}

	// Fallback
	return fn => { setTimeout(fn, 0) };

})();

// === Symbol Polyfills ===

function polyfillSymbol(name) {

	if (!Symbol[name])
		Object.defineProperty(Symbol, name, { value: Symbol(name) });
}

polyfillSymbol("observable");

// === Abstract Operations ===

function nonEnum(obj) {

	Object.getOwnPropertyNames(obj).forEach(k => {
		Object.defineProperty(obj, k, { enumerable: false });
	});

	return obj;
}

function getMethod(obj, key) {

	let value = obj[key];

	if (value == null)
		return undefined;

	if (typeof value !== "function")
		throw new TypeError(value + " is not a function");

	return value;
}

function cleanupSubscription(observer) {

	// Assert:  observer._observer is undefined

	let cleanup = observer._cleanup;

	if (!cleanup)
		return;

	// Drop the reference to the cleanup function so that we won't call it
	// more than once
	observer._cleanup = undefined;

	// Call the cleanup function
	cleanup();
}

function subscriptionClosed(observer) {

	return observer._observer === undefined;
}

function closeSubscription(observer) {

	if (subscriptionClosed(observer))
		return;

	observer._observer = undefined;
	cleanupSubscription(observer);
}

function cleanupFromSubscription(subscription) {
	return _=> { subscription.unsubscribe() };
}

function createSubscription(observer, subscriber) {

	// Assert: subscriber is callable

	// The observer must be an object
	if (Object(observer) !== observer)
		throw new TypeError("Observer must be an object");

	let subscriptionObserver = new SubscriptionObserver(observer),
	    subscription = new Subscription(subscriptionObserver),
	    start = getMethod(observer, "start");

	if (start)
		start.call(observer, subscription);

	if (subscriptionClosed(subscriptionObserver))
		return subscription;

	try {

		// Call the subscriber function
		let cleanup = subscriber.call(undefined, subscriptionObserver);

		// The return value must be undefined, null, a subscription object, or a function
		if (cleanup != null) {

			if (typeof cleanup.unsubscribe === "function")
				cleanup = cleanupFromSubscription(cleanup);
			else if (typeof cleanup !== "function")
				throw new TypeError(cleanup + " is not a function");

			subscriptionObserver._cleanup = cleanup;
		}

	} catch (e) {

		// If an error occurs during startup, then attempt to send the error
		// to the observer
		subscriptionObserver.error(e);
		return subscription;
	}

	// If the stream is already finished, then perform cleanup
	if (subscriptionClosed(subscriptionObserver))
		cleanupSubscription(subscriptionObserver);

	return subscription;
}

function SubscriptionObserver(observer) {

	this._observer = observer;
	this._cleanup = undefined;
}

SubscriptionObserver.prototype = nonEnum({

	get closed() { return subscriptionClosed(this) },

	next(value) {

		// If the stream if closed, then return undefined
		if (subscriptionClosed(this))
			return undefined;

		let observer = this._observer;

		try {

			let m = getMethod(observer, "next");

			// If the observer doesn't support "next", then return undefined
			if (!m)
				return undefined;

			// Send the next value to the sink
			return m.call(observer, value);

		} catch (e) {

			// If the observer throws, then close the stream and rethrow the error
			try { closeSubscription(this) }
			finally { throw e }
		}
	},

	error(value) {

		// If the stream is closed, throw the error to the caller
		if (subscriptionClosed(this))
			throw value;

		let observer = this._observer;
		this._observer = undefined;

		try {

			let m = getMethod(observer, "error");

			// If the sink does not support "error", then throw the error to the caller
			if (!m)
				throw value;

			value = m.call(observer, value);

		} catch (e) {

			try { cleanupSubscription(this) }
			finally { throw e }
		}

		cleanupSubscription(this);

		return value;
	},

	complete(value) {

		// If the stream is closed, then return undefined
		if (subscriptionClosed(this))
			return undefined;

		let observer = this._observer;
		this._observer = undefined;

		try {

			let m = getMethod(observer, "complete");

			// If the sink does not support "complete", then return undefined
			value = m ? m.call(observer, value) : undefined;

		} catch (e) {

			try { cleanupSubscription(this) }
			finally { throw e }
		}

		cleanupSubscription(this);

		return value;
	},

});

function Subscription(observer) {
	this._observer = observer;
}

Subscription.prototype = nonEnum({
	unsubscribe() { closeSubscription(this._observer) }
});

export class Observable {

	// == Fundamental ==

	constructor(subscriber) {

		// The stream subscriber must be a function
		if (typeof subscriber !== "function")
			throw new TypeError("Observable initializer must be a function");

		this._subscriber = subscriber;
	}

	subscribe(observer) {

		return createSubscription(observer, this._subscriber);
	}

	forEach(fn) {

		return new Promise((resolve, reject) => {

			if (typeof fn !== "function")
				throw new TypeError(fn + " is not a function");

			this.subscribe({

				next(value) {

					try { return fn(value) }
					catch (e) { reject(e) }
				},

				error: reject,
				complete: resolve,
			});
		});
	}

	[Symbol.observable]() { return this }

	static get [Symbol.species]() { return this }

	// == Derived ==

	static from(x) {

		let C = typeof this === "function" ? this : Observable;

		if (x == null)
			throw new TypeError(x + " is not an object");

		let method = getMethod(x, Symbol.observable);

		if (method) {

			let observable = method.call(x);

			if (Object(observable) !== observable)
				throw new TypeError(observable + " is not an object");

			if (observable.constructor === C)
				return observable;

			return new C(observer => observable.subscribe(observer));
		}

		// TODO: Should we check for a Symbol.iterator method here?

		return new C(observer => {

			enqueueJob(_=> {

				if (observer.closed)
					return;

				// Assume that the object is iterable.  If not, then the observer
				// will receive an error.
				try {

					for (let item of x) {

						observer.next(item);

						if (observer.closed)
							return;
					}

				} catch (e) {

					// If observer.next throws an error, then the subscription will
					// be closed and the error method will simply rethrow
					observer.error(e);
					return;
				}

				observer.complete();
			});
		});
	}

	static of(...items) {

		let C = typeof this === "function" ? this : Observable;

		return new C(observer => {

			enqueueJob(_=> {

				if (observer.closed)
					return;

				for (let i = 0; i < items.length; ++i) {

					observer.next(items[i]);

					if (observer.closed)
						return;
				}

				observer.complete();
			});
		});
	}

}
