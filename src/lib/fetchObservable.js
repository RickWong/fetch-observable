import {Observable} from "lib/Observable";

export default (target, options = {}) => {
	const {
		configInterval = 1000
	} = options;

	options = Object.assign({}, options, {
		interval: undefined
	});

	return new Observable((subscriber) => {
		let refInterval = null;

		const tick = () => {
			fetch(target, options).then((...args) => {
				if (subscriber._observer) {
					subscriber.next(...args);
				}
			});
		};

		tick();

		if (configInterval) {
			refInterval = setInterval(tick, configInterval);
		}

		return () => {
			if (refInterval) {
				clearInterval(refInterval);
				refInterval = null;
			}

			if (subscriber._observer) {
				subscriber.complete();
			}
		};
	})
}
