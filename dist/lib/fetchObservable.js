(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["fetchObservable"] = factory();
	else
		root["fetchObservable"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
	                                                                                                                                                                                                                                                                   * @copyright © 2015, Rick Wong. All rights reserved.
	                                                                                                                                                                                                                                                                   */

	var _PausableObservable = __webpack_require__(3);

	var _PausableObservable2 = _interopRequireDefault(_PausableObservable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function isString(thing) {
		return typeof thing === "string";
	}

	function isFunction(thing) {
		return typeof thing === "function";
	}

	/**
	 * Calls the Fetch API and returns an Observable.
	 *
	 * @param {string|string[]} urls  URL or URLs array.
	 * @param {object} options
	 * @returns {PausableObservable|Observable}
	 */
	function fetchObservable(urls) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
		var _options$refreshDelay = options.refreshDelay;
		var refreshDelay = _options$refreshDelay === undefined ? false : _options$refreshDelay;

		var fetchFunc = options.fetch || fetch;

		var observers = [];
		var timeout = null;
		var singleResult = false;
		var iteration = 0;

		if (singleResult = isString(urls)) {
			urls = [urls];
		}

		var performFetch = function performFetch() {
			// Don't do anything if there are no observers.
			if (observers.length === 0 || observable.paused()) {
				return;
			}

			var _finally = function _finally() {
				// If refreshing is disabled, complete observers and pause observable.
				if (!refreshDelay) {
					observable.pause();
					observers.map(function (observer) {
						return observer.complete();
					});
					observers = [];
				}
				// If refreshing is enabled, set a timeout.
				else {
						timeout = setTimeout(performFetch, isFunction(refreshDelay) ? refreshDelay(iteration++) : refreshDelay);
					}
			};

			// Map all URLs to Fetch API calls.
			var fetches = urls.map(function (url) {
				return fetchFunc(url, _extends({}, options, { refreshDelay: undefined, fetch: undefined }));
			});

			// Wait for all the results to come in, then notify observers.
			Promise.all(fetches).then(function (results) {
				observers.map(function (observer) {
					return observer.next(singleResult ? results[0] : results);
				});
				_finally();
			}).catch(function (error) {
				observers.map(function (observer) {
					return observer.error(error);
				});
				_finally();
			});
		};

		var observable = new _PausableObservable2.default(function (observer) {
			observers.push(observer);
			observable.resume();

			return function () {
				observers.splice(observers.indexOf(observer), 1);

				if (!observers.length) {
					observable.pause();
				}
			};
		}, {
			onPause: function onPause() {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
			},
			onResume: function onResume() {
				if (!timeout) {
					performFetch();
				}
			}
		});

		return observable;
	}

	module.exports = fetchObservable;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _Observable2 = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; } /**
	                                                                                                                              * @copyright © 2015, Rick Wong. All rights reserved.
	                                                                                                                              */

	function isPromise(thing) {
		return (typeof thing === "undefined" ? "undefined" : _typeof(thing)) === "object" && typeof thing["then"] === "function" && typeof thing["catch"] === "function";
	}

	var BetterObservable = (function (_Observable) {
		_inherits(BetterObservable, _Observable);

		function BetterObservable() {
			_classCallCheck(this, BetterObservable);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(BetterObservable).apply(this, arguments));
		}

		_createClass(BetterObservable, [{
			key: "map",
			value: function map(callback) {
				var _this2 = this;

				if (typeof callback !== "function") {
					throw new TypeError(callback + " is not a function");
				}

				var parentSubscription = null;
				var childObservers = [];

				var createParentSubscription = function createParentSubscription() {
					if (parentSubscription) {
						return;
					}

					parentSubscription = _this2.subscribe({
						next: function next(value) {
							try {
								value = callback(value);
							} catch (e) {
								return childObservers.map(function (o) {
									return o.error(e);
								});
							}

							// Support Promises.
							if (isPromise(value)) {
								return value.then(function (v) {
									return childObservers.map(function (o) {
										return o.next(v);
									});
								}).catch(function (e) {
									return childObservers.map(function (o) {
										return o.error(e);
									});
								});
							}

							childObservers.map(function (o) {
								return o.next(value);
							});
						},

						error: function error(e) {
							return childObservers.map(function (o) {
								return o.error(e);
							});
						},
						complete: function complete() {
							return childObservers.map(function (o) {
								return o.complete();
							});
						}
					});
				};

				var destroyParentSubscription = function destroyParentSubscription() {
					parentSubscription && parentSubscription.unsubscribe();
					parentSubscription = null;
				};

				return new this.constructor(function (observer) {
					childObservers.push(observer);
					createParentSubscription();

					return function () {
						childObservers.splice(childObservers.indexOf(observer), 1);

						if (!childObservers.length) {
							destroyParentSubscription();
						}
					};
				});
			}
		}]);

		return BetterObservable;
	})(_Observable2.Observable);

	module.exports = BetterObservable;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Observable = Observable;

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	/**
	 * Observable.js from zenparsing/zen-observable
	 *
	 * @copyright © zenparsing
	 * @homepage https://github.com/zenparsing/zen-observable
	 * @file https://github.com/zenparsing/zen-observable/blob/de80d63fb166421226bb3c918b111cac40bd672a/src/Observable.js
	 */
	// === Non-Promise Job Queueing ===

	var enqueueJob = (function () {

		// Node
		if (typeof global !== "undefined" && typeof process !== "undefined" && process.nextTick) {

			return global.setImmediate ? function (fn) {
				global.setImmediate(fn);
			} : function (fn) {
				process.nextTick(fn);
			};
		}

		// Newish Browsers
		var Observer = self.MutationObserver || self.WebKitMutationObserver;

		if (Observer) {
			var _ret = (function () {

				var div = document.createElement("div"),
				    twiddle = function twiddle(_) {
					return div.classList.toggle("x");
				},
				    queue = [];

				var observer = new Observer(function (_) {

					if (queue.length > 1) twiddle();

					while (queue.length > 0) {
						queue.shift()();
					}
				});

				observer.observe(div, { attributes: true });

				return {
					v: function v(fn) {

						queue.push(fn);

						if (queue.length === 1) twiddle();
					}
				};
			})();

			if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
		}

		// Fallback
		return function (fn) {
			setTimeout(fn, 0);
		};
	})();

	// === Symbol Polyfills ===

	function polyfillSymbol(name) {

		if (symbolsSupported() && !Symbol[name]) Object.defineProperty(Symbol, name, { value: Symbol(name) });
	}

	function symbolsSupported() {

		return typeof Symbol === "function";
	}

	function hasSymbol(name) {

		return symbolsSupported() && Boolean(Symbol[name]);
	}

	function getSymbol(name) {

		return hasSymbol(name) ? Symbol[name] : "@@" + name;
	}

	polyfillSymbol("observable");

	// === Abstract Operations ===

	function getMethod(obj, key) {

		var value = obj[key];

		if (value == null) return undefined;

		if (typeof value !== "function") throw new TypeError(value + " is not a function");

		return value;
	}

	function getSpecies(ctor) {

		var symbol = getSymbol("species");
		return symbol ? ctor[symbol] : ctor;
	}

	function addMethods(target, methods) {

		Object.keys(methods).forEach(function (k) {

			var desc = Object.getOwnPropertyDescriptor(methods, k);
			desc.enumerable = false;
			Object.defineProperty(target, k, desc);
		});
	}

	function cleanupSubscription(observer) {

		// Assert:  observer._observer is undefined

		var cleanup = observer._cleanup;

		if (!cleanup) return;

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

		if (subscriptionClosed(observer)) return;

		observer._observer = undefined;
		cleanupSubscription(observer);
	}

	function cleanupFromSubscription(subscription) {
		// TODO:  Should we get the method out and apply it here, instead of
		// looking up the method at call time?
		return function (_) {
			subscription.unsubscribe();
		};
	}

	function createSubscription(observer, subscriber) {

		// Assert: subscriber is callable

		// The observer must be an object
		if (Object(observer) !== observer) throw new TypeError("Observer must be an object");

		// TODO: Should we check for a "next" method here?

		var subscriptionObserver = new SubscriptionObserver(observer),
		    subscription = new Subscription(subscriptionObserver),
		    start = getMethod(observer, "start");

		if (start) start.call(observer, subscription);

		if (subscriptionClosed(subscriptionObserver)) return subscription;

		try {

			// Call the subscriber function
			var cleanup = subscriber.call(undefined, subscriptionObserver);

			// The return value must be undefined, null, a subscription object, or a function
			if (cleanup != null) {

				if (typeof cleanup.unsubscribe === "function") cleanup = cleanupFromSubscription(cleanup);else if (typeof cleanup !== "function") throw new TypeError(cleanup + " is not a function");

				subscriptionObserver._cleanup = cleanup;
			}
		} catch (e) {

			// If an error occurs during startup, then attempt to send the error
			// to the observer
			subscriptionObserver.error(e);
			return subscription;
		}

		// If the stream is already finished, then perform cleanup
		if (subscriptionClosed(subscriptionObserver)) cleanupSubscription(subscriptionObserver);

		return subscription;
	}

	function SubscriptionObserver(observer) {

		this._observer = observer;
		this._cleanup = undefined;
	}

	addMethods(SubscriptionObserver.prototype = {}, {

		get closed() {
			return subscriptionClosed(this);
		},

		next: function next(value) {

			// If the stream if closed, then return undefined
			if (subscriptionClosed(this)) return undefined;

			var observer = this._observer;

			try {

				var m = getMethod(observer, "next");

				// If the observer doesn't support "next", then return undefined
				if (!m) return undefined;

				// Send the next value to the sink
				return m.call(observer, value);
			} catch (e) {

				// If the observer throws, then close the stream and rethrow the error
				try {
					closeSubscription(this);
				} finally {
					throw e;
				}
			}
		},
		error: function error(value) {

			// If the stream is closed, throw the error to the caller
			if (subscriptionClosed(this)) throw value;

			var observer = this._observer;
			this._observer = undefined;

			try {

				var m = getMethod(observer, "error");

				// If the sink does not support "error", then throw the error to the caller
				if (!m) throw value;

				value = m.call(observer, value);
			} catch (e) {

				try {
					cleanupSubscription(this);
				} finally {
					throw e;
				}
			}

			cleanupSubscription(this);

			return value;
		},
		complete: function complete(value) {

			// If the stream is closed, then return undefined
			if (subscriptionClosed(this)) return undefined;

			var observer = this._observer;
			this._observer = undefined;

			try {

				var m = getMethod(observer, "complete");

				// If the sink does not support "complete", then return undefined
				value = m ? m.call(observer, value) : undefined;
			} catch (e) {

				try {
					cleanupSubscription(this);
				} finally {
					throw e;
				}
			}

			cleanupSubscription(this);

			return value;
		}
	});

	function Subscription(observer) {
		this._observer = observer;
	}

	addMethods(Subscription.prototype = {}, {
		unsubscribe: function unsubscribe() {
			closeSubscription(this._observer);
		}
	});

	function Observable(subscriber) {

		// The stream subscriber must be a function
		if (typeof subscriber !== "function") throw new TypeError("Observable initializer must be a function");

		this._subscriber = subscriber;
	}

	addMethods(Observable.prototype, {
		subscribe: function subscribe(observer) {

			return createSubscription(observer, this._subscriber);
		},
		forEach: function forEach(fn) {
			var _this = this;

			return new Promise(function (resolve, reject) {

				if (typeof fn !== "function") throw new TypeError(fn + " is not a function");

				_this.subscribe({
					next: function next(value) {

						try {
							return fn(value);
						} catch (e) {
							reject(e);
						}
					},

					error: reject,
					complete: resolve
				});
			});
		},
		map: function map(fn) {
			var _this2 = this;

			if (typeof fn !== "function") throw new TypeError(fn + " is not a function");

			var C = getSpecies(this.constructor);

			return new C(function (observer) {
				return _this2.subscribe({
					next: function next(value) {

						try {
							value = fn(value);
						} catch (e) {
							return observer.error(e);
						}

						return observer.next(value);
					},
					error: function error(value) {
						return observer.error(value);
					},
					complete: function complete(value) {
						return observer.complete(value);
					}
				});
			});
		},
		filter: function filter(fn) {
			var _this3 = this;

			if (typeof fn !== "function") throw new TypeError(fn + " is not a function");

			var C = getSpecies(this.constructor);

			return new C(function (observer) {
				return _this3.subscribe({
					next: function next(value) {

						try {
							if (!fn(value)) return undefined;
						} catch (e) {
							return observer.error(e);
						}

						return observer.next(value);
					},
					error: function error(value) {
						return observer.error(value);
					},
					complete: function complete(value) {
						return observer.complete(value);
					}
				});
			});
		}
	});

	Object.defineProperty(Observable.prototype, getSymbol("observable"), {
		value: function value() {
			return this;
		},
		writable: true,
		configurable: true
	});

	addMethods(Observable, {
		from: function from(x) {

			var C = typeof this === "function" ? this : Observable;

			if (x == null) throw new TypeError(x + " is not an object");

			var method = getMethod(x, getSymbol("observable"));

			if (method) {
				var _ret2 = (function () {

					var observable = method.call(x);

					if (Object(observable) !== observable) throw new TypeError(observable + " is not an object");

					if (observable.constructor === C) return {
							v: observable
						};

					return {
						v: new C(function (observer) {
							return observable.subscribe(observer);
						})
					};
				})();

				if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
			}

			return new C(function (observer) {

				enqueueJob(function (_) {

					if (observer.closed) return;

					// Assume that the object is iterable.  If not, then the observer
					// will receive an error.
					try {

						if (hasSymbol("iterator")) {
							var _iteratorNormalCompletion = true;
							var _didIteratorError = false;
							var _iteratorError = undefined;

							try {

								for (var _iterator = x[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
									var item = _step.value;

									observer.next(item);

									if (observer.closed) return;
								}
							} catch (err) {
								_didIteratorError = true;
								_iteratorError = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion && _iterator.return) {
										_iterator.return();
									}
								} finally {
									if (_didIteratorError) {
										throw _iteratorError;
									}
								}
							}
						} else {

							if (!Array.isArray(x)) throw new Error(x + " is not an Array");

							for (var i = 0; i < x.length; ++i) {

								observer.next(x[i]);

								if (observer.closed) return;
							}
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
		},
		of: function of() {
			for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
				items[_key] = arguments[_key];
			}

			var C = typeof this === "function" ? this : Observable;

			return new C(function (observer) {

				enqueueJob(function (_) {

					if (observer.closed) return;

					for (var i = 0; i < items.length; ++i) {

						observer.next(items[i]);

						if (observer.closed) return;
					}

					observer.complete();
				});
			});
		}
	});

	Object.defineProperty(Observable, getSymbol("species"), {
		get: function get() {
			return this;
		},

		configurable: true
	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(4)))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _BetterObservable2 = __webpack_require__(1);

	var _BetterObservable3 = _interopRequireDefault(_BetterObservable2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @copyright © 2015, Rick Wong. All rights reserved.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var PausableObservable = (function (_BetterObservable) {
		_inherits(PausableObservable, _BetterObservable);

		function PausableObservable(subscriber) {
			var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			var onPause = _ref.onPause;
			var onResume = _ref.onResume;

			_classCallCheck(this, PausableObservable);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PausableObservable).call(this, subscriber));

			_this.state = "paused";

			_this.onPause = onPause;
			_this.onResume = onResume;
			return _this;
		}

		_createClass(PausableObservable, [{
			key: "pause",
			value: function pause() {
				this.state = "paused";

				return this.onPause && this.onPause.apply(this, arguments);
			}
		}, {
			key: "resume",
			value: function resume() {
				this.state = "resumed";

				return this.onResume && this.onResume.apply(this, arguments);
			}
		}, {
			key: "paused",
			value: function paused() {
				return this.state === "paused";
			}
		}, {
			key: "map",
			value: function map(callback) {
				var _this2 = this;

				var pausableObservable = _get(Object.getPrototypeOf(PausableObservable.prototype), "map", this).call(this, callback);

				// Child observable must track parent's state, so bind its pause, resume, and paused.
				Object.assign(pausableObservable, {
					pause: function pause() {
						return _this2.pause.apply(_this2, arguments);
					},
					resume: function resume() {
						return _this2.resume.apply(_this2, arguments);
					},
					paused: function paused() {
						return _this2.paused();
					}
				});

				return pausableObservable;
			}
		}]);

		return PausableObservable;
	})(_BetterObservable3.default);

	module.exports = PausableObservable;

/***/ },
/* 4 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }
/******/ ])
});
;