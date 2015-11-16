/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import {Observable} from "lib/Observable";

function isPromise (thing) {
	return Boolean(
		typeof thing === "object" &&
		typeof thing["then"] === "function" &&
		typeof thing["catch"] === "function"
	);
}

/**
 * An Observable with a better subscribe() and map().
 */
class BetterObservable extends Observable {
	subscribe (observer) {
		let subscription = super.subscribe(observer);

		/**
		 * Add method to subscription to know if it is active.
		 */
		subscription.active = () => {
			if (this.paused()) {
				return false;
			}

			if (subscription._observer === undefined) {
				return false;
			}

			if (subscription._observer._observer === undefined) {
				return false;
			}

			return true;
		};

		/**
		 * Add method that re-activates the subscription.
		 */
		subscription.resubscribe = () => {
			if (subscription.active()) {
				return;
			}

			Object.assign(subscription, this.subscribe(observer));
		};

		return subscription;
	}

	/**
	 * Overrides zen-observable's map() to support resolving Promises, and BetterObservable.
	 *
	 * @param {Function} callback
	 * @returns {BetterObservable}
	 */
	map (callback) {
		if (typeof callback !== "function") {
			throw new TypeError(callback + " is not a function");
		}

		let observers = [];
		let parentSubscription = null;

		return new this.constructor((observer) => {
			observers.push(observer);

			if (!parentSubscription) {
				parentSubscription = this.subscribe({
					next (value) {
						try {
							value = callback(value);
						}
						catch (e) {
							observers.map((observer) => observer.error(e));
							return;
						}

						if (isPromise(value)) {
							value.then(
								(v) => observers.map((observer) => observer.next(v))
							).catch(
								(e) => observers.map((observer) => observer.error(e))
							);
							return;
						}

						observers.map((observer) => observer.next(value));
					},
					error:    (e) => observers.map((observer) => observer.error(e)),
					complete: () => observers.map((observer) => observer.complete())
				});
			}
			
			return () => {
				observers.splice(observers.indexOf(observer), 1);

				if (!observers.length && parentSubscription) {
					parentSubscription.unsubscribe();
					parentSubscription = null;
				}
			};
		});
	}
}

module.exports = BetterObservable;
