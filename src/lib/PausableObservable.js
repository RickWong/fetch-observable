/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import BetterObservable from "lib/BetterObservable";

/**
 * An Observable that can be paused and resumed.
 */
class PausableObservable extends BetterObservable {
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

	getState () {
		return this.state;
	}

	paused () {
		return this.getState() === "paused";
	}

	/**
	 * Overrides zen-observable's map() to support pause(), resume(), paused() and getState().
	 *
	 * @param {Function} callback
	 * @returns {PausableObservable|BetterObservable|Observable}
	 */
	map (callback) {
		const pausableObservable = super.map(callback);

		Object.assign(pausableObservable, {
			options: this.options,
			getState: () => this.getState()
		});

		return pausableObservable;
	}
}

module.exports = PausableObservable;
