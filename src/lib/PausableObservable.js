/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import BetterObservable from "lib/BetterObservable";

class PausableObservable extends BetterObservable {
	constructor (subscriber, {onPause, onResume} = {}) {
		super(subscriber);

		this.state = "paused";

		this.onPause  = onPause;
		this.onResume = onResume;
	}

	pause (...args) {
		this.state = "paused";

		return this.onPause && this.onPause(...args);
	}

	resume (...args) {
		this.state = "resumed";

		return this.onResume && this.onResume(...args);
	}

	paused () {
		return this.state === "paused";
	}

	map (callback) {
		const pausableObservable = super.map(callback);

		// Child observable must track parent's state, so bind its pause, resume, and paused.
		Object.assign(pausableObservable, {
			pause: (...args) => this.pause(...args),
			resume: (...args) => this.resume(...args),
			paused: () => this.paused()
		});

		return pausableObservable;
	}
}

module.exports = PausableObservable;
