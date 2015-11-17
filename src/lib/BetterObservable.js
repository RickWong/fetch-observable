/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import {Observable} from "lib/Observable";

function isPromise (thing) {
	return (
		typeof thing === "object" &&
		typeof thing["then"] === "function" &&
		typeof thing["catch"] === "function"
	);
}

class BetterObservable extends Observable {
	map (callback) {
		if (typeof callback !== "function") {
			throw new TypeError(callback + " is not a function");
		}

		let parentSubscription  = null;
		let childObservers      = [];

		const createParentSubscription = () => {
			if (parentSubscription) {
				return;
			}

			parentSubscription = this.subscribe({
				next (value) {
					try {
						value = callback(value);
					}
					catch (e) {
						return childObservers.map((o) => o.error(e));
					}

					// Support Promises.
					if (isPromise(value)) {
						return value.then(
							(v) => childObservers.map((o) => o.next(v))
						).catch(
							(e) => childObservers.map((o) => o.error(e))
						);
					}

					childObservers.map((o) => o.next(value));
				},
				error:    (e) => childObservers.map((o) => o.error(e)),
				complete: () => childObservers.map((o) => o.complete())
			});
		};

		const destroyParentSubscription = () => {
			parentSubscription && parentSubscription.unsubscribe();
			parentSubscription = null;
		};

		return new this.constructor((observer) => {
			childObservers.push(observer);
			createParentSubscription();
			
			return () => {
				childObservers.splice(childObservers.indexOf(observer), 1);

				if (!childObservers.length) {
					destroyParentSubscription();
				}
			};
		});
	}
}

module.exports = BetterObservable;
