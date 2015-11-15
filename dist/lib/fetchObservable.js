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

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _isomorphicFetch = __webpack_require__(3);

	var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

	var _PausableObservable = __webpack_require__(2);

	var _PausableObservable2 = _interopRequireDefault(_PausableObservable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @copyright © 2015, Rick Wong. All rights reserved.
	 */

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

		var subscribers = [];
		var timeout = null;
		var singleResult = false;
		var iteration = 0;

		if (singleResult = isString(urls)) {
			urls = [urls];
		}

		var performFetch = function performFetch() {
			// Don't do anything if there are no subscribers.
			if (subscribers.length === 0 || observable.paused()) {
				return;
			}

			var _finally = function _finally() {
				// If refreshing is disabled, complete subscribers and pause observable.
				if (!refreshDelay) {
					observable.pause();
					subscribers.map(function (subscriber) {
						return subscriber.complete();
					});
					subscribers = [];
				}
				// If refreshing is enabled, set a timeout.
				else {
						timeout = setTimeout(performFetch, isFunction(refreshDelay) ? refreshDelay(iteration++) : refreshDelay);
					}
			};

			var fetches = urls.map(function (url) {
				return fetch(url, options);
			});

			Promise.all(fetches).then(function (results) {
				subscribers.map(function (subscriber) {
					return subscriber.next(singleResult ? results[0] : results);
				});
				_finally();
			}).catch(function (results) {
				subscribers.map(function (subscriber) {
					return subscriber.error(singleResult ? results[0] : results);
				});
				_finally();
			});
		};

		var observable = new _PausableObservable2.default(function (subscriber) {
			subscribers.push(subscriber);

			if (subscribers.length) {
				observable.resume();
			}

			return function () {
				subscribers.splice(subscribers.indexOf(subscriber), 1);

				if (!subscribers.length) {
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

		observable.resume();

		return observable;
	}

	exports.default = fetchObservable;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	/**
	 * Observable.js from zenparsing/es-observable.
	 *
	 * @copyright © zenparsing
	 * @homepage https://github.com/zenparsing/es-observable
	 * @file https://github.com/zenparsing/es-observable/blob/bed0248bf84818bbda26c051f156e51ab9f7671e/src/Observable.js
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

		if (!Symbol[name]) Object.defineProperty(Symbol, name, { value: Symbol(name) });
	}

	polyfillSymbol("observable");

	// === Abstract Operations ===

	function nonEnum(obj) {

		Object.getOwnPropertyNames(obj).forEach(function (k) {
			Object.defineProperty(obj, k, { enumerable: false });
		});

		return obj;
	}

	function getMethod(obj, key) {

		var value = obj[key];

		if (value == null) return undefined;

		if (typeof value !== "function") throw new TypeError(value + " is not a function");

		return value;
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
		return function (_) {
			subscription.unsubscribe();
		};
	}

	function createSubscription(observer, subscriber) {

		// Assert: subscriber is callable

		// The observer must be an object
		if (Object(observer) !== observer) throw new TypeError("Observer must be an object");

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

	SubscriptionObserver.prototype = nonEnum({

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

	Subscription.prototype = nonEnum({
		unsubscribe: function unsubscribe() {
			closeSubscription(this._observer);
		}
	});

	var Observable = exports.Observable = (function () {

		// == Fundamental ==

		function Observable(subscriber) {
			_classCallCheck(this, Observable);

			// The stream subscriber must be a function
			if (typeof subscriber !== "function") throw new TypeError("Observable initializer must be a function");

			this._subscriber = subscriber;
		}

		_createClass(Observable, [{
			key: "subscribe",
			value: function subscribe(observer) {

				return createSubscription(observer, this._subscriber);
			}
		}, {
			key: "forEach",
			value: function forEach(fn) {
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
			}
		}, {
			key: Symbol.observable,
			value: function value() {
				return this;
			}
		}], [{
			key: "from",

			// == Derived ==

			value: function from(x) {

				var C = typeof this === "function" ? this : Observable;

				if (x == null) throw new TypeError(x + " is not an object");

				var method = getMethod(x, Symbol.observable);

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

				// TODO: Should we check for a Symbol.iterator method here?

				return new C(function (observer) {

					enqueueJob(function (_) {

						if (observer.closed) return;

						// Assume that the object is iterable.  If not, then the observer
						// will receive an error.
						try {
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
		}, {
			key: "of",
			value: function of() {
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
		}, {
			key: Symbol.species,
			get: function get() {
				return this;
			}
		}]);

		return Observable;
	})();
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(4)))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _Observable2 = __webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @copyright © 2015, Rick Wong. All rights reserved.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	/**
	 * An Observable that can be paused and resumed.
	 */

	var PausableObservable = (function (_Observable) {
		_inherits(PausableObservable, _Observable);

		function PausableObservable(subscriber) {
			var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			_classCallCheck(this, PausableObservable);

			var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(PausableObservable).call(this, subscriber));

			_this2.options = options;
			_this2.state = "paused";
			return _this2;
		}

		_createClass(PausableObservable, [{
			key: "pause",
			value: function pause() {
				this.state = "paused";

				if (this.options.onPause) {
					for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
						args[_key] = arguments[_key];
					}

					this.options.onPause.apply(this, args);
				}

				return this;
			}
		}, {
			key: "resume",
			value: function resume() {
				this.state = "resumed";

				if (this.options.onResume) {
					for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
						args[_key2] = arguments[_key2];
					}

					this.options.onResume.apply(this, args);
				}

				return this;
			}
		}, {
			key: "paused",
			value: function paused() {
				return this.state === "paused";
			}
		}, {
			key: "subscribe",
			value: function subscribe(observer) {
				var subscription = _get(Object.getPrototypeOf(PausableObservable.prototype), "subscribe", this).call(this, observer);
				var _this = this;

				/**
	    * Add method to know if the subscription is active.
	    */
				subscription.active = function () {
					return this._observer !== undefined && !_this.paused();
				};

				/**
	    * Add method that re-activates this observable.
	    */
				subscription.resubscribe = function () {
					if (this.active()) {
						return false;
					}

					return _this.subscribe(observer);
				};

				return subscription;
			}
		}]);

		return PausableObservable;
	})(_Observable2.Observable);

	exports.default = PausableObservable;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// the whatwg-fetch polyfill installs the fetch() function
	// on the global object (window or self)
	//
	// Return that as the export for use in Webpack, Browserify etc.
	__webpack_require__(5);
	module.exports = self.fetch.bind(self);


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


/***/ },
/* 5 */
/***/ function(module, exports) {

	(function() {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }

	  function Headers(headers) {
	    this.map = {}

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)

	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }

	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }

	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }

	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }

	  var support = {
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob();
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }

	  function Body() {
	    this.bodyUsed = false


	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (!body) {
	        this._bodyText = ''
	      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	        // Only support ArrayBuffers for POST method.
	        // Receiving ArrayBuffers happens via Blobs, instead.
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	    }

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }

	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }

	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = input
	    }

	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }

	  Request.prototype.clone = function() {
	    return new Request(this)
	  }

	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }

	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }

	  Body.call(Request.prototype)

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }

	    this._initBody(bodyInit)
	    this.type = 'default'
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	  }

	  Body.call(Response.prototype)

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }

	  var redirectStatuses = [301, 302, 303, 307, 308]

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  }

	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;

	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input
	      } else {
	        request = new Request(input, init)
	      }

	      var xhr = new XMLHttpRequest()

	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }

	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }

	        return;
	      }

	      xhr.onload = function() {
	        var status = (xhr.status === 1223) ? 204 : xhr.status
	        if (status < 100 || status > 599) {
	          reject(new TypeError('Network request failed'))
	          return
	        }
	        var options = {
	          status: status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options))
	      }

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.open(request.method, request.url, true)

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})();


/***/ }
/******/ ])
});
;