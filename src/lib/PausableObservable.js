/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import {Observable} from "lib/Observable";

/**
 * An Observable that can be paused and resumed.
 */
class PausableObservable extends Observable {
	constructor (subscriber, options = {}) {
		super(subscriber);

		this.options = options;
		this.state   = "paused";
	}

	pause (...args) {
		this.state = "paused";

		if (this.options.onPause) {
			this.options.onPause.apply(this, args);
		}

		return this;
	}

	resume (...args) {
		this.state = "resumed";

		if (this.options.onResume) {
			this.options.onResume.apply(this, args);
		}

		return this;
	}

	paused () {
		return this.state === "paused";
	}

	subscribe (observer) {
		let subscription = super.subscribe(observer);
		let _this = this;

		/**
		 * Add method to know if the subscription is active.
		 */
		subscription.active = function () {
			if (_this.paused()) {
				return false;
			}

			if (this._observer === undefined) {
				return false;
			}

			if (this._observer._observer === undefined) {
				return false;
			}

			return true;
		};

		/**
		 * Add method that re-activates the subscription.
		 */
		subscription.resubscribe = function () {
			if (this.active()) {
				return;
			}

			Object.assign(this, _this.subscribe(observer));
		};

		return subscription;
	}
}

export default PausableObservable;
