/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/actioncable/lib/assets/compiled/action_cable.js":
/*!**********************************************************************!*\
  !*** ./node_modules/actioncable/lib/assets/compiled/action_cable.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function() {\n  var context = this;\n\n  (function() {\n    (function() {\n      var slice = [].slice;\n\n      this.ActionCable = {\n        INTERNAL: {\n          \"message_types\": {\n            \"welcome\": \"welcome\",\n            \"ping\": \"ping\",\n            \"confirmation\": \"confirm_subscription\",\n            \"rejection\": \"reject_subscription\"\n          },\n          \"default_mount_path\": \"/cable\",\n          \"protocols\": [\"actioncable-v1-json\", \"actioncable-unsupported\"]\n        },\n        WebSocket: window.WebSocket,\n        logger: window.console,\n        createConsumer: function(url) {\n          var ref;\n          if (url == null) {\n            url = (ref = this.getConfig(\"url\")) != null ? ref : this.INTERNAL.default_mount_path;\n          }\n          return new ActionCable.Consumer(this.createWebSocketURL(url));\n        },\n        getConfig: function(name) {\n          var element;\n          element = document.head.querySelector(\"meta[name='action-cable-\" + name + \"']\");\n          return element != null ? element.getAttribute(\"content\") : void 0;\n        },\n        createWebSocketURL: function(url) {\n          var a;\n          if (url && !/^wss?:/i.test(url)) {\n            a = document.createElement(\"a\");\n            a.href = url;\n            a.href = a.href;\n            a.protocol = a.protocol.replace(\"http\", \"ws\");\n            return a.href;\n          } else {\n            return url;\n          }\n        },\n        startDebugging: function() {\n          return this.debugging = true;\n        },\n        stopDebugging: function() {\n          return this.debugging = null;\n        },\n        log: function() {\n          var messages, ref;\n          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];\n          if (this.debugging) {\n            messages.push(Date.now());\n            return (ref = this.logger).log.apply(ref, [\"[ActionCable]\"].concat(slice.call(messages)));\n          }\n        }\n      };\n\n    }).call(this);\n  }).call(context);\n\n  var ActionCable = context.ActionCable;\n\n  (function() {\n    (function() {\n      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };\n\n      ActionCable.ConnectionMonitor = (function() {\n        var clamp, now, secondsSince;\n\n        ConnectionMonitor.pollInterval = {\n          min: 3,\n          max: 30\n        };\n\n        ConnectionMonitor.staleThreshold = 6;\n\n        function ConnectionMonitor(connection) {\n          this.connection = connection;\n          this.visibilityDidChange = bind(this.visibilityDidChange, this);\n          this.reconnectAttempts = 0;\n        }\n\n        ConnectionMonitor.prototype.start = function() {\n          if (!this.isRunning()) {\n            this.startedAt = now();\n            delete this.stoppedAt;\n            this.startPolling();\n            document.addEventListener(\"visibilitychange\", this.visibilityDidChange);\n            return ActionCable.log(\"ConnectionMonitor started. pollInterval = \" + (this.getPollInterval()) + \" ms\");\n          }\n        };\n\n        ConnectionMonitor.prototype.stop = function() {\n          if (this.isRunning()) {\n            this.stoppedAt = now();\n            this.stopPolling();\n            document.removeEventListener(\"visibilitychange\", this.visibilityDidChange);\n            return ActionCable.log(\"ConnectionMonitor stopped\");\n          }\n        };\n\n        ConnectionMonitor.prototype.isRunning = function() {\n          return (this.startedAt != null) && (this.stoppedAt == null);\n        };\n\n        ConnectionMonitor.prototype.recordPing = function() {\n          return this.pingedAt = now();\n        };\n\n        ConnectionMonitor.prototype.recordConnect = function() {\n          this.reconnectAttempts = 0;\n          this.recordPing();\n          delete this.disconnectedAt;\n          return ActionCable.log(\"ConnectionMonitor recorded connect\");\n        };\n\n        ConnectionMonitor.prototype.recordDisconnect = function() {\n          this.disconnectedAt = now();\n          return ActionCable.log(\"ConnectionMonitor recorded disconnect\");\n        };\n\n        ConnectionMonitor.prototype.startPolling = function() {\n          this.stopPolling();\n          return this.poll();\n        };\n\n        ConnectionMonitor.prototype.stopPolling = function() {\n          return clearTimeout(this.pollTimeout);\n        };\n\n        ConnectionMonitor.prototype.poll = function() {\n          return this.pollTimeout = setTimeout((function(_this) {\n            return function() {\n              _this.reconnectIfStale();\n              return _this.poll();\n            };\n          })(this), this.getPollInterval());\n        };\n\n        ConnectionMonitor.prototype.getPollInterval = function() {\n          var interval, max, min, ref;\n          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;\n          interval = 5 * Math.log(this.reconnectAttempts + 1);\n          return Math.round(clamp(interval, min, max) * 1000);\n        };\n\n        ConnectionMonitor.prototype.reconnectIfStale = function() {\n          if (this.connectionIsStale()) {\n            ActionCable.log(\"ConnectionMonitor detected stale connection. reconnectAttempts = \" + this.reconnectAttempts + \", pollInterval = \" + (this.getPollInterval()) + \" ms, time disconnected = \" + (secondsSince(this.disconnectedAt)) + \" s, stale threshold = \" + this.constructor.staleThreshold + \" s\");\n            this.reconnectAttempts++;\n            if (this.disconnectedRecently()) {\n              return ActionCable.log(\"ConnectionMonitor skipping reopening recent disconnect\");\n            } else {\n              ActionCable.log(\"ConnectionMonitor reopening\");\n              return this.connection.reopen();\n            }\n          }\n        };\n\n        ConnectionMonitor.prototype.connectionIsStale = function() {\n          var ref;\n          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;\n        };\n\n        ConnectionMonitor.prototype.disconnectedRecently = function() {\n          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;\n        };\n\n        ConnectionMonitor.prototype.visibilityDidChange = function() {\n          if (document.visibilityState === \"visible\") {\n            return setTimeout((function(_this) {\n              return function() {\n                if (_this.connectionIsStale() || !_this.connection.isOpen()) {\n                  ActionCable.log(\"ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = \" + document.visibilityState);\n                  return _this.connection.reopen();\n                }\n              };\n            })(this), 200);\n          }\n        };\n\n        now = function() {\n          return new Date().getTime();\n        };\n\n        secondsSince = function(time) {\n          return (now() - time) / 1000;\n        };\n\n        clamp = function(number, min, max) {\n          return Math.max(min, Math.min(max, number));\n        };\n\n        return ConnectionMonitor;\n\n      })();\n\n    }).call(this);\n    (function() {\n      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,\n        slice = [].slice,\n        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },\n        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };\n\n      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;\n\n      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];\n\n      ActionCable.Connection = (function() {\n        Connection.reopenDelay = 500;\n\n        function Connection(consumer) {\n          this.consumer = consumer;\n          this.open = bind(this.open, this);\n          this.subscriptions = this.consumer.subscriptions;\n          this.monitor = new ActionCable.ConnectionMonitor(this);\n          this.disconnected = true;\n        }\n\n        Connection.prototype.send = function(data) {\n          if (this.isOpen()) {\n            this.webSocket.send(JSON.stringify(data));\n            return true;\n          } else {\n            return false;\n          }\n        };\n\n        Connection.prototype.open = function() {\n          if (this.isActive()) {\n            ActionCable.log(\"Attempted to open WebSocket, but existing socket is \" + (this.getState()));\n            return false;\n          } else {\n            ActionCable.log(\"Opening WebSocket, current state is \" + (this.getState()) + \", subprotocols: \" + protocols);\n            if (this.webSocket != null) {\n              this.uninstallEventHandlers();\n            }\n            this.webSocket = new ActionCable.WebSocket(this.consumer.url, protocols);\n            this.installEventHandlers();\n            this.monitor.start();\n            return true;\n          }\n        };\n\n        Connection.prototype.close = function(arg) {\n          var allowReconnect, ref1;\n          allowReconnect = (arg != null ? arg : {\n            allowReconnect: true\n          }).allowReconnect;\n          if (!allowReconnect) {\n            this.monitor.stop();\n          }\n          if (this.isActive()) {\n            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;\n          }\n        };\n\n        Connection.prototype.reopen = function() {\n          var error;\n          ActionCable.log(\"Reopening WebSocket, current state is \" + (this.getState()));\n          if (this.isActive()) {\n            try {\n              return this.close();\n            } catch (error1) {\n              error = error1;\n              return ActionCable.log(\"Failed to reopen WebSocket\", error);\n            } finally {\n              ActionCable.log(\"Reopening WebSocket in \" + this.constructor.reopenDelay + \"ms\");\n              setTimeout(this.open, this.constructor.reopenDelay);\n            }\n          } else {\n            return this.open();\n          }\n        };\n\n        Connection.prototype.getProtocol = function() {\n          var ref1;\n          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;\n        };\n\n        Connection.prototype.isOpen = function() {\n          return this.isState(\"open\");\n        };\n\n        Connection.prototype.isActive = function() {\n          return this.isState(\"open\", \"connecting\");\n        };\n\n        Connection.prototype.isProtocolSupported = function() {\n          var ref1;\n          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;\n        };\n\n        Connection.prototype.isState = function() {\n          var ref1, states;\n          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];\n          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;\n        };\n\n        Connection.prototype.getState = function() {\n          var ref1, state, value;\n          for (state in WebSocket) {\n            value = WebSocket[state];\n            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {\n              return state.toLowerCase();\n            }\n          }\n          return null;\n        };\n\n        Connection.prototype.installEventHandlers = function() {\n          var eventName, handler;\n          for (eventName in this.events) {\n            handler = this.events[eventName].bind(this);\n            this.webSocket[\"on\" + eventName] = handler;\n          }\n        };\n\n        Connection.prototype.uninstallEventHandlers = function() {\n          var eventName;\n          for (eventName in this.events) {\n            this.webSocket[\"on\" + eventName] = function() {};\n          }\n        };\n\n        Connection.prototype.events = {\n          message: function(event) {\n            var identifier, message, ref1, type;\n            if (!this.isProtocolSupported()) {\n              return;\n            }\n            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;\n            switch (type) {\n              case message_types.welcome:\n                this.monitor.recordConnect();\n                return this.subscriptions.reload();\n              case message_types.ping:\n                return this.monitor.recordPing();\n              case message_types.confirmation:\n                return this.subscriptions.notify(identifier, \"connected\");\n              case message_types.rejection:\n                return this.subscriptions.reject(identifier);\n              default:\n                return this.subscriptions.notify(identifier, \"received\", message);\n            }\n          },\n          open: function() {\n            ActionCable.log(\"WebSocket onopen event, using '\" + (this.getProtocol()) + \"' subprotocol\");\n            this.disconnected = false;\n            if (!this.isProtocolSupported()) {\n              ActionCable.log(\"Protocol is unsupported. Stopping monitor and disconnecting.\");\n              return this.close({\n                allowReconnect: false\n              });\n            }\n          },\n          close: function(event) {\n            ActionCable.log(\"WebSocket onclose event\");\n            if (this.disconnected) {\n              return;\n            }\n            this.disconnected = true;\n            this.monitor.recordDisconnect();\n            return this.subscriptions.notifyAll(\"disconnected\", {\n              willAttemptReconnect: this.monitor.isRunning()\n            });\n          },\n          error: function() {\n            return ActionCable.log(\"WebSocket onerror event\");\n          }\n        };\n\n        return Connection;\n\n      })();\n\n    }).call(this);\n    (function() {\n      var slice = [].slice;\n\n      ActionCable.Subscriptions = (function() {\n        function Subscriptions(consumer) {\n          this.consumer = consumer;\n          this.subscriptions = [];\n        }\n\n        Subscriptions.prototype.create = function(channelName, mixin) {\n          var channel, params, subscription;\n          channel = channelName;\n          params = typeof channel === \"object\" ? channel : {\n            channel: channel\n          };\n          subscription = new ActionCable.Subscription(this.consumer, params, mixin);\n          return this.add(subscription);\n        };\n\n        Subscriptions.prototype.add = function(subscription) {\n          this.subscriptions.push(subscription);\n          this.consumer.ensureActiveConnection();\n          this.notify(subscription, \"initialized\");\n          this.sendCommand(subscription, \"subscribe\");\n          return subscription;\n        };\n\n        Subscriptions.prototype.remove = function(subscription) {\n          this.forget(subscription);\n          if (!this.findAll(subscription.identifier).length) {\n            this.sendCommand(subscription, \"unsubscribe\");\n          }\n          return subscription;\n        };\n\n        Subscriptions.prototype.reject = function(identifier) {\n          var i, len, ref, results, subscription;\n          ref = this.findAll(identifier);\n          results = [];\n          for (i = 0, len = ref.length; i < len; i++) {\n            subscription = ref[i];\n            this.forget(subscription);\n            this.notify(subscription, \"rejected\");\n            results.push(subscription);\n          }\n          return results;\n        };\n\n        Subscriptions.prototype.forget = function(subscription) {\n          var s;\n          this.subscriptions = (function() {\n            var i, len, ref, results;\n            ref = this.subscriptions;\n            results = [];\n            for (i = 0, len = ref.length; i < len; i++) {\n              s = ref[i];\n              if (s !== subscription) {\n                results.push(s);\n              }\n            }\n            return results;\n          }).call(this);\n          return subscription;\n        };\n\n        Subscriptions.prototype.findAll = function(identifier) {\n          var i, len, ref, results, s;\n          ref = this.subscriptions;\n          results = [];\n          for (i = 0, len = ref.length; i < len; i++) {\n            s = ref[i];\n            if (s.identifier === identifier) {\n              results.push(s);\n            }\n          }\n          return results;\n        };\n\n        Subscriptions.prototype.reload = function() {\n          var i, len, ref, results, subscription;\n          ref = this.subscriptions;\n          results = [];\n          for (i = 0, len = ref.length; i < len; i++) {\n            subscription = ref[i];\n            results.push(this.sendCommand(subscription, \"subscribe\"));\n          }\n          return results;\n        };\n\n        Subscriptions.prototype.notifyAll = function() {\n          var args, callbackName, i, len, ref, results, subscription;\n          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];\n          ref = this.subscriptions;\n          results = [];\n          for (i = 0, len = ref.length; i < len; i++) {\n            subscription = ref[i];\n            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));\n          }\n          return results;\n        };\n\n        Subscriptions.prototype.notify = function() {\n          var args, callbackName, i, len, results, subscription, subscriptions;\n          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];\n          if (typeof subscription === \"string\") {\n            subscriptions = this.findAll(subscription);\n          } else {\n            subscriptions = [subscription];\n          }\n          results = [];\n          for (i = 0, len = subscriptions.length; i < len; i++) {\n            subscription = subscriptions[i];\n            results.push(typeof subscription[callbackName] === \"function\" ? subscription[callbackName].apply(subscription, args) : void 0);\n          }\n          return results;\n        };\n\n        Subscriptions.prototype.sendCommand = function(subscription, command) {\n          var identifier;\n          identifier = subscription.identifier;\n          return this.consumer.send({\n            command: command,\n            identifier: identifier\n          });\n        };\n\n        return Subscriptions;\n\n      })();\n\n    }).call(this);\n    (function() {\n      ActionCable.Subscription = (function() {\n        var extend;\n\n        function Subscription(consumer, params, mixin) {\n          this.consumer = consumer;\n          if (params == null) {\n            params = {};\n          }\n          this.identifier = JSON.stringify(params);\n          extend(this, mixin);\n        }\n\n        Subscription.prototype.perform = function(action, data) {\n          if (data == null) {\n            data = {};\n          }\n          data.action = action;\n          return this.send(data);\n        };\n\n        Subscription.prototype.send = function(data) {\n          return this.consumer.send({\n            command: \"message\",\n            identifier: this.identifier,\n            data: JSON.stringify(data)\n          });\n        };\n\n        Subscription.prototype.unsubscribe = function() {\n          return this.consumer.subscriptions.remove(this);\n        };\n\n        extend = function(object, properties) {\n          var key, value;\n          if (properties != null) {\n            for (key in properties) {\n              value = properties[key];\n              object[key] = value;\n            }\n          }\n          return object;\n        };\n\n        return Subscription;\n\n      })();\n\n    }).call(this);\n    (function() {\n      ActionCable.Consumer = (function() {\n        function Consumer(url) {\n          this.url = url;\n          this.subscriptions = new ActionCable.Subscriptions(this);\n          this.connection = new ActionCable.Connection(this);\n        }\n\n        Consumer.prototype.send = function(data) {\n          return this.connection.send(data);\n        };\n\n        Consumer.prototype.connect = function() {\n          return this.connection.open();\n        };\n\n        Consumer.prototype.disconnect = function() {\n          return this.connection.close({\n            allowReconnect: false\n          });\n        };\n\n        Consumer.prototype.ensureActiveConnection = function() {\n          if (!this.connection.isActive()) {\n            return this.connection.open();\n          }\n        };\n\n        return Consumer;\n\n      })();\n\n    }).call(this);\n  }).call(this);\n\n  if ( true && module.exports) {\n    module.exports = ActionCable;\n  } else if (true) {\n    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (ActionCable),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :\n\t\t\t\t__WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n  }\n}).call(this);\n\n\n//# sourceURL=webpack:///./node_modules/actioncable/lib/assets/compiled/action_cable.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var actioncable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! actioncable */ \"./node_modules/actioncable/lib/assets/compiled/action_cable.js\");\n/* harmony import */ var actioncable__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(actioncable__WEBPACK_IMPORTED_MODULE_0__);\n\n\ndocument.addEventListener(\"DOMContentLoaded\",() => {\n\n  let button = document.querySelector(\"#trigger-button\")\n  let alert = document.querySelector(\"#alert\")\n\n  window.App || (window.App = {})\n\n  App.cable = actioncable__WEBPACK_IMPORTED_MODULE_0___default.a.createConsumer(\"wss://javascript-project-gyro-back.herokuapp.com/cable\")\n  App.message = App.cable.subscriptions.create(\"GameChannel\", {\n    received: function(data){\n      alert.innerText = data[\"body\"][\"coor\"]\n    },\n    sendMessage: function(messageBody){\n      this.perform('button_pressed', {body: messageBody})\n    }\n  })\n\n\n  window.addEventListener(\"mousemove\", event => {\n    var x = event.clientX;     // Get the horizontal coordinate\n    var y = event.clientY;     // Get the vertical coordinate\n    var coor = \"X coords: \" + x + \", Y coords: \" + y;\n\n    App.message.sendMessage({button_pressed: true, coor: coor})\n  })\n\n  \n\n  button.addEventListener(\"click\", event => {\n    App.message.sendMessage({button_pressed: true})\n  })\n\n})\n\n\n\n\n\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });