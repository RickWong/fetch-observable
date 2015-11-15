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

	subscribe (...args) {
		let subscription = super.subscribe(...args);
		let _this = this;

		/**
		 * Add method that to know if the subscription is active.
		 */
		subscription.active = function () {
			return this._observer !== undefined && !_this.paused();
		};

		return subscription;
	}
}

export default PausableObservable;
