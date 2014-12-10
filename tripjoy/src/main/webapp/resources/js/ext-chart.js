Ext.define("Ext.data.Writer", {
	alias : "writer.base",
	constructor : function(a) {
		Ext.apply(this, a)
	},
	write : function(f) {
		var b = f.operation, a = b.records || [], e = a.length, d = 0, g = [];
		for (; d < e; d++) {
			g.push(this.getRecordData(a[d]))
		}
		return this.writeRecords(f, g)
	},
	getRecordData : function(a) {
		return a.data
	}
});
Ext.define("Ext.data.JsonWriter", {
	extend : "Ext.data.Writer",
	alias : "writer.json",
	root : "records",
	encode : false,
	writeRecords : function(a, b) {
		if (this.encode === true) {
			b = Ext.encode(b)
		}
		a.jsonData = a.jsonData || {};
		a.jsonData[this.root] = b;
		return a
	}
});
Ext
		.define(
				"Ext.util.Sorter",
				{
					direction : "ASC",
					constructor : function(a) {
						Ext.apply(this, a);
						if (this.property == undefined
								&& this.sorterFn == undefined) {
							throw "A Sorter requires either a property or a sorter function"
						}
						this.sort = this.createSortFunction(this.sorterFn
								|| this.defaultSorterFn)
					},
					createSortFunction : function(b) {
						var d = this, e = d.property, f = d.direction || "ASC", a = f
								.toUpperCase() == "DESC" ? -1 : 1;
						return function(h, g) {
							return a * b.call(d, h, g)
						}
					},
					defaultSorterFn : function(b, a) {
						var e = this.getRoot(b)[this.property], d = this
								.getRoot(a)[this.property];
						return e > d ? 1 : (e < d ? -1 : 0)
					},
					getRoot : function(a) {
						return this.root == undefined ? a : a[this.root]
					}
				});
Ext
		.define(
				"Ext.util.Observable",
				{
					requires : [ "Ext.util.Event" ],
					statics : {
						releaseCapture : function(a) {
							a.fireEvent = this.prototype.fireEvent
						},
						capture : function(d, b, a) {
							d.fireEvent = Ext.createInterceptor(d.fireEvent, b,
									a)
						},
						observe : function(a, b) {
							if (a) {
								if (!a.isObservable) {
									Ext.applyIf(a, new this());
									this.capture(a.prototype, a.fireEvent, a)
								}
								if (typeof b == "object") {
									a.on(b)
								}
								return a
							}
						}
					},
					isObservable : true,
					constructor : function(a) {
						var b = this;
						Ext.apply(b, a);
						if (b.listeners) {
							b.on(b.listeners);
							delete b.listeners
						}
						b.events = b.events || {};
						if (this.bubbleEvents) {
							this.enableBubble(this.bubbleEvents)
						}
					},
					eventOptionsRe : /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate|element|vertical|horizontal)$/,
					addManagedListener : function(i, e, g, f, d) {
						var h = this, a = h.managedListeners = h.managedListeners
								|| [], b;
						if (Ext.isObject(e)) {
							d = e;
							for (e in d) {
								if (!d.hasOwnProperty(e)) {
									continue
								}
								b = d[e];
								if (!h.eventOptionsRe.test(e)) {
									h.addManagedListener(i, e, b.fn || b,
											b.scope || d.scope, b.fn ? b : d)
								}
							}
						} else {
							a.push({
								item : i,
								ename : e,
								fn : g,
								scope : f,
								options : d
							});
							i.on(e, g, f, d)
						}
					},
					removeManagedListener : function(l, f, j, m) {
						var h = this, b, e, k, d, a, g;
						if (Ext.isObject(f)) {
							b = f;
							for (f in b) {
								if (!b.hasOwnProperty(f)) {
									continue
								}
								e = b[f];
								if (!h.eventOptionsRe.test(f)) {
									h.removeManagedListener(l, f, e.fn || e,
											e.scope || b.scope)
								}
							}
						}
						k = this.managedListeners ? this.managedListeners
								.slice() : [];
						a = k.length;
						for (g = 0; g < a; g++) {
							d = k[g];
							if (d.item === l && d.ename === f
									&& (!j || d.fn === j)
									&& (!m || d.scope === m)) {
								Ext.Array.remove(this.managedListeners, d);
								l.un(d.ename, d.fn, d.scope)
							}
						}
					},
					fireEvent : function() {
						var i = this, d = Ext.Array.toArray(arguments), f = d[0]
								.toLowerCase(), e = true, h = i.events[f], b = i.eventQueue, g;
						if (i.eventsSuspended === true) {
							if (b) {
								b.push(d)
							}
							return false
						} else {
							if (h && Ext.isObject(h) && h.bubble) {
								if (h.fire.apply(h, d.slice(1)) === false) {
									return false
								}
								g = i.getBubbleTarget && i.getBubbleTarget();
								if (g && g.isObservable) {
									if (!g.events[f]
											|| !Ext.isObject(g.events[f])
											|| !g.events[f].bubble) {
										g.enableBubble(f)
									}
									return g.fireEvent.apply(g, d)
								}
							} else {
								if (h && Ext.isObject(h)) {
									d.shift();
									e = h.fire.apply(h, d)
								}
							}
						}
						return e
					},
					addListener : function(b, e, d, h) {
						var g = this, a, f;
						if (Ext.isObject(b)) {
							h = b;
							for (b in h) {
								if (!h.hasOwnProperty(b)) {
									continue
								}
								a = h[b];
								if (!g.eventOptionsRe.test(b)) {
									g.addListener(b, a.fn || a, a.scope
											|| h.scope, a.fn ? a : h)
								}
							}
						} else {
							b = b.toLowerCase();
							g.events[b] = g.events[b] || true;
							f = g.events[b] || true;
							if (Ext.isBoolean(f)) {
								g.events[b] = f = new Ext.util.Event(g, b)
							}
							f.addListener(e, d, Ext.isObject(h) ? h : {})
						}
					},
					removeListener : function(b, e, d) {
						var g = this, a, f;
						if (Ext.isObject(b)) {
							var h = b;
							for (b in h) {
								if (!h.hasOwnProperty(b)) {
									continue
								}
								a = h[b];
								if (!g.eventOptionsRe.test(b)) {
									g.removeListener(b, a.fn || a, a.scope
											|| h.scope)
								}
							}
						} else {
							b = b.toLowerCase();
							f = g.events[b];
							if (f.isEvent) {
								f.removeListener(e, d)
							}
						}
					},
					clearListeners : function() {
						var b = this.events, d, a;
						for (a in b) {
							if (!b.hasOwnProperty(a)) {
								continue
							}
							d = b[a];
							if (d.isEvent) {
								d.clearListeners()
							}
						}
						this.clearManagedListeners()
					},
					purgeListeners : function() {
						console
								.warn("MixedCollection: purgeListeners has been deprecated. Please use clearListeners.");
						return this.clearListeners.apply(this, arguments)
					},
					clearManagedListeners : function() {
						var b = this.managedListeners || [], e = b.length, d, a;
						for (d = 0; d < e; d++) {
							a = b[d];
							a.item.un(a.ename, a.fn, a.scope)
						}
						this.managedListener = []
					},
					purgeManagedListeners : function() {
						console
								.warn("MixedCollection: purgeManagedListeners has been deprecated. Please use clearManagedListeners.");
						return this.clearManagedListeners
								.apply(this, arguments)
					},
					addEvents : function(f) {
						var e = this;
						e.events = e.events || {};
						if (Ext.isString(f)) {
							var b = arguments, d = b.length;
							while (d--) {
								e.events[b[d]] = e.events[b[d]] || true
							}
						} else {
							Ext.applyIf(e.events, f)
						}
					},
					hasListener : function(a) {
						var b = this.events[a];
						return b.isEvent === true && b.listeners.length > 0
					},
					suspendEvents : function(a) {
						this.eventsSuspended = true;
						if (a && !this.eventQueue) {
							this.eventQueue = []
						}
					},
					resumeEvents : function() {
						var a = this, b = a.eventQueue || [];
						a.eventsSuspended = false;
						delete a.eventQueue;
						Ext.each(b, function(d) {
							a.fireEvent.apply(a, d)
						})
					},
					relayEvents : function(d, f, j) {
						j = j || "";
						var h = this, a = f.length, e = 0, g, b;
						for (; e < a; e++) {
							g = f[e].substr(j.length);
							b = j + g;
							h.events[b] = h.events[b] || true;
							d.on(g, h.createRelayer(b))
						}
					},
					createRelayer : function(a) {
						var b = this;
						return function() {
							return b.fireEvent.apply(b, [ a ]
									.concat(Array.prototype.slice.call(
											arguments, 0, -1)))
						}
					},
					enableBubble : function(a) {
						var b = this;
						if (!Ext.isEmpty(a)) {
							a = Ext.isArray(a) ? a : Ext.Array
									.toArray(arguments);
							Ext.each(a, function(d) {
								d = d.toLowerCase();
								var e = b.events[d] || true;
								if (Ext.isBoolean(e)) {
									e = new Ext.util.Event(b, d);
									b.events[d] = e
								}
								e.bubble = true
							})
						}
					}
				},
				function() {
					this.implement({
						on : this.prototype.addListener,
						un : this.prototype.removeListener,
						mon : this.prototype.addManagedListener,
						mun : this.prototype.removeManagedListener
					});
					this.observeClass = this.observe;
					Ext
							.apply(
									Ext.util.Observable.prototype,
									function() {
										function a(j) {
											var i = (this.methodEvents = this.methodEvents
													|| {})[j], f, d, g, h = this;
											if (!i) {
												this.methodEvents[j] = i = {};
												i.originalFn = this[j];
												i.methodName = j;
												i.before = [];
												i.after = [];
												var b = function(l, k, e) {
													if ((d = l.apply(k || h, e)) !== undefined) {
														if (typeof d == "object") {
															if (d.returnValue !== undefined) {
																f = d.returnValue
															} else {
																f = d
															}
															g = !!d.cancel
														} else {
															if (d === false) {
																g = true
															} else {
																f = d
															}
														}
													}
												};
												this[j] = function() {
													var l = Array.prototype.slice
															.call(arguments, 0), k;
													f = d = undefined;
													g = false;
													for (var m = 0, e = i.before.length; m < e; m++) {
														k = i.before[m];
														b(k.fn, k.scope, l);
														if (g) {
															return f
														}
													}
													if ((d = i.originalFn
															.apply(h, l)) !== undefined) {
														f = d
													}
													for (var m = 0, e = i.after.length; m < e; m++) {
														k = i.after[m];
														b(k.fn, k.scope, l);
														if (g) {
															return f
														}
													}
													return f
												}
											}
											return i
										}
										return {
											beforeMethod : function(e, d, b) {
												a.call(this, e).before.push({
													fn : d,
													scope : b
												})
											},
											afterMethod : function(e, d, b) {
												a.call(this, e).after.push({
													fn : d,
													scope : b
												})
											},
											removeMethodListener : function(j,
													g, f) {
												var h = this.getMethodEvent(j);
												for (var d = 0, b = h.before.length; d < b; d++) {
													if (h.before[d].fn == g
															&& h.before[d].scope == f) {
														h.before.splice(d, 1);
														return
													}
												}
												for (var d = 0, b = h.after.length; d < b; d++) {
													if (h.after[d].fn == g
															&& h.after[d].scope == f) {
														h.after.splice(d, 1);
														return
													}
												}
											},
											toggleEventLogging : function(b) {
												Ext.util.Observable[b ? "capture"
														: "releaseCapture"](
														this, function(d) {
															console.log(d,
																	arguments)
														})
											}
										}
									}())
				});
Ext
		.define(
				"Ext.data.Connection",
				{
					mixins : {
						observable : "Ext.util.Observable"
					},
					statics : {
						requestId : 0
					},
					url : null,
					async : true,
					method : null,
					username : "",
					password : "",
					disableCaching : true,
					disableCachingParam : "_dc",
					timeout : 30000,
					useDefaultHeader : true,
					defaultPostHeader : "application/x-www-form-urlencoded; charset=UTF-8",
					useDefaultXhrHeader : true,
					defaultXhrHeader : "XMLHttpRequest",
					constructor : function(a) {
						a = a || {};
						Ext.apply(this, a);
						this.addEvents("beforerequest", "requestcomplete",
								"requestexception");
						this.requests = {};
						this.mixins.observable.constructor.call(this)
					},
					request : function(k) {
						k = k || {};
						var g = this, j = k.scope || window, f = k.username
								|| g.username, h = k.password || g.password
								|| "", b, d, e, a, i;
						if (g.fireEvent("beforerequest", g, k) !== false) {
							d = g.setupOptions(k, j);
							if (this.isFormUpload(k) === true) {
								this.upload(k.form, d.url, d.data, k);
								return null
							}
							if (k.autoAbort === true || g.autoAbort) {
								g.abort()
							}
							i = this.getXhrInstance();
							b = k.async !== false ? (k.async || g.async)
									: false;
							if (f) {
								i.open(d.method, d.url, b, f, h)
							} else {
								i.open(d.method, d.url, b)
							}
							a = g.setupHeaders(i, k, d.data, d.params);
							e = {
								id : ++Ext.data.Connection.requestId,
								xhr : i,
								headers : a,
								options : k,
								async : b,
								timeout : setTimeout(function() {
									e.timedout = true;
									g.abort(e)
								}, k.timeout || g.timeout)
							};
							g.requests[e.id] = e;
							if (b) {
								i.onreadystatechange = Ext.Function.bind(
										g.onStateChange, g, [ e ])
							}
							i.send(d.data);
							if (!b) {
								return this.onComplete(e)
							}
							return e
						} else {
							Ext.callback(k.callback, k.scope, [ k, undefined,
									undefined ]);
							return null
						}
					},
					upload : function(e, b, i, k) {
						e = Ext.getDom(e);
						k = k || {};
						var d = Ext.id(), g = document.createElement("iframe"), j = [], h = "multipart/form-data", f = {
							target : e.target,
							method : e.method,
							encoding : e.encoding,
							enctype : e.enctype,
							action : e.action
						}, a;
						Ext.fly(g).set({
							id : d,
							name : d,
							cls : Ext.baseCSSPrefix + "hide-display",
							src : Ext.SSL_SECURE_URL
						});
						document.body.appendChild(g);
						if (document.frames) {
							document.frames[d].name = d
						}
						Ext.fly(e).set({
							target : d,
							method : "POST",
							enctype : h,
							encoding : h,
							action : b || f.action
						});
						Ext.iterate(Ext.urlDecode(i, false), function(l, m) {
							a = document.createElement("input");
							Ext.fly(a).set({
								type : "hidden",
								value : m,
								name : l
							});
							e.appendChild(hd);
							j.push(a)
						});
						Ext.fly(g).on(
								"load",
								Ext.Function.bind(this.onUploadComplete, this,
										[ g, k ]), null, {
									single : true
								});
						e.submit();
						Ext.fly(e).set(f);
						Ext.each(j, function(l) {
							Ext.removeNode(l)
						})
					},
					onUploadComplete : function(i, b) {
						var d = this, a = {
							responseText : "",
							responseXML : null
						}, h, g;
						try {
							h = i.contentWindow.document || i.contentDocument
									|| window.frames[id].document;
							if (h) {
								if (h.body) {
									if (/textarea/i.test((g = h.body.firstChild
											|| {}).tagName)) {
										a.responseText = g.value
									} else {
										a.responseText = h.body.innerHTML
									}
								}
								a.responseXML = h.XMLDocument || h
							}
						} catch (f) {
						}
						d.fireEvent("requestcomplete", d, a, b);
						Ext.callback(b.success, b.scope, [ a, b ]);
						Ext.callback(b.callback, b.scope, [ b, true, a ]);
						setTimeout(function() {
							Ext.removeNode(i)
						}, 100)
					},
					isFormUpload : function(a) {
						var b = this.getForm(a);
						if (b) {
							return (a.isUpload || (/multipart\/form-data/i)
									.test(b.getAttribute("enctype")))
						}
						return false
					},
					getForm : function(a) {
						return Ext.getDom(a.form) || null
					},
					setupOptions : function(l, k) {
						var i = this, f = l.params || {}, h = l.extraParams, e = l.urlParams, d = l.url
								|| i.url, j = l.jsonData, b, a, g;
						if (Ext.isFunction(f)) {
							f = f.call(k, l)
						}
						if (Ext.isFunction(d)) {
							d = d.call(k, l)
						}
						d = this.setupUrl(l, d);
						if (!d) {
							throw "No URL specified"
						}
						g = l.rawData || l.xmlData || j || null;
						if (j && !Ext.isPrimitive(j)) {
							g = Ext.encode(g)
						}
						f = Ext.urlEncode(h, Ext.isObject(f) ? Ext.urlEncode(f)
								: f);
						e = Ext.isObject(e) ? Ext.urlEncode(e) : e;
						f = this.setupParams(l, f);
						b = (l.method || i.method || ((f || g) ? "POST" : "GET"))
								.toUpperCase();
						this.setupMethod(l, b);
						a = l.disableCaching !== false ? (l.disableCaching || i.disableCaching)
								: false;
						if (b === "GET" && a) {
							d = Ext
									.urlAppend(
											d,
											(l.disableCachingParam || i.disableCachingParam)
													+ "="
													+ (new Date().getTime()))
						}
						if ((b == "GET" || g) && f) {
							d = Ext.urlAppend(d, f);
							f = null
						}
						if (e) {
							d = Ext.urlAppend(d, e)
						}
						return {
							url : d,
							method : b,
							data : g || f || null
						}
					},
					setupUrl : function(b, a) {
						var d = this.getForm(b);
						if (d) {
							a = a || d.action
						}
						return a
					},
					setupParams : function(a, e) {
						var d = this.getForm(a), b;
						if (d && !this.isFormUpload(a)) {
							b = Ext.core.Element.serializeForm(d);
							e = e ? (e + "&" + b) : b
						}
						return e
					},
					setupMethod : function(a, b) {
						if (this.isFormUpload(a)) {
							return "POST"
						}
						return b
					},
					setupHeaders : function(m, n, f, d) {
						var i = this, b = Ext.apply({}, n.headers || {},
								i.defaultHeaders || {}), l = i.defaultPostHeader, j = n.jsonData, a = n.xmlData, k, g;
						if (!b["Content-Type"] && (f || d)) {
							if (f) {
								if (n.rawData) {
									l = "text/plain"
								} else {
									if (a && Ext.isDefined(a)) {
										l = "text/xml"
									} else {
										if (j && Ext.isDefined(j)) {
											l = "application/json"
										}
									}
								}
							}
							b["Content-Type"] = l
						}
						if (i.useDefaultXhrHeader && !b["X-Requested-With"]) {
							b["X-Requested-With"] = i.defaultXhrHeader
						}
						try {
							for (k in b) {
								if (b.hasOwnProperty(k)) {
									g = b[k];
									m.setRequestHeader(k, g)
								}
							}
						} catch (h) {
							i.fireEvent("exception", k, g)
						}
						return b
					},
					getXhrInstance : (function() {
						var b = [ function() {
							return new XMLHttpRequest()
						}, function() {
							return new ActiveXObject("Msxml2.XMLHTTP.6.0")
						}, function() {
							return new ActiveXObject("Msxml2.XMLHTTP.3.0")
						}, function() {
							return new ActiveXObject("Msxml2.XMLHTTP")
						} ], d = 0, a = b.length, g;
						for (; d < a; ++d) {
							try {
								g = b[d];
								g();
								break
							} catch (f) {
							}
						}
						return g
					})(),
					isLoading : function(a) {
						if (!(a && a.xhr)) {
							return false
						}
						var b = a.xhr.readyState;
						return !(b === 0 || b == 4)
					},
					abort : function(b) {
						var a = this, e = a.requests, d;
						if (b && a.isLoading(b)) {
							b.xhr.abort();
							a.clearTimeout(b);
							if (!b.timedout) {
								b.aborted = true
							}
							a.onComplete(b)
						} else {
							if (!b) {
								for (d in e) {
									if (e.hasOwnProperty(d)) {
										a.abort(e[d])
									}
								}
							}
						}
					},
					onStateChange : function(a) {
						if (a.xhr.readyState == 4) {
							this.clearTimeout(a);
							this.onComplete(a);
							this.cleanup(a)
						}
					},
					clearTimeout : function(a) {
						clearTimeout(a.timeout);
						delete a.timeout
					},
					cleanup : function(a) {
						a.xhr = null;
						delete a.xhr
					},
					onComplete : function(f) {
						var e = this, d = f.options, a = e
								.parseStatus(f.xhr.status), g = a.success, b;
						if (g) {
							b = e.createResponse(f);
							e.fireEvent("requestcomplete", e, b, d);
							Ext.callback(d.success, d.scope, [ b, d ])
						} else {
							if (a.isException || f.aborted || f.timedout) {
								b = e.createException(f)
							} else {
								b = e.createResponse(f)
							}
							e.fireEvent("requestexception", e, b, d);
							Ext.callback(d.failure, d.scope, [ b, d ])
						}
						Ext.callback(d.callback, d.scope, [ d, g, b ]);
						delete e.requests[f.id];
						return b
					},
					parseStatus : function(a) {
						a = a == 1223 ? 204 : a;
						var d = (a >= 200 && a < 300) || a == 304, b = false;
						if (!d) {
							switch (a) {
							case 12002:
							case 12029:
							case 12030:
							case 12031:
							case 12152:
							case 13030:
								b = true;
								break
							}
						}
						return {
							success : d,
							isException : b
						}
					},
					createResponse : function(b) {
						var h = b.xhr, a = {}, i = h.getAllResponseHeaders()
								.replace(/\r\n/g, "\n").split("\n"), d = i.length, j, e, g, f;
						while (d--) {
							j = i[d];
							e = j.indexOf(":");
							if (e >= 0) {
								g = j.substr(0, e).toLowerCase();
								if (j.charAt(e + 1) == " ") {
									++e
								}
								a[g] = j.substr(e + 1)
							}
						}
						b.xhr = null;
						delete b.xhr;
						return {
							request : b,
							requestId : b.id,
							status : h.status,
							statusText : h.statusText,
							getResponseHeader : function(k) {
								return a[k.toLowerCase()]
							},
							getAllResponseHeaders : function() {
								return a
							},
							responseText : h.responseText,
							responseXML : h.responseXML
						}
					},
					createException : function(a) {
						return {
							request : a,
							requestId : a.id,
							status : a.aborted ? -1 : 0,
							statusText : a.aborted ? "transaction aborted"
									: "communication failure",
							aborted : a.aborted,
							timedout : a.timedout
						}
					}
				});
Ext.define("Ext.Ajax", {
	extend : "Ext.data.Connection",
	singleton : true,
	autoAbort : false
});
Ext
		.define(
				"Ext.util.Filter",
				{
					anyMatch : false,
					exactMatch : false,
					caseSensitive : false,
					constructor : function(a) {
						Ext.apply(this, a);
						this.filter = this.filter || this.filterFn;
						if (this.filter == undefined) {
							if (this.property == undefined
									|| this.value == undefined) {
							} else {
								this.filter = this.createFilterFn()
							}
							this.filterFn = this.filter
						}
					},
					createFilterFn : function() {
						var a = this, d = a.createValueMatcher(), b = a.property;
						return function(e) {
							return d.test(a.getRoot.call(a, e)[b])
						}
					},
					getRoot : function(a) {
						return this.root == undefined ? a : a[this.root]
					},
					createValueMatcher : function() {
						var e = this, f = e.value, g = e.anyMatch, d = e.exactMatch, a = e.caseSensitive, b = Ext.String.escapeRegex;
						if (!f.exec) {
							f = String(f);
							if (g === true) {
								f = b(f)
							} else {
								f = "^" + b(f);
								if (d === true) {
									f += "$"
								}
							}
							f = new RegExp(f, a ? "" : "i")
						}
						return f
					}
				});
Ext
		.define(
				"Ext.util.MixedCollection",
				{
					requires : [ "Ext.util.Sorter", "Ext.util.Filter" ],
					mixins : {
						observable : "Ext.util.Observable"
					},
					constructor : function(b, a) {
						this.items = [];
						this.map = {};
						this.keys = [];
						this.length = 0;
						this.addEvents("clear", "add", "replace", "remove",
								"sort");
						this.allowFunctions = b === true;
						if (a) {
							this.getKey = a
						}
						this.mixins.observable.constructor.call(this)
					},
					allowFunctions : false,
					add : function(b, e) {
						var f = e, d = b;
						if (arguments.length == 1) {
							f = d;
							d = this.getKey(f)
						}
						if (typeof d != "undefined" && d !== null) {
							var a = this.map[d];
							if (typeof a != "undefined") {
								return this.replace(d, f)
							}
							this.map[d] = f
						}
						this.length++;
						this.items.push(f);
						this.keys.push(d);
						this.fireEvent("add", this.length - 1, f, d);
						return f
					},
					getKey : function(a) {
						return a.id
					},
					replace : function(d, e) {
						if (arguments.length == 1) {
							e = arguments[0];
							d = this.getKey(e)
						}
						var a = this.map[d];
						if (typeof d == "undefined" || d === null
								|| typeof a == "undefined") {
							return this.add(d, e)
						}
						var b = this.indexOfKey(d);
						this.items[b] = e;
						this.map[d] = e;
						this.fireEvent("replace", d, a, e);
						return e
					},
					addAll : function(f) {
						if (arguments.length > 1 || Ext.isArray(f)) {
							var b = arguments.length > 1 ? arguments : f;
							for (var e = 0, a = b.length; e < a; e++) {
								this.add(b[e])
							}
						} else {
							for ( var d in f) {
								if (!f.hasOwnProperty(d)) {
									continue
								}
								if (this.allowFunctions
										|| typeof f[d] != "function") {
									this.add(d, f[d])
								}
							}
						}
					},
					each : function(f, e) {
						var b = [].concat(this.items);
						for (var d = 0, a = b.length; d < a; d++) {
							if (f.call(e || b[d], b[d], d, a) === false) {
								break
							}
						}
					},
					eachKey : function(e, d) {
						for (var b = 0, a = this.keys.length; b < a; b++) {
							e.call(d || window, this.keys[b], this.items[b], b,
									a)
						}
					},
					findBy : function(e, d) {
						for (var b = 0, a = this.items.length; b < a; b++) {
							if (e
									.call(d || window, this.items[b],
											this.keys[b])) {
								return this.items[b]
							}
						}
						return null
					},
					find : function() {
						throw new Error(
								"[Ext.util.MixedCollection] Stateful: find has been deprecated. Please use findBy.")
					},
					insert : function(a, b, e) {
						var d = b, f = e;
						if (arguments.length == 2) {
							f = d;
							d = this.getKey(f)
						}
						if (this.containsKey(d)) {
							this.suspendEvents();
							this.removeByKey(d);
							this.resumeEvents()
						}
						if (a >= this.length) {
							return this.add(d, f)
						}
						this.length++;
						this.items.splice(a, 0, f);
						if (typeof d != "undefined" && d !== null) {
							this.map[d] = f
						}
						this.keys.splice(a, 0, d);
						this.fireEvent("add", a, f, d);
						return f
					},
					remove : function(a) {
						return this.removeAt(this.indexOf(a))
					},
					removeAll : function(a) {
						Ext.each(a || [], function(b) {
							this.remove(b)
						}, this);
						return this
					},
					removeAt : function(a) {
						if (a < this.length && a >= 0) {
							this.length--;
							var d = this.items[a];
							this.items.splice(a, 1);
							var b = this.keys[a];
							if (typeof b != "undefined") {
								delete this.map[b]
							}
							this.keys.splice(a, 1);
							this.fireEvent("remove", d, b);
							return d
						}
						return false
					},
					removeByKey : function(a) {
						return this.removeAt(this.indexOfKey(a))
					},
					removeKey : function() {
						console
								.warn("MixedCollection: removeKey has been deprecated. Please use removeByKey.");
						return this.removeByKey.apply(this, arguments)
					},
					getCount : function() {
						return this.length
					},
					indexOf : function(a) {
						return Ext.Array.indexOf(this.items, a)
					},
					indexOfKey : function(a) {
						return Ext.Array.indexOf(this.keys, a)
					},
					get : function(b) {
						var a = this.map[b], d = a !== undefined ? a
								: (typeof b == "number") ? this.items[b]
										: undefined;
						return typeof d != "function" || this.allowFunctions ? d
								: null
					},
					item : function() {
						console
								.warn("MixedCollection: item has been deprecated. Please use get.");
						return this.get.apply(this, arguments)
					},
					getAt : function(a) {
						return this.items[a]
					},
					itemAt : function() {
						console
								.warn("MixedCollection: itemAt has been deprecated. Please use getAt.");
						return this.getAt.apply(this, arguments)
					},
					getByKey : function(a) {
						return this.map[a]
					},
					key : function() {
						console
								.warn("MixedCollection: key has been deprecated. Please use getByKey.");
						return this.getByKey.apply(this, arguments)
					},
					contains : function(a) {
						return Ext.Array.contains(this.items, a)
					},
					containsKey : function(a) {
						return typeof this.map[a] != "undefined"
					},
					clear : function() {
						this.length = 0;
						this.items = [];
						this.keys = [];
						this.map = {};
						this.fireEvent("clear")
					},
					first : function() {
						return this.items[0]
					},
					last : function() {
						return this.items[this.length - 1]
					},
					_sort : function(j, a, h) {
						var d, e, b = String(a).toUpperCase() == "DESC" ? -1
								: 1, g = [], k = this.keys, f = this.items;
						h = h || function(l, i) {
							return l - i
						};
						for (d = 0, e = f.length; d < e; d++) {
							g[g.length] = {
								key : k[d],
								value : f[d],
								index : d
							}
						}
						g.sort(function(l, i) {
							var m = h(l[j], i[j]) * b;
							if (m === 0) {
								m = (l.index < i.index ? -1 : 1)
							}
							return m
						});
						for (d = 0, e = g.length; d < e; d++) {
							f[d] = g[d].value;
							k[d] = g[d].key
						}
						this.fireEvent("sort", this)
					},
					sort : function(d, f) {
						var e = d;
						if (Ext.isString(d)) {
							e = [ Ext.create("Ext.util.Sorter", {
								property : d,
								direction : f || "ASC"
							}) ]
						} else {
							if (d instanceof Ext.util.Sorter) {
								e = [ d ]
							} else {
								if (Ext.isObject(d)) {
									e = [ Ext.create("Ext.util.Sorter", d) ]
								}
							}
						}
						var b = e.length;
						if (b == 0) {
							return
						}
						var a = function(j, h) {
							var g = e[0].sort(j, h), l = e.length, k;
							for (k = 1; k < l; k++) {
								g = g || e[k].sort.call(this, j, h)
							}
							return g
						};
						this.sortBy(a)
					},
					sortBy : function(d) {
						var b = this.items, g = this.keys, f = b.length, a = [], e;
						for (e = 0; e < f; e++) {
							a[e] = {
								key : g[e],
								value : b[e],
								index : e
							}
						}
						a.sort(function(i, h) {
							var j = d(i.value, h.value);
							if (j === 0) {
								j = (i.index < h.index ? -1 : 1)
							}
							return j
						});
						for (e = 0; e < f; e++) {
							b[e] = a[e].value;
							g[e] = a[e].key
						}
						this.fireEvent("sort", this)
					},
					sum : function(h, b, j, a) {
						var d = this.extractValues(h, b), g = d.length, f = 0, e;
						j = j || 0;
						a = (a || a === 0) ? a : g - 1;
						for (e = j; e <= a; e++) {
							f += d[e]
						}
						return f
					},
					collect : function(k, f, h) {
						var l = this.extractValues(k, f), a = l.length, b = {}, d = [], j, g, e;
						for (e = 0; e < a; e++) {
							j = l[e];
							g = String(j);
							if ((h || !Ext.isEmpty(j)) && !b[g]) {
								b[g] = true;
								d.push(j)
							}
						}
						return d
					},
					extractValues : function(d, a) {
						var b = this.items;
						if (a) {
							b = Ext.Array.pluck(b, a)
						}
						return Ext.Array.pluck(b, d)
					},
					reorder : function(e) {
						this.suspendEvents();
						var b = this.items, d = 0, g = b.length, a = [], f = [], h;
						for (h in e) {
							a[e[h]] = b[h]
						}
						for (d = 0; d < g; d++) {
							if (e[d] == undefined) {
								f.push(b[d])
							}
						}
						for (d = 0; d < g; d++) {
							if (a[d] == undefined) {
								a[d] = f.shift()
							}
						}
						this.clear();
						this.addAll(a);
						this.resumeEvents();
						this.fireEvent("sort", this)
					},
					sortByKey : function(a, b) {
						this
								._sort(
										"key",
										a,
										b
												|| function(e, d) {
													var g = String(e)
															.toUpperCase(), f = String(
															d).toUpperCase();
													return g > f ? 1
															: (g < f ? -1 : 0)
												})
					},
					keySort : function() {
						console
								.warn("MixedCollection: keySort has been deprecated. Please use sortByKey.");
						return this.sortByKey.apply(this, arguments)
					},
					getRange : function(f, a) {
						var b = this.items;
						if (b.length < 1) {
							return []
						}
						f = f || 0;
						a = Math.min(typeof a == "undefined" ? this.length - 1
								: a, this.length - 1);
						var d, e = [];
						if (f <= a) {
							for (d = f; d <= a; d++) {
								e[e.length] = b[d]
							}
						} else {
							for (d = f; d >= a; d--) {
								e[e.length] = b[d]
							}
						}
						return e
					},
					filter : function(e, d, g, a) {
						var b = [];
						if (Ext.isString(e)) {
							b.push(Ext.create("Ext.util.Filter", {
								property : e,
								value : d,
								anyMatch : g,
								caseSensitive : a
							}))
						} else {
							if (Ext.isArray(e) || e instanceof Ext.util.Filter) {
								b = b.concat(e)
							}
						}
						var f = function(h) {
							var n = true, o = b.length, j;
							for (j = 0; j < o; j++) {
								var m = b[j], l = m.filterFn, k = m.scope;
								n = n && l.call(k, h)
							}
							return n
						};
						return this.filterBy(f)
					},
					filterBy : function(f, e) {
						var a = new this.self(), h = this.keys, b = this.items, g = b.length, d;
						a.getKey = this.getKey;
						for (d = 0; d < g; d++) {
							if (f.call(e || this, b[d], h[d])) {
								a.add(h[d], b[d])
							}
						}
						return a
					},
					findIndex : function(d, b, f, e, a) {
						if (Ext.isEmpty(b, false)) {
							return -1
						}
						b = this.createValueMatcher(b, e, a);
						return this.findIndexBy(function(g) {
							return g && b.test(g[d])
						}, null, f)
					},
					findIndexBy : function(g, f, h) {
						var b = this.keys, e = this.items;
						for (var d = (h || 0), a = e.length; d < a; d++) {
							if (g.call(f || this, e[d], b[d])) {
								return d
							}
						}
						return -1
					},
					createValueMatcher : function(d, f, a, b) {
						if (!d.exec) {
							var e = Ext.String.escapeRegex;
							d = String(d);
							if (f === true) {
								d = e(d)
							} else {
								d = "^" + e(d);
								if (b === true) {
									d += "$"
								}
							}
							d = new RegExp(d, a ? "" : "i")
						}
						return d
					},
					clone : function() {
						var f = new this.self();
						var b = this.keys, e = this.items;
						for (var d = 0, a = e.length; d < a; d++) {
							f.add(b[d], e[d])
						}
						f.getKey = this.getKey;
						return f
					}
				});
Ext.define("Ext.data.ResultSet", {
	loaded : true,
	count : 0,
	total : 0,
	success : false,
	constructor : function(a) {
		Ext.apply(this, a);
		this.totalRecords = this.total;
		if (a.count === undefined) {
			this.count = this.records.length
		}
	}
});
Ext
		.define(
				"Ext.data.Reader",
				{
					requires : [ "Ext.data.ResultSet" ],
					idProperty : "id",
					totalProperty : "total",
					successProperty : "success",
					root : "",
					implicitIncludes : true,
					constructor : function(a) {
						Ext.apply(this, a || {});
						this.model = Ext.ModelMgr.getModel(a.model);
						if (this.model) {
							this.buildExtractors()
						}
					},
					setModel : function(a, b) {
						this.model = Ext.ModelMgr.getModel(a);
						this.buildExtractors(true);
						if (b && this.proxy) {
							this.proxy.setModel(this.model, true)
						}
					},
					read : function(a) {
						var b = a;
						if (a && a.responseText) {
							b = this.getResponseData(a)
						}
						if (b) {
							return this.readRecords(b)
						} else {
							return this.nullResultSet
						}
					},
					readRecords : function(h) {
						this.rawData = h;
						h = this.getData(h);
						var a = this.getRoot(h), f = a.length, i = true, g, b, e, d;
						if (this.totalProperty) {
							g = parseInt(this.getTotal(h), 10);
							if (!isNaN(g)) {
								f = g
							}
						}
						if (this.successProperty) {
							g = this.getSuccess(h);
							if (g === false || g === "false") {
								i = false
							}
						}
						if (this.messageProperty) {
							e = this.getMessage(h)
						}
						b = this.extractData(a, true);
						d = b.length;
						return Ext.create("Ext.data.ResultSet", {
							total : f || d,
							count : d,
							records : b,
							success : i,
							message : e
						})
					},
					extractData : function(k, a) {
						var l = [], g = [], e = this.model, d = k.length, m = this.idProperty, f, b, j, h;
						for (h = 0; h < d; h++) {
							f = k[h];
							l = this.extractValues(f);
							b = this.getId(f);
							if (a === true) {
								j = new e(l, b);
								j.raw = f;
								g.push(j);
								if (this.implicitIncludes) {
									this.readAssociated(j, f)
								}
							} else {
								l[m] = b;
								g.push(l)
							}
						}
						return g
					},
					readAssociated : function(j, h) {
						var f = j.associations.items, a = f.length, e, n, o, d, b, l, k, m, g;
						for (g = 0; g < a; g++) {
							e = f[g];
							n = e.name;
							d = this.getAssociatedDataRoot(h, e.associationKey
									|| n);
							o = e.associatedModel;
							if (d) {
								l = o.proxy;
								if (l) {
									k = l.getReader()
								} else {
									k = new this.constructor({
										model : e.associatedName
									})
								}
								if (e.type == "hasMany") {
									m = j[n]();
									m.add.apply(m, k.read(d).records);
									b = o.prototype.associations
											.findBy(function(i) {
												return i.type == "belongsTo"
														&& i.associatedName == j.constructor.modelName
											});
									if (b) {
										m.data.each(function(i) {
											i[b.instanceName] = j
										})
									}
								} else {
									if (e.type == "belongsTo") {
										j[e.instanceName] = k.read([ d ]).records[0]
									}
								}
							}
						}
					},
					getAssociatedDataRoot : function(b, a) {
						return b[a]
					},
					extractValues : function(g) {
						var a = this.model.prototype.fields.items, e = a.length, b = {}, h, f, d;
						for (d = 0; d < e; d++) {
							h = a[d];
							f = this.extractorFunctions[d](g) || h.defaultValue;
							b[h.name] = f
						}
						return b
					},
					getData : function(a) {
						return a
					},
					getRoot : function(a) {
						return a
					},
					getResponseData : function(a) {
						throw new Error(
								"getResponseData must be implemented in the Ext.data.Reader subclass")
					},
					onMetaChange : function(d) {
						var a = d.fields, b;
						Ext.apply(this, d);
						if (a) {
							b = Ext.regModel("Ext.data.JsonReader-Model"
									+ Ext.id(), {
								fields : a
							});
							this.setModel(b, true)
						} else {
							this.buildExtractors(true)
						}
					},
					buildExtractors : function(e) {
						var b = this, h = this.id || this.idProperty, d = this.totalProperty, a = this.successProperty, g = this.messageProperty, f;
						if (e === true) {
							delete b.extractorFunctions
						}
						if (b.extractorFunctions) {
							return
						}
						if (d) {
							b.getTotal = b.createAccessor(d)
						}
						if (a) {
							b.getSuccess = b.createAccessor(a)
						}
						if (g) {
							b.getMessage = b.createAccessor(g)
						}
						if (h) {
							accessor = b.createAccessor(h);
							b.getId = function(i) {
								var j = accessor.call(b, i);
								return (j === undefined || j === "") ? null : j
							}
						} else {
							b.getId = function() {
								return null
							}
						}
						b.buildFieldExtractors()
					},
					buildFieldExtractors : function() {
						var a = this.model.prototype.fields.items, d = a.length, b = 0, g = [], f, e;
						for (; b < d; b++) {
							f = a[b];
							e = (f.mapping !== undefined && f.mapping !== null) ? f.mapping
									: f.name;
							g.push(this.createAccessor(e))
						}
						this.extractorFunctions = g
					}
				}, function() {
					Ext.apply(this, {
						nullResultSet : Ext.create("Ext.data.ResultSet", {
							total : 0,
							count : 0,
							records : [],
							success : true
						})
					})
				});
Ext
		.define(
				"Ext.data.JsonReader",
				{
					extend : "Ext.data.Reader",
					alias : "reader.json",
					root : "",
					useSimpleAccessors : false,
					readRecords : function(a) {
						if (a.metaData) {
							this.onMetaChange(a.metaData)
						}
						this.jsonData = a;
						return Ext.data.JsonReader.superclass.readRecords.call(
								this, a)
					},
					getResponseData : function(a) {
						try {
							var d = Ext.decode(a.responseText)
						} catch (b) {
							throw "Ext.data.JsonReader.getResponseData: Unable to parse JSON returned by Server."
						}
						if (!d) {
							throw "Ext.data.JsonReader.getResponseData: JSON object not found"
						}
						return d
					},
					buildExtractors : function() {
						Ext.data.JsonReader.superclass.buildExtractors.apply(
								this, arguments);
						if (this.root) {
							this.getRoot = this.createAccessor(this.root)
						} else {
							this.getRoot = function(a) {
								return a
							}
						}
					},
					extractData : function(a, d) {
						var g = this.record, f = [], e, b;
						if (g) {
							e = a.length;
							for (b = 0; b < e; b++) {
								f[b] = a[b][g]
							}
						} else {
							f = a
						}
						return Ext.data.JsonReader.superclass.extractData.call(
								this, f, d)
					},
					createAccessor : function() {
						var a = /[\[\.]/;
						return function(d) {
							if (Ext.isEmpty(d)) {
								return Ext.emptyFn
							}
							if (Ext.isFunction(d)) {
								return d
							}
							if (this.useSimpleAccessors !== true) {
								var b = String(d).search(a);
								if (b >= 0) {
									return new Function("obj", "return obj"
											+ (b > 0 ? "." : "") + d)
								}
							}
							return function(e) {
								return e[d]
							}
						}
					}()
				});
Ext
		.define(
				"Ext.draw.Color",
				{
					colorToHexRe : /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/,
					rgbRe : /\s*rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)\s*/,
					hexRe : /\s*#([0-9a-fA-F][0-9a-fA-F]?)([0-9a-fA-F][0-9a-fA-F]?)([0-9a-fA-F][0-9a-fA-F]?)\s*/,
					lightnessFactor : 0.2,
					constructor : function(e, d, a) {
						var b = this, f = Ext.Number.constrain;
						b.r = f(e, 0, 255);
						b.g = f(d, 0, 255);
						b.b = f(a, 0, 255)
					},
					getRed : function() {
						return this.r
					},
					getGreen : function() {
						return this.g
					},
					getBlue : function() {
						return this.b
					},
					getRGB : function() {
						var a = this;
						return [ a.r, a.g, a.b ]
					},
					getHSL : function() {
						var j = this, a = j.r / 255, i = j.g / 255, k = j.b / 255, m = Math
								.max(a, i, k), e = Math.min(a, i, k), n = m - e, f, o = 0, d = 0.5 * (m + e);
						if (e != m) {
							o = (d < 0.5) ? n / (m + e) : n / (2 - m - e);
							if (a == m) {
								f = 60 * (i - k) / n
							} else {
								if (i == m) {
									f = 120 + 60 * (k - a) / n
								} else {
									f = 240 + 60 * (a - i) / n
								}
							}
							if (f < 0) {
								f += 360
							}
							if (f >= 360) {
								f -= 360
							}
						}
						return [ f, o, d ]
					},
					getLighter : function(b) {
						var a = this.getHSL();
						b = b || this.lightnessFactor;
						a[2] = Ext.Number.constrain(a[2] + b, 0, 1);
						return this.fromHSL(a[0], a[1], a[2])
					},
					getDarker : function(a) {
						a = a || this.lightnessFactor;
						return this.getLighter(-a)
					},
					toString : function() {
						var h = this, d = Math.round, f = d(h.r).toString(16), e = d(
								h.g).toString(16), a = d(h.b).toString(16);
						f = (f.length == 1) ? "0" + f : f;
						e = (e.length == 1) ? "0" + e : e;
						a = (a.length == 1) ? "0" + a : a;
						return [ "#", f, e, a ].join("")
					},
					toHex : function(b) {
						if (Ext.isArray(b)) {
							b = b[0]
						}
						if (!Ext.isString(b)) {
							return ""
						}
						if (b.substr(0, 1) === "#") {
							return b
						}
						var f = this.colorToHexRe.exec(b);
						if (Ext.isArray(f)) {
							var g = parseInt(f[2], 10), e = parseInt(f[3], 10), a = parseInt(
									f[4], 10), d = a | (e << 8) | (g << 16);
							return f[1] + "#"
									+ ("000000" + d.toString(16)).slice(-6)
						} else {
							return ""
						}
					},
					fromString : function(i) {
						var d, f, e, a, h = parseInt;
						if ((i.length == 4 || i.length == 7)
								&& i.substr(0, 1) === "#") {
							d = i.match(this.hexRe);
							if (d) {
								f = h(d[1], 16) >> 0;
								e = h(d[2], 16) >> 0;
								a = h(d[3], 16) >> 0;
								if (i.length == 4) {
									f += (f * 16);
									e += (e * 16);
									a += (a * 16)
								}
							}
						} else {
							d = i.match(this.rgbRe);
							if (d) {
								f = d[1];
								e = d[2];
								a = d[3]
							}
						}
						return (typeof f == "undefined") ? undefined : Ext
								.create("Ext.draw.Color", f, e, a)
					},
					getGrayscale : function() {
						return this.r * 0.3 + this.g * 0.59 + this.b * 0.11
					},
					fromHSL : function(g, o, e) {
						var a, b, d, f, k = [], n = Math.abs, j = Math.floor;
						if (o == 0 || g == null) {
							k = [ e, e, e ]
						} else {
							g /= 60;
							a = o * (1 - n(2 * e - 1));
							b = a * (1 - n(g - 2 * j(g / 2) - 1));
							d = e - a / 2;
							switch (j(g)) {
							case 0:
								k = [ a, b, 0 ];
								break;
							case 1:
								k = [ b, a, 0 ];
								break;
							case 2:
								k = [ 0, a, b ];
								break;
							case 3:
								k = [ 0, b, a ];
								break;
							case 4:
								k = [ b, 0, a ];
								break;
							case 5:
								k = [ a, 0, b ];
								break
							}
							k = [ k[0] + d, k[1] + d, k[2] + d ]
						}
						return Ext.create("Ext.draw.Color", k[0] * 255,
								k[1] * 255, k[2] * 255)
					}
				}, function() {
					var a = this.prototype;
					this.extend({
						fromHSL : function() {
							return a.fromHSL.apply(a, arguments)
						},
						fromString : function() {
							return a.fromString.apply(a, arguments)
						},
						toHex : function() {
							return a.toHex.apply(a, arguments)
						}
					})
				});
Ext.define("Ext.chart.theme.Theme", {
	requires : [ "Ext.draw.Color" ],
	theme : "Base",
	themeAttrs : false,
	initTheme : function(f) {
		var e = this, b = Ext.chart.theme, d, a;
		if (f) {
			f = f.split(":");
			for (d in b) {
				if (d == f[0]) {
					a = f[1] == "gradients";
					e.themeAttrs = new b[d]({
						useGradients : a
					});
					if (a) {
						e.gradients = e.themeAttrs.gradients
					}
					if (e.themeAttrs.background) {
						e.background = e.themeAttrs.background
					}
					return
				}
			}
			throw "No theme found named " + f
		}
	}
}, function() {
	(function() {
		Ext.chart.theme = function(d, b) {
			d = d || {};
			var k = 0, h, a, j, p, q, f, n, o, m = [], e, g;
			if (d.baseColor) {
				e = Ext.draw.Color.fromString(d.baseColor);
				g = e.getHSL()[2];
				if (g < 0.15) {
					e = e.getLighter(0.3)
				} else {
					if (g < 0.3) {
						e = e.getLighter(0.15)
					} else {
						if (g > 0.85) {
							e = e.getDarker(0.3)
						} else {
							if (g > 0.7) {
								e = e.getDarker(0.15)
							}
						}
					}
				}
				d.colors = [ e.getDarker(0.3).toString(),
						e.getDarker(0.15).toString(), e.toString(),
						e.getLighter(0.15).toString(),
						e.getLighter(0.3).toString() ];
				delete d.baseColor
			}
			if (d.colors) {
				a = d.colors.slice();
				q = b.markerThemes;
				p = b.seriesThemes;
				h = a.length;
				b.colors = a;
				for (; k < h; k++) {
					j = a[k];
					n = q[k] || {};
					f = p[k] || {};
					n.fill = f.fill = n.stroke = f.stroke = j;
					q[k] = n;
					p[k] = f
				}
				b.markerThemes = q.slice(0, h);
				b.seriesThemes = p.slice(0, h)
			}
			for (o in b) {
				if (o in d) {
					if (Ext.isObject(d[o]) && Ext.isObject(b[o])) {
						Ext.apply(b[o], d[o])
					} else {
						b[o] = d[o]
					}
				}
			}
			if (d.useGradients) {
				a = b.colors || (function() {
					var i = [];
					for (k = 0, p = b.seriesThemes, h = p.length; k < h; k++) {
						i.push(p[k].fill || p[k].stroke)
					}
					return i
				})();
				for (k = 0, h = a.length; k < h; k++) {
					e = Ext.draw.Color.fromString(a[k]);
					if (e) {
						j = e.getDarker(0.1).toString();
						e = e.toString();
						o = "theme-" + e.substr(1) + "-" + j.substr(1);
						m.push({
							id : o,
							angle : 45,
							stops : {
								0 : {
									color : e.toString()
								},
								100 : {
									color : j.toString()
								}
							}
						});
						a[k] = "url(#" + o + ")"
					}
				}
				b.gradients = m;
				b.colors = a
			}
			Ext.apply(this, b)
		}
	})()
});
Ext
		.define(
				"Ext.chart.theme.Base",
				{
					requires : [ "Ext.chart.theme.Theme" ],
					constructor : function(a) {
						Ext.chart.theme
								.call(
										this,
										a,
										{
											background : false,
											axis : {
												stroke : "#444",
												"stroke-width" : 1
											},
											axisLabelTop : {
												fill : "#444",
												font : '12px "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',
												spacing : 2,
												padding : 5,
												renderer : function(b) {
													return b
												}
											},
											axisLabelRight : {
												fill : "#444",
												font : '12px "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',
												spacing : 2,
												padding : 5,
												renderer : function(b) {
													return b
												}
											},
											axisLabelBottom : {
												fill : "#444",
												font : '12px "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',
												spacing : 2,
												padding : 5,
												renderer : function(b) {
													return b
												}
											},
											axisLabelLeft : {
												fill : "#444",
												font : '12px "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',
												spacing : 2,
												padding : 5,
												renderer : function(b) {
													return b
												}
											},
											axisTitleTop : {
												font : "bold 18px Lucida Grande",
												fill : "#444"
											},
											axisTitleRight : {
												font : "bold 18px Lucida Grande",
												fill : "#444",
												rotate : {
													x : 0,
													y : 0,
													degrees : 270
												}
											},
											axisTitleBottom : {
												font : "bold 18px Lucida Grande",
												fill : "#444"
											},
											axisTitleLeft : {
												font : "bold 18px Lucida Grande",
												fill : "#444",
												rotate : {
													x : 0,
													y : 0,
													degrees : 270
												}
											},
											series : {
												"stroke-width" : 0
											},
											seriesLabel : {
												font : "12px Arial",
												fill : "#333"
											},
											marker : {
												stroke : "#555",
												fill : "#000",
												radius : 3,
												size : 3
											},
											colors : [ "#94ae0a", "#115fa6",
													"#a61120", "#ff8809",
													"#ffd13e", "#a61187",
													"#24ad9a", "#7c7474",
													"#a66111" ],
											seriesThemes : [ {
												fill : "#115fa6"
											}, {
												fill : "#94ae0a"
											}, {
												fill : "#a61120"
											}, {
												fill : "#ff8809"
											}, {
												fill : "#ffd13e"
											}, {
												fill : "#a61187"
											}, {
												fill : "#24ad9a"
											}, {
												fill : "#7c7474"
											}, {
												fill : "#a66111"
											} ],
											markerThemes : [ {
												fill : "#115fa6",
												type : "circle"
											}, {
												fill : "#94ae0a",
												type : "cross"
											}, {
												fill : "#a61120",
												type : "plus"
											} ]
										})
					}
				},
				function() {
					var d = [ "#b1da5a", "#4ce0e7", "#e84b67", "#da5abd",
							"#4d7fe6", "#fec935" ], k = [ "Green", "Sky",
							"Red", "Purple", "Blue", "Yellow" ], h = 0, g = 0, b = d.length, a = Ext.chart.theme, e = [
							[ "#f0a50a", "#c20024", "#2044ba", "#810065",
									"#7eae29" ],
							[ "#6d9824", "#87146e", "#2a9196", "#d39006",
									"#1e40ac" ],
							[ "#fbbc29", "#ce2e4e", "#7e0062", "#158b90",
									"#57880e" ],
							[ "#ef5773", "#fcbd2a", "#4f770d", "#1d3eaa",
									"#9b001f" ],
							[ "#7eae29", "#fdbe2a", "#910019", "#27b4bc",
									"#d74dbc" ],
							[ "#44dce1", "#0b2592", "#996e05", "#7fb325",
									"#b821a1" ] ], f = e.length;
					for (; h < b; h++) {
						a[k[h]] = (function(i) {
							return Ext.extend(a.Base, {
								constructor : function(j) {
									a.Base.prototype.constructor.call(this, Ext
											.apply({
												baseColor : i
											}, j))
								}
							})
						})(d[h])
					}
					for (h = 0; h < f; h++) {
						a["Category" + (h + 1)] = (function(i) {
							return Ext.extend(a.Base, {
								constructor : function(j) {
									a.Base.prototype.constructor.call(this, Ext
											.apply({
												colors : i
											}, j))
								}
							})
						})(e[h])
					}
				});
Ext.define("Ext.data.Batch", {
	mixins : {
		observable : "Ext.util.Observable"
	},
	autoStart : false,
	current : -1,
	total : 0,
	isRunning : false,
	isComplete : false,
	hasException : false,
	pauseOnException : true,
	constructor : function(a) {
		this.addEvents("complete", "exception", "operationcomplete",
				"operation-complete");
		this.mixins.observable.constructor.call(this, a);
		this.operations = []
	},
	add : function(a) {
		this.total++;
		a.setBatch(this);
		this.operations.push(a)
	},
	start : function() {
		this.hasException = false;
		this.isRunning = true;
		this.runNextOperation()
	},
	runNextOperation : function() {
		this.runOperation(this.current + 1)
	},
	pause : function() {
		this.isRunning = false
	},
	runOperation : function(e) {
		var d = this.operations, b = d[e];
		if (b === undefined) {
			this.isRunning = false;
			this.isComplete = true;
			this.fireEvent("complete", this, d[d.length - 1])
		} else {
			this.current = e;
			var a = function(f) {
				var g = f.hasException();
				if (g) {
					this.hasException = true;
					this.fireEvent("exception", this, f)
				} else {
					this.fireEvent("operation-complete", this, f);
					this.fireEvent("operationcomplete", this, f)
				}
				if (g && this.pauseOnException) {
					this.pause()
				} else {
					f.setCompleted();
					this.runNextOperation()
				}
			};
			b.setStarted();
			this.proxy[b.action](b, a, this)
		}
	}
});
Ext
		.define(
				"Ext.data.Operation",
				{
					synchronous : true,
					action : undefined,
					filters : undefined,
					sorters : undefined,
					group : undefined,
					start : undefined,
					limit : undefined,
					batch : undefined,
					started : false,
					running : false,
					complete : false,
					success : undefined,
					exception : false,
					error : undefined,
					constructor : function(a) {
						Ext.apply(this, a || {})
					},
					setStarted : function() {
						this.started = true;
						this.running = true
					},
					setCompleted : function() {
						this.complete = true;
						this.running = false
					},
					setSuccessful : function() {
						this.success = true
					},
					setException : function(a) {
						this.exception = true;
						this.success = false;
						this.running = false;
						this.error = a
					},
					markStarted : function() {
						console
								.warn("Operation: markStarted has been deprecated. Please use setStarted");
						return this.setStarted()
					},
					markCompleted : function() {
						console
								.warn("Operation: markCompleted has been deprecated. Please use setCompleted");
						return this.setCompleted()
					},
					markSuccessful : function() {
						console
								.warn("Operation: markSuccessful has been deprecated. Please use setSuccessful");
						return this.setSuccessful()
					},
					markException : function() {
						console
								.warn("Operation: markException has been deprecated. Please use setException");
						return this.setException()
					},
					hasException : function() {
						return this.exception === true
					},
					getError : function() {
						return this.error
					},
					getRecords : function() {
						var a = this.getResultSet();
						return (a === undefined ? this.records : a.records)
					},
					getResultSet : function() {
						return this.resultSet
					},
					isStarted : function() {
						return this.started === true
					},
					isRunning : function() {
						return this.running === true
					},
					isComplete : function() {
						return this.complete === true
					},
					wasSuccessful : function() {
						return this.isComplete() && this.success === true
					},
					setBatch : function(a) {
						this.batch = a
					},
					allowWrite : function() {
						return this.action != "read"
					}
				});
Ext.define("Ext.data.Proxy",
		{
			requires : [ "Ext.data.Batch", "Ext.data.Operation",
					"Ext.data.Reader", "Ext.data.Writer" ],
			alias : "proxy.proxy",
			mixins : {
				observable : "Ext.util.Observable"
			},
			batchOrder : "create,update,destroy",
			defaultReaderType : "json",
			defaultWriterType : "json",
			constructor : function(a) {
				a = a || {};
				if (a.model === undefined) {
					delete a.model
				}
				this.mixins.observable.constructor.call(this, a);
				if (this.model !== undefined
						&& !(this.model instanceof Ext.data.Model)) {
					this.setModel(this.model)
				}
			},
			setModel : function(b, d) {
				this.model = Ext.ModelMgr.getModel(b);
				var a = this.reader, e = this.writer;
				this.setReader(a);
				this.setWriter(e);
				if (d && this.store) {
					this.store.setModel(this.model)
				}
			},
			getModel : function() {
				return this.model
			},
			setReader : function(a) {
				if (a === undefined || typeof a == "string") {
					a = {
						type : a
					}
				}
				if (a instanceof Ext.data.Reader) {
					a.setModel(this.model)
				} else {
					Ext.applyIf(a, {
						proxy : this,
						model : this.model,
						type : this.defaultReaderType
					});
					a = Ext.createByAlias("reader." + a.type, a)
				}
				this.reader = a;
				return this.reader
			},
			getReader : function() {
				return this.reader
			},
			setWriter : function(a) {
				if (a === undefined || typeof a == "string") {
					a = {
						type : a
					}
				}
				if (!(a instanceof Ext.data.Writer)) {
					Ext.applyIf(a, {
						model : this.model,
						type : this.defaultWriterType
					});
					a = Ext.createByAlias("writer." + a.type, a)
				}
				this.writer = a;
				return this.writer
			},
			getWriter : function() {
				return this.writer
			},
			create : Ext.emptyFn,
			read : Ext.emptyFn,
			update : Ext.emptyFn,
			destroy : Ext.emptyFn,
			batch : function(b, d) {
				var a = Ext.create("Ext.data.Batch", {
					proxy : this,
					listeners : d || {}
				});
				Ext.each(this.batchOrder.split(","), function(e) {
					if (b[e]) {
						a.add(Ext.create("Ext.data.Operation", {
							action : e,
							records : b[e]
						}))
					}
				}, this);
				a.start();
				return a
			}
		}, function() {
			Ext.data.DataProxy = this
		});
Ext
		.define(
				"Ext.data.ServerProxy",
				{
					extend : "Ext.data.Proxy",
					alias : "proxy.server",
					pageParam : "page",
					startParam : "start",
					limitParam : "limit",
					groupParam : "group",
					sortParam : "sort",
					filterParam : "filter",
					dirParam : "dir",
					legacySortMode : false,
					noCache : true,
					cacheString : "_dc",
					timeout : 30000,
					constructor : function(a) {
						a = a || {};
						Ext.data.ServerProxy.superclass.constructor.call(this,
								a);
						this.extraParams = a.extraParams || {};
						this.nocache = this.noCache
					},
					create : function() {
						return this.doRequest.apply(this, arguments)
					},
					read : function() {
						return this.doRequest.apply(this, arguments)
					},
					update : function() {
						return this.doRequest.apply(this, arguments)
					},
					destroy : function() {
						return this.doRequest.apply(this, arguments)
					},
					buildRequest : function(a) {
						var d = Ext.applyIf(a.params || {}, this.extraParams
								|| {});
						d = Ext.applyIf(d, this.getParams(d, a));
						var b = new Ext.data.Request({
							params : d,
							action : a.action,
							records : a.records,
							operation : a
						});
						b.url = this.buildUrl(b);
						a.request = b;
						return b
					},
					encodeSorters : function(e) {
						var b = [], d = e.length, a;
						for (a = 0; a < d; a++) {
							b[a] = {
								property : e[a].property,
								direction : e[a].direction
							}
						}
						return Ext.encode(b)
					},
					encodeFilters : function(e) {
						var b = [], d = e.length, a;
						for (a = 0; a < d; a++) {
							b[a] = {
								property : e[a].property,
								value : e[a].value
							}
						}
						return Ext.encode(b)
					},
					encodeGroupers : function(a) {
						return Ext.encode(a)
					},
					getParams : function(g, h) {
						g = g || {};
						var o = h.group, n = h.sorters, f = h.filters, m = h.page, d = h.start, i = h.limit, j = this.legacySortMode, q = this.pageParam, l = this.startParam, p = this.limitParam, k = this.groupParam, e = this.sortParam, b = this.filterParam, a = this.dirParam;
						if (q && m) {
							g[q] = m
						}
						if (l && d) {
							g[l] = d
						}
						if (p && i) {
							g[p] = i
						}
						if (k && o && o.field) {
							g[k] = this.encodeGroupers(o)
						}
						if (e && n && n.length > 0) {
							if (j) {
								g[e] = n[0].property;
								g[a] = n[0].direction
							} else {
								g[e] = this.encodeSorters(n)
							}
						}
						if (b && f && f.length > 0) {
							g[b] = this.encodeFilters(f)
						}
						return g
					},
					buildUrl : function(b) {
						var a = b.url || this.url;
						if (!a) {
							throw new Error(
									"You are using a ServerProxy but have not supplied it with a url.")
						}
						if (this.noCache) {
							a = Ext.urlAppend(a, Ext.String.format("{0}={1}",
									this.cacheString, Ext.Date.now()))
						}
						return a
					},
					doRequest : function(a, d, b) {
						throw new Error(
								"The doRequest function has not been implemented on your Ext.data.ServerProxy subclass. See src/data/ServerProxy.js for details")
					},
					afterRequest : Ext.emptyFn,
					onDestroy : function() {
						Ext.destroy(this.reader, this.writer);
						Ext.data.ServerProxy.superclass.destroy.apply(this,
								arguments)
					}
				});
Ext
		.define(
				"Ext.data.AjaxProxy",
				{
					requires : [ "Ext.util.MixedCollection", "Ext.Ajax" ],
					extend : "Ext.data.ServerProxy",
					alias : "proxy.ajax",
					actionMethods : {
						create : "POST",
						read : "GET",
						update : "POST",
						destroy : "POST"
					},
					constructor : function() {
						this.addEvents("exception");
						Ext.data.AjaxProxy.superclass.constructor.apply(this,
								arguments)
					},
					doRequest : function(a, f, b) {
						var e = this.getWriter(), d = this
								.buildRequest(a, f, b);
						if (a.allowWrite()) {
							d = e.write(d)
						}
						Ext.apply(d, {
							headers : this.headers,
							timeout : this.timeout,
							scope : this,
							callback : this.createRequestCallback(d, a, f, b),
							method : this.getMethod(d),
							disableCaching : false
						});
						Ext.Ajax.request(d);
						return d
					},
					getMethod : function(a) {
						return this.actionMethods[a.action]
					},
					createRequestCallback : function(e, a, f, b) {
						var d = this;
						return function(p, o, j) {
							if (o === true) {
								var m = d.getReader(), q = m.read(j), h = q.records, g = h.length, n = Ext
										.create("Ext.util.MixedCollection",
												true, function(i) {
													return i.getId()
												}), l, k;
								n.addAll(a.records);
								for (k = 0; k < g; k++) {
									l = n.get(h[k].getId());
									if (l) {
										l.set(l.data)
									}
								}
								Ext.apply(a, {
									response : j,
									resultSet : q
								});
								a.setCompleted();
								a.setSuccessful()
							} else {
								d.fireEvent("exception", this, j, a);
								a.setException()
							}
							if (typeof f == "function") {
								f.call(b || d, a)
							}
							d.afterRequest(e, true)
						}
					}
				}, function() {
					Ext.data.HttpProxy = this
				});
Ext
		.define(
				"Ext.data.ClientProxy",
				{
					extend : "Ext.data.Proxy",
					clear : function() {
						throw new Error(
								"The Ext.data.ClientProxy subclass that you are using has not defined a 'clear' function. See src/data/ClientProxy.js for details.")
					}
				});
Ext.define("Ext.data.MemoryProxy", {
	extend : "Ext.data.ClientProxy",
	alias : "proxy.memory",
	constructor : function(a) {
		Ext.data.MemoryProxy.superclass.constructor.call(this, a);
		this.setReader(this.reader)
	},
	read : function(d, f, e) {
		var b = this.getReader(), a = b.read(this.data);
		Ext.apply(d, {
			resultSet : a
		});
		d.setCompleted();
		if (typeof f == "function") {
			f.call(e || this, d)
		}
	},
	clear : Ext.emptyFn
});
Ext.define("Ext.util.Offset", {
	statics : {
		fromObject : function(a) {
			return new this(a.x, a.y)
		}
	},
	constructor : function(a, b) {
		this.x = (a != null && !isNaN(a)) ? a : 0;
		this.y = (b != null && !isNaN(b)) ? b : 0;
		return this
	},
	copy : function() {
		return new Ext.util.Offset(this.x, this.y)
	},
	copyFrom : function(a) {
		this.x = a.x;
		this.y = a.y
	},
	toString : function() {
		return "Offset[" + this.x + "," + this.y + "]"
	},
	equals : function(a) {
		if (!(a instanceof this.self)) {
			throw new Error("offset must be an instance of Ext.util.Offset")
		}
		return (this.x == a.x && this.y == a.y)
	},
	round : function(b) {
		if (!isNaN(b)) {
			var a = Math.pow(10, b);
			this.x = Math.round(this.x * a) / a;
			this.y = Math.round(this.y * a) / a
		} else {
			this.x = Math.round(this.x);
			this.y = Math.round(this.y)
		}
	},
	isZero : function() {
		return this.x == 0 && this.y == 0
	}
});
Ext
		.define(
				"Ext.util.Region",
				{
					requires : [ "Ext.util.Offset" ],
					statics : {
						getRegion : function(a) {
							return Ext.fly(a).getPageBox(true)
						},
						from : function(a) {
							return new this(a.top, a.right, a.bottom, a.left)
						}
					},
					constructor : function(e, g, a, d) {
						var f = this;
						f.y = f.top = f[1] = e;
						f.right = g;
						f.bottom = a;
						f.x = f.left = f[0] = d
					},
					contains : function(b) {
						var a = this;
						return (b.x >= a.x && b.right <= a.right && b.y >= a.y && b.bottom <= a.bottom)
					},
					intersect : function(h) {
						var g = this, e = Math.max(g.y, h.y), f = Math.min(
								g.right, h.right), a = Math.min(g.bottom,
								h.bottom), d = Math.max(g.x, h.x);
						if (a > e && f > d) {
							return new this.self(e, f, a, d)
						} else {
							return false
						}
					},
					union : function(h) {
						var g = this, e = Math.min(g.y, h.y), f = Math.max(
								g.right, h.right), a = Math.max(g.bottom,
								h.bottom), d = Math.min(g.x, h.x);
						return new this.self(e, f, a, d)
					},
					constrainTo : function(b) {
						var a = this, d = Ext.Number.constrain;
						a.top = a.y = d(a.y, b.y, b.bottom);
						a.bottom = d(a.bottom, b.y, b.bottom);
						a.left = a.x = d(a.x, b.x, b.right);
						a.right = d(a.right, b.x, b.right);
						return a
					},
					adjust : function(e, g, a, d) {
						var f = this;
						f.top = f.y += e;
						f.left = f.x += d;
						f.right += g;
						f.bottom += a;
						return f
					},
					getOutOfBoundOffset : function(a, b) {
						if (!Ext.isObject(a)) {
							if (a == "x") {
								return this.getOutOfBoundOffsetX(b)
							} else {
								return this.getOutOfBoundOffsetY(b)
							}
						} else {
							b = a;
							var e = new Ext.util.Offset();
							e.x = this.getOutOfBoundOffsetX(b.x);
							e.y = this.getOutOfBoundOffsetY(b.y);
							return e
						}
					},
					getOutOfBoundOffsetX : function(a) {
						if (a <= this.x) {
							return this.x - a
						} else {
							if (a >= this.right) {
								return this.right - a
							}
						}
						return 0
					},
					getOutOfBoundOffsetY : function(a) {
						if (a <= this.y) {
							return this.y - a
						} else {
							if (a >= this.bottom) {
								return this.bottom - a
							}
						}
						return 0
					},
					isOutOfBound : function(a, b) {
						if (!Ext.isObject(a)) {
							if (a == "x") {
								return this.isOutOfBoundX(b)
							} else {
								return this.isOutOfBoundY(b)
							}
						} else {
							b = a;
							return (this.isOutOfBoundX(b.x) || this
									.isOutOfBoundY(b.y))
						}
					},
					isOutOfBoundX : function(a) {
						return (a < this.x || a > this.right)
					},
					isOutOfBoundY : function(a) {
						return (a < this.y || a > this.bottom)
					},
					restrict : function(b, e, a) {
						if (Ext.isObject(b)) {
							var d;
							a = e;
							e = b;
							if (e.copy) {
								d = e.copy()
							} else {
								d = {
									x : e.x,
									y : e.y
								}
							}
							d.x = this.restrictX(e.x, a);
							d.y = this.restrictY(e.y, a);
							return d
						} else {
							if (b == "x") {
								return this.restrictX(e, a)
							} else {
								return this.restrictY(e, a)
							}
						}
					},
					restrictX : function(b, a) {
						if (!a) {
							a = 1
						}
						if (b <= this.x) {
							b -= (b - this.x) * a
						} else {
							if (b >= this.right) {
								b -= (b - this.right) * a
							}
						}
						return b
					},
					restrictY : function(b, a) {
						if (!a) {
							a = 1
						}
						if (b <= this.y) {
							b -= (b - this.y) * a
						} else {
							if (b >= this.bottom) {
								b -= (b - this.bottom) * a
							}
						}
						return b
					},
					getSize : function() {
						return {
							width : this.right - this.x,
							height : this.bottom - this.y
						}
					},
					copy : function() {
						return new this.self(this.y, this.right, this.bottom,
								this.x)
					},
					copyFrom : function(b) {
						var a = this;
						a.top = a.y = a[1] = b.y;
						a.right = b.right;
						a.bottom = b.bottom;
						a.left = a.x = a[0] = b.x;
						return this
					},
					toString : function() {
						return "Region[" + this.top + "," + this.right + ","
								+ this.bottom + "," + this.left + "]"
					},
					translateBy : function(a, d) {
						if (arguments.length == 1) {
							d = a.y;
							a = a.x
						}
						var b = this;
						b.top = b.y += d;
						b.right += a;
						b.bottom += d;
						b.left = b.x += a;
						return b
					},
					round : function() {
						var a = this;
						a.top = a.y = Math.round(a.y);
						a.right = Math.round(a.right);
						a.bottom = Math.round(a.bottom);
						a.left = a.x = Math.round(a.x);
						return a
					},
					equals : function(a) {
						return (this.top == a.top && this.right == a.right
								&& this.bottom == a.bottom && this.left == a.left)
					}
				});
Ext
		.define(
				"Ext.util.Point",
				{
					extend : "Ext.util.Region",
					statics : {
						fromEvent : function(a) {
							a = (a.changedTouches && a.changedTouches.length > 0) ? a.changedTouches[0]
									: a;
							return new this(a.pageX, a.pageY)
						}
					},
					constructor : function(a, b) {
						Ext.util.Point.superclass.constructor.call(this, b, a,
								b, a)
					},
					toString : function() {
						return "Point[" + this.x + "," + this.y + "]"
					},
					equals : function(a) {
						return (this.x == a.x && this.y == a.y)
					},
					isWithin : function(b, a) {
						if (!Ext.isObject(a)) {
							a = {
								x : a,
								y : a
							}
						}
						return (this.x <= b.x + a.x && this.x >= b.x - a.x
								&& this.y <= b.y + a.y && this.y >= b.y - a.y)
					},
					roundedEquals : function(a) {
						return (Math.round(this.x) == Math.round(a.x) && Math
								.round(this.y) == Math.round(a.y))
					}
				},
				function() {
					this.prototype.translate = Ext.util.Region.prototype.translateBy
				});
Ext.define("Ext.util.Grouper", {
	extend : "Ext.util.Sorter",
	getGroupString : function(a) {
		return a.get(this.property)
	}
});
Ext
		.define(
				"Ext.data.AbstractStore",
				{
					requires : [ "Ext.util.MixedCollection",
							"Ext.data.Operation", "Ext.util.Sorter",
							"Ext.util.Filter", "Ext.util.Grouper" ],
					mixins : {
						observable : "Ext.util.Observable"
					},
					remoteSort : false,
					remoteFilter : false,
					autoLoad : false,
					autoSave : false,
					batchUpdateMode : "operation",
					filterOnLoad : true,
					sortOnLoad : true,
					defaultSortDirection : "ASC",
					implicitModel : false,
					defaultProxyType : "memory",
					isDestroyed : false,
					isStore : true,
					constructor : function(a) {
						this.addEvents("add", "remove", "update",
								"datachanged", "beforeload", "load",
								"beforesync");
						Ext.apply(this, a);
						this.removed = [];
						this.sortToggle = {};
						this.mixins.observable.constructor.apply(this,
								arguments);
						this.model = Ext.ModelMgr.getModel(a.model);
						Ext.applyIf(this, {
							modelDefaults : {}
						});
						if (!this.model && a.fields) {
							this.model = Ext.regModel(
									"Ext.data.Store.ImplicitModel-"
											+ this.storeId || Ext.id(), {
										fields : a.fields
									});
							delete this.fields;
							this.implicitModel = true
						}
						this.setProxy(a.proxy || this.model.proxy);
						if (this.id && !this.storeId) {
							this.storeId = this.id;
							delete this.id
						}
						if (this.storeId) {
							Ext.data.StoreMgr.register(this)
						}
						if (!a.groupers && a.groupField) {
							a.groupers = [ {
								property : a.groupField,
								direction : a.groupDir
							} ]
						}
						this.groupers = Ext.create("Ext.util.MixedCollection");
						this.groupers.addAll(this.decodeGroupers(a.groupers));
						this.sorters = Ext.create("Ext.util.MixedCollection");
						this.sorters.addAll(this.groupers.items);
						this.sorters.addAll(this.decodeSorters(a.sorters));
						this.filters = Ext.create("Ext.util.MixedCollection");
						this.filters.addAll(this.decodeFilters(a.filters))
					},
					setProxy : function(a) {
						if (a instanceof Ext.data.Proxy) {
							a.setModel(this.model)
						} else {
							Ext.applyIf(a, {
								model : this.model
							});
							a = Ext.createByAlias("proxy." + a.type, a)
						}
						this.proxy = a;
						return this.proxy
					},
					getProxy : function() {
						return this.proxy
					},
					create : function(e, d) {
						var a = Ext.ModelMgr.create(Ext.applyIf(e,
								this.modelDefaults), this.model.modelName), b;
						d = d || {};
						Ext.applyIf(d, {
							action : "create",
							records : [ a ]
						});
						b = Ext.create("Ext.data.Operation", d);
						this.proxy.create(b, this.onProxyWrite, this);
						return a
					},
					read : function() {
						return this.load.apply(this, arguments)
					},
					onProxyRead : Ext.emptyFn,
					update : function(b) {
						b = b || {};
						Ext.applyIf(b, {
							action : "update",
							records : this.getUpdatedRecords()
						});
						var a = Ext.create("Ext.data.Operation", b);
						return this.proxy.update(a, this.onProxyWrite, this)
					},
					onProxyWrite : Ext.emptyFn,
					destroy : function(b) {
						b = b || {};
						Ext.applyIf(b, {
							action : "destroy",
							records : this.getRemovedRecords()
						});
						var a = Ext.create("Ext.data.Operation", b);
						return this.proxy.destroy(a, this.onProxyWrite, this)
					},
					onBatchOperationComplete : function(b, a) {
						return this.onProxyWrite(a)
					},
					onBatchComplete : function(d, a) {
						var b = d.operations, f = b.length, e;
						this.suspendEvents();
						for (e = 0; e < f; e++) {
							this.onProxyWrite(b[e])
						}
						this.resumeEvents();
						this.fireEvent("datachanged", this)
					},
					onBatchException : function(b, a) {
					},
					filterNew : function(a) {
						return a.phantom === true || a.needsAdd === true
					},
					getNewRecords : function() {
						return []
					},
					getUpdatedRecords : function() {
						return []
					},
					filterDirty : function(a) {
						return a.dirty === true
					},
					getRemovedRecords : function() {
						return this.removed
					},
					sort : function(b, a) {
					},
					decodeSorters : function(e) {
						if (!Ext.isArray(e)) {
							if (e === undefined) {
								e = []
							} else {
								e = [ e ]
							}
						}
						var d = e.length, f = Ext.util.Sorter, a, b;
						for (b = 0; b < d; b++) {
							a = e[b];
							if (!(a instanceof f)) {
								if (Ext.isString(a)) {
									a = {
										property : a
									}
								}
								Ext.applyIf(a, {
									root : "data",
									direction : "ASC"
								});
								if (a.fn) {
									a.sorterFn = a.fn
								}
								if (typeof a == "function") {
									a = {
										sorterFn : a
									}
								}
								e[b] = new f(a)
							}
						}
						return e
					},
					filter : function(a, b) {
					},
					createSortFunction : function(e, d) {
						d = d || "ASC";
						var b = d.toUpperCase() == "DESC" ? -1 : 1;
						var a = this.model.prototype.fields, f = a.get(e).sortType;
						return function(h, g) {
							var j = f(h.data[e]), i = f(g.data[e]);
							return b * (j > i ? 1 : (j < i ? -1 : 0))
						}
					},
					decodeFilters : function(f) {
						if (!Ext.isArray(f)) {
							if (f === undefined) {
								f = []
							} else {
								f = [ f ]
							}
						}
						var e = f.length, a = Ext.util.Filter, b, d;
						for (d = 0; d < e; d++) {
							b = f[d];
							if (!(b instanceof a)) {
								Ext.apply(b, {
									root : "data"
								});
								if (b.fn) {
									b.filterFn = b.fn
								}
								if (typeof b == "function") {
									b = {
										filterFn : b
									}
								}
								f[d] = new a(b)
							}
						}
						return f
					},
					clearFilter : function(a) {
					},
					isFiltered : function() {
					},
					filterBy : function(b, a) {
					},
					decodeGroupers : function(e) {
						if (!Ext.isArray(e)) {
							if (e === undefined) {
								e = []
							} else {
								e = [ e ]
							}
						}
						var d = e.length, f = Ext.util.Grouper, a, b;
						for (b = 0; b < d; b++) {
							a = e[b];
							if (!(a instanceof f)) {
								if (Ext.isString(a)) {
									a = {
										property : a
									}
								}
								Ext.applyIf(a, {
									root : "data",
									direction : "ASC"
								});
								if (a.fn) {
									a.sorterFn = a.fn
								}
								if (typeof a == "function") {
									a = {
										sorterFn : a
									}
								}
								e[b] = new f(a)
							}
						}
						return e
					},
					sync : function() {
						var e = this, b = {}, f = e.getNewRecords(), d = e
								.getUpdatedRecords(), a = e.getRemovedRecords(), g = false;
						if (f.length > 0) {
							b.create = f;
							g = true
						}
						if (d.length > 0) {
							b.update = d;
							g = true
						}
						if (a.length > 0) {
							b.destroy = a;
							g = true
						}
						if (g && e.fireEvent("beforesync", b) !== false) {
							e.proxy.batch(b, e.getBatchListeners())
						}
					},
					getBatchListeners : function() {
						var a = {
							scope : this,
							exception : this.onBatchException
						};
						if (this.batchUpdateMode == "operation") {
							a.operationcomplete = this.onBatchOperationComplete
						} else {
							a.complete = this.onBatchComplete
						}
						return a
					},
					save : function() {
						return this.sync.apply(this, arguments)
					},
					load : function(b) {
						var d = this, a;
						b = b || {};
						Ext.applyIf(b, {
							action : "read",
							filters : d.filters.items,
							sorters : d.sorters.items
						});
						a = Ext.create("Ext.data.Operation", b);
						if (d.fireEvent("beforeload", d, a) !== false) {
							d.loading = true;
							d.proxy.read(a, d.onProxyLoad, d)
						}
						return d
					},
					afterEdit : function(a) {
						this.fireEvent("update", this, a, Ext.data.Model.EDIT)
					},
					afterReject : function(a) {
						this
								.fireEvent("update", this, a,
										Ext.data.Model.REJECT)
					},
					afterCommit : function(a) {
						if (this.autoSave) {
							this.sync()
						}
						this
								.fireEvent("update", this, a,
										Ext.data.Model.COMMIT)
					},
					clearData : Ext.emptyFn,
					destroyStore : function() {
						if (!this.isDestroyed) {
							if (this.storeId) {
								Ext.data.StoreMgr.unregister(this)
							}
							this.clearData();
							this.data = null;
							this.tree = null;
							this.reader = this.writer = null;
							this.clearListeners();
							this.isDestroyed = true;
							if (this.implicitModel) {
								Ext.destroy(this.model)
							}
						}
					},
					getSortState : function() {
						return this.sortInfo
					},
					getCount : function() {
					},
					getById : function(a) {
					},
					removeAll : function() {
					}
				});
Ext.define("Ext.util.HashMap", {
	mixins : {
		observable : "Ext.util.Observable"
	},
	constructor : function(a) {
		this.addEvents("add", "clear", "remove", "replace");
		this.mixins.observable.constructor.call(this, a);
		this.clear(true)
	},
	getCount : function() {
		return this.length
	},
	getData : function(a, b) {
		if (b === undefined) {
			b = a;
			a = this.getKey(b)
		}
		return [ a, b ]
	},
	getKey : function(a) {
		return a.id
	},
	add : function(a, e) {
		var b = this, d;
		if (b.containsKey(a)) {
			throw new Error("This key already exists in the HashMap")
		}
		d = this.getData(a, e);
		a = d[0];
		e = d[1];
		b.map[a] = e;
		++b.length;
		b.fireEvent("add", b, a, e);
		return e
	},
	replace : function(b, e) {
		var d = this, f = d.map, a;
		if (!d.containsKey(b)) {
			d.add(b, e)
		}
		a = f[b];
		f[b] = e;
		d.fireEvent("replace", d, b, e, a);
		return e
	},
	remove : function(b) {
		var a = this.findKey(b);
		if (a !== undefined) {
			return this.removeByKey(a)
		}
		return false
	},
	removeByKey : function(a) {
		var b = this, d;
		if (b.containsKey(a)) {
			d = b.map[a];
			delete b.map[a];
			--b.length;
			b.fireEvent("remove", b, a, d);
			return true
		}
		return false
	},
	get : function(a) {
		return this.map[a]
	},
	clear : function(a) {
		var b = this;
		b.map = {};
		b.length = 0;
		if (a !== true) {
			b.fireEvent("clear", b)
		}
		return b
	},
	containsKey : function(a) {
		return this.map[a] !== undefined
	},
	contains : function(a) {
		return this.containsKey(this.findKey(a))
	},
	getKeys : function() {
		return this.getArray(true)
	},
	getValues : function() {
		return this.getArray(false)
	},
	getArray : function(e) {
		var a = [], b, d = this.map;
		for (b in d) {
			if (d.hasOwnProperty(b)) {
				a.push(e ? b : d[b])
			}
		}
		return a
	},
	each : function(e, d) {
		var a = Ext.apply({}, this.map), b, f = this.length;
		d = d || this;
		for (b in a) {
			if (a.hasOwnProperty(b)) {
				if (e.call(d, b, a[b], f) === false) {
					break
				}
			}
		}
		return this
	},
	clone : function() {
		var d = new this.self(), b = this.map, a;
		d.suspendEvents();
		for (a in b) {
			if (b.hasOwnProperty(a)) {
				d.add(a, b[a])
			}
		}
		d.resumeEvents();
		return d
	},
	findKey : function(b) {
		var a, d = this.map;
		for (a in d) {
			if (d.hasOwnProperty(a) && d[a] === b) {
				return a
			}
		}
		return undefined
	}
});
Ext.define("Ext.AbstractManager", {
	requires : [ "Ext.util.HashMap" ],
	typeName : "type",
	constructor : function(a) {
		Ext.apply(this, a || {});
		this.all = new Ext.util.HashMap();
		this.types = {}
	},
	get : function(a) {
		return this.all.get(a)
	},
	register : function(a) {
		this.all.add(a)
	},
	unregister : function(a) {
		this.all.remove(a)
	},
	registerType : function(b, a) {
		this.types[b] = a;
		a[this.typeName] = b
	},
	isRegistered : function(a) {
		return this.types[a] !== undefined
	},
	create : function(a, e) {
		var b = a[this.typeName] || a.type || e, d = this.types[b];
		if (d == undefined) {
			throw new Error(Ext.String.format(
					"The '{0}' type has not been registered with this manager",
					b))
		}
		return new d(a)
	},
	onAvailable : function(e, d, b) {
		var a = this.all;
		a.on("add", function(f, g) {
			if (g.id == e) {
				d.call(b || g, g);
				a.un("add", d, b)
			}
		})
	},
	each : function(b, a) {
		this.all.each(b, a || this)
	},
	getCount : function() {
		return this.all.getCount()
	}
});
Ext.define("Ext.PluginMgr", {
	extend : "Ext.AbstractManager",
	singleton : true,
	typeName : "ptype",
	create : function(a, b) {
		if (a.init) {
			return a
		} else {
			return Ext.createByAlias("plugin." + (a.ptype || b), a)
		}
	},
	findByType : function(d, g) {
		var f = [], b = this.types;
		for ( var a in b) {
			if (!b.hasOwnProperty(a)) {
				continue
			}
			var e = b[a];
			if (e.type == d && (!g || (g === true && e.isDefault))) {
				f.push(e)
			}
		}
		return f
	}
}, function() {
	Ext.preg = function() {
		return Ext.PluginMgr.registerType.apply(Ext.PluginMgr, arguments)
	}
});
Ext.define("Ext.data.SortTypes", {
	none : function(a) {
		return a
	},
	stripTagsRE : /<\/?[^>]+>/gi,
	asText : function(a) {
		return String(a).replace(this.stripTagsRE, "")
	},
	asUCText : function(a) {
		return String(a).toUpperCase().replace(this.stripTagsRE, "")
	},
	asUCString : function(a) {
		return String(a).toUpperCase()
	},
	asDate : function(a) {
		if (!a) {
			return 0
		}
		if (Ext.isDate(a)) {
			return a.getTime()
		}
		return Date.parse(String(a))
	},
	asFloat : function(a) {
		var b = parseFloat(String(a).replace(/,/g, ""));
		return isNaN(b) ? 0 : b
	},
	asInt : function(a) {
		var b = parseInt(String(a).replace(/,/g, ""), 10);
		return isNaN(b) ? 0 : b
	}
});
(function() {
	function a(d) {
		var b = Array.prototype.slice.call(arguments, 1);
		return d.replace(/\{(\d+)\}/g, function(e, f) {
			return b[f]
		})
	}
	Ext
			.define(
					"Ext.util.Date",
					{
						singleton : true,
						useStrict : false,
						formatCodeToRegex : function(d, b) {
							var e = Ext.util.Date.parseCodes[d];
							if (e) {
								e = typeof e == "function" ? e() : e;
								Ext.util.Date.parseCodes[d] = e
							}
							return e ? Ext.applyIf({
								c : e.c ? a(e.c, b || "{0}") : e.c
							}, e) : {
								g : 0,
								c : null,
								s : Ext.String.escapeRegex(d)
							}
						},
						parseFunctions : {
							"M$" : function(d, b) {
								var e = new RegExp(
										"\\/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\/");
								var f = (d || "").match(e);
								return f ? new Date(((f[1] || "") + f[2]) * 1)
										: null
							}
						},
						parseRegexes : [],
						formatFunctions : {
							"M$" : function(b) {
								return "\\/Date(" + b.getTime() + ")\\/"
							}
						},
						y2kYear : 50,
						MILLI : "ms",
						SECOND : "s",
						MINUTE : "mi",
						HOUR : "h",
						DAY : "d",
						MONTH : "mo",
						YEAR : "y",
						defaults : {},
						dayNames : [ "Sunday", "Monday", "Tuesday",
								"Wednesday", "Thursday", "Friday", "Saturday" ],
						monthNames : [ "January", "February", "March", "April",
								"May", "June", "July", "August", "September",
								"October", "November", "December" ],
						monthNumbers : {
							Jan : 0,
							Feb : 1,
							Mar : 2,
							Apr : 3,
							May : 4,
							Jun : 5,
							Jul : 6,
							Aug : 7,
							Sep : 8,
							Oct : 9,
							Nov : 10,
							Dec : 11
						},
						defaultFormat : "m/d/Y",
						getShortMonthName : function(b) {
							return Ext.util.Date.monthNames[b].substring(0, 3)
						},
						getShortDayName : function(b) {
							return Ext.util.Date.dayNames[b].substring(0, 3)
						},
						getMonthNumber : function(b) {
							return Ext.util.Date.monthNumbers[b.substring(0, 1)
									.toUpperCase()
									+ b.substring(1, 3).toLowerCase()]
						},
						formatCodes : {
							d : "Ext.String.leftPad(this.getDate(), 2, '0')",
							D : "Ext.util.Date.getShortDayName(this.getDay())",
							j : "this.getDate()",
							l : "Ext.util.Date.dayNames[this.getDay()]",
							N : "(this.getDay() ? this.getDay() : 7)",
							S : "Ext.util.Date.getSuffix(date)",
							w : "this.getDay()",
							z : "Ext.util.Date.getDayOfYear(date)",
							W : "Ext.String.leftPad(Ext.util.Date.getWeekOfYear(date), 2, '0')",
							F : "Ext.util.Date.monthNames[this.getMonth()]",
							m : "Ext.String.leftPad(this.getMonth() + 1, 2, '0')",
							M : "Ext.util.Date.getShortMonthName(this.getMonth())",
							n : "(this.getMonth() + 1)",
							t : "Ext.util.Date.getDaysInMonth(date)",
							L : "(Ext.util.Date.isLeapYear(date) ? 1 : 0)",
							o : "(this.getFullYear() + (Ext.util.Date.getWeekOfYear(date) == 1 && this.getMonth() > 0 ? +1 : (Ext.util.Date.getWeekOfYear() >= 52 && this.getMonth() < 11 ? -1 : 0)))",
							Y : "Ext.String.leftPad(this.getFullYear(), 4, '0')",
							y : "('' + this.getFullYear()).substring(2, 4)",
							a : "(this.getHours() < 12 ? 'am' : 'pm')",
							A : "(this.getHours() < 12 ? 'AM' : 'PM')",
							g : "((this.getHours() % 12) ? this.getHours() % 12 : 12)",
							G : "this.getHours()",
							h : "Ext.String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')",
							H : "Ext.String.leftPad(this.getHours(), 2, '0')",
							i : "Ext.String.leftPad(this.getMinutes(), 2, '0')",
							s : "Ext.String.leftPad(this.getSeconds(), 2, '0')",
							u : "Ext.String.leftPad(this.getMilliseconds(), 3, '0')",
							O : "Ext.util.Date.getGMTOffset(date)",
							P : "Ext.util.Date.getGMTOffset(date, true)",
							T : "Ext.util.Date.getTimezone(date)",
							Z : "(this.getTimezoneOffset() * -60)",
							c : function() {
								for (var h = "Y-m-dTH:i:sP", f = [], d = 0, b = h.length; d < b; ++d) {
									var g = h.charAt(d);
									f.push(g == "T" ? "'T'" : Ext.util.Date
											.getFormatCode(g))
								}
								return f.join(" + ")
							},
							U : "Math.round(date.getTime() / 1000)"
						},
						isValid : function(n, b, l, j, f, g, e) {
							j = j || 0;
							f = f || 0;
							g = g || 0;
							e = e || 0;
							var k = Ext.util.Date.add(new Date(n < 100 ? 100
									: n, b - 1, l, j, f, g, e),
									Ext.util.Date.YEAR, n < 100 ? n - 100 : 0);
							return n == k.getFullYear()
									&& b == k.getMonth() + 1
									&& l == k.getDate() && j == k.getHours()
									&& f == k.getMinutes()
									&& g == k.getSeconds()
									&& e == k.getMilliseconds()
						},
						parseDate : function(d, f, b) {
							var e = Ext.util.Date.parseFunctions;
							if (e[f] == null) {
								Ext.util.Date.createParser(f)
							}
							return e[f](d, Ext.isDefined(b) ? b
									: Ext.util.Date.useStrict)
						},
						getFormatCode : function(d) {
							var b = Ext.util.Date.formatCodes[d];
							if (b) {
								b = typeof b == "function" ? b() : b;
								Ext.util.Date.formatCodes[d] = b
							}
							return b || ("'" + Ext.String.escape(d) + "'")
						},
						createFormat : function(g) {
							var f = [], b = false, e = "";
							for (var d = 0; d < g.length; ++d) {
								e = g.charAt(d);
								if (!b && e == "\\") {
									b = true
								} else {
									if (b) {
										b = false;
										f
												.push("'"
														+ Ext.String.escape(e)
														+ "'")
									} else {
										f.push(Ext.util.Date.getFormatCode(e))
									}
								}
							}
							Ext.util.Date.formatFunctions[g] = new Function(
									"return " + f.join("+"))
						},
						createParser : (function() {
							var b = [
									"var dt, y, m, d, h, i, s, ms, o, z, zz, u, v,",
									"def = Ext.util.Date.defaults,",
									"results = String(input).match(Ext.util.Date.parseRegexes[{0}]);",
									"if(results){",
									"{1}",
									"if(u != null){",
									"v = new Date(u * 1000);",
									"}else{",
									"dt = Ext.Date.clearTime(new Date);",
									"y = Ext.num(y, Ext.num(def.y, dt.getFullYear()));",
									"m = Ext.num(m, Ext.num(def.m - 1, dt.getMonth()));",
									"d = Ext.num(d, Ext.num(def.d, dt.getDate()));",
									"h  = Ext.num(h, Ext.num(def.h, dt.getHours()));",
									"i  = Ext.num(i, Ext.num(def.i, dt.getMinutes()));",
									"s  = Ext.num(s, Ext.num(def.s, dt.getSeconds()));",
									"ms = Ext.num(ms, Ext.num(def.ms, dt.getMilliseconds()));",
									"if(z >= 0 && y >= 0){",
									"v = Ext.util.Date.add(new Date(y < 100 ? 100 : y, 0, 1, h, i, s, ms), Ext.util.Date.YEAR, y < 100 ? y - 100 : 0);",
									"v = !strict? v : (strict === true && (z <= 364 || (Ext.util.Date.isLeapYear(v) && z <= 365))? Ext.util.Date.add(v, Ext.util.Date.DAY, z) : null);",
									"}else if(strict === true && !Ext.util.Date.isValid(y, m + 1, d, h, i, s, ms)){",
									"v = null;",
									"}else{",
									"v = Ext.util.Date.add(new Date(y < 100 ? 100 : y, m, d, h, i, s, ms), Ext.util.Date.YEAR, y < 100 ? y - 100 : 0);",
									"}",
									"}",
									"}",
									"if(v){",
									"if(zz != null){",
									"v = Ext.util.Date.add(v, Ext.util.Date.SECOND, -v.getTimezoneOffset() * 60 - zz);",
									"}else if(o){",
									"v = Ext.util.Date.add(v, Ext.util.Date.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn));",
									"}", "}", "return v;" ].join("\n");
							return function(l) {
								var e = Ext.util.Date.parseRegexes.length, m = 1, f = [], k = [], j = false, d = "";
								for (var h = 0; h < l.length; ++h) {
									d = l.charAt(h);
									if (!j && d == "\\") {
										j = true
									} else {
										if (j) {
											j = false;
											k.push(Ext.String.escape(d))
										} else {
											var g = Ext.util.Date
													.formatCodeToRegex(d, m);
											m += g.g;
											k.push(g.s);
											if (g.g && g.c) {
												f.push(g.c)
											}
										}
									}
								}
								Ext.util.Date.parseRegexes[e] = new RegExp("^"
										+ k.join("") + "$", "i");
								Ext.util.Date.parseFunctions[l] = new Function(
										"input", "strict", a(b, e, f.join("")))
							}
						})(),
						parseCodes : {
							d : {
								g : 1,
								c : "d = parseInt(results[{0}], 10);\n",
								s : "(\\d{2})"
							},
							j : {
								g : 1,
								c : "d = parseInt(results[{0}], 10);\n",
								s : "(\\d{1,2})"
							},
							D : function() {
								for (var b = [], d = 0; d < 7; b
										.push(Ext.util.Date.getShortDayName(d)), ++d) {
								}
								return {
									g : 0,
									c : null,
									s : "(?:" + b.join("|") + ")"
								}
							},
							l : function() {
								return {
									g : 0,
									c : null,
									s : "(?:"
											+ Ext.util.Date.dayNames.join("|")
											+ ")"
								}
							},
							N : {
								g : 0,
								c : null,
								s : "[1-7]"
							},
							S : {
								g : 0,
								c : null,
								s : "(?:st|nd|rd|th)"
							},
							w : {
								g : 0,
								c : null,
								s : "[0-6]"
							},
							z : {
								g : 1,
								c : "z = parseInt(results[{0}], 10);\n",
								s : "(\\d{1,3})"
							},
							W : {
								g : 0,
								c : null,
								s : "(?:\\d{2})"
							},
							F : function() {
								return {
									g : 1,
									c : "m = parseInt(Ext.util.Date.getMonthNumber(results[{0}]), 10);\n",
									s : "("
											+ Ext.util.Date.monthNames
													.join("|") + ")"
								}
							},
							M : function() {
								for (var b = [], d = 0; d < 12; b
										.push(Ext.util.Date
												.getShortMonthName(d)), ++d) {
								}
								return Ext.applyIf({
									s : "(" + b.join("|") + ")"
								}, Ext.util.Date.formatCodeToRegex("F"))
							},
							m : {
								g : 1,
								c : "m = parseInt(results[{0}], 10) - 1;\n",
								s : "(\\d{2})"
							},
							n : {
								g : 1,
								c : "m = parseInt(results[{0}], 10) - 1;\n",
								s : "(\\d{1,2})"
							},
							t : {
								g : 0,
								c : null,
								s : "(?:\\d{2})"
							},
							L : {
								g : 0,
								c : null,
								s : "(?:1|0)"
							},
							o : function() {
								return Ext.util.Date.formatCodeToRegex("Y")
							},
							Y : {
								g : 1,
								c : "y = parseInt(results[{0}], 10);\n",
								s : "(\\d{4})"
							},
							y : {
								g : 1,
								c : "var ty = parseInt(results[{0}], 10);\ny = ty > Ext.util.Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
								s : "(\\d{1,2})"
							},
							a : {
								g : 1,
								c : "if (/(am)/i.test(results[{0}])) {\nif (!h || h == 12) { h = 0; }\n} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
								s : "(am|pm|AM|PM)"
							},
							A : {
								g : 1,
								c : "if (/(am)/i.test(results[{0}])) {\nif (!h || h == 12) { h = 0; }\n} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
								s : "(AM|PM|am|pm)"
							},
							g : function() {
								return Ext.util.Date.formatCodeToRegex("G")
							},
							G : {
								g : 1,
								c : "h = parseInt(results[{0}], 10);\n",
								s : "(\\d{1,2})"
							},
							h : function() {
								return Ext.util.Date.formatCodeToRegex("H")
							},
							H : {
								g : 1,
								c : "h = parseInt(results[{0}], 10);\n",
								s : "(\\d{2})"
							},
							i : {
								g : 1,
								c : "i = parseInt(results[{0}], 10);\n",
								s : "(\\d{2})"
							},
							s : {
								g : 1,
								c : "s = parseInt(results[{0}], 10);\n",
								s : "(\\d{2})"
							},
							u : {
								g : 1,
								c : "ms = results[{0}]; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n",
								s : "(\\d+)"
							},
							O : {
								g : 1,
								c : [
										"o = results[{0}];",
										"var sn = o.substring(0,1),",
										"hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60),",
										"mn = o.substring(3,5) % 60;",
										"o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Ext.String.leftPad(hr, 2, '0') + Ext.String.leftPad(mn, 2, '0')) : null;\n" ]
										.join("\n"),
								s : "([+-]\\d{4})"
							},
							P : {
								g : 1,
								c : [
										"o = results[{0}];",
										"var sn = o.substring(0,1),",
										"hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60),",
										"mn = o.substring(4,6) % 60;",
										"o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Ext.String.leftPad(hr, 2, '0') + Ext.String.leftPad(mn, 2, '0')) : null;\n" ]
										.join("\n"),
								s : "([+-]\\d{2}:\\d{2})"
							},
							T : {
								g : 0,
								c : null,
								s : "[A-Z]{1,4}"
							},
							Z : {
								g : 1,
								c : "zz = results[{0}] * 1;\nzz = (-43200 <= zz && zz <= 50400)? zz : null;\n",
								s : "([+-]?\\d{1,5})"
							},
							c : function() {
								var e = [], b = [
										Ext.util.Date.formatCodeToRegex("Y", 1),
										Ext.util.Date.formatCodeToRegex("m", 2),
										Ext.util.Date.formatCodeToRegex("d", 3),
										Ext.util.Date.formatCodeToRegex("h", 4),
										Ext.util.Date.formatCodeToRegex("i", 5),
										Ext.util.Date.formatCodeToRegex("s", 6),
										{
											c : "ms = results[7] || '0'; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n"
										},
										{
											c : [
													"if(results[8]) {",
													"if(results[8] == 'Z'){",
													"zz = 0;",
													"}else if (results[8].indexOf(':') > -1){",
													Ext.util.Date
															.formatCodeToRegex(
																	"P", 8).c,
													"}else{",
													Ext.util.Date
															.formatCodeToRegex(
																	"O", 8).c,
													"}", "}" ].join("\n")
										} ];
								for (var f = 0, d = b.length; f < d; ++f) {
									e.push(b[f].c)
								}
								return {
									g : 1,
									c : e.join(""),
									s : [ b[0].s, "(?:", "-", b[1].s, "(?:",
											"-", b[2].s, "(?:", "(?:T| )?",
											b[3].s, ":", b[4].s, "(?::",
											b[5].s, ")?",
											"(?:(?:\\.|,)(\\d+))?",
											"(Z|(?:[-+]\\d{2}(?::)?\\d{2}))?",
											")?", ")?", ")?" ].join("")
								}
							},
							U : {
								g : 1,
								c : "u = parseInt(results[{0}], 10);\n",
								s : "(-?\\d+)"
							}
						},
						dateFormat : function(b, d) {
							if (Ext.util.Date.formatFunctions[d] == null) {
								Ext.util.Date.createFormat(d)
							}
							return Ext.util.Date.formatFunctions[d].call(b)
						},
						format : function(b, d) {
							if (Ext.util.Date.formatFunctions[d] == null) {
								Ext.util.Date.createFormat(d)
							}
							return Ext.util.Date.formatFunctions[d].call(b)
						},
						getTimezone : function(b) {
							return b
									.toString()
									.replace(
											/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/,
											"$1$2").replace(/[^A-Z]/g, "")
						},
						getGMTOffset : function(b, d) {
							return (Ext.util.Date.getTimezoneOffset(b) > 0 ? "-"
									: "+")
									+ Ext.String
											.leftPad(
													Math
															.floor(Math
																	.abs(b
																			.getTimezoneOffset()) / 60),
													2, "0")
									+ (d ? ":" : "")
									+ Ext.String.leftPad(Math.abs(b
											.getTimezoneOffset() % 60), 2, "0")
						},
						getDayOfYear : function(f) {
							var e = 0, h = Ext.Date.clone(f), b = f.getMonth(), g;
							for (g = 0, h.setDate(1), h.setMonth(0); g < b; h
									.setMonth(++g)) {
								e += Ext.util.Date.getDaysInMonth(h)
							}
							return e + f.getDate() - 1
						},
						getWeekOfYear : (function() {
							var b = 86400000, d = 7 * b;
							return function(f) {
								var g = Ext.Date.UTC(f.getFullYear(), f
										.getMonth(), f.getDate() + 3)
										/ b, e = Math.floor(g / 7), h = new Date(
										e * d).getUTCFullYear();
								return e
										- Math.floor(Ext.Date.UTC(h, 0, 7) / d)
										+ 1
							}
						})(),
						isLeapYear : function(b) {
							var d = b.getFullYear();
							return !!((d & 3) == 0 && (d % 100 || (d % 400 == 0 && d)))
						},
						getFirstDayOfMonth : function(d) {
							var b = (d.getDay() - (d.getDate() - 1)) % 7;
							return (b < 0) ? (b + 7) : b
						},
						getLastDayOfMonth : function(b) {
							return Ext.util.Date.getLastDateOfMonth(b).getDay()
						},
						getFirstDateOfMonth : function(b) {
							return new Date(b.getFullYear(), b.getMonth(), 1)
						},
						getLastDateOfMonth : function(b) {
							return new Date(b.getFullYear(), b.getMonth(),
									Ext.util.Date.getDaysInMonth(b))
						},
						getDaysInMonth : (function() {
							var b = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31,
									30, 31 ];
							return function(e) {
								var d = e.getMonth();
								return d == 1 && Ext.util.Date.isLeapYear(e) ? 29
										: b[d]
							}
						})(),
						getSuffix : function(b) {
							switch (b.getDate()) {
							case 1:
							case 21:
							case 31:
								return "st";
							case 2:
							case 22:
								return "nd";
							case 3:
							case 23:
								return "rd";
							default:
								return "th"
							}
						},
						clone : function(b) {
							return new Date(b.getTime())
						},
						isDST : function(b) {
							return new Date(b.getFullYear(), 0, 1)
									.getTimezoneOffset() != b
									.getTimezoneOffset()
						},
						clearTime : function(b, h) {
							if (h) {
								return Ext.Date.clearTime(Ext.Date.clone(b))
							}
							var f = b.getDate();
							b.setHours(0);
							b.setMinutes(0);
							b.setSeconds(0);
							b.setMilliseconds(0);
							if (b.getDate() != f) {
								for (var e = 1, g = Ext.util.Date.add(b,
										Ext.Date.HOUR, e); g.getDate() != f; e++, g = Ext.util.Date
										.add(b, Ext.Date.HOUR, e)) {
								}
								b.setDate(f);
								b.setHours(g.getHours())
							}
							return b
						},
						add : function(g, f, h) {
							var i = Ext.Date.clone(g), b = Ext.util.Date;
							if (!f || h === 0) {
								return i
							}
							switch (f.toLowerCase()) {
							case Ext.Date.MILLI:
								i.setMilliseconds(i.getMilliseconds() + h);
								break;
							case Ext.Date.SECOND:
								i.setSeconds(i.getSeconds() + h);
								break;
							case Ext.Date.MINUTE:
								i.setMinutes(i.getMinutes() + h);
								break;
							case Ext.Date.HOUR:
								i.setHours(i.getHours() + h);
								break;
							case Ext.Date.DAY:
								i.setDate(i.getDate() + h);
								break;
							case Ext.Date.MONTH:
								var e = g.getDate();
								if (e > 28) {
									e = Math
											.min(
													e,
													Ext.Date
															.getLastDateOfMonth(
																	Ext.Date
																			.add(
																					Ext.Date
																							.getFirstDateOfMonth(g),
																					"mo",
																					h))
															.getDate())
								}
								i.setDate(e);
								i.setMonth(g.getMonth() + h);
								break;
							case Ext.Date.YEAR:
								i.setFullYear(g.getFullYear() + h);
								break
							}
							return i
						},
						between : function(d, f, b) {
							var e = d.getTime();
							return f.getTime() <= e && e <= b.getTime()
						},
						compat : function() {
							var g = window.Date, d = Ext.util.Date, f, b, h = [
									"useStrict", "formatCodeToRegex",
									"parseFunctions", "parseRegexes",
									"formatFunctions", "y2kYear", "MILLI",
									"SECOND", "MINUTE", "HOUR", "DAY", "MONTH",
									"YEAR", "defaults", "dayNames",
									"monthNames", "monthNumbers",
									"getShortMonthName", "getShortDayName",
									"getMonthNumber", "formatCodes", "isValid",
									"parseDate", "getFormatCode",
									"createFormat", "createParser",
									"parseCodes" ], e = [ "dateFormat",
									"format", "getTimezone", "getGMTOffset",
									"getDayOfYear", "getWeekOfYear",
									"isLeapYear", "getFirstDayOfMonth",
									"getLastDayOfMonth", "getDaysInMonth",
									"getSuffix", "clone", "isDST", "clearTime",
									"add", "between" ];
							Ext.Array.forEach(h, function(i) {
								g[i] = d[i]
							});
							Ext.Array.forEach(e, function(i) {
								g.prototype[i] = function() {
									var j = Array.prototype.slice
											.call(arguments);
									j.unshift(this);
									return d[i].apply(d, j)
								}
							})
						}
					}, function() {
						var e, b = Ext.util.Date, d = Ext.Date;
						for (e in b) {
							if (!d.hasOwnProperty(e)) {
								d[e] = b[e]
							}
						}
					})
})();
Ext.define("Ext.data.Types", {
	singleton : true,
	requires : [ "Ext.data.SortTypes", "Ext.util.Date" ]
}, function() {
	var a = Ext.data.SortTypes;
	Ext.apply(Ext.data.Types, {
		stripRe : /[\$,%]/g,
		AUTO : {
			convert : function(b) {
				return b
			},
			sortType : a.none,
			type : "auto"
		},
		STRING : {
			convert : function(b) {
				return (b === undefined || b === null) ? "" : String(b)
			},
			sortType : a.asUCString,
			type : "string"
		},
		INT : {
			convert : function(b) {
				return b !== undefined && b !== null && b !== "" ? parseInt(
						String(b).replace(Ext.data.Types.stripRe, ""), 10)
						: (this.useNull ? null : 0)
			},
			sortType : a.none,
			type : "int"
		},
		FLOAT : {
			convert : function(b) {
				return b !== undefined && b !== null && b !== "" ? parseFloat(
						String(b).replace(Ext.data.Types.stripRe, ""), 10)
						: (this.useNull ? null : 0)
			},
			sortType : a.none,
			type : "float"
		},
		BOOL : {
			convert : function(b) {
				return b === true || b === "true" || b == 1
			},
			sortType : a.none,
			type : "bool"
		},
		DATE : {
			convert : function(d) {
				var e = this.dateFormat;
				if (!d) {
					return null
				}
				if (Ext.isDate(d)) {
					return d
				}
				if (e) {
					if (e == "timestamp") {
						return new Date(d * 1000)
					}
					if (e == "time") {
						return new Date(parseInt(d, 10))
					}
					return Ext.Date.parseDate(d, e)
				}
				var b = Date.parse(d);
				return b ? new Date(b) : null
			},
			sortType : a.asDate,
			type : "date"
		}
	});
	Ext.apply(Ext.data.Types, {
		BOOLEAN : this.BOOL,
		INTEGER : this.INT,
		NUMBER : this.FLOAT
	})
});
Ext.define("Ext.data.Field", {
	requires : [ "Ext.data.Types", "Ext.data.SortTypes" ],
	constructor : function(b) {
		if (Ext.isString(b)) {
			b = {
				name : b
			}
		}
		Ext.apply(this, b);
		var e = Ext.data.Types, a = this.sortType, d;
		if (this.type) {
			if (Ext.isString(this.type)) {
				this.type = e[this.type.toUpperCase()] || e.AUTO
			}
		} else {
			this.type = e.AUTO
		}
		if (Ext.isString(a)) {
			this.sortType = Ext.data.SortTypes[a]
		} else {
			if (Ext.isEmpty(a)) {
				this.sortType = this.type.sortType
			}
		}
		if (!this.convert) {
			this.convert = this.type.convert
		}
	},
	dateFormat : null,
	useNull : false,
	defaultValue : "",
	mapping : null,
	sortType : null,
	sortDir : "ASC",
	allowBlank : true
});
Ext
		.define(
				"Ext.data.Association",
				{
					primaryKey : "id",
					constructor : function(b) {
						Ext.apply(this, b);
						var d = Ext.ModelMgr.types, e = b.ownerModel, g = b.associatedModel, f = d[e], h = d[g], a;
						if (f === undefined) {
							throw new Error(
									"The configured ownerModel was not valid (you tried "
											+ e + ")")
						}
						if (h === undefined) {
							throw new Error(
									"The configured associatedModel was not valid (you tried "
											+ g + ")")
						}
						this.ownerModel = f;
						this.associatedModel = h;
						Ext.applyIf(this, {
							ownerName : e,
							associatedName : g
						})
					}
				});
Ext
		.define(
				"Ext.data.BelongsToAssociation",
				{
					extend : "Ext.data.Association",
					constructor : function(d) {
						Ext.data.BelongsToAssociation.superclass.constructor
								.apply(this, arguments);
						var f = this, a = f.ownerModel.prototype, g = f.associatedName, e = f.getterName
								|| "get" + g, b = f.setterName || "set" + g;
						Ext.applyIf(f, {
							name : g,
							foreignKey : g.toLowerCase() + "_id",
							instanceName : g + "BelongsToInstance",
							associationKey : g.toLowerCase()
						});
						a[e] = f.createGetter();
						a[b] = f.createSetter()
					},
					createSetter : function() {
						var d = this, e = d.ownerModel, f = d.associatedModel, b = d.foreignKey, a = d.primaryKey;
						return function(i, g, h) {
							this.set(b, i);
							if (typeof g == "function") {
								g = {
									callback : g,
									scope : h || this
								}
							}
							if (Ext.isObject(g)) {
								return this.save(g)
							}
						}
					},
					createGetter : function() {
						var e = this, g = e.ownerModel, f = e.associatedName, h = e.associatedModel, d = e.foreignKey, b = e.primaryKey, a = e.instanceName;
						return function(k, l) {
							k = k || {};
							var m = this.get(d), i, j;
							if (this[a] === undefined) {
								i = Ext.ModelMgr.create({}, f);
								i.set(b, m);
								if (typeof k == "function") {
									k = {
										callback : k,
										scope : l || this
									}
								}
								h.load(m, k)
							} else {
								i = this[a];
								if (typeof k == "function") {
									k.call(l || this, i)
								}
								if (k.success) {
									k.success.call(l || this, i)
								}
								if (k.callback) {
									k.callback.call(l || this, i)
								}
								return i
							}
						}
					}
				});
Ext
		.define(
				"Ext.util.Inflector",
				{
					singleton : true,
					plurals : [ [ (/(quiz)$/i), "$1zes" ],
							[ (/^(ox)$/i), "$1en" ],
							[ (/([m|l])ouse$/i), "$1ice" ],
							[ (/(matr|vert|ind)ix|ex$/i), "$1ices" ],
							[ (/(x|ch|ss|sh)$/i), "$1es" ],
							[ (/([^aeiouy]|qu)y$/i), "$1ies" ],
							[ (/(hive)$/i), "$1s" ],
							[ (/(?:([^f])fe|([lr])f)$/i), "$1$2ves" ],
							[ (/sis$/i), "ses" ], [ (/([ti])um$/i), "$1a" ],
							[ (/(buffal|tomat|potat)o$/i), "$1oes" ],
							[ (/(bu)s$/i), "$1ses" ],
							[ (/(alias|status|sex)$/i), "$1es" ],
							[ (/(octop|vir)us$/i), "$1i" ],
							[ (/(ax|test)is$/i), "$1es" ],
							[ (/^person$/), "people" ], [ (/^man$/), "men" ],
							[ (/^(child)$/), "$1ren" ], [ (/s$/i), "s" ],
							[ (/$/), "s" ] ],
					singulars : [
							[ (/(quiz)zes$/i), "$1" ],
							[ (/(matr)ices$/i), "$1ix" ],
							[ (/(vert|ind)ices$/i), "$1ex" ],
							[ (/^(ox)en/i), "$1" ],
							[ (/(alias|status)es$/i), "$1" ],
							[ (/(octop|vir)i$/i), "$1us" ],
							[ (/(cris|ax|test)es$/i), "$1is" ],
							[ (/(shoe)s$/i), "$1" ],
							[ (/(o)es$/i), "$1" ],
							[ (/(bus)es$/i), "$1" ],
							[ (/([m|l])ice$/i), "$1ouse" ],
							[ (/(x|ch|ss|sh)es$/i), "$1" ],
							[ (/(m)ovies$/i), "$1ovie" ],
							[ (/(s)eries$/i), "$1eries" ],
							[ (/([^aeiouy]|qu)ies$/i), "$1y" ],
							[ (/([lr])ves$/i), "$1f" ],
							[ (/(tive)s$/i), "$1" ],
							[ (/(hive)s$/i), "$1" ],
							[ (/([^f])ves$/i), "$1fe" ],
							[ (/(^analy)ses$/i), "$1sis" ],
							[
									(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i),
									"$1$2sis" ], [ (/([ti])a$/i), "$1um" ],
							[ (/(n)ews$/i), "$1ews" ],
							[ (/people$/i), "person" ], [ (/s$/i), "" ] ],
					uncountable : [ "sheep", "fish", "series", "species",
							"money", "rice", "information", "equipment",
							"grass", "mud", "offspring", "deer", "means" ],
					singular : function(b, a) {
						this.singulars.unshift([ b, a ])
					},
					plural : function(b, a) {
						this.plurals.unshift([ b, a ])
					},
					clearSingulars : function() {
						this.singulars = []
					},
					clearPlurals : function() {
						this.plurals = []
					},
					isUncountable : function(a) {
						return Ext.Array.indexOf(this.uncountable, a) != -1
					},
					pluralize : function(g) {
						if (this.isUncountable(g)) {
							return g
						}
						var f = this.plurals, e = f.length, a, d, b;
						for (b = 0; b < e; b++) {
							a = f[b];
							d = a[0];
							if (d == g || (d.test && d.test(g))) {
								return g.replace(d, a[1])
							}
						}
						return g
					},
					singularize : function(g) {
						if (this.isUncountable(g)) {
							return g
						}
						var f = this.singulars, e = f.length, a, d, b;
						for (b = 0; b < e; b++) {
							a = f[b];
							d = a[0];
							if (d == g || (d.test && d.test(g))) {
								return g.replace(d, a[1])
							}
						}
						return g
					},
					classify : function(a) {
						return Ext.String.capitalize(this.singularize(a))
					},
					ordinalize : function(e) {
						var b = parseInt(e, 10), d = b % 10, a = b % 100;
						if (11 <= a && a <= 13) {
							return e + "th"
						} else {
							switch (d) {
							case 1:
								return e + "st";
							case 2:
								return e + "nd";
							case 3:
								return e + "rd";
							default:
								return e + "th"
							}
						}
					}
				}, function() {
					var b = {
						alumnus : "alumni",
						cactus : "cacti",
						focus : "foci",
						nucleus : "nuclei",
						radius : "radii",
						stimulus : "stimuli",
						ellipsis : "ellipses",
						paralysis : "paralyses",
						oasis : "oases",
						appendix : "appendices",
						index : "indexes",
						beau : "beaux",
						bureau : "bureaux",
						tableau : "tableaux",
						woman : "women",
						child : "children",
						man : "men",
						corpus : "corpora",
						criterion : "criteria",
						curriculum : "curricula",
						genus : "genera",
						memorandum : "memoranda",
						phenomenon : "phenomena",
						foot : "feet",
						goose : "geese",
						tooth : "teeth",
						antenna : "antennae",
						formula : "formulae",
						nebula : "nebulae",
						vertebra : "vertebrae",
						vita : "vitae"
					}, a;
					for (a in b) {
						this.plural(a, b[a]);
						this.singular(b[a], a)
					}
				});
Ext
		.define(
				"Ext.data.HasManyAssociation",
				{
					extend : "Ext.data.Association",
					requires : [ "Ext.util.Inflector" ],
					constructor : function(d) {
						Ext.data.HasManyAssociation.superclass.constructor
								.apply(this, arguments);
						this.name = this.name
								|| Ext.util.Inflector
										.pluralize(this.associatedName
												.toLowerCase());
						var a = this.ownerModel.prototype, b = this.name;
						Ext.applyIf(this, {
							storeName : b + "Store",
							foreignKey : this.ownerName.toLowerCase() + "_id"
						});
						a[b] = this.createStore()
					},
					createStore : function() {
						var g = this.associatedModel, b = this.storeName, d = this.foreignKey, a = this.primaryKey, f = this.filterProperty, e = this.storeConfig
								|| {};
						return function() {
							var k = this, i, j, h = {};
							if (k[b] === undefined) {
								if (f) {
									j = {
										property : f,
										value : k.get(f),
										exactMatch : true
									}
								} else {
									j = {
										property : d,
										value : k.get(a),
										exactMatch : true
									}
								}
								h[d] = k.get(a);
								i = Ext.apply({}, e, {
									model : g,
									filters : [ j ],
									remoteFilter : false,
									modelDefaults : h
								});
								k[b] = Ext.create("Ext.data.Store", i)
							}
							return k[b]
						}
					}
				});
Ext
		.define(
				"Ext.data.PolymorphicAssociation",
				{
					extend : "Ext.data.Association",
					constructor : function(d) {
						Ext.data.PolymorphicAssociation.superclass.constructor
								.call(this, d);
						var a = this.ownerModel.prototype, b = this.name;
						Ext.applyIf(this, {
							associationIdField : this.ownerName.toLowerCase()
									+ "_id"
						});
						a[b] = this.createStore()
					},
					createStore : function() {
						var b = this, g = this.ownerName, e = this.name
								+ "Store", h = this.associatedModel, d = this.primaryKey, a = "associated_id", f = "associated_model";
						return function() {
							var l = this, i = {}, j, k;
							if (l[e] === undefined) {
								k = [ {
									property : a,
									value : l.get(d),
									exactMatch : true
								}, {
									property : f,
									value : g,
									exactMatch : true
								} ];
								i[a] = l.get(d);
								i[f] = g;
								j = Ext.apply({}, b.storeConfig || {}, {
									model : h,
									filters : k,
									remoteFilter : false,
									modelDefaults : i
								});
								l[e] = Ext.create("Ext.data.Store", j)
							}
							return l[e]
						}
					}
				});
Ext
		.define(
				"Ext.util.Stateful",
				{
					mixins : {
						observable : "Ext.util.Observable"
					},
					editing : false,
					dirty : false,
					persistanceProperty : "data",
					constructor : function(a) {
						Ext.applyIf(this, {
							data : {}
						});
						this.modified = {};
						this[this.persistanceProperty] = {};
						this.mixins.observable.constructor.call(this)
					},
					get : function(a) {
						return this[this.persistanceProperty][a]
					},
					set : function(h, f) {
						var a = this.fields, e = [], g, d, b;
						if (arguments.length == 1 && Ext.isObject(h)) {
							for (d in h) {
								if (!h.hasOwnProperty(d)) {
									continue
								}
								g = a.get(d);
								if (g && g.convert !== g.type.convert) {
									e.push(d);
									continue
								}
								this.set(d, h[d])
							}
							for (b = 0; b < e.length; b++) {
								g = e[b];
								this.set(g, h[g])
							}
						} else {
							if (a) {
								g = a.get(h);
								if (g && g.convert) {
									f = g.convert(f, this)
								}
							}
							this[this.persistanceProperty][h] = f;
							this.dirty = true;
							if (!this.editing) {
								this.afterEdit()
							}
						}
					},
					getChanges : function() {
						var a = this.modified, b = {}, d;
						for (d in a) {
							if (a.hasOwnProperty(d)) {
								b[d] = this[this.persistanceProperty][d]
							}
						}
						return b
					},
					isModified : function(a) {
						return !!(this.modified && this.modified
								.hasOwnProperty(a))
					},
					setDirty : function() {
						this.dirty = true;
						if (!this.modified) {
							this.modified = {}
						}
						this.fields
								.each(
										function(a) {
											this.modified[a.name] = this[this.persistanceProperty][a.name]
										}, this)
					},
					markDirty : function() {
						throw new Error(
								"Stateful: markDirty has been deprecated. Please use setDirty.")
					},
					reject : function(a) {
						var b = this.modified, d;
						for (d in b) {
							if (!b.hasOwnProperty(d)) {
								continue
							}
							if (typeof b[d] != "function") {
								this[this.persistanceProperty][d] = b[d]
							}
						}
						this.dirty = false;
						this.editing = false;
						delete this.modified;
						if (a !== true) {
							this.afterReject()
						}
					},
					commit : function(a) {
						this.dirty = false;
						this.editing = false;
						delete this.modified;
						if (a !== true) {
							this.afterCommit()
						}
					},
					copy : function(a) {
						return new this.self(Ext.apply({},
								this[this.persistanceProperty]), a
								|| this.internalId)
					}
				});
Ext.define("Ext.data.Errors", {
	extend : "Ext.util.MixedCollection",
	isValid : function() {
		return this.length === 0
	},
	getByField : function(f) {
		var e = [], a, d, b;
		for (b = 0; b < this.length; b++) {
			a = this.items[b];
			if (a.field == f) {
				e.push(a)
			}
		}
		return e
	}
});
Ext.define("Ext.data.validations", {
	singleton : true,
	presenceMessage : "must be present",
	lengthMessage : "is the wrong length",
	formatMessage : "is the wrong format",
	inclusionMessage : "is not included in the list of acceptable values",
	exclusionMessage : "is not an acceptable value",
	presence : function(a, b) {
		if (b === undefined) {
			b = a
		}
		return !!b
	},
	length : function(b, f) {
		if (f === undefined) {
			return false
		}
		var e = f.length, d = b.min, a = b.max;
		if ((d && e < d) || (a && e > a)) {
			return false
		} else {
			return true
		}
	},
	format : function(a, b) {
		return !!(a.matcher && a.matcher.test(b))
	},
	inclusion : function(a, b) {
		return a.list && a.list.indexOf(b) != -1
	},
	exclusion : function(a, b) {
		return a.list && a.list.indexOf(b) == -1
	}
});
Ext
		.define(
				"Ext.data.Model",
				{
					extend : "Ext.util.Stateful",
					requires : [ "Ext.data.Errors", "Ext.data.Operation",
							"Ext.data.Proxy", "Ext.data.validations" ],
					statics : {
						PREFIX : "ext-record",
						AUTO_ID : 1,
						EDIT : "edit",
						REJECT : "reject",
						COMMIT : "commit",
						id : function(a) {
							a.phantom = true;
							return [ Ext.data.Model.PREFIX, "-",
									Ext.data.Model.AUTO_ID++ ].join("")
						},
						setProxy : function(a) {
							if (typeof a == "string") {
								a = {
									type : a
								}
							}
							a = Ext.createByAlias("proxy." + a.type, a);
							a.setModel(this);
							this.proxy = a;
							return a
						},
						load : function(a, b) {
							b = Ext.applyIf(b || {}, {
								action : "read",
								id : a
							});
							var d = Ext.create("Ext.data.Operation", b), g = b.callback, i = b.success, f = b.failure, j = b.scope, e, h;
							h = function(k) {
								e = k.getRecords()[0];
								if (k.wasSuccessful()) {
									if (typeof i == "function") {
										i.call(j, e, k)
									}
								} else {
									if (typeof f == "function") {
										f.call(j, e, k)
									}
								}
								if (typeof g == "function") {
									g.call(j, e, k)
								}
							};
							this.proxy.read(d, h, this)
						}
					},
					evented : false,
					isModel : true,
					phantom : false,
					idProperty : "id",
					constructor : function(f, h) {
						f = f || {};
						this.internalId = (h || h === 0) ? h : Ext.data.Model
								.id(this);
						Ext.data.Model.superclass.constructor.apply(this);
						var a = this.fields.items, e = a.length, g, b, d;
						for (d = 0; d < e; d++) {
							g = a[d];
							b = g.name;
							if (f[b] === undefined) {
								f[b] = g.defaultValue
							}
						}
						this.set(f);
						this.dirty = false;
						if (this.getId()) {
							this.phantom = false
						}
						if (typeof this.init == "function") {
							this.init()
						}
					},
					validate : function() {
						var k = Ext.create("Ext.data.Errors"), d = this.validations, f = Ext.data.validations, b, e, j, a, h, g;
						if (d) {
							b = d.length;
							for (g = 0; g < b; g++) {
								e = d[g];
								j = e.field || e.name;
								h = e.type;
								a = f[h](e, this.get(j));
								if (!a) {
									k.add({
										field : j,
										message : e.message || f[h + "Message"]
									})
								}
							}
						}
						return k
					},
					getProxy : function() {
						return this.constructor.proxy
					},
					save : function(k) {
						var g = this, a = g.phantom ? "create" : "update";
						k = k || {};
						Ext.apply(k, {
							records : [ g ],
							action : a
						});
						var b = Ext.create("Ext.data.Operation", k), i = k.success, e = k.failure, f = k.callback, j = k.scope, d;
						var h = function(l) {
							d = l.getRecords()[0];
							if (l.wasSuccessful()) {
								g.set(d.data);
								d.dirty = false;
								if (typeof i == "function") {
									i.call(j, d, l)
								}
							} else {
								if (typeof e == "function") {
									e.call(j, d, l)
								}
							}
							if (typeof f == "function") {
								f.call(j, d, l)
							}
						};
						g.getProxy()[a](b, h, g);
						return g
					},
					getId : function() {
						return this.get(this.idProperty)
					},
					setId : function(a) {
						this.set(this.idProperty, a)
					},
					join : function(a) {
						this.store = a
					},
					unjoin : function(a) {
						delete this.store
					},
					afterEdit : function() {
						this.callStore("afterEdit")
					},
					afterReject : function() {
						this.callStore("afterReject")
					},
					afterCommit : function() {
						this.callStore("afterCommit")
					},
					callStore : function(b) {
						var a = this.store;
						if (a !== undefined && typeof a[b] == "function") {
							a[b](this)
						}
					}
				}, function() {
					return
				});
Ext.ns("Ext.data.Record");
Ext
		.define(
				"Ext.ModelMgr",
				{
					extend : "Ext.AbstractManager",
					requires : [ "Ext.PluginMgr", "Ext.util.MixedCollection",
							"Ext.data.Field", "Ext.data.BelongsToAssociation",
							"Ext.data.HasManyAssociation",
							"Ext.data.PolymorphicAssociation", "Ext.data.Model" ],
					singleton : true,
					typeName : "mtype",
					defaultProxyType : "ajax",
					associationStack : [],
					registerType : function(t, s) {
						var f = Ext.PluginMgr, m = f.findByType("model", true), l = s.fields
								|| [], q = s.associations || [], p = s.belongsTo, j = s.hasMany, r = s.extend, k = s.plugins
								|| [], b, d, e, o, g, a, h, n;
						if (p) {
							if (!Ext.isArray(p)) {
								p = [ p ]
							}
							for (o = 0; o < p.length; o++) {
								b = p[o];
								if (!Ext.isObject(b)) {
									b = {
										model : b
									}
								}
								Ext.apply(b, {
									type : "belongsTo"
								});
								q.push(b)
							}
							delete s.belongsTo
						}
						if (j) {
							if (!Ext.isArray(j)) {
								j = [ j ]
							}
							for (o = 0; o < j.length; o++) {
								b = j[o];
								if (!Ext.isObject(b)) {
									b = {
										model : b
									}
								}
								Ext.apply(b, {
									type : "hasMany"
								});
								q.push(b)
							}
							delete s.hasMany
						}
						if (r) {
							g = this.types[r];
							a = g.prototype;
							h = a.validations;
							n = g.proxy;
							l = a.fields.items.concat(l);
							q = a.associations.items.concat(q);
							s.validations = h ? h.concat(s.validations)
									: s.validations
						} else {
							g = Ext.data.Model;
							n = s.proxy
						}
						s.extend = r ? r : "Ext.data.Model";
						d = Ext.define(t, s);
						for (o = 0, e = k.length; o < e; o++) {
							m.push(f.create(k[o]))
						}
						this.types[t] = d;
						Ext.override(d, {
							plugins : m,
							fields : this.createFields(l),
							associations : this.createAssociations(q, t)
						});
						d.modelName = t;
						Ext.data.Model.setProxy.call(d, n
								|| this.defaultProxyType);
						d.getProxy = d.prototype.getProxy;
						d.load = function() {
							Ext.data.Model.load.apply(this, arguments)
						};
						for (o = 0, e = m.length; o < e; o++) {
							m[o].bootstrap(d, s)
						}
						d.defined = true;
						this.onModelDefined(d);
						return d
					},
					onModelDefined : function(d) {
						var a = this.associationStack, g = a.length, f = [], b, e;
						for (e = 0; e < g; e++) {
							b = a[e];
							if (b.associatedModel == d.modelName) {
								f.push(b)
							}
						}
						g = f.length;
						for (e = 0; e < g; e++) {
							this
									.addAssociation(
											f[e],
											this.types[f[e].ownerModel].prototype.associations);
							Ext.Array.remove(a, f[e])
						}
					},
					createAssociations : function(f, b) {
						var g = f.length, e, d, a;
						d = Ext.create("Ext.util.MixedCollection", false,
								function(h) {
									return h.name
								});
						for (e = 0; e < g; e++) {
							a = f[e];
							Ext.apply(a, {
								ownerModel : b,
								associatedModel : a.model
							});
							if (this.types[a.model] == undefined) {
								this.associationStack.push(a)
							} else {
								this.addAssociation(a, d)
							}
						}
						return d
					},
					addAssociation : function(a, b) {
						var d = a.type;
						if (d == "belongsTo") {
							b
									.add(Ext.create(
											"Ext.data.BelongsToAssociation", a))
						}
						if (d == "hasMany") {
							b.add(Ext.create("Ext.data.HasManyAssociation", a))
						}
						if (d == "polymorphic") {
							b.add(Ext.create("Ext.data.PolymorphicAssociation",
									a))
						}
					},
					createFields : function(a) {
						var e = a.length, d, b;
						b = Ext.create("Ext.util.MixedCollection", false,
								function(f) {
									return f.name
								});
						for (d = 0; d < e; d++) {
							b.add(Ext.create("Ext.data.Field", a[d]))
						}
						return b
					},
					getModel : function(b) {
						var a = b;
						if (typeof a == "string") {
							a = this.types[a]
						}
						return a
					},
					create : function(d, b, e) {
						var a = typeof b == "function" ? b : this.types[b
								|| d.name];
						return new a(d, e)
					}
				}, function() {
					Ext.regModel = function() {
						return this.ModelMgr.registerType.apply(this.ModelMgr,
								arguments)
					}
				});
Ext
		.define(
				"Ext.data.Store",
				{
					extend : "Ext.data.AbstractStore",
					requires : [ "Ext.ModelMgr" ],
					remoteSort : false,
					remoteFilter : false,
					groupField : undefined,
					groupDir : "ASC",
					pageSize : 25,
					currentPage : 1,
					clearOnPageLoad : true,
					implicitModel : false,
					loading : false,
					sortOnFilter : true,
					isStore : true,
					constructor : function(a) {
						a = a || {};
						this.data = new Ext.util.MixedCollection(false,
								function(e) {
									return e.internalId
								});
						if (a.data) {
							this.inlineData = a.data;
							delete a.data
						}
						Ext.data.Store.superclass.constructor.call(this, a);
						var b = this.proxy, d = this.inlineData;
						if (d) {
							if (b instanceof Ext.data.MemoryProxy) {
								b.data = d;
								this.read()
							} else {
								this.add.apply(this, d)
							}
							this.sort();
							delete this.inlineData
						} else {
							if (this.autoLoad) {
								Ext
										.defer(
												this.load,
												10,
												this,
												[ typeof this.autoLoad == "object" ? this.autoLoad
														: undefined ])
							}
						}
					},
					getGroups : function() {
						var e = this.data.items, g = e.length, a = [], d = {}, b, h, j, f;
						for (f = 0; f < g; f++) {
							b = e[f];
							h = this.getGroupString(b);
							j = d[h];
							if (j === undefined) {
								j = {
									name : h,
									children : []
								};
								a.push(j);
								d[h] = j
							}
							j.children.push(b)
						}
						return a
					},
					getGroupsForGrouper : function(g, b) {
						var e = g.length, f = [], a, d, j, k, h;
						for (h = 0; h < e; h++) {
							j = g[h];
							d = b.getGroupString(j);
							if (d != a) {
								k = {
									name : d,
									grouper : b,
									records : []
								};
								f.push(k)
							}
							k.records.push(j);
							a = d
						}
						return f
					},
					getGroupsForGrouperIndex : function(d, h) {
						var g = this.groupers, b = g.getAt(h), a = this
								.getGroupsForGrouper(d, b), f = a.length, e;
						if (h + 1 < g.length) {
							for (e = 0; e < f; e++) {
								a[e].children = this.getGroupsForGrouperIndex(
										a[e].records, h + 1)
							}
						}
						for (e = 0; e < f; e++) {
							a[e].depth = h
						}
						return a
					},
					getGroupData : function(a) {
						if (a !== false) {
							this.sort()
						}
						return this
								.getGroupsForGrouperIndex(this.data.items, 0)
					},
					getGroupString : function(a) {
						return a.get(this.groupField)
					},
					first : function() {
						return this.data.first()
					},
					last : function() {
						return this.data.last()
					},
					insert : function(e, d) {
						var f, b, a;
						d = [].concat(d);
						for (f = 0, a = d.length; f < a; f++) {
							b = this.createModel(d[f]);
							b.set(this.modelDefaults);
							this.data.insert(e + f, b);
							b.join(this)
						}
						if (this.snapshot) {
							this.snapshot.addAll(d)
						}
						this.fireEvent("add", this, d, e);
						this.fireEvent("datachanged", this)
					},
					add : function(b) {
						if (!Ext.isArray(b)) {
							b = Array.prototype.slice.apply(arguments)
						}
						var e = b.length, a, d;
						for (d = 0; d < e; d++) {
							a = this.createModel(b[d]);
							if (a.phantom === false) {
								a.needsAdd = true
							}
							b[d] = a
						}
						this.insert(this.data.length, b);
						return b
					},
					createModel : function(a) {
						if (!(a instanceof Ext.data.Model)) {
							a = Ext.ModelMgr.create(a, this.model)
						}
						return a
					},
					each : function(b, a) {
						this.data.each(b, a)
					},
					remove : function(b) {
						if (!Ext.isArray(b)) {
							b = [ b ]
						}
						var f = b.length, e, d, a;
						for (e = 0; e < f; e++) {
							a = b[e];
							d = this.data.indexOf(a);
							if (d > -1) {
								this.removed.push(a);
								if (this.snapshot) {
									this.snapshot.remove(a)
								}
								a.unjoin(this);
								this.data.remove(a);
								this.fireEvent("remove", this, a, d)
							}
						}
						this.fireEvent("datachanged", this)
					},
					removeAt : function(b) {
						var a = this.getAt(b);
						if (a) {
							this.remove(a)
						}
					},
					load : function(a) {
						a = a || {};
						if (Ext.isFunction(a)) {
							a = {
								callback : a
							}
						}
						Ext.applyIf(a, {
							group : {
								field : this.groupField,
								direction : this.groupDir
							},
							start : (this.currentPage - 1) * this.pageSize,
							limit : this.pageSize,
							addRecords : false
						});
						return Ext.data.Store.superclass.load.call(this, a)
					},
					isLoading : function() {
						return this.loading
					},
					onProxyLoad : function(b) {
						var d = b.getResultSet(), a = b.getRecords(), e = b.callback;
						if (d) {
							this.totalCount = d.total
						}
						this.loadRecords(a, b.addRecords);
						this.loading = false;
						this.fireEvent("load", this, a, b.wasSuccessful());
						this.fireEvent("read", this, a, b.wasSuccessful());
						if (typeof e == "function") {
							e.call(b.scope || this, a, b, b.wasSuccessful())
						}
					},
					onProxyWrite : function(d) {
						var h = this.data, g = d.action, b = d.getRecords(), f = b.length, j = d.callback, a, e;
						if (d.wasSuccessful()) {
							if (g == "create" || g == "update") {
								for (e = 0; e < f; e++) {
									a = b[e];
									a.phantom = false;
									a.join(this);
									h.replace(a)
								}
							} else {
								if (g == "destroy") {
									for (e = 0; e < f; e++) {
										a = b[e];
										a.unjoin(this);
										h.remove(a)
									}
									this.removed = []
								}
							}
							this.fireEvent("datachanged")
						}
						if (typeof j == "function") {
							j.call(d.scope || this, b, d, d.wasSuccessful())
						}
					},
					getNewRecords : function() {
						return this.data.filterBy(this.filterNew).items
					},
					getUpdatedRecords : function() {
						return this.data.filterBy(this.filterDirty).items
					},
					sort : function(f, e) {
						if (Ext.isString(f)) {
							var d = f, b = this.sortToggle, a = Ext.String.toggle;
							if (e === undefined) {
								b[d] = a(b[d] || "", "ASC", "DESC");
								e = b[d]
							}
							f = {
								property : d,
								direction : e
							}
						}
						if (arguments.length !== 0) {
							this.sorters.clear()
						}
						this.sorters.addAll(this.decodeSorters(f));
						if (this.remoteSort) {
							this.load()
						} else {
							this.data.sort(this.sorters.items);
							this.fireEvent("datachanged", this)
						}
					},
					filter : function(e, f) {
						if (Ext.isString(e)) {
							e = {
								property : e,
								value : f
							}
						}
						var a = this.decodeFilters(e), d = a.length, b;
						for (b = 0; b < d; b++) {
							this.filters.replace(a[b])
						}
						if (this.remoteFilter) {
							this.load()
						} else {
							this.snapshot = this.snapshot || this.data.clone();
							this.data = this.data.filter(this.filters.items);
							if (this.sortOnFilter && !this.remoteSort) {
								this.sort()
							} else {
								this.fireEvent("datachanged", this)
							}
						}
					},
					clearFilter : function(a) {
						this.filters.clear();
						if (this.isFiltered()) {
							this.data = this.snapshot.clone();
							delete this.snapshot;
							if (a !== true) {
								this.fireEvent("datachanged", this)
							}
						}
					},
					isFiltered : function() {
						return !!this.snapshot && this.snapshot != this.data
					},
					filterBy : function(b, a) {
						this.snapshot = this.snapshot || this.data.clone();
						this.data = this.queryBy(b, a || this);
						this.fireEvent("datachanged", this)
					},
					queryBy : function(b, a) {
						var d = this.snapshot || this.data;
						return d.filterBy(b, a || this)
					},
					loadData : function(g, a) {
						var d = this.model, f = g.length, e, b;
						for (e = 0; e < f; e++) {
							b = g[e];
							if (!(b instanceof Ext.data.Model)) {
								g[e] = Ext.ModelMgr.create(b, d)
							}
						}
						this.loadRecords(g, a)
					},
					loadRecords : function(a, e) {
						if (!e) {
							this.data.clear()
						}
						this.data.addAll(a);
						for (var b = 0, d = a.length; b < d; b++) {
							a[b].needsAdd = false;
							a[b].join(this)
						}
						this.suspendEvents();
						if (this.filterOnLoad && !this.remoteFilter) {
							this.filter()
						}
						if (this.sortOnLoad && !this.remoteSort) {
							this.sort()
						}
						this.resumeEvents();
						this.fireEvent("datachanged", this, a)
					},
					loadPage : function(a) {
						this.currentPage = a;
						this.read({
							page : a,
							start : (a - 1) * this.pageSize,
							limit : this.pageSize,
							addRecords : !this.clearOnPageLoad
						})
					},
					nextPage : function() {
						this.loadPage(this.currentPage + 1)
					},
					previousPage : function() {
						this.loadPage(this.currentPage - 1)
					},
					clearData : function() {
						this.data.each(function(a) {
							a.unjoin()
						});
						this.data.clear()
					},
					find : function(f, e, h, g, a, d) {
						var b = this.createFilterFn(f, e, g, a, d);
						return b ? this.data.findIndexBy(b, null, h) : -1
					},
					findRecord : function() {
						var a = this.find.apply(this, arguments);
						return a != -1 ? this.getAt(a) : null
					},
					createFilterFn : function(e, d, f, a, b) {
						if (Ext.isEmpty(d)) {
							return false
						}
						d = this.data.createValueMatcher(d, f, a, b);
						return function(g) {
							return d.test(g.data[e])
						}
					},
					findExact : function(b, a, d) {
						return this.data.findIndexBy(function(e) {
							return e.get(b) === a
						}, this, d)
					},
					findBy : function(b, a, d) {
						return this.data.findIndexBy(b, a, d)
					},
					collect : function(b, a, d) {
						var e = (d === true && this.snapshot) ? this.snapshot
								: this.data;
						return e.collect(b, "data", a)
					},
					sum : function(b, d, a) {
						return this.data.sum(b, "data", d, a)
					},
					getCount : function() {
						return this.data.length || 0
					},
					getTotalCount : function() {
						return this.totalCount
					},
					getAt : function(a) {
						return this.data.getAt(a)
					},
					getRange : function(b, a) {
						return this.data.getRange(b, a)
					},
					getById : function(a) {
						return (this.snapshot || this.data).findBy(function(b) {
							return b.getId() === a
						})
					},
					indexOf : function(a) {
						return this.data.indexOf(a)
					},
					indexOfId : function(a) {
						return this.data.indexOfKey(a)
					},
					removeAll : function(b) {
						var a = [];
						this.each(function(d) {
							a.push(d)
						});
						this.clearData();
						if (this.snapshot) {
							this.snapshot.clear()
						}
						if (b !== true) {
							this.fireEvent("clear", this, a)
						}
					}
				});
Ext.define("Ext.data.JsonStore", {
	extend : "Ext.data.Store",
	alias : "store.json",
	constructor : function(a) {
		a = a || {};
		Ext.applyIf(a, {
			proxy : {
				type : "ajax",
				reader : "json",
				writer : "json"
			}
		});
		Ext.data.JsonStore.superclass.constructor.call(this, a)
	}
});
Ext.define("Ext.ComponentMgr", {
	extend : "Ext.AbstractManager",
	singleton : true,
	typeName : "xtype",
	create : function(b, e) {
		if (b instanceof Ext.AbstractComponent) {
			return b
		} else {
			if (Ext.isString(b)) {
				return Ext.createByAlias("widget." + b)
			} else {
				var d = b.xtype || e, a = b;
				return Ext.createByAlias("widget." + d, a)
			}
		}
	},
	registerType : function(b, a) {
		this.types[b] = a;
		a[this.typeName] = b;
		a.prototype[this.typeName] = b
	}
});
Ext
		.define(
				"Ext.Template",
				{
					requires : [ "Ext.core.DomHelper" ],
					statics : {
						from : function(b, a) {
							b = Ext.getDom(b);
							return new this(b.value || b.innerHTML, a || "")
						}
					},
					constructor : function(e) {
						var g = this, b = arguments, a = [], h, d, f;
						g.initialConfig = {};
						if (Ext.isArray(e)) {
							e = e.join("")
						} else {
							if (b.length > 1) {
								for (d = 0, f = b.length; d < f; d++) {
									h = b[d];
									if (typeof h == "object") {
										Ext.apply(g.initialConfig, h);
										Ext.apply(g, h)
									} else {
										a.push(h)
									}
								}
								e = a.join("")
							}
						}
						g.html = e;
						if (g.compiled) {
							g.compile()
						}
					},
					isTemplate : true,
					disableFormats : false,
					re : /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,
					applyTemplate : function(a) {
						var g = this, d = g.disableFormats !== true, f = Ext.String, b = g;
						if (g.compiled) {
							return g.compiled(a)
						}
						function e(h, j, k, i) {
							if (k && d) {
								if (i) {
									i = [ a[j] ].concat(new Function("return ["
											+ i + "];")())
								} else {
									i = [ a[j] ]
								}
								if (k.substr(0, 5) == "this.") {
									return b[k.substr(5)].apply(b, i)
								} else {
									return f[k].apply(f, i)
								}
							} else {
								return a[j] !== undefined ? a[j] : ""
							}
						}
						return g.html.replace(g.re, e)
					},
					set : function(a, d) {
						var b = this;
						b.html = a;
						b.compiled = null;
						return d ? b.compile() : b
					},
					compileARe : /\\/g,
					compileBRe : /(\r\n|\n)/g,
					compileCRe : /'/g,
					compile : function() {
						var me = this, fm = Ext.String, useFormat = me.disableFormats !== true, body, bodyReturn;
						function fn(m, name, format, args) {
							if (format && useFormat) {
								args = args ? "," + args : "";
								if (format.substr(0, 5) != "this.") {
									format = "fm." + format + "("
								} else {
									format = "this." + format.substr(5) + "("
								}
							} else {
								args = "";
								format = "(values['" + name
										+ "'] == undefined ? '' : "
							}
							return "'," + format + "values['" + name + "']"
									+ args + ") ,'"
						}
						bodyReturn = me.html.replace(me.compileARe, "\\\\")
								.replace(me.compileBRe, "\\n").replace(
										me.compileCRe, "\\'")
								.replace(me.re, fn);
						body = "this.compiled = function(values){ return ['"
								+ bodyReturn + "'].join('');};";
						eval(body);
						return me
					},
					insertFirst : function(b, a, d) {
						return this.doInsert("afterBegin", b, a, d)
					},
					insertBefore : function(b, a, d) {
						return this.doInsert("beforeBegin", b, a, d)
					},
					insertAfter : function(b, a, d) {
						return this.doInsert("afterEnd", b, a, d)
					},
					append : function(b, a, d) {
						return this.doInsert("beforeEnd", b, a, d)
					},
					doInsert : function(d, f, b, a) {
						f = Ext.getDom(f);
						var e = Ext.core.DomHelper.insertHtml(d, f, this
								.applyTemplate(b));
						return a ? Ext.get(e, true) : e
					},
					overwrite : function(b, a, d) {
						b = Ext.getDom(b);
						b.innerHTML = this.applyTemplate(a);
						return d ? Ext.get(b.firstChild, true) : b.firstChild
					}
				}, function() {
					Ext.apply(Ext.util.Format, {
						ellipsis : Ext.String.ellipsis,
						htmlEncode : Ext.String.htmlEncode
					});
					this.implement({
						apply : this.prototype.applyTemplate
					})
				});
Ext
		.define(
				"Ext.XTemplate",
				{
					extend : "Ext.Template",
					statics : {
						from : function(b, a) {
							b = Ext.getDom(b);
							return new this(b.value || b.innerHTML, a || {})
						}
					},
					argsRe : /<tpl\b[^>]*>((?:(?=([^<]+))\2|<(?!tpl\b[^>]*>))*?)<\/tpl>/,
					nameRe : /^<tpl\b[^>]*?for="(.*?)"/,
					ifRe : /^<tpl\b[^>]*?if="(.*?)"/,
					execRe : /^<tpl\b[^>]*?exec="(.*?)"/,
					constructor : function() {
						Ext.XTemplate.superclass.constructor.apply(this,
								arguments);
						var A = this, j = A.html, v = A.argsRe, d = A.nameRe, t = A.ifRe, z = A.execRe, p = 0, k = [], o = "values", w = "parent", l = "xindex", n = "xcount", e = "return ", b = "with(values){ ", q, g, u, a, f, h, r, B, s;
						j = [ "<tpl>", j, "</tpl>" ].join("");
						while ((q = j.match(v))) {
							f = null;
							h = null;
							r = null;
							g = q[0].match(d);
							u = q[0].match(t);
							a = q[0].match(z);
							f = u ? u[1] : null;
							if (f) {
								h = new Function(o, w, l, n, b + "try{" + e
										+ Ext.String.htmlDecode(f)
										+ ";}catch(e){return;}}")
							}
							f = a ? a[1] : null;
							if (f) {
								r = new Function(o, w, l, n, b
										+ Ext.String.htmlDecode(f) + ";}")
							}
							B = g ? g[1] : null;
							if (B) {
								if (B === ".") {
									B = o
								} else {
									if (B === "..") {
										B = w
									}
								}
								B = new Function(o, w, "try{" + b + e + B
										+ ";}}catch(e){return;}")
							}
							k.push({
								id : p,
								target : B,
								exec : r,
								test : h,
								body : q[1] || ""
							});
							j = j.replace(q[0], "{xtpl" + p + "}");
							p = p + 1
						}
						for (s = k.length - 1; s >= 0; --s) {
							A.compileTpl(k[s])
						}
						A.master = k[k.length - 1];
						A.tpls = k
					},
					applySubTemplate : function(h, a, d, f, g) {
						var e = this, b = e.tpls[h];
						return b.compiled.call(e, a, d, f, g)
					},
					codeRe : /\{\[((?:\\\]|.|\n)*?)\]\}/g,
					re : /\{([\w-\.\#]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?(\s?[\+\-\*\/]\s?[\d\.\+\-\*\/\(\)]+)?\}/g,
					compileTpl : function(tpl) {
						var fm = Ext.String, me = this, useFormat = me.disableFormats !== true, body, bodyReturn, evaluatedFn;
						function fn(m, name, format, args, math) {
							var v;
							if (name.substr(0, 4) == "xtpl") {
								return "',this.applySubTemplate("
										+ name.substr(4)
										+ ", values, parent, xindex, xcount),'"
							}
							if (name == ".") {
								v = 'typeof values == "string" ? values : ""'
							} else {
								if (name == "#") {
									v = "xindex"
								} else {
									if (name.substr(0, 7) == "parent.") {
										v = name
									} else {
										if (name.indexOf(".") != -1) {
											v = "values." + name
										} else {
											v = "values['" + name + "']"
										}
									}
								}
							}
							if (math) {
								v = "(" + v + math + ")"
							}
							if (format && useFormat) {
								args = args ? "," + args : "";
								if (format.substr(0, 5) != "this.") {
									format = "fm." + format + "("
								} else {
									format = "this." + format.substr(5) + "("
								}
							} else {
								args = "";
								format = "(" + v + " === undefined ? '' : "
							}
							return "'," + format + v + args + "),'"
						}
						function codeFn(m, code) {
							return "',(" + code.replace(me.compileARe, "'")
									+ "),'"
						}
						bodyReturn = tpl.body.replace(me.compileBRe, "\\n")
								.replace(me.compileCRe, "\\'").replace(me.re,
										fn).replace(me.codeRe, codeFn);
						body = "evaluatedFn = function(values, parent, xindex, xcount){return ['"
								+ bodyReturn + "'].join('');};";
						eval(body);
						tpl.compiled = function(values, parent, xindex, xcount) {
							var vs, length, buffer, i;
							if (tpl.test
									&& !tpl.test.call(me, values, parent,
											xindex, xcount)) {
								return ""
							}
							vs = tpl.target ? tpl.target.call(me, values,
									parent) : values;
							if (!vs) {
								return ""
							}
							parent = tpl.target ? values : parent;
							if (tpl.target && Ext.isArray(vs)) {
								buffer = [];
								length = vs.length;
								if (tpl.exec) {
									for (i = 0; i < length; i++) {
										buffer[buffer.length] = evaluatedFn
												.call(me, vs[i], parent, i + 1,
														length);
										tpl.exec.call(me, vs[i], parent, i + 1,
												length)
									}
								} else {
									for (i = 0; i < length; i++) {
										buffer[buffer.length] = evaluatedFn
												.call(me, vs[i], parent, i + 1,
														length)
									}
								}
								return buffer.join("")
							}
							if (tpl.exec) {
								tpl.exec.call(me, vs, parent, xindex, xcount)
							}
							return evaluatedFn.call(me, vs, parent, xindex,
									xcount)
						};
						return this
					},
					applyTemplate : function(a) {
						return this.master.compiled.call(this, a, {}, 1, 1)
					},
					compile : function() {
						return this
					}
				}, function() {
					this.implement({
						apply : this.prototype.applyTemplate
					})
				});
Ext
		.define(
				"Ext.ComponentQuery",
				{
					singleton : true,
					requires : [ "Ext.ComponentMgr" ]
				},
				function() {
					var h = this, k = [ "var r = [],", "i = 0,",
							"it = arguments[0],", "l = it.length,", "c;",
							"for (; i < l; i++) {", "c = it[i];",
							"if (c.{0}) {", "r.push(c);", "}", "}", "return r;" ]
							.join(""), f = function(p, o) {
						return o.method.apply(this, [ p ].concat(o.args))
					}, a = function(q, u) {
						var o = [], r, t = q.length, s, p = u != ">";
						for (r = 0; r < t; r++) {
							s = q[r];
							if (s.getRefItems) {
								o = o.concat(s.getRefItems(p))
							}
						}
						return o
					}, g = function(p) {
						var o = [], q, s = p.length, r;
						for (q = 0; q < s; q++) {
							r = p[q];
							while (!!(r = r.ownerCt)) {
								o.push(r)
							}
						}
						return o
					}, m = function(p, u, t) {
						if (u == "*") {
							return p.slice()
						} else {
							var o = [], q, s = p.length, r;
							for (q = 0; q < s; q++) {
								r = p[q];
								if (r.isXType(u, t)) {
									o.push(r)
								}
							}
							return o
						}
					}, j = function(p, s) {
						var o = [], q, t = p.length, r;
						for (q = 0; q < t; q++) {
							r = p[q];
							if (r.el ? r.el.hasCls(s) : r.initCls().contains(s)) {
								o.push(r)
							}
						}
						return o
					}, n = function(q, v, p, u) {
						var o = [], r, t = q.length, s;
						for (r = 0; r < t; r++) {
							s = q[r];
							if (!u ? !!s[v] : (s[v] == u)) {
								o.push(s)
							}
						}
						return o
					}, e = function(p, t) {
						var o = [], q, s = p.length, r;
						for (q = 0; q < s; q++) {
							r = p[q];
							if (r.getItemId() == t) {
								o.push(r)
							}
						}
						return o
					}, l = function(o, p, q) {
						return h.pseudos[p](o, q)
					}, i = /^(\s?([>\^])\s?|\s|$)/, d = /^(?:(#)?([\w-]+|\*)(?:\((true|false)\))?)|(?:\{([^\}]+)\})/, b = [
							{
								re : /^\.([\w-]+)(?:\((true|false)\))?/,
								method : m
							},
							{
								re : /^(?:[\[\{](?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
								method : n
							}, {
								re : /^#([\w-]+)/,
								method : e
							}, {
								re : /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
								method : l
							} ];
					h.Query = Ext.extend(Object, {
						constructor : function(o) {
							o = o || {};
							Ext.apply(this, o)
						},
						execute : function(p) {
							var r = this.operations, t = r.length, q, s, o;
							if (!p) {
								o = Ext.ComponentMgr.all.getArray()
							}
							for (s = 0; s < t; s++) {
								q = r[s];
								if (q.mode == "^") {
									o = g(o || [ p ])
								} else {
									if (q.mode) {
										o = a(o || [ p ], q.mode)
									} else {
										o = f(o || a([ p ]), q)
									}
								}
								if (s == t - 1) {
									return o
								}
							}
							return []
						},
						is : function(q) {
							var p = this.operations, s = p.length, r, o = Ext
									.isArray(q) ? q : [ q ];
							for (r = 0; r < s && o.length; r++) {
								o = f(o, p[r])
							}
							return o.length != 0
						}
					});
					Ext
							.apply(
									this,
									{
										cache : {},
										pseudos : {},
										query : function(o, w) {
											var z = o.split(","), r = z.length, p, t, q = [], A = [], v = {}, s, u;
											for (p = 0; p < r; p++) {
												o = Ext.String.trim(z[p]);
												t = this.cache[o];
												if (!t) {
													this.cache[o] = t = this
															.parse(o)
												}
												q = q.concat(t.execute(w))
											}
											if (r > 1) {
												s = q.length;
												for (p = 0; p < s; p++) {
													u = q[p];
													if (!v[u.id]) {
														A.push(u);
														v[u.id] = true
													}
												}
												q = A
											}
											return q
										},
										is : function(p, o) {
											if (!o) {
												return true
											}
											var q = this.cache[o];
											if (!q) {
												this.cache[o] = q = this
														.parse(o)
											}
											return q.is(p)
										},
										parse : function(p) {
											var o = [], u = b.length, v, q, w, z, A, t, r, s;
											while (p && v != p) {
												v = p;
												q = p.match(d);
												if (q) {
													w = q[1];
													if (w == "#") {
														o
																.push({
																	method : e,
																	args : [ Ext.String
																			.trim(q[2]) ]
																})
													} else {
														if (w == ".") {
															o
																	.push({
																		method : j,
																		args : [ Ext.String
																				.trim(q[2]) ]
																	})
														} else {
															if (q[4]) {
																o
																		.push({
																			method : new Function(
																					Ext.String
																							.format(
																									k,
																									q[4])),
																			args : []
																		})
															} else {
																o
																		.push({
																			method : m,
																			args : [
																					Ext.String
																							.trim(q[2]),
																					Boolean(q[3]) ]
																		})
															}
														}
													}
													p = p.replace(q[0], "")
												}
												while (!(z = p.match(i))) {
													for (r = 0; p && r < u; r++) {
														s = b[r];
														A = p.match(s.re);
														if (A) {
															o
																	.push({
																		method : s.method,
																		args : A
																				.slice(1)
																	});
															p = p.replace(A[0],
																	"");
															break
														}
														if (r == (u - 1)) {
															throw 'Invalid ComponentQuery selector: "'
																	+ arguments[0]
																	+ '"'
														}
													}
												}
												if (z[1]) {
													o.push({
														mode : z[2] || z[1]
													});
													p = p.replace(z[0], "")
												}
											}
											return new h.Query({
												operations : o
											})
										}
									})
				});
Ext.define("Ext.data.StoreMgr", {
	extend : "Ext.util.MixedCollection",
	singleton : true,
	register : function() {
		for (var a = 0, b; (b = arguments[a]); a++) {
			this.add(b)
		}
	},
	unregister : function() {
		for (var a = 0, b; (b = arguments[a]); a++) {
			this.remove(this.lookup(b))
		}
	},
	lookup : function(f) {
		if (Ext.isArray(f)) {
			var b = [ "field1" ], e = !Ext.isArray(f[0]);
			if (!e) {
				for (var d = 2, a = f[0].length; d <= a; ++d) {
					b.push("field" + d)
				}
			}
			return new Ext.data.ArrayStore({
				data : f,
				fields : b,
				expandData : e,
				autoDestroy : true,
				autoCreated : true
			})
		}
		return Ext.isObject(f) ? (f.events ? f : Ext.create(f, "store")) : this
				.get(f)
	},
	getKey : function(a) {
		return a.storeId
	}
}, function() {
	Ext.regStore = function(d, b) {
		var a;
		if (Ext.isObject(d)) {
			b = d
		} else {
			b.storeId = d
		}
		if (b instanceof Ext.data.Store) {
			a = b
		} else {
			a = Ext.create("Ext.data.Store", b)
		}
		return Ext.data.StoreMgr.register(a)
	};
	Ext.getStore = function(a) {
		return Ext.data.StoreMgr.lookup(a)
	}
});
Ext.define("Ext.LoadMask", {
	mixins : {
		observable : "Ext.util.Observable"
	},
	requires : [ "Ext.data.StoreMgr" ],
	statics : {
		loadingSpinner : '<div class="' + Ext.baseCSSPrefix
				+ 'loading-spinner"><span class="' + Ext.baseCSSPrefix
				+ 'loading-top"></span><span class="' + Ext.baseCSSPrefix
				+ 'loading-right"></span><span class="' + Ext.baseCSSPrefix
				+ 'loading-bottom"></span><span class="' + Ext.baseCSSPrefix
				+ 'loading-left"></span></div>'
	},
	msg : "Loading...",
	msgCls : Ext.baseCSSPrefix + "mask-loading",
	disabled : false,
	constructor : function(b, a) {
		this.el = Ext.get(b);
		Ext.apply(this, a);
		this.addEvents("show", "hide");
		if (this.store) {
			this.bindStore(this.store, true)
		}
		this.mixins.observable.constructor.call(this, a)
	},
	bindStore : function(a, b) {
		if (!b && this.store) {
			this.mun(this.store, {
				scope : this,
				beforeload : this.onBeforeLoad,
				load : this.onLoad,
				exception : this.onLoad
			});
			if (!a) {
				this.store = null
			}
		}
		if (a) {
			a = Ext.data.StoreMgr.lookup(a);
			this.mon(a, {
				scope : this,
				beforeload : this.onBeforeLoad,
				load : this.onLoad,
				exception : this.onLoad
			})
		}
		this.store = a;
		if (a && a.isLoading()) {
			this.onBeforeLoad()
		}
	},
	disable : function() {
		this.disabled = true;
		if (this.loading) {
			this.onLoad()
		}
	},
	enable : function() {
		this.disabled = false
	},
	isDisabled : function() {
		return this.disabled
	},
	onLoad : function() {
		this.loading = false;
		this.el.unmask();
		this.fireEvent("hide", this, this.el, this.store)
	},
	onBeforeLoad : function() {
		if (!this.disabled && !this.loading) {
			this.el.mask(
					this.self.loadingSpinner + '<div class="'
							+ Ext.baseCSSPrefix + 'loading-msg">' + this.msg
							+ "</div>", this.msgCls, false);
			this.fireEvent("show", this, this.el, this.store);
			this.loading = true
		}
	},
	show : function() {
		this.onBeforeLoad()
	},
	hide : function() {
		this.onLoad()
	},
	destroy : function() {
		this.hide();
		this.clearListeners()
	}
});
Ext
		.define(
				"Ext.ComponentLoader",
				{
					mixins : {
						observable : "Ext.util.Observable"
					},
					requires : [ "Ext.data.Connection" ],
					statics : {
						Renderer : {
							Html : function(a, b, d) {
								a.target.update(b.responseText);
								return true
							},
							Data : function(a, b, d) {
								var g = true;
								try {
									a.getTarget().update(
											Ext.decode(b.responseText))
								} catch (f) {
									g = false
								}
								return g
							},
							Component : function(a, d, f) {
								var i = true, h = a.getTarget(), b = [];
								if (!h.isContainer) {
									throw "Components can only be loader to a container"
								}
								try {
									b = Ext.decode(d.responseText)
								} catch (g) {
									i = false
								}
								if (i) {
									if (a.removeAll) {
										h.removeAll()
									}
									h.add(b)
								}
								return i
							}
						}
					},
					url : null,
					params : null,
					baseParams : null,
					autoLoad : false,
					target : null,
					loadMask : false,
					ajaxOptions : null,
					removeAll : false,
					renderer : "html",
					isLoader : true,
					constructor : function(b) {
						b = b || {};
						Ext.apply(this, b);
						this.setTarget(this.target);
						this.addEvents("beforeload", "exception", "load");
						this.mixins.observable.constructor.call(this);
						if (this.autoLoad) {
							var a = this.autoLoad;
							if (a === true) {
								a = {}
							}
							this.load(a)
						}
					},
					setTarget : function(a) {
						if (Ext.isString(a)) {
							a = Ext.getCmp(a)
						}
						if (this.target && this.target != a) {
							this.abort()
						}
						this.target = a
					},
					getTarget : function() {
						return this.target || null
					},
					abort : function() {
						var a = this.active;
						if (a !== undefined) {
							Ext.Ajax.abort(a.request);
							if (a.mask) {
								this.target.setLoading(false)
							}
							delete this.active
						}
					},
					load : function(i) {
						if (!this.target) {
							throw "A target is required when loading"
						}
						i = Ext.apply({}, i);
						var f = this, e = f.target, j = Ext
								.isDefined(i.loadMask) ? i.loadMask
								: f.loadMask, b = Ext.apply({}, i.params), a = Ext
								.apply({}, i.ajaxOptions), g = i.callback
								|| f.callback, h = i.scope || f.scope || f, d;
						Ext.applyIf(a, f.ajaxOptions);
						Ext.applyIf(i, a);
						Ext.applyIf(b, f.params);
						Ext.apply(b, f.baseParams);
						Ext.applyIf(i, {
							url : f.url
						});
						if (!i.url) {
							throw "No URL specified"
						}
						Ext.apply(i, {
							scope : f,
							params : b,
							callback : f.onComplete
						});
						if (f.fireEvent("beforeload", f, i) === false) {
							return
						}
						if (j) {
							f.target.setLoading(j)
						}
						d = Ext.Ajax.request(i);
						this.active = {
							request : d,
							options : i,
							mask : j,
							scope : h,
							callback : g,
							success : i.success || f.success,
							failure : i.failure || f.failure,
							removeAll : i.removeAll || f.removeAll,
							renderer : i.renderer || f.renderer
						}
					},
					onComplete : function(d, i, b) {
						var f = this, h = f.active, e = h.scope, g = this
								.getRenderer(h.renderer), a = Ext
								.isObject(h.renderer) ? h.renderer : {};
						if (i) {
							i = g.call(this, this, b, a)
						}
						if (i) {
							Ext.callback(h.success, e, [ f, b, d ]);
							f.fireEvent("load", f, b, d)
						} else {
							Ext.callback(h.failure, e, [ f, b, d ]);
							f.fireEvent("exception", f, b, d)
						}
						Ext.callback(h.callback, e, [ f, i, b, d ]);
						if (h.mask) {
							this.target.setLoading(false)
						}
						delete f.active
					},
					getRenderer : function(b) {
						if (Ext.isFunction(b)) {
							return b
						}
						var a = this.self.Renderer;
						switch (b) {
						case "component":
							return a.Component;
						case "data":
							return a.Data;
						default:
							return a.Html
						}
					},
					destroy : function() {
						delete this.target;
						this.abort();
						this.clearListeners()
					}
				});
Ext.define("Ext.layout.AbstractLayout", {
	isLayout : true,
	initialized : false,
	statics : {
		factory : function(b, e) {
			if (b instanceof Ext.layout.AbstractLayout) {
				return b
			}
			var d, a = {};
			if (Ext.isString(b)) {
				d = b
			} else {
				d = b.type || e;
				a = b
			}
			return Ext.create("layout." + d, a)
		}
	},
	constructor : function(a) {
		this.id = Ext.id(null, "ext-layout-" + this.type + "-");
		Ext.apply(this, a)
	},
	layout : function() {
		var a = this;
		a.layoutBusy = true;
		a.initLayout();
		if (a.beforeLayout.apply(a, arguments) !== false) {
			a.onLayout.apply(a, arguments);
			a.afterLayout();
			a.owner.needsLayout = false
		}
		a.layoutBusy = false
	},
	beforeLayout : function() {
		this.renderItems(this.getLayoutItems(), this.getRenderTarget());
		return true
	},
	renderItems : function(a, f) {
		var e = a.length, b = 0, d;
		for (; b < e; b++) {
			d = a[b];
			if (d && !d.rendered) {
				this.renderItem(d, f, b)
			} else {
				if (!this.isValidParent(d, f, b)) {
					this.moveItem(d, f, b)
				}
			}
		}
	},
	isValidParent : function(b, d, a) {
		var e = b.el ? b.el.dom : Ext.getDom(b);
		if (e && d && d.dom) {
			if (Ext.isNumber(a) && e !== d.dom.childNodes[a]) {
				return false
			}
			return (e.parentNode == (d.dom || d))
		}
		return false
	},
	renderItem : function(b, d, a) {
		if (!b.rendered) {
			b.render(d, a);
			this.configureItem(b);
			this.childrenChanged = true
		}
	},
	moveItem : function(b, d, a) {
		if (typeof a == "number") {
			a = d.dom.childNodes[a]
		}
		d = d.dom || d;
		d.insertBefore(b.el.dom, a || null);
		b.container = Ext.get(d);
		this.configureItem(b);
		this.childrenChanged = true
	},
	initLayout : function() {
		if (!this.initialized && !Ext.isEmpty(this.targetCls)) {
			this.getTarget().addCls(this.targetCls)
		}
		this.initialized = true
	},
	setOwner : function(a) {
		this.owner = a
	},
	getLayoutItems : function() {
		return []
	},
	configureItem : function(a) {
		if (this.itemCls) {
			a.el.addCls(this.itemCls)
		}
	},
	onLayout : Ext.emptyFn,
	afterLayout : Ext.emptyFn,
	onRemove : Ext.emptyFn,
	onDestroy : Ext.emptyFn,
	afterRemove : function(a) {
		if (this.itemCls && a.rendered) {
			a.el.removeCls(this.itemCls)
		}
	},
	destroy : function() {
		if (!Ext.isEmpty(this.targetCls)) {
			var a = this.getTarget();
			if (a) {
				a.removeCls(this.targetCls)
			}
		}
		this.onDestroy()
	}
});
Ext.define("Ext.layout.Manager", {
	extend : "Ext.AbstractManager",
	requires : [ "Ext.layout.AbstractLayout" ],
	singleton : true,
	typeName : "type",
	create : function(b, d) {
		var a;
		if (b instanceof Ext.layout.AbstractLayout) {
			return Ext.createByAlias("layout." + b)
		} else {
			if (Ext.isObject(b)) {
				a = b.type
			} else {
				a = b || d;
				b = {}
			}
			return Ext.createByAlias("layout." + a, b || {})
		}
	}
});
Ext
		.define(
				"Ext.layout.Component",
				{
					extend : "Ext.layout.AbstractLayout",
					type : "component",
					monitorChildren : true,
					initLayout : function() {
						var d = this, a = d.owner, b = a.el;
						if (!d.initialized) {
							if (this.owner.frameBody) {
								a.frameSize = d.frameSize = {
									top : b.down("." + a.frameCls + "-tc")
											.getHeight(),
									left : b.down("." + a.frameCls + "-ml")
											.getPadding("l"),
									right : b.down("." + a.frameCls + "-mr")
											.getPadding("r"),
									bottom : b.down("." + a.frameCls + "-bc")
											.getHeight()
								}
							} else {
								a.frameSize = d.frameSize = {
									top : 0,
									left : 0,
									bottom : 0,
									right : 0
								}
							}
						}
						d.parent(arguments)
					},
					beforeLayout : function(b, i, j, h) {
						this.parent(arguments);
						var d = this.owner, e = d.ownerCt, f = d.isVisible(), a = d.el.child, g;
						if (!j && e && e.layout && e.layout.fixedLayout
								&& e != h) {
							return false
						}
						if (!f && d.hiddenAncestor) {
							g = d.hiddenAncestor.layoutOnShow;
							g.remove(d);
							g.add(d);
							d.needsLayout = {
								width : b,
								height : i,
								isSetSize : false
							}
						}
						if (f && this.needsLayout(b, i)) {
							this.rawWidth = b;
							this.rawHeight = i;
							return true
						} else {
							return false
						}
					},
					needsLayout : function(d, a) {
						this.lastComponentSize = this.lastComponentSize || {
							width : -Infinity,
							height : -Infinity
						};
						var b = this.childrenChanged;
						this.childrenChanged = false;
						return (b || this.lastComponentSize.width !== d || this.lastComponentSize.height !== a)
					},
					setElementSize : function(d, b, a) {
						if (b !== undefined && a !== undefined) {
							d.setSize(b, a)
						} else {
							if (a !== undefined) {
								d.setHeight(a)
							} else {
								if (b !== undefined) {
									d.setWidth(b)
								}
							}
						}
					},
					getTarget : function() {
						return this.owner.el
					},
					getRenderTarget : function() {
						return this.owner.el
					},
					setTargetSize : function(e, a) {
						var f = this;
						f.setElementSize(f.owner.el, e, a);
						if (f.owner.frameBody) {
							var h = f.getTargetInfo(), g = h.padding, d = h.border, b = f.frameSize;
							f.owner.frameBody
									.setSize({
										width : e !== undefined ? (e - b.left
												- b.right - g.left - g.right
												- d.left - d.right) : null,
										height : a !== undefined ? (a - b.top
												- b.bottom - g.top - g.bottom
												- d.top - d.bottom) : null
									})
						}
						f.lastComponentSize = {
							width : e,
							height : a
						}
					},
					getTargetInfo : function() {
						if (!this.targetInfo) {
							var b = this.getTarget(), a = this.owner
									.getTargetEl();
							this.targetInfo = {
								padding : {
									top : b.getPadding("t"),
									right : b.getPadding("r"),
									bottom : b.getPadding("b"),
									left : b.getPadding("l")
								},
								border : {
									top : b.getBorderWidth("t"),
									right : b.getBorderWidth("r"),
									bottom : b.getBorderWidth("b"),
									left : b.getBorderWidth("l")
								},
								bodyMargin : {
									top : a.getMargin("t"),
									right : a.getMargin("r"),
									bottom : a.getMargin("b"),
									left : a.getMargin("l")
								}
							}
						}
						return this.targetInfo
					},
					afterLayout : function() {
						var a = this.owner, d = a.layout, b = a.ownerCt, g, f, e;
						a.afterComponentLayout(this.rawWidth, this.rawHeight);
						if (d && d.isLayout) {
							d.layout()
						}
						if (b && b.componentLayout
								&& b.componentLayout.monitorChildren
								&& !b.componentLayout.layoutBusy) {
							b.componentLayout.childrenChanged = true;
							if (b.componentLayout.bindToOwnerCtComponent === true) {
								b.doComponentLayout()
							} else {
								if (b.layout && !b.layout.layoutBusy) {
									if (b.layout.bindToOwnerCtComponent === true) {
										b.doComponentLayout()
									} else {
										if (b.componentLayout.bindToOwnerCtContainer === true
												|| b.layout.bindToOwnerCtContainer === true) {
											b.layout.layout()
										}
									}
								}
							}
						}
					}
				});
Ext.define("Ext.layout.component.Auto", {
	alias : "layout.autocomponent",
	extend : "Ext.layout.Component",
	type : "autocomponent",
	onLayout : function(b, a) {
		this.setTargetSize(b, a)
	}
});
Ext
		.define(
				"Ext.AbstractComponent",
				{
					mixins : {
						observable : "Ext.util.Observable"
					},
					requires : [ "Ext.PluginMgr", "Ext.ComponentMgr",
							"Ext.core.Element", "Ext.core.DomHelper",
							"Ext.XTemplate", "Ext.ComponentQuery",
							"Ext.LoadMask", "Ext.ComponentLoader",
							"Ext.EventManager", "Ext.layout.Manager",
							"Ext.layout.component.Auto" ],
					uses : [ "Ext.ZIndexManager" ],
					statics : {
						AUTO_ID : 1000
					},
					isComponent : true,
					getAutoId : function() {
						return ++Ext.AbstractComponent.AUTO_ID
					},
					renderTpl : null,
					tplWriteMode : "overwrite",
					baseCls : Ext.baseCSSPrefix + "component",
					disabledCls : Ext.baseCSSPrefix + "item-disabled",
					hidden : false,
					disabled : false,
					draggable : false,
					floating : false,
					hideMode : "display",
					styleHtmlContent : false,
					styleHtmlCls : Ext.baseCSSPrefix + "html",
					allowDomMove : true,
					autoShow : false,
					autoRender : false,
					needsLayout : false,
					rendered : false,
					constructor : function(b) {
						var e = this, d, a;
						b = b || {};
						e.initialConfig = b;
						Ext.apply(e, b);
						e.addEvents("beforeactivate", "activate",
								"beforedeactivate", "deactivate", "added",
								"disable", "enable", "beforeshow", "show",
								"beforehide", "hide", "removed",
								"beforerender", "render", "afterrender",
								"beforedestroy", "destroy", "resize", "move",
								"beforestaterestore", "staterestore",
								"beforestatesave", "statesave");
						e.getId();
						e.mons = [];
						e.additionalCls = [];
						e.renderData = e.renderData || {};
						e.renderSelectors = e.renderSelectors || {};
						if (e.plugins) {
							e.plugins = [].concat(e.plugins);
							for (d = 0, a = e.plugins.length; d < a; d++) {
								e.plugins[d] = e.constructPlugin(e.plugins[d])
							}
						}
						e.initComponent();
						Ext.ComponentMgr.register(e);
						e.mixins.observable.constructor.call(e);
						if (e.plugins) {
							e.plugins = [].concat(e.plugins);
							for (d = 0, a = e.plugins.length; d < a; d++) {
								e.plugins[d] = e.initPlugin(e.plugins[d])
							}
						}
						e.loader = e.getLoader();
						if (e.applyTo) {
							e.applyToMarkup(e.applyTo);
							delete e.applyTo
						} else {
							if (e.renderTo) {
								e.autoRender = e.renderTo;
								delete e.renderTo;
								e.doAutoRender()
							}
						}
						if (Ext.isDefined(e.disabledClass)) {
							throw "Component: disabledClass has been deprecated. Please use disabledCls."
						}
					},
					initComponent : Ext.emptyFn,
					applyToMarkup : Ext.emptyFn,
					show : Ext.emptyFn,
					onShow : function() {
						var a = this.needsLayout;
						if (Ext.isObject(a)) {
							this.doComponentLayout(a.width, a.height,
									a.isSetSize, a.ownerCt)
						}
					},
					constructPlugin : function(a) {
						if (a.ptype && typeof a.init != "function") {
							a.cmp = this;
							a = Ext.PluginMgr.create(a)
						} else {
							if (typeof a == "string") {
								a = Ext.PluginMgr.create({
									ptype : a,
									cmp : this
								})
							}
						}
						return a
					},
					initPlugin : function(a) {
						a.init(this);
						return a
					},
					doAutoRender : function() {
						var a = this;
						if (a.floating) {
							a.zIndexParent = a.getZIndexParent();
							a.floatParent = a.ownerCt;
							delete a.ownerCt;
							if ((a.constrain || a.constrainHeader)
									&& !a.constrainTo) {
								a.constrainTo = a.floatParent ? a.floatParent
										.getTargetEl() : Ext.getBody()
							}
							if (a.zIndexParent) {
								a.zIndexParent.registerFloatingItem(a)
							} else {
								Ext.WindowMgr.register(a)
							}
							a.render(document.body)
						} else {
							a.render(Ext.isBoolean(a.autoRender) ? Ext
									.getBody() : a.autoRender)
						}
					},
					getZIndexParent : function() {
						var a = this.ownerCt, b;
						if (a) {
							while (a) {
								b = a;
								a = a.ownerCt
							}
							if (b.el.dom !== document.body) {
								return b
							}
						}
					},
					render : function(b, a) {
						if (!this.rendered
								&& this.fireEvent("beforerender", this) !== false) {
							if (this.el) {
								this.el = Ext.get(this.el)
							}
							b = this.initContainer(b);
							this.onRender(b, a);
							this.el
									.setVisibilityMode(Ext.core.Element[this.hideMode
											.toUpperCase()]);
							if (this.overCls) {
								this.el.addClsOnOver(this.overCls)
							}
							this.fireEvent("render", this);
							this.initContent();
							this.afterRender(b);
							this.fireEvent("afterrender", this);
							this.initEvents();
							if (this.autoShow) {
								this.show()
							}
							if (this.hidden) {
								this.onHide(false)
							}
							if (this.disabled) {
								this.disable(true)
							}
						}
						return this
					},
					onRender : function(b, a) {
						var d = this.el, f, e;
						a = this.getInsertPosition(a);
						if (!d) {
							if (a) {
								d = Ext.core.DomHelper.insertBefore(a, this
										.getElConfig(), true)
							} else {
								d = Ext.core.DomHelper.append(b, this
										.getElConfig(), true)
							}
						} else {
							if (this.allowDomMove !== false) {
								b.dom.insertBefore(d.dom, a)
							}
						}
						d.addCls(this.initCls());
						d.setStyle(this.initStyles());
						this.el = d;
						if (this.frame && !Ext.supports.CSS3BorderRadius) {
							this.initFrame()
						}
						f = this.initRenderTpl();
						if (f) {
							e = this.initRenderData();
							f.append(this.getTargetEl(), e)
						}
						this.applyRenderSelectors();
						this.rendered = true
					},
					afterRender : function() {
						var a = this, d, b;
						a.getComponentLayout();
						a.setSize(a.width, a.height);
						if (a.floating
								&& (a.x === undefined || a.y === undefined)) {
							if (a.floatParent) {
								b = a.el.getAlignToXY(a.floatParent
										.getTargetEl(), "c-c");
								d = {
									left : b[0],
									top : b[1]
								}
							} else {
								b = a.el.getAlignToXY(a.container, "c-c");
								d = a.el.translatePoints(b[0], b[1])
							}
							a.x = a.x === undefined ? d.left : a.x;
							a.y = a.y === undefined ? d.top : a.y
						}
						if (a.x || a.y) {
							a.setPosition(a.x, a.y)
						}
						if (a.styleHtmlContent) {
							a.getTargetEl().addCls(a.styleHtmlCls)
						}
					},
					frameCls : "x-frame",
					frameTpl : [
							'<div class="{frameCls}-tl {baseCls}-tl" role="presentation">',
							'<div class="{frameCls}-tr {baseCls}-tr" role="presentation">',
							'<div class="{frameCls}-tc {baseCls}-tc" role="presentation"></div>',
							"</div>",
							"</div>",
							'<div class="{frameCls}-ml {baseCls}-ml" role="presentation">',
							'<div class="{frameCls}-mr {baseCls}-mr" role="presentation">',
							'<div class="{frameCls}-mc {baseCls}-mc" role="presentation"></div>',
							"</div>",
							"</div>",
							'<div class="{frameCls}-bl {baseCls}-bl" role="presentation">',
							'<div class="{frameCls}-br {baseCls}-br" role="presentation">',
							'<div class="{frameCls}-bc {baseCls}-bc" role="presentation"></div>',
							"</div>", "</div>" ],
					initFrame : function() {
						var a = this.initFrameTpl(), b = this.baseCls
								+ (this.ui ? "-" + this.ui : "");
						a.append(this.el, {
							frameCls : this.frameCls,
							baseCls : b
						});
						this.frameBody = this.el.down("." + b + "-mc")
					},
					initFrameTpl : function() {
						var a = this.frameTpl;
						if (Ext.isArray(a) || typeof a === "string") {
							a = new Ext.XTemplate(a)
						}
						return a
					},
					initCls : function() {
						var a = [ this.baseCls ];
						if (Ext.isDefined(this.cmpCls)) {
							throw "Ext.Component: cmpCls renamed to componentCls"
						}
						if (this.componentCls) {
							a.push(this.componentCls)
						} else {
							this.componentCls = this.baseCls
						}
						if (this.cls) {
							a.push(this.cls);
							delete this.cls
						}
						if (this.ui) {
							a.push(this.componentCls + "-" + this.ui)
						}
						if (this.frame) {
							a
									.push("x-framed " + this.baseCls + "-"
											+ (this.ui ? this.ui + "-" : "")
											+ "framed")
						}
						return a.concat(this.additionalCls)
					},
					getElConfig : function() {
						var a = this.autoEl || {
							tag : "div"
						};
						a.id = this.id;
						return a
					},
					getInsertPosition : function(a) {
						if (a !== undefined) {
							if (Ext.isNumber(a)) {
								a = this.container.dom.childNodes[a]
							} else {
								a = Ext.getDom(a)
							}
						}
						return a
					},
					initContainer : function(a) {
						if (!a && this.el) {
							a = this.el.dom.parentNode;
							this.allowDomMove = false
						}
						this.container = Ext.get(a);
						if (this.ctCls) {
							this.container.addCls(this.ctCls)
						}
						return this.container
					},
					initRenderData : function() {
						return Ext.applyIf(this.renderData, {
							ui : this.ui,
							baseCls : this.baseCls,
							componentCls : this.componentCls,
							frame : this.frame
						})
					},
					initRenderTpl : function() {
						var b = this.renderTpl, a = Ext.AbstractComponent.prototype;
						if (b) {
							if (a.renderTpl !== b) {
								if (Ext.isArray(b) || typeof b === "string") {
									b = new Ext.XTemplate(b)
								}
							} else {
								if (Ext.isArray(a.renderTpl)) {
									b = a.renderTpl = new Ext.XTemplate(b)
								}
							}
						}
						return b
					},
					initStyles : function() {
						var e = {}, a = Ext.core.Element, d, f, b, g;
						if (Ext.isString(this.style)) {
							b = this.style.split(";");
							for (d = 0, f = b.length; d < f; d++) {
								if (!Ext.isEmpty(b[d])) {
									g = b[d].split(":");
									e[Ext.String.trim(g[0])] = Ext.String
											.trim(g[1])
								}
							}
						} else {
							e = Ext.apply({}, this.style)
						}
						if (this.padding != undefined) {
							e.padding = a
									.unitizeBox((this.padding === true) ? 5
											: this.padding)
						}
						if (this.margin != undefined) {
							e.margin = a.unitizeBox((this.margin === true) ? 5
									: this.margin)
						}
						if (this.border != undefined) {
							e.borderWidth = a
									.unitizeBox((this.border === true) ? 1
											: this.border)
						}
						delete this.style;
						return e
					},
					initContent : function() {
						var d = this.getTargetEl();
						if (this.html) {
							d.update(Ext.core.DomHelper.markup(this.html));
							delete this.html
						}
						if (this.contentEl) {
							var a = Ext.get(this.contentEl), b = Ext.baseCSSPrefix;
							a.removeCls([ b + "hidden", b + "hide-display",
									b + "hide-offsets", b + "hide-nosize" ]);
							d.appendChild(a.dom)
						}
						if (this.tpl) {
							if (!this.tpl.isTemplate) {
								this.tpl = new Ext.XTemplate(this.tpl)
							}
							if (this.data) {
								this.tpl[this.tplWriteMode](d, this.data);
								delete this.data
							}
						}
					},
					initEvents : function() {
						var d = this.afterRenderEvents, b, a;
						if (d) {
							for (b in d) {
								if (!d.hasOwnProperty(b)) {
									continue
								}
								a = d[b];
								if (this[b] && this[b].on) {
									this.mon(this[b], a)
								}
							}
						}
					},
					applyRenderSelectors : function() {
						var b = this.renderSelectors || {}, d = this.el.dom, a;
						for (a in b) {
							if (!b.hasOwnProperty(a)) {
								continue
							}
							this[a] = Ext.get(Ext.DomQuery.selectNode(b[a], d))
						}
					},
					is : function(a) {
						return Ext.ComponentQuery.is(this, a)
					},
					up : function(b) {
						var a = this.ownerCt;
						if (b) {
							for (; a; a = a.ownerCt) {
								if (Ext.ComponentQuery.is(a, b)) {
									return a
								}
							}
						}
						return a
					},
					nextSibling : function(b) {
						var f = this.ownerCt, d, e, a, g;
						if (f) {
							d = f.items;
							a = d.indexOf(this) + 1;
							if (a) {
								if (b) {
									for (e = d.getCount(); a < e; a++) {
										if ((g = d.getAt(a)).is(b)) {
											return g
										}
									}
								} else {
									if (a < d.getCount()) {
										return d.getAt(a)
									}
								}
							}
						}
						return null
					},
					previousSibling : function(b) {
						var e = this.ownerCt, d, a, f;
						if (e) {
							d = e.items;
							a = d.indexOf(this);
							if (a != -1) {
								if (b) {
									for (--a; a >= 0; a--) {
										if ((f = d.getAt(a)).is(b)) {
											return f
										}
									}
								} else {
									if (a) {
										return d.getAt(--a)
									}
								}
							}
						}
						return null
					},
					getId : function() {
						return this.id
								|| (this.id = "ext-comp-" + (this.getAutoId()))
					},
					getItemId : function() {
						return this.itemId || this.id
					},
					getEl : function() {
						return this.el
					},
					getTargetEl : function() {
						return this.frameBody || this.el
					},
					isXType : function(b, a) {
						if (Ext.isFunction(b)) {
							b = b.xtype
						} else {
							if (Ext.isObject(b)) {
								b = b.constructor.xtype
							}
						}
						return !a ? ("/" + this.getXTypes() + "/").indexOf("/"
								+ b + "/") != -1 : this.constructor.xtype == b
					},
					getXTypes : function() {
						var a = this.self, b = [], e = this, d;
						if (!a.xtypes) {
							while (e && e.self) {
								d = e.self.xtype;
								if (d != undefined) {
									b.unshift(d)
								}
								e = e.self.superclass
							}
							a.xtypeChain = b;
							a.xtypes = b.join("/")
						}
						return a.xtypes
					},
					update : function(b, d, a) {
						if (this.tpl && !Ext.isString(b)) {
							this.data = b;
							if (this.rendered) {
								this.tpl[this.tplWriteMode](this.getTargetEl(),
										b || {})
							}
						} else {
							this.html = Ext.isObject(b) ? Ext.core.DomHelper
									.markup(b) : b;
							if (this.rendered) {
								this.getTargetEl().update(this.html, d, a)
							}
						}
						if (this.rendered) {
							this.doComponentLayout()
						}
					},
					setVisible : function(a) {
						return this[a ? "show" : "hide"]()
					},
					isVisible : function() {
						var b = this, e = b, d = !b.hidden, a = b.ownerCt;
						b.hiddenAncestor = false;
						if (b.destroyed) {
							return false
						}
						if (d && b.rendered && a) {
							while (a) {
								if (a.hidden
										|| (a.collapsed && !(a.getDockedItems && Ext.Array
												.contains(a.getDockedItems(), e)))) {
									b.hiddenAncestor = a;
									d = false;
									break
								}
								e = a;
								a = a.ownerCt
							}
						}
						return d
					},
					enable : function(a) {
						if (this.rendered) {
							this.el.removeCls(this.disabledCls);
							this.el.dom.disabled = false;
							this.onEnable()
						}
						this.disabled = false;
						if (a !== true) {
							this.fireEvent("enable", this)
						}
						return this
					},
					disable : function(a) {
						if (this.rendered) {
							this.el.addCls(this.disabledCls);
							this.el.dom.disabled = true;
							this.onDisable()
						}
						this.disabled = true;
						if (a !== true) {
							this.fireEvent("disable", this)
						}
						return this
					},
					isDisabled : function() {
						return this.disabled
					},
					setDisabled : function(a) {
						return this[a ? "disable" : "enable"]()
					},
					isHidden : function() {
						return this.hidden
					},
					addCls : function() {
						var b = this, a = Ext.Array.toArray(arguments);
						if (b.rendered) {
							b.el.addCls(a)
						} else {
							b.additionalCls = b.additionalCls.concat(a)
						}
						return b
					},
					addClass : function() {
						throw "Component: addClass has been deprecated. Please use addCls."
					},
					removeCls : function() {
						var b = this, a = Ext.Array.toArray(arguments);
						if (b.rendered) {
							b.el.removeCls(a)
						} else {
							if (b.additionalCls.length) {
								Ext.each(a, function(d) {
									Ext.Array.remove(b.additionalCls, d)
								})
							}
						}
						return b
					},
					removeClass : function() {
						throw "Component: removeClass has been deprecated. Please use removeCls."
					},
					addListener : function(b, g, f, a) {
						if (Ext.isString(b)
								&& (Ext.isObject(g) || a && a.element)) {
							if (a.element) {
								var e = g, d;
								g = {};
								g[b] = e;
								b = a.element;
								if (f) {
									g.scope = f
								}
								for (d in a) {
									if (!a.hasOwnProperty(d)) {
										continue
									}
									if (this.eventOptionsRe.test(d)) {
										g[d] = a[d]
									}
								}
							}
							if (this[b] && this[b].on) {
								this.mon(this[b], g)
							} else {
								this.afterRenderEvents = this.afterRenderEvents
										|| {};
								this.afterRenderEvents[b] = g
							}
						}
						return this.mixins.observable.addListener.apply(this,
								arguments)
					},
					getBubbleTarget : function() {
						return this.ownerCt
					},
					isFloating : function() {
						return this.floating
					},
					isDraggable : function() {
						return !!this.draggable
					},
					isDroppable : function() {
						return !!this.droppable
					},
					onAdded : function(a, b) {
						this.ownerCt = a;
						this.fireEvent("added", this, a, b)
					},
					onRemoved : function() {
						this.fireEvent("removed", this, this.ownerCt);
						delete this.ownerCt
					},
					onEnable : Ext.emptyFn,
					onDisable : Ext.emptyFn,
					beforeDestroy : Ext.emptyFn,
					onResize : Ext.emptyFn,
					setSize : function(b, a) {
						if (Ext.isObject(b)) {
							a = b.height;
							b = b.width
						}
						if (Ext.isNumber(b)) {
							b = Ext.Number.constrain(b, this.minWidth,
									this.maxWidth)
						}
						if (Ext.isNumber(a)) {
							a = Ext.Number.constrain(a, this.minHeight,
									this.maxHeight)
						}
						if (!this.rendered || !this.isVisible()) {
							if (this.hiddenAncestor) {
								var d = this.hiddenAncestor.layoutOnShow;
								d.remove(this);
								d.add(this)
							}
							this.needsLayout = {
								width : b,
								height : a,
								isSetSize : true
							};
							if (!this.rendered) {
								this.width = (b !== undefined) ? b : this.width;
								this.height = (a !== undefined) ? a
										: this.height
							}
							return this
						}
						this.doComponentLayout(b, a, true);
						return this
					},
					setCalculatedSize : function(d, a, b) {
						if (Ext.isObject(d)) {
							b = d.ownerCt;
							a = d.height;
							d = d.width
						}
						if (Ext.isNumber(d)) {
							d = Ext.Number.constrain(d, this.minWidth,
									this.maxWidth)
						}
						if (Ext.isNumber(a)) {
							a = Ext.Number.constrain(a, this.minHeight,
									this.maxHeight)
						}
						if (!this.rendered || !this.isVisible()) {
							if (this.hiddenAncestor) {
								var e = this.hiddenAncestor.layoutOnShow;
								e.remove(this);
								e.add(this)
							}
							this.needsLayout = {
								width : d,
								height : a,
								isSetSize : false,
								ownerCt : b
							};
							return this
						}
						this.doComponentLayout(d, a, false, b);
						return this
					},
					doComponentLayout : function(f, a, b, e) {
						var d = this.getComponentLayout();
						if (this.rendered && d) {
							f = (f !== undefined) ? f : this.width;
							a = (a !== undefined) ? a : this.height;
							if (b) {
								this.width = f;
								this.height = a
							}
							d.layout(f, a, b, e)
						}
						return this
					},
					setComponentLayout : function(b) {
						var a = this.componentLayout;
						if (a && a.isLayout && a != b) {
							a.setOwner(null)
						}
						this.componentLayout = b;
						b.setOwner(this)
					},
					getComponentLayout : function() {
						if (!this.componentLayout
								|| !this.componentLayout.isLayout) {
							this.setComponentLayout(Ext.layout.Manager.create(
									this.componentLayout, "autocomponent"))
						}
						return this.componentLayout
					},
					afterComponentLayout : function(b, a) {
						this.fireEvent("resize", this, b, a)
					},
					setPosition : function(a, b) {
						if (Ext.isObject(a)) {
							b = a.y;
							a = a.x
						}
						if (!this.rendered) {
							return this
						}
						if (a !== undefined || b !== undefined) {
							this.el.setBox(a, b);
							this.onPosition(a, b);
							this.fireEvent("move", this, a, b)
						}
						return this
					},
					onPosition : Ext.emptyFn,
					setWidth : function(a) {
						return this.setSize(a)
					},
					setHeight : function(a) {
						return this.setSize(undefined, a)
					},
					getSize : function() {
						return this.el.getSize()
					},
					getWidth : function() {
						return this.el.getWidth()
					},
					getHeight : function() {
						return this.el.getHeight()
					},
					getLoader : function() {
						var b = this.autoLoad ? (Ext.isObject(this.autoLoad) ? this.autoLoad
								: {
									url : this.autoLoad
								})
								: null, a = this.loader || b;
						if (a) {
							if (!a.isLoader) {
								this.loader = Ext.create("Ext.ComponentLoader",
										Ext.apply({
											target : this,
											autoLoad : b
										}, a))
							} else {
								a.setTarget(this)
							}
							return this.loader
						}
						return null
					},
					setLoading : function(a, b) {
						if (this.rendered) {
							if (a) {
								this.loadMask = this.loadMask
										|| new Ext.LoadMask(b ? this
												.getTargetEl() : this.el, Ext
												.applyIf(Ext.isObject(a) ? a
														: {}));
								this.loadMask.show()
							} else {
								Ext.destroy(this.loadMask);
								this.loadMask = null
							}
						}
						return this.loadMask
					},
					setDocked : function(a, b) {
						this.dock = a;
						if (b && this.ownerCt && this.rendered) {
							this.ownerCt.doComponentLayout()
						}
						return this
					},
					onDestroy : function() {
						if (this.monitorResize && Ext.EventManager.resizeEvent) {
							Ext.EventManager.resizeEvent.removeListener(
									this.setSize, this)
						}
						Ext.destroy(this.componentLayout, this.loadMask)
					},
					destroy : function() {
						if (!this.isDestroyed) {
							if (this.fireEvent("beforedestroy", this) !== false) {
								this.destroying = true;
								this.beforeDestroy();
								if (this.ownerCt && this.ownerCt.remove) {
									this.ownerCt.remove(this, false)
								}
								if (this.rendered) {
									this.el.remove()
								}
								this.onDestroy();
								Ext.ComponentMgr.unregister(this);
								this.fireEvent("destroy", this);
								this.clearListeners();
								this.destroying = false;
								this.isDestroyed = true
							}
						}
					},
					getPlugin : function(b) {
						var d = 0, a = this.plugins, e = a.length;
						for (; d < e; d++) {
							if (a[d].pluginId === b) {
								return a[d]
							}
						}
					}
				}, function() {
					this.implement({
						on : this.prototype.addListener,
						prev : this.prototype.previousSibling,
						next : this.prototype.nextSibling
					})
				});
Ext.define("Ext.util.Floating", {
	uses : [ "Ext.Layer" ],
	constructor : function(a) {
		this.floating = true;
		this.el = new Ext.Layer(Ext.apply({}, a, {
			hideMode : this.hideMode,
			hidden : this.hidden,
			shadow : Ext.isDefined(this.shadow) ? this.shadow : "sides",
			shadowOffset : this.shadowOffset,
			constrain : false,
			shim : this.shim === false ? false : undefined
		}), this.el)
	},
	setZIndex : function(a) {
		var b = this;
		this.el.setZIndex(a);
		a += 10;
		if (b.floatingItems) {
			a = Math.floor(b.floatingItems.setBase(a) / 100) * 100 + 10000
		}
		return a
	},
	doConstrain : function(d) {
		var e = this, a, b, f;
		if (e.constrain || e.constrainHeader) {
			if (e.constrainHeader) {
				a = e.header.el
			} else {
				a = e.el
			}
			b = a.getConstrainVector(d
					|| (e.floatParent && e.floatParent.getTargetEl())
					|| e.container);
			if (b) {
				f = e.getPosition();
				f[0] += b[0];
				f[1] += b[1];
				e.setPosition(f)
			}
		}
	},
	alignTo : function(b, a, d) {
		var e = this.el.getAlignToXY(b, a, d);
		this.setPagePosition(e);
		return this
	},
	toFront : function(a) {
		if (this.zIndexManager.bringToFront(this)) {
			if (!a || !a.getTarget().focus) {
				this.focus()
			}
		}
		return this
	},
	setActive : function(a) {
		if (a) {
			if (!this.maximized) {
			}
			this.fireEvent("activate", this)
		} else {
			this.el.disableShadow();
			this.fireEvent("deactivate", this)
		}
	},
	toBack : function() {
		this.zIndexManager.sendToBack(this);
		return this
	},
	center : function() {
		var a = this.el.getAlignToXY(this.container, "c-c");
		this.setPagePosition(a);
		return this
	},
	fitContainer : function() {
		var a = this.container.getViewSize(false);
		this.setSize(a)
	}
});
Ext
		.define(
				"Ext.Component",
				{
					alias : [ "widget.component", "widget.box" ],
					extend : "Ext.AbstractComponent",
					uses : [ "Ext.Layer", "Ext.resizer.Resizer",
							"Ext.util.ComponentDragger", "Ext.fx.Anim",
							"Ext.state.Manager", "Ext.util.DelayedTask" ],
					mixins : {
						floating : "Ext.util.Floating"
					},
					statics : {
						DIRECTION_UP : "up",
						DIRECTION_RIGHT : "right",
						DIRECTION_DOWN : "down",
						DIRECTION_LEFT : "left"
					},
					floating : false,
					hideMode : "display",
					hideParent : false,
					ariaRole : "presentation",
					bubbleEvents : [],
					actionMode : "el",
					monPropRe : /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/,
					constructor : function(a) {
						a = a || {};
						if (a.initialConfig) {
							a = a.initialConfig
						} else {
							if (a.tagName || a.dom || Ext.isString(a)) {
								a = {
									applyTo : a,
									id : a.id || a
								}
							}
						}
						Ext.Component.superclass.constructor.call(this, a);
						if (this.stateful !== false) {
							this.initState()
						}
					},
					initComponent : function() {
						if (this.listeners) {
							this.on(this.listeners);
							delete this.listeners
						}
						this.enableBubble(this.bubbleEvents);
						this.mons = []
					},
					render : function(d, a, b) {
						Ext.Component.superclass.render.apply(this, arguments);
						if (this.stateful !== false) {
							this.initStateEvents()
						}
						return this
					},
					afterRender : function() {
						var a = this.resizable || this.resizeable;
						if (this.floating) {
							this.makeFloating(this.floating)
						}
						this.setAutoScroll(this.autoScroll);
						Ext.Component.superclass.afterRender.apply(this,
								arguments);
						if (!(this.x && this.y) && (this.pageX || this.pageY)) {
							this.setPagePosition(this.pageX, this.pageY)
						}
						if (a) {
							this.initResizable(a)
						}
						if (this.draggable) {
							this.initDraggable()
						}
						this.initAria()
					},
					initAria : function() {
						var a = this.getActionEl(), b = this.ariaRole;
						if (b) {
							a.dom.setAttribute("role", b)
						}
					},
					setAutoScroll : function(a) {
						a = !!a;
						if (this.rendered) {
							this.getTargetEl().setStyle("overflow",
									a ? "auto" : "")
						}
						this.autoScroll = a;
						return this
					},
					makeFloating : function(a) {
						this.mixins.floating.constructor.call(this, a)
					},
					initResizable : function(a) {
						a = Ext.apply({
							target : this,
							dynamic : false,
							constrainTo : this.constrainTo
						}, a);
						a.target = this;
						this.resizer = new Ext.resizer.Resizer(a)
					},
					getDragEl : function() {
						return this.el
					},
					initDraggable : function() {
						var b = this, a = Ext.applyIf({
							el : this.getDragEl(),
							constrainTo : b.constrainTo || b.el.dom.parentNode
						}, this.draggable);
						if (b.constrain || b.constrainDelegate) {
							a.constrain = b.constrain;
							a.constrainDelegate = b.constrainDelegate
						}
						this.dd = new Ext.util.ComponentDragger(this, a)
					},
					setPosition : function(a, h, d) {
						if (a && typeof a[1] == "number") {
							d = h;
							h = a[1];
							a = a[0]
						}
						this.x = a;
						this.y = h;
						if (!this.rendered) {
							return this
						}
						var b = this.adjustPosition(a, h), g = b.x, f = b.y;
						var e = this.el;
						if (g !== undefined || f !== undefined) {
							if (d && Ext.fx) {
								d = {
									target : this,
									duration : Ext.num(d, 1000),
									listeners : {
										afteranimate : Ext.Function.bind(
												this.afterSetPosition, this, [
														g, f ])
									},
									to : {}
								};
								if (g !== undefined) {
									d.to.left = g
								}
								if (f !== undefined) {
									d.to.top = f
								}
								if (this.positionAnimation
										&& this.positionAnimation.running) {
									this.positionAnimation.end(true)
								}
								this.positionAnimation = new Ext.fx.Anim(d)
							} else {
								if (g == undefined) {
									e.setTop(f)
								} else {
									if (f == undefined) {
										e.setLeft(g)
									} else {
										e.setLeftTop(g, f)
									}
								}
								this.afterSetPosition(g, f)
							}
						}
						return this
					},
					afterSetPosition : function(b, a) {
						delete this.positionAnimation;
						this.onPosition(b, a);
						this.fireEvent("move", this, b, a)
					},
					showAt : function(a, d, b) {
						if (this.floating) {
							this.setPosition(a, d, b)
						} else {
							this.setPagePosition(a, d, b)
						}
						this.show()
					},
					setPagePosition : function(a, f, b) {
						if (a && typeof a[1] == "number") {
							f = a[1];
							a = a[0]
						}
						this.pageX = a;
						this.pageY = f;
						if (a === undefined || f === undefined) {
							return this
						}
						if (this.floating && this.floatParent) {
							var e = this.floatParent.getTargetEl()
									.getViewRegion();
							a -= e.left;
							f -= e.top;
							this.setPosition(a, f, b)
						} else {
							var d = this.el.translatePoints(a, f);
							this.setPosition(d.left, d.top, b)
						}
						return this
					},
					getBox : function(a) {
						var d = this.getPosition(a);
						var b = this.getSize();
						b.x = d[0];
						b.y = d[1];
						return b
					},
					updateBox : function(a) {
						this.setSize(a.width, a.height);
						this.setPagePosition(a.x, a.y);
						return this
					},
					getOuterSize : function() {
						var a = this.el;
						return {
							width : a.getWidth() + a.getMargin("lr"),
							height : a.getHeight() + a.getMargin("tb")
						}
					},
					adjustSize : function(a, b) {
						if (this.autoWidth) {
							a = "auto"
						}
						if (this.autoHeight) {
							b = "auto"
						}
						return {
							width : a,
							height : b
						}
					},
					adjustPosition : function(a, d) {
						if (this.floating && this.floatParent) {
							var b = this.floatParent.getTargetEl()
									.getViewRegion();
							a += b.left;
							d += b.top
						}
						return {
							x : a,
							y : d
						}
					},
					getPosition : function(a) {
						var b = this.el, d;
						if (a === true) {
							return [ b.getLeft(true), b.getTop(true) ]
						}
						d = this.xy || b.getXY();
						if (this.floating && this.floatParent) {
							var e = this.floatParent.getTargetEl()
									.getViewRegion();
							d[0] -= e.left;
							d[1] -= e.top
						}
						return d
					},
					getId : function() {
						return this.id
								|| (this.id = (this.getXType() || "ext-comp")
										+ "-" + this.getAutoId())
					},
					onEnable : function() {
						var a = this.getActionEl();
						a.removeCls(this.disabledClass);
						a.dom.removeAttribute("aria-disabled");
						a.dom.disabled = false
					},
					onDisable : function() {
						var a = this.getActionEl();
						a.addCls(this.disabledClass);
						a.dom.setAttribute("aria-disabled", true);
						a.dom.disabled = true
					},
					show : function(d, a, b) {
						if (!(this.rendered && this.isVisible())
								&& this.fireEvent("beforeshow", this) !== false) {
							this.hidden = false;
							if (!this.rendered
									&& (this.autoRender || this.floating)) {
								this.doAutoRender()
							}
							if (this.rendered) {
								this.beforeShow();
								this.onShow.apply(this, arguments);
								if (this.ownerCt && !this.ownerCt.suspendLayout
										&& !this.floating) {
									this.ownerCt.doLayout()
								}
							}
							this.afterShow()
						}
						return this
					},
					beforeShow : Ext.emptyFn,
					afterShow : function() {
						if (this.floating) {
							this.toFront()
						}
						this.fireEvent("show", this)
					},
					hide : function() {
						if (!(this.rendered && !this.isVisible())
								&& this.fireEvent("beforehide", this) !== false) {
							this.hidden = true;
							if (this.rendered) {
								this.onHide();
								if (this.ownerCt && !this.ownerCt.suspendLayout
										&& !this.floating) {
									this.ownerCt.doLayout()
								}
							}
							this.fireEvent("hide", this)
						}
						return this
					},
					onShow : function() {
						this.el.show();
						Ext.Component.superclass.onShow.call(this)
					},
					onHide : function() {
						this.el.hide()
					},
					destroy : function() {
						var a = this;
						if (!a.isDestroyed) {
							if (a.fireEvent("beforedestroy", a) !== false) {
								a.destroying = true;
								a.beforeDestroy();
								if (a.ownerCt && a.ownerCt.remove) {
									a.ownerCt.remove(a, false)
								}
								delete a.floatParent;
								if (a.rendered) {
									Ext.destroy(a.proxy, a.resizer);
									a.el.remove();
									if (a.actionMode == "container"
											|| a.removeMode == "container") {
										a.container.remove()
									}
								}
								if (a.zIndexManager) {
									a.zIndexManager.unregister(a)
								}
								if (a.focusTask && a.focusTask.cancel) {
									a.focusTask.cancel()
								}
								a.onDestroy();
								Ext.ComponentMgr.unregister(a);
								a.fireEvent("destroy", a);
								a.clearListeners();
								a.destroying = false;
								a.isDestroyed = true
							}
						}
					},
					initState : function() {
						if (Ext.state.Manager) {
							var b = this.getStateId();
							if (b) {
								var a = Ext.state.Manager.get(b);
								if (a) {
									if (this.fireEvent("beforestaterestore",
											this, a) !== false) {
										this.applyState(Ext.apply({}, a));
										this.fireEvent("staterestore", this, a)
									}
								}
							}
						}
					},
					getStateId : function() {
						return this.stateId
								|| ((/^(ext-comp-|ext-gen)/)
										.test(String(this.id)) ? null : this.id)
					},
					initStateEvents : function() {
						if (this.stateEvents) {
							for (var a = 0, b; b = this.stateEvents[a]; a++) {
								this.on(b, this.saveState, this, {
									delay : 100
								})
							}
						}
					},
					applyState : function(a) {
						if (a) {
							Ext.apply(this, a)
						}
					},
					getState : function() {
						return null
					},
					saveState : function() {
						if (Ext.state.Manager && this.stateful !== false) {
							var b = this.getStateId();
							if (b) {
								var a = this.getState();
								if (this.fireEvent("beforestatesave", this, a) !== false) {
									Ext.state.Manager.set(b, a);
									this.fireEvent("statesave", this, a)
								}
							}
						}
					},
					applyToMarkup : function(a) {
						this.allowDomMove = false;
						this.render(Ext.getDom(a).parentNode, null, true)
					},
					deleteMembers : function() {
						var b = arguments, a = b.length, d = 0;
						for (; d < a; ++d) {
							delete this[b[d]]
						}
					},
					focus : function(d, b) {
						var a;
						if (b) {
							this.focusTask = new Ext.util.DelayedTask(
									this.focus, this, [ d, false ]);
							this.focusTask.delay(Ext.isNumber(b) ? b : 10);
							return this
						}
						if (this.rendered && !this.isDestroyed) {
							a = this.getFocusEl();
							a.focus();
							if (a.dom && d === true) {
								a.dom.select()
							}
						}
						return this
					},
					getFocusEl : function() {
						return this.el
					},
					blur : function() {
						if (this.rendered) {
							this.el.blur()
						}
						return this
					},
					getEl : function() {
						return this.el
					},
					getResizeEl : function() {
						return this.el
					},
					getPositionEl : function() {
						return this.el
					},
					getActionEl : function() {
						return this.el
					},
					getVisibilityEl : function() {
						return this.el
					},
					onResize : Ext.emptyFn,
					getBubbleTarget : function() {
						return this.ownerCt
					},
					getContentTarget : function() {
						return this.el
					},
					cloneConfig : function(b) {
						b = b || {};
						var d = b.id || Ext.id();
						var a = Ext.applyIf(b, this.initialConfig);
						a.id = d;
						return new this.self(a)
					},
					getXType : function() {
						return this.self.xtype
					},
					isXType : function(b, a) {
						if (Ext.isFunction(b)) {
							b = b.xtype
						} else {
							if (Ext.isObject(b)) {
								b = b.constructor.xtype
							}
						}
						return !a ? ("/" + this.getXTypes() + "/").indexOf("/"
								+ b + "/") != -1 : this.self.xtype == b
					},
					findParentBy : function(a) {
						var b;
						for (b = this.ownerCt; (b != null) && !a(b, this); b = b.ownerCt) {
						}
						return b || null
					},
					findParentByType : function(a) {
						return Ext.isFunction(a) ? this
								.findParentBy(function(b) {
									return b.constructor === a
								}) : this.up(a)
					},
					bubble : function(d, b, a) {
						var e = this;
						while (e) {
							if (d.apply(b || e, a || [ e ]) === false) {
								break
							}
							e = e.ownerCt
						}
						return this
					},
					alignTo : function(b, a, d) {
						this.el.alignTo.apply(this.el, arguments)
					},
					getProxy : function() {
						if (!this.proxy) {
							this.proxy = this.el.createProxy(Ext.baseCSSPrefix
									+ "proxy-el", Ext.getBody(), true)
						}
						return this.proxy
					}
				});
Ext
		.define(
				"Ext.draw.SpriteGroup",
				{
					extend : "Ext.util.MixedCollection",
					isSpriteGroup : true,
					constructor : function(a) {
						a = a || {};
						Ext.apply(this, a);
						this.addEvents("mousedown", "mouseup", "mouseover",
								"mouseout", "click");
						this.id = Ext.id(null, "ext-sprite-group-");
						Ext.draw.SpriteGroup.superclass.constructor.call(this)
					},
					onClick : function(a) {
						this.fireEvent("click", a)
					},
					onMouseUp : function(a) {
						this.fireEvent("mouseup", a)
					},
					onMouseDown : function(a) {
						this.fireEvent("mousedown", a)
					},
					onMouseOver : function(a) {
						this.fireEvent("mouseover", a)
					},
					onMouseOut : function(a) {
						this.fireEvent("mouseout", a)
					},
					attachEvents : function(a) {
						a.on({
							scope : this,
							mousedown : this.onMouseDown,
							mouseup : this.onMouseUp,
							mouseover : this.onMouseOver,
							mouseout : this.onMouseOut,
							click : this.onClick
						})
					},
					add : function(b, d) {
						var a = Ext.draw.SpriteGroup.superclass.add.apply(this,
								Array.prototype.slice.call(arguments));
						this.attachEvents(a);
						return a
					},
					insert : function(a, b, d) {
						return Ext.draw.SpriteGroup.superclass.insert.apply(
								this, Array.prototype.slice.call(arguments))
					},
					remove : function(a) {
						Ext.draw.SpriteGroup.superclass.remove.apply(this,
								arguments)
					},
					getBBox : function() {
						var f, n, h, k = this.items, j = this.length, g = Infinity, d = g, m = -g, b = g, l = -g, e, a;
						for (f = 0; f < j; f++) {
							n = k[f];
							if (n.el) {
								h = n.getBBox();
								d = Math.min(d, h.x);
								b = Math.min(b, h.y);
								m = Math.max(m, h.height + h.y);
								l = Math.max(l, h.width + h.x)
							}
						}
						return {
							x : d,
							y : b,
							height : m - b,
							width : l - d
						}
					},
					setAttributes : function(b, f) {
						var d, a = this.items, e = this.length;
						for (d = 0; d < e; d++) {
							a[d].setAttributes(b, f)
						}
						return this
					},
					hide : function(b) {
						var d, a = this.items, e = this.length;
						for (d = 0; d < e; d++) {
							a[d].hide()
						}
						return this
					},
					show : function(b) {
						var d, a = this.items, e = this.length;
						for (d = 0; d < e; d++) {
							a[d].show()
						}
						return this
					},
					redraw : function() {
						var d, b = this.items, a = b.length ? b[0].surface
								: false, e = this.length;
						if (a) {
							for (d = 0; d < e; d++) {
								a.renderItem(b[d])
							}
						}
						return this
					},
					setStyle : function(f) {
						var a = this.items, e = this.length, b, d;
						for (b = 0; b < e; b++) {
							d = a[b];
							if (d.el) {
								el.setStyle(f)
							}
						}
					},
					addCls : function(f) {
						var d, b = this.items, a = b.length ? b[0].surface
								: false, e = this.length;
						if (a) {
							for (d = 0; d < e; d++) {
								a.addCls(b[d], f)
							}
						}
					},
					removeCls : function(f) {
						var d, b = this.items, a = b.length ? b[0].surface
								: false, e = this.length;
						if (a) {
							for (d = 0; d < e; d++) {
								a.removeCls(b[d], f)
							}
						}
					}
				});
Ext
		.define(
				"Ext.draw.Surface",
				{
					mixins : {
						observable : "Ext.util.Observable"
					},
					requires : [ "Ext.draw.SpriteGroup" ],
					uses : [ "Ext.draw.engine.SVG", "Ext.draw.engine.VML",
							"Ext.draw.engine.Canvas" ],
					statics : {
						newInstance : function(b, e) {
							e = e || [ "SVG", "Canvas", "VML" ];
							var d = 0, a = e.length, f;
							for (; d < a; d++) {
								if (Ext.supports[e[d]]) {
									f = Ext.draw.engine[e[d]];
									if (f) {
										return new f(b)
									}
								}
							}
							return false
						}
					},
					availableAttrs : {
						blur : 0,
						"clip-rect" : "0 0 1e9 1e9",
						cursor : "default",
						cx : 0,
						cy : 0,
						"dominant-baseline" : "auto",
						fill : "none",
						"fill-opacity" : 1,
						font : '10px "Arial"',
						"font-family" : '"Arial"',
						"font-size" : "10",
						"font-style" : "normal",
						"font-weight" : 400,
						gradient : "",
						height : 0,
						hidden : false,
						href : "http://sencha.com/",
						opacity : 1,
						path : "M0,0",
						radius : 0,
						rx : 0,
						ry : 0,
						scale : "1 1",
						src : "",
						stroke : "#000",
						"stroke-dasharray" : "",
						"stroke-linecap" : "butt",
						"stroke-linejoin" : "butt",
						"stroke-miterlimit" : 0,
						"stroke-opacity" : 1,
						"stroke-width" : 1,
						target : "_blank",
						text : "",
						"text-anchor" : "middle",
						title : "Ext Draw",
						width : 0,
						x : 0,
						y : 0,
						zIndex : 0
					},
					container : undefined,
					height : 352,
					width : 512,
					x : 0,
					y : 0,
					constructor : function(a) {
						a = a || {};
						Ext.apply(this, a);
						this.mixins.observable.constructor.call(this);
						this.domRef = Ext.getDoc().dom;
						this.customAttributes = {};
						this.addEvents("mousedown", "mouseup", "mouseover",
								"mouseout", "mousemove", "mouseenter",
								"mouseleave", "click");
						this.getId();
						this.initGradients();
						this.initItems();
						if (this.renderTo) {
							this.render(this.renderTo);
							delete this.renderTo
						}
						this.initBackground(a.background);
						return this
					},
					initSurface : Ext.emptyFn,
					renderItem : Ext.emptyFn,
					renderItems : Ext.emptyFn,
					setViewBox : Ext.emptyFn,
					addCls : Ext.emptyFn,
					removeCls : Ext.emptyFn,
					setStyle : Ext.emptyFn,
					initGradients : function() {
						var a = this.gradients;
						if (a) {
							Ext.each(a, this.addGradient, this)
						}
					},
					initItems : function() {
						var a = this.items;
						this.items = new Ext.draw.SpriteGroup();
						this.groups = new Ext.draw.SpriteGroup();
						if (a) {
							this.add(a)
						}
					},
					initBackground : function(b) {
						var f, g, e, d = this.width, a = this.height;
						if (b) {
							if (b.gradient) {
								g = b.gradient;
								f = g.id;
								this.addGradient(g);
								this.background = this.add({
									type : "rect",
									x : 0,
									y : 0,
									width : d,
									height : a,
									fill : "url(#" + f + ")"
								})
							} else {
								if (b.fill) {
									this.background = this.add({
										type : "rect",
										x : 0,
										y : 0,
										width : d,
										height : a,
										fill : b.fill
									})
								} else {
									if (b.image) {
										this.background = this.add({
											type : "image",
											x : 0,
											y : 0,
											width : d,
											height : a,
											src : b.image
										})
									}
								}
							}
						}
					},
					setSize : function(a, b) {
						if (this.background) {
							this.background.setAttributes({
								width : a,
								height : b,
								hidden : false
							}, true)
						}
					},
					scrubAttrs : function(e) {
						var d, b = {}, a = {}, f = e.attr;
						for (d in f) {
							if (this.translateAttrs.hasOwnProperty(d)) {
								b[this.translateAttrs[d]] = f[d];
								a[this.translateAttrs[d]] = true
							} else {
								if (this.availableAttrs.hasOwnProperty(d)
										&& !a[d]) {
									b[d] = f[d]
								}
							}
						}
						return b
					},
					onClick : function(a) {
						this.processEvent("click", a)
					},
					onMouseUp : function(a) {
						this.processEvent("mouseup", a)
					},
					onMouseDown : function(a) {
						this.processEvent("mousedown", a)
					},
					onMouseOver : function(a) {
						this.processEvent("mouseover", a)
					},
					onMouseOut : function(a) {
						this.processEvent("mouseout", a)
					},
					onMouseMove : function(a) {
						this.fireEvent("mousemove", a)
					},
					onMouseEnter : Ext.emptyFn,
					onMouseLeave : Ext.emptyFn,
					addGradient : Ext.emptyFn,
					add : function() {
						var g = Array.prototype.slice.call(arguments), j, e;
						var a = g.length > 1;
						if (a || Ext.isArray(g[0])) {
							var h = a ? g : g[0], b = [], d, f, k;
							for (d = 0, f = h.length; d < f; d++) {
								k = h[d];
								k = this.add(k);
								b.push(k)
							}
							return b
						}
						j = this.prepareItems(g[0], true)[0];
						this.positionSpriteInList(j);
						this.onAdd(j);
						return j
					},
					positionSpriteInList : function(d) {
						var b = this.items, e = d.attr.zIndex, a = b.indexOf(d);
						if (a < 0
								|| (a > 0 && b.getAt(a - 1).attr.zIndex > e)
								|| (a < b.length - 1 && b.getAt(a + 1).attr.zIndex < e)) {
							b.removeAt(a);
							a = b.findIndexBy(function(f) {
								return f.attr.zIndex > e
							});
							if (a < 0) {
								a = b.length
							}
							b.insert(a, d)
						}
						return a
					},
					onAdd : function(d) {
						var f = d.group, a, e, b;
						if (f) {
							a = [].concat(f);
							e = a.length;
							for (b = 0; b < e; b++) {
								f = a[b];
								this.getGroup(f).add(d)
							}
							delete d.group
						}
					},
					remove : function(a) {
						if (a) {
							this.items.remove(a);
							this.onRemove(a);
							this.groups.each(function(b) {
								b.remove(a)
							})
						}
					},
					removeAll : function() {
						var a = this.items.items, d = a.length, b;
						for (b = d; b > -1; b--) {
							this.remove(a[b])
						}
					},
					onRemove : Ext.emptyFn,
					applyTransformations : function(b) {
						b.bbox.transform = 0;
						this.transform(b);
						var e = this, d = false, a = b.attr;
						if (a.translation.x != null || a.translation.y != null) {
							e.translate(b);
							d = true
						}
						if (a.scaling.x != null || a.scaling.y != null) {
							e.scale(b);
							d = true
						}
						if (a.rotation.degrees != null) {
							e.rotate(b);
							d = true
						}
						if (d) {
							b.bbox.transform = 0;
							this.transform(b);
							b.transformations = []
						}
					},
					rotate : function(a) {
						var f, b = a.attr.rotation.degrees, e = a.attr.rotation.x, d = a.attr.rotation.y;
						if (!Ext.isNumber(e) || !Ext.isNumber(d)) {
							f = this.getBBox(a);
							e = !Ext.isNumber(e) ? f.x + f.width / 2 : e;
							d = !Ext.isNumber(d) ? f.y + f.height / 2 : d
						}
						a.transformations.push({
							type : "rotate",
							degrees : b,
							x : e,
							y : d
						})
					},
					translate : function(b) {
						var a = b.attr.translation.x || 0, d = b.attr.translation.y || 0;
						b.transformations.push({
							type : "translate",
							x : a,
							y : d
						})
					},
					scale : function(b) {
						var f, a = b.attr.scaling.x || 1, g = b.attr.scaling.y || 1, e = b.attr.scaling.centerX, d = b.attr.scaling.centerY;
						if (!Ext.isNumber(e) || !Ext.isNumber(d)) {
							f = this.getBBox(b);
							e = !Ext.isNumber(e) ? f.x + f.width / 2 : e;
							d = !Ext.isNumber(d) ? f.y + f.height / 2 : d
						}
						b.transformations.push({
							type : "scale",
							x : a,
							y : g,
							centerX : e,
							centerY : d
						})
					},
					rectPath : function(a, f, b, d, e) {
						if (e) {
							return [ [ "M", a + e, f ], [ "l", b - e * 2, 0 ],
									[ "a", e, e, 0, 0, 1, e, e ],
									[ "l", 0, d - e * 2 ],
									[ "a", e, e, 0, 0, 1, -e, e ],
									[ "l", e * 2 - b, 0 ],
									[ "a", e, e, 0, 0, 1, -e, -e ],
									[ "l", 0, e * 2 - d ],
									[ "a", e, e, 0, 0, 1, e, -e ], [ "z" ] ]
						}
						return [ [ "M", a, f ], [ "l", b, 0 ], [ "l", 0, d ],
								[ "l", -b, 0 ], [ "z" ] ]
					},
					ellipsePath : function(a, e, d, b) {
						if (b == null) {
							b = d
						}
						return [ [ "M", a, e ], [ "m", 0, -b ],
								[ "a", d, b, 0, 1, 1, 0, 2 * b ],
								[ "a", d, b, 0, 1, 1, 0, -2 * b ], [ "z" ] ]
					},
					getPathpath : function(a) {
						return a.attr.path
					},
					getPathcircle : function(d) {
						var b = d.attr;
						return this.ellipsePath(b.x, b.y, b.radius, b.radius)
					},
					getPathellipse : function(d) {
						var b = d.attr;
						return this.ellipsePath(b.x, b.y, b.radiusX, b.radiusY)
					},
					getPathrect : function(d) {
						var b = d.attr;
						return this.rectPath(b.x, b.y, b.width, b.height, b.r)
					},
					getPathimage : function(d) {
						var b = d.attr;
						return this.rectPath(b.x, b.y, b.width, b.height)
					},
					getPathtext : function(a) {
						var b = this.getBBoxText(a);
						return this.rectPath(b.x, b.y, b.width, b.height)
					},
					createGroup : function(b) {
						var a = this.groups.get(b);
						if (!a) {
							a = new Ext.draw.SpriteGroup({
								surface : this
							});
							a.id = b || Ext.id(null, "ext-surface-group-");
							this.groups.add(a)
						}
						return a
					},
					getGroup : function(b) {
						if (typeof b == "string") {
							var a = this.groups.get(b);
							if (!a) {
								a = this.createGroup(b)
							}
						} else {
							a = b
						}
						return a
					},
					prepareItems : function(a, d) {
						a = [].concat(a);
						var f, b, e;
						for (b = 0, e = a.length; b < e; b++) {
							f = a[b];
							f.surface = this;
							a[b] = this.createItem(f)
						}
						return a
					},
					createItem : Ext.emptyFn,
					getId : function() {
						return this.id
								|| (this.id = Ext.id(null, "ext-surface-"))
					},
					destroy : function() {
						delete this.domRef;
						this.removeAll()
					}
				});
Ext.define("Ext.layout.component.Draw", {
	alias : "layout.draw",
	extend : "Ext.layout.component.Auto",
	type : "draw",
	onLayout : function(b, a) {
		this.owner.surface.setSize(b, a);
		this.parent(arguments)
	}
});
Ext.define("Ext.draw.Component", {
	alias : "widget.draw",
	extend : "Ext.Component",
	requires : [ "Ext.draw.Surface", "Ext.layout.component.Draw" ],
	implOrder : [ "SVG", "Canvas", "VML" ],
	baseCls : Ext.baseCSSPrefix + "surface",
	componentLayout : "draw",
	viewBox : true,
	autoSize : false,
	initComponent : function() {
		Ext.draw.Component.superclass.initComponent.call(this);
		this.addEvents("mousedown", "mouseup", "mousemove", "mouseenter",
				"mouseleave")
	},
	onRender : function() {
		var f = this, h = f.viewBox, b = f.autoSize, g, d, e, a;
		this.parent(arguments);
		f.createSurface();
		d = f.surface.items;
		if (h || b) {
			g = d.getBBox();
			e = g.width;
			a = g.height;
			x = g.x;
			y = g.y;
			if (f.viewBox) {
				f.surface.setViewBox(x, y, e, a)
			} else {
				d.setAttributes({
					translate : {
						x : -x,
						y : -y
					}
				}, true);
				f.surface.setSize(e, a);
				f.el.setSize(e, a)
			}
		}
	},
	createSurface : function() {
		var a = Ext.draw.Surface.newInstance(Ext.apply({}, {
			width : this.width,
			height : this.height,
			renderTo : this.el
		}, this.initialConfig));
		this.surface = a;
		function b(d) {
			return function(f) {
				this.fireEvent(d, f)
			}
		}
		a.on({
			scope : this,
			mouseup : b("mouseup"),
			mousedown : b("mousedown"),
			mousemove : b("mousemove"),
			mouseenter : b("mouseenter"),
			mouseleave : b("mouseleave")
		})
	},
	destroy : function() {
		var a = this.surface;
		if (a) {
			a.destroy()
		}
		Ext.draw.Component.superclass.onRender.apply(this, arguments)
	}
});
Ext.define("Ext.chart.Shapes", {
	singleton : true,
	circle : function(a, b) {
		return a.add(Ext.apply({
			type : "circle",
			x : b.x,
			y : b.y,
			stroke : null,
			radius : b.radius
		}, b))
	},
	line : function(a, b) {
		return a.add(Ext.apply({
			type : "rect",
			x : b.x - b.radius,
			y : b.y - b.radius,
			height : 2 * b.radius,
			width : 2 * b.radius / 5
		}, b))
	},
	square : function(a, b) {
		return a.add(Ext.applyIf({
			type : "rect",
			x : b.x - b.radius,
			y : b.y - b.radius,
			height : 2 * b.radius,
			width : 2 * b.radius,
			radius : null
		}, b))
	},
	triangle : function(a, b) {
		b.radius *= 1.75;
		return a.add(Ext.apply({
			type : "path",
			stroke : null,
			path : "M".concat(b.x, ",", b.y, "m0-", b.radius * 0.58, "l",
					b.radius * 0.5, ",", b.radius * 0.87, "-", b.radius, ",0z")
		}, b))
	},
	diamond : function(a, d) {
		var b = d.radius;
		b *= 1.5;
		return a.add(Ext.apply({
			type : "path",
			stroke : null,
			path : [ "M", d.x, d.y - b, "l", b, b, -b, b, -b, -b, b, -b, "z" ]
		}, d))
	},
	cross : function(a, d) {
		var b = d.radius;
		b = b / 1.7;
		return a.add(Ext.apply({
			type : "path",
			stroke : null,
			path : "M".concat(d.x - b, ",", d.y, "l", [ -b, -b, b, -b, b, b, b,
					-b, b, b, -b, b, b, b, -b, b, -b, -b, -b, b, -b, -b, "z" ])
		}, d))
	},
	plus : function(a, d) {
		var b = d.radius / 1.3;
		return a.add(Ext.apply({
			type : "path",
			stroke : null,
			path : "M".concat(d.x - b / 2, ",", d.y - b / 2, "l", [ 0, -b, b,
					0, 0, b, b, 0, 0, b, -b, 0, 0, b, -b, 0, 0, -b, -b, 0, 0,
					-b, "z" ])
		}, d))
	},
	arrow : function(a, d) {
		var b = d.radius;
		return a.add(Ext.apply({
			type : "path",
			path : "M".concat(d.x - b * 0.7, ",", d.y - b * 0.4, "l", [
					b * 0.6, 0, 0, -b * 0.4, b, b * 0.8, -b, b * 0.8, 0,
					-b * 0.4, -b * 0.6, 0 ], "z")
		}, d))
	},
	drop : function(b, a, g, f, d, e) {
		d = d || 30;
		e = e || 0;
		b.add({
			type : "path",
			path : [ "M", a, g, "l", d, 0, "A", d * 0.4, d * 0.4, 0, 1, 0,
					a + d * 0.7, g - d * 0.7, "z" ],
			fill : "#000",
			stroke : "none",
			rotate : {
				degrees : 22.5 - e,
				x : a,
				y : g
			}
		});
		e = (e + 90) * Math.PI / 180;
		b.add({
			type : "text",
			x : a + d * Math.sin(e) - 10,
			y : g + d * Math.cos(e) + 5,
			text : f,
			"font-size" : d * 12 / 40,
			stroke : "none",
			fill : "#fff"
		})
	}
});
Ext
		.define(
				"Ext.chart.LegendItem",
				{
					extend : "Ext.draw.SpriteGroup",
					requires : [ "Ext.chart.Shapes" ],
					x : 0,
					y : 0,
					zIndex : 500,
					constructor : function(a) {
						this.parent(arguments);
						this.createSprites(a)
					},
					createSprites : function(s) {
						var t = this, h = s.yFieldIndex, k = t.series, a = k.type, m = t.yFieldIndex, d = t.legend, p = t.surface, q = d.x
								+ t.x, n = d.y + t.y, b, j = t.zIndex, l, i, r, e, o = false, g = Ext
								.apply(k.seriesStyle, k.style);
						function f(u) {
							var v = k[u];
							return (Ext.isArray(v) ? v[m] : v)
						}
						i = t.add("label", p.add({
							type : "text",
							x : 20,
							y : 0,
							zIndex : j || 0,
							font : d.labelFont,
							text : f("title") || f("yField")
						}));
						if (a === "line" || a === "scatter") {
							if (a === "line") {
								t.add("line", p.add({
									type : "path",
									path : "M0.5,0.5L16.5,0.5",
									zIndex : j,
									"stroke-width" : k.lineWidth,
									"stroke-linejoin" : "round",
									"stroke-dasharray" : k.dash,
									stroke : g.stroke || "#000",
									style : {
										cursor : "pointer"
									}
								}))
							}
							if (k.showMarkers || a === "scatter") {
								l = Ext.apply(k.markerStyle, k.markerCfg || {});
								t.add("marker", Ext.chart.Shapes[l.type](p, {
									fill : l.fill,
									x : 8.5,
									y : 0.5,
									zIndex : j,
									radius : l.radius || l.size,
									style : {
										cursor : "pointer"
									}
								}))
							}
						} else {
							t.add("box", p.add({
								type : "rect",
								zIndex : j,
								x : 0.5,
								y : 0.5,
								width : 12,
								height : 12,
								fill : k.getLegendColor(h),
								style : {
									cursor : "pointer"
								}
							}))
						}
						t.setAttributes({
							hidden : false
						}, true);
						b = t.getBBox();
						r = t.add("mask", p.add({
							type : "rect",
							x : b.x,
							y : b.y,
							width : b.width || 20,
							height : b.height || 20,
							zIndex : (j || 0) + 1000,
							fill : "#f00",
							opacity : 0,
							style : {
								cursor : "pointer"
							}
						}));
						t.on("mouseover", function() {
							i.setStyle({
								"font-weight" : "bold"
							});
							r.setStyle({
								cursor : "pointer"
							});
							k._index = h;
							k.highlightItem()
						}, t);
						t.on("mouseout", function() {
							i.setStyle({
								"font-weight" : "normal"
							});
							k._index = h;
							k.unHighlightItem()
						}, t);
						t.on("mousedown", function() {
							if (!o) {
								k.hideAll();
								i.setAttributes({
									opacity : 0.5
								}, true)
							} else {
								k.showAll();
								i.setAttributes({
									opacity : 1
								}, true)
							}
							o = !o
						}, t);
						t.updatePosition({
							x : 0,
							y : 0
						})
					},
					updatePosition : function(d) {
						var g = this, a = g.items, f = a.length, b = 0, e;
						if (!d) {
							d = g.legend
						}
						for (; b < f; b++) {
							e = a[b];
							switch (e.type) {
							case "text":
								e.setAttributes({
									x : 20 + d.x + g.x,
									y : d.y + g.y
								}, true);
								break;
							case "rect":
								e.setAttributes({
									translate : {
										x : d.x + g.x,
										y : d.y + g.y - 6
									}
								}, true);
								break;
							default:
								e.setAttributes({
									translate : {
										x : d.x + g.x,
										y : d.y + g.y
									}
								}, true)
							}
						}
					}
				});
Ext
		.define(
				"Ext.chart.Legend",
				{
					requires : [ "Ext.chart.LegendItem" ],
					visible : true,
					position : "bottom",
					x : 0,
					y : 0,
					labelFont : "12px Helvetica, sans-serif",
					boxStroke : "#000",
					boxStrokeWidth : 1,
					boxFill : "#FFF",
					itemSpacing : 10,
					padding : 5,
					width : 0,
					height : 0,
					boxZIndex : 100,
					constructor : function(a) {
						var b = this;
						if (a) {
							Ext.apply(b, a)
						}
						b.items = [];
						b.isVertical = ("left|right|float".indexOf(b.position) !== -1)
					},
					create : function() {
						var a = this;
						if (!a.created && a.isDisplayed()) {
							a.createItems();
							a.createBox();
							a.created = true
						}
					},
					isDisplayed : function() {
						return this.visible
								&& this.chart.series.findIndex("showInLegend",
										true) !== -1
					},
					createItems : function() {
						var r = this, k = r.chart, j = r.padding, s = r.itemSpacing, o = 0, n = 0, f = 0, q = 0, b = r.isVertical, e = Math, d = e.floor, t = e.max, i, h, g, p, a, l, m;
						k.series.each(function(v, u) {
							if (v.showInLegend) {
								Ext.each([].concat(v.yField), function(z, w) {
									p = new Ext.chart.LegendItem({
										legend : this,
										series : v,
										surface : k.surface,
										yFieldIndex : w
									});
									a = p.getBBox();
									m = a.width;
									l = a.height;
									if (u + w === 0) {
										g = b ? j + l / 2 : j
									} else {
										g = s / (b ? 2 : 1)
									}
									p.x = d(b ? j : f + g);
									p.y = d(b ? q + g : j + l / 2);
									f += m + g;
									q += l + g;
									o = t(o, m);
									n = t(n, l);
									this.items.push(p)
								}, this)
							}
						}, r);
						r.width = d((b ? o : f) + j * 2);
						r.height = d((b ? q - 2 * g : n) + (j * 2));
						r.itemHeight = n
					},
					getBBox : function() {
						var a = this;
						return {
							x : a.x,
							y : a.y,
							width : a.width,
							height : a.height
						}
					},
					createBox : function() {
						var b = this, a = b.boxSprite = b.chart.surface.add(Ext
								.apply({
									type : "rect",
									stroke : b.boxStroke,
									"stroke-width" : b.boxStrokeWidth,
									fill : b.boxFill,
									zIndex : b.boxZIndex
								}, b.getBBox()));
						a.redraw()
					},
					updatePosition : function() {
						var i = this, l, j, n = i.width, m = i.height, k = i.padding, h = i.chart, o = h.chartBBox, b = h.insetPadding, e = o.width
								- (b * 2), d = o.height - (b * 2), g = o.x + b, f = o.y
								+ b, a = h.surface, p = Math.floor;
						if (i.isDisplayed()) {
							switch (i.position) {
							case "left":
								l = b;
								j = p(f + d / 2 - m / 2);
								break;
							case "right":
								l = p(a.width - n) - b;
								j = p(f + d / 2 - m / 2);
								break;
							case "top":
								l = p(g + e / 2 - n / 2);
								j = b;
								break;
							case "bottom":
								l = p(g + e / 2 - n / 2);
								j = p(a.height - m) - b;
								break;
							default:
								l = p(i.x) + b;
								j = p(i.y) + b
							}
							i.x = l;
							i.y = j;
							Ext.each(i.items, function(q) {
								q.updatePosition()
							});
							i.boxSprite.setAttributes(i.getBBox(), true)
						}
					}
				});
Ext
		.define(
				"Ext.chart.Chart",
				{
					alias : "widget.chart",
					extend : "Ext.draw.Component",
					mixins : {
						themeMgr : "Ext.chart.theme.Theme"
					},
					requires : [ "Ext.util.MixedCollection",
							"Ext.data.StoreMgr", "Ext.chart.Legend",
							"Ext.util.DelayedTask" ],
					viewBox : false,
					animate : false,
					legend : false,
					insetPadding : 10,
					implOrder : [ "SVG", "VML", "Canvas" ],
					background : false,
					constructor : function(b) {
						var d = this, a;
						d.initTheme(b.theme || d.theme);
						if (d.gradients) {
							Ext.apply(b, {
								gradients : d.gradients
							})
						}
						if (d.background) {
							Ext.apply(b, {
								background : d.background
							})
						}
						if (b.animate) {
							a = {
								easing : "ease",
								duration : 500
							};
							if (Ext.isObject(b.animate)) {
								b.animate = Ext.applyIf(b.animate, anim)
							} else {
								b.animate = a
							}
						}
						this.parent([ b ])
					},
					initComponent : function() {
						var b = this, d, a;
						b.parent();
						b.addEvents("itemmousedown", "itemmouseup",
								"itemmouseover", "itemmouseout", "itemclick",
								"itemdoubleclick", "itemdragstart", "itemdrag",
								"itemdragend", "beforerefresh", "refresh");
						Ext.applyIf(b, {
							zoom : {
								x : 1,
								y : 1
							}
						});
						b.maxGutter = [ 0, 0 ];
						b.store = Ext.data.StoreMgr.lookup(b.store);
						d = b.axes;
						b.axes = new Ext.util.MixedCollection(false,
								function(e) {
									return e.position
								});
						if (d) {
							b.axes.addAll(d)
						}
						a = b.series;
						b.series = new Ext.util.MixedCollection(false,
								function(e) {
									return e.seriesId
											|| (e.seriesId = Ext.id(null,
													"ext-chart-series-"))
								});
						if (a) {
							b.series.addAll(a)
						}
						if (b.legend !== false) {
							b.legend = new Ext.chart.Legend(Ext.applyIf({
								chart : b
							}, b.legend))
						}
						b.on({
							mousemove : b.onMouseMove,
							mouseleave : b.onMouseLeave,
							mousedown : b.onMouseDown,
							mouseup : b.onMouseUp,
							scope : b
						})
					},
					afterComponentLayout : function(b, a) {
						var d = this;
						if (Ext.isNumber(b) && Ext.isNumber(a)) {
							d.curWidth = b;
							d.curHeight = a;
							d.redraw(true)
						}
						this.parent(arguments);
						if (d.ownerCt && d.ownerCt.layout && !d.zoom.adj
								&& (d.zoom.x !== 1 || d.zoom.y !== 1)) {
							d.zoom.adj = true;
							d.ownerCt.doLayout()
						}
					},
					redraw : function(a) {
						var e = this, d = e.chartBBox = {
							x : 0,
							y : 0,
							height : (e.curHeight * e.zoom.y),
							width : (e.curWidth * e.zoom.x)
						}, b = e.legend;
						e.surface.setSize(d.width, d.height);
						e.series.each(e.initializeSeries, e);
						e.axes.each(e.initializeAxis, e);
						if (b !== false) {
							b.create()
						}
						e.alignAxes();
						if (e.legend !== false) {
							b.updatePosition()
						}
						e.getMaxGutter();
						e.resizing = !!a;
						e.axes.each(e.drawAxis, e);
						e.series.each(e.drawCharts, e);
						e.resizing = false
					},
					afterRender : function() {
						var b, a = this;
						Ext.chart.Chart.superclass.afterRender.call(a);
						if (a.categoryNames) {
							a.setCategoryNames(a.categoryNames)
						}
						if (a.tipRenderer) {
							b = a.getFunctionRef(a.tipRenderer);
							a.setTipRenderer(b.fn, b.scope)
						}
						a.bindStore(a.store, true);
						a.refresh()
					},
					getEventXY : function(f) {
						var d = this, b = this.surface.getRegion(), h = f
								.getXY(), a = h[0] - b.left, g = h[1] - b.top;
						return [ a, g ]
					},
					onMouseDown : function(f) {
						var d = this, b, a;
						d.series.each(function(e) {
							if (e.getItemForPoint) {
								a = a || d.getEventXY(f);
								b = e.getItemForPoint(a[0], a[1]);
								if (b) {
									d.fireEvent("itemmousedown", b)
								}
							}
						}, d)
					},
					onMouseUp : function(f) {
						var d = this, b, a;
						d.series.each(function(e) {
							if (e.getItemForPoint) {
								a = a || d.getEventXY(f);
								b = e.getItemForPoint(a[0], a[1]);
								if (b) {
									d.fireEvent("itemmouseup", b)
								}
							}
						}, d)
					},
					onMouseMove : function(i) {
						var h = this, g, a, f, d, b;
						h.series
								.each(
										function(e) {
											if (e.getItemForPoint) {
												a = a || h.getEventXY(i);
												g = e.getItemForPoint(a[0],
														a[1]);
												f = e._lastItemForPoint;
												d = e._lastStoreItem;
												b = e._lastStoreField;
												if (g !== f
														|| (g.storeItem != d || g.storeField != b)) {
													if (f) {
														h.fireEvent(
																"itemmouseout",
																f);
														delete e._lastItemForPoint;
														delete e._lastStoreField;
														delete e._lastStoreItem
													}
													if (g) {
														h
																.fireEvent(
																		"itemmouseover",
																		g);
														e._lastItemForPoint = g;
														e._lastStoreItem = g.storeItem;
														e._lastStoreField = g.storeField
													}
												}
											}
										}, h)
					},
					onMouseLeave : function(a) {
						this.series.each(function(b) {
							delete b._lastItemForPoint
						})
					},
					delayRefresh : function() {
						var a = this;
						if (!a.refreshTask) {
							a.refreshTask = new Ext.util.DelayedTask(a.refresh,
									a)
						}
						a.refreshTask.delay(a.refreshBuffer)
					},
					refresh : function() {
						var a = this;
						if (a.rendered && a.curWidth != undefined
								&& a.curHeight != undefined) {
							if (a.fireEvent("beforerefresh", a) !== false) {
								a.redraw();
								a.fireEvent("refresh", a)
							}
						}
					},
					bindStore : function(a, b) {
						var d = this;
						if (!b && d.store) {
							if (a !== d.store && d.store.autoDestroy) {
								d.store.destroy()
							} else {
								d.store.un("datachanged", d.refresh, d);
								d.store.un("add", d.delayRefresh, d);
								d.store.un("remove", d.delayRefresh, d);
								d.store.un("update", d.delayRefresh, d);
								d.store.un("clear", d.refresh, d)
							}
						}
						if (a) {
							a = Ext.data.StoreMgr.lookup(a);
							a.on({
								scope : d,
								datachanged : d.refresh,
								add : d.delayRefresh,
								remove : d.delayRefresh,
								update : d.delayRefresh,
								clear : d.refresh
							})
						}
						d.store = a;
						if (a && !b) {
							d.refresh()
						}
					},
					initializeAxis : function(b) {
						var f = this, k = f.chartBBox, j = k.width, e = k.height, i = k.x, g = k.y, d = f.themeAttrs, a = {
							chart : f
						};
						if (d) {
							a.axisStyle = Ext.apply({}, d.axis);
							a.axisLabelLeftStyle = Ext.apply({},
									d.axisLabelLeft);
							a.axisLabelRightStyle = Ext.apply({},
									d.axisLabelRight);
							a.axisLabelTopStyle = Ext.apply({}, d.axisLabelTop);
							a.axisLabelBottomStyle = Ext.apply({},
									d.axisLabelBottom);
							a.axisTitleLeftStyle = Ext.apply({},
									d.axisTitleLeft);
							a.axisTitleRightStyle = Ext.apply({},
									d.axisTitleRight);
							a.axisTitleTopStyle = Ext.apply({}, d.axisTitleTop);
							a.axisTitleBottomStyle = Ext.apply({},
									d.axisTitleBottom)
						}
						switch (b.position) {
						case "top":
							Ext.apply(a, {
								length : j,
								width : e,
								x : i,
								y : g
							});
							break;
						case "bottom":
							Ext.apply(a, {
								length : j,
								width : e,
								x : i,
								y : e
							});
							break;
						case "left":
							Ext.apply(a, {
								length : e,
								width : j,
								x : i,
								y : e
							});
							break;
						case "right":
							Ext.apply(a, {
								length : e,
								width : j,
								x : j,
								y : e
							});
							break
						}
						if (!b.chart) {
							Ext.apply(a, b);
							b = f.axes.replace(Ext.create("Ext.chart.axis."
									+ b.type, a))
						} else {
							Ext.apply(b, a)
						}
						b.drawAxis(true)
					},
					alignAxes : function() {
						var g = this, h = g.axes, f = g.legend, b = [ "top",
								"right", "bottom", "left" ], e, d = g.insetPadding, a = {
							top : d,
							right : d,
							bottom : d,
							left : d
						};
						function i(k) {
							var j = h.findIndex("position", k);
							return (j < 0) ? null : h.getAt(j)
						}
						Ext
								.each(
										b,
										function(k) {
											var m = (k === "left" || k === "right"), j = i(k), l;
											if (f !== false) {
												if (f.position === k) {
													l = f.getBBox();
													a[k] += (m ? l.width
															: l.height)
															+ a[k]
												}
											}
											if (j) {
												l = j.bbox;
												a[k] += (m ? l.width : l.height)
											}
										});
						e = {
							x : a.left,
							y : a.top,
							width : (g.curWidth * g.zoom.x) - a.left - a.right,
							height : (g.curHeight * g.zoom.y) - a.top
									- a.bottom
						};
						g.chartBBox = e;
						h
								.each(function(j) {
									var l = j.position, k = (l === "left" || l === "right");
									j.x = (l === "right" ? e.x + e.width : e.x);
									j.y = (l === "top" ? e.y : e.y + e.height);
									j.width = (k ? e.width : e.height);
									j.length = (k ? e.height : e.width)
								})
					},
					initializeSeries : function(h, k) {
						var j = this, e = j.themeAttrs, d, f, n, p, o, m = [], g = 0, b, a = {
							chart : j,
							seriesId : h.seriesId
						};
						if (e) {
							n = e.seriesThemes;
							o = e.markerThemes;
							d = Ext.apply({}, e.series);
							f = Ext.apply({}, e.marker);
							a.seriesStyle = Ext.apply(d, n[k % n.length]);
							a.seriesLabelStyle = Ext.apply({}, e.seriesLabel);
							a.markerStyle = Ext.apply(f, o[k % o.length]);
							if (e.colors) {
								a.colorArrayStyle = e.colors
							} else {
								m = [];
								for (b = n.length; g < b; g++) {
									p = n[g];
									if (p.fill || p.stroke) {
										m.push(p.fill || p.stroke)
									}
								}
								if (m.length) {
									a.colorArrayStyle = m
								}
							}
							a.seriesIdx = k
						}
						if (!h.chart) {
							Ext.applyIf(a, h);
							h = j.series.replace(Ext.create("Ext.chart.series."
									+ Ext.String.capitalize(h.type), a))
						} else {
							Ext.apply(h, a)
						}
					},
					getMaxGutter : function() {
						var b = this, a = [ 0, 0 ];
						b.series.each(function(d) {
							var e = d.getGutters && d.getGutters() || [ 0, 0 ];
							a[0] = Math.max(a[0], e[0]);
							a[1] = Math.max(a[1], e[1])
						});
						b.maxGutter = a
					},
					drawAxis : function(a) {
						a.drawAxis()
					},
					drawCharts : function(a) {
						a.drawSeries()
					},
					destroy : function() {
						this.surface.destroy();
						this.parent(arguments)
					}
				});
Ext.define("Ext.ZIndexManager", {
	alternateClassName : "Ext.WindowGroup",
	statics : {
		zBase : 9000
	},
	constructor : function(a) {
		this.list = {};
		this.accessList = [];
		this.front = null;
		if (a && a.isContainer) {
			a.on("resize", this._onContainerResize, this);
			this.zseed = Ext.num(a.getEl().getStyle("zIndex"), this
					.getNextZSeed());
			this.targetEl = a.getTargetEl();
			this.container = a
		} else {
			Ext.EventManager.onWindowResize(this._onContainerResize, this);
			this.zseed = this.getNextZSeed();
			this.targetEl = a ? Ext.get(a) : Ext.getBody()
		}
	},
	getNextZSeed : function() {
		return Ext.ZIndexManager.zBase += 10000
	},
	setBase : function(a) {
		this.zseed = a;
		return this._orderFloaters()
	},
	_sortFloaters : function(b, a) {
		return (!b._lastAccess || b._lastAccess < a._lastAccess) ? -1 : 1
	},
	_orderFloaters : function() {
		var d = this.accessList, b = d.length, f = 0, g = this.zseed, e;
		if (b > 0) {
			d.sort(this._sortFloaters);
			for (; f < b; f++) {
				e = d[f];
				if (e && !e.hidden) {
					g = e.setZIndex(g)
				}
			}
		}
		this._activateLast();
		return g
	},
	_setActiveChild : function(a) {
		if (a != this.front) {
			if (this.front) {
				this.front.setActive(false)
			}
			this.front = a;
			if (a) {
				a.setActive(true);
				if (a.modal) {
					this._showModalMask(a.el.getStyle("zIndex") - 4)
				} else {
					this._hideModalMask()
				}
			}
		}
	},
	_activateLast : function(a) {
		for (var b = this.accessList.length - 1; b >= 0; --b) {
			if (!this.accessList[b].hidden) {
				this._setActiveChild(this.accessList[b]);
				return
			}
		}
		this._setActiveChild(null);
		this._hideModalMask()
	},
	_showModalMask : function(a) {
		if (!this.mask) {
			this.mask = this.targetEl.createChild({
				cls : "ext-el-mask"
			});
			this.mask.setVisibilityMode(Ext.core.Element.DISPLAY);
			this.mask.on("click", this._onMaskClick, this)
		}
		Ext.getBody().addCls(Ext.baseCSSPrefix + "body-masked");
		this.mask.setSize(this.targetEl.getViewSize(true));
		this.mask.setStyle("zIndex", a);
		this.mask.show()
	},
	_hideModalMask : function() {
		if (this.mask) {
			Ext.getBody().removeCls(Ext.baseCSSPrefix + "body-masked");
			this.mask.hide()
		}
	},
	_onMaskClick : function() {
		if (this.front) {
			this.front.focus()
		}
	},
	_onContainerResize : function() {
		if (this.mask && this.mask.isVisible()) {
			this.mask.setSize(this.targetEl.getViewSize(true))
		}
	},
	register : function(a) {
		if (a.zIndexManager) {
			a.zIndexManager.unregister(a)
		}
		a.zIndexManager = this;
		this.list[a.id] = a;
		this.accessList.push(a);
		a.on("hide", this._activateLast, this)
	},
	unregister : function(a) {
		delete a.zIndexManager;
		delete this.list[a.id];
		a.un("hide", this._activateLast);
		Ext.Array.remove(this.accessList, a)
	},
	get : function(a) {
		return typeof a == "object" ? a : this.list[a]
	},
	bringToFront : function(a) {
		a = this.get(a);
		if (a != this.front) {
			a._lastAccess = new Date().getTime();
			this._orderFloaters();
			return true
		}
		if (a.modal) {
			Ext.getBody().addCls(Ext.baseCSSPrefix + "body-masked");
			this.mask.setSize(Ext.core.Element.getViewWidth(true),
					Ext.core.Element.getViewHeight(true));
			this.mask.show()
		}
		return false
	},
	sendToBack : function(a) {
		a = this.get(a);
		a._lastAccess = -(new Date().getTime());
		this._orderFloaters();
		return a
	},
	hideAll : function() {
		for ( var a in this.list) {
			if (this.list[a].isComponent && this.list[a].isVisible()) {
				this.list[a].hide()
			}
		}
	},
	hide : function() {
		var b = 0, d = this.accessList.length, a;
		this.tempHidden = [];
		for (; b < d; b++) {
			a = this.accessList[b];
			if (a.isVisible()) {
				this.tempHidden.push(a);
				a.hide()
			}
		}
	},
	show : function() {
		var d = 0, e = this.tempHidden.length, b, a, f;
		for (; d < e; d++) {
			b = this.tempHidden[d];
			a = b.x;
			f = b.y;
			b.show();
			b.setPosition(a, f)
		}
		delete this.tempHidden
	},
	getActive : function() {
		return this.front
	},
	getBy : function(e, d) {
		var f = [], b = this.accessList.length - 1, a;
		for (; b >= 0; --b) {
			a = this.accessList[b];
			if (e.call(d || a, a) !== false) {
				f.push(a)
			}
		}
		return f
	},
	each : function(d, b) {
		var a;
		for ( var e in this.list) {
			a = this.list[e];
			if (a.isComponent && d.call(b || a, a) === false) {
				return
			}
		}
	},
	destroy : function() {
		delete this.accessList;
		delete this.list;
		delete this.container;
		delete this.targetEl
	}
}, function() {
	var a = this;
	Ext.onDocumentReady(function() {
		Ext.WindowMgr = new a()
	})
});
Ext
		.define(
				"Ext.Layer",
				{
					statics : {
						shims : []
					},
					extend : "Ext.core.Element",
					constructor : function(b, a) {
						b = b || {};
						var d = this, e = Ext.core.DomHelper, g = b.parentEl, f = g ? Ext
								.getDom(g)
								: document.body, h = b.hideMode;
						if (a) {
							d.dom = Ext.getDom(a)
						}
						if (!d.dom) {
							d.dom = e.append(f, b.dh || {
								tag : "div",
								cls : Ext.baseCSSPrefix + "layer"
							})
						} else {
							d.addCls(Ext.baseCSSPrefix + "layer");
							if (!d.dom.parentNode) {
								f.appendChild(d.dom)
							}
						}
						if (b.cls) {
							d.addCls(b.cls)
						}
						d.constrain = b.constrain !== false;
						if (h) {
							d.setVisibilityMode(Ext.core.Element[h
									.toUpperCase()]);
							if (d.visibilityMode == Ext.core.Element.ASCLASS) {
								d.visibilityCls = b.visibilityCls
							}
						} else {
							if (b.useDisplay) {
								d.setVisibilityMode(Ext.core.Element.DISPLAY)
							} else {
								d
										.setVisibilityMode(Ext.core.Element.VISIBILITY)
							}
						}
						if (b.id) {
							d.id = d.dom.id = b.id
						} else {
							d.id = Ext.id(d.dom)
						}
						d.position("absolute");
						d.shadowOffset = 0;
						d.useShim = b.shim !== false && Ext.useShims;
						if (b.hidden === true) {
							d.hide()
						} else {
							this.show()
						}
					},
					getZIndex : function() {
						return parseInt((this.getShim() || this)
								.getStyle("z-index"), 10)
					},
					getShim : function() {
						if (!this.useShim) {
							return null
						}
						if (this.shim) {
							return this.shim
						}
						var b = shims.shift();
						if (!b) {
							b = this.createShim();
							b.enableDisplayMode("block");
							b.dom.style.display = "none";
							b.dom.style.visibility = "visible"
						}
						var a = this.dom.parentNode;
						if (b.dom.parentNode != a) {
							a.insertBefore(b.dom, this.dom)
						}
						b.setStyle("z-index", this.getZIndex() - 2);
						this.shim = b;
						return b
					},
					hideShim : function() {
						if (this.shim) {
							this.shim.setDisplayed(false);
							shims.push(this.shim);
							delete this.shim
						}
					},
					disableShadow : function() {
						if (this.shadow) {
							this.shadowDisabled = true;
							this.shadow.hide();
							this.lastShadowOffset = this.shadowOffset;
							this.shadowOffset = 0
						}
					},
					enableShadow : function(a) {
						if (this.shadow) {
							this.shadowDisabled = false;
							this.shadowOffset = this.lastShadowOffset;
							delete this.lastShadowOffset;
							if (a) {
								this.sync(true)
							}
						}
					},
					sync : function(b) {
						var k = this.shadow;
						if (!this.updating && this.isVisible()
								&& (k || this.useShim)) {
							var f = this.getShim(), j = this.getWidth(), g = this
									.getHeight(), d = this.getLeft(true), m = this
									.getTop(true);
							if (k && !this.shadowDisabled) {
								if (b && !k.isVisible()) {
									k.show(this)
								} else {
									k.realign(d, m, j, g)
								}
								if (f) {
									if (b) {
										f.show()
									}
									var i = k.el.getXY(), e = f.dom.style, a = k.el
											.getSize();
									e.left = (i[0]) + "px";
									e.top = (i[1]) + "px";
									e.width = (a.width) + "px";
									e.height = (a.height) + "px"
								}
							} else {
								if (f) {
									if (b) {
										f.show()
									}
									f.setSize(j, g);
									f.setLeftTop(d, m)
								}
							}
						}
						return this
					},
					remove : function() {
						this.hideUnders();
						Ext.Layer.superclass.remove.call(this)
					},
					beginUpdate : function() {
						this.updating = true
					},
					endUpdate : function() {
						this.updating = false;
						this.sync(true)
					},
					hideUnders : function() {
						if (this.shadow) {
							this.shadow.hide()
						}
						this.hideShim()
					},
					constrainXY : function() {
						if (this.constrain) {
							var g = Ext.core.Element.getViewWidth(), b = Ext.core.Element
									.getViewHeight();
							var m = Ext.getDoc().getScroll();
							var l = this.getXY();
							var i = l[0], f = l[1];
							var a = this.shadowOffset;
							var j = this.dom.offsetWidth + a, d = this.dom.offsetHeight
									+ a;
							var e = false;
							if ((i + j) > g + m.left) {
								i = g - j - a;
								e = true
							}
							if ((f + d) > b + m.top) {
								f = b - d - a;
								e = true
							}
							if (i < m.left) {
								i = m.left;
								e = true
							}
							if (f < m.top) {
								f = m.top;
								e = true
							}
							if (e) {
								if (this.avoidY) {
									var k = this.avoidY;
									if (f <= k && (f + d) >= k) {
										f = k - d - 5
									}
								}
								l = [ i, f ];
								Ext.Layer.superclass.setXY.call(this, l);
								this.sync()
							}
						}
						return this
					},
					getConstrainOffset : function() {
						return this.shadowOffset
					},
					setVisible : function(h, b, g, i, f) {
						var a;
						if (b && h) {
							a = Ext.Function.bind(function() {
								this.sync(true);
								if (i) {
									i()
								}
							}, this);
							Ext.Layer.superclass.setVisible.call(this, true,
									true, g, a, f)
						} else {
							if (!h) {
								this.hideUnders(true)
							}
							a = i;
							if (b) {
								a = Ext.Function.bind(function() {
									this.hideAction();
									if (i) {
										i()
									}
								}, this)
							}
							Ext.Layer.superclass.setVisible.call(this, h, b, g,
									a, f);
							if (h) {
								this.sync(true)
							}
						}
						return this
					},
					beforeFx : function() {
						this.beforeAction();
						return Ext.Layer.superclass.beforeFx.apply(this,
								arguments)
					},
					afterFx : function() {
						Ext.Layer.superclass.afterFx.apply(this, arguments);
						this.sync(this.isVisible())
					},
					beforeAction : function() {
						if (!this.updating && this.shadow) {
							this.shadow.hide()
						}
					},
					setLeft : function(a) {
						Ext.Layer.superclass.setLeft.apply(this, arguments);
						return this.sync()
					},
					setTop : function(a) {
						Ext.Layer.superclass.setTop.apply(this, arguments);
						return this.sync()
					},
					setLeftTop : function(b, a) {
						Ext.Layer.superclass.setLeftTop.apply(this, arguments);
						return this.sync()
					},
					setXY : function(h, f, i, j, g) {
						this.fixDisplay();
						this.beforeAction();
						var b = this.createCB(j);
						Ext.Layer.superclass.setXY.call(this, h, f, i, b, g);
						if (!f) {
							b()
						}
						return this
					},
					createCB : function(b) {
						var a = this;
						return function() {
							a.constrainXY();
							a.sync(true);
							if (b) {
								b()
							}
						}
					},
					setX : function(b, f, h, i, g) {
						this.setXY([ b, this.getY() ], f, h, i, g);
						return this
					},
					setY : function(i, b, g, h, f) {
						this.setXY([ this.getX(), i ], b, g, h, f);
						return this
					},
					setSize : function(g, i, f, k, l, j) {
						this.beforeAction();
						var b = this.createCB(l);
						Ext.Layer.superclass.setSize.call(this, g, i, f, k, b,
								j);
						if (!f) {
							b()
						}
						return this
					},
					setWidth : function(g, f, i, j, h) {
						this.beforeAction();
						var b = this.createCB(j);
						Ext.Layer.superclass.setWidth.call(this, g, f, i, b, h);
						if (!f) {
							b()
						}
						return this
					},
					setHeight : function(g, f, j, k, i) {
						this.beforeAction();
						var b = this.createCB(k);
						Ext.Layer.superclass.setHeight
								.call(this, g, f, j, b, i);
						if (!f) {
							b()
						}
						return this
					},
					setBounds : function(j, i, a, l, b, h, k, g) {
						this.beforeAction();
						var f = this.createCB(k);
						if (!b) {
							Ext.Layer.superclass.setXY.call(this, [ j, i ]);
							Ext.Layer.superclass.setSize.call(this, a, l, b, h,
									f, g);
							f()
						} else {
							Ext.Layer.superclass.setBounds.call(this, j, i, a,
									l, b, h, f, g)
						}
						return this
					},
					setZIndex : function(a) {
						this.zindex = a;
						this.setStyle("z-index", a + 2);
						if (this.shadow) {
							this.shadow.setZIndex(a + 1)
						}
						if (this.shim) {
							this.shim.setStyle("z-index", a)
						}
						return this
					}
				});
Ext.define("Ext.resizer.Resizer", {
	mixins : {
		observable : "Ext.util.Observable"
	},
	uses : [ "Ext.resizer.ResizeTracker" ],
	legacyClassName : "Ext.Resizable",
	handleCls : Ext.baseCSSPrefix + "resizable-handle",
	pinnedCls : Ext.baseCSSPrefix + "resizable-pinned",
	overCls : Ext.baseCSSPrefix + "resizable-over",
	proxyCls : Ext.baseCSSPrefix + "resizable-proxy",
	wrapCls : Ext.baseCSSPrefix + "resizable-wrap",
	dynamic : true,
	handles : "s e se",
	minHeight : 5,
	minWidth : 5,
	maxHeight : 10000,
	maxWidth : 10000,
	pinned : false,
	preserveRatio : false,
	possiblePositions : {
		n : "north",
		s : "south",
		e : "east",
		w : "west",
		se : "southeast",
		sw : "southwest",
		nw : "northwest",
		ne : "northeast"
	},
	constructor : function(a) {
		var h = this, g, m, l = h.handles, b, k, f, d = 0, j;
		this.addEvents("beforeresize", "resizedrag", "resize");
		if (Ext.isElement(a) || a.dom) {
			a = {
				target : a
			}
		}
		h.mixins.observable.constructor.call(h, a);
		g = h.target;
		if (g) {
			if (g.isComponent) {
				h.el = g.getEl();
				h.minWidth = g.minWidth;
				h.minHeight = g.minHeight;
				h.maxWidth = g.maxWidth;
				h.maxHeight = g.maxHeight;
				if (g.floating) {
					if (!this.hasOwnProperty("handles")) {
						this.handles = "n ne e se s sw w nw"
					}
				}
			} else {
				h.el = Ext.get(g)
			}
		} else {
			h.target = h.el = Ext.get(h.el)
		}
		m = h.el.dom.tagName;
		if (m == "TEXTAREA" || m == "IMG") {
			h.originalTarget = h.target;
			h.target = h.el = h.el.wrap({
				cls : h.wrapCls
			});
			h.el.setPositioning(h.originalTarget.getPositioning());
			h.originalTarget.clearPositioning();
			var e = h.originalTarget.getBox();
			h.el.setBox(e)
		}
		h.el.position();
		if (h.pinned) {
			h.el.addCls(h.pinnedCls)
		}
		h.resizeTracker = Ext.create("Ext.resizer.ResizeTracker", {
			target : h.target,
			constrainTo : h.constrainTo,
			overCls : h.overCls,
			throttle : h.throttle,
			originalTarget : h.originalTarget,
			delegate : "." + h.handleCls,
			dynamic : h.dynamic,
			preserveRatio : h.preserveRatio,
			minHeight : h.minHeight,
			maxHeight : h.maxHeight,
			minWidth : h.minWidth,
			maxWidth : h.maxWidth
		});
		h.resizeTracker.on("mousedown", h.onBeforeResize, h);
		h.resizeTracker.on("drag", h.onResize, h);
		h.resizeTracker.on("dragend", h.onResizeEnd, h);
		if (h.handles == "all") {
			h.handles = "n s e w ne nw se sw"
		}
		l = h.handles = h.handles.split(/ |\s*?[,;]\s*?/);
		k = h.possiblePositions;
		f = l.length;
		b = h.handleCls
				+ " "
				+ (this.target.isComponent ? (h.target.baseCls + "-handle ")
						: "") + h.handleCls + "-";
		for (; d < f; d++) {
			if (l[d] && k[l[d]]) {
				j = k[l[d]];
				h[j] = new Ext.Component({
					owner : this,
					region : j,
					cls : b + j,
					renderTo : h.el
				});
				h[j].el.unselectable()
			}
		}
	},
	onBeforeResize : function(d, f) {
		var a = this.target.getBox();
		return this.fireEvent("beforeresize", this, a.width, a.height, f)
	},
	onResize : function(d, f) {
		var a = this.target.getBox();
		return this.fireEvent("resizedrag", this, a.width, a.height, f)
	},
	onResizeEnd : function(d, f) {
		var a = this.target.getBox();
		return this.fireEvent("resize", this, a.width, a.height, f)
	},
	resizeTo : function(b, a) {
		this.target.setSize(b, a);
		this.fireEvent("resize", this, b, a, null)
	},
	destroy : function() {
		var d;
		for (var b = 0, a = this.handles.length; b < a; b++) {
			d = this[this.possiblePositions[this.handles[b]]];
			delete d.owner;
			Ext.destroy(d)
		}
	}
});
Ext
		.define(
				"Ext.dd.DragTracker",
				{
					uses : [ "Ext.util.Region" ],
					mixins : {
						observable : "Ext.util.Observable"
					},
					active : false,
					trackOver : false,
					tolerance : 5,
					autoStart : false,
					constructor : function(a) {
						Ext.apply(this, a);
						this.addEvents("mouseover", "mouseout", "mousedown",
								"mouseup", "mousemove", "dragstart", "dragend",
								"drag");
						this.dragRegion = new Ext.util.Region(0, 0, 0, 0);
						if (this.el) {
							this.initEl(this.el)
						}
						this.mixins.observable.constructor.call(this)
					},
					initEl : function(a) {
						this.el = Ext.get(a);
						this.handle = Ext.get(this.delegate);
						this.delegate = this.handle ? undefined : this.delegate;
						if (!this.handle) {
							this.handle = this.el
						}
						this.mon(this.handle, {
							mousedown : this.onMouseDown,
							delegate : this.delegate,
							scope : this
						});
						if (this.trackOver || this.overCls) {
							this.mon(this.handle, {
								mouseover : this.onMouseOver,
								mouseout : this.onMouseOut,
								delegate : this.delegate,
								scope : this
							})
						}
					},
					disable : function() {
						this.disabled = true
					},
					enable : function() {
						this.disabled = false
					},
					destroy : function() {
						delete this.el
					},
					onMouseOver : function(b, a) {
						if (Ext.EventManager.contains(b)) {
							this.mouseIsOut = false;
							if (this.overCls) {
								this.el.addCls(this.overCls)
							}
							this.fireEvent("mouseover", this, b,
									this.delegate ? b.getTarget(this.delegate,
											a) : this.handle)
						}
					},
					onMouseOut : function(a) {
						if (!this.el.contains(a.getRelatedTarget())) {
							if (this.mouseIsDown) {
								this.mouseIsOut = true
							} else {
								if (this.overCls) {
									this.el.removeCls(this.overCls)
								}
								this.fireEvent("mouseout", this, a)
							}
						}
					},
					onMouseDown : function(b, a) {
						if (this.disabled || b.dragTracked) {
							return
						}
						this.dragTarget = this.delegate ? a : this.handle.dom;
						this.startXY = this.lastXY = b.getXY();
						this.startRegion = Ext.fly(this.dragTarget).getRegion();
						if (this.fireEvent("mousedown", this, b) !== false
								&& this.onBeforeStart(b) !== false) {
							this.mouseIsDown = true;
							b.dragTracked = true;
							if (this.preventDefault !== false) {
								b.preventDefault()
							}
							Ext.getDoc().on({
								scope : this,
								mouseup : this.onMouseUp,
								mousemove : this.onMouseMove,
								selectstart : this.stopSelect
							});
							if (this.autoStart) {
								this.timer = Ext.defer(this.triggerStart,
										this.autoStart === true ? 1000
												: this.autoStart, this, [ b ])
							}
						}
					},
					onMouseMove : function(f, d) {
						if (this.active && Ext.isIE
								&& !(Ext.isIE9 && Ext.isStrict)
								&& !f.browserEvent.button) {
							f.preventDefault();
							this.onMouseUp(f);
							return
						}
						f.preventDefault();
						var b = f.getXY(), a = this.startXY;
						this.lastXY = b;
						if (!this.active) {
							if (Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1]
									- b[1])) > this.tolerance) {
								this.triggerStart(f)
							} else {
								return
							}
						}
						if (this.fireEvent("mousemove", this, f) === false) {
							this.onMouseUp(f)
						} else {
							this.onDrag(f);
							this.fireEvent("drag", this, f)
						}
					},
					onMouseUp : function(d) {
						this.mouseIsDown = false;
						delete d.dragTracked;
						if (this.mouseIsOut) {
							this.mouseIsOut = false;
							this.onMouseOut(d)
						}
						var b = Ext.getDoc(), a = this.active;
						b.un("mousemove", this.onMouseMove, this);
						b.un("mouseup", this.onMouseUp, this);
						b.un("selectstart", this.stopSelect, this);
						d.preventDefault();
						this.clearStart();
						this.active = false;
						this.fireEvent("mouseup", this, d);
						if (a) {
							this.onEnd(d);
							this.fireEvent("dragend", this, d)
						}
						delete this._constrainRegion
					},
					triggerStart : function(a) {
						this.clearStart();
						this.active = true;
						this.onStart(a);
						this.fireEvent("dragstart", this, a)
					},
					clearStart : function() {
						if (this.timer) {
							clearTimeout(this.timer);
							delete this.timer
						}
					},
					stopSelect : function(a) {
						a.stopEvent();
						return false
					},
					onBeforeStart : function(a) {
					},
					onStart : function(a) {
					},
					onDrag : function(a) {
					},
					onEnd : function(a) {
					},
					getDragTarget : function() {
						return this.dragTarget
					},
					getDragCt : function() {
						return this.el
					},
					getConstrainRegion : function() {
						if (this.constrainTo) {
							if (this.constrainTo instanceof Ext.util.Region) {
								return this.constrainTo
							}
							if (!this._constrainRegion) {
								this._constrainRegion = Ext.fly(
										this.constrainTo).getRegion()
							}
						} else {
							if (!this._constrainRegion) {
								this._constrainRegion = this.getDragCt()
										.getRegion()
							}
						}
						return this._constrainRegion
					},
					getXY : function(a) {
						return a ? this.constrainModes[a].call(this,
								this.lastXY) : this.lastXY
					},
					getOffset : function(d) {
						var b = this.getXY(d), a = this.startXY;
						return [ b[0] - a[0], b[1] - a[1] ]
					},
					constrainModes : {
						point : function(d) {
							var b = this.dragRegion, a = this
									.getConstrainRegion();
							if (!a) {
								return d
							}
							b.x = b.left = b[0] = b.right = d[0];
							b.y = b.top = b[1] = b.bottom = d[1];
							b.constrainTo(a);
							return [ b.left, b.top ]
						},
						dragTarget : function(f) {
							var b = this.startXY, e = this.startRegion.copy(), a = this
									.getConstrainRegion(), d;
							if (!a) {
								return f
							}
							e.translateBy
									.apply(e, [ f[0] - b[0], f[1] - b[1] ]);
							if (e.right > a.right) {
								f[0] += d = (a.right - e.right);
								e.left += d
							}
							if (e.left < a.left) {
								f[0] += (a.left - e.left)
							}
							if (e.bottom > a.bottom) {
								f[1] += d = (a.bottom - e.bottom);
								e.top += d
							}
							if (e.top < a.top) {
								f[1] += (a.top - e.top)
							}
							return f
						}
					}
				});
Ext
		.define(
				"Ext.util.ComponentDragger",
				{
					extend : "Ext.dd.DragTracker",
					autoStart : 500,
					constructor : function(a, b) {
						this.comp = a;
						this.initialConstrainTo = b.constrainTo;
						this.parent([ b ])
					},
					onStart : function(d) {
						var b = this, a = b.comp;
						this.startPosition = a.getPosition();
						if (a.ghost && !a.liveDrag) {
							b.proxy = a.ghost();
							b.dragTarget = b.proxy.header.el
						}
						if (b.constrain || b.constrainDelegate) {
							b.constrainTo = b.calculateConstrainRegion()
						}
					},
					calculateConstrainRegion : function() {
						var d = this, a = d.comp, g = d.initialConstrainTo, e, f, b = a.el.shadow
								&& a.el.shadow.offset;
						if (!(g instanceof Ext.util.Region)) {
							g = Ext.fly(g).getViewRegion()
						}
						if (b) {
							g.adjust(0, -b, -b, b)
						}
						if (!d.constrainDelegate) {
							e = Ext.fly(d.dragTarget).getRegion();
							f = d.proxy ? d.proxy.el.getRegion() : a.el
									.getRegion();
							g.adjust(e.top - f.top, e.right - f.right, e.bottom
									- f.bottom, e.left - f.left)
						}
						return g
					},
					onDrag : function(f) {
						var d = this, a = d.comp, g = d.getOffset(d.constrain
								|| d.constrainDelegate ? "dragTarget" : null), b = [
								d.startPosition[0] + g[0],
								d.startPosition[1] + g[1] ];
						if (this.proxy && !this.comp.liveDrag) {
							d.proxy.setPosition(b)
						} else {
							a.setPosition(b)
						}
					},
					onEnd : function(a) {
						if (this.proxy && !this.comp.liveDrag) {
							this.comp.unghost()
						}
						(this.comp.isXType("window")) && this.comp.saveState()
					}
				});
Ext.define("Ext.fx.Manager",
		{
			singleton : true,
			requires : [ "Ext.util.MixedCollection" ],
			constructor : function() {
				this.items = new Ext.util.MixedCollection()
			},
			interval : 16,
			forceJS : false,
			createTarget : function(b) {
				var a = !this.forceJS && Ext.supports.Transitions;
				this.useCSS3 = a;
				if (typeof b == "string") {
					b = Ext.get(b)
				} else {
					if (b.tagName) {
						b = Ext.get(b)
					}
				}
				if (Ext.isObject(b)) {
					if (b.dom) {
						return Ext.create("Ext.fx.target.Element"
								+ (a ? "CSS" : ""), b)
					} else {
						if (b.isComposite) {
							return Ext.create("Ext.fx.target.CompositeElement"
									+ (a ? "CSS" : ""), b)
						} else {
							if (b.isSprite) {
								return Ext.create("Ext.fx.target.Sprite", b)
							} else {
								if (b.isSpriteGroup) {
									return Ext.create(
											"Ext.fx.target.SpriteGroup", b)
								} else {
									if (b.isComponent) {
										return Ext.create(
												"Ext.fx.target.Component", b)
									} else {
										if (b.isAnimTarget) {
											return b
										} else {
											return null
										}
									}
								}
							}
						}
					}
				} else {
					return null
				}
			},
			addAnim : function(d) {
				var b = this.items, a = this.task;
				b.add(d);
				if (!a && b.length) {
					a = this.task = {
						run : this.runner,
						interval : this.interval,
						scope : this
					};
					Ext.TaskMgr.start(a)
				}
			},
			removeAnim : function(d) {
				var b = this.items, a = this.task;
				b.remove(d);
				if (a && !b.length) {
					Ext.TaskMgr.stop(a);
					delete this.task
				}
			},
			startingFilter : function(a) {
				return a.paused === false && a.running === false
						&& a.iterations > 0
			},
			runningFilter : function(a) {
				return a.paused === false && a.running === true
			},
			runner : function() {
				var a = this.items;
				this.targetData = {};
				this.targetArr = {};
				this.timestamp = new Date();
				a.filterBy(this.startingFilter).each(this.startAnim, this);
				a.filterBy(this.runningFilter).each(this.runAnim, this);
				this.applyPendingAttrs()
			},
			startAnim : function(a) {
				a.start(this.timestamp)
			},
			runAnim : function(d) {
				var a = d.target.getId(), f = this.useCSS3
						&& d.target.type == "element", b = this.timestamp
						- d.startTime, e, g;
				this.collectTargetData(d, b, f);
				if (f) {
					d.target.setAttr(this.targetData[a], true);
					this.targetData[a] = [];
					this.collectTargetData(d, d.duration, f);
					d.paused = true;
					e = d.target.target;
					if (d.target.isComposite) {
						e = d.target.target.last()
					}
					g = {};
					g[Ext.supports.CSS3TransitionEnd] = d.lastFrame;
					g.scope = d;
					g.single = true;
					e.on(g)
				} else {
					if (b >= d.duration) {
						this.applyPendingAttrs();
						delete this.targetData[a];
						delete this.targetArr[a];
						d.lastFrame()
					}
				}
			},
			collectTargetData : function(e, d, f) {
				var a = e.target.getId(), g = this.targetData[a], b;
				if (!g) {
					g = this.targetData[a] = [];
					this.targetArr[a] = e.target
				}
				b = {
					duration : e.duration,
					easing : (f && e.reverse) ? e.easingFn.reverse().toCSS3()
							: e.easing,
					attrs : {}
				};
				Ext.apply(b.attrs, e.runAnim(d));
				g.push(b)
			},
			applyPendingAttrs : function() {
				var d = this.targetData, b = this.targetArr, a;
				for (a in d) {
					if (d.hasOwnProperty(a)) {
						b[a].setAttr(d[a], false)
					}
				}
			}
		});
Ext
		.define(
				"Ext.fx.Animator",
				{
					mixins : {
						observable : "Ext.util.Observable"
					},
					requires : [ "Ext.fx.Manager" ],
					duration : 250,
					delay : 0,
					easing : "ease",
					damper : 1,
					iterations : 1,
					keyframeStep : 0,
					animKeyFramesRE : /^(from|to|\d+%?)$/,
					constructor : function(a) {
						a = Ext.apply(this, a || {});
						this.config = a;
						this.id = Ext.id(null, "ext-animator-");
						this.addEvents("beforeanimate", "keyframe",
								"afteranimate");
						this.mixins.observable.constructor.call(this, a);
						this.timeline = [];
						this.createTimeline(this.keyframes);
						if (this.target) {
							this.applyAnimator(this.target)
						}
					},
					sorter : function(e, d) {
						return e.pct - d.pct
					},
					createTimeline : function(g) {
						var m = [], h, k = this.to || {}, n, a, f, j, l, d, e, b = this.duration;
						if (g.isPseudoEasing) {
							this.isPseudoEasing = true
						}
						for (l in g) {
							if (g.hasOwnProperty(l)
									&& this.animKeyFramesRE.test(l)) {
								h = {
									attrs : Ext.apply(g[l], k)
								};
								if (l == "from") {
									l = 0
								} else {
									if (l == "to") {
										l = 100
									}
								}
								h.pct = parseInt(l, 10);
								m.push(h)
							}
						}
						m.sort(this.sorter);
						j = m.length;
						for (f = 0; f < j; f++) {
							n = (m[f - 1]) ? b * (m[f - 1].pct / 100) : 0;
							a = b * (m[f].pct / 100);
							this.timeline.push({
								duration : a - n,
								attrs : m[f].attrs
							})
						}
					},
					applyAnimator : function(g) {
						g = Ext.fx.Manager.createTarget(g);
						var l = [], b, o = this.timeline, h = this.reverse, e = this.isPseudoEasing, k = o.length, j, a, f, n, m, d;
						if (this.fireEvent("beforeanimate", this) !== false) {
							for (d = 0; d < k; d++) {
								b = o[d];
								n = b.attrs;
								j = n.easing || this.easing;
								a = n.damper || this.damper;
								delete n.easing;
								delete n.damper;
								b = new Ext.fx.Anim({
									target : g,
									easing : j,
									damper : a,
									initialFrom : e && f,
									duration : b.duration,
									reverse : h,
									paused : true,
									from : m,
									to : n
								});
								if (!d) {
									b.initAttrs();
									f = b.currentAttrs
								}
								if (!e) {
									m = Ext.apply({}, n, m)
								}
								l.push(b)
							}
							if (h) {
								l.reverse()
							}
							for (d = 0; d < k - 1; d++) {
								b = l[d];
								b.nextAnim = l[d + 1];
								b.on("afteranimate", function() {
									this.nextAnim.paused = false
								});
								b.on("afteranimate", function() {
									this.fireEvent("keyframe", this,
											++this.keyframeStep)
								}, this)
							}
							l[k - 1].on("afteranimate", function() {
								this.fireEvent("afteranimate", this,
										this.startTime, new Date()
												- this.startTime)
							}, this);
							Ext.defer(function(i) {
								this.startAnimator(i)
							}, this.delay, this, [ l[0] ])
						}
					},
					startAnimator : function(a) {
						this.startTime = new Date();
						a.paused = false
					}
				});
Ext.define("Ext.fx.PseudoEasing", {
	singleton : true,
	"back-in" : {
		isPseudoEasing : true,
		"40%" : {
			easing : "ease-in-out",
			damper : -0.1
		},
		"100%" : {
			easing : "ease-in",
			damper : 1.1
		}
	},
	"back-out" : {
		isPseudoEasing : true,
		"60%" : {
			easing : "ease-out",
			damper : 1.1
		},
		"100%" : {
			easing : "ease-in-out",
			damper : -0.1
		}
	},
	"bounce-out" : {
		isPseudoEasing : true,
		"36%" : {
			easing : "ease-in",
			damper : 1
		},
		"54%" : {
			easing : "ease-out",
			damper : -0.25
		},
		"72%" : {
			easing : "ease-in",
			damper : 0.25
		},
		"81%" : {
			easing : "ease-out",
			damper : -0.0625
		},
		"90%" : {
			easing : "ease-in",
			damper : 0.0625
		},
		"95%" : {
			easing : "ease-out",
			damper : -0.015
		},
		"100%" : {
			easing : "ease-in",
			damper : 0.015
		}
	},
	"bounce-in" : {
		isPseudoEasing : true,
		"5%" : {
			easing : "ease-in",
			damper : 0.015
		},
		"10%" : {
			easing : "ease-out",
			damper : -0.015
		},
		"19%" : {
			easing : "ease-in",
			damper : 0.0625
		},
		"28%" : {
			easing : "ease-out",
			damper : -0.0625
		},
		"46%" : {
			easing : "ease-in",
			damper : 0.25
		},
		"64%" : {
			easing : "ease-out",
			damper : -0.25
		},
		"100%" : {
			easing : "ease-in",
			damper : 1
		}
	},
	"elastic-in" : {
		isPseudoEasing : true,
		"14%" : {
			easing : "ease-in",
			damper : 0.005
		},
		"29%" : {
			easing : "ease-in-out",
			damper : -0.015
		},
		"43%" : {
			easing : "ease-in-out",
			damper : 0.025
		},
		"57%" : {
			easing : "ease-in-out",
			damper : -0.065
		},
		"71%" : {
			easing : "ease-in-out",
			damper : 0.19
		},
		"86%" : {
			easing : "ease-in-out",
			damper : -0.51
		},
		"100%" : {
			easing : "ease-out",
			damper : 1.37
		}
	},
	"elastic-out" : {
		isPseudoEasing : true,
		"14%" : {
			easing : "ease-in",
			damper : 1.37
		},
		"29%" : {
			easing : "ease-in-out",
			damper : -0.51
		},
		"43%" : {
			easing : "ease-in-out",
			damper : 0.19
		},
		"57%" : {
			easing : "ease-in-out",
			damper : -0.065
		},
		"71%" : {
			easing : "ease-in-out",
			damper : 0.025
		},
		"86%" : {
			easing : "ease-in-out",
			damper : -0.015
		},
		"100%" : {
			easing : "ease-out",
			damper : 0.005
		}
	}
});
Ext.define("Ext.fx.CubicBezier", {
	singleton : true,
	cubicBezierAtTime : function(o, e, b, n, m, i) {
		var j = 3 * e, l = 3 * (n - e) - j, a = 1 - j - l, h = 3 * b, k = 3
				* (m - b) - h, p = 1 - h - k;
		function g(q) {
			return ((a * q + l) * q + j) * q
		}
		function d(q, s) {
			var r = f(q, s);
			return ((p * r + k) * r + h) * r
		}
		function f(q, z) {
			var w, v, t, r, u, s;
			for (t = q, s = 0; s < 8; s++) {
				r = g(t) - q;
				if (Math.abs(r) < z) {
					return t
				}
				u = (3 * a * t + 2 * l) * t + j;
				if (Math.abs(u) < 0.000001) {
					break
				}
				t = t - r / u
			}
			w = 0;
			v = 1;
			t = q;
			if (t < w) {
				return w
			}
			if (t > v) {
				return v
			}
			while (w < v) {
				r = g(t);
				if (Math.abs(r - q) < z) {
					return t
				}
				if (q > r) {
					w = t
				} else {
					v = t
				}
				t = (v - w) / 2 + w
			}
			return t
		}
		return d(o, 1 / (200 * i))
	},
	cubicBezier : function(b, f, a, d) {
		var e = function(g) {
			return Ext.fx.CubicBezier.cubicBezierAtTime(g, b, f, a, d, 1)
		};
		e.toCSS3 = function() {
			return "cubic-bezier(" + [ b, f, a, d ].join(",") + ")"
		};
		e.reverse = function() {
			return Ext.fx.CubicBezier.cubicBezier(1 - a, 1 - d, 1 - b, 1 - f)
		};
		return e
	}
});
Ext.ns("Ext.fx");
Ext.require("Ext.fx.CubicBezier", function() {
	Ext.fx.Easing = {
		ease : Ext.fx.CubicBezier.cubicBezier(0.25, 0.1, 0.25, 1),
		linear : Ext.fx.CubicBezier.cubicBezier(0, 0, 1, 1),
		"ease-in" : Ext.fx.CubicBezier.cubicBezier(0.42, 0, 1, 1),
		"ease-out" : Ext.fx.CubicBezier.cubicBezier(0, 0.58, 1, 1),
		"ease-in-out" : Ext.fx.CubicBezier.cubicBezier(0.42, 0, 0.58, 1)
	}
});
Ext
		.define(
				"Ext.draw.Draw",
				{
					singleton : true,
					requires : [ "Ext.draw.Color" ],
					pathToStringRE : /,?([achlmqrstvxz]),?/gi,
					pathCommandRE : /([achlmqstvz])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/ig,
					pathValuesRE : /(-?\d*\.?\d*(?:e[-+]?\d+)?)\s*,?\s*/ig,
					stopsRE : /^(\d+%?)$/,
					radian : Math.PI / 180,
					availableAnimAttrs : {
						along : "along",
						blur : null,
						"clip-rect" : "csv",
						cx : null,
						cy : null,
						fill : "colour",
						"fill-opacity" : null,
						"font-size" : null,
						height : null,
						opacity : null,
						path : "path",
						r : null,
						rotation : "csv",
						rx : null,
						ry : null,
						scale : "csv",
						stroke : "colour",
						"stroke-opacity" : null,
						"stroke-width" : null,
						translation : "csv",
						width : null,
						x : null,
						y : null
					},
					is : function(b, a) {
						a = String(a).toLowerCase();
						return (a == "object" && b === Object(b))
								|| (a == "undefined" && typeof b == a)
								|| (a == "null" && b == null)
								|| (a == "array" && Array.isArray && Array
										.isArray(b))
								|| (Object.prototype.toString.call(b)
										.toLowerCase().slice(8, -1)) == a
					},
					ellipsePath : function(b) {
						var a = b.attr;
						return Ext.String
								.format(
										"M{0},{1}A{2},{3},0,1,1,{0},{4}A{2},{3},0,1,1,{0},{1}z",
										a.x, a.y - a.ry, a.rx, a.ry, a.y + a.ry)
					},
					rectPath : function(b) {
						var a = b.attr;
						if (a.radius) {
							return Ext.String
									.format(
											"M{0},{1}l{2},0a{3},{3},0,0,1,{3},{3}l0,{5}a{3},{3},0,0,1,{4},{3}l{6},0a{3},{3},0,0,1,{4},{4}l0,{7}a{3},{3},0,0,1,{3},{4}z",
											a.x + a.radius, a.y, a.width
													- a.radius * 2, a.radius,
											-a.radius, a.height - a.radius * 2,
											a.radius * 2 - a.width, a.radius
													* 2 - a.height)
						} else {
							return Ext.String.format(
									"M{0},{1}l{2},0,0,{3},{4},0z", a.x, a.y,
									a.width, a.height, -a.width)
						}
					},
					path2string : function() {
						return this.join(",").replace(
								Ext.draw.Draw.pathToStringRE, "$1")
					},
					parsePathString : function(a) {
						if (!a) {
							return null
						}
						var e = {
							a : 7,
							c : 6,
							h : 1,
							l : 2,
							m : 2,
							q : 4,
							s : 4,
							t : 2,
							v : 1,
							z : 0
						}, d = [], b = this;
						if (b.is(a, "array") && b.is(a[0], "array")) {
							d = b.pathClone(a)
						}
						if (!d.length) {
							String(a).replace(
									b.pathCommandRE,
									function(g, f, j) {
										var i = [], h = f.toLowerCase();
										j.replace(b.pathValuesRE,
												function(l, k) {
													k && i.push(+k)
												});
										if (h == "m" && i.length > 2) {
											d
													.push([ f ].concat(i
															.splice(0, 2)));
											h = "l";
											f = (f == "m") ? "l" : "L"
										}
										while (i.length >= e[h]) {
											d.push([ f ].concat(i.splice(0,
													e[h])));
											if (!e[h]) {
												break
											}
										}
									})
						}
						d.toString = b.path2string;
						return d
					},
					mapPath : function(g, b) {
						if (!b) {
							return g
						}
						var a, h, e, d, f;
						g = this.path2curve(g);
						for (e = 0, ii = g.length; e < ii; e++) {
							f = g[e];
							for (d = 1, jj = f.length; d < jj - 1; d += 2) {
								a = b.x(f[d], f[d + 1]);
								h = b.y(f[d], f[d + 1]);
								f[d] = a;
								f[d + 1] = h
							}
						}
						return g
					},
					pathClone : function(g) {
						var d = [], a, f, b, e;
						if (!this.is(g, "array")
								|| !this.is(g && g[0], "array")) {
							g = this.parsePathString(g)
						}
						for (b = 0, e = g.length; b < e; b++) {
							d[b] = [];
							for (a = 0, f = g[b].length; a < f; a++) {
								d[b][a] = g[b][a]
							}
						}
						d.toString = this.path2string;
						return d
					},
					pathToAbsolute : function(e) {
						if (!this.is(e, "array")
								|| !this.is(e && e[0], "array")) {
							e = this.parsePathString(e)
						}
						var m = [], o = 0, n = 0, s = 0, q = 0, d = 0, h, t, a, p, g, l, f, b;
						if (e[0][0] == "M") {
							o = +e[0][1];
							n = +e[0][2];
							s = o;
							q = n;
							d++;
							m[0] = [ "M", o, n ]
						}
						for (h = d, t = e.length; h < t; h++) {
							a = m[h] = [];
							p = e[h];
							if (p[0] != p[0].toUpperCase()) {
								a[0] = p[0].toUpperCase();
								switch (a[0]) {
								case "A":
									a[1] = p[1];
									a[2] = p[2];
									a[3] = p[3];
									a[4] = p[4];
									a[5] = p[5];
									a[6] = +(p[6] + o);
									a[7] = +(p[7] + n);
									break;
								case "V":
									a[1] = +p[1] + n;
									break;
								case "H":
									a[1] = +p[1] + o;
									break;
								case "M":
									s = +p[1] + o;
									q = +p[2] + n;
								default:
									for (g = 1, l = p.length; g < l; g++) {
										a[g] = +p[g] + ((g % 2) ? o : n)
									}
								}
							} else {
								for (f = 0, b = p.length; f < b; f++) {
									m[h][f] = p[f]
								}
							}
							switch (a[0]) {
							case "Z":
								o = s;
								n = q;
								break;
							case "H":
								o = a[1];
								break;
							case "V":
								n = a[1];
								break;
							case "M":
								s = m[h][m[h].length - 2];
								q = m[h][m[h].length - 1];
							default:
								o = m[h][m[h].length - 2];
								n = m[h][m[h].length - 1]
							}
						}
						m.toString = this.path2string;
						return m
					},
					pathToRelative : function(e) {
						if (!this.is(e, "array")
								|| !this.is(e && e[0], "array")) {
							e = this.parsePathString(e)
						}
						var n = [], p = 0, o = 0, t = 0, s = 0, d = 0;
						if (e[0][0] == "M") {
							p = e[0][1];
							o = e[0][2];
							t = p;
							s = o;
							d++;
							n.push([ "M", p, o ])
						}
						for (var h = d, u = e.length; h < u; h++) {
							var a = n[h] = [], q = e[h];
							if (q[0] != q[0].toLowerCase()) {
								a[0] = q[0].toLowerCase();
								switch (a[0]) {
								case "a":
									a[1] = q[1];
									a[2] = q[2];
									a[3] = q[3];
									a[4] = q[4];
									a[5] = q[5];
									a[6] = +(q[6] - p).toFixed(3);
									a[7] = +(q[7] - o).toFixed(3);
									break;
								case "v":
									a[1] = +(q[1] - o).toFixed(3);
									break;
								case "m":
									t = q[1];
									s = q[2];
								default:
									for (var g = 1, l = q.length; g < l; g++) {
										a[g] = +(q[g] - ((g % 2) ? p : o))
												.toFixed(3)
									}
								}
							} else {
								a = n[h] = [];
								if (q[0] == "m") {
									t = q[1] + p;
									s = q[2] + o
								}
								for (var f = 0, b = q.length; f < b; f++) {
									n[h][f] = q[f]
								}
							}
							var m = n[h].length;
							switch (n[h][0]) {
							case "z":
								p = t;
								o = s;
								break;
							case "h":
								p += +n[h][m - 1];
								break;
							case "v":
								o += +n[h][m - 1];
								break;
							default:
								p += +n[h][m - 2];
								o += +n[h][m - 1]
							}
						}
						n.toString = this.path2string;
						return n
					},
					path2curve : function(k) {
						var e = this, h = e.pathToAbsolute(k), d = h.length, j = {
							x : 0,
							y : 0,
							bx : 0,
							by : 0,
							X : 0,
							Y : 0,
							qx : null,
							qy : null
						}, b, a, g, f;
						for (b = 0; b < d; b++) {
							h[b] = e.command2curve(h[b], j);
							if (h[b].length > 7) {
								h[b].shift();
								f = h[b];
								while (f.length) {
									h.splice(b++, 0, [ "C" ].concat(f.splice(0,
											6)))
								}
								h.splice(b, 1);
								d = h.length
							}
							a = h[b];
							g = a.length;
							j.x = a[g - 2];
							j.y = a[g - 1];
							j.bx = parseFloat(a[g - 4]) || j.x;
							j.by = parseFloat(a[g - 3]) || j.y
						}
						return h
					},
					interpolatePaths : function(r, l) {
						var j = this, e = j.pathToAbsolute(r), m = j
								.pathToAbsolute(l), n = {
							x : 0,
							y : 0,
							bx : 0,
							by : 0,
							X : 0,
							Y : 0,
							qx : null,
							qy : null
						}, a = {
							x : 0,
							y : 0,
							bx : 0,
							by : 0,
							X : 0,
							Y : 0,
							qx : null,
							qy : null
						}, b = function(p, s) {
							if (p[s].length > 7) {
								p[s].shift();
								var t = p[s];
								while (t.length) {
									p.splice(s++, 0, [ "C" ].concat(t.splice(0,
											6)))
								}
								p.splice(s, 1);
								o = Math.max(e.length, m.length || 0)
							}
						}, d = function(v, u, s, p, t) {
							if (v && u && v[t][0] == "M" && u[t][0] != "M") {
								u.splice(t, 0, [ "M", p.x, p.y ]);
								s.bx = 0;
								s.by = 0;
								s.x = v[t][1];
								s.y = v[t][2];
								o = Math.max(e.length, m.length || 0)
							}
						};
						for (var h = 0, o = Math.max(e.length, m.length || 0); h < o; h++) {
							e[h] = j.command2curve(e[h], n);
							b(e, h);
							(m[h] = j.command2curve(m[h], a));
							b(m, h);
							d(e, m, n, a, h);
							d(m, e, a, n, h);
							var g = e[h], q = m[h], f = g.length, k = q.length;
							n.x = g[f - 2];
							n.y = g[f - 1];
							n.bx = parseFloat(g[f - 4]) || n.x;
							n.by = parseFloat(g[f - 3]) || n.y;
							a.bx = (parseFloat(q[k - 4]) || a.x);
							a.by = (parseFloat(q[k - 3]) || a.y);
							a.x = q[k - 2];
							a.y = q[k - 1]
						}
						return [ e, m ]
					},
					command2curve : function(e, b) {
						var a = this;
						if (!e) {
							return [ "C", b.x, b.y, b.x, b.y, b.x, b.y ]
						}
						if (e[0] != "T" && e[0] != "Q") {
							b.qx = b.qy = null
						}
						switch (e[0]) {
						case "M":
							b.X = e[1];
							b.Y = e[2];
							break;
						case "A":
							e = [ "C" ].concat(a.arc2curve.apply(a,
									[ b.x, b.y ].concat(e.slice(1))));
							break;
						case "S":
							e = [ "C", b.x + (b.x - (b.bx || b.x)),
									b.y + (b.y - (b.by || b.y)) ].concat(e
									.slice(1));
							break;
						case "T":
							b.qx = b.x + (b.x - (b.qx || b.x));
							b.qy = b.y + (b.y - (b.qy || b.y));
							e = [ "C" ].concat(a.quadratic2curve(b.x, b.y,
									b.qx, b.qy, e[1], e[2]));
							break;
						case "Q":
							b.qx = e[1];
							b.qy = e[2];
							e = [ "C" ].concat(a.quadratic2curve(b.x, b.y,
									e[1], e[2], e[3], e[4]));
							break;
						case "L":
							e = [ "C" ]
									.concat(b.x, b.y, e[1], e[2], e[1], e[2]);
							break;
						case "H":
							e = [ "C" ].concat(b.x, b.y, e[1], b.y, e[1], b.y);
							break;
						case "V":
							e = [ "C" ].concat(b.x, b.y, b.x, e[1], b.x, e[1]);
							break;
						case "Z":
							e = [ "C" ].concat(b.x, b.y, b.X, b.Y, b.X, b.Y);
							break
						}
						return e
					},
					quadratic2curve : function(b, e, h, f, a, d) {
						var g = 1 / 3, i = 2 / 3;
						return [ g * b + i * h, g * e + i * f, g * a + i * h,
								g * d + i * f, a, d ]
					},
					rotate : function(b, h, a) {
						var e = Math.cos(a), d = Math.sin(a), g = b * e - h * d, f = b
								* d + h * e;
						return {
							x : g,
							y : f
						}
					},
					arc2curve : function(v, ai, J, H, B, o, j, u, ah, C) {
						var z = this, f = Math.PI, A = z.radian, G = f * 120 / 180, b = A
								* (+B || 0), O = [], L = Math, W = L.cos, a = L.sin, Y = L.sqrt, w = L.abs, p = L.asin, K, d, r, Q, P, ad, e, U, X, E, D, n, m, s, l, ag, g, af, S, V, T, ae, ac, ab, Z, N, aa, M, F, I, q;
						if (!C) {
							K = z.rotate(v, ai, -b);
							v = K.x;
							ai = K.y;
							K = z.rotate(u, ah, -b);
							u = K.x;
							ah = K.y;
							d = W(A * B);
							r = a(A * B);
							Q = (v - u) / 2;
							P = (ai - ah) / 2;
							ad = (Q * Q) / (J * J) + (P * P) / (H * H);
							if (ad > 1) {
								ad = Y(ad);
								J = ad * J;
								H = ad * H
							}
							e = J * J;
							U = H * H;
							X = (o == j ? -1 : 1)
									* Y(w((e * U - e * P * P - U * Q * Q)
											/ (e * P * P + U * Q * Q)));
							E = X * J * P / H + (v + u) / 2;
							D = X * -H * Q / J + (ai + ah) / 2;
							n = p(((ai - D) / H).toFixed(7));
							m = p(((ah - D) / H).toFixed(7));
							n = v < E ? f - n : n;
							m = u < E ? f - m : m;
							if (n < 0) {
								n = f * 2 + n
							}
							if (m < 0) {
								m = f * 2 + m
							}
							if (j && n > m) {
								n = n - f * 2
							}
							if (!j && m > n) {
								m = m - f * 2
							}
						} else {
							n = C[0];
							m = C[1];
							E = C[2];
							D = C[3]
						}
						s = m - n;
						if (w(s) > G) {
							F = m;
							I = u;
							q = ah;
							m = n + G * (j && m > n ? 1 : -1);
							u = E + J * W(m);
							ah = D + H * a(m);
							O = z.arc2curve(u, ah, J, H, B, 0, j, I, q, [ m, F,
									E, D ])
						}
						s = m - n;
						l = W(n);
						ag = a(n);
						g = W(m);
						af = a(m);
						S = L.tan(s / 4);
						V = 4 / 3 * J * S;
						T = 4 / 3 * H * S;
						ae = [ v, ai ];
						ac = [ v + V * ag, ai - T * l ];
						ab = [ u + V * af, ah - T * g ];
						Z = [ u, ah ];
						ac[0] = 2 * ae[0] - ac[0];
						ac[1] = 2 * ae[1] - ac[1];
						if (C) {
							return [ ac, ab, Z ].concat(O)
						} else {
							O = [ ac, ab, Z ].concat(O).join().split(",");
							N = [];
							M = O.length;
							for (aa = 0; aa < M; aa++) {
								N[aa] = aa % 2 ? z.rotate(O[aa - 1], O[aa], b).y
										: z.rotate(O[aa], O[aa + 1], b).x
							}
							return N
						}
					},
					rotatePoint : function(b, h, f, a, g) {
						if (!f) {
							return {
								x : b,
								y : h
							}
						}
						a = a || 0;
						g = g || 0;
						b = b - a;
						h = h - g;
						f = f * this.radian;
						var e = Math.cos(f), d = Math.sin(f);
						return {
							x : b * e - h * d + a,
							y : b * d + h * e + g
						}
					},
					rotateAndTranslatePath : function(k) {
						var d = k.rotation.degrees, e = k.rotation.x, b = k.rotation.y, o = k.translation.x, l = k.translation.y, n, g, a, m, f, h = [];
						if (!d && !o && !l) {
							return this.pathToAbsolute(k.attr.path)
						}
						o = o || 0;
						l = l || 0;
						n = this.pathToAbsolute(k.attr.path);
						for (g = n.length; g--;) {
							a = h[g] = n[g].slice();
							if (a[0] == "A") {
								m = this.rotatePoint(a[6], a[7], d, e, b);
								a[6] = m.x + o;
								a[7] = m.y + l
							} else {
								f = 1;
								while (a[f + 1] != null) {
									m = this.rotatePoint(a[f], a[f + 1], d, e,
											b);
									a[f] = m.x + o;
									a[f + 1] = m.y + l;
									f += 2
								}
							}
						}
						return h
					},
					pathDimensions : function(m) {
						if (!m || !(m + "")) {
							return {
								x : 0,
								y : 0,
								width : 0,
								height : 0
							}
						}
						m = this.path2curve(m);
						var j = 0, h = 0, e = [], b = [], d, f, l, a, k, g;
						for (f = 0, l = m.length; f < l; f++) {
							d = m[f];
							if (d[0] == "M") {
								j = d[1];
								h = d[2];
								e.push(j);
								b.push(h)
							} else {
								g = this.curveDim(j, h, d[1], d[2], d[3], d[4],
										d[5], d[6]);
								e = e.concat(g.min.x, g.max.x);
								b = b.concat(g.min.y, g.max.y);
								j = d[5];
								h = d[6]
							}
						}
						a = Math.min.apply(0, e);
						k = Math.min.apply(0, b);
						return {
							x : a,
							y : k,
							width : Math.max.apply(0, e) - a,
							height : Math.max.apply(0, b) - k
						}
					},
					curveDim : function(f, d, h, g, s, r, o, l) {
						var q = (s - 2 * h + f) - (o - 2 * s + h), n = 2
								* (h - f) - 2 * (s - h), k = f - h, j = (-n + Math
								.sqrt(n * n - 4 * q * k))
								/ 2 / q, i = (-n - Math.sqrt(n * n - 4 * q * k))
								/ 2 / q, m = [ d, l ], p = [ f, o ], e;
						Math.abs(j) > 1000000000000 && (j = 0.5);
						Math.abs(i) > 1000000000000 && (i = 0.5);
						if (j > 0 && j < 1) {
							e = this
									.findDotAtSegment(f, d, h, g, s, r, o, l, j);
							p.push(e.x);
							m.push(e.y)
						}
						if (i > 0 && i < 1) {
							e = this
									.findDotAtSegment(f, d, h, g, s, r, o, l, i);
							p.push(e.x);
							m.push(e.y)
						}
						q = (r - 2 * g + d) - (l - 2 * r + g);
						n = 2 * (g - d) - 2 * (r - g);
						k = d - g;
						j = (-n + Math.sqrt(n * n - 4 * q * k)) / 2 / q;
						i = (-n - Math.sqrt(n * n - 4 * q * k)) / 2 / q;
						Math.abs(j) > 1000000000000 && (j = 0.5);
						Math.abs(i) > 1000000000000 && (i = 0.5);
						if (j > 0 && j < 1) {
							e = this
									.findDotAtSegment(f, d, h, g, s, r, o, l, j);
							p.push(e.x);
							m.push(e.y)
						}
						if (i > 0 && i < 1) {
							e = this
									.findDotAtSegment(f, d, h, g, s, r, o, l, i);
							p.push(e.x);
							m.push(e.y)
						}
						return {
							min : {
								x : Math.min.apply(0, p),
								y : Math.min.apply(0, m)
							},
							max : {
								x : Math.max.apply(0, p),
								y : Math.max.apply(0, m)
							}
						}
					},
					getAnchors : function(e, d, q, o, j, h, t) {
						t = t || 4;
						var f = Math.min(Math.sqrt(Math.pow(e - q, 2)
								+ Math.pow(d - o, 2))
								/ t, Math.sqrt(Math.pow(j - q, 2)
								+ Math.pow(h - o, 2))
								/ t), r = Math.atan((q - e) / Math.abs(o - d)), p = Math
								.atan((j - q) / Math.abs(o - h)), m = Math.PI;
						r = d < o ? m - r : r;
						p = h < o ? m - p : p;
						var g = m / 2 - ((r + p) % (m * 2)) / 2;
						g > m / 2 && (g -= m);
						var u = f * Math.sin(g + r), n = f * Math.cos(g + r), s = f
								* Math.sin(g + p), k = f * Math.cos(g + p), i = {
							x1 : q - u,
							y1 : o + n,
							x2 : q + s,
							y2 : o + k
						};
						return i
					},
					smooth : function(a, r) {
						var q = this.path2curve(a), f = [ q[0] ], k = q[0][1], h = q[0][2], s, u, v = 1, l = q.length, g = 1, n = k, m = h, d = 0, b = 0;
						for (; v < l; v++) {
							var A = q[v], z = A.length, w = q[v - 1], o = w.length, t = q[v + 1], p = t
									&& t.length;
							if (A[0] == "M") {
								n = A[1];
								m = A[2];
								s = v + 1;
								while (q[s][0] != "C") {
									s++
								}
								d = q[s][5];
								b = q[s][6];
								f.push([ "M", n, m ]);
								g = f.length;
								k = n;
								h = m;
								continue
							}
							if (A[z - 2] == n && A[z - 1] == m
									&& (!t || t[0] == "M")) {
								var e = f[g].length;
								u = this.getAnchors(w[o - 2], w[o - 1], n, m,
										f[g][e - 2], f[g][e - 1], r);
								f[g][1] = u.x2;
								f[g][2] = u.y2
							} else {
								if (!t || t[0] == "M") {
									u = {
										x1 : A[z - 2],
										y1 : A[z - 1]
									}
								} else {
									u = this.getAnchors(w[o - 2], w[o - 1],
											A[z - 2], A[z - 1], t[p - 2],
											t[p - 1], r)
								}
							}
							f
									.push([ "C", k, h, u.x1, u.y1, A[z - 2],
											A[z - 1] ]);
							k = u.x2;
							h = u.y2
						}
						return f
					},
					findDotAtSegment : function(b, a, e, d, j, i, h, g, k) {
						var f = 1 - k;
						return {
							x : Math.pow(f, 3) * b + Math.pow(f, 2) * 3 * k * e
									+ f * 3 * k * k * j + Math.pow(k, 3) * h,
							y : Math.pow(f, 3) * a + Math.pow(f, 2) * 3 * k * d
									+ f * 3 * k * k * i + Math.pow(k, 3) * g
						}
					},
					snapEnds : function(p, q, e) {
						var d = (q - p) / e, a = Math.floor(Math.log(d)
								/ Math.LN10) + 1, f = Math.pow(10, a), r = p = Math
								.floor(p / f)
								* f, n = Math.round((d % f)
								* Math.pow(10, 2 - a)), b = [ "0:15", "20:4",
								"30:2", "40:4", "50:9", "60:4", "70:2", "80:4",
								"100:15" ], l = [], g = 0, o, j, h, k = b.length;
						for (h = 0; h < k; h++) {
							o = b[h].split(":");
							j = o[1];
							o = o[0];
							l[h] = {
								a : o,
								b : ((o - n) < 0 ? Infinity : (o - n) / j)
							}
						}
						l = l.sort(function(m, i) {
							if (!isFinite(m.b) && !isFinite(i.b)) {
								return false
							} else {
								return m.b - i.b
							}
						})[0].a;
						l = Math.floor(d * Math.pow(10, -a)) * Math.pow(10, a)
								+ l * Math.pow(10, a - 2);
						while (r < q) {
							r += l;
							g++
						}
						q = +r.toFixed(10);
						return {
							from : p,
							to : q,
							power : a,
							step : l,
							steps : g
						}
					},
					sorter : function(e, d) {
						return e.offset - d.offset
					},
					rad : function(a) {
						return a % 360 * Math.PI / 180
					},
					degrees : function(a) {
						return a * 180 / Math.PI % 360
					},
					parseGradient : function(k) {
						var f = this, g = k.type || "linear", d = k.angle || 0, i = f.radian, l = k.stops, a = [], j, b, h, e;
						if (g == "linear") {
							b = [ 0, 0, Math.cos(d * i), Math.sin(d * i) ];
							h = 1 / (Math.max(Math.abs(b[2]), Math.abs(b[3])) || 1);
							b[2] *= h;
							b[3] *= h;
							if (b[2] < 0) {
								b[0] = -b[2];
								b[2] = 0
							}
							if (b[3] < 0) {
								b[1] = -b[3];
								b[3] = 0
							}
						}
						for (j in l) {
							if (l.hasOwnProperty(j) && f.stopsRE.test(j)) {
								e = {
									offset : parseInt(j, 10),
									color : Ext.draw.Color.toHex(l[j].color)
											|| "#ffffff",
									opacity : l[j].opacity || 1
								};
								a.push(e)
							}
						}
						a.sort(f.sorter);
						if (g == "linear") {
							return {
								id : k.id,
								type : g,
								vector : b,
								stops : a
							}
						} else {
							return {
								id : k.id,
								type : g,
								centerX : k.centerX,
								centerY : k.centerY,
								focalX : k.focalX,
								focalY : k.focalY,
								radius : k.radius,
								vector : b,
								stops : a
							}
						}
					}
				});
Ext
		.define(
				"Ext.fx.PropHandler",
				{
					requires : [ "Ext.draw.Draw" ],
					statics : {
						defaultHandler : {
							unitRE : /^(-?\d*\.?\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)*$/,
							computeDelta : function(h, a, f, e) {
								f = (typeof f == "number") ? f : 1;
								var d = this.unitRE.exec(h), g, b;
								if (d) {
									h = d[1];
									b = d[2]
								}
								h = +h || 0;
								d = this.unitRE.exec(a);
								if (d) {
									a = d[1];
									b = d[2] || b
								}
								a = +a || 0;
								g = (e != null) ? e : h;
								return {
									from : h,
									delta : (a - g) * f,
									units : b
								}
							},
							get : function(n, b, a, m) {
								var f, h, l = n.length, e = [];
								for (f = 0; f < l; f++) {
									if (m) {
										h = m[f][1].from
									}
									if (Ext.isArray(n[f][1]) && Ext.isArray(b)) {
										var k = [];
										for (var d = 0, g = n[f][1].length; d < g; d++) {
											k.push(this.computeDelta(
													n[f][1][d], b[d], a, h))
										}
										e.push([ n[f][0], k ])
									} else {
										e.push([
												n[f][0],
												this.computeDelta(n[f][1], b,
														a, h) ])
									}
								}
								return e
							},
							set : function(l, g) {
								var e, h = l.length, b = [], a;
								for (e = 0; e < h; e++) {
									a = l[e][1];
									if (Ext.isArray(a)) {
										var k = [];
										for (var d = 0, f = a.length; d < f; d++) {
											k.push(a[d].from + (a[d].delta * g)
													+ (a[d].units || 0))
										}
										b.push([ l[e][0], k ])
									} else {
										b.push([
												l[e][0],
												a.from + (a.delta * g)
														+ (a.units || 0) ])
									}
								}
								return b
							}
						},
						color : {
							rgbRE : /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
							hexRE : /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
							hex3RE : /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i,
							parseColor : function(a, e) {
								e = (typeof e == "number") ? e : 1;
								var f, d = false, b;
								Ext
										.each([ this.hexRE, this.rgbRE,
												this.hex3RE ], function(h, g) {
											f = (g % 2 == 0) ? 16 : 10;
											b = h.exec(a);
											if (b && b.length == 4) {
												if (g == 2) {
													b[1] += b[1];
													b[2] += b[2];
													b[3] += b[3]
												}
												d = {
													red : parseInt(parseInt(
															b[1], f)
															* e, 10),
													green : parseInt(parseInt(
															b[2], f)
															* e, 10),
													blue : parseInt(parseInt(
															b[3], f)
															* e, 10)
												};
												return false
											}
										});
								return d || a
							},
							computeDelta : function(h, a, f, d) {
								h = this.parseColor(h);
								a = this.parseColor(a, f);
								var g = d ? d : h, b = typeof g, e = typeof a;
								if (b == "string" || b == "undefined"
										|| e == "string" || e == "undefined") {
									return a || g
								}
								return {
									from : h,
									delta : {
										red : Math.round((a.red - g.red) * f),
										green : Math.round((a.green - g.green)
												* f),
										blue : Math
												.round((a.blue - g.blue) * f)
									}
								}
							},
							get : function(j, a, g, e) {
								var f, d, h = j.length, b = [];
								for (f = 0; f < h; f++) {
									if (e) {
										d = e[f][1].from
									}
									b
											.push([
													j[f][0],
													this.computeDelta(j[f][1],
															a, g, d) ])
								}
								return b
							},
							set : function(a, h) {
								var d, e = a.length, b = [], f, g;
								for (d = 0; d < e; d++) {
									f = a[d][1];
									f = (typeof f == "object" && "red" in f) ? "rgb("
											+ f.red
											+ ", "
											+ f.green
											+ ", "
											+ f.blue + ")"
											: f;
									f = (typeof f == "object" && f.length) ? f[0]
											: f;
									if (typeof f == "undefined") {
										return []
									}
									g = typeof f == "string" ? f
											: "rgb("
													+ [
															f.from.red
																	+ parseInt(
																			f.delta.red
																					* h,
																			10),
															f.from.green
																	+ parseInt(
																			f.delta.green
																					* h,
																			10),
															f.from.blue
																	+ parseInt(
																			f.delta.blue
																					* h,
																			10) ]
															.join(",") + ")";
									b.push([ a[d][0], g ])
								}
								return b
							}
						},
						object : {
							interpolate : function(e, b) {
								b = (typeof b == "number") ? b : 1;
								var a = {};
								for ( var d in e) {
									a[d] = parseInt(e[d], 10) * b
								}
								return a
							},
							computeDelta : function(h, a, d, b) {
								h = this.interpolate(h);
								a = this.interpolate(a, d);
								var g = b ? b : h, f = {};
								for ( var e in a) {
									f[e] = a[e] - g[e]
								}
								return {
									from : h,
									delta : f
								}
							},
							get : function(j, a, g, e) {
								var f, d, h = j.length, b = [];
								for (f = 0; f < h; f++) {
									if (e) {
										d = e[f][1].from
									}
									b
											.push([
													j[f][0],
													this.computeDelta(j[f][1],
															a, g, d) ])
								}
								return b
							},
							set : function(l, g) {
								var e, h = l.length, d = [], f = {}, j, k, b;
								for (e = 0; e < h; e++) {
									b = l[e][1];
									j = b.from;
									k = b.delta;
									for ( var a in j) {
										f[a] = j[a] + parseInt(k[a] * g, 10)
									}
									d.push([ l[e][0], f ])
								}
								return d
							}
						},
						path : {
							unitRE : /^(-?\d*\.?\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)*$/,
							computeDelta : function(h, a, f, e) {
								f = (typeof f == "number") ? f : 1;
								var d = this.unitRE.exec(h), g, b;
								if (d) {
									h = d[1];
									b = d[2]
								}
								h = +h || 0;
								d = this.unitRE.exec(a);
								if (d) {
									a = d[1];
									b = d[2] || b
								}
								a = +a || 0;
								g = (e != null) ? e : h;
								return {
									from : h,
									delta : (a - g) * f,
									units : b
								}
							},
							forcePath : function(a) {
								if (!Ext.isArray(a) && !Ext.isArray(a[0])) {
									a = Ext.draw.Draw.parsePathString(a)
								}
								return a
							},
							get : function(a, h) {
								var n, m, g, q, p, b = this.forcePath(h), f, l = [], o = a.length, d, e;
								for (n = 0; n < o; n++) {
									p = this.forcePath(a[n][1]);
									f = Ext.draw.Draw.interpolatePaths(p, b);
									p = f[0];
									b = f[1];
									d = p.length;
									q = [];
									for (m = 0; m < d; m++) {
										f = [ p[m][0] ];
										e = p[m].length;
										for (g = 1; g < e; g++) {
											f.push(this.computeDelta(p[m][g],
													b[m][g]))
										}
										q.push(f)
									}
									l.push([ a[n][0], q ])
								}
								return l
							},
							set : function(p, o) {
								var h, g, d, l, m, e, a, b, n = p.length, f = [];
								for (h = 0; h < n; h++) {
									e = p[h][1];
									l = [];
									a = e.length;
									for (g = 0; g < a; g++) {
										m = [ e[g][0] ];
										b = e[g].length;
										for (d = 1; d < b; d++) {
											m.push(e[g][d].from
													+ (e[g][d].delta * o))
										}
										l.push(m.join(","))
									}
									f.push([ p[h][0], l.join(",") ])
								}
								return f
							}
						}
					}
				}, function() {
					Ext.each([ "outlineColor", "backgroundColor",
							"borderColor", "borderTopColor",
							"borderRightColor", "borderBottomColor",
							"borderLeftColor", "fill", "stroke" ], function(a) {
						this[a] = this.color
					}, this)
				});
Ext
		.define(
				"Ext.fx.Anim",
				{
					mixins : {
						observable : "Ext.util.Observable"
					},
					requires : [ "Ext.fx.Manager", "Ext.fx.Animator",
							"Ext.fx.PseudoEasing", "Ext.fx.Easing",
							"Ext.fx.CubicBezier", "Ext.fx.PropHandler" ],
					isAnimation : true,
					duration : 250,
					delay : 0,
					easing : "ease",
					damper : 1,
					bezierRE : /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
					reverse : false,
					running : false,
					paused : false,
					iterations : 1,
					alternate : false,
					currentIteration : 0,
					startTime : 0,
					elapsedTime : 0,
					propHandlers : {},
					constructor : function(a) {
						if (a.keyframes) {
							return new Ext.fx.Animator(a)
						}
						if (Ext.fx.PseudoEasing[a.easing]) {
							return new Ext.fx.Animator(Ext.apply(a, {
								keyframes : Ext.decode(Ext
										.encode(Ext.fx.PseudoEasing[a.easing]))
							}))
						}
						a = Ext.apply(this, a);
						if (this.from == undefined) {
							this.from = {}
						}
						this.config = a;
						this.target = Ext.fx.Manager.createTarget(this.target);
						this.easingFn = Ext.fx.Easing[this.easing];
						if (!this.easingFn) {
							this.easingFn = String(this.easing).match(
									this.bezierRE);
							if (this.easingFn && this.easingFn.length == 5) {
								var b = this.easingFn;
								this.easingFn = Ext.fx.cubicBezier(+b[1],
										+b[2], +b[3], +b[4])
							}
						}
						this.id = Ext.id(null, "ext-anim-");
						Ext.fx.Manager.addAnim(this);
						this.addEvents("beforeanimate", "afteranimate");
						this.mixins.observable.constructor.call(this, a);
						return this
					},
					setAttr : function(a, b) {
						return Ext.fx.Manager.items.get(this.id).setAttr(
								this.target, a, b)
					},
					initAttrs : function() {
						var i = this.from, h = this.to, e = this.initialFrom
								|| {}, d = {}, g, b, f, a;
						for (a in h) {
							if (h.hasOwnProperty(a)) {
								g = this.target.getAttr(a, i[a]);
								b = h[a];
								if (!Ext.fx.PropHandler[a]) {
									if (Ext.isObject(b)) {
										f = this.propHandlers[a] = Ext.fx.PropHandler.object
									} else {
										f = this.propHandlers[a] = Ext.fx.PropHandler.defaultHandler
									}
								} else {
									f = this.propHandlers[a] = Ext.fx.PropHandler[a]
								}
								d[a] = f.get(g, b, this.damper, e[a])
							}
						}
						this.currentAttrs = d
					},
					start : function(a) {
						if (this.fireEvent("beforeanimate", this) !== false) {
							this.startTime = a - this.elapsedTime;
							if (!this.paused && !this.currentAttrs) {
								this.initAttrs()
							}
							this.running = true
						}
					},
					runAnim : function(f) {
						var i = this.currentAttrs, d = this.duration, b = this.easingFn, a = this.propHandlers, g = {}, h, j, e;
						if (f >= d) {
							f = d
						}
						if (this.reverse) {
							f = d - f
						}
						for (e in i) {
							if (i.hasOwnProperty(e)) {
								j = i[e];
								h = b(f / d);
								g[e] = a[e].set(j, h)
							}
						}
						return g
					},
					lastFrame : function() {
						var a = this.iterations, b = this.currentIteration;
						b++;
						if (b < a) {
							if (this.alternate) {
								this.reverse = !this.reverse
							}
						} else {
							b = 0;
							this.end()
						}
						this.startTime = new Date();
						this.currentIteration = b;
						this.paused = false
					},
					end : function() {
						this.fireEvent("afteranimate", this, this.startTime,
								this.elapsedTime);
						this.startTime = 0;
						this.elapsedTime = 0;
						this.paused = false;
						this.running = false;
						Ext.fx.Manager.removeAnim(this)
					}
				});
Ext.enableFx = true;
Ext.define("Ext.state.Provider", {
	extend : "Ext.util.Observable",
	constructor : function() {
		this.addEvents("statechange");
		this.state = {};
		Ext.state.Provider.superclass.constructor.call(this)
	},
	get : function(b, a) {
		return typeof this.state[b] == "undefined" ? a : this.state[b]
	},
	clear : function(a) {
		delete this.state[a];
		this.fireEvent("statechange", this, a, null)
	},
	set : function(a, b) {
		this.state[a] = b;
		this.fireEvent("statechange", this, a, b)
	},
	decodeValue : function(b) {
		var f = /^(a|n|d|b|s|o|e)\:(.*)$/, h = f.exec(unescape(b)), e, d, a, g;
		if (!h || !h[1]) {
			return
		}
		d = h[1];
		a = h[2];
		switch (d) {
		case "e":
			return null;
		case "n":
			return parseFloat(a);
		case "d":
			return new Date(Date.parse(a));
		case "b":
			return (a == "1");
		case "a":
			e = [];
			if (a != "") {
				Ext.each(a.split("^"), function(i) {
					e.push(this.decodeValue(i))
				}, this)
			}
			return e;
		case "o":
			e = {};
			if (a != "") {
				Ext.each(a.split("^"), function(i) {
					g = i.split("=");
					e[g[0]] = this.decodeValue(g[1])
				}, this)
			}
			return e;
		default:
			return a
		}
	},
	encodeValue : function(d) {
		var b, g = "", f = 0, a, e;
		if (d == null) {
			return "e:1"
		} else {
			if (typeof d == "number") {
				b = "n:" + d
			} else {
				if (typeof d == "boolean") {
					b = "b:" + (d ? "1" : "0")
				} else {
					if (Ext.isDate(d)) {
						b = "d:" + d.toGMTString()
					} else {
						if (Ext.isArray(d)) {
							for (a = d.length; f < a; f++) {
								g += this.encodeValue(d[f]);
								if (f != a - 1) {
									g += "^"
								}
							}
							b = "a:" + g
						} else {
							if (typeof d == "object") {
								for (e in d) {
									if (typeof d[e] != "function"
											&& d[e] !== undefined) {
										g += e + "=" + this.encodeValue(d[e])
												+ "^"
									}
								}
								b = "o:" + g.substring(0, g.length - 1)
							} else {
								b = "s:" + d
							}
						}
					}
				}
			}
		}
		return escape(b)
	}
});
Ext.define("Ext.state.Manager", {
	singleton : true,
	requires : [ "Ext.state.Provider" ],
	constructor : function() {
		this.provider = new Ext.state.Provider()
	},
	setProvider : function(a) {
		this.provider = a
	},
	get : function(b, a) {
		return this.provider.get(b, a)
	},
	set : function(a, b) {
		this.provider.set(a, b)
	},
	clear : function(a) {
		this.provider.clear(a)
	},
	getProvider : function() {
		return this.provider
	}
});
Ext
		.define(
				"Ext.draw.Sprite",
				{
					mixins : {
						observable : "Ext.util.Observable"
					},
					dirty : false,
					dirtyHidden : false,
					dirtyTransform : false,
					dirtyPath : true,
					dirtyFont : true,
					zIndexDirty : true,
					isSprite : true,
					zIndex : 0,
					fontProperties : [ "font", "font-size", "font-weight",
							"font-style", "font-family", "text-anchor", "text" ],
					pathProperties : [ "x", "y", "d", "path", "height",
							"width", "radius", "r", "rx", "ry", "cx", "cy" ],
					constructor : function(a) {
						a = a || {};
						this.id = Ext.id(null, "ext-sprite-");
						this.transformations = [];
						Ext.copyTo(this, a, "surface,group,type");
						this.bbox = {};
						this.attr = {
							zIndex : 0,
							translation : {
								x : null,
								y : null
							},
							rotation : {
								degrees : null,
								x : null,
								y : null
							},
							scaling : {
								x : null,
								y : null,
								cx : null,
								cy : null
							}
						};
						delete a.surface;
						delete a.group;
						delete a.type;
						this.setAttributes(a);
						this.addEvents("render", "mousedown", "mouseup",
								"mouseover", "mouseout", "click");
						this.mixins.observable.constructor.apply(this,
								arguments)
					},
					setAttributes : function(p, r) {
						var n = this, s = n.fontProperties, l = s.length, g = n.pathProperties, o = g.length, d = n.surface.customAttributes, b = n.attr, m, k, f, a, j, q, h, e;
						for (m in d) {
							if (p.hasOwnProperty(m)
									&& typeof d[m] == "function") {
								Ext.apply(p, d[m].apply(n, [].concat(p[m])))
							}
						}
						if (!!p.hidden !== !!b.hidden) {
							n.dirtyHidden = true
						}
						for (k = 0; k < o; k++) {
							m = g[k];
							if (m in p && p[m] !== b[m]) {
								n.dirtyPath = true;
								break
							}
						}
						if ("zIndex" in p) {
							n.zIndexDirty = true
						}
						for (k = 0; k < l; k++) {
							m = s[k];
							if (m in p && p[m] !== b[m]) {
								n.dirtyFont = true;
								break
							}
						}
						f = p.translate;
						a = b.translation;
						if (f) {
							if ((f.x && f.x !== a.x) || (f.y && f.y !== a.y)) {
								Ext.apply(a, f);
								n.dirtyTransform = true
							}
							delete p.translate
						}
						j = p.rotate;
						q = b.rotation;
						if (j) {
							if ((j.x && j.x !== q.x) || (j.y && j.y !== q.y)
									|| (j.degrees && j.degrees !== q.degrees)) {
								Ext.apply(q, j);
								n.dirtyTransform = true
							}
							delete p.rotate
						}
						h = p.scale;
						e = b.scaling;
						if (h) {
							if ((h.x && h.x !== e.x) || (h.y && h.y !== e.y)
									|| (h.cx && h.cx !== e.cx)
									|| (h.cy && h.cy !== e.cy)) {
								Ext.apply(e, h);
								n.dirtyTransform = true
							}
							delete p.scale
						}
						Ext.apply(b, p);
						n.dirty = true;
						if (r === true) {
							n.redraw()
						}
					},
					getBBox : function() {
						return this.surface.getBBox(this)
					},
					hide : function(a) {
						this.setAttributes({
							hidden : true
						}, a)
					},
					show : function(a) {
						this.setAttributes({
							hidden : false
						}, a)
					},
					redraw : function() {
						this.surface.renderItem(this)
					},
					setStyle : function() {
						this.el.setStyle.apply(this.el, arguments);
						return this
					},
					addCls : function(a) {
						this.surface.addCls(this, a)
					},
					removeCls : function(a) {
						this.surface.removeCls(this, a)
					}
				});
Ext
		.define(
				"Ext.draw.Matrix",
				{
					requires : [ "Ext.draw.Draw" ],
					constructor : function(h, g, l, k, j, i) {
						if (h != null) {
							this.matrix = [ [ h, l, j ], [ g, k, i ],
									[ 0, 0, 1 ] ]
						} else {
							this.matrix = [ [ 1, 0, 0 ], [ 0, 1, 0 ],
									[ 0, 0, 1 ] ]
						}
					},
					add : function(s, p, m, k, i, h) {
						var n = this, g = [ [], [], [] ], r = [ [ s, m, i ],
								[ p, k, h ], [ 0, 0, 1 ] ], q, o, l, j;
						for (q = 0; q < 3; q++) {
							for (o = 0; o < 3; o++) {
								j = 0;
								for (l = 0; l < 3; l++) {
									j += n.matrix[q][l] * r[l][o]
								}
								g[q][o] = j
							}
						}
						n.matrix = g
					},
					prepend : function(s, p, m, k, i, h) {
						var n = this, g = [ [], [], [] ], r = [ [ s, m, i ],
								[ p, k, h ], [ 0, 0, 1 ] ], q, o, l, j;
						for (q = 0; q < 3; q++) {
							for (o = 0; o < 3; o++) {
								j = 0;
								for (l = 0; l < 3; l++) {
									j += r[q][l] * n.matrix[l][o]
								}
								g[q][o] = j
							}
						}
						n.matrix = g
					},
					invert : function() {
						var j = this.matrix, i = j[0][0], h = j[1][0], n = j[0][1], m = j[1][1], l = j[0][2], k = j[1][2], g = i
								* m - h * n;
						return new Ext.draw.Matrix(m / g, -h / g, -n / g,
								i / g, (n * k - m * l) / g, (h * l - i * k) / g)
					},
					clone : function() {
						var i = this.matrix, h = i[0][0], g = i[1][0], m = i[0][1], l = i[1][1], k = i[0][2], j = i[1][2];
						return new Ext.draw.Matrix(h, g, m, l, k, j)
					},
					translate : function(a, b) {
						this.prepend(1, 0, 0, 1, a, b)
					},
					scale : function(b, f, a, e) {
						var d = this;
						if (f == null) {
							f = b
						}
						d.add(1, 0, 0, 1, a, e);
						d.add(b, 0, 0, f, 0, 0);
						d.add(1, 0, 0, 1, -a, -e)
					},
					rotate : function(d, b, h) {
						d = Ext.draw.Draw.rad(d);
						var f = this, g = +Math.cos(d).toFixed(9), e = +Math
								.sin(d).toFixed(9);
						f.add(g, e, -e, g, b, h);
						f.add(1, 0, 0, 1, -b, -h)
					},
					x : function(a, d) {
						var b = this.matrix;
						return a * b[0][0] + d * b[0][1] + b[0][2]
					},
					y : function(a, d) {
						var b = this.matrix;
						return a * b[1][0] + d * b[1][1] + b[1][2]
					},
					get : function(b, a) {
						return +this.matrix[b][a].toFixed(4)
					},
					toString : function() {
						var a = this;
						return [ a.get(0, 0), a.get(0, 1), a.get(1, 0),
								a.get(1, 1), 0, 0 ].join()
					},
					toSVG : function() {
						var a = this;
						return "matrix("
								+ [ a.get(0, 0), a.get(1, 0), a.get(0, 1),
										a.get(1, 1), a.get(0, 2), a.get(1, 2) ]
										.join() + ")"
					},
					toFilter : function() {
						var a = this;
						return "progid:DXImageTransform.Microsoft.Matrix(M11="
								+ a.get(0, 0) + ", M12=" + a.get(0, 1)
								+ ", M21=" + a.get(1, 0) + ", M22="
								+ a.get(1, 1) + ", Dx=" + a.get(0, 2) + ", Dy="
								+ a.get(1, 2) + ")"
					},
					offset : function() {
						var a = this.matrix;
						return [ a[0][2].toFixed(4), a[1][2].toFixed(4) ]
					}
				});
Ext
		.define(
				"Ext.draw.engine.SVG",
				{
					extend : "Ext.draw.Surface",
					requires : [ "Ext.draw.Draw", "Ext.draw.Sprite",
							"Ext.draw.Matrix", "Ext.core.Element" ],
					engine : "SVG",
					trimRe : /^\s+|\s+$/g,
					spacesRe : /\s+/,
					xlink : "http://www.w3.org/1999/xlink",
					translateAttrs : {
						radius : "r",
						radiusX : "rx",
						radiusY : "ry",
						path : "d",
						lineWidth : "stroke-width",
						fillOpacity : "fill-opacity",
						strokeOpacity : "stroke-opacity",
						strokeLinejoin : "stroke-linejoin"
					},
					minDefaults : {
						circle : {
							cx : 0,
							cy : 0,
							r : 0,
							fill : "none",
							stroke : null,
							"stroke-width" : null,
							opacity : null,
							"fill-opacity" : null,
							"stroke-opacity" : null
						},
						ellipse : {
							cx : 0,
							cy : 0,
							rx : 0,
							ry : 0,
							fill : "none",
							stroke : null,
							"stroke-width" : null,
							opacity : null,
							"fill-opacity" : null,
							"stroke-opacity" : null
						},
						rect : {
							x : 0,
							y : 0,
							width : 0,
							height : 0,
							rx : 0,
							ry : 0,
							fill : "none",
							stroke : null,
							"stroke-width" : null,
							opacity : null,
							"fill-opacity" : null,
							"stroke-opacity" : null
						},
						text : {
							x : 0,
							y : 0,
							"text-anchor" : "start",
							"font-family" : null,
							"font-size" : null,
							"font-weight" : null,
							"font-style" : null,
							fill : "#000",
							stroke : null,
							"stroke-width" : null,
							opacity : null,
							"fill-opacity" : null,
							"stroke-opacity" : null
						},
						path : {
							d : "M0,0",
							fill : "none",
							stroke : null,
							"stroke-width" : null,
							opacity : null,
							"fill-opacity" : null,
							"stroke-opacity" : null
						},
						image : {
							x : 0,
							y : 0,
							width : 0,
							height : 0,
							preserveAspectRatio : "none",
							opacity : null
						}
					},
					createSVGElement : function(e, a) {
						var d = this.domRef.createElementNS(
								"http://www.w3.org/2000/svg", e), b;
						if (a) {
							for (b in a) {
								d.setAttribute(b, String(a[b]))
							}
						}
						return d
					},
					createSprite : function(a) {
						var b = this.createSVGElement(a.type);
						b.id = a.id;
						b.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
						a.el = Ext.get(b);
						this.applyZIndex(a);
						a.matrix = new Ext.draw.Matrix;
						a.bbox = {
							plain : 0,
							transform : 0
						};
						a.fireEvent("render", a);
						return b
					},
					getBBox : function(a, b) {
						var d = this["getPath" + a.type](a);
						if (b) {
							a.bbox.plain = a.bbox.plain
									|| Ext.draw.Draw.pathDimensions(d);
							return a.bbox.plain
						}
						a.bbox.transform = a.bbox.transform
								|| Ext.draw.Draw.pathDimensions(Ext.draw.Draw
										.mapPath(d, a.matrix));
						return a.bbox.transform
					},
					getBBoxText : function(j) {
						var k = {}, g, l, a, d, h, b;
						if (j && j.el) {
							b = j.el.dom;
							try {
								k = b.getBBox();
								return k
							} catch (f) {
							}
							k = {
								x : k.x,
								y : Infinity,
								width : 0,
								height : 0
							};
							h = b.getNumberOfChars();
							for (d = 0; d < h; d++) {
								g = b.getExtentOfChar(d);
								k.y = Math.min(g.y, k.y);
								l = g.y + g.height - k.y;
								k.height = Math.max(k.height, l);
								a = g.x + g.width - k.x;
								k.width = Math.max(k.width, a)
							}
							return k
						}
					},
					hide : function() {
						Ext.get(this.el).hide()
					},
					show : function() {
						Ext.get(this.el).show()
					},
					hidePrim : function(a) {
						this.addCls(a, Ext.baseCSSPrefix + "hide-visibility")
					},
					showPrim : function(a) {
						this
								.removeCls(a, Ext.baseCSSPrefix
										+ "hide-visibility")
					},
					getDefs : function() {
						return this._defs
								|| (this._defs = this.createSVGElement("defs"))
					},
					transform : function(e) {
						var h = this, a = new Ext.draw.Matrix, g = e.transformations, j = g.length, d = 0, b, f;
						for (; d < j; d++) {
							b = g[d];
							f = b.type;
							if (f == "translate") {
								a.translate(b.x, b.y)
							} else {
								if (f == "rotate") {
									a.rotate(b.degrees, b.x, b.y)
								} else {
									if (f == "scale") {
										a.scale(b.x, b.y, b.centerX, b.centerY)
									}
								}
							}
						}
						e.matrix = a;
						e.el.set({
							transform : a.toSVG()
						})
					},
					setSize : function(a, d) {
						a = +a || this.width;
						d = +d || this.height;
						this.width = a;
						this.height = d;
						var b = this.el;
						b.setSize(a, d);
						b.set({
							width : a,
							height : d
						});
						Ext.draw.engine.SVG.superclass.setSize.call(this, a, d)
					},
					getRegion : function() {
						var f = this.el.getXY(), d = this.bgRect.getXY(), b = Math.max, a = b(
								f[0], d[0]), e = b(f[1], d[1]);
						return {
							left : a,
							top : e,
							right : a + this.width,
							bottom : e + this.height
						}
					},
					onRemove : function(a) {
						if (a.el) {
							Ext.removeNode(a.el);
							delete a.el
						}
						Ext.draw.engine.SVG.superclass.onRemove.call(this)
					},
					setViewBox : function(b, e, d, a) {
						Ext.draw.engine.SVG.superclass.setViewBox.call(this);
						this.el.dom.setAttribute("viewBox", [ b, e, d, a ]
								.join(" "))
					},
					render : function(d) {
						if (!this.el) {
							var f = this.width || 10, b = this.height || 10, e = this
									.createSVGElement("svg", {
										xmlns : "http://www.w3.org/2000/svg",
										version : 1.1,
										width : f,
										height : b
									}), a = this.getDefs(), g = this
									.createSVGElement("rect", {
										width : "100%",
										height : "100%",
										fill : "#000",
										stroke : "none",
										opacity : 0
									});
							e.appendChild(a);
							e.appendChild(g);
							d.appendChild(e);
							this.el = Ext.get(e);
							this.bgRect = Ext.get(g);
							this.el.on({
								scope : this,
								mouseup : this.onMouseUp,
								mousedown : this.onMouseDown,
								mouseover : this.onMouseOver,
								mouseout : this.onMouseOut,
								mousemove : this.onMouseMove,
								mouseenter : this.onMouseEnter,
								mouseleave : this.onMouseLeave,
								click : this.onClick
							})
						}
						this.renderAll()
					},
					onMouseEnter : function(a) {
						if (this.bgRect.getRegion().contains(a.getPoint())) {
							this.fireEvent("mouseenter", a)
						}
					},
					onMouseLeave : function(a) {
						if (this.bgRect.getRegion().contains(a.getPoint())) {
							this.fireEvent("mouseleave", a)
						}
					},
					processEvent : function(b, g) {
						var f = g.getTarget(), a = this.surface, d;
						this.fireEvent(b, g);
						if (f.nodeName == "tspan") {
							f = f.parentNode
						}
						d = this.items.get(f.id);
						if (d) {
							d.fireEvent(b, d, g)
						}
					},
					tuneText : function(j, k) {
						var a = j.el.dom, m, g, b = [], l, e, f, d, h = a
								.getAttribute("x");
						if (k.hasOwnProperty("text")) {
							while (a.firstChild) {
								a.removeChild(a.firstChild)
							}
							d = String(k.text).split("\n");
							for (e = 0, f = d.length; e < f; e++) {
								l = d[e];
								if (l) {
									g = this.createSVGElement("tspan");
									g.appendChild(Ext.getDoc().dom
											.createTextNode(l));
									g.setAttribute("x", h);
									a.appendChild(g);
									b[e] = g
								}
							}
						}
						if (b.length) {
							m = this.getBBoxText(j).height;
							for (e = 0, f = b.length; e < f; e++) {
								b[e].setAttribute("dy", e ? m * 1.2 : m / 4)
							}
							j.dirty = true
						}
					},
					renderAll : function() {
						this.items.each(this.renderItem, this)
					},
					renderItem : function(a) {
						if (!this.el) {
							return
						}
						if (!a.el) {
							this.createSprite(a)
						}
						if (a.zIndexDirty) {
							this.applyZIndex(a)
						}
						if (a.dirty) {
							this.applyAttrs(a);
							this.applyTransformations(a)
						}
					},
					redraw : function(a) {
						a.dirty = a.zIndexDirty = true;
						this.renderItem(a)
					},
					applyAttrs : function(o) {
						var k = this, d = o.el, n = o.group, h = o.attr, f, g, j, m, e, l, b, a;
						if (n) {
							f = [].concat(n);
							j = f.length;
							for (g = 0; g < j; g++) {
								n = f[g];
								k.getGroup(n).add(o)
							}
							delete o.group
						}
						m = k.scrubAttrs(o) || {};
						o.bbox.plain = 0;
						o.bbox.transform = 0;
						if (o.type == "circle" || o.type == "ellipse") {
							m.cx = m.cx || m.x;
							m.cy = m.cy || m.y
						} else {
							if (o.type == "rect") {
								m.rx = m.ry = m.r
							} else {
								if (o.type == "path" && m.d) {
									m.d = Ext.draw.Draw.pathToAbsolute(m.d)
								}
							}
						}
						o.dirtyPath = false;
						if (o.type == "text" && m.font && o.dirtyFont) {
							d.set({
								style : "font: " + m.font
							});
							o.dirtyFont = false
						}
						if (o.type == "image") {
							d.dom.setAttributeNS(k.xlink, "href", m.src)
						}
						Ext.applyIf(m, k.minDefaults[o.type]);
						if (o.dirtyHidden) {
							(h.hidden) ? k.hidePrim(o) : k.showPrim(o);
							o.dirtyHidden = false
						}
						for (l in m) {
							if (m.hasOwnProperty(l) && m[l] != null) {
								d.dom.setAttribute(l, String(m[l]))
							}
						}
						if (o.type == "text") {
							k.tuneText(o, m)
						}
						b = h.style;
						if (b) {
							d.setStyle(b)
						}
						o.dirty = false
					},
					applyZIndex : function(d) {
						var a = this.positionSpriteInList(d), e = d.el, b;
						if (this.el.dom.childNodes[a + 2] !== e.dom) {
							if (a > 0) {
								do {
									b = this.items.getAt(--a).el
								} while (!b && a > 0)
							}
							e.insertAfter(b || this.bgRect)
						}
						d.zIndexDirty = false
					},
					createItem : function(a) {
						var b = new Ext.draw.Sprite(a);
						b.surface = this;
						return b
					},
					addGradient : function(h) {
						h = Ext.draw.Draw.parseGradient(h);
						var f = h.stops.length, a = h.vector, b, e, g, d;
						if (h.type == "linear") {
							b = this.createSVGElement("linearGradient");
							b.setAttribute("x1", a[0]);
							b.setAttribute("y1", a[1]);
							b.setAttribute("x2", a[2]);
							b.setAttribute("y2", a[3])
						} else {
							b = this.createSVGElement("radialGradient");
							b.setAttribute("cx", h.centerX);
							b.setAttribute("cy", h.centerY);
							b.setAttribute("r", h.radius);
							if (Ext.isNumber(h.focalX)
									&& Ext.isNumber(h.focalY)) {
								b.setAttribute("fx", h.focalX);
								b.setAttribute("fy", h.focalY)
							}
						}
						b.id = h.id;
						this.getDefs().appendChild(b);
						for (d = 0; d < f; d++) {
							e = h.stops[d];
							g = this.createSVGElement("stop");
							g.setAttribute("offset", e.offset + "%");
							g.setAttribute("stop-color", e.color);
							g.setAttribute("stop-opacity", e.opacity);
							b.appendChild(g)
						}
					},
					hasCls : function(a, b) {
						return b
								&& (" "
										+ (a.el.dom.getAttribute("class") || "") + " ")
										.indexOf(" " + b + " ") != -1
					},
					addCls : function(f, h) {
						var g = f.el, e, a, d, b = [], j = g
								.getAttribute("class")
								|| "";
						if (!Ext.isArray(h)) {
							if (typeof h == "string" && !this.hasCls(f, h)) {
								g.set({
									"class" : j + " " + h
								})
							}
						} else {
							for (e = 0, a = h.length; e < a; e++) {
								d = h[e];
								if (typeof d == "string"
										&& (" " + j + " ").indexOf(" " + d
												+ " ") == -1) {
									b.push(d)
								}
							}
							if (b.length) {
								g.set({
									"class" : " " + b.join(" ")
								})
							}
						}
					},
					removeCls : function(k, g) {
						var h = this, b = k.el, e = b.getAttribute("class")
								|| "", d, j, f, l, a;
						if (!Ext.isArray(g)) {
							g = [ g ]
						}
						if (e) {
							a = e.replace(h.trimRe, " ").split(h.spacesRe);
							for (d = 0, f = g.length; d < f; d++) {
								l = g[d];
								if (typeof l == "string") {
									l = l.replace(h.trimRe, "");
									j = Ext.Array.indexOf(a, l);
									if (j != -1) {
										a.splice(j, 1)
									}
								}
							}
							b.set({
								"class" : a.join(" ")
							})
						}
					},
					destroy : function() {
						Ext.draw.engine.SVG.superclass.destroy.call(this);
						Ext.removeNode(this.el);
						delete this.el
					}
				});
Ext
		.define(
				"Ext.draw.engine.VML",
				{
					extend : "Ext.draw.Surface",
					requires : [ "Ext.draw.Draw", "Ext.draw.Color",
							"Ext.draw.Sprite", "Ext.draw.Matrix",
							"Ext.core.Element" ],
					engine : "VML",
					map : {
						M : "m",
						L : "l",
						C : "c",
						Z : "x",
						m : "t",
						l : "r",
						c : "v",
						z : "x"
					},
					bitesRe : /([clmz]),?([^clmz]*)/gi,
					valRe : /-?[^,\s-]+/g,
					fillUrlRe : /^url\(\s*['"]?([^\)]+?)['"]?\s*\)$/i,
					pathlike : /^(path|rect)$/,
					NonVMLPathRe : /[ahqstv]/ig,
					partialPathRe : /[clmz]/g,
					fontFamilyRe : /^['"]+|['"]+$/g,
					separatorRe : /[, ]+/,
					baseVMLCls : Ext.baseCSSPrefix + "vml-base",
					vmlGroupCls : Ext.baseCSSPrefix + "vml-group",
					spriteCls : Ext.baseCSSPrefix + "vml-sprite",
					measureSpanCls : Ext.baseCSSPrefix + "vml-measure-span",
					zoom : 21600,
					coordsize : 1000 + " " + 1000,
					coordorigin : "0 0",
					path2vml : function(t) {
						var n = this, u = n.NonVMLPathRe, b = n.map, f = n.valRe, s = n.zoom, e = n.bitesRe, g = Ext.Function
								.bind(Ext.draw.Draw.pathToAbsolute,
										Ext.draw.Draw), m, o, d, a, k, q, h, l;
						if (String(t).match(u)) {
							g = Ext.Function.bind(Ext.draw.Draw.path2curve,
									Ext.draw.Draw)
						} else {
							if (!String(t).match(n.partialPathRe)) {
								m = String(t)
										.replace(
												e,
												function(r, w, j) {
													var v = [], i = w
															.toLowerCase() == "m", p = b[w];
													j
															.replace(
																	f,
																	function(z) {
																		if (i
																				&& v[length] == 2) {
																			p += v
																					+ b[w == "m" ? "l"
																							: "L"];
																			v = []
																		}
																		v
																				.push(Math
																						.round(z
																								* s))
																	});
													return p + v
												});
								return m
							}
						}
						o = g(t);
						m = [];
						for (k = 0, q = o.length; k < q; k++) {
							d = o[k];
							a = o[k][0].toLowerCase();
							if (a == "z") {
								a = "x"
							}
							for (h = 1, l = d.length; h < l; h++) {
								a += Math.round(d[h] * n.zoom)
										+ (h != l - 1 ? "," : "")
							}
							m.push(a)
						}
						return m.join(" ")
					},
					translateAttrs : {
						radius : "r",
						radiusX : "rx",
						radiusY : "ry",
						lineWidth : "stroke-width",
						fillOpacity : "fill-opacity",
						strokeOpacity : "stroke-opacity",
						strokeLinejoin : "stroke-linejoin"
					},
					minDefaults : {
						circle : {
							fill : "none",
							stroke : null,
							"stroke-width" : null,
							opacity : null,
							"fill-opacity" : null,
							"stroke-opacity" : null
						},
						ellipse : {
							cx : 0,
							cy : 0,
							rx : 0,
							ry : 0,
							fill : "none",
							stroke : null,
							"stroke-width" : null,
							opacity : null,
							"fill-opacity" : null,
							"stroke-opacity" : null
						},
						rect : {
							x : 0,
							y : 0,
							width : 0,
							height : 0,
							rx : 0,
							ry : 0,
							fill : "none",
							stroke : null,
							"stroke-width" : null,
							opacity : null,
							"fill-opacity" : null,
							"stroke-opacity" : null
						},
						text : {
							x : 0,
							y : 0,
							"text-anchor" : "start",
							font : "10px Helvetica, Arial, sans-serif",
							fill : "#000",
							stroke : null,
							"stroke-width" : null,
							opacity : null,
							"fill-opacity" : null,
							"stroke-opacity" : null
						},
						path : {
							d : "M0,0",
							fill : "none",
							stroke : null,
							"stroke-width" : null,
							opacity : null,
							"fill-opacity" : null,
							"stroke-opacity" : null
						},
						image : {
							x : 0,
							y : 0,
							width : 0,
							height : 0,
							preserveAspectRatio : "none",
							opacity : null
						}
					},
					onMouseEnter : function(a) {
						this.fireEvent("mouseenter", a)
					},
					onMouseLeave : function(a) {
						this.fireEvent("mouseleave", a)
					},
					processEvent : function(b, g) {
						var f = g.getTarget(), a = this.surface, d;
						this.fireEvent(b, g);
						d = this.items.get(f.id);
						if (d) {
							d.fireEvent(b, d, g)
						}
					},
					createElement : function(h) {
						var f = this, e = h.attr, g = h.type, j = f.zoom, b = h.vml
								|| (h.vml = {}), k = Math.round, d = f
								.createNode("shape"), i = f.createNode("skew"), l, a;
						d.coordsize = j + " " + j;
						d.coordorigin = e.coordorigin || "0 0";
						Ext.get(d).addCls(f.spriteCls);
						if (g == "text") {
							b.path = l = f.createNode("path");
							l.textpathok = true;
							b.textpath = a = f.createNode("textpath");
							a.on = true;
							d.appendChild(a);
							d.appendChild(l)
						}
						d.id = h.id;
						h.el = Ext.get(d);
						f.el.appendChild(d);
						i.on = true;
						d.appendChild(i);
						h.skew = i;
						h.matrix = new Ext.draw.Matrix;
						h.bbox = {
							plain : 0,
							transform : 0
						};
						h.fireEvent("render", h);
						return h.el
					},
					getBBox : function(a, b) {
						var d = this["getPath" + a.type](a);
						if (b) {
							a.bbox.plain = a.bbox.plain
									|| Ext.draw.Draw.pathDimensions(d);
							return a.bbox.plain
						}
						a.bbox.transform = a.bbox.transform
								|| Ext.draw.Draw.pathDimensions(Ext.draw.Draw
										.mapPath(d, a.matrix));
						return a.bbox.transform
					},
					getBBoxText : function(b) {
						var a = b.vml;
						return {
							x : a.X + (a.bbx || 0) - a.W / 2,
							y : a.Y - a.H / 2,
							width : a.W,
							height : a.H
						}
					},
					applyAttrs : function(m) {
						var s = this, d = m.vml, j = m.group, a = m.attr, b = m.el, o = b.dom, p, u, r, n, k, q, l, t;
						if (j) {
							r = [].concat(j);
							k = r.length;
							for (n = 0; n < k; n++) {
								j = r[n];
								s.getGroup(j).add(m)
							}
							delete m.group
						}
						q = s.scrubAttrs(m) || {};
						if (m.zIndexDirty) {
							s.setZIndex(m)
						}
						if (m.type == "image") {
							o.src = q.src
						}
						Ext.applyIf(q, s.minDefaults[m.type]);
						if (o.href) {
							o.href = q.href
						}
						if (o.title) {
							o.title = q.title
						}
						if (o.target) {
							o.target = q.target
						}
						if (o.cursor) {
							o.cursor = q.cursor
						}
						if (m.dirtyHidden) {
							(q.hidden) ? s.hidePrim(m) : s.showPrim(m);
							m.dirtyHidden = false
						}
						if (m.dirtyPath) {
							if (m.type == "circle" || m.type == "ellipse") {
								var f = q.x, e = q.y, h = q.rx || q.r || 0, g = q.ry
										|| q.r || 0;
								o.path = Ext.String.format(
										"ar{0},{1},{2},{3},{4},{1},{4},{1}",
										Math.round((f - h) * s.zoom), Math
												.round((e - g) * s.zoom), Math
												.round((f + h) * s.zoom), Math
												.round((e + g) * s.zoom), Math
												.round(f * s.zoom));
								m.dirtyPath = false
							} else {
								if (m.type != "text") {
									m.attr.path = q.path = s.setPaths(m, q)
											|| q.path;
									o.path = s.path2vml(q.path);
									m.dirtyPath = false
								}
							}
						}
						if ("clip-rect" in q) {
							s.setClip(m, q)
						}
						if (m.type == "text") {
							s.setText(m, q)
						}
						if (q.opacity || q.fill) {
							s.setFill(m, q)
						}
						if (q.stroke || q.fill) {
							s.setStroke(m, q)
						}
						p = a.style;
						if (p) {
							b.setStyle(p)
						}
						m.dirty = false
					},
					setZIndex : function(a) {
						if (a.el) {
							if (a.attr.zIndex != undefined) {
								a.el.setStyle("zIndex", a.attr.zIndex)
							}
							a.zIndexDirty = false
						}
					},
					setPaths : function(b, d) {
						var a = b.attr;
						if (b.type == "circle") {
							a.rx = a.ry = d.r;
							return Ext.draw.Draw.ellipsePath(b)
						} else {
							if (b.type == "ellipse") {
								a.rx = d.rx;
								a.ry = d.ry;
								return Ext.draw.Draw.ellipsePath(b)
							} else {
								if (b.type == "rect") {
									a.rx = a.ry = d.r;
									return Ext.draw.Draw.rectPath(b)
								} else {
									if (b.type == "path" && a.path) {
										return Ext.draw.Draw
												.pathToAbsolute(a.path)
									} else {
										if (b.type == "image") {
											return Ext.draw.Draw.rectPath(b)
										}
									}
								}
							}
						}
						return false
					},
					setFill : function(j, e) {
						var g = this, d = j.el.dom, i = d.fill, b = false, f, h, a;
						if (!i) {
							i = d.fill = g.createNode("fill");
							newFill = true
						}
						if (Ext.isArray(e.fill)) {
							e.fill = e.fill[0]
						}
						if (typeof e["fill-opacity"] == "number"
								|| typeof e.opacity == "number") {
							i.opacity = e["fill-opacity"] || e.opacity
						}
						if (e.fill == "none") {
							i.on = false
						} else {
							i.on = true;
							if (i.on && typeof e.fill == "string") {
								a = e.fill.match(g.fillUrlRe);
								if (a) {
									a = a[1];
									if (a.charAt(0) == "#") {
										h = g.gradientsColl.getByKey(a
												.substring(1))
									}
									if (h) {
										rotation = e.rotation;
										i.angle = -(h.angle + 270 + (rotation ? rotation.degrees
												: 0)) % 360;
										i.type = "gradient";
										i.method = "sigma";
										i.colors.value = h.colors
									} else {
										i.src = a;
										i.type = "tile"
									}
								} else {
									i.color = Ext.draw.Color.toHex(e.fill);
									i.src = "";
									i.type = "solid"
								}
							}
						}
						if (b) {
							d.appendChild(i)
						}
					},
					setStroke : function(b, h) {
						var f = this, e = b.el.dom, i = b.strokeEl, g = false, d, a;
						if (!i) {
							i = b.strokeEl = f.createNode("stroke");
							g = true
						}
						if (Ext.isArray(h.stroke)) {
							h.stroke = h.stroke[0]
						}
						if (!h.stroke || h.stroke == "none" || h.stroke == 0
								|| h["stroke-width"] == 0) {
							i.on = false
						} else {
							i.on = true;
							if (h.stroke && !h.stroke.match(f.fillUrlRe)) {
								i.color = Ext.draw.Color.toHex(h.stroke)
							}
							i.joinstyle = h["stroke-linejoin"];
							i.endcap = h["stroke-linecap"] || "round";
							i.miterlimit = h["stroke-miterlimit"] || 8;
							d = parseFloat(h["stroke-width"] || 1) * 0.75;
							a = h["stroke-opacity"] || 1;
							if (Ext.isNumber(d) && d < 1) {
								i.weight = 1;
								i.opacity = a * d
							} else {
								i.weight = 1;
								i.opacity = a
							}
						}
						if (g) {
							e.appendChild(i)
						}
					},
					setClip : function(b, g) {
						var f = this, d = b.el, a = b.clipEl, e = String(
								g["clip-rect"]).split(f.separatorRe);
						if (!a) {
							a = b.clipEl = Ext.core.DomHelper.insertBefore(d,
									"div");
							a.addCls(Ext.baseCSSPrefix + "vml-sprite")
						}
						if (e.length == 4) {
							e[2] = +e[2] + (+e[0]);
							e[3] = +e[3] + (+e[1]);
							a.setStyle("clip", Ext.String.format(
									"rect({1}px {2}px {3}px {0}px)", e));
							a.setSize(f.el.width, f.el.height)
						} else {
							a.setStyle("clip", "")
						}
					},
					setText : function(i, d) {
						var h = this, a = i.vml, f = a.textpath.style, g = h.span.style, j = h.zoom, k = Math.round, l = {
							font : "font",
							fontSize : "font-size",
							fontWeight : "font-weight",
							fontStyle : "font-style"
						}, b, e;
						if (i.dirtyFont) {
							if (d["font-family"]) {
								f.fontFamily = '"'
										+ d["font-family"].split(",")[0]
												.replace(h.fontFamilyRe, "")
										+ '"';
								g.fontFamily = d["font-family"]
							}
							for (b in l) {
								e = d[l[b]];
								if (e) {
									f[b] = g[b] = e
								}
							}
							a.textpath.string = d.text;
							if (a.textpath.string) {
								h.span.innerHTML = String(a.textpath.string)
										.replace(/</g, "&#60;").replace(/&/g,
												"&#38;").replace(/\n/g, "<br>")
							}
							a.W = d.w = h.span.offsetWidth;
							a.H = d.h = h.span.offsetHeight;
							if (d["text-anchor"] == "middle") {
								a.textpath.style["v-text-align"] = "center"
							} else {
								if (d["text-anchor"] == "end") {
									a.textpath.style["v-text-align"] = "right";
									a.bbx = -Math.round(a.W / 2)
								} else {
									a.textpath.style["v-text-align"] = "left";
									a.bbx = Math.round(a.W / 2)
								}
							}
						}
						a.X = d.x;
						a.Y = d.y;
						a.path.v = Ext.String.format("m{0},{1}l{2},{1}", Math
								.round(a.X * j), Math.round(a.Y * j), Math
								.round(a.X * j) + 1);
						i.bbox.plain = 0;
						i.bbox.transform = 0;
						i.dirtyFont = false
					},
					hide : function() {
						this.el.hide()
					},
					show : function() {
						this.el.show()
					},
					hidePrim : function(a) {
						a.el.addCls(Ext.baseCSSPrefix + "hide-visibility")
					},
					showPrim : function(a) {
						a.el.removeCls(Ext.baseCSSPrefix + "hide-visibility")
					},
					setSize : function(a, j) {
						var e = this, n = e.viewBox, i, h;
						a = a || e.width;
						j = j || e.height;
						e.width = a;
						e.height = j;
						if (!e.div) {
							return
						}
						if (a != undefined) {
							e.div.setWidth(a)
						}
						if (j != undefined) {
							e.div.setHeight(j)
						}
						if (n && (a || j)) {
							var g = n.x, f = n.y, l = n.width, b = n.height, k = j
									/ b, d = a / l, m;
							if (l * k < a) {
								g -= (a - l * k) / 2 / k
							}
							if (b * d < j) {
								f -= (j - b * d) / 2 / d
							}
							m = 1000 * Math.max(l / a, b / j);
							this.el.coordsize = m + " " + m;
							this.el.coordorigin = g + " " + f
						}
						Ext.draw.engine.VML.superclass.setSize.call(this, a, j)
					},
					setViewBox : function(b, e, d, a) {
						Ext.draw.engine.VML.superclass.setViewBox.call(this);
						this.viewBox = {
							x : b,
							y : e,
							width : d,
							height : a
						}
					},
					onAdd : function(a) {
						Ext.draw.engine.VML.superclass.onAdd.call(this, a);
						if (this.el) {
							this.renderItem(a)
						}
					},
					onRemove : function(a) {
						if (a.el) {
							Ext.removeNode(a.el);
							delete a.el
						}
						Ext.draw.engine.VML.superclass.onRemove.call(this)
					},
					render : function(a) {
						var d = this, h = Ext.getDoc().dom;
						if (!d.createNode) {
							h.createStyleSheet().addRule(".rvml",
									"behavior:url(#default#VML)");
							try {
								if (!h.namespaces.rvml) {
									h.namespaces.add("rvml",
											"urn:schemas-microsoft-com:vml")
								}
								d.createNode = function(e) {
									return h.createElement("<rvml:" + e
											+ ' class="rvml">')
								}
							} catch (g) {
								d.createNode = function(e) {
									return h
											.createElement("<"
													+ e
													+ ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')
								}
							}
						}
						if (!d.el) {
							var b = h.createElement("div"), f = d
									.createNode("group");
							d.el = f;
							d.div = Ext.get(b);
							d.div.addCls(d.baseVMLCls);
							Ext.get(f).addCls(d.vmlGroupCls);
							f.coordsize = "1000 1000";
							f.coordorigin = "0 0";
							d.span = h.createElement("span");
							Ext.get(d.span).addCls(d.measureSpanCls);
							b.appendChild(d.span);
							b.appendChild(f);
							d.div.setSize(d.width || 10, d.height || 10);
							a.appendChild(b);
							d.div.on({
								scope : d,
								mouseup : d.onMouseUp,
								mousedown : d.onMouseDown,
								mouseover : d.onMouseOver,
								mouseout : d.onMouseOut,
								mousemove : d.onMouseMove,
								mouseenter : d.onMouseEnter,
								mouseleave : d.onMouseLeave,
								click : d.onClick
							})
						}
						d.renderAll()
					},
					renderAll : function() {
						this.items.each(this.renderItem, this)
					},
					redraw : function(a) {
						a.dirty = true;
						this.renderItem(a)
					},
					renderItem : function(a) {
						if (!this.el) {
							return
						}
						if (!a.el) {
							this.createElement(a)
						}
						if (a.dirty) {
							this.applyAttrs(a);
							if (a.dirtyTransform) {
								this.applyTransformations(a)
							}
						}
					},
					rotationCompensation : function(e, d, a) {
						var b = new Ext.draw.Matrix;
						b.rotate(-e, 0.5, 0.5);
						return {
							x : b.x(d, a),
							y : b.y(d, a)
						}
					},
					transform : function(t) {
						var D = this, w = new Ext.draw.Matrix, m = t.transformations, r = m.length, z = 0, k = 0, d = 1, b = 1, j = "", e = t.el, A = e.dom, u = A.style, a = D.zoom, g = t.skew, f = t.vml, C, B, o, h, n, l, v, s, q, p;
						for (; z < r; z++) {
							o = m[z];
							h = o.type;
							if (h == "translate") {
								w.translate(o.x, o.y)
							} else {
								if (h == "rotate") {
									w.rotate(o.degrees, o.x, o.y);
									k += o.degrees
								} else {
									if (h == "scale") {
										w.scale(o.x, o.y, o.centerX, o.centerY);
										d *= o.x;
										b *= o.y
									}
								}
							}
						}
						t.matrix = w;
						if (D.type != "image" && g) {
							g.matrix = w.toString();
							g.offset = w.offset()
						} else {
							C = w.m[0][2];
							B = w.m[1][2];
							q = a / d;
							p = a / b;
							A.coordsize = Math.abs(q) + " " + Math.abs(p);
							s = k * (d * ((b < 0) ? -1 : 1));
							if (s != u.rotation && !(s === 0 && !u.rotation)) {
								u.rotation = s
							}
							if (k) {
								n = D.rotationCompensation(k, C, B);
								C = n.x;
								B = n.y
							}
							if (d < 0) {
								j += "x"
							}
							if (b < 0) {
								j += " y";
								l = -1
							}
							if (j != "" && !A.style.flip) {
								u.flip = j
							}
							newOrigin = (C * -q) + " " + (B * -p);
							if (newOrigin != A.coordorigin) {
								A.coordorigin = (C * -q) + " " + (B * -p)
							}
						}
					},
					createItem : function(a) {
						return new Ext.draw.Sprite(a)
					},
					getRegion : function() {
						return this.div.getRegion()
					},
					addCls : function(a, b) {
						if (a && a.el) {
							a.el.addCls(b)
						}
					},
					removeCls : function(a, b) {
						if (a && a.el) {
							a.el.removeCls(b)
						}
					},
					addGradient : function(e) {
						var a = this.gradientsColl
								|| (this.gradientsColl = new Ext.util.MixedCollection()), b = [], d = new Ext.util.MixedCollection();
						d.addAll(e.stops);
						d.sortByKey("ASC", function(g, f) {
							g = parseInt(g, 10);
							f = parseInt(f, 10);
							return g > f ? 1 : (g < f ? -1 : 0)
						});
						d.eachKey(function(g, f) {
							b.push(g + "% " + f.color)
						});
						a.add(e.id, {
							colors : b.join(","),
							angle : e.angle
						})
					},
					destroy : function() {
						Ext.draw.engine.VML.superclass.destroy.call(this);
						Ext.removeNode(this.el);
						delete this.el
					}
				});
Ext
		.define(
				"Ext.draw.engine.Canvas",
				{
					extend : "Ext.draw.Surface",
					requires : [ "Ext.draw.Draw", "Ext.draw.Sprite",
							"Ext.core.Element" ],
					fontSizeRE : /(?:^|\s)(\d+)px(?:\s|$)/,
					fontWeightRE : /(?:^|\s)(normal|bold|bolder|lighter|[1-9]00)(?:\s|$)/,
					fontStyleRE : /(?:^|\s)(normal|italic)(?:\s|$)/,
					fontFamilyRE : /^\s+|\s+$/g,
					urlRE : /^url\(['"]?([^\)]+?)['"]?\)$/i,
					separatorRE : /[, ]+/,
					constructor : function(a) {
						this.translateAttrs = {
							rotate : "rotation",
							stroke : "strokeStyle",
							fill : "fillStyle",
							"text-anchor" : "textAlign",
							"stroke-width" : "lineWidth",
							"stroke-linecap" : "lineCap",
							"stroke-linejoin" : "lineJoin",
							"stroke-miterlimit" : "miterLimit",
							opacity : "globalAlpha"
						};
						this.attrDefaults = {
							strokeStyle : "#000",
							fillStyle : "#000",
							lineWidth : 1,
							lineCap : "square",
							lineJoin : "miter",
							miterLimit : 1,
							shadowColor : "none",
							shadowOffsetX : 0,
							shadowOffsetY : 0,
							shadowBlur : 0,
							rotate : null,
							font : "10px Helvetica, sans-serif",
							translation : null,
							"font-size" : null,
							"font-family" : null,
							"font-weight" : null,
							"font-style" : null,
							textAlign : "left",
							globalAlpha : 1
						};
						Ext.draw.engine.Canvas.superclass.constructor.call(
								this, a)
					},
					updateMaxBoundingBox : function(d) {
						if (d.type == "image" || d.type == "text") {
							delete d.realPath;
							Ext.draw.Draw.rectPath(this.getBBox(d));
							d.realPath = Ext.draw.Draw
									.rotateAndTranslatePath(d)
						}
						var b = this.getBBox(d), e = d.curBBox, a, f;
						if (!e) {
							d.maxBBox = b
						} else {
							a = Math.min(b.x, e.x);
							f = Math.min(b.y, e.y);
							d.maxBBox = {
								x : a,
								y : f,
								width : Math.max(b.x + b.width, e.x + e.width)
										- a,
								height : Math.max(b.y + b.height, e.y
										+ e.height)
										- f
							}
						}
						d.curBBox = b
					},
					getBBox : function(j) {
						var e, b;
						if (j.realPath) {
							e = Ext.draw.Draw.pathDimensions(j.realPath)
						} else {
							switch (j.type) {
							case "rect":
							case "image":
								e = {
									x : j.x,
									y : j.y,
									width : j.width,
									height : j.height
								};
								break;
							case "circle":
								e = {
									x : j.x - j.radius,
									y : j.y - j.radius,
									width : j.radius * 2,
									height : j.radius * 2
								};
								break;
							case "ellipse":
								e = {
									x : j.x - j.radiusX,
									y : j.y - j.radiusY,
									width : j.radiusX * 2,
									height : j.radiusY * 2
								};
								break;
							case "path":
								e = Ext.draw.Draw.pathDimensions(j.path);
								break;
							case "text":
								var h = this.shadow;
								h.save();
								b = j["text-anchor"]
										|| this.attrDefaults.textAlign;
								if (b == "middle") {
									b = "center"
								}
								h.textAlign = b;
								h.font = j.font || this.attrDefaults.font;
								var a = 0, m = (j.text + "").split("\n"), l = m.length, d = l, k = j["font-size"] * 1.2, g = j.x, f = j.y
										- l * k / 2;
								while (d--) {
									a = Math.max(a, h.measureText(m[d]).width)
								}
								switch (h.textAlign) {
								case "center":
									g -= a / 2;
									break;
								case "end":
									g -= a;
									break
								}
								e = {
									x : g,
									y : f,
									width : a,
									height : k * l
								};
								break
							}
						}
						e.x2 = e.x + e.width;
						e.y2 = e.y + e.height;
						return e
					},
					setSize : function(a, b) {
						if (typeof a == "object") {
							b = a.height;
							a = a.width
						}
						this.el.width = this.shadow.width = a;
						this.el.height = this.shadow.height = b;
						this.width = a;
						this.height = b
					},
					render : function(a) {
						var f = Ext.getDoc().dom, b, g, e = Ext.get(a)
								.getHeight(), d = Ext.get(a).getWidth();
						this.container = Ext.get(a);
						b = f.createElement("canvas");
						b.id = this.id;
						g = f.createElement("canvas").getContext("2d");
						span = f.createElement("span");
						span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
						g.save();
						a.appendChild(b);
						a.appendChild(span);
						this.el = b;
						this.context = b.getContext("2d");
						this.shadow = g;
						this.span = span;
						this.renderAll()
					},
					createItem : function(a) {
						a.context = Ext.getDoc().dom.createElement("canvas")
								.getContext("2d");
						a.context.canvas.width = this.width;
						a.context.canvas.height = this.height;
						var b = Ext.apply(new Ext.draw.Sprite(a), {
							change : this.change
						});
						return b
					},
					renderItem : function() {
						this.renderAll()
					},
					renderAll : function() {
						var a = this.context;
						a.restore();
						a.save();
						a.clearRect(0, 0, this.width, this.height);
						a.restore();
						a.save();
						this.items.each(this.renderItems, this)
					},
					updateSprite : function(a) {
						this.applyChange(a);
						this.updateMaxBoundingBox(a)
					},
					applyChange : function(a) {
						var b = a.path;
						this.cleanAttrs(a, this.scrubAttrs(a));
						switch (a.type) {
						case "circle":
							a.radiusX = a.radiusY = a.radius;
							a.path = Ext.draw.Draw.path2curve(Ext.draw.Draw
									.ellipsePath(a));
							break;
						case "ellipse":
							a.path = Ext.draw.Draw.path2curve(Ext.draw.Draw
									.ellipsePath(a));
							break;
						case "path":
							a.path = Ext.draw.Draw.path2curve(a.path);
							break;
						case "rect":
							a.path = Ext.draw.Draw.path2curve(Ext.draw.Draw
									.rectPath(a));
							break;
						case "text":
							a.path = Ext.draw.Draw.path2curve(Ext.draw.Draw
									.rectPath(a));
							break
						}
						if (a.path && a.path.length) {
							a.realPath = Ext.draw.Draw
									.rotateAndTranslatePath(a)
						}
						if (b != a.path) {
							a.dirty = true
						}
					},
					drawPath : function(d, f) {
						if (!f) {
							return
						}
						var a, g, b, e = f.length;
						d.beginPath();
						for (b = 0; b < e; b++) {
							switch (f[b][0]) {
							case "M":
								d.moveTo(f[b][1], f[b][2]);
								if (a == null) {
									a = f[b][1]
								}
								if (g == null) {
									g = f[b][2]
								}
								break;
							case "C":
								d.bezierCurveTo(f[b][1], f[b][2], f[b][3],
										f[b][4], f[b][5], f[b][6]);
								break;
							case "Z":
								d.lineTo(a, g);
								break
							}
						}
					},
					scrubAttrs : function(b) {
						var a = Ext.draw.engine.Canvas.superclass.scrubAttrs
								.apply(this, [ b ]);
						if (a.hasOwnProperty("textAlign")
								&& a.textAlign == "middle") {
							a.textAlign = "center"
						}
						return a
					},
					renderItems : function(z) {
						this.updateSprite(z);
						var e = this.context, u = z.context, m, D;
						if (z.hidden || z.opacity == 0) {
							return
						}
						e.restore();
						e.save();
						if (m) {
							e.beginPath();
							e.rect(m.x, m.y, m.width, m.height);
							e.clip()
						}
						if (z.dirty) {
							u.restore();
							u.save();
							u.clearRect(-1000, -1000, this.width + 2000,
									this.height + 2000);
							var A = this.scrubAttrs(z);
							for (D in A) {
								u[D] = A[D]
							}
							var E = z.rotation, K = E.degrees * Math.PI / 180, I = z.translation.x, H = z.translation.y, L = this.scaling;
							if (E.degrees) {
								u.translate(E.x, E.y);
								u.rotate(K);
								u.translate(-E.x, -E.y);
								if (I !== 0 || H !== 0) {
									var s = I, q = H, d = Math.cos(-K), a = Math
											.sin(-K);
									I = s * d - q * a;
									H = s * a + q * d;
									u.translate(I, H)
								}
							} else {
								u.translate(I, H)
							}
							if (this.type == "image") {
								if (!(this._imgdata && this._imgdata[A.src])) {
									var M = R.doc.createElement("img"), b = this, t = this.m;
									M.src = A.src;
									M.style.cssText = "position:absolute;left:-9999em;top-9999em";
									M.onload = function() {
										var i = R.doc.createElement("canvas"), g = i
												.getContext("2d");
										i.width = M.offsetWidth;
										i.height = M.offsetHeight;
										g.drawImage(M, 0, 0, i.width, i.height);
										b._imgdata = b._imgdata || {};
										b._imgdatacount = b._imgdatacount || [];
										b._imgdatacount
												.push(b._imgdata[b.attrs.src] = i);
										b._imgdatacount[length] > 1000
												&& delete b._imgdata[b._imgdatacount
														.shift()];
										M.parentNode.removeChild(M);
										t.refresh(this)
									};
									this.m.canvas.parentNode.appendChild(M)
								} else {
									if (sc.x || sc.y) {
										c.scale(sc.x, sc.y);
										c.translate(sc.cx / sc.x - sc.cx, sc.cy
												/ sc.y - sc.cy)
									}
									c.drawImage(this._imgdata[A.src], A.x, A.y,
											A.width, A.height);
									c.restore();
									return
								}
							} else {
								if (z.type == "text") {
									var C, p, B, G, v, r = (z.text + "")
											.split("\n"), k;
									k = z["text-anchor"]
											|| this.attrDefaults.textAlign;
									if (k == "middle") {
										k = "center"
									}
									u.textAlign = k;
									u.font = z.font || this.attrDefaults.font;
									u.textBaseline = "middle";
									C = z.fillStyle && z.fillStyle != "none";
									p = z.strokeStyle
											&& z.strokeStyle != "none";
									v = z.y - (r.length - 1) * z["font-size"]
											* 1.2 / 2;
									for (B = 0, G = r.length; B < G; B++) {
										if (C) {
											u.fillText(r[B], z.x, v
													+ z["font-size"] * 1.2 * B)
										}
										if (p) {
											u.strokeText(r[B], z.x, v
													+ z["font-size"] * 1.2 * B)
										}
									}
								} else {
									this.drawPath(u, z.path)
								}
							}
							u.save();
							if (this.type != "text") {
								var o = A.gradient;
								if (o) {
									var F;
									if (o.type == "linear") {
										var n = this.getBBox();
										F = u.createLinearGradient(n.x
												+ o.vector[0] * n.width, n.y
												+ o.vector[1] * n.height, n.x
												+ o.vector[2] * n.width, n.y
												+ o.vector[3] * n.height)
									} else {
										var l = A.rx || A.r, h = A.ry || A.r;
										F = u.createRadialGradient(A.cx - l + l
												* 2 * o.fx, A.cy - h + h * 2
												* o.fy, 0, A.cx, A.cy, mmax(l,
												h))
									}
									var f = (isNaN(A["fill-opacity"]) ? 1
											: A["fill-opacity"])
											* (isNaN(A.opacity) ? 1 : A.opacity), w = o.dots[o.dots[length] - 1], J = w.color;
									w.color = "rgba(" + [ J.r, J.g, J.b, f ]
											+ ")";
									for (D = o.dots.length; D--;) {
										w = o.dots[D];
										F.addColorStop(toFloat(w.offset) / 100,
												w.color)
									}
									u.globalAlpha = 1;
									u.fillStyle = F;
									u.fill()
								} else {
									if (A.fillStyle && A.fillStyle != "none") {
										u.fill()
									}
								}
								if (A.strokeStyle && A.strokeStyle != "none") {
									u.stroke()
								}
							}
							u.restore();
							u.translate(-I, -H);
							z.dirty = false
						}
						e.drawImage(u.canvas, 0, 0)
					},
					cleanAttrs : function(e, b) {
						var f, a, g, d;
						for (d in b) {
							f = b[d];
							switch (d) {
							case "translate":
								g = (f + "").split(this.separatorRE);
								e.translation.x += +g[0];
								e.translation.y += +g[1];
								break;
							case "font-size":
								e["font-size"] = parseInt(f, 10);
							case "font-family":
							case "font-weight":
							case "font-style":
								e.font = (e["font-weight"] || "")
										+ " "
										+ (e["font-style"] || "")
										+ " "
										+ (e["font-size"] ? e["font-size"]
												+ "px " : "")
										+ (e["font-family"] || "");
								break;
							case "font":
								f = f.replace(this.fontSizeRE, function(i, h) {
									e["font-size"] = h;
									return ""
								});
								f = f.replace(this.fontWeightRE,
										function(h, i) {
											e["font-weight"] = i;
											return ""
										});
								f = f.replace(this.fontStyleRE, function(i, h) {
									e["font-style"] = h;
									return ""
								});
								e["font-family"] = f.replace(this.fontFamilyRE,
										"")
										|| e["font-family"];
							case "stroke":
							case "strokeStyle":
								e.stroke = e.strokeStyle = f;
								break;
							case "fill":
							case "fillStyle":
								e.fill = e.fillStyle = f;
								break;
							case "rotate":
							case "rotation":
								this.rotate(e, f);
								break;
							case "scale":
								break
							}
						}
					},
					change : function() {
						var a = this.path;
						this.surface.cleanAttrs(this, this.surface
								.scrubAttrs(this));
						switch (this.type) {
						case "circle":
							this.radiusX = this.radiusY = this.radius;
							this.path = Ext.draw.Draw.path2curve(Ext.draw.Draw
									.ellipsePath(this));
							break;
						case "ellipse":
							this.path = Ext.draw.Draw.path2curve(Ext.draw.Draw
									.ellipsePath(this));
							break;
						case "rect":
							this.path = Ext.draw.Draw.path2curve(Ext.draw.Draw
									.rectPath(this));
							break;
						case "text":
							this.path = Ext.draw.Draw.path2curve(Ext.draw.Draw
									.rectPath(this));
							break
						}
						if (this.path && this.path.length) {
							this.realPath = Ext.draw.Draw
									.rotateAndTranslatePath(this)
						}
						if (a != this.path) {
							this.dirty = true;
							return true
						}
					},
					rotate : function(b, a) {
						if (typeof a.x == "number") {
							b.rotation = {
								degrees : a.degrees,
								x : a.x,
								y : a.y
							}
						} else {
							if (typeof a.degrees == "number") {
								var d = this.getBBox(b);
								b.rotation = {
									degrees : parseFloat(a.degrees),
									x : d.x + d.width / 2,
									y : d.y + d.height / 2
								}
							}
						}
						b.dirty = true
					},
					getRegion : function() {
						return Ext.fly(this.el).getRegion()
					}
				});
Ext
		.define(
				"Ext.resizer.ResizeTracker",
				{
					extend : "Ext.dd.DragTracker",
					dynamic : true,
					preserveRatio : false,
					constrainTo : null,
					constructor : function(a) {
						if (!a.el) {
							if (a.target.isComponent) {
								this.el = a.target.getEl()
							} else {
								this.el = a.target
							}
						}
						Ext.resizer.ResizeTracker.superclass.constructor.apply(
								this, arguments);
						if (this.throttle) {
							var b = this, d = Ext.Function
									.createThrottled(
											function() {
												Ext.resizer.ResizeTracker.prototype.resize
														.apply(b, arguments)
											}, this.throttle);
							this.resize = function(f, g, e) {
								if (e) {
									Ext.resizer.ResizeTracker.prototype.resize
											.apply(this, arguments)
								} else {
									d.apply(null, arguments)
								}
							}
						}
					},
					onBeforeStart : function(a) {
						this.startBox = this.el.getBox()
					},
					getDynamicTarget : function() {
						var a = this.target;
						if (this.dynamic) {
							return a
						} else {
							if (!this.proxy) {
								this.proxy = a.isComponent ? a.getProxy()
										.addCls(
												Ext.baseCSSPrefix
														+ "resizable-proxy")
										: a.createProxy({
											tag : "div",
											cls : Ext.baseCSSPrefix
													+ "resizable-proxy",
											id : a.id + "-rzproxy"
										}, Ext.getBody())
							}
						}
						this.proxy.show();
						return this.proxy
					},
					onStart : function(a) {
						this.activeResizeHandle = Ext.getCmp(this
								.getDragTarget().id);
						if (!this.dynamic) {
							this.resize(this.startBox, {
								horizontal : "none",
								vertical : "none"
							})
						}
					},
					onDrag : function(a) {
						if (this.dynamic || this.proxy) {
							this.updateDimensions(a)
						}
					},
					updateDimensions : function(j, l) {
						var n = this.activeResizeHandle.region, d = this
								.getOffset(this.constrainTo ? "dragTarget"
										: null), i = this.startBox, m = 0, h = 0, f = 0, b = 0, o = d[0] < 0 ? "right"
								: "left", a = d[1] < 0 ? "down" : "up";
						switch (n) {
						case "south":
							h = d[1];
							break;
						case "north":
							h = -d[1];
							b = -h;
							break;
						case "east":
							m = d[0];
							break;
						case "west":
							m = -d[0];
							f = -m;
							break;
						case "northeast":
							h = -d[1];
							b = -h;
							m = d[0];
							break;
						case "southeast":
							h = d[1];
							m = d[0];
							break;
						case "southwest":
							m = -d[0];
							f = -m;
							h = d[1];
							break;
						case "northwest":
							h = -d[1];
							b = -h;
							m = -d[0];
							f = -m;
							break
						}
						var g = {
							width : i.width + m,
							height : i.height + h,
							x : i.x + f,
							y : i.y + b
						};
						if (g.width < this.minWidth || g.width > this.maxWidth) {
							g.width = Ext.Number.constrain(g.width,
									this.minWidth, this.maxWidth);
							g.x = this.lastX || g.x
						} else {
							this.lastX = g.x
						}
						if (g.height < this.minHeight
								|| g.height > this.maxHeight) {
							g.height = Ext.Number.constrain(g.height,
									this.minHeight, this.maxHeight);
							g.y = this.lastY || g.y
						} else {
							this.lastY = g.y
						}
						if (this.preserveRatio || j.shiftKey) {
							var k = i.width / i.height;
							if (h) {
								g.width = (g.height) * k;
								g.width = Ext.Number.constrain(g.width,
										this.minWidth, this.maxWidth)
							} else {
								g.height = (g.width) * (1 / k);
								g.height = Ext.Number.constrain(g.height,
										this.minHeight, this.maxHeight)
							}
						}
						if (h === 0) {
							a = "none"
						}
						if (m === 0) {
							o = "none"
						}
						this.resize(g, {
							horizontal : o,
							vertical : a
						}, l)
					},
					getResizeTarget : function(a) {
						return a ? this.target : this.getDynamicTarget()
					},
					resize : function(b, e, a) {
						var d = this.getResizeTarget(a);
						if (d.isComponent) {
							if (d.floating) {
								d.setPagePosition(b.x, b.y)
							}
							d.setSize(b.width, b.height)
						} else {
							d.setBox(b);
							if (this.originalTarget) {
								this.originalTarget.setBox(b)
							}
						}
					},
					onEnd : function(a) {
						this.updateDimensions(a, true);
						if (this.proxy) {
							this.proxy.hide()
						}
					}
				});
Ext
		.define(
				"Ext.chart.Labels",
				{
					requires : [ "Ext.draw.Color" ],
					colorStringRe : /url\s*\(\s*#([^\/)]+)\s*\)/,
					constructor : function(a) {
						var b = this;
						b.label = Ext.applyIf(b.label || {}, {
							display : "none",
							color : "#000",
							field : "name",
							minMargin : 50,
							font : "11px Helvetica, sans-serif",
							orientation : "horizontal",
							renderer : function(d) {
								return d
							}
						});
						if (b.label.display !== "none") {
							b.labelsGroup = b.chart.surface.getGroup(b.seriesId
									+ "-labels")
						}
					},
					renderLabels : function() {
						var I = this, r = I.chart, u = r.gradients, b, s = I.items, e = r.animate, G = I.label, z = G.display, w = G.color, d = []
								.concat(G.field), m = I.labelsGroup, f = I.chart.store, C = f
								.getCount(), h = s.length / C, B, g, A, v, a = (u || 0)
								&& u.length, q, E, o, F, l, p, t, n, D, H, K = Ext.draw.Color, J;
						if (z == "none") {
							return
						}
						for (B = 0, g = 0; B < C; B++) {
							for (A = 0; A < h; A++) {
								F = s[g];
								l = m.getAt(g);
								p = f.getAt(B);
								if (!F && l) {
									l.hide(true)
								}
								if (F && d[A]) {
									if (!l) {
										l = I.onCreateLabel(p, F, B, z, A, g)
									}
									I.onPlaceLabel(l, p, F, B, z, e, A, g);
									if (G.contrast && F.sprite) {
										t = F.sprite;
										J = t._to && t._to.fill || t.attr.fill;
										n = K.fromString(J);
										if (J && !n) {
											J = J.match(I.colorStringRe)[1];
											for (v = 0; v < a; v++) {
												b = u[v];
												if (b.id == J) {
													o = 0;
													q = 0;
													for (E in b.stops) {
														o++;
														q += K
																.fromString(
																		b.stops[E].color)
																.getGrayscale()
													}
													D = (q / o) / 255;
													break
												}
											}
										} else {
											D = n.getGrayscale() / 255
										}
										H = K.fromString(
												l.attr.color || l.attr.fill)
												.getHSL();
										H[2] = D > 0.5 ? 0.2 : 0.8;
										l.setAttributes({
											fill : String(K.fromHSL
													.apply({}, H))
										}, true)
									}
								}
								g++
							}
						}
						I.hideLabels(g)
					},
					hideLabels : function(d) {
						var b = this.labelsGroup, a;
						if (b) {
							a = b.getCount();
							while (a-- > d) {
								b.getAt(a).hide(true)
							}
						}
					}
				});
Ext
		.define(
				"Ext.chart.Highlights",
				{
					requires : [ "Ext.fx.Anim" ],
					highlight : false,
					highlightCfg : null,
					constructor : function(a) {
						if (a.highlight) {
							if (a.highlight !== true) {
								this.highlightCfg = Ext.apply({}, a.highlight)
							} else {
								this.highlightCfg = {
									fill : "#fdd",
									radius : 20,
									lineWidth : 5,
									stroke : "#f55"
								}
							}
						}
					},
					highlightItem : function(k) {
						if (!k) {
							return
						}
						var g = this, j = k.sprite, a = g.highlightCfg, e = g.chart.surface, d = g.chart.animate, b, i, h, f;
						if (!g.highlight || !j || j._highlighted) {
							return
						}
						if (j._anim) {
							j._anim.paused = true
						}
						j._highlighted = true;
						if (!j._defaults) {
							j._defaults = Ext.apply(j._defaults || {}, j.attr);
							i = {};
							h = {};
							for (b in a) {
								if (!(b in j._defaults)) {
									j._defaults[b] = e.availableAttrs[b]
								}
								i[b] = j._defaults[b];
								h[b] = a[b];
								if (Ext.isObject(a[b])) {
									i[b] = {};
									h[b] = {};
									Ext.apply(j._defaults[b], j.attr[b]);
									Ext.apply(i[b], j._defaults[b]);
									for (f in j._defaults[b]) {
										if (!(f in a[b])) {
											h[b][f] = i[b][f]
										} else {
											h[b][f] = a[b][f]
										}
									}
									for (f in a[b]) {
										if (!(f in h[b])) {
											h[b][f] = a[b][f]
										}
									}
								}
							}
							j._from = i;
							j._to = h
						}
						if (d) {
							j._anim = new Ext.fx.Anim({
								target : j,
								from : j._from,
								to : j._to,
								duration : 150
							})
						} else {
							j.setAttributes(j._to, true)
						}
					},
					unHighlightItem : function() {
						if (!this.highlight || !this.items) {
							return
						}
						var j = this, h = j.items, g = h.length, a = j.highlightCfg, d = j.chart.animate, f = 0, e, b, k;
						for (; f < g; f++) {
							if (!h[f]) {
								continue
							}
							k = h[f].sprite;
							if (k && k._highlighted) {
								if (k._anim) {
									k._anim.paused = true
								}
								e = {};
								for (b in a) {
									if (Ext.isObject(k._defaults[b])) {
										e[b] = {};
										Ext.apply(e[b], k._defaults[b])
									} else {
										e[b] = k._defaults[b]
									}
								}
								if (d) {
									k._anim = new Ext.fx.Anim({
										target : k,
										to : e,
										duration : 150
									})
								} else {
									k.setAttributes(e, true)
								}
								delete k._highlighted
							}
						}
					},
					cleanHighlights : function() {
						if (!this.highlight) {
							return
						}
						var e = this.group, d = this.markerGroup, b = 0, a;
						for (a = e.getCount(); b < a; b++) {
							delete e.getAt(b)._defaults
						}
						if (d) {
							for (a = d.getCount(); b < a; b++) {
								delete d.getAt(b)._defaults
							}
						}
					}
				});
Ext.define("Ext.layout.Layout", {
	extend : "Ext.layout.AbstractLayout",
	layoutItem : function(b, a) {
		a = a || {};
		if (b.componentLayout.initialized !== true) {
			b.doComponentLayout(a.width || b.width || undefined, a.height
					|| b.height || undefined)
		}
	}
});
Ext.define("Ext.layout.AbstractContainer", {
	extend : "Ext.layout.Layout",
	type : "container",
	fixedLayout : true,
	bindToOwnerCtComponent : false,
	bindToOwnerCtContainer : false,
	getLayoutItems : function() {
		return this.owner && this.owner.items && this.owner.items.items || []
	},
	afterLayout : function() {
		this.owner.afterLayout(this)
	},
	getTarget : function() {
		return this.owner.getTargetEl()
	},
	getRenderTarget : function() {
		return this.owner.getTargetEl()
	}
});
Ext
		.define(
				"Ext.layout.Container",
				{
					extend : "Ext.layout.AbstractContainer",
					getLayoutTargetSize : function() {
						var b = this.getTarget(), a;
						if (b) {
							a = b.getViewSize();
							if (Ext.isIE && a.width == 0) {
								a = b.getStyleSize()
							}
							a.width -= b.getPadding("lr");
							a.height -= b.getPadding("tb")
						}
						return a
					},
					getRenderedItems : function() {
						var f = this, h = f.getTarget(), a = f.getLayoutItems(), e = a.length, g = [], b, d;
						for (b = 0; b < e; b++) {
							d = a[b];
							if (d.rendered && f.isValidParent(d, h, b)) {
								g.push(d)
							}
						}
						return g
					},
					getVisibleItems : function() {
						var g = this.getTarget(), b = this.getLayoutItems(), f = b.length, a = [], d, e;
						for (d = 0; d < f; d++) {
							e = b[d];
							if (e.rendered && this.isValidParent(e, g, d)
									&& e.hidden !== true) {
								a.push(e)
							}
						}
						return a
					}
				});
Ext.define("Ext.layout.container.Auto", {
	alias : [ "layout.auto", "layout.autocontainer" ],
	extend : "Ext.layout.Container",
	type : "autocontainer",
	fixedLayout : false,
	bindToOwnerCtComponent : true,
	onLayout : function(a, g) {
		var b = this.getLayoutItems(), f = b.length, d, e;
		for (d = 0; d < f; d++) {
			e = b[d];
			e.doComponentLayout()
		}
	}
});
Ext
		.define(
				"Ext.AbstractContainer",
				{
					extend : "Ext.Component",
					requires : [ "Ext.util.MixedCollection",
							"Ext.layout.Manager", "Ext.layout.container.Auto",
							"Ext.ComponentMgr", "Ext.ComponentQuery",
							"Ext.ZIndexManager" ],
					suspendLayout : false,
					autoDestroy : true,
					defaultType : "panel",
					isContainer : true,
					baseCls : Ext.baseCSSPrefix + "container",
					bubbleEvents : [ "add", "remove" ],
					initComponent : function() {
						var a = this;
						a.addEvents("afterlayout", "beforeadd", "beforeremove",
								"add", "remove", "beforecardswitch",
								"cardswitch");
						a.layoutOnShow = new Ext.util.MixedCollection();
						Ext.AbstractContainer.superclass.initComponent.call(a);
						a.initItems()
					},
					initItems : function() {
						var b = this, a = this.items;
						b.items = Ext.create("Ext.util.MixedCollection", false,
								b.getComponentId);
						if (a) {
							if (!Ext.isArray(a)) {
								a = [ a ]
							}
							b.add(a)
						}
					},
					afterRender : function() {
						this.getLayout();
						Ext.AbstractContainer.superclass.afterRender.apply(
								this, arguments)
					},
					setLayout : function(b) {
						var a = this.layout;
						if (a && a.isLayout && a != b) {
							a.setOwner(null)
						}
						this.layout = b;
						b.setOwner(this)
					},
					getLayout : function() {
						var a = this;
						if (!a.layout || !a.layout.isLayout) {
							a.setLayout(Ext.layout.Manager.create(a.layout,
									"autocontainer"))
						}
						return a.layout
					},
					doLayout : function() {
						var b = this, a = b.getLayout();
						if (b.rendered && a && !b.suspendLayout) {
							a.layout()
						}
						return b
					},
					afterLayout : function(a) {
						this.fireEvent("afterlayout", this, a)
					},
					prepareItems : function(b, e) {
						if (!Ext.isArray(b)) {
							b = [ b ]
						}
						var d = 0, a = b.length, f;
						for (; d < a; d++) {
							f = b[d];
							if (e) {
								f = this.applyDefaults(f)
							}
							b[d] = this.lookupComponent(f)
						}
						return b
					},
					applyDefaults : function(a) {
						var b = this.defaults;
						if (b) {
							if (Ext.isFunction(b)) {
								b = b.call(this, a)
							}
							if (Ext.isString(a)) {
								a = Ext.ComponentMgr.get(a);
								Ext.apply(a, b)
							} else {
								if (!a.isComponent) {
									Ext.applyIf(a, b)
								} else {
									Ext.apply(a, b)
								}
							}
						}
						return a
					},
					lookupComponent : function(a) {
						if (Ext.isString(a)) {
							return Ext.ComponentMgr.get(a)
						} else {
							return this.createComponent(a)
						}
						return a
					},
					createComponent : function(a, b) {
						return Ext.ComponentMgr
								.create(a, b || this.defaultType)
					},
					getComponentId : function(a) {
						return a.getItemId()
					},
					add : function() {
						var j = this, g = Array.prototype.slice.call(arguments), a, h, b = [], d, f, l, e = -1, k;
						if (typeof g[0] == "number") {
							e = g.shift()
						}
						a = g.length > 1;
						if (a || Ext.isArray(g[0])) {
							h = a ? g : g[0];
							j.suspendLayout = true;
							for (d = 0, f = h.length; d < f; d++) {
								l = h[d];
								if (!l) {
									throw "Trying to add a null item as a child of Container with itemId/id: "
											+ j.getItemId()
								}
								if (e != -1) {
									l = j.add(e + d, l)
								} else {
									l = j.add(l)
								}
								b.push(l)
							}
							j.suspendLayout = false;
							j.doLayout();
							return b
						}
						k = j.prepareItems(g[0], true)[0];
						if (k.floating) {
							k.onAdded(j, e)
						} else {
							e = (e !== -1) ? e : j.items.length;
							if (j.fireEvent("beforeadd", j, k, e) !== false
									&& j.onBeforeAdd(k) !== false) {
								j.items.insert(e, k);
								k.onAdded(j, e);
								j.onAdd(k, e);
								j.fireEvent("add", j, k, e)
							}
							j.doLayout()
						}
						return k
					},
					registerFloatingItem : function(b) {
						var a = this;
						if (!a.floatingItems) {
							a.floatingItems = new Ext.ZIndexManager(a)
						}
						a.floatingItems.register(b)
					},
					onAdd : Ext.emptyFn,
					onRemove : Ext.emptyFn,
					insert : function(b, a) {
						return this.add(b, a)
					},
					move : function(b, e) {
						var a = this.items, d;
						d = a.removeAt(b);
						if (d === false) {
							return false
						}
						a.insert(e, d);
						this.doLayout();
						return d
					},
					onBeforeAdd : function(a) {
						if (a.ownerCt) {
							a.ownerCt.remove(a, false)
						}
						if (this.hideBorders === true) {
							a.border = (a.border === true)
						}
					},
					remove : function(a, b) {
						var d = this, e = d.getComponent(a);
						if (!e) {
							console
									.warn("Attempted to remove a component that does not exist. Ext.container.Container: remove takes an argument of the component to remove. cmp.remove() is incorrect usage.")
						}
						if (e && d.fireEvent("beforeremove", d, e) !== false) {
							d.doRemove(e, b);
							d.fireEvent("remove", d, e)
						}
						return e
					},
					doRemove : function(d, b) {
						var f = this, e = f.layout, a = e && f.rendered;
						f.items.remove(d);
						d.onRemoved();
						if (a) {
							e.onRemove(d)
						}
						f.onRemove(d, b);
						if (b === true || (b !== false && f.autoDestroy)) {
							d.destroy()
						}
						if (a && !b) {
							e.afterRemove(d)
						}
						if (!f.destroying) {
							f.doLayout()
						}
					},
					removeAll : function(d) {
						var h = this, f = h.items.items.slice(), b = [], e = 0, a = f.length, g;
						h.suspendLayout = true;
						for (; e < a; e++) {
							g = f[e];
							h.remove(g, d);
							if (g.ownerCt !== h) {
								b.push(g)
							}
						}
						h.suspendLayout = false;
						h.doLayout();
						return b
					},
					getRefItems : function(b) {
						var d = this.items.items.slice(), a = d.length, e = 0, f;
						if (this.floatingItems) {
							d = d.concat(this.floatingItems.accessList);
							a = d.length
						}
						if (b) {
							for (; e < a; e++) {
								f = d[e];
								if (f.getRefItems) {
									d = d.concat(f.getRefItems(true))
								}
							}
						}
						return d
					},
					getComponent : function(a) {
						if (Ext.isObject(a)) {
							a = a.getItemId()
						}
						return this.items.get(a)
					},
					query : function(a) {
						return Ext.ComponentQuery.query(a, this)
					},
					child : function(a) {
						return this.query("> " + a)[0] || null
					},
					down : function(a) {
						return this.query(a)[0] || null
					},
					show : function() {
						Ext.AbstractContainer.superclass.show.apply(this,
								arguments);
						this.performDeferredLayouts()
					},
					performDeferredLayouts : function() {
						var f = this.layoutOnShow, e = f.getCount(), b = 0, a, d;
						for (; b < e; b++) {
							d = f.get(b);
							a = d.needsLayout;
							if (Ext.isObject(a)) {
								d.doComponentLayout(a.width, a.height,
										a.isSetSize, a.ownerCt)
							}
						}
						f.clear()
					},
					beforeDestroy : function() {
						var b = this, a = b.items, d;
						if (a) {
							while ((d = a.first())) {
								b.doRemove(d, true)
							}
						}
						Ext.destroy(b.layout, b.floatingItems);
						Ext.AbstractContainer.superclass.beforeDestroy.call(b)
					}
				});
Ext.define("Ext.container.Container", {
	extend : "Ext.AbstractContainer",
	alias : "widget.container",
	alternateClassName : "Ext.Container",
	getChildByElement : function(e) {
		var g, b, a = 0, d = this.items.items, f = d.length;
		e = Ext.getDom(e);
		for (; a < f; a++) {
			g = d[a];
			b = g.getEl();
			if ((b.dom === e) || b.contains(e)) {
				return g
			}
		}
		return null
	}
});
Ext.define("Ext.toolbar.Fill", {
	extend : "Ext.Component",
	alias : "widget.tbfill",
	isFill : true,
	flex : 1
});
Ext.define("Ext.layout.container.boxOverflow.None", {
	constructor : function(b, a) {
		this.layout = b;
		Ext.apply(this, a || {})
	},
	handleOverflow : Ext.emptyFn,
	clearOverflow : Ext.emptyFn
});
Ext.define("Ext.toolbar.Item", {
	extend : "Ext.Component",
	alias : "widget.tbitem",
	enable : Ext.emptyFn,
	disable : Ext.emptyFn,
	focus : Ext.emptyFn
});
Ext.define("Ext.toolbar.Separator", {
	extend : "Ext.toolbar.Item",
	alias : "widget.tbseparator",
	cls : "xtb-sep"
});
Ext.define("Ext.menu.MenuMgr", {
	singleton : true,
	requires : [ "Ext.util.MixedCollection" ],
	menus : {},
	groups : {},
	attached : false,
	lastShow : new Date(),
	init : function() {
		this.active = new Ext.util.MixedCollection();
		Ext.getDoc().addKeyListener(27, function() {
			if (this.active.length > 0) {
				this.hideAll()
			}
		}, this)
	},
	hideAll : function() {
		var a = this.active, b;
		if (a && a.length > 0) {
			b = a.clone();
			b.each(function(d) {
				d.hide()
			});
			return true
		}
		return false
	},
	onHide : function(a) {
		var b = this.active;
		b.remove(a);
		if (b.length < 1) {
			Ext.getDoc().un("mousedown", this.onMouseDown, this);
			this.attached = false
		}
	},
	onShow : function(a) {
		var f = this.active, e = f.last(), d = this.attached, b = a.getEl(), g;
		this.lastShow = new Date();
		f.add(a);
		if (!d) {
			Ext.getDoc().on("mousedown", this.onMouseDown, this);
			this.attached = true
		}
		a.toFront()
	},
	onBeforeHide : function(a) {
		if (a.activeChild) {
			a.activeChild.hide()
		}
		if (a.autoHideTimer) {
			clearTimeout(a.autoHideTimer);
			delete a.autoHideTimer
		}
	},
	onBeforeShow : function(a) {
		var d = this.active, b = a.parentMenu;
		d.remove(a);
		if (!b && !a.allowOtherMenus) {
			this.hideAll()
		} else {
			if (b && b.activeChild && a != b.activeChild) {
				b.activeChild.hide()
			}
		}
	},
	onMouseDown : function(d) {
		var b = this.active, a = this.lastShow;
		if (Ext.Date.getElapsed(a) > 50 && b.length > 0
				&& !d.getTarget("." + Ext.baseCSSPrefix + "menu")) {
			this.hideAll()
		}
	},
	register : function(b) {
		var a = this;
		if (!a.active) {
			a.init()
		}
		a.menus[b.id] = b;
		b.on({
			beforehide : a.onBeforeHide,
			hide : a.onHide,
			beforeshow : a.onBeforeShow,
			show : a.onShow,
			scope : a
		})
	},
	get : function(a) {
		if (typeof a == "string") {
			if (!menus) {
				return null
			}
			return menus[a]
		} else {
			if (a.events) {
				return a
			} else {
				if (typeof a.length == "number") {
					return new Ext.menu.Menu({
						items : a
					})
				} else {
					return Ext.ComponentMgr.create(a, "menu")
				}
			}
		}
	},
	unregister : function(d) {
		var a = this.menus, b = this.active;
		delete a[d.id];
		b.remove(d);
		d.un("beforehide", this.onBeforeHide, this);
		d.un("hide", this.onHide, this);
		d.un("beforeshow", this.onBeforeShow, this);
		d.un("show", this.onShow, this)
	},
	registerCheckable : function(d) {
		var a = this.groups, b = d.group;
		if (b) {
			if (!a[b]) {
				a[b] = []
			}
			a[b].push(d)
		}
	},
	unregisterCheckable : function(d) {
		var a = this.groups, b = d.group;
		if (b) {
			a[b].remove(d)
		}
	},
	onCheckChange : function(e, g) {
		var a = this.groups, d = e.group, b = 0, j, f, h;
		if (d && g) {
			j = a[d];
			f = j.length;
			for (; b < f; b++) {
				h = j[b];
				if (h != e) {
					h.setChecked(false)
				}
			}
		}
	}
});
Ext
		.define(
				"Ext.menu.Item",
				{
					extend : "Ext.Component",
					alias : "widget.menuitem",
					activeCls : Ext.baseCSSPrefix + "menu-item-active",
					ariaRole : "menuitem",
					baseCls : Ext.baseCSSPrefix + "menu-item",
					canActivate : true,
					clickHideDelay : 1,
					destroyMenu : true,
					disabledCls : Ext.baseCSSPrefix + "menu-item-disabled",
					hideOnClick : true,
					isMenuItem : true,
					menuAlign : "tl-tr?",
					menuExpandDelay : 200,
					menuHideDelay : 200,
					renderTpl : [
							'<tpl if="plain">',
							"{text}",
							"</tpl>",
							'<tpl if="!plain">',
							'<a class="'
									+ Ext.baseCSSPrefix
									+ 'menu-item-link" href="{href}" <tpl if="hrefTarget">target="{hrefTarget}"</tpl> hidefocus="true" unselectable="on">',
							'<img src="{icon}" class="' + Ext.baseCSSPrefix
									+ 'menu-item-icon {iconCls}" />',
							'<span class="' + Ext.baseCSSPrefix
									+ 'menu-item-text">{text}</span>',
							'<tpl if="menu">',
							'<div class="' + Ext.baseCSSPrefix
									+ 'menu-item-arrow">&#160;</div>',
							"</tpl>",
							'<div class="' + Ext.baseCSSPrefix
									+ 'clear">&#160;</div>', "</a>", "</tpl>" ],
					activate : function() {
						if (!this.activated && this.canActivate
								&& this.rendered && !this.disabled) {
							this.el.addCls(this.activeCls);
							if (this.focus) {
								this.focus()
							}
							this.expandMenu();
							this.activated = true;
							this.fireEvent("activate", this)
						}
					},
					deactivate : function() {
						if (this.activated) {
							this.el.removeCls(this.activeCls);
							if (this.blur) {
								this.blur()
							}
							this.hideMenu();
							this.activated = false;
							this.fireEvent("deactivate", this)
						}
					},
					deferExpandMenu : function() {
						if (!this.menu.rendered || !this.menu.isVisible()) {
							this.menu.parentMenu = this.parentMenu;
							this.menu.showBy(this, this.menuAlign)
						}
					},
					deferHideMenu : function() {
						if (this.menu.isVisible()) {
							this.menu.hide()
						}
					},
					deferHideParentMenus : function() {
						var a = this.parentMenu;
						while (a && a.floating) {
							a.hide();
							a = a.parentMenu
						}
					},
					expandMenu : function() {
						if (this.menu) {
							if (this.hideMenuTimer) {
								clearTimeout(this.hideMenuTimer)
							}
							this.expandMenuTimer = Ext.defer(
									this.deferExpandMenu, this.menuExpandDelay,
									this)
						}
					},
					hideMenu : function() {
						if (this.menu) {
							if (this.expandMenuTimer) {
								clearTimeout(this.expandMenuTimer)
							}
							this.hideMenuTimer = Ext.defer(this.deferHideMenu,
									this.menuHideDelay, this)
						}
					},
					initComponent : function() {
						this.addEvents("activate", "click", "deactivate");
						if (this.plain) {
							this.baseCls += " " + Ext.baseCSSPrefix
									+ "menu-item-plain"
						}
						if (this.menu) {
							this.menu = Ext.menu.MenuMgr.get(this.menu);
							this.menu.parentItem = this
						}
						Ext.menu.Item.superclass.initComponent.call(this);
						if (this.handler) {
							this.on("click", this.handler, this.scope)
						}
					},
					onClick : function(a) {
						if (!this.href) {
							a.stopEvent()
						}
						if (this.disabled) {
							return
						}
						if (this.hideOnClick) {
							Ext.defer(this.deferHideParentMenus,
									this.clickHideDelay, this)
						}
						this.fireEvent("click", this, a)
					},
					onDestroy : function() {
						if (this.menu) {
							delete this.menu.ownerCt;
							if (this.destroyMenu !== false) {
								this.menu.destroy()
							}
						}
						Ext.menu.Item.superclass.onDestroy.call(this)
					},
					onDisable : function(a) {
						this.onDisableChange(true)
					},
					onDisableChange : function(a) {
						if (this.rendered) {
							this.el[a ? "addCls" : "removeCls"]
									(this.disabledCls)
						}
					},
					onEnable : function() {
						this.onDisableChange(false)
					},
					onRender : function(a, b) {
						Ext.applyIf(this.renderData, {
							href : this.href || "#",
							hrefTarget : this.hrefTarget,
							icon : this.icon || Ext.BLANK_IMAGE_URL,
							iconCls : this.iconCls,
							menu : Ext.isDefined(this.menu),
							plain : this.plain,
							text : this.text
						});
						Ext.applyIf(this.renderSelectors,
								{
									itemEl : "." + Ext.baseCSSPrefix
											+ "menu-item-link",
									iconEl : "." + Ext.baseCSSPrefix
											+ "menu-item-icon",
									textEl : "." + Ext.baseCSSPrefix
											+ "menu-item-text",
									arrowEl : "." + Ext.baseCSSPrefix
											+ "menu-item-arrow"
								});
						Ext.menu.Item.superclass.onRender.call(this, a, b)
					},
					shouldDeactivate : function(a) {
						var b = this.menu;
						if (b && b.rendered && b.isVisible()) {
							return !a.within(b.el, true, true)
						}
						return true
					},
					setHandler : function(b, a) {
						if (this.handler) {
							this.un("click", this.handler, this.scope);
							delete this.handler;
							delete this.scope
						}
						if (b) {
							this.on("click", this.handler = b, this.scope = a)
						}
					},
					setIconClass : function(a) {
						if (this.iconEl) {
							if (this.iconCls) {
								this.iconEl.removeCls(this.iconCls)
							}
							if (a) {
								this.iconEl.addCls(a)
							}
						}
						this.iconCls = a
					},
					setText : function(d) {
						var a = this.textEl || this.el;
						if (d && a) {
							a.update(d);
							if (this.textEl) {
								var b = this.textEl.getWidth()
										+ this.iconEl.getWidth()
										+ 25
										+ (this.arrowEl ? this.arrowEl
												.getWidth() : 0);
								if (b > this.itemEl.getWidth()) {
									this.parentMenu.setWidth(b)
								}
							}
						} else {
							if (a) {
								a.update("")
							}
						}
						this.text = d
					}
				});
Ext
		.define("Ext.menu.CheckItem",
				{
					extend : "Ext.menu.Item",
					alias : "widget.menucheckitem",
					checkedCls : Ext.baseCSSPrefix + "menu-item-checked",
					groupCls : Ext.baseCSSPrefix + "menu-group-item",
					uncheckedCls : Ext.baseCSSPrefix + "menu-item-unchecked",
					afterRender : function() {
						Ext.menu.CheckItem.superclass.afterRender.call(this);
						this.checked = !this.checked;
						this.setChecked(!this.checked, true)
					},
					initComponent : function() {
						this.addEvents("beforecheckchange", "checkchange");
						Ext.menu.MenuMgr.registerCheckable(this);
						if (this.group) {
							this.baseCls += " " + this.groupCls
						}
						Ext.menu.CheckItem.superclass.initComponent.call(this);
						if (this.checkHandler) {
							this.on("checkchange", this.checkHandler,
									this.scope)
						}
					},
					onClick : function(a) {
						if (!this.disabled && !(this.checked && this.group)) {
							this.setChecked(!this.checked)
						}
						Ext.menu.CheckItem.superclass.onClick.call(this, a)
					},
					onDestroy : function() {
						Ext.menu.MenuMgr.unregisterCheckable(this);
						Ext.menu.CheckItem.superclass.onDestroy.call(this)
					},
					setChecked : function(b, a) {
						if (this.checked != b
								&& (a || this.fireEvent("beforecheckchange",
										this, b) !== false)) {
							this.setIconClass(this[(b ? "" : "un")
									+ "checkedCls"]);
							this.checked = b;
							Ext.menu.MenuMgr.onCheckChange(this, b);
							if (!a) {
								this.fireEvent("checkchange", this, b)
							}
						}
					}
				});
Ext.define("Ext.menu.Menu", {
	extend : "Ext.container.Container",
	alias : "widget.menu",
	requires : [ "Ext.menu.MenuMgr", "Ext.menu.Item", "Ext.menu.CheckItem" ],
	allowOtherMenus : false,
	ariaRole : "menu",
	autoRender : true,
	baseCls : Ext.baseCSSPrefix + "menu",
	defaultAlign : "tl-bl?",
	floating : true,
	ignoreParentClicks : false,
	isMenu : true,
	minWidth : 120,
	hidden : true,
	renderTpl : [ '<div class="' + Ext.baseCSSPrefix
			+ 'menu-icon-separator">&#160;</div>' ],
	afterRender : function(a) {
		Ext.menu.Menu.superclass.afterRender.call(this, a);
		this.mon(this.el, {
			click : this.onClick,
			mouseout : this.onMouseOut,
			mouseover : this.onMouseOver,
			scope : this
		})
	},
	deactivateActiveItem : function() {
		if (this.activeItem) {
			this.activeItem.deactivate();
			if (!this.activeItem.activated) {
				delete this.activeItem
			}
		}
	},
	hide : function() {
		this.deactivateActiveItem();
		Ext.menu.Menu.superclass.hide.call(this)
	},
	initComponent : function() {
		this.addEvents("click", "mouseout", "mouseover");
		Ext.menu.MenuMgr.register(this);
		this.floatable = this.floating;
		if (this.floating) {
			this.baseCls += " " + Ext.baseCSSPrefix + "menu-floating"
		}
		if (this.plain) {
			this.baseCls += " " + Ext.baseCSSPrefix + "menu-plain"
		}
		this.layout = {
			type : "vbox",
			align : "stretchmax",
			autoSize : true,
			overflowHandler : {
				type : "Scroller"
			}
		};
		Ext.menu.Menu.superclass.initComponent.call(this)
	},
	itemFromEvent : function(b) {
		var a = b.getTarget("." + Ext.baseCSSPrefix + "menu-item");
		if (a) {
			return this.child("[id=" + a.id + "]")
		}
	},
	itemFromObject : function(b) {
		if (!b.isComponent) {
			if (!b.xtype) {
				b = new Ext.menu[(Ext.isBoolean(b.checked) ? "Check" : "")
						+ "Item"](b)
			} else {
				b = Ext.ComponentMgr.create(b, b.xtype)
			}
		}
		if (b.isMenuItem) {
			b.parentMenu = this
		}
		if (!b.isMenuItem) {
			var a = [ Ext.baseCSSPrefix + "menu-item" ];
			if (!this.plain && b.indent === true) {
				a.push(Ext.baseCSSPrefix + "menu-item-indent");
				if (b.ref) {
					b.ref += "../" + b.ref
				}
				b = new Ext.container.Container({
					items : [ b ],
					layout : "fit"
				})
			}
			if (b.rendered) {
				b.el.addCls(a)
			} else {
				b.cls = (b.cls ? b.cls : "") + " " + a.join(" ")
			}
			b.isMenuItem = true
		}
		return b
	},
	itemFromString : function(a) {
		return (a == "separator" || a == "-") ? Ext
				.createWidget("menuseparator") : Ext.createWidget("menuitem", {
			canActivate : false,
			hideOnClick : false,
			plain : true,
			text : a
		})
	},
	lookupComponent : function(a) {
		if (Ext.isString(a)) {
			a = this.itemFromString(a)
		} else {
			if (Ext.isObject(a)) {
				a = this.itemFromObject(a)
			}
		}
		return a
	},
	onClick : function(b) {
		var a = this.itemFromEvent(b);
		if (a) {
			if (a instanceof Ext.menu.Item) {
				if (!a.menu || !this.ignoreParentClicks) {
					a.onClick(b)
				} else {
					b.stopEvent()
				}
			}
		}
		this.fireEvent("click", this, a, b)
	},
	onDestroy : function() {
		Ext.menu.MenuMgr.unregister(this);
		Ext.menu.Menu.superclass.onDestroy.call(this)
	},
	onMouseOut : function(b) {
		var a = this.itemFromEvent(b);
		if (a && a == this.activeItem && this.activeItem.shouldDeactivate(b)) {
			this.deactivateActiveItem()
		}
		this.fireEvent("mouseout", this, a, b)
	},
	onMouseOver : function(b) {
		var a = this.itemFromEvent(b);
		if (a) {
			this.setActiveItem(a)
		}
		if (this.parentMenu) {
			this.parentMenu.setActiveItem(this.parentItem)
		}
		this.fireEvent("mouseover", this, a, b)
	},
	onRender : function(a, b) {
		Ext.applyIf(this.renderSelectors, {
			iconSepEl : "." + Ext.baseCSSPrefix + "menu-icon-separator"
		});
		Ext.menu.Menu.superclass.onRender.call(this, a, b)
	},
	setActiveItem : function(a) {
		if (a && a != this.activeItem) {
			this.deactivateActiveItem();
			if (a.activate) {
				a.activate();
				if (a.activated) {
					this.activeItem = a
				}
			}
		}
	},
	showBy : function(a, d, b) {
		if (this.floating && a) {
			this.show();
			a = a.el || a;
			this.showAt(this.el.getAlignToXY(a, d || this.defaultAlign, b))
		}
	}
});
Ext.define("Ext.util.ClickRepeater", {
	extend : "Ext.util.Observable",
	constructor : function(b, a) {
		this.el = Ext.get(b);
		this.el.unselectable();
		Ext.apply(this, a);
		this.addEvents("mousedown", "click", "mouseup");
		if (!this.disabled) {
			this.disabled = true;
			this.enable()
		}
		if (this.handler) {
			this.on("click", this.handler, this.scope || this)
		}
		Ext.util.ClickRepeater.superclass.constructor.call(this)
	},
	interval : 20,
	delay : 250,
	preventDefault : true,
	stopDefault : false,
	timer : 0,
	enable : function() {
		if (this.disabled) {
			this.el.on("mousedown", this.handleMouseDown, this);
			if (Ext.isIE) {
				this.el.on("dblclick", this.handleDblClick, this)
			}
			if (this.preventDefault || this.stopDefault) {
				this.el.on("click", this.eventOptions, this)
			}
		}
		this.disabled = false
	},
	disable : function(a) {
		if (a || !this.disabled) {
			clearTimeout(this.timer);
			if (this.pressClass) {
				this.el.removeCls(this.pressClass)
			}
			Ext.getDoc().un("mouseup", this.handleMouseUp, this);
			this.el.removeAllListeners()
		}
		this.disabled = true
	},
	setDisabled : function(a) {
		this[a ? "disable" : "enable"]()
	},
	eventOptions : function(a) {
		if (this.preventDefault) {
			a.preventDefault()
		}
		if (this.stopDefault) {
			a.stopEvent()
		}
	},
	destroy : function() {
		this.disable(true);
		Ext.destroy(this.el);
		this.clearListeners()
	},
	handleDblClick : function(a) {
		clearTimeout(this.timer);
		this.el.blur();
		this.fireEvent("mousedown", this, a);
		this.fireEvent("click", this, a)
	},
	handleMouseDown : function(a) {
		clearTimeout(this.timer);
		this.el.blur();
		if (this.pressClass) {
			this.el.addCls(this.pressClass)
		}
		this.mousedownTime = new Date();
		Ext.getDoc().on("mouseup", this.handleMouseUp, this);
		this.el.on("mouseout", this.handleMouseOut, this);
		this.fireEvent("mousedown", this, a);
		this.fireEvent("click", this, a);
		if (this.accelerate) {
			this.delay = 400
		}
		a = new Ext.EventObjectImpl(a);
		this.timer = Ext.defer(this.click, this.delay || this.interval, this,
				[ a ])
	},
	click : function(a) {
		this.fireEvent("click", this, a);
		this.timer = Ext.defer(this.click, this.accelerate ? this.easeOutExpo(
				Ext.Date.getElapsed(this.mousedownTime), 400, -390, 12000)
				: this.interval, this, [ a ])
	},
	easeOutExpo : function(e, a, g, f) {
		return (e == f) ? a + g : g * (-Math.pow(2, -10 * e / f) + 1) + a
	},
	handleMouseOut : function() {
		clearTimeout(this.timer);
		if (this.pressClass) {
			this.el.removeCls(this.pressClass)
		}
		this.el.on("mouseover", this.handleMouseReturn, this)
	},
	handleMouseReturn : function() {
		this.el.un("mouseover", this.handleMouseReturn, this);
		if (this.pressClass) {
			this.el.addCls(this.pressClass)
		}
		this.click()
	},
	handleMouseUp : function(a) {
		clearTimeout(this.timer);
		this.el.un("mouseover", this.handleMouseReturn, this);
		this.el.un("mouseout", this.handleMouseOut, this);
		Ext.getDoc().un("mouseup", this.handleMouseUp, this);
		this.el.removeCls(this.pressClass);
		this.fireEvent("mouseup", this, a)
	}
});
Ext
		.define(
				"Ext.layout.component.Button",
				{
					alias : [ "layout.button" ],
					extend : "Ext.layout.Component",
					type : "button",
					cellClsRE : /-btn-(tl|br)\b/,
					onLayout : function(b, l) {
						var i = this, g = Ext.isNumber, d = this.owner, j = d.el, h = d.btnEl, a = d.minWidth, k, f, e = i.frameSize;
						i.parent(arguments);
						k = (g(b) ? b - e.left - e.right : b);
						f = (g(l) ? l - e.top - e.bottom : l);
						i.setElementSize(h, k, f);
						if (a && !g(b)) {
							h.setStyle("width", "auto");
							if (j.getWidth() < a) {
								i.setElementSize(h, a - e.left - e.right, f)
							}
						}
					}
				});
Ext
		.define(
				"Ext.button.Button",
				{
					alias : "widget.button",
					extend : "Ext.Component",
					requires : [ "Ext.menu.MenuMgr", "Ext.util.ClickRepeater",
							"Ext.layout.component.Button" ],
					alternateClassName : "Ext.Button",
					isButton : true,
					componentLayout : "button",
					hidden : false,
					disabled : false,
					pressed : false,
					enableToggle : false,
					menuAlign : "tl-bl?",
					type : "button",
					menuClassTarget : "tr:nth(2)",
					clickEvent : "click",
					handleMouseEvents : true,
					tooltipType : "qtip",
					baseCls : Ext.baseCSSPrefix + "btn",
					ariaRole : "button",
					renderTpl : [ '<button type="{type}"<tpl if="tabIndex"> tabIndex="-1"</tpl> role="button">{text}</button>' ],
					scale : "small",
					ui : "default",
					iconAlign : "left",
					arrowAlign : "right",
					frame : true,
					initComponent : function() {
						var a = this;
						a.parent(arguments);
						a.addEvents("click", "toggle", "mouseover", "mouseout",
								"menushow", "menuhide", "menutriggerover",
								"menutriggerout");
						if (a.menu) {
							a.menu = Ext.menu.MenuMgr.get(a.menu)
						}
						if (Ext.isString(a.toggleGroup)) {
							a.enableToggle = true
						}
						a.cls = (a.cls || "") + " " + a.baseCls + "-" + a.ui;
						a.ui += "-" + a.scale;
						a.overCls = a.baseCls + "-" + a.ui + "-over";
						a.pressedCls = a.baseCls + "-" + a.ui + "-pressed";
						a.focusCls = a.baseCls + "-" + a.ui + "-focus"
					},
					initAria : function() {
						Ext.button.Button.superclass.initAria.call(this);
						var a = this.getActionEl();
						if (this.menu) {
							a.dom.setAttribute("aria-haspopup", true)
						}
					},
					getActionEl : function() {
						return this.btnEl
					},
					setButtonCls : function() {
						var d = this, b = d.el, a = d.tableEl, e = d.tbodyEl;
						if (d.useSetClass) {
							if (!Ext.isEmpty(d.oldCls)) {
								b.removeCls([ d.oldCls, d.baseCls + "-pressed",
										d.pressedCls ])
							}
							d.oldCls = (d.iconCls || d.icon) ? (d.text ? d.baseCls
									+ "-text-icon"
									: d.baseCls + "-icon")
									: d.baseCls + "-noicon";
							b
									.addCls([
											d.oldCls,
											d.pressed ? (d.baseCls
													+ "-pressed " + d.pressedCls)
													: null ])
						}
					},
					onRender : function(f, b) {
						var i = this, g = i.baseCls + "-" + i.scale, a = Ext.baseCSSPrefix
								+ i.ui, h = "", e, d;
						Ext
								.applyIf(
										i.renderData,
										{
											type : i.type,
											menuCls : i.menu ? (i.arrowAlign != "bottom" ? i.baseCls
													+ "-arrow"
													: i.baseCls
															+ "-arrow-bottom")
													: "",
											cls : i.cls,
											text : i.text || "&#160;",
											tabIndex : i.tabIndex
										});
						Ext.applyIf(i.renderSelectors, {
							btnEl : "button"
						});
						Ext.button.Button.superclass.onRender.call(i, f, b);
						i.mon(i.btnEl, {
							scope : i,
							focus : i.onFocus,
							blur : i.onBlur
						});
						d = i.el;
						if (i.icon) {
							i.setIcon(i.icon)
						}
						if (i.iconCls) {
							i.setIconClass(i.iconCls)
						}
						if (i.tooltip) {
							i.setTooltip(i.tooltip, true)
						}
						if (i.handleMouseEvents) {
							i.mon(d, {
								scope : i,
								mouseover : i.onMouseOver,
								mousedown : i.onMouseDown
							})
						}
						if (i.menu) {
							i.mon(i.menu, {
								scope : i,
								show : i.onMenuShow,
								hide : i.onMenuHide
							})
						}
						if (i.repeat) {
							e = new Ext.util.ClickRepeater(d, Ext
									.isObject(i.repeat) ? i.repeat : {});
							i.mon(e, "click", i.onRepeatClick, i)
						} else {
							i.mon(d, i.clickEvent, i.onClick, i)
						}
						Ext.ButtonToggleMgr.register(i)
					},
					afterRender : function() {
						var a = this;
						a.useSetClass = true;
						a.setButtonCls();
						a.doc = Ext.getDoc();
						this.parent(arguments)
					},
					setIconClass : function(a) {
						var b = this;
						b.iconCls = a;
						if (b.el) {
							b.btnEl.dom.className = "";
							b.btnEl.addCls([ b.baseCls + "-text", a || "" ]);
							b.setButtonCls()
						}
						return b
					},
					setTooltip : function(b, a) {
						if (this.rendered) {
							if (!a) {
								this.clearTip()
							}
							if (Ext.isObject(b)) {
								Ext.tip.QuickTips.register(Ext.apply({
									target : this.btnEl.id
								}, b));
								this.tooltip = b
							} else {
								this.btnEl.dom[this.tooltipType] = b
							}
						} else {
							this.tooltip = b
						}
						return this
					},
					clearTip : function() {
						if (Ext.isObject(this.tooltip)) {
							Ext.tip.QuickTips.unregister(this.btnEl)
						}
					},
					beforeDestroy : function() {
						if (this.rendered) {
							this.clearTip()
						}
						if (this.menu && this.destroyMenu !== false) {
							Ext.destroy(this.btnEl, this.menu)
						}
						Ext.destroy(this.repeater)
					},
					onDestroy : function() {
						if (this.rendered) {
							this.doc.un("mouseover", this.monitorMouseOver,
									this);
							this.doc.un("mouseup", this.onMouseUp, this);
							delete this.doc;
							delete this.btnEl;
							Ext.ButtonToggleMgr.unregister(this)
						}
						Ext.button.Button.superclass.onDestroy.call(this)
					},
					setHandler : function(b, a) {
						this.handler = b;
						this.scope = a;
						return this
					},
					setText : function(a) {
						this.text = a;
						if (this.el) {
							this.btnEl.update(a || "&#160;");
							this.setButtonCls()
						}
						this.doComponentLayout();
						return this
					},
					setIcon : function(a) {
						this.icon = a;
						if (this.el) {
							this.btnEl.setStyle("background-image", a ? "url("
									+ a + ")" : "");
							this.setButtonCls()
						}
						return this
					},
					getText : function() {
						return this.text
					},
					toggle : function(b, a) {
						b = b === undefined ? !this.pressed : !!b;
						if (b != this.pressed) {
							if (this.rendered) {
								this.el[b ? "addCls" : "removeCls"]
										([ me.baseCls + "-pressed",
												me.pressedCls ])
							}
							this.btnEl.dom.setAttribute("aria-pressed", b);
							this.pressed = b;
							if (!a) {
								this.fireEvent("toggle", this, b);
								if (this.toggleHandler) {
									this.toggleHandler.call(this.scope || this,
											this, b)
								}
							}
						}
						return this
					},
					onDisable : function() {
						this.onDisableChange(true)
					},
					onEnable : function() {
						this.onDisableChange(false)
					},
					onDisableChange : function(a) {
						if (this.el) {
							if (!Ext.isIE6 || !this.text) {
								this.el[a ? "addCls" : "removeCls"]
										(this.disabledClass)
							}
							this.el.dom.disabled = a
						}
						this.disabled = a
					},
					showMenu : function() {
						if (this.rendered && this.menu) {
							if (this.tooltip) {
								Ext.tip.QuickTips.getQuickTip().cancelShow(
										this.btnEl)
							}
							if (this.menu.isVisible()) {
								this.menu.hide()
							}
							if (!this.menu.ownerCt) {
								this.menu.ownerCt = this.ownerCt
							}
							this.menu.showBy(this.el, this.menuAlign)
						}
						return this
					},
					hideMenu : function() {
						if (this.hasVisibleMenu()) {
							this.menu.hide()
						}
						return this
					},
					hasVisibleMenu : function() {
						return this.menu && this.menu.rendered
								&& this.menu.isVisible()
					},
					onRepeatClick : function(a, b) {
						this.onClick(b)
					},
					onClick : function(b) {
						var a = this;
						if (b) {
							b.preventDefault()
						}
						if (b.button !== 0) {
							return
						}
						if (!a.disabled) {
							if (a.enableToggle
									&& (a.allowDepress !== false || !a.pressed)) {
								a.toggle()
							}
							if (a.menu && !a.hasVisibleMenu()
									&& !a.ignoreNextClick) {
								a.showMenu()
							}
							a.fireEvent("click", a, b);
							if (a.handler) {
								a.handler.call(a.scope || a, a, b)
							}
						}
					},
					isMenuTriggerOver : function(b, a) {
						return this.menu && !a
					},
					isMenuTriggerOut : function(b, a) {
						return this.menu && !a
					},
					onMouseOver : function(d) {
						var b = this, a;
						if (!b.disabled) {
							a = d.within(b.el, true);
							if (!a) {
								b.el.addCls([ b.baseCls + "-over", b.overCls ]);
								if (!b.monitoringMouseOver) {
									b.doc
											.on("mouseover",
													b.monitorMouseOver, b);
									b.monitoringMouseOver = true
								}
								b.fireEvent("mouseover", b, d)
							}
							if (b.isMenuTriggerOver(d, a)) {
								b.fireEvent("menutriggerover", b, b.menu, d)
							}
						}
					},
					monitorMouseOver : function(b) {
						var a = this;
						if (b.target != a.el.dom && !b.within(a.el)) {
							if (a.monitoringMouseOver) {
								a.doc.un("mouseover", a.monitorMouseOver, a);
								a.monitoringMouseOver = false
							}
							a.onMouseOut(b)
						}
					},
					onMouseOut : function(d) {
						var b = this, a = d.within(b.el)
								&& d.target != b.el.dom;
						b.el.removeCls([ b.baseCls + "-over", b.overCls ]);
						b.fireEvent("mouseout", b, d);
						if (b.isMenuTriggerOut(d, a)) {
							b.fireEvent("menutriggerout", b, b.menu, d)
						}
					},
					focus : function() {
						this.btnEl.focus()
					},
					blur : function() {
						this.btnEl.blur()
					},
					onFocus : function(b) {
						var a = this;
						if (!a.disabled) {
							a.el.addCls([ a.baseCls + "-focus", a.focusCls ])
						}
					},
					onBlur : function(b) {
						var a = this;
						a.el.removeCls([ a.baseCls + "-focus", a.focusCls ])
					},
					onMouseDown : function(b) {
						var a = this;
						if (!a.disabled && b.button === 0) {
							a.el
									.addCls([ a.baseCls + "-pressed",
											a.pressedCls ]);
							a.doc.on("mouseup", a.onMouseUp, a)
						}
					},
					onMouseUp : function(b) {
						var a = this;
						if (b.button === 0) {
							a.el.removeCls([ a.baseCls + "-pressed",
									a.pressedCls ]);
							a.doc.un("mouseup", a.onMouseUp, a)
						}
					},
					onMenuShow : function(b) {
						var a = this;
						a.ignoreNextClick = 0;
						a.el.addCls(a.baseCls + "-menu-active");
						a.fireEvent("menushow", a, a.menu)
					},
					onMenuHide : function(b) {
						var a = this;
						a.el.removeCls(a.baseCls + "-menu-active");
						a.ignoreNextClick = Ext.defer(a.restoreClick, 250, a);
						a.fireEvent("menuhide", a, a.menu)
					},
					restoreClick : function() {
						this.ignoreNextClick = 0
					}
				}, function() {
					Ext.ButtonToggleMgr = function() {
						var a = {}, f, e, b;
						function d(g, h) {
							if (h) {
								f = a[g.toggleGroup];
								for (e = 0, b = f.length; e < b; e++) {
									if (f[e] != g) {
										f[e].toggle(false)
									}
								}
							}
						}
						return {
							register : function(h) {
								if (!h.toggleGroup) {
									return
								}
								var i = a[h.toggleGroup];
								if (!i) {
									i = a[h.toggleGroup] = []
								}
								i.push(h);
								h.on("toggle", d)
							},
							unregister : function(h) {
								if (!h.toggleGroup) {
									return
								}
								var i = a[h.toggleGroup];
								if (i) {
									i.remove(h);
									h.un("toggle", d)
								}
							},
							getPressed : function(l) {
								var k = a[l];
								if (k) {
									for (var j = 0, h = k.length; j < h; j++) {
										if (k[j].pressed === true) {
											return k[j]
										}
									}
								}
								return null
							}
						}
					}()
				});
Ext
		.define(
				"Ext.layout.container.boxOverflow.Menu",
				{
					extend : "Ext.layout.container.boxOverflow.None",
					requires : [ "Ext.toolbar.Separator", "Ext.menu.Menu",
							"Ext.button.Button" ],
					afterCls : Ext.baseCSSPrefix + "strip-right",
					noItemsMenuText : '<div class="' + Ext.baseCSSPrefix
							+ 'toolbar-no-items">(None)</div>',
					constructor : function(a) {
						Ext.layout.container.boxOverflow.Menu.superclass.constructor
								.apply(this, arguments);
						this.menuItems = []
					},
					createInnerElements : function() {
						if (!this.afterCt) {
							this.afterCt = this.layout.innerCt.insertSibling({
								cls : this.afterCls
							}, "before")
						}
					},
					clearOverflow : function(a, g) {
						var f = g.width
								+ (this.afterCt ? this.afterCt.getWidth() : 0), b = this.menuItems;
						this.hideTrigger();
						for (var d = 0, e = b.length; d < e; d++) {
							b.pop().component.show()
						}
						return {
							targetSize : {
								height : g.height,
								width : f
							}
						}
					},
					showTrigger : function() {
						this.createMenu();
						this.menuTrigger.show()
					},
					hideTrigger : function() {
						if (this.menuTrigger != undefined) {
							this.menuTrigger.hide()
						}
					},
					beforeMenuShow : function(h) {
						var b = this.menuItems, a = b.length, g, f;
						var d = function(j, i) {
							return j.isXType("buttongroup")
									&& !(i instanceof Ext.toolbar.Separator)
						};
						this.clearMenu();
						h.removeAll();
						for (var e = 0; e < a; e++) {
							g = b[e].component;
							if (f && (d(g, f) || d(f, g))) {
								h.add("-")
							}
							this.addComponentToMenu(h, g);
							f = g
						}
						if (h.items.length < 1) {
							h.add(this.noItemsMenuText)
						}
					},
					createMenuConfig : function(d, a) {
						var b = Ext.apply({}, d.initialConfig), e = d.toggleGroup;
						Ext.copyTo(b, d, [ "iconCls", "icon", "itemId",
								"disabled", "handler", "scope", "menu" ]);
						Ext.apply(b, {
							text : d.overflowText || d.text,
							hideOnClick : a
						});
						if (e || d.enableToggle) {
							Ext.apply(b, {
								group : e,
								checked : d.pressed,
								listeners : {
									checkchange : function(g, f) {
										d.toggle(f)
									}
								}
							})
						}
						delete b.ownerCt;
						delete b.xtype;
						delete b.id;
						return b
					},
					addComponentToMenu : function(b, a) {
						if (a instanceof Ext.toolbar.Separator) {
							b.add("-")
						} else {
							if (Ext.isFunction(a.isXType)) {
								if (a.isXType("splitbutton")) {
									b.add(this.createMenuConfig(a, true))
								} else {
									if (a.isXType("button")) {
										b
												.add(this.createMenuConfig(a,
														!a.menu))
									} else {
										if (a.isXType("buttongroup")) {
											a.items.each(function(d) {
												this.addComponentToMenu(b, d)
											}, this)
										}
									}
								}
							}
						}
					},
					clearMenu : function() {
						var a = this.moreMenu;
						if (a && a.items) {
							a.items.each(function(b) {
								delete b.menu
							})
						}
					},
					createMenu : function() {
						if (!this.menuTrigger) {
							this.createInnerElements();
							this.menu = new Ext.menu.Menu({
								ownerCt : this.layout.container,
								listeners : {
									scope : this,
									beforeshow : this.beforeMenuShow
								}
							});
							this.menuTrigger = new Ext.button.Button({
								iconCls : Ext.baseCSSPrefix
										+ "toolbar-more-icon",
								cls : Ext.baseCSSPrefix + "toolbar-more",
								menu : this.menu,
								renderTo : this.afterCt
							})
						}
					},
					destroy : function() {
						Ext.destroy(this.menu, this.menuTrigger)
					}
				});
Ext
		.define(
				"Ext.layout.container.boxOverflow.HorizontalMenu",
				{
					extend : "Ext.layout.container.boxOverflow.Menu",
					constructor : function() {
						Ext.layout.container.boxOverflow.HorizontalMenu.superclass.superclass.constructor
								.apply(this, arguments);
						var d = this, b = d.layout, a = b.calculateChildBoxes;
						b.calculateChildBoxes = function(e, i) {
							var l = a.apply(b, arguments), k = l.meta, f = d.menuItems, g, h, j;
							j = 0;
							for (g = 0, h = f.length; g < h; g++) {
								j += f[g].width
							}
							k.minimumWidth += j;
							k.tooNarrow = k.minimumWidth > i.width;
							return l
						}
					},
					handleOverflow : function(e, h) {
						this.showTrigger();
						var k = h.width - this.afterCt.getWidth(), l = e.boxes, f = 0, r = false, o, d, a, g, n, m, b, j, q, p;
						for (o = 0, d = l.length; o < d; o++) {
							f += l[o].width
						}
						a = k - f;
						g = 0;
						for (o = 0, d = this.menuItems.length; o < d; o++) {
							n = this.menuItems[o];
							m = n.component;
							b = n.width;
							if (b < a) {
								m.show();
								a -= b;
								g++;
								r = true
							} else {
								break
							}
						}
						if (r) {
							this.menuItems = this.menuItems.slice(g)
						} else {
							for (j = l.length - 1; j >= 0; j--) {
								q = l[j].component;
								p = l[j].left + l[j].width;
								if (p >= k) {
									this.menuItems.unshift({
										component : q,
										width : l[j].width
									});
									q.hide()
								} else {
									break
								}
							}
						}
						if (this.menuItems.length == 0) {
							this.hideTrigger()
						}
						return {
							targetSize : {
								height : h.height,
								width : k
							},
							recalculate : r
						}
					}
				});
Ext
		.define(
				"Ext.layout.container.boxOverflow.Scroller",
				{
					extend : "Ext.layout.container.boxOverflow.None",
					requires : [ "Ext.util.ClickRepeater", "Ext.core.Element" ],
					animateScroll : true,
					scrollIncrement : 100,
					wheelIncrement : 3,
					scrollRepeatInterval : 400,
					scrollDuration : 0.4,
					beforeCls : Ext.baseCSSPrefix + "strip-left",
					afterCls : Ext.baseCSSPrefix + "strip-right",
					scrollerCls : Ext.baseCSSPrefix + "strip-scroller",
					beforeScrollerCls : Ext.baseCSSPrefix
							+ "strip-scroller-left",
					afterScrollerCls : Ext.baseCSSPrefix
							+ "strip-scroller-right",
					createWheelListener : function() {
						this.layout.innerCt.on({
							scope : this,
							mousewheel : function(a) {
								a.stopEvent();
								this.scrollBy(a.getWheelDelta()
										* this.wheelIncrement * -1, false)
							}
						})
					},
					handleOverflow : function(a, b) {
						this.createInnerElements();
						this.showScrollers()
					},
					clearOverflow : function() {
						this.hideScrollers()
					},
					showScrollers : function() {
						this.createScrollers();
						this.beforeScroller.show();
						this.afterScroller.show();
						this.updateScrollButtons()
					},
					hideScrollers : function() {
						if (this.beforeScroller != undefined) {
							this.beforeScroller.hide();
							this.afterScroller.hide()
						}
					},
					createScrollers : function() {
						if (!this.beforeScroller && !this.afterScroller) {
							var a = this.beforeCt.createChild({
								cls : Ext.String.format("{0} {1} ",
										this.scrollerCls,
										this.beforeScrollerCls)
							});
							var b = this.afterCt.createChild({
								cls : Ext.String
										.format("{0} {1}", this.scrollerCls,
												this.afterScrollerCls)
							});
							a.addClsOnOver(this.beforeScrollerCls + "-hover");
							b.addClsOnOver(this.afterScrollerCls + "-hover");
							a.setVisibilityMode(Ext.core.Element.DISPLAY);
							b.setVisibilityMode(Ext.core.Element.DISPLAY);
							this.beforeRepeater = new Ext.util.ClickRepeater(a,
									{
										interval : this.scrollRepeatInterval,
										handler : this.scrollLeft,
										scope : this
									});
							this.afterRepeater = new Ext.util.ClickRepeater(b,
									{
										interval : this.scrollRepeatInterval,
										handler : this.scrollRight,
										scope : this
									});
							this.beforeScroller = a;
							this.afterScroller = b
						}
					},
					destroy : function() {
						Ext.destroy(this.beforeScroller, this.afterScroller,
								this.beforeRepeater, this.afterRepeater,
								this.beforeCt, this.afterCt)
					},
					scrollBy : function(b, a) {
						this.scrollTo(this.getScrollPosition() + b, a)
					},
					getItem : function(a) {
						if (Ext.isString(a)) {
							a = Ext.getCmp(a)
						} else {
							if (Ext.isNumber(a)) {
								a = this.items[a]
							}
						}
						return a
					},
					getScrollAnim : function() {
						return {
							duration : this.scrollDuration,
							callback : this.updateScrollButtons,
							scope : this
						}
					},
					updateScrollButtons : function() {
						if (this.beforeScroller == undefined
								|| this.afterScroller == undefined) {
							return
						}
						var e = this.atExtremeBefore() ? "addCls" : "removeCls", d = this
								.atExtremeAfter() ? "addCls" : "removeCls", a = this.beforeScrollerCls
								+ "-disabled", b = this.afterScrollerCls
								+ "-disabled";
						this.beforeScroller[e](a);
						this.afterScroller[d](b);
						this.scrolling = false
					},
					atExtremeBefore : function() {
						return this.getScrollPosition() === 0
					},
					scrollLeft : function(a) {
						this.scrollBy(-this.scrollIncrement, a)
					},
					scrollRight : function(a) {
						this.scrollBy(this.scrollIncrement, a)
					},
					scrollToItem : function(e, b) {
						e = this.getItem(e);
						if (e != undefined) {
							var a = this.getItemVisibility(e);
							if (!a.fullyVisible) {
								var d = e.getBox(true, true), f = d.x;
								if (a.hiddenRight) {
									f -= (this.layout.innerCt.getWidth() - d.width)
								}
								this.scrollTo(f, b)
							}
						}
					},
					getItemVisibility : function(f) {
						var e = this.getItem(f).getBox(true, true), a = e.x, d = e.x
								+ e.width, g = this.getScrollPosition(), b = this.layout.innerCt
								.getWidth()
								+ g;
						return {
							hiddenLeft : a < g,
							hiddenRight : d > b,
							fullyVisible : a > g && d < b
						}
					}
				});
Ext
		.define(
				"Ext.layout.container.boxOverflow.HorizontalScroller",
				{
					extend : "Ext.layout.container.boxOverflow.Scroller",
					handleOverflow : function(a, b) {
						Ext.layout.container.boxOverflow.HorizontalScroller.superclass.superclass.handleOverflow
								.apply(this, arguments);
						return {
							targetSize : {
								height : b.height,
								width : b.width
										- (this.beforeCt.getWidth() + this.afterCt
												.getWidth())
							}
						}
					},
					createInnerElements : function() {
						var a = this.layout.innerCt;
						if (!this.beforeCt) {
							this.afterCt = a.insertSibling({
								cls : this.afterCls
							}, "before");
							this.beforeCt = a.insertSibling({
								cls : this.beforeCls
							}, "before");
							this.createWheelListener()
						}
					},
					scrollTo : function(a, b) {
						var e = this.getScrollPosition(), d = Ext.Number
								.constrain(a, 0, this.getMaxScrollRight());
						if (d != e && !this.scrolling) {
							if (b == undefined) {
								b = this.animateScroll
							}
							this.layout.innerCt.scrollTo("left", d, b ? this
									.getScrollAnim() : false);
							if (b) {
								this.scrolling = true
							} else {
								this.scrolling = false;
								this.updateScrollButtons()
							}
						}
					},
					getScrollPosition : function() {
						return parseInt(this.layout.innerCt.dom.scrollLeft, 10) || 0
					},
					getMaxScrollRight : function() {
						return this.layout.innerCt.dom.scrollWidth
								- this.layout.innerCt.getWidth()
					},
					atExtremeAfter : function() {
						return this.getScrollPosition() >= this
								.getMaxScrollRight()
					}
				});
Ext
		.define(
				"Ext.layout.container.boxOverflow.VerticalScroller",
				{
					extend : "Ext.layout.container.boxOverflow.Scroller",
					scrollIncrement : 75,
					wheelIncrement : 2,
					handleOverflow : function(a, b) {
						Ext.layout.container.boxOverflow.VerticalScroller.superclass.superclass.handleOverflow
								.apply(this, arguments);
						return {
							targetSize : {
								height : b.height
										- (this.beforeCt.getHeight() + this.afterCt
												.getHeight()),
								width : b.width
							}
						}
					},
					createInnerElements : function() {
						var a = this.layout.innerCt;
						if (!this.beforeCt) {
							this.beforeCt = a.insertSibling({
								cls : this.beforeCls
							}, "before");
							this.afterCt = a.insertSibling({
								cls : this.afterCls
							}, "after");
							this.createWheelListener()
						}
					},
					scrollTo : function(a, b) {
						var e = this.getScrollPosition(), d = Ext.Number
								.constrain(a, 0, this.getMaxScrollBottom());
						if (d != e && !this.scrolling) {
							if (b == undefined) {
								b = this.animateScroll
							}
							this.layout.innerCt.scrollTo("top", d, b ? this
									.getScrollAnim() : false);
							if (b) {
								this.scrolling = true
							} else {
								this.scrolling = false;
								this.updateScrollButtons()
							}
						}
					},
					getScrollPosition : function() {
						return parseInt(this.layout.innerCt.dom.scrollTop, 10) || 0
					},
					getMaxScrollBottom : function() {
						return this.layout.innerCt.dom.scrollHeight
								- this.layout.innerCt.getHeight()
					},
					atExtremeAfter : function() {
						return this.getScrollPosition() >= this
								.getMaxScrollBottom()
					}
				});
Ext
		.define(
				"Ext.layout.container.Box",
				{
					alias : [ "layout.box" ],
					extend : "Ext.layout.Container",
					requires : [
							"Ext.layout.container.boxOverflow.HorizontalMenu",
							"Ext.layout.container.boxOverflow.HorizontalScroller",
							"Ext.layout.container.boxOverflow.Menu",
							"Ext.layout.container.boxOverflow.None",
							"Ext.layout.container.boxOverflow.Scroller",
							"Ext.layout.container.boxOverflow.VerticalScroller",
							"Ext.util.Format" ],
					padding : "0",
					pack : "start",
					type : "box",
					scrollOffset : 0,
					itemCls : Ext.baseCSSPrefix + "box-item",
					targetCls : Ext.baseCSSPrefix + "box-layout-ct",
					innerCls : Ext.baseCSSPrefix + "box-inner",
					bindToOwnerCtContainer : true,
					fixedLayout : false,
					availableSpaceOffset : 0,
					clearInnerCtOnLayout : false,
					flexSortFn : function(e, d) {
						var f = "max" + this.parallelPrefixCap, g = Infinity;
						e = e.component[f] || g;
						d = d.component[f] || g;
						if (!isFinite(e) && !isFinite(d)) {
							return false
						}
						return e - d
					},
					minSizeSortFn : function(e, d) {
						return e.available > d.available ? 1 : -1
					},
					constructor : function(a) {
						Ext.layout.container.Box.superclass.constructor.call(
								this, a);
						this.flexSortFn = Ext.Function.bind(this.flexSortFn,
								this);
						if (Ext.isString(this.defaultMargins)) {
							this.defaultMargins = Ext.util.Format
									.parseBox(this.defaultMargins)
						} else {
							this.defaultMargins = this.defaultMargins || {}
						}
						Ext.applyIf(this.defaultMargins, {
							top : 0,
							left : 0,
							bottom : 0,
							right : 0
						});
						this.initOverflowHandler()
					},
					getChildBox : function(a) {
						a = a.el || this.owner.getComponent(a).el;
						return Ext.apply(this.innerCt.translatePoints(a
								.getLeft(), a.getTop()), {
							width : a.getWidth(),
							height : a.getHeight()
						})
					},
					calculateChildBox : function(j) {
						var g = this, f = g.getLayoutTargetSize(), a = g
								.getVisibleItems(), h = g.calculateChildBoxes(
								a, f), d = h.boxes, e = d.length, b = 0;
						j = g.owner.getComponent(j);
						for (; b < e; b++) {
							if (d[b].component === j) {
								return d[b]
							}
						}
					},
					calculateChildBoxes : function(p, b) {
						var A = this, L = Math, m = L.max, s = Infinity, r, u = A.parallelPrefix, o = A.parallelPrefixCap, O = A.perpendicularPrefix, v = A.perpendicularPrefixCap, al = "min"
								+ o, C = "min" + v, d = b[u] - A.scrollOffset, ac = b[O], ah = A.padding, t = ah[A.parallelBefore], w = t
								+ ah[A.parallelAfter], S = ah[A.perpendicularLeftTop], M = S
								+ ah[A.perpendicularRightBottom], aj = m(0, ac
								- M), ae = A.pack == "start", ao = A.pack == "center", H = A.pack == "end", ag = Ext.Number.constrain, P = p.length, e = 0, ak = 0, am = 0, z = 0, I = 0, T = [], N = [], ai, j, ad, E, F, an, ab, Z, aa, n, f, D, K, B, Q, k, U, af, g, G, W, a, q, l, J, V, Y, h, X;
						for (ai = 0; ai < P; ai++) {
							j = p[ai];
							E = j[O];
							A.layoutItem(j);
							if (j.flex) {
								ak += j.flex;
								ad = r
							} else {
								if (!(j[u] && E)) {
									an = j.getSize()
								}
								ad = j[u] || an[u];
								E = E || an[O]
							}
							F = j.margins;
							J = F[A.parallelBefore] + F[A.parallelAfter];
							e += J + (ad || 0);
							am += J + (j.flex ? j[al] || 0 : ad);
							z += J + (j[al] || ad || 0);
							if (typeof E != "number") {
								E = j["get" + v]()
							}
							I = m(I, E + F[A.perpendicularLeftTop]
									+ F[A.perpendicularRightBottom]);
							Z = {
								component : j,
								margins : F
							};
							Z[u] = ad || r;
							Z[O] = E || r;
							T.push(Z)
						}
						aa = am - d;
						n = z > d;
						f = m(0, d - e - w - this.availableSpaceOffset);
						if (n) {
							for (ai = 0; ai < P; ai++) {
								T[ai][u] = p[ai][al] || p[ai][u] || T[ai][u]
							}
						} else {
							if (aa > 0) {
								for (ai = 0; ai < P; ai++) {
									K = p[ai];
									D = K[al] || 0;
									if (K.flex) {
										T[ai][u] = D
									} else {
										N.push({
											minSize : D,
											available : T[ai][u] - D,
											index : ai
										})
									}
								}
								N.sort(A.minSizeSortFn);
								for (ai = 0, B = N.length; ai < B; ai++) {
									Q = N[ai].index;
									if (Q == r) {
										continue
									}
									K = p[Q];
									D = K.minSize;
									k = T[Q];
									U = k[u];
									af = m(D, U - L.ceil(aa / (B - ai)));
									g = U - af;
									T[Q][u] = af;
									aa -= g
								}
							} else {
								a = f;
								q = ak;
								W = [];
								for (ai = 0; ai < P; ai++) {
									j = p[ai];
									if (ae && j.flex) {
										W.push(T[Ext.Array.indexOf(p, j)])
									}
								}
								W.sort(A.flexSortFn);
								for (ai = 0; ai < W.length; ai++) {
									V = W[ai];
									j = V.component;
									F = V.margins;
									J = F[A.parallelBefore]
											+ F[A.parallelAfter];
									l = L.ceil((j.flex / q) * a);
									l = L.min(j["max" + o] || s, l);
									a -= l;
									q -= j.flex;
									V[u] = l;
									V.dirtySize = true
								}
							}
						}
						if (ao) {
							t += f / 2
						} else {
							if (H) {
								t += f
							}
						}
						for (ai = 0; ai < P; ai++) {
							j = p[ai];
							V = T[ai];
							F = V.margins;
							h = F[A.perpendicularLeftTop]
									+ F[A.perpendicularRightBottom];
							V[A.parallelBefore] = t;
							V[A.perpendicularLeftTop] = S;
							if (A.align == "stretch") {
								X = aj - h;
								V[O] = ag(X, j[C] || 0, j[C] || s);
								V.dirtySize = true
							} else {
								if (A.align == "stretchmax") {
									X = I - h;
									V[O] = ag(X, j[C] || 0, j[C] || s);
									V.dirtySize = true
								} else {
									if (A.align == A.alignCenteringString) {
										G = m(aj, I) - V[O] - h;
										if (G > 0) {
											V[A.perpendicularLeftTop] = S + h
													+ (G / 2)
										}
									}
								}
							}
							t += (V[u] || 0) + F[A.parallelBefore]
									+ F[A.parallelAfter]
						}
						return {
							boxes : T,
							meta : {
								maxSize : I,
								nonFlexSize : e,
								desiredSize : am,
								minimumSize : z,
								shortfall : am - d,
								tooNarrow : n
							}
						}
					},
					initOverflowHandler : function() {
						var d = this.overflowHandler;
						if (typeof d == "string") {
							d = {
								type : d
							}
						}
						var b = "None";
						if (d && d.type != undefined) {
							b = Ext.String.capitalize(d.type)
						}
						var a = Ext.layout.container.boxOverflow[b];
						if (a[this.type]) {
							a = a[this.type]
						}
						this.overflowHandler = new a(this, d)
					},
					onLayout : function() {
						Ext.layout.container.Box.superclass.onLayout.call(this);
						if (this.clearInnerCtOnLayout === true
								&& this.adjustmentPass !== true) {
							this.innerCt.setSize(null, null)
						}
						var h = this, d = h.getLayoutTargetSize(), g = h
								.getVisibleItems(), b = h.calculateChildBoxes(
								g, d), f = b.boxes, i = b.meta, j, a, e;
						if (h.autoSize && b.meta.desiredSize) {
							d[h.parallelPrefix] = b.meta.desiredSize
						}
						if (d.shortfall > 0) {
							j = h.overflowHandler;
							a = i.tooNarrow ? "handleOverflow"
									: "clearOverflow";
							e = j[a](b, d);
							if (e) {
								if (e.targetSize) {
									d = e.targetSize
								}
								if (e.recalculate) {
									g = h.getVisibleItems(owner);
									b = h.calculateChildBoxes(g, d);
									f = b.boxes
								}
							}
						}
						h.layoutTargetLastSize = d;
						h.childBoxCache = b;
						h.updateInnerCtSize(d, b);
						if (!h.handleTargetOverflow(d)) {
							h.updateChildBoxes(f)
						}
					},
					updateChildBoxes : function(h) {
						var m = this, f = 0, d = h.length, a, g, e, j, k, b, p = [], o = Ext.dd.DDM
								.getDDById(this.innerCt.id);
						for (; f < d; f++) {
							g = h[f];
							j = g.component;
							if (o && (o.getDragEl() === j.el.dom)) {
								continue
							}
							e = false;
							if (j.boxAnim && j.boxAnim.running) {
								j.boxAnim.end()
							}
							if (m.animate) {
								a = m.getChildBox(j);
								b = m.animate.callback || m.animate;
								k = {
									target : j,
									from : {},
									to : {}
								};
								if (!isNaN(g.width) && (g.width != a.width)) {
									e = true;
									k.from.width = a.width;
									k.to.width = g.width
								} else {
									j.width = a.width
								}
								if (!isNaN(g.height) && (g.height != a.height)) {
									e = true;
									k.from.height = a.height;
									k.to.height = g.height
								} else {
									j.height = a.height
								}
								if (!isNaN(g.left) && (g.left != a.left)) {
									e = true;
									k.from.left = a.left;
									k.to.left = g.left
								}
								if (!isNaN(g.top) && (g.top != a.top)) {
									e = true;
									k.from.top = a.top;
									k.to.top = g.top
								}
								if (e) {
									p.push(k)
								}
							} else {
								if (g.dirtySize) {
									j.setCalculatedSize(g.width, g.height,
											m.owner)
								}
								if (isNaN(g.left) || isNaN(g.top)) {
									continue
								}
								j.setPosition(g.left, g.top)
							}
						}
						d = p.length;
						if (d) {
							var n = function(i) {
								j = i.target.target;
								delete j.boxAnim;
								if (j.flex) {
									delete j[m.parallelPrefix]
								}
								if ((m.align == "stretch")
										|| (m.align == "stretchmax")) {
									delete j[m.perpendicularPrefix]
								}
								d -= 1;
								if (!d) {
									delete m.layoutBusy;
									if (Ext.isFunction(b)) {
										b()
									}
								}
							};
							var l = function() {
								m.layoutBusy = true
							};
							for (f = 0, d = p.length; f < d; f++) {
								k = p[f];
								k.listeners = {
									afteranimate : n
								};
								if (!f) {
									k.listeners.beforeanimate = l
								}
								if (m.animate.duration) {
									k.duration = m.animate.duration
								}
								j.boxAnim = new Ext.fx.Anim(k)
							}
						}
					},
					updateInnerCtSize : function(d, a) {
						var h = this, f = Math.max, g = h.align, i = h.padding, b = d.width, k = d.height, e, j;
						if (h.direction == "horizontal") {
							e = b;
							j = a.meta.maxSize + i.top + i.bottom;
							if (g == "stretch") {
								j = k
							} else {
								if (g == "middle") {
									j = f(k, j)
								}
							}
						} else {
							j = k;
							e = a.meta.maxSize + i.left + i.right;
							if (g == "stretch") {
								e = b
							} else {
								if (g == "center") {
									e = f(b, e)
								}
							}
						}
						h.getRenderTarget().setSize(e || undefined,
								j || undefined)
					},
					handleTargetOverflow : function(d) {
						var b = this.getTarget(), e = b.getStyle("overflow"), a;
						if (e && e != "hidden" && !this.adjustmentPass) {
							a = this.getLayoutTargetSize();
							if (a.width != d.width || a.height != d.height) {
								this.adjustmentPass = true;
								this.onLayout()
							}
							return true
						}
						delete this.adjustmentPass
					},
					isValidParent : function(d, e, a) {
						var b = d.el ? d.el.dom : Ext.getDom(d);
						return (b && this.innerCt && b.parentNode === this.innerCt.dom) || false
					},
					getRenderTarget : function() {
						if (!this.innerCt) {
							this.innerCt = this.getTarget().createChild({
								cls : this.innerCls,
								role : "presentation"
							});
							this.padding = Ext.util.Format
									.parseBox(this.padding)
						}
						return this.innerCt
					},
					renderItem : function(b, d) {
						var a;
						Ext.layout.container.Box.superclass.renderItem.apply(
								this, arguments);
						if (Ext.isString(b.margins)) {
							b.margins = Ext.util.Format.parseBox(b.margins)
						} else {
							if (!b.margins) {
								a = b.getEl();
								b.margins = {
									top : a.getMargin("t")
											|| this.defaultMargins.top,
									right : a.getMargin("r")
											|| this.defaultMargins.right,
									bottom : a.getMargin("b")
											|| this.defaultMargins.bottom,
									left : a.getMargin("l")
											|| this.defaultMargins.left
								}
							}
						}
					},
					destroy : function() {
						Ext.destroy(this.overflowHandler);
						Ext.layout.container.Box.superclass.destroy.apply(this,
								arguments)
					}
				});
Ext.define("Ext.layout.container.HBox", {
	alias : [ "layout.hbox" ],
	extend : "Ext.layout.container.Box",
	align : "top",
	alignCenteringString : "middle",
	type : "hbox",
	direction : "horizontal",
	parallelPrefix : "width",
	parallelPrefixCap : "Width",
	parallelLT : "l",
	parallelRB : "r",
	parallelBefore : "left",
	parallelAfter : "right",
	perpendicularPrefix : "height",
	perpendicularPrefixCap : "Height",
	perpendicularLT : "t",
	perpendicularRB : "b",
	perpendicularLeftTop : "top",
	perpendicularRightBottom : "bottom"
});
Ext.define("Ext.layout.container.VBox", {
	alias : [ "layout.vbox" ],
	extend : "Ext.layout.container.Box",
	align : "left",
	alignCenteringString : "center",
	type : "vbox",
	direction : "vertical",
	parallelPrefix : "height",
	parallelPrefixCap : "Height",
	parallelLT : "t",
	parallelRB : "b",
	parallelBefore : "top",
	parallelAfter : "bottom",
	perpendicularPrefix : "width",
	perpendicularPrefixCap : "Width",
	perpendicularLT : "l",
	perpendicularRB : "r",
	perpendicularLeftTop : "left",
	perpendicularRightBottom : "right"
});
Ext.define("Ext.toolbar.Toolbar", {
	extend : "Ext.container.Container",
	requires : [ "Ext.toolbar.Fill", "Ext.layout.container.HBox",
			"Ext.layout.container.VBox" ],
	alias : "widget.toolbar",
	alternateClassName : "Ext.Toolbar",
	isToolbar : true,
	layout : "hbox",
	vertical : false,
	defaultType : "button",
	enableOverflow : false,
	trackMenus : true,
	internalDefaults : {
		removeMode : "container",
		hideParent : true
	},
	baseCls : "x-toolbar",
	ariaRole : "toolbar",
	ui : "default",
	initComponent : function() {
		var a = this;
		if (a.vertical) {
			a.layout = {
				type : "vbox",
				align : "stretchmax"
			}
		}
		Ext.toolbar.Toolbar.superclass.initComponent.call(a);
		a.addEvents("overflowchange")
	},
	initAria : function() {
		Ext.toolbar.Toolbar.superclass.initAria.call(this)
	},
	lookupComponent : function(b) {
		if (Ext.isString(b)) {
			var a = Ext.toolbar.Toolbar.shortcuts[b];
			if (a) {
				b = {
					xtype : a
				}
			} else {
				b = {
					xtype : "tbtext",
					text : b
				}
			}
			this.applyDefaults(b)
		}
		return Ext.toolbar.Toolbar.superclass.lookupComponent.call(this, b)
	},
	applyDefaults : function(b) {
		if (!Ext.isString(b)) {
			b = Ext.toolbar.Toolbar.superclass.applyDefaults.call(this, b);
			var a = this.internalDefaults;
			if (b.events) {
				Ext.applyIf(b.initialConfig, a);
				Ext.apply(b, a)
			} else {
				Ext.applyIf(b, a)
			}
		}
		return b
	},
	trackMenu : function(d, a) {
		if (this.trackMenus && d.menu) {
			var e = a ? "mun" : "mon", b = this;
			b[e](d, "menutriggerover", b.onButtonTriggerOver, b);
			b[e](d, "menushow", b.onButtonMenuShow, b);
			b[e](d, "menuhide", b.onButtonMenuHide, b)
		}
	},
	constructButton : function(a) {
		return a.events ? a : this.createComponent(a, a.split ? "splitbutton"
				: this.defaultType)
	},
	onAdd : function(a) {
		Ext.toolbar.Toolbar.superclass.onAdd.call(this);
		this.trackMenu(a);
		if (this.disabled) {
			a.disable()
		}
	},
	onRemove : function(a) {
		Ext.toolbar.Toolbar.superclass.onRemove.call(this);
		this.trackMenu(a, true)
	},
	onDisable : function() {
		this.items.each(function(a) {
			if (a.disable) {
				a.disable()
			}
		})
	},
	onEnable : function() {
		this.items.each(function(a) {
			if (a.enable) {
				a.enable()
			}
		})
	},
	onButtonTriggerOver : function(a) {
		if (this.activeMenuBtn && this.activeMenuBtn != a) {
			this.activeMenuBtn.hideMenu();
			a.showMenu();
			this.activeMenuBtn = a
		}
	},
	onButtonMenuShow : function(a) {
		this.activeMenuBtn = a
	},
	onButtonMenuHide : function(a) {
		delete this.activeMenuBtn
	}
}, function() {
	this.shortcuts = {
		"-" : "tbseparator",
		" " : "tbspacer",
		"->" : "tbfill"
	}
});
Ext
		.define(
				"Ext.AbstractPanel",
				{
					extend : "Ext.container.Container",
					requires : [ "Ext.util.MixedCollection",
							"Ext.core.Element", "Ext.toolbar.Toolbar" ],
					baseCls : Ext.baseCSSPrefix + "panel",
					isPanel : true,
					componentLayout : "dock",
					renderTpl : [ '<div class="{baseCls}-body<tpl if="bodyCls"> {bodyCls}</tpl>"<tpl if="bodyStyle"> style="{bodyStyle}"</tpl>></div>' ],
					initComponent : function() {
						this.addEvents("bodyresize");
						Ext.applyIf(this.renderSelectors, {
							body : "." + this.baseCls + "-body"
						});
						Ext.AbstractPanel.superclass.initComponent.call(this)
					},
					initItems : function() {
						Ext.AbstractPanel.superclass.initItems.call(this);
						var a = this.dockedItems;
						this.dockedItems = new Ext.util.MixedCollection(false,
								this.getComponentId);
						if (a) {
							this.addDocked(a)
						}
					},
					getDockedComponent : function(a) {
						if (Ext.isObject(a)) {
							a = a.getItemId()
						}
						return this.dockedItems.get(a)
					},
					getComponent : function(a) {
						var b = Ext.AbstractPanel.superclass.getComponent.call(
								this, a);
						if (b == undefined && !Ext.isNumber(a)) {
							b = this.getDockedComponent(a)
						}
						return b
					},
					initBodyStyles : function() {
						var a = Ext.isString(this.bodyStyle) ? this.bodyStyle
								.split(";") : [], b = Ext.core.Element;
						if (this.bodyPadding != undefined) {
							a
									.push("padding: "
											+ b
													.unitizeBox((this.bodyPadding === true) ? 5
															: this.bodyPadding))
						}
						if (this.bodyMargin != undefined) {
							a
									.push("margin: "
											+ b
													.unitizeBox((this.bodyMargin === true) ? 5
															: this.bodyMargin))
						}
						if (this.bodyBorder != undefined) {
							a
									.push("border-width: "
											+ b
													.unitizeBox((this.bodyBorder === true) ? 1
															: this.bodyBorder))
						}
						delete this.bodyStyle;
						return a.length ? a.join(";") : undefined
					},
					initRenderData : function() {
						return Ext.applyIf(
								Ext.AbstractPanel.superclass.initRenderData
										.call(this), {
									bodyStyle : this.initBodyStyles(),
									bodyCls : this.bodyCls
								})
					},
					addDocked : function(a, g) {
						var f = this, e, b, d;
						a = f.prepareItems(a);
						for (b = 0, d = a.length; b < d; b++) {
							e = a[b];
							e.dock = e.dock || "top";
							if (f.border === false) {
								e.cls = e.cls || " " + f.baseCls
										+ "-noborder-docked-" + e.dock
							}
							if (g !== undefined) {
								f.dockedItems.insert(g + b, e)
							} else {
								f.dockedItems.add(e)
							}
							e.onAdded(f, b);
							f.onDockedAdd(e)
						}
						if (f.rendered) {
							f.doComponentLayout()
						}
						return a
					},
					onDockedAdd : Ext.emptyFn,
					onDockedRemove : Ext.emptyFn,
					insertDocked : function(b, a) {
						this.addDocked(a, b)
					},
					removeDocked : function(e, b) {
						if (!this.dockedItems.contains(e)) {
							return e
						}
						var d = this.componentLayout, a = d && this.rendered;
						if (a) {
							d.onRemove(e)
						}
						this.dockedItems.remove(e);
						e.onRemoved();
						this.onDockedRemove(e);
						if (b === true || (b !== false && this.autoDestroy)) {
							e.destroy()
						}
						if (a && !b) {
							d.afterRemove(e)
						}
						this.doComponentLayout();
						return e
					},
					getDockedItems : function() {
						if (this.dockedItems && this.dockedItems.items.length) {
							return this.dockedItems.items.slice()
						}
						return []
					},
					getTargetEl : function() {
						return this.body
					},
					getRefItems : function(a) {
						var g = Ext.AbstractPanel.superclass.getRefItems.call(
								this, a), d = this.getDockedItems(), f = d.length, b = 0, e;
						g = g.concat(d);
						if (a) {
							for (; b < f; b++) {
								e = d[b];
								if (e.getRefItems) {
									g = g.concat(e.getRefItems(true))
								}
							}
						}
						return g
					},
					beforeDestroy : function() {
						var b = this.dockedItems, a;
						if (b) {
							while ((a = b.first())) {
								this.removeDocked(a, true)
							}
						}
						Ext.AbstractPanel.superclass.beforeDestroy.call(this)
					}
				});
Ext
		.define(
				"Ext.panel.Header",
				{
					extend : "Ext.container.Container",
					requires : [ "Ext.Component" ],
					uses : [ "Ext.panel.Tool", "Ext.draw.Component" ],
					alias : "widget.header",
					isHeader : true,
					defaultType : "tool",
					indicateDrag : false,
					indicateDragCls : Ext.baseCSSPrefix + "window-draggable",
					renderTpl : [ '<div class="{baseCls}-body<tpl if="ui"> {baseCls}-body-{ui}</tpl>"<tpl if="bodyStyle"> style="{bodyStyle}"</tpl>></div>' ],
					altRenderTpl : [ '<div class="{baseCls}-wrapper">',
							'<div class="{baseCls}-tl">',
							'<div class="{baseCls}-tr">',
							'<div class="{baseCls}-tc"></div>', "</div>",
							"</div>", '<div class="{baseCls}-ml">',
							'<div class="{baseCls}-mr">',
							'<div class="{baseCls}-mc"></div>', "</div>",
							"</div>", '<div class="{baseCls}-bl">',
							'<div class="{baseCls}-br">',
							'<div class="{baseCls}-bc"></div>', "</div>",
							"</div>", "</div>" ],
					initComponent : function() {
						var a = this;
						a.title = a.title || "&#160;";
						a.tools = a.tools || [];
						a.items = a.items || [];
						a.renderData.orientation = a.orientation;
						if (!Ext.supports.CSS3BorderRadius) {
							a.renderTpl = a.altRenderTpl;
							Ext.applyIf(a.renderSelectors, {
								body : "." + a.baseCls + "-mc"
							})
						} else {
							Ext.applyIf(a.renderSelectors, {
								body : "." + a.baseCls + "-body"
							})
						}
						if (!Ext.isEmpty(a.iconCls)) {
							a.initIconCmp();
							a.items.push(a.iconCmp)
						}
						if (a.orientation == "vertical") {
							a.layout = {
								type : "vbox",
								align : "center",
								clearInnerCtOnLayout : true
							};
							a.titleCmp = new Ext.draw.Component({
								ariaRole : "heading",
								items : [ {
									cls : a.cls + "-text",
									type : "text",
									text : a.title,
									rotate : {
										degrees : 270
									}
								} ],
								renderSelectors : {
									textEl : "." + a.baseCls + "-text"
								}
							})
						} else {
							a.layout = {
								type : "hbox",
								align : "middle",
								clearInnerCtOnLayout : true
							};
							a.titleCmp = new Ext.Component(
									{
										xtype : "component",
										ariaRole : "heading",
										renderTpl : [ '<span class="{cls}-text">{title}</span>' ],
										renderData : {
											title : a.title,
											cls : a.baseCls
										},
										renderSelectors : {
											textEl : "." + a.baseCls + "-text"
										}
									})
						}
						a.items.push(a.titleCmp);
						a.items.push({
							xtype : "component",
							html : "&nbsp;",
							flex : 1
						});
						a.items = a.items.concat(a.tools);
						Ext.panel.Header.superclass.initComponent.call(a)
					},
					initIconCmp : function() {
						this.iconCmp = new Ext.Component(
								{
									renderTpl : [ '<img alt="" src="{blank}" class="{cls}-icon {iconCls}"/>' ],
									renderData : {
										blank : Ext.BLANK_IMAGE_URL,
										cls : this.baseCls,
										iconCls : this.iconCls,
										orientation : this.orientation
									},
									renderSelectors : {
										iconEl : "." + this.baseCls + "-icon"
									},
									iconCls : this.iconCls
								})
					},
					afterRender : function() {
						this.el.unselectable();
						if (this.indicateDrag) {
							this.el.addCls(this.indicateDragCls)
						}
						Ext.panel.Header.superclass.afterRender.call(this)
					},
					getTargetEl : function() {
						return this.body || this.frameBody || this.el
					},
					setTitle : function(a) {
						this.title = a || "";
						this.titleCmp.textEl.update(this.title)
					},
					setIconClass : function(a) {
						this.iconCls = a;
						if (!this.iconCmp) {
							this.initIconCmp();
							this.insert(0, this.iconCmp)
						} else {
							if (!a || a == "") {
								this.iconCmp.destroy()
							} else {
								var d = this.iconCmp, b = d.iconEl;
								b.removeCls(d.iconCls);
								b.addCls(a);
								d.iconCls = a
							}
						}
					},
					addTool : function(a) {
						this.tools.push(a);
						this.add(a)
					}
				});
Ext
		.define(
				"Ext.util.KeyMap",
				{
					alternateClassName : "Ext.KeyMap",
					constructor : function(b, e, a) {
						var d = this;
						Ext.apply(d, {
							el : Ext.get(b),
							eventName : a || d.eventName,
							bindings : []
						});
						if (e) {
							d.addBinding(e)
						}
						d.enable()
					},
					eventName : "keydown",
					addBinding : function(h) {
						if (Ext.isArray(h)) {
							Ext.each(h, this.addBinding, this);
							return
						}
						var g = h.key, j = false, e, f, b, d, a;
						if (Ext.isString(g)) {
							f = [];
							b = g.toLowerCase();
							for (d = 0, a = b.length; d < a; ++d) {
								f.push(b.charCodeAt(d))
							}
							g = f;
							j = true
						}
						if (!Ext.isArray(g)) {
							g = [ g ]
						}
						if (!j) {
							for (d = 0, a = g.length; d < a; ++d) {
								e = g[d];
								if (Ext.isString(e)) {
									g[d] = e.toLowerCase().charCodeAt(0)
								}
							}
						}
						this.bindings.push(Ext.apply({
							keyCode : g
						}, h))
					},
					handleKeyDown : function(d) {
						if (this.enabled) {
							var e = this.bindings, b = 0, a = e.length;
							d = this.processEvent(d);
							for (; b < a; ++b) {
								this.processBinding(e[b], d)
							}
						}
					},
					processEvent : function(a) {
						return a
					},
					processBinding : function(f, a) {
						if (this.checkModifiers(f, a)) {
							var g = a.getKey(), j = f.fn || f.handler, k = f.scope
									|| this, h = f.keyCode, b = f.defaultEventAction, d, e;
							for (d = 0, e = h.length; d < e; ++d) {
								if (g === h[d]) {
									if (b) {
										a[b]()
									}
									j.call(k, g, a);
									break
								}
							}
						}
					},
					checkModifiers : function(j, g) {
						var f = [ "shift", "ctrl", "alt" ], d = 0, a = f.length, h, b;
						for (; d < a; ++d) {
							b = f[d];
							h = j[b];
							if (!(h === undefined || (h === g[b + "Key"]))) {
								return false
							}
						}
						return true
					},
					on : function(b, e, d) {
						var h, a, f, g;
						if (Ext.isObject(b) && !Ext.isArray(b)) {
							h = b.key;
							a = b.shift;
							f = b.ctrl;
							g = b.alt
						} else {
							h = b
						}
						this.addBinding({
							key : h,
							shift : a,
							ctrl : f,
							alt : g,
							fn : e,
							scope : d
						})
					},
					isEnabled : function() {
						return this.enabled
					},
					enable : function() {
						if (!this.enabled) {
							this.el
									.on(this.eventName, this.handleKeyDown,
											this);
							this.enabled = true
						}
					},
					disable : function() {
						if (this.enabled) {
							this.el.removeListener(this.eventName,
									this.handleKeyDown, this);
							this.enabled = false
						}
					},
					setDisabled : function(a) {
						if (a) {
							this.disable()
						} else {
							this.enable()
						}
					},
					destroy : function(b) {
						var a = this;
						a.bindings = [];
						a.disable();
						if (b === true) {
							a.el.remove()
						}
						delete a.el
					}
				});
Ext.define("Ext.dd.DragDropMgr", {
	singleton : true,
	requires : [ "Ext.util.Region" ],
	uses : [ "Ext.tip.QuickTips" ],
	alternateClassName : "Ext.dd.DDM",
	ids : {},
	handleIds : {},
	dragCurrent : null,
	dragOvers : {},
	deltaX : 0,
	deltaY : 0,
	preventDefault : true,
	stopPropagation : true,
	initialized : false,
	locked : false,
	init : function() {
		this.initialized = true
	},
	POINT : 0,
	INTERSECT : 1,
	mode : 0,
	_execOnAll : function(d, b) {
		for ( var e in this.ids) {
			for ( var a in this.ids[e]) {
				var f = this.ids[e][a];
				if (!this.isTypeOfDD(f)) {
					continue
				}
				f[d].apply(f, b)
			}
		}
	},
	_onLoad : function() {
		this.init();
		var a = Ext.EventManager;
		a.on(document, "mouseup", this.handleMouseUp, this, true);
		a.on(document, "mousemove", this.handleMouseMove, this, true);
		a.on(window, "unload", this._onUnload, this, true);
		a.on(window, "resize", this._onResize, this, true)
	},
	_onResize : function(a) {
		this._execOnAll("resetConstraints", [])
	},
	lock : function() {
		this.locked = true
	},
	unlock : function() {
		this.locked = false
	},
	isLocked : function() {
		return this.locked
	},
	locationCache : {},
	useCache : true,
	clickPixelThresh : 3,
	clickTimeThresh : 350,
	dragThreshMet : false,
	clickTimeout : null,
	startX : 0,
	startY : 0,
	regDragDrop : function(b, a) {
		if (!this.initialized) {
			this.init()
		}
		if (!this.ids[a]) {
			this.ids[a] = {}
		}
		this.ids[a][b.id] = b
	},
	removeDDFromGroup : function(d, a) {
		if (!this.ids[a]) {
			this.ids[a] = {}
		}
		var b = this.ids[a];
		if (b && b[d.id]) {
			delete b[d.id]
		}
	},
	_remove : function(b) {
		for ( var a in b.groups) {
			if (a && this.ids[a] && this.ids[a][b.id]) {
				delete this.ids[a][b.id]
			}
		}
		delete this.handleIds[b.id]
	},
	regHandle : function(b, a) {
		if (!this.handleIds[b]) {
			this.handleIds[b] = {}
		}
		this.handleIds[b][a] = a
	},
	isDragDrop : function(a) {
		return (this.getDDById(a)) ? true : false
	},
	getRelated : function(g, b) {
		var f = [];
		for ( var e in g.groups) {
			for ( var d in this.ids[e]) {
				var a = this.ids[e][d];
				if (!this.isTypeOfDD(a)) {
					continue
				}
				if (!b || a.isTarget) {
					f[f.length] = a
				}
			}
		}
		return f
	},
	isLegalTarget : function(f, e) {
		var b = this.getRelated(f, true);
		for (var d = 0, a = b.length; d < a; ++d) {
			if (b[d].id == e.id) {
				return true
			}
		}
		return false
	},
	isTypeOfDD : function(a) {
		return (a && a.__ygDragDrop)
	},
	isHandle : function(b, a) {
		return (this.handleIds[b] && this.handleIds[b][a])
	},
	getDDById : function(b) {
		for ( var a in this.ids) {
			if (this.ids[a][b]) {
				return this.ids[a][b]
			}
		}
		return null
	},
	handleMouseDown : function(d, b) {
		if (Ext.tip.QuickTips) {
			Ext.tip.QuickTips.ddDisable()
		}
		if (this.dragCurrent) {
			this.handleMouseUp(d)
		}
		this.currentTarget = d.getTarget();
		this.dragCurrent = b;
		var a = b.getEl();
		this.startX = d.getPageX();
		this.startY = d.getPageY();
		this.deltaX = this.startX - a.offsetLeft;
		this.deltaY = this.startY - a.offsetTop;
		this.dragThreshMet = false;
		this.clickTimeout = setTimeout(function() {
			var e = Ext.dd.DDM;
			e.startDrag(e.startX, e.startY)
		}, this.clickTimeThresh)
	},
	startDrag : function(a, b) {
		clearTimeout(this.clickTimeout);
		if (this.dragCurrent) {
			this.dragCurrent.b4StartDrag(a, b);
			this.dragCurrent.startDrag(a, b)
		}
		this.dragThreshMet = true
	},
	handleMouseUp : function(a) {
		if (Ext.tip.QuickTips) {
			Ext.tip.QuickTips.ddEnable()
		}
		if (!this.dragCurrent) {
			return
		}
		clearTimeout(this.clickTimeout);
		if (this.dragThreshMet) {
			this.fireEvents(a, true)
		} else {
		}
		this.stopDrag(a);
		this.stopEvent(a)
	},
	stopEvent : function(a) {
		if (this.stopPropagation) {
			a.stopPropagation()
		}
		if (this.preventDefault) {
			a.preventDefault()
		}
	},
	stopDrag : function(a) {
		if (this.dragCurrent) {
			if (this.dragThreshMet) {
				this.dragCurrent.b4EndDrag(a);
				this.dragCurrent.endDrag(a)
			}
			this.dragCurrent.onMouseUp(a)
		}
		this.dragCurrent = null;
		this.dragOvers = {}
	},
	handleMouseMove : function(d) {
		if (!this.dragCurrent) {
			return true
		}
		if (Ext.isIE && (d.button !== 0 && d.button !== 1 && d.button !== 2)) {
			this.stopEvent(d);
			return this.handleMouseUp(d)
		}
		if (!this.dragThreshMet) {
			var b = Math.abs(this.startX - d.getPageX());
			var a = Math.abs(this.startY - d.getPageY());
			if (b > this.clickPixelThresh || a > this.clickPixelThresh) {
				this.startDrag(this.startX, this.startY)
			}
		}
		if (this.dragThreshMet) {
			this.dragCurrent.b4Drag(d);
			this.dragCurrent.onDrag(d);
			if (!this.dragCurrent.moveOnly) {
				this.fireEvents(d, false)
			}
		}
		this.stopEvent(d);
		return true
	},
	fireEvents : function(m, n) {
		var p = this.dragCurrent;
		if (!p || p.isLocked()) {
			return
		}
		var q = m.getPoint();
		var a = [];
		var f = [];
		var k = [];
		var h = [];
		var d = [];
		for ( var g in this.dragOvers) {
			var b = this.dragOvers[g];
			if (!this.isTypeOfDD(b)) {
				continue
			}
			if (!this.isOverTarget(q, b, this.mode)) {
				f.push(b)
			}
			a[g] = true;
			delete this.dragOvers[g]
		}
		for ( var o in p.groups) {
			if ("string" != typeof o) {
				continue
			}
			for (g in this.ids[o]) {
				var j = this.ids[o][g];
				if (!this.isTypeOfDD(j)) {
					continue
				}
				if (j.isTarget && !j.isLocked()
						&& ((j != p) || (p.ignoreSelf === false))) {
					if (this.isOverTarget(q, j, this.mode)) {
						if (n) {
							h.push(j)
						} else {
							if (!a[j.id]) {
								d.push(j)
							} else {
								k.push(j)
							}
							this.dragOvers[j.id] = j
						}
					}
				}
			}
		}
		if (this.mode) {
			if (f.length) {
				p.b4DragOut(m, f);
				p.onDragOut(m, f)
			}
			if (d.length) {
				p.onDragEnter(m, d)
			}
			if (k.length) {
				p.b4DragOver(m, k);
				p.onDragOver(m, k)
			}
			if (h.length) {
				p.b4DragDrop(m, h);
				p.onDragDrop(m, h)
			}
		} else {
			var l = 0;
			for (g = 0, l = f.length; g < l; ++g) {
				p.b4DragOut(m, f[g].id);
				p.onDragOut(m, f[g].id)
			}
			for (g = 0, l = d.length; g < l; ++g) {
				p.onDragEnter(m, d[g].id)
			}
			for (g = 0, l = k.length; g < l; ++g) {
				p.b4DragOver(m, k[g].id);
				p.onDragOver(m, k[g].id)
			}
			for (g = 0, l = h.length; g < l; ++g) {
				p.b4DragDrop(m, h[g].id);
				p.onDragDrop(m, h[g].id)
			}
		}
		if (n && !h.length) {
			p.onInvalidDrop(m)
		}
	},
	getBestMatch : function(d) {
		var f = null;
		var b = d.length;
		if (b == 1) {
			f = d[0]
		} else {
			for (var e = 0; e < b; ++e) {
				var a = d[e];
				if (a.cursorIsOver) {
					f = a;
					break
				} else {
					if (!f || f.overlap.getArea() < a.overlap.getArea()) {
						f = a
					}
				}
			}
		}
		return f
	},
	refreshCache : function(b) {
		for ( var a in b) {
			if ("string" != typeof a) {
				continue
			}
			for ( var d in this.ids[a]) {
				var e = this.ids[a][d];
				if (this.isTypeOfDD(e)) {
					var f = this.getLocation(e);
					if (f) {
						this.locationCache[e.id] = f
					} else {
						delete this.locationCache[e.id]
					}
				}
			}
		}
	},
	verifyEl : function(b) {
		if (b) {
			var a;
			if (Ext.isIE) {
				try {
					a = b.offsetParent
				} catch (d) {
				}
			} else {
				a = b.offsetParent
			}
			if (a) {
				return true
			}
		}
		return false
	},
	getLocation : function(i) {
		if (!this.isTypeOfDD(i)) {
			return null
		}
		var g = i.getEl(), m, f, d, o, n, p, a, k, h;
		try {
			m = Ext.core.Element.getXY(g)
		} catch (j) {
		}
		if (!m) {
			return null
		}
		f = m[0];
		d = f + g.offsetWidth;
		o = m[1];
		n = o + g.offsetHeight;
		p = o - i.padding[0];
		a = d + i.padding[1];
		k = n + i.padding[2];
		h = f - i.padding[3];
		return new Ext.util.Region(p, a, k, h)
	},
	isOverTarget : function(j, a, d) {
		var f = this.locationCache[a.id];
		if (!f || !this.useCache) {
			f = this.getLocation(a);
			this.locationCache[a.id] = f
		}
		if (!f) {
			return false
		}
		a.cursorIsOver = f.contains(j);
		var i = this.dragCurrent;
		if (!i || !i.getTargetCoord || (!d && !i.constrainX && !i.constrainY)) {
			return a.cursorIsOver
		}
		a.overlap = null;
		var g = i.getTargetCoord(j.x, j.y);
		var b = i.getDragEl();
		var e = new Ext.util.Region(g.y, g.x + b.offsetWidth, g.y
				+ b.offsetHeight, g.x);
		var h = e.intersect(f);
		if (h) {
			a.overlap = h;
			return (d) ? true : a.cursorIsOver
		} else {
			return false
		}
	},
	_onUnload : function(b, a) {
		Ext.dd.DragDropMgr.unregAll()
	},
	unregAll : function() {
		if (this.dragCurrent) {
			this.stopDrag();
			this.dragCurrent = null
		}
		this._execOnAll("unreg", []);
		for ( var a in this.elementCache) {
			delete this.elementCache[a]
		}
		this.elementCache = {};
		this.ids = {}
	},
	elementCache : {},
	getElWrapper : function(b) {
		var a = this.elementCache[b];
		if (!a || !a.el) {
			a = this.elementCache[b] = new this.ElementWrapper(Ext.getDom(b))
		}
		return a
	},
	getElement : function(a) {
		return Ext.getDom(a)
	},
	getCss : function(b) {
		var a = Ext.getDom(b);
		return (a) ? a.style : null
	},
	ElementWrapper : function(a) {
		this.el = a || null;
		this.id = this.el && a.id;
		this.css = this.el && a.style
	},
	getPosX : function(a) {
		return Ext.core.Element.getX(a)
	},
	getPosY : function(a) {
		return Ext.core.Element.getY(a)
	},
	swapNode : function(d, a) {
		if (d.swapNode) {
			d.swapNode(a)
		} else {
			var e = a.parentNode;
			var b = a.nextSibling;
			if (b == d) {
				e.insertBefore(d, a)
			} else {
				if (a == d.nextSibling) {
					e.insertBefore(a, d)
				} else {
					d.parentNode.replaceChild(a, d);
					e.insertBefore(d, b)
				}
			}
		}
	},
	getScroll : function() {
		var d, a, e = document.documentElement, b = document.body;
		if (e && (e.scrollTop || e.scrollLeft)) {
			d = e.scrollTop;
			a = e.scrollLeft
		} else {
			if (b) {
				d = b.scrollTop;
				a = b.scrollLeft
			} else {
			}
		}
		return {
			top : d,
			left : a
		}
	},
	getStyle : function(b, a) {
		return Ext.fly(b).getStyle(a)
	},
	getScrollTop : function() {
		return this.getScroll().top
	},
	getScrollLeft : function() {
		return this.getScroll().left
	},
	moveToEl : function(a, d) {
		var b = Ext.core.Element.getXY(d);
		Ext.core.Element.setXY(a, b)
	},
	numericSort : function(e, d) {
		return (e - d)
	},
	_timeoutCount : 0,
	_addListeners : function() {
		if (document) {
			this._onLoad()
		} else {
			if (this._timeoutCount > 2000) {
			} else {
				setTimeout(this._addListeners, 10);
				if (document && document.body) {
					this._timeoutCount += 1
				}
			}
		}
	},
	handleWasClicked : function(a, d) {
		if (this.isHandle(d, a.id)) {
			return true
		} else {
			var b = a.parentNode;
			while (b) {
				if (this.isHandle(d, b.id)) {
					return true
				} else {
					b = b.parentNode
				}
			}
		}
		return false
	}
}, function() {
	this._addListeners()
});
Ext
		.define(
				"Ext.dd.DragDrop",
				{
					requires : [ "Ext.dd.DragDropMgr" ],
					constructor : function(d, a, b) {
						if (d) {
							this.init(d, a, b)
						}
					},
					id : null,
					config : null,
					dragElId : null,
					handleElId : null,
					invalidHandleTypes : null,
					invalidHandleIds : null,
					invalidHandleClasses : null,
					startPageX : 0,
					startPageY : 0,
					groups : null,
					locked : false,
					lock : function() {
						this.locked = true
					},
					moveOnly : false,
					unlock : function() {
						this.locked = false
					},
					isTarget : true,
					padding : null,
					_domRef : null,
					__ygDragDrop : true,
					constrainX : false,
					constrainY : false,
					minX : 0,
					maxX : 0,
					minY : 0,
					maxY : 0,
					maintainOffset : false,
					xTicks : null,
					yTicks : null,
					primaryButtonOnly : true,
					available : false,
					hasOuterHandles : false,
					b4StartDrag : function(a, b) {
					},
					startDrag : function(a, b) {
					},
					b4Drag : function(a) {
					},
					onDrag : function(a) {
					},
					onDragEnter : function(a, b) {
					},
					b4DragOver : function(a) {
					},
					onDragOver : function(a, b) {
					},
					b4DragOut : function(a) {
					},
					onDragOut : function(a, b) {
					},
					b4DragDrop : function(a) {
					},
					onDragDrop : function(a, b) {
					},
					onInvalidDrop : function(a) {
					},
					b4EndDrag : function(a) {
					},
					endDrag : function(a) {
					},
					b4MouseDown : function(a) {
					},
					onMouseDown : function(a) {
					},
					onMouseUp : function(a) {
					},
					onAvailable : function() {
					},
					defaultPadding : {
						left : 0,
						right : 0,
						top : 0,
						bottom : 0
					},
					constrainTo : function(h, f, m) {
						if (Ext.isNumber(f)) {
							f = {
								left : f,
								right : f,
								top : f,
								bottom : f
							}
						}
						f = f || this.defaultPadding;
						var j = Ext.get(this.getEl()).getBox(), a = Ext.get(h), l = a
								.getScroll(), i, d = a.dom;
						if (d == document.body) {
							i = {
								x : l.left,
								y : l.top,
								width : Ext.core.Element.getViewWidth(),
								height : Ext.core.Element.getViewHeight()
							}
						} else {
							var k = a.getXY();
							i = {
								x : k[0],
								y : k[1],
								width : d.clientWidth,
								height : d.clientHeight
							}
						}
						var g = j.y - i.y, e = j.x - i.x;
						this.resetConstraints();
						this.setXConstraint(e - (f.left || 0), i.width - e
								- j.width - (f.right || 0), this.xTickSize);
						this.setYConstraint(g - (f.top || 0), i.height - g
								- j.height - (f.bottom || 0), this.yTickSize)
					},
					getEl : function() {
						if (!this._domRef) {
							this._domRef = Ext.getDom(this.id)
						}
						return this._domRef
					},
					getDragEl : function() {
						return Ext.getDom(this.dragElId)
					},
					init : function(d, a, b) {
						this.initTarget(d, a, b);
						Ext.EventManager.on(this.id, "mousedown",
								this.handleMouseDown, this)
					},
					initTarget : function(d, a, b) {
						this.config = b || {};
						this.DDMInstance = Ext.dd.DragDropMgr;
						this.groups = {};
						if (typeof d !== "string") {
							d = Ext.id(d)
						}
						this.id = d;
						this.addToGroup((a) ? a : "default");
						this.handleElId = d;
						this.setDragElId(d);
						this.invalidHandleTypes = {
							A : "A"
						};
						this.invalidHandleIds = {};
						this.invalidHandleClasses = [];
						this.applyConfig();
						this.handleOnAvailable()
					},
					applyConfig : function() {
						this.padding = this.config.padding || [ 0, 0, 0, 0 ];
						this.isTarget = (this.config.isTarget !== false);
						this.maintainOffset = (this.config.maintainOffset);
						this.primaryButtonOnly = (this.config.primaryButtonOnly !== false)
					},
					handleOnAvailable : function() {
						this.available = true;
						this.resetConstraints();
						this.onAvailable()
					},
					setPadding : function(d, a, e, b) {
						if (!a && 0 !== a) {
							this.padding = [ d, d, d, d ]
						} else {
							if (!e && 0 !== e) {
								this.padding = [ d, a, d, a ]
							} else {
								this.padding = [ d, a, e, b ]
							}
						}
					},
					setInitPosition : function(e, d) {
						var f = this.getEl();
						if (!this.DDMInstance.verifyEl(f)) {
							return
						}
						var b = e || 0;
						var a = d || 0;
						var g = Ext.core.Element.getXY(f);
						this.initPageX = g[0] - b;
						this.initPageY = g[1] - a;
						this.lastPageX = g[0];
						this.lastPageY = g[1];
						this.setStartPosition(g)
					},
					setStartPosition : function(b) {
						var a = b || Ext.core.Element.getXY(this.getEl());
						this.deltaSetXY = null;
						this.startPageX = a[0];
						this.startPageY = a[1]
					},
					addToGroup : function(a) {
						this.groups[a] = true;
						this.DDMInstance.regDragDrop(this, a)
					},
					removeFromGroup : function(a) {
						if (this.groups[a]) {
							delete this.groups[a]
						}
						this.DDMInstance.removeDDFromGroup(this, a)
					},
					setDragElId : function(a) {
						this.dragElId = a
					},
					setHandleElId : function(a) {
						if (typeof a !== "string") {
							a = Ext.id(a)
						}
						this.handleElId = a;
						this.DDMInstance.regHandle(this.id, a)
					},
					setOuterHandleElId : function(a) {
						if (typeof a !== "string") {
							a = Ext.id(a)
						}
						Ext.EventManager.on(a, "mousedown",
								this.handleMouseDown, this);
						this.setHandleElId(a);
						this.hasOuterHandles = true
					},
					unreg : function() {
						Ext.EventManager.un(this.id, "mousedown",
								this.handleMouseDown, this);
						this._domRef = null;
						this.DDMInstance._remove(this)
					},
					destroy : function() {
						this.unreg()
					},
					isLocked : function() {
						return (this.DDMInstance.isLocked() || this.locked)
					},
					handleMouseDown : function(d, b) {
						if (this.primaryButtonOnly && d.button != 0) {
							return
						}
						if (this.isLocked()) {
							return
						}
						this.DDMInstance.refreshCache(this.groups);
						var a = d.getPoint();
						if (!this.hasOuterHandles
								&& !this.DDMInstance.isOverTarget(a, this)) {
						} else {
							if (this.clickValidator(d)) {
								this.setStartPosition();
								this.b4MouseDown(d);
								this.onMouseDown(d);
								this.DDMInstance.handleMouseDown(d, this);
								this.DDMInstance.stopEvent(d)
							} else {
							}
						}
					},
					clickValidator : function(b) {
						var a = b.getTarget();
						return (this.isValidHandleChild(a) && (this.id == this.handleElId || this.DDMInstance
								.handleWasClicked(a, this.id)))
					},
					addInvalidHandleType : function(a) {
						var b = a.toUpperCase();
						this.invalidHandleTypes[b] = b
					},
					addInvalidHandleId : function(a) {
						if (typeof a !== "string") {
							a = Ext.id(a)
						}
						this.invalidHandleIds[a] = a
					},
					addInvalidHandleClass : function(a) {
						this.invalidHandleClasses.push(a)
					},
					removeInvalidHandleType : function(a) {
						var b = a.toUpperCase();
						delete this.invalidHandleTypes[b]
					},
					removeInvalidHandleId : function(a) {
						if (typeof a !== "string") {
							a = Ext.id(a)
						}
						delete this.invalidHandleIds[a]
					},
					removeInvalidHandleClass : function(b) {
						for (var d = 0, a = this.invalidHandleClasses.length; d < a; ++d) {
							if (this.invalidHandleClasses[d] == b) {
								delete this.invalidHandleClasses[d]
							}
						}
					},
					isValidHandleChild : function(f) {
						var d = true;
						var h;
						try {
							h = f.nodeName.toUpperCase()
						} catch (g) {
							h = f.nodeName
						}
						d = d && !this.invalidHandleTypes[h];
						d = d && !this.invalidHandleIds[f.id];
						for (var b = 0, a = this.invalidHandleClasses.length; d
								&& b < a; ++b) {
							d = !Ext.fly(f)
									.hasCls(this.invalidHandleClasses[b])
						}
						return d
					},
					setXTicks : function(e, a) {
						this.xTicks = [];
						this.xTickSize = a;
						var d = {};
						for (var b = this.initPageX; b >= this.minX; b = b - a) {
							if (!d[b]) {
								this.xTicks[this.xTicks.length] = b;
								d[b] = true
							}
						}
						for (b = this.initPageX; b <= this.maxX; b = b + a) {
							if (!d[b]) {
								this.xTicks[this.xTicks.length] = b;
								d[b] = true
							}
						}
						this.xTicks.sort(this.DDMInstance.numericSort)
					},
					setYTicks : function(e, a) {
						this.yTicks = [];
						this.yTickSize = a;
						var d = {};
						for (var b = this.initPageY; b >= this.minY; b = b - a) {
							if (!d[b]) {
								this.yTicks[this.yTicks.length] = b;
								d[b] = true
							}
						}
						for (b = this.initPageY; b <= this.maxY; b = b + a) {
							if (!d[b]) {
								this.yTicks[this.yTicks.length] = b;
								d[b] = true
							}
						}
						this.yTicks.sort(this.DDMInstance.numericSort)
					},
					setXConstraint : function(d, b, a) {
						this.leftConstraint = d;
						this.rightConstraint = b;
						this.minX = this.initPageX - d;
						this.maxX = this.initPageX + b;
						if (a) {
							this.setXTicks(this.initPageX, a)
						}
						this.constrainX = true
					},
					clearConstraints : function() {
						this.constrainX = false;
						this.constrainY = false;
						this.clearTicks()
					},
					clearTicks : function() {
						this.xTicks = null;
						this.yTicks = null;
						this.xTickSize = 0;
						this.yTickSize = 0
					},
					setYConstraint : function(a, d, b) {
						this.topConstraint = a;
						this.bottomConstraint = d;
						this.minY = this.initPageY - a;
						this.maxY = this.initPageY + d;
						if (b) {
							this.setYTicks(this.initPageY, b)
						}
						this.constrainY = true
					},
					resetConstraints : function() {
						if (this.initPageX || this.initPageX === 0) {
							var b = (this.maintainOffset) ? this.lastPageX
									- this.initPageX : 0;
							var a = (this.maintainOffset) ? this.lastPageY
									- this.initPageY : 0;
							this.setInitPosition(b, a)
						} else {
							this.setInitPosition()
						}
						if (this.constrainX) {
							this.setXConstraint(this.leftConstraint,
									this.rightConstraint, this.xTickSize)
						}
						if (this.constrainY) {
							this.setYConstraint(this.topConstraint,
									this.bottomConstraint, this.yTickSize)
						}
					},
					getTick : function(h, e) {
						if (!e) {
							return h
						} else {
							if (e[0] >= h) {
								return e[0]
							} else {
								for (var b = 0, a = e.length; b < a; ++b) {
									var d = b + 1;
									if (e[d] && e[d] >= h) {
										var g = h - e[b];
										var f = e[d] - h;
										return (f > g) ? e[b] : e[d]
									}
								}
								return e[e.length - 1]
							}
						}
					},
					toString : function() {
						return ("DragDrop " + this.id)
					}
				});
Ext.define("Ext.dd.DD", {
	extend : "Ext.dd.DragDrop",
	requires : [ "Ext.dd.DragDropMgr" ],
	constructor : function(d, a, b) {
		if (d) {
			this.init(d, a, b)
		}
	},
	scroll : true,
	autoOffset : function(d, b) {
		var a = d - this.startPageX;
		var e = b - this.startPageY;
		this.setDelta(a, e)
	},
	setDelta : function(b, a) {
		this.deltaX = b;
		this.deltaY = a
	},
	setDragElPos : function(d, b) {
		var a = this.getDragEl();
		this.alignElWithMouse(a, d, b)
	},
	alignElWithMouse : function(d, h, g) {
		var f = this.getTargetCoord(h, g);
		var b = d.dom ? d : Ext.fly(d, "_dd");
		if (!this.deltaSetXY) {
			var i = [ f.x, f.y ];
			b.setXY(i);
			var e = b.getLeft(true);
			var a = b.getTop(true);
			this.deltaSetXY = [ e - f.x, a - f.y ]
		} else {
			b.setLeftTop(f.x + this.deltaSetXY[0], f.y + this.deltaSetXY[1])
		}
		this.cachePosition(f.x, f.y);
		this.autoScroll(f.x, f.y, d.offsetHeight, d.offsetWidth);
		return f
	},
	cachePosition : function(b, a) {
		if (b) {
			this.lastPageX = b;
			this.lastPageY = a
		} else {
			var d = Ext.core.Element.getXY(this.getEl());
			this.lastPageX = d[0];
			this.lastPageY = d[1]
		}
	},
	autoScroll : function(l, k, f, m) {
		if (this.scroll) {
			var n = Ext.core.Element.getViewHeight();
			var b = Ext.core.Element.getViewWidth();
			var p = this.DDMInstance.getScrollTop();
			var e = this.DDMInstance.getScrollLeft();
			var j = f + k;
			var o = m + l;
			var i = (n + p - k - this.deltaY);
			var g = (b + e - l - this.deltaX);
			var d = 40;
			var a = (document.all) ? 80 : 30;
			if (j > n && i < d) {
				window.scrollTo(e, p + a)
			}
			if (k < p && p > 0 && k - p < d) {
				window.scrollTo(e, p - a)
			}
			if (o > b && g < d) {
				window.scrollTo(e + a, p)
			}
			if (l < e && e > 0 && l - e < d) {
				window.scrollTo(e - a, p)
			}
		}
	},
	getTargetCoord : function(d, b) {
		var a = d - this.deltaX;
		var e = b - this.deltaY;
		if (this.constrainX) {
			if (a < this.minX) {
				a = this.minX
			}
			if (a > this.maxX) {
				a = this.maxX
			}
		}
		if (this.constrainY) {
			if (e < this.minY) {
				e = this.minY
			}
			if (e > this.maxY) {
				e = this.maxY
			}
		}
		a = this.getTick(a, this.xTicks);
		e = this.getTick(e, this.yTicks);
		return {
			x : a,
			y : e
		}
	},
	applyConfig : function() {
		Ext.dd.DD.superclass.applyConfig.call(this);
		this.scroll = (this.config.scroll !== false)
	},
	b4MouseDown : function(a) {
		this.autoOffset(a.getPageX(), a.getPageY())
	},
	b4Drag : function(a) {
		this.setDragElPos(a.getPageX(), a.getPageY())
	},
	toString : function() {
		return ("DD " + this.id)
	}
});
Ext.define("Ext.dd.DDProxy", {
	extend : "Ext.dd.DD",
	statics : {
		dragElId : "ygddfdiv"
	},
	constructor : function(d, a, b) {
		if (d) {
			this.init(d, a, b);
			this.initFrame()
		}
	},
	resizeFrame : true,
	centerFrame : false,
	createFrame : function() {
		var b = this;
		var a = document.body;
		if (!a || !a.firstChild) {
			setTimeout(function() {
				b.createFrame()
			}, 50);
			return
		}
		var e = this.getDragEl();
		if (!e) {
			e = document.createElement("div");
			e.id = this.dragElId;
			var d = e.style;
			d.position = "absolute";
			d.visibility = "hidden";
			d.cursor = "move";
			d.border = "2px solid #aaa";
			d.zIndex = 999;
			a.insertBefore(e, a.firstChild)
		}
	},
	initFrame : function() {
		this.createFrame()
	},
	applyConfig : function() {
		Ext.dd.DDProxy.superclass.applyConfig.call(this);
		this.resizeFrame = (this.config.resizeFrame !== false);
		this.centerFrame = (this.config.centerFrame);
		this.setDragElId(this.config.dragElId || Ext.dd.DDProxy.dragElId)
	},
	showFrame : function(f, e) {
		var d = this.getEl();
		var a = this.getDragEl();
		var b = a.style;
		this._resizeProxy();
		if (this.centerFrame) {
			this.setDelta(Math.round(parseInt(b.width, 10) / 2), Math
					.round(parseInt(b.height, 10) / 2))
		}
		this.setDragElPos(f, e);
		Ext.fly(a).show()
	},
	_resizeProxy : function() {
		if (this.resizeFrame) {
			var a = this.getEl();
			Ext.fly(this.getDragEl()).setSize(a.offsetWidth, a.offsetHeight)
		}
	},
	b4MouseDown : function(b) {
		var a = b.getPageX();
		var d = b.getPageY();
		this.autoOffset(a, d);
		this.setDragElPos(a, d)
	},
	b4StartDrag : function(a, b) {
		this.showFrame(a, b)
	},
	b4EndDrag : function(a) {
		Ext.fly(this.getDragEl()).hide()
	},
	endDrag : function(d) {
		var b = this.getEl();
		var a = this.getDragEl();
		a.style.visibility = "";
		this.beforeMove();
		b.style.visibility = "hidden";
		Ext.dd.DDM.moveToEl(b, a);
		a.style.visibility = "hidden";
		b.style.visibility = "";
		this.afterDrag()
	},
	beforeMove : function() {
	},
	afterDrag : function() {
	},
	toString : function() {
		return ("DDProxy " + this.id)
	}
});
Ext.define("Ext.dd.StatusProxy", {
	animRepair : false,
	constructor : function(a) {
		Ext.apply(this, a);
		this.id = this.id || Ext.id();
		this.el = new Ext.Layer({
			dh : {
				id : this.id,
				tag : "div",
				cls : Ext.baseCSSPrefix + "dd-drag-proxy "
						+ this.dropNotAllowed,
				children : [ {
					tag : "div",
					cls : Ext.baseCSSPrefix + "dd-drop-icon"
				}, {
					tag : "div",
					cls : Ext.baseCSSPrefix + "dd-drag-ghost"
				} ]
			},
			shadow : !a || a.shadow !== false
		});
		this.ghost = Ext.get(this.el.dom.childNodes[1]);
		this.dropStatus = this.dropNotAllowed
	},
	dropAllowed : Ext.baseCSSPrefix + "dd-drop-ok",
	dropNotAllowed : Ext.baseCSSPrefix + "dd-drop-nodrop",
	setStatus : function(a) {
		a = a || this.dropNotAllowed;
		if (this.dropStatus != a) {
			this.el.replaceCls(this.dropStatus, a);
			this.dropStatus = a
		}
	},
	reset : function(a) {
		this.el.dom.className = Ext.baseCSSPrefix + "dd-drag-proxy "
				+ this.dropNotAllowed;
		this.dropStatus = this.dropNotAllowed;
		if (a) {
			this.ghost.update("")
		}
	},
	update : function(a) {
		if (typeof a == "string") {
			this.ghost.update(a)
		} else {
			this.ghost.update("");
			a.style.margin = "0";
			this.ghost.dom.appendChild(a)
		}
		var b = this.ghost.dom.firstChild;
		if (b) {
			Ext.fly(b).setStyle("float", "none")
		}
	},
	getEl : function() {
		return this.el
	},
	getGhost : function() {
		return this.ghost
	},
	hide : function(a) {
		this.el.hide();
		if (a) {
			this.reset(true)
		}
	},
	stop : function() {
		if (this.anim && this.anim.isAnimated && this.anim.isAnimated()) {
			this.anim.stop()
		}
	},
	show : function() {
		this.el.show()
	},
	sync : function() {
		this.el.sync()
	},
	repair : function(b, d, a) {
		this.callback = d;
		this.scope = a;
		if (b && this.animRepair !== false) {
			this.el.addCls(Ext.baseCSSPrefix + "dd-drag-repair");
			this.el.hideUnders(true);
			this.anim = this.el.shift({
				duration : this.repairDuration || 0.5,
				easing : "easeOut",
				xy : b,
				stopFx : true,
				callback : this.afterRepair,
				scope : this
			})
		} else {
			this.afterRepair()
		}
	},
	afterRepair : function() {
		this.hide(true);
		if (typeof this.callback == "function") {
			this.callback.call(this.scope || this)
		}
		this.callback = null;
		this.scope = null
	},
	destroy : function() {
		Ext.destroy(this.ghost, this.el)
	}
});
Ext.define("Ext.dd.DragSource", {
	extend : "Ext.dd.DDProxy",
	requires : [ "Ext.dd.StatusProxy", "Ext.dd.DragDropMgr" ],
	constructor : function(b, a) {
		this.el = Ext.get(b);
		if (!this.dragData) {
			this.dragData = {}
		}
		Ext.apply(this, a);
		if (!this.proxy) {
			this.proxy = new Ext.dd.StatusProxy()
		}
		Ext.dd.DragSource.superclass.constructor.call(this, this.el.dom,
				this.ddGroup || this.group, {
					dragElId : this.proxy.id,
					resizeFrame : false,
					isTarget : false,
					scroll : this.scroll === true
				});
		this.dragging = false
	},
	dropAllowed : Ext.baseCSSPrefix + "dd-drop-ok",
	dropNotAllowed : Ext.baseCSSPrefix + "dd-drop-nodrop",
	getDragData : function(a) {
		return this.dragData
	},
	onDragEnter : function(d, f) {
		var b = Ext.dd.DragDropMgr.getDDById(f);
		this.cachedTarget = b;
		if (this.beforeDragEnter(b, d, f) !== false) {
			if (b.isNotifyTarget) {
				var a = b.notifyEnter(this, d, this.dragData);
				this.proxy.setStatus(a)
			} else {
				this.proxy.setStatus(this.dropAllowed)
			}
			if (this.afterDragEnter) {
				this.afterDragEnter(b, d, f)
			}
		}
	},
	beforeDragEnter : function(b, a, d) {
		return true
	},
	alignElWithMouse : function() {
		Ext.dd.DragSource.superclass.alignElWithMouse.apply(this, arguments);
		this.proxy.sync()
	},
	onDragOver : function(d, f) {
		var b = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(f);
		if (this.beforeDragOver(b, d, f) !== false) {
			if (b.isNotifyTarget) {
				var a = b.notifyOver(this, d, this.dragData);
				this.proxy.setStatus(a)
			}
			if (this.afterDragOver) {
				this.afterDragOver(b, d, f)
			}
		}
	},
	beforeDragOver : function(b, a, d) {
		return true
	},
	onDragOut : function(b, d) {
		var a = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(d);
		if (this.beforeDragOut(a, b, d) !== false) {
			if (a.isNotifyTarget) {
				a.notifyOut(this, b, this.dragData)
			}
			this.proxy.reset();
			if (this.afterDragOut) {
				this.afterDragOut(a, b, d)
			}
		}
		this.cachedTarget = null
	},
	beforeDragOut : function(b, a, d) {
		return true
	},
	onDragDrop : function(b, d) {
		var a = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(d);
		if (this.beforeDragDrop(a, b, d) !== false) {
			if (a.isNotifyTarget) {
				if (a.notifyDrop(this, b, this.dragData)) {
					this.onValidDrop(a, b, d)
				} else {
					this.onInvalidDrop(a, b, d)
				}
			} else {
				this.onValidDrop(a, b, d)
			}
			if (this.afterDragDrop) {
				this.afterDragDrop(a, b, d)
			}
		}
		delete this.cachedTarget
	},
	beforeDragDrop : function(b, a, d) {
		return true
	},
	onValidDrop : function(b, a, d) {
		this.hideProxy();
		if (this.afterValidDrop) {
			this.afterValidDrop(b, a, d)
		}
	},
	getRepairXY : function(b, a) {
		return this.el.getXY()
	},
	onInvalidDrop : function(b, a, d) {
		this.beforeInvalidDrop(b, a, d);
		if (this.cachedTarget) {
			if (this.cachedTarget.isNotifyTarget) {
				this.cachedTarget.notifyOut(this, a, this.dragData)
			}
			this.cacheTarget = null
		}
		this.proxy.repair(this.getRepairXY(a, this.dragData), this.afterRepair,
				this);
		if (this.afterInvalidDrop) {
			this.afterInvalidDrop(a, d)
		}
	},
	afterRepair : function() {
		if (Ext.enableFx) {
			this.el.highlight(this.hlColor || "c3daf9")
		}
		this.dragging = false
	},
	beforeInvalidDrop : function(b, a, d) {
		return true
	},
	handleMouseDown : function(b) {
		if (this.dragging) {
			return
		}
		var a = this.getDragData(b);
		if (a && this.onBeforeDrag(a, b) !== false) {
			this.dragData = a;
			this.proxy.stop();
			Ext.dd.DragSource.superclass.handleMouseDown.apply(this, arguments)
		}
	},
	onBeforeDrag : function(a, b) {
		return true
	},
	onStartDrag : Ext.emptyFn,
	startDrag : function(a, b) {
		this.proxy.reset();
		this.dragging = true;
		this.proxy.update("");
		this.onInitDrag(a, b);
		this.proxy.show()
	},
	onInitDrag : function(a, d) {
		var b = this.el.dom.cloneNode(true);
		b.id = Ext.id();
		this.proxy.update(b);
		this.onStartDrag(a, d);
		return true
	},
	getProxy : function() {
		return this.proxy
	},
	hideProxy : function() {
		this.proxy.hide();
		this.proxy.reset(true);
		this.dragging = false
	},
	triggerCacheRefresh : function() {
		Ext.dd.DDM.refreshCache(this.groups)
	},
	b4EndDrag : function(a) {
	},
	endDrag : function(a) {
		this.onEndDrag(this.dragData, a)
	},
	onEndDrag : function(a, b) {
	},
	autoOffset : function(a, b) {
		this.setDelta(-12, -20)
	},
	destroy : function() {
		Ext.dd.DragSource.superclass.destroy.call(this);
		Ext.destroy(this.proxy)
	}
});
Ext.define("Ext.panel.Proxy", {
	constructor : function(a, b) {
		this.panel = a;
		this.id = this.panel.id + "-ddproxy";
		Ext.apply(this, b)
	},
	insertProxy : true,
	setStatus : Ext.emptyFn,
	reset : Ext.emptyFn,
	update : Ext.emptyFn,
	stop : Ext.emptyFn,
	sync : Ext.emptyFn,
	getEl : function() {
		return this.ghost.el
	},
	getGhost : function() {
		return this.ghost
	},
	getProxy : function() {
		return this.proxy
	},
	hide : function() {
		if (this.ghost) {
			if (this.proxy) {
				this.proxy.remove();
				delete this.proxy
			}
			this.panel.unghost(null, false);
			delete this.ghost
		}
	},
	show : function() {
		if (!this.ghost) {
			var a = this.panel.getSize();
			this.panel.el.setVisibilityMode(Ext.core.Element.DISPLAY);
			this.ghost = this.panel.ghost();
			if (this.insertProxy) {
				this.proxy = this.panel.el.insertSibling({
					cls : Ext.baseCSSPrefix + "panel-dd-spacer"
				});
				this.proxy.setSize(a)
			}
		}
	},
	repair : function(b, d, a) {
		this.hide();
		if (typeof d == "function") {
			d.call(a || this)
		}
	},
	moveProxy : function(a, b) {
		if (this.proxy) {
			a.insertBefore(this.proxy.dom, b)
		}
	}
});
Ext.define("Ext.panel.DD", {
	extend : "Ext.dd.DragSource",
	requires : [ "Ext.panel.Proxy" ],
	constructor : function(b, a) {
		this.panel = b;
		this.dragData = {
			panel : b
		};
		this.proxy = new Ext.panel.Proxy(b, a);
		Ext.panel.DD.superclass.constructor.call(this, b.el, a);
		Ext.defer(function() {
			var e = b.header, d = b.body;
			if (e) {
				this.setHandleElId(e.id);
				d = e.el
			}
			d.setStyle("cursor", "move");
			this.scroll = false
		}, 200, this)
	},
	showFrame : Ext.emptyFn,
	startDrag : Ext.emptyFn,
	b4StartDrag : function(a, b) {
		this.proxy.show()
	},
	b4MouseDown : function(b) {
		var a = b.getPageX(), d = b.getPageY();
		this.autoOffset(a, d)
	},
	onInitDrag : function(a, b) {
		this.onStartDrag(a, b);
		return true
	},
	createFrame : Ext.emptyFn,
	getDragEl : function(a) {
		return this.proxy.ghost.el.dom
	},
	endDrag : function(a) {
		this.proxy.hide();
		this.panel.saveState()
	},
	autoOffset : function(a, b) {
		a -= this.startPageX;
		b -= this.startPageY;
		this.setDelta(a, b)
	}
});
Ext
		.define(
				"Ext.layout.component.AbstractDock",
				{
					extend : "Ext.layout.Component",
					type : "dock",
					itemCls : Ext.baseCSSPrefix + "docked",
					onLayout : function(a, l) {
						var i = this, b = i.owner, g = b.body, f = b.layout, h = i
								.getTarget(), j = false, k = false, e;
						var d = i.info = {
							boxes : [],
							size : {
								width : a,
								height : l
							},
							bodyBox : {}
						};
						Ext.applyIf(d, i.getTargetInfo());
						if (l === undefined || l === null || a === undefined
								|| a === null) {
							if ((l === undefined || l === null)
									&& (a === undefined || a === null)) {
								k = true;
								j = true;
								i.setTargetSize(null, null);
								i.setBodyBox({
									width : undefined,
									height : undefined
								})
							} else {
								if (l === undefined || l === null) {
									k = true;
									i.setTargetSize(a, null);
									i.setBodyBox({
										width : a,
										height : undefined
									})
								} else {
									j = true;
									i.setTargetSize(null, l);
									i.setBodyBox({
										width : undefined,
										height : l
									})
								}
							}
							if (f && f.isLayout) {
								f.bindToOwnerCtComponent = true;
								f.layout()
							}
							i.dockItems(j, k);
							i.setTargetSize(d.size.width, d.size.height)
						} else {
							i.setTargetSize(a, l);
							i.dockItems()
						}
						i.parent(arguments)
					},
					dockItems : function(h, a) {
						this.calculateDockBoxes(h, a);
						var g = this.info, d = g.boxes, f = d.length, e, b;
						for (b = 0; b < f; b++) {
							e = d[b];
							e.item.setPosition(e.x, e.y);
							if ((h || a) && e.layout && e.layout.isLayout) {
								e.layout.bindToOwnerCtComponent = true
							}
						}
						if (h) {
							g.bodyBox.width = null
						}
						if (a) {
							g.bodyBox.height = null
						}
						this.setBodyBox(g.bodyBox)
					},
					calculateDockBoxes : function(n, r) {
						var A = this, B = A.getTarget(), m = A.getLayoutItems(), a = A.owner, b = a.contracted, p = a.expanded, g = a.body, u = A.info, l = u.size, d = m.length, j = u.padding, o = u.border, q = A.frameSize, v, s, e, f, t, z, k;
						if (r) {
							l.height = g.getHeight() + j.top + o.top + j.bottom
									+ o.bottom
						} else {
							l.height = B.getHeight()
						}
						if (n) {
							l.width = g.getWidth() + j.left + o.left + j.right
									+ o.right
						} else {
							l.width = B.getWidth()
						}
						u.bodyBox = {
							x : j.left + q.left,
							y : j.top + q.top,
							width : l.width - j.left - o.left - j.right
									- o.right - q.left - q.right,
							height : l.height - o.top - j.top - o.bottom
									- j.bottom - q.top - q.bottom
						};
						for (s = 0; s < d; s++) {
							v = m[s];
							e = A.initBox(v);
							if (r === true) {
								e = A.adjustAutoBox(e, s)
							} else {
								e = A.adjustSizedBox(e, s)
							}
							u.boxes.push(e)
						}
					},
					adjustSizedBox : function(d, b) {
						var a = this.info.bodyBox;
						switch (d.type) {
						case "top":
							d.y = a.y;
							break;
						case "left":
							d.x = a.x;
							break;
						case "bottom":
							d.y = (a.y + a.height) - d.height;
							break;
						case "right":
							d.x = (a.x + a.width) - d.width;
							break
						}
						if (!d.overlay) {
							switch (d.type) {
							case "top":
								a.y += d.height;
								a.height -= d.height;
								break;
							case "left":
								a.x += d.width;
								a.width -= d.width;
								break;
							case "bottom":
								a.height -= d.height;
								break;
							case "right":
								a.width -= d.width;
								break
							}
						}
						return d
					},
					adjustAutoBox : function(d, g) {
						var a = this.info, h = a.bodyBox, k = a.size, e = a.boxes, j = d.type, b, f;
						if (j == "top" || j == "bottom") {
							for (b = 0; b < g; b++) {
								f = e[b];
								if (f.stretched && f.type == "left"
										|| f.type == "right") {
									f.height += d.height
								} else {
									if (f.type == "bottom") {
										f.y += d.height
									}
								}
							}
						}
						switch (j) {
						case "top":
							d.y = h.y;
							if (!d.overlay) {
								h.y += d.height
							}
							k.height += d.height;
							break;
						case "bottom":
							d.y = (h.y + h.height);
							k.height += d.height;
							break;
						case "left":
							d.x = h.x;
							if (!d.overlay) {
								h.x += d.width;
								h.width -= d.width
							}
							break;
						case "right":
							if (!d.overlay) {
								h.width -= d.width
							}
							d.x = (h.x + h.width);
							break
						}
						return d
					},
					initBox : function(e) {
						var b = this.info.bodyBox, a = (e.dock == "top" || e.dock == "bottom"), d = {
							item : e,
							overlay : e.overlay,
							type : e.dock,
							offsets : Ext.core.Element
									.parseBox(e.offsets || {})
						};
						if (e.stretch !== false) {
							d.stretched = true;
							if (a) {
								d.x = b.x + d.offsets.left;
								d.width = b.width
										- (d.offsets.left + d.offsets.right);
								e.setCalculatedSize(d.width
										- e.el.getMargin("lr"), undefined,
										this.owner)
							} else {
								d.y = b.y + d.offsets.top;
								d.height = b.height
										- (d.offsets.bottom + d.offsets.top);
								e.setCalculatedSize(undefined, d.height
										- e.el.getMargin("tb"), this.owner);
								if (!Ext.supports.ComputedStyle) {
									e.el.repaint()
								}
							}
						} else {
							e.doComponentLayout();
							d.width = e.getWidth()
									- (d.offsets.left + d.offsets.right);
							d.height = e.getHeight()
									- (d.offsets.bottom + d.offsets.top);
							d.y += d.offsets.top;
							if (a) {
								d.x = (e.align == "right") ? b.width - d.width
										: b.x;
								d.x += d.offsets.left
							}
						}
						if (d.width == undefined) {
							d.width = e.getWidth() + e.el.getMargin("lr")
						}
						if (d.height == undefined) {
							d.height = e.getHeight() + e.el.getMargin("tb")
						}
						return d
					},
					getLayoutItems : function() {
						var d = this.owner.getDockedItems(), e = d.length, b = 0, a = [];
						for (; b < e; b++) {
							if (d[b].isVisible()) {
								a.push(d[b])
							}
						}
						return a
					},
					setBodyBox : function(g) {
						var i = this, a = i.owner, h = a.body, b = i.info, f = b.bodyMargin, j = b.padding, e = b.border, d = i.frameSize;
						if (a.collapsed) {
							return
						}
						if (Ext.isNumber(g.width)) {
							g.width -= f.left + f.right
						}
						if (Ext.isNumber(g.height)) {
							g.height -= f.top + f.bottom
						}
						i.setElementSize(h, g.width, g.height);
						if (Ext.isNumber(g.x)) {
							h.setLeft(g.x - j.left - d.left)
						}
						if (Ext.isNumber(g.y)) {
							h.setTop(g.y - j.top - d.top)
						}
					},
					configureItem : function(b, d) {
						this.parent(arguments);
						var a = b.el || Ext.get(b);
						if (this.itemCls) {
							a.addCls(this.itemCls + "-" + b.dock)
						}
					},
					afterRemove : function(a) {
						this.parent(arguments);
						if (this.itemCls) {
							a.el.removeCls(this.itemCls + "-" + a.dock)
						}
						var b = a.el.dom;
						if (b) {
							b.parentNode.removeChild(b)
						}
						this.childrenChanged = true
					}
				});
Ext.define("Ext.layout.component.Dock", {
	alias : [ "layout.dock" ],
	extend : "Ext.layout.component.AbstractDock"
});
Ext
		.define(
				"Ext.panel.Panel",
				{
					extend : "Ext.AbstractPanel",
					requires : [ "Ext.panel.Header", "Ext.fx.Anim",
							"Ext.util.KeyMap", "Ext.panel.DD", "Ext.XTemplate",
							"Ext.layout.component.Dock" ],
					alias : "widget.panel",
					alternateClassName : "Ext.Panel",
					animCollapse : Ext.enableFx,
					collapsed : false,
					collapseFirst : true,
					hideCollapseTool : false,
					titleCollapse : true,
					floatable : true,
					collapsible : false,
					preventHeader : false,
					frame : false,
					renderTpl : [ '<div class="{baseCls}-body<tpl if="bodyCls"> {bodyCls}</tpl><tpl if="frame"> {baseCls}-body-framed</tpl><tpl if="ui"> {baseCls}-body-{ui}</tpl>"<tpl if="bodyStyle"> style="{bodyStyle}"</tpl>></div>' ],
					initComponent : function() {
						var b = this, a;
						b.parent();
						if (b.unstyled) {
							b.baseCls = b.baseCSSPrefix + "plain"
						}
						b.collapsedCls = b.collapsedCls || b.baseCls
								+ "-collapsed";
						b.tools = b.tools || [];
						b.bridgeToolbars();
						if (b.border === false) {
							b.hideBorders()
						}
					},
					hideBorders : function() {
						var b = this, a = b.baseCls + "-noborder";
						b.addCls(a);
						if (b.rendered) {
							b.body.addCls(a + "-body")
						} else {
							b.renderData.bodyCls = b.renderData.bodyCls || ""
									+ (" " + a + "-body")
						}
					},
					showBorders : function() {
						var b = this, a = b.baseCls + "-noborder";
						b.removeCls(a);
						if (b.rendered) {
							b.body.removeCls(a + "-body")
						} else {
							b.renderData.bodyCls = b.renderData.bodyCls
									.replace(a + "-body", "")
						}
					},
					beforeDestroy : function() {
						Ext.destroy(this.ghostPanel);
						this.parent()
					},
					initAria : function() {
						Ext.panel.Panel.superclass.initAria.call(this);
						this.initHeaderAria()
					},
					initHeaderAria : function() {
						var b = this, a = b.el, d = b.header;
						if (a && d) {
							a.dom
									.setAttribute("aria-labelledby",
											d.titleCmp.id)
						}
					},
					setTitle : function(a) {
						this.title = a;
						if (this.header) {
							this.header.setTitle(a)
						}
						this.updateHeader()
					},
					setIconClass : function(a) {
						this.iconCls = a;
						var b = this.header;
						if (b) {
							b.setIconClass(a)
						}
					},
					bridgeToolbars : function() {
						var a = this, b, d = function(e, f) {
							if (Ext.isArray(e)) {
								e = {
									xtype : "toolbar",
									items : e
								}
							} else {
								if (!e.xtype) {
									e.xtype = "toolbar"
								}
							}
							e.dock = f;
							return e
						};
						if (a.tbar) {
							a.addDocked(d(a.tbar, "top"));
							a.tbar = null
						}
						if (a.bbar) {
							a.addDocked(d(a.bbar, "bottom"));
							a.bbar = null
						}
						if (a.buttons) {
							a.fbar = a.buttons;
							a.buttons = null
						}
						if (a.fbar) {
							b = d(a.fbar, "bottom");
							b.ui = "footer";
							b = a.addDocked(b)[0];
							b.insert(0, {
								flex : 1,
								xtype : "component"
							});
							a.fbar = null
						}
					},
					onRender : function(b, a) {
						var d = this;
						if (d.collapsible
								&& !(d.hideCollapseTool || this.header === false)) {
							this.collapseTool = this.expandTool = d
									.createComponent({
										xtype : "tool",
										type : "collapse-"
												+ this.collapseDirection,
										expandType : this
												.getOppositeDirection(this.collapseDirection),
										handler : d.toggleCollapse,
										scope : d
									});
							if (d.tools.length && d.collapseFirst) {
								d.tools.unshift(this.collapseTool)
							} else {
								d.tools.push(this.collapseTool)
							}
						}
						d.updateHeader();
						d.parent(arguments)
					},
					updateHeader : function() {
						var a = this, e = a.header, d = a.title, b = a.tools;
						if (!a.preventHeader && (d || b.length)) {
							if (!e) {
								e = a.header = new Ext.panel.Header({
									title : d,
									dock : "top",
									textCls : a.headerTextCls,
									iconCls : a.iconCls,
									baseCls : a.baseCls + "-header",
									tools : b,
									ui : a.ui,
									indicateDrag : a.draggable
								});
								a.addDocked(e, 0)
							}
							e.show();
							this.initHeaderAria()
						} else {
							if (e) {
								e.hide()
							}
						}
					},
					getContentTarget : function() {
						return this.body
					},
					getTargetEl : function() {
						return this.body || this.frameBody || this.el
					},
					addTool : function(a) {
						this.tools.push(a);
						var b = this.header;
						if (b) {
							b.addTool(a)
						}
						this.updateHeader()
					},
					getOppositeDirection : function(a) {
						var b = Ext.Component;
						switch (a) {
						case b.DIRECTION_UP:
							return b.DIRECTION_DOWN;
						case b.DIRECTION_RIGHT:
							return b.DIRECTION_LEFT;
						case b.DIRECTION_DOWN:
							return b.DIRECTION_UP;
						case b.DIRECTION_LEFT:
							return b.DIRECTION_RIGHT
						}
					},
					collapse : function(s, e) {
						var t = this, r = Ext.Component, h = t.getHeight(), j = t
								.getWidth(), a = 0, o = t.dockedItems.items, p = o.length, n = 0, q, f, m = {
							target : t,
							from : {
								height : h,
								width : j
							},
							to : {
								height : h,
								width : j
							},
							listeners : {
								afteranimate : t.afterCollapse,
								scope : t
							},
							duration : Ext.num(e,
									Ext.fx.Anim.prototype.duration)
						}, d, b, k, g = t.collapseMode == "mini";
						if (!s) {
							s = t.collapseDirection
						}
						switch (s) {
						case r.DIRECTION_UP:
							t.expandedSize = t.getHeight();
							t.expandDirection = r.DIRECTION_DOWN;
							b = "horizontal";
							k = "top";
							break;
						case r.DIRECTION_RIGHT:
							t.expandedSize = t.getWidth();
							t.expandDirection = r.DIRECTION_LEFT;
							b = "vertical";
							k = "right";
							break;
						case r.DIRECTION_DOWN:
							t.expandedSize = t.getHeight();
							t.expandDirection = r.DIRECTION_UP;
							b = "horizontal";
							k = "bottom";
							break;
						case r.DIRECTION_LEFT:
							t.expandedSize = t.getWidth();
							b = "vertical";
							k = "left";
							t.expandDirection = r.DIRECTION_RIGHT;
							break;
						default:
							throw ("Panel collapse must be passed a valid Component collapse direction")
						}
						t.expandDirection = this.getOppositeDirection(s);
						t.hiddenDocked = [];
						if ((s == Ext.Component.DIRECTION_UP)
								|| (s == Ext.Component.DIRECTION_DOWN)) {
							for (; n < p; n++) {
								q = o[n];
								if (q.isVisible() || q.isHeader) {
									if (!g
											&& (!q.dock || q.dock == "top" || q.dock == "bottom")) {
										a += q.getHeight();
										if (q.isHeader) {
											d = q
										}
									} else {
										t.hiddenDocked.push(q)
									}
								}
							}
							if (!a && !g) {
								a = 30
							}
							m.to.height = a;
							if (s == Ext.Component.DIRECTION_DOWN) {
								f = t.getPosition()[1]
										- Ext.fly(t.el.dom.offsetParent)
												.getRegion().top;
								m.from.top = f;
								m.to.top = f + (h - a)
							}
						} else {
							if ((s == Ext.Component.DIRECTION_LEFT)
									|| (s == Ext.Component.DIRECTION_RIGHT)) {
								for (; n < p; n++) {
									q = o[n];
									if (q.isVisible() || q.isHeader) {
										if (!g
												&& (q.dock == "left" || q.dock == "right")) {
											a += q.getWidth();
											if (q.isHeader) {
												d = q
											}
										} else {
											t.hiddenDocked.push(q)
										}
									}
								}
								if (!a && !g) {
									a = 30
								}
								m.to.width = a;
								if (s == Ext.Component.DIRECTION_RIGHT) {
									f = t.getPosition()[0]
											- Ext.fly(t.el.dom.offsetParent)
													.getRegion().left;
									m.from.left = f;
									m.to.left = f + (j - a)
								}
							}
						}
						if (t.collapsed
								|| t.fireEvent("beforecollapse", t, s, e, a) === false) {
							return false
						}
						e && t.collapseTool && t.collapseTool.disable();
						if (!d && !g) {
							d = {
								title : t.title,
								orientation : b,
								hidden : true,
								dock : k,
								textCls : t.headerTextCls,
								iconCls : t.iconCls,
								baseCls : t.baseCls + "-header",
								cls : t.baseCls + "-collapsed-placeholder "
										+ t.baseCls + "-collapsed-" + s
										+ "-placeholder"
							};
							d[(d.orientation == "horizontal") ? "height"
									: "width"] = 30;
							d[(d.orientation == "horizontal") ? "tools"
									: "items"] = [ {
								xtype : "tool",
								type : "expand-" + t.expandDirection,
								handler : t.toggleCollapse,
								scope : t
							} ];
							d = t.reExpander = new Ext.panel.Header(d);
							t.insertDocked(0, d)
						}
						t.savedFlex = t.flex;
						delete t.flex;
						t.setAutoScroll(false);
						t.layout.onLayout = Ext.emptyFn;
						t.body.setVisibilityMode(Ext.core.Element.DISPLAY);
						if (e) {
							var l = new Ext.fx.Anim(m)
						} else {
							t.setSize(m.to.width, m.to.height);
							m.to.x && t.setLeft(m.to.x);
							m.to.y && t.setTop(m.to.y);
							t.afterCollapse(false)
						}
						return t
					},
					afterCollapse : function(e) {
						var d = this, b = 0, a = d.hiddenDocked.length, f = d.collapseMode == "mini";
						if (f) {
							d.el.hide();
							d.hiddenDocked.length = 0
						} else {
							d.body.hide();
							for (; b < a; b++) {
								d.hiddenDocked[b].hide()
							}
						}
						d.reExpander && d.reExpander.show();
						d.collapsed = true;
						d.el.addCls(d.collapsedCls);
						if (e && d.ownerCt) {
							d.ownerCt.layout.onLayout()
						}
						if (d.collapseTool) {
							d.collapseTool.setType("expand-"
									+ d.expandDirection)
						}
						d.fireEvent("collapse", d);
						e && d.collapseTool && d.collapseTool.enable()
					},
					expand : function(b) {
						if (!this.collapsed
								|| this.fireEvent("beforeexpand", this, b) === false) {
							return false
						}
						var h = this, g = 0, e = h.hiddenDocked.length, k = h.expandDirection, m = h
								.getHeight(), a = h.getWidth(), d = h.collapseMode == "mini";
						b && h.collapseTool && h.collapseTool.disable();
						for (; g < e; g++) {
							h.hiddenDocked[g].show()
						}
						h.reExpander && h.reExpander.hide();
						if (h.collapseTool) {
							h.collapseTool.setType("collapse-"
									+ h.collapseDirection)
						}
						var f = {
							target : h,
							to : {},
							from : {
								height : m,
								width : a
							},
							listeners : {
								afteranimate : h.afterExpand,
								scope : h
							}
						};
						h.collapsed = false;
						if ((k == Ext.Component.DIRECTION_UP)
								|| (k == Ext.Component.DIRECTION_DOWN)) {
							if (h.savedFlex) {
								h.flex = h.savedFlex;
								f.to.height = h.ownerCt.layout
										.calculateChildBox(h).height;
								delete h.flex
							} else {
								f.to.height = h.expandedSize
							}
							if (k == Ext.Component.DIRECTION_UP) {
								pos = h.getPosition()[1]
										- Ext.fly(h.el.dom.offsetParent)
												.getRegion().top;
								f.from.top = pos;
								f.to.top = pos - (f.to.height - m)
							}
						} else {
							if ((k == Ext.Component.DIRECTION_LEFT)
									|| (k == Ext.Component.DIRECTION_RIGHT)) {
								if (h.savedFlex) {
									h.flex = h.savedFlex;
									f.to.width = h.ownerCt.layout
											.calculateChildBox(h).width;
									delete h.flex
								} else {
									f.to.width = h.expandedSize
								}
								if (k == Ext.Component.DIRECTION_LEFT) {
									pos = h.getPosition()[0]
											- Ext.fly(h.el.dom.offsetParent)
													.getRegion().left;
									f.from.left = pos;
									f.to.left = pos - (f.to.width - a)
								}
							}
						}
						if (d) {
							h.el.show()
						} else {
							h.body.show()
						}
						h.el.removeCls(h.collapsedCls);
						if (b) {
							var j = new Ext.fx.Anim(f)
						} else {
							h.setSize(f.to.width, f.to.height);
							f.to.x && h.setLeft(f.to.x);
							f.to.y && h.setTop(f.to.y);
							h.afterExpand(false)
						}
						return h
					},
					afterExpand : function(b) {
						var a = this;
						a.setAutoScroll(a.initialConfig.autoScroll);
						if (a.savedFlex) {
							a.flex = a.savedFlex;
							delete a.savedFlex;
							delete a.width;
							delete a.height
						}
						delete a.layout.onLayout;
						if (b && a.ownerCt) {
							a.ownerCt.doLayout()
						}
						a.fireEvent("expand", a);
						b && a.collapseTool && a.collapseTool.enable()
					},
					toggleCollapse : function() {
						this.collapsed ? this.expand(this.animCollapse) : this
								.collapse(this.collapseDirection,
										this.animCollapse);
						return this
					},
					getKeyMap : function() {
						if (!this.keyMap) {
							this.keyMap = new Ext.util.KeyMap(this.el,
									this.keys)
						}
						return this.keyMap
					},
					initDraggable : function() {
						this.dd = new Ext.panel.DD(this, Ext
								.isBoolean(this.draggable) ? null
								: this.draggable)
					},
					ghost : function(a) {
						var d = this, b = d.getBox();
						if (!d.ghostPanel) {
							d.ghostPanel = new Ext.panel.Panel({
								renderTo : document.body,
								floating : true,
								frame : d.frame,
								title : d.title,
								width : d.getWidth(),
								height : d.getHeight(),
								baseCls : d.baseCls,
								cls : d.baseCls + "-ghost " + (a || "")
							})
						}
						d.ghostPanel.floatParent = d.floatParent, d.ghostPanel
								.setZIndex(d.el.getStyle("zIndex"));
						d.ghostPanel.el.show();
						d.ghostPanel.setPosition(b.x, b.y);
						d.ghostPanel.setSize(b.width, b.height);
						d.header
								&& d.ghostPanel.header.setHeight(d.header
										.getHeight());
						d.el.hide();
						d.floatingItems && d.floatingItems.hide();
						return d.ghostPanel
					},
					unghost : function(b, a) {
						var d = this;
						if (!d.ghostPanel) {
							return
						}
						if (b !== false) {
							d.el.show();
							if (a !== false) {
								d.setPosition(d.ghostPanel.getPosition())
							}
							d.floatingItems && d.floatingItems.show();
							Ext.defer(d.focus, 10, d)
						}
						d.ghostPanel.el.hide()
					},
					doAutoLoad : function() {
					}
				}, function() {
					this.implement({
						collapseDirection : Ext.Component.DIRECTION_UP
					})
				});
Ext.define("Ext.tip.TipDD", {
	extend : "Ext.dd.DD",
	moveOnly : true,
	scroll : false,
	headerOffsets : [ 100, 25 ],
	constructor : function(b, a) {
		Ext.apply(this, a);
		this.tip = b;
		Ext.tip.TipDD.superclass.constructor.call(this, b.el.id, "WindowDD-"
				+ b.id);
		this.setHandleElId(b.header.id);
		this.scroll = false
	},
	startDrag : function() {
		this.tip.el.disableShadow()
	},
	endDrag : function(a) {
		this.tip.el.enableShadow(true)
	}
});
Ext.define("Ext.layout.component.Tip", {
	alias : [ "layout.tip" ],
	extend : "Ext.layout.component.Dock",
	type : "tip",
	onLayout : function(f, b) {
		var h = Ext.isNumber, a = this.owner, e = a.el, d, i, g = e.getXY();
		e.setXY([ -9999, -9999 ]);
		Ext.layout.component.Tip.superclass.onLayout.call(this, f, b);
		if (!h(f)) {
			d = e.getWidth() + 1;
			i = Ext.Number.constrain(d, a.minWidth, a.maxWidth);
			Ext.layout.component.Tip.superclass.onLayout.call(this, i, b)
		}
		e.setXY(g)
	}
});
Ext.define("Ext.tip.Tip", {
	extend : "Ext.panel.Panel",
	requires : [ "Ext.tip.TipDD", "Ext.layout.component.Tip" ],
	alias : "widget.tip",
	minWidth : 40,
	maxWidth : 300,
	shadow : "sides",
	defaultAlign : "tl-bl?",
	constrainPosition : false,
	autoRender : true,
	frame : true,
	hidden : true,
	baseCls : Ext.baseCSSPrefix + "tip",
	floating : {
		shadow : true,
		shim : true,
		constrain : false
	},
	componentLayout : "tip",
	closeAction : "hide",
	ariaRole : "tooltip",
	initComponent : function() {
		Ext.tip.Tip.superclass.initComponent.call(this);
		if (this.closable) {
			this.addCls(this.baseCls + "-closable");
			this.addTool({
				type : "close",
				handler : this[this.closeAction],
				scope : this
			})
		}
	},
	showAt : function(a) {
		Ext.tip.Tip.superclass.show.call(this);
		if (this.isVisible()) {
			if (this.constrainPosition) {
				a = this.el.adjustForConstraints(a, this.el.dom.parentNode)
			}
			this.setPagePosition(a[0], a[1])
		}
	},
	showBy : function(a, b) {
		if (!this.rendered) {
			this.render(Ext.getBody())
		}
		this.showAt(this.el.getAlignToXY(a, b || this.defaultAlign))
	},
	initDraggable : function() {
		this.dd = new Ext.tip.TipDD(this,
				typeof this.draggable == "boolean" ? null : this.draggable);
		this.header.addCls(this.baseCls + "-draggable")
	}
});
Ext
		.define(
				"Ext.tip.ToolTip",
				{
					extend : "Ext.tip.Tip",
					alias : "widget.tooltip",
					showDelay : 500,
					hideDelay : 200,
					dismissDelay : 5000,
					trackMouse : false,
					anchorToTarget : true,
					anchorOffset : 0,
					targetCounter : 0,
					quickShowInterval : 250,
					initComponent : function() {
						var a = this;
						Ext.tip.ToolTip.superclass.superclass.initComponent
								.call(a);
						a.lastActive = new Date();
						a.initTarget(a.target);
						a.origAnchor = a.anchor
					},
					onRender : function(b, a) {
						var d = this;
						Ext.tip.ToolTip.superclass.superclass.onRender.call(d,
								b, a);
						d.anchorCls = Ext.baseCSSPrefix + "tip-anchor-"
								+ d.getAnchorPosition();
						d.anchorEl = d.el.createChild({
							cls : Ext.baseCSSPrefix + "tip-anchor "
									+ d.anchorCls
						})
					},
					afterRender : function() {
						var a = this;
						Ext.tip.ToolTip.superclass.superclass.afterRender
								.call(a);
						a.anchorEl.setStyle("z-index", a.el.getZIndex() + 1)
								.setVisibilityMode(Ext.core.Element.DISPLAY)
					},
					initTarget : function(e) {
						var b = this, a = Ext.get(e), d;
						if (a) {
							if (b.target) {
								d = Ext.get(b.target);
								b.mun(d, "mouseover", b.onTargetOver, b);
								b.mun(d, "mouseout", b.onTargetOut, b);
								b.mun(d, "mousemove", b.onMouseMove, b)
							}
							b.mon(a, {
								mouseover : b.onTargetOver,
								mouseout : b.onTargetOut,
								mousemove : b.onMouseMove,
								scope : b
							});
							b.target = a
						}
						if (b.anchor) {
							b.anchorTarget = b.target
						}
					},
					onMouseMove : function(f) {
						var b = this, a = b.delegate ? f.getTarget(b.delegate)
								: b.triggerElement = true, d;
						if (a) {
							b.targetXY = f.getXY();
							if (a === b.triggerElement) {
								if (!b.hidden && b.trackMouse) {
									d = b.getTargetXY();
									if (b.constrainPosition) {
										d = b.el.adjustForConstraints(d,
												b.el.dom.parentNode)
									}
									this.setPagePosition(d)
								}
							} else {
								b.hide();
								b.lastActive = new Date(0);
								b.onTargetOver(f)
							}
						} else {
							if (!b.closable && b.isVisible()) {
								b.hide()
							}
						}
					},
					getTargetXY : function() {
						var j = this, e;
						if (j.delegate) {
							j.anchorTarget = j.triggerElement
						}
						if (j.anchor) {
							j.targetCounter++;
							var d = j.getOffsets(), n = (j.anchorToTarget && !j.trackMouse) ? j.el
									.getAlignToXY(j.anchorTarget, j
											.getAnchorAlign())
									: j.targetXY, a = Ext.core.Element
									.getViewWidth() - 5, i = Ext.core.Element
									.getViewHeight() - 5, l = document.documentElement, f = document.body, m = (l.scrollLeft
									|| f.scrollLeft || 0) + 5, k = (l.scrollTop
									|| f.scrollTop || 0) + 5, b = [
									n[0] + d[0], n[1] + d[1] ], h = j.getSize(), g = j.constrainPosition;
							j.anchorEl.removeCls(j.anchorCls);
							if (j.targetCounter < 2 && g) {
								if (b[0] < m) {
									if (j.anchorToTarget) {
										j.defaultAlign = "l-r";
										if (j.mouseOffset) {
											j.mouseOffset[0] *= -1
										}
									}
									j.anchor = "left";
									return j.getTargetXY()
								}
								if (b[0] + h.width > a) {
									if (j.anchorToTarget) {
										j.defaultAlign = "r-l";
										if (j.mouseOffset) {
											j.mouseOffset[0] *= -1
										}
									}
									j.anchor = "right";
									return j.getTargetXY()
								}
								if (b[1] < k) {
									if (j.anchorToTarget) {
										j.defaultAlign = "t-b";
										if (j.mouseOffset) {
											j.mouseOffset[1] *= -1
										}
									}
									j.anchor = "top";
									return j.getTargetXY()
								}
								if (b[1] + h.height > i) {
									if (j.anchorToTarget) {
										j.defaultAlign = "b-t";
										if (j.mouseOffset) {
											j.mouseOffset[1] *= -1
										}
									}
									j.anchor = "bottom";
									return j.getTargetXY()
								}
							}
							j.anchorCls = Ext.baseCSSPrefix + "tip-anchor-"
									+ j.getAnchorPosition();
							j.anchorEl.addCls(j.anchorCls);
							j.targetCounter = 0;
							return b
						} else {
							e = j.getMouseOffset();
							return (j.targetXY) ? [ j.targetXY[0] + e[0],
									j.targetXY[1] + e[1] ] : e
						}
					},
					getMouseOffset : function() {
						var a = this, b = a.anchor ? [ 0, 0 ] : [ 15, 18 ];
						if (a.mouseOffset) {
							b[0] += a.mouseOffset[0];
							b[1] += a.mouseOffset[1]
						}
						return b
					},
					getAnchorPosition : function() {
						var b = this, a;
						if (b.anchor) {
							b.tipAnchor = b.anchor.charAt(0)
						} else {
							a = b.defaultAlign
									.match(/^([a-z]+)-([a-z]+)(\?)?$/);
							if (!a) {
								throw "AnchorTip.defaultAlign is invalid"
							}
							b.tipAnchor = a[1].charAt(0)
						}
						switch (b.tipAnchor) {
						case "t":
							return "top";
						case "b":
							return "bottom";
						case "r":
							return "right"
						}
						return "left"
					},
					getAnchorAlign : function() {
						switch (this.anchor) {
						case "top":
							return "tl-bl";
						case "left":
							return "tl-tr";
						case "right":
							return "tr-tl";
						default:
							return "bl-tl"
						}
					},
					getOffsets : function() {
						var d = this, e, b, a = d.getAnchorPosition().charAt(0);
						if (d.anchorToTarget && !d.trackMouse) {
							switch (a) {
							case "t":
								b = [ 0, 9 ];
								break;
							case "b":
								b = [ 0, -13 ];
								break;
							case "r":
								b = [ -13, 0 ];
								break;
							default:
								b = [ 9, 0 ];
								break
							}
						} else {
							switch (a) {
							case "t":
								b = [ -15 - d.anchorOffset, 30 ];
								break;
							case "b":
								b = [ -19 - d.anchorOffset,
										-13 - d.el.dom.offsetHeight ];
								break;
							case "r":
								b = [ -15 - d.el.dom.offsetWidth,
										-13 - d.anchorOffset ];
								break;
							default:
								b = [ 25, -13 - d.anchorOffset ];
								break
							}
						}
						e = d.getMouseOffset();
						b[0] += e[0];
						b[1] += e[1];
						return b
					},
					onTargetOver : function(d) {
						var b = this, a;
						if (b.disabled || d.within(b.target.dom, true)) {
							return
						}
						a = d.getTarget(b.delegate);
						if (a) {
							b.triggerElement = a;
							b.clearTimer("hide");
							b.targetXY = d.getXY();
							b.delayShow()
						}
					},
					delayShow : function() {
						var a = this;
						if (a.hidden && !a.showTimer) {
							if (Ext.Date.getElapsed(a.lastActive) < a.quickShowInterval) {
								a.show()
							} else {
								a.showTimer = Ext.defer(a.show, a.showDelay, a)
							}
						} else {
							if (!a.hidden && a.autoHide !== a) {
								a.show()
							}
						}
					},
					onTargetOut : function(b) {
						var a = this;
						if (a.disabled || b.within(a.target.dom, true)) {
							return
						}
						a.clearTimer("show");
						if (a.autoHide !== false) {
							a.delayHide()
						}
					},
					delayHide : function() {
						var a = this;
						if (!a.hidden && !a.hideTimer) {
							a.hideTimer = Ext.defer(a.hide, a.hideDelay, a)
						}
					},
					hide : function() {
						var a = this;
						a.clearTimer("dismiss");
						a.lastActive = new Date();
						if (a.anchorEl) {
							a.anchorEl.hide()
						}
						Ext.tip.ToolTip.superclass.superclass.hide.call(a);
						delete a.triggerElement
					},
					show : function() {
						var a = this;
						if (a.anchor) {
							a.showAt([ -1000, -1000 ]);
							a.anchor = a.origAnchor
						}
						a.showAt(a.getTargetXY());
						if (a.anchor) {
							a.syncAnchor();
							a.anchorEl.show()
						} else {
							a.anchorEl.hide()
						}
					},
					showAt : function(b) {
						var a = this;
						a.lastActive = new Date();
						a.clearTimers();
						Ext.tip.Tip.superclass.show.call(a);
						if (a.isVisible()) {
							a.setPagePosition(b[0], b[1])
						}
						if (a.dismissDelay && a.autoHide !== false) {
							a.dismissTimer = Ext.defer(a.hide, a.dismissDelay,
									a)
						}
						if (a.anchor) {
							a.syncAnchor();
							if (!a.anchorEl.isVisible()) {
								a.anchorEl.show()
							}
						} else {
							a.anchorEl.hide()
						}
					},
					syncAnchor : function() {
						var d = this, a, b, e;
						switch (d.tipAnchor.charAt(0)) {
						case "t":
							a = "b";
							b = "tl";
							e = [ 20 + d.anchorOffset, 1 ];
							break;
						case "r":
							a = "l";
							b = "tr";
							e = [ -1, 12 + d.anchorOffset ];
							break;
						case "b":
							a = "t";
							b = "bl";
							e = [ 20 + d.anchorOffset, -1 ];
							break;
						default:
							a = "r";
							b = "tl";
							e = [ 1, 12 + d.anchorOffset ];
							break
						}
						d.anchorEl.alignTo(d.el, a + "-" + b, e)
					},
					setPagePosition : function(a, d) {
						var b = this;
						Ext.tip.ToolTip.superclass.superclass.setPagePosition
								.call(b, a, d);
						if (b.anchor) {
							b.syncAnchor()
						}
					},
					clearTimer : function(a) {
						a = a + "Timer";
						clearTimeout(this[a]);
						delete this[a]
					},
					clearTimers : function() {
						var a = this;
						a.clearTimer("show");
						a.clearTimer("dismiss");
						a.clearTimer("hide")
					},
					onShow : function() {
						var a = this;
						Ext.tip.ToolTip.superclass.superclass.onShow.call(a);
						a.mon(Ext.getDoc(), "mousedown", a.onDocMouseDown, a)
					},
					onHide : function() {
						var a = this;
						Ext.tip.ToolTip.superclass.superclass.onHide.call(a);
						a.mun(Ext.getDoc(), "mousedown", a.onDocMouseDown, a)
					},
					onDocMouseDown : function(b) {
						var a = this;
						if (a.autoHide !== true && !a.closable
								&& !b.within(a.el.dom)) {
							a.disable();
							Ext.defer(a.doEnable, 100, a)
						}
					},
					doEnable : function() {
						if (!this.isDestroyed) {
							this.enable()
						}
					},
					onDisable : function() {
						this.clearTimers();
						this.hide()
					},
					beforeDestroy : function() {
						var a = this;
						a.clearTimers();
						Ext.destroy(a.anchorEl);
						delete a.anchorEl;
						delete a.target;
						delete a.anchorTarget;
						delete a.triggerElement;
						Ext.tip.ToolTip.superclass.superclass.beforeDestroy
								.call(a)
					},
					onDestroy : function() {
						Ext.getDoc().un("mousedown", this.onDocMouseDown, this);
						Ext.tip.ToolTip.superclass.superclass.onDestroy
								.call(this)
					}
				});
Ext.define("Ext.chart.TipSurface", {
	extend : "Ext.draw.Component",
	spriteArray : false,
	renderFirst : true,
	constructor : function(a) {
		Ext.chart.TipSurface.superclass.constructor.call(this, a);
		if (a.sprites) {
			this.spriteArray = [].concat(a.sprites);
			delete a.sprites
		}
	},
	onRender : function() {
		var d = this, b = 0, a = 0, e, f;
		Ext.chart.TipSurface.superclass.onRender.apply(d, arguments);
		f = d.spriteArray;
		if (d.renderFirst && f) {
			d.renderFirst = false;
			for (a = f.length; b < a; b++) {
				e = d.surface.add(f[b]);
				e.setAttributes({
					hidden : false
				}, true)
			}
		}
	}
});
Ext
		.define(
				"Ext.chart.Tips",
				{
					requires : [ "Ext.tip.ToolTip", "Ext.chart.TipSurface" ],
					constructor : function(b) {
						var d = this, a, e, f;
						if (b.tips) {
							this.tipTimeout = null;
							d.tipConfig = Ext.apply({}, b.tips, {
								renderer : Ext.emptyFn
							});
							d.tooltip = new Ext.tip.ToolTip(d.tipConfig);
							Ext.getBody().on("mousemove",
									d.tooltip.onMouseMove, d.tooltip);
							if (d.tipConfig.surface) {
								a = d.tipConfig.surface;
								e = a.sprites;
								f = new Ext.chart.TipSurface({
									id : "tipSurfaceComponent",
									sprites : e
								});
								if (a.width && a.height) {
									f.setSize(a.width, a.height)
								}
								d.tooltip.add(f);
								this.spriteTip = f
							}
						}
					},
					showTip : function(l) {
						var f = this;
						if (!f.tooltip) {
							return
						}
						clearTimeout(f.tipTimeout);
						var m = f.tooltip, a = f.spriteTip, d = f.tipConfig, e = m.trackMouse, k, b, j, h, i, g;
						if (!e) {
							m.trackMouse = true;
							k = l.sprite;
							b = k.surface;
							j = Ext.get(b.getId());
							h = j.getXY();
							i = h[0]
									+ (k.attr.x || 0)
									+ (k.attr.translation
											&& k.attr.translation.x || 0);
							g = h[1]
									+ (k.attr.y || 0)
									+ (k.attr.translation
											&& k.attr.translation.y || 0);
							m.targetXY = [ i, g ]
						}
						if (a) {
							d.renderer.call(m, l.storeItem, l, a.surface)
						} else {
							d.renderer.call(m, l.storeItem, l)
						}
						m.show();
						m.trackMouse = e
					},
					hideTip : function(a) {
						var b = this.tooltip;
						if (!b) {
							return
						}
						clearTimeout(this.tipTimeout);
						this.tipTimeout = setTimeout(function() {
							b.hide()
						}, 0)
					}
				});
Ext
		.define(
				"Ext.chart.Callouts",
				{
					constructor : function(a) {
						if (a.callouts) {
							this.callouts = Ext.apply(this.callouts || {},
									a.callouts, {
										styles : {
											color : "#000",
											font : "11px Helvetica, sans-serif"
										}
									});
							this.calloutsArray = []
						}
					},
					renderCallouts : function() {
						if (!this.callouts) {
							return
						}
						var v = this, m = v.items, a = v.chart.animate, u = v.callouts, h = u.styles, f = v.calloutsArray, b = v.chart.store, s = b
								.getCount(), e = m.length / s, l = [], r, d, q, n;
						for (r = 0, d = 0; r < s; r++) {
							for (q = 0; q < e; q++) {
								var t = m[d], g = f[d], k = b.getAt(r), o = u
										.renderer(g, k);
								if (o) {
									if (!g) {
										f[d] = g = v.onCreateCallout(k, t, r,
												o, q, d)
									}
									for (n in g) {
										g[n].setAttributes(h, true)
									}
									v.onPlaceCallout(g, k, t, r, o, a, q, d, l);
									l.push(g);
									d++
								}
							}
						}
						this.hideCallouts(d)
					},
					onCreateCallout : function(f, k, e, g) {
						var h = this, j = h.calloutsGroup, d = h.callouts, l = d.styles, b = h.chart.surface, a = {
							label : false,
							box : false,
							lines : false
						};
						a.lines = b.add(Ext.apply({}, {
							type : "path",
							path : "M0,0",
							stroke : "#555"
						}, l));
						a.box = b.add(Ext.apply({}, {
							type : "rect",
							stroke : "#555",
							fill : "#fff"
						}, l));
						a.label = b.add(Ext.apply({}, {
							type : "text",
							text : g
						}, l));
						return a
					},
					hideCallouts : function(b) {
						var e = this.calloutsArray, a = e.length, f, d;
						while (a-- > b) {
							f = e[a];
							for (d in f) {
								f[d].hide(true)
							}
						}
					}
				});
Ext.define("Ext.chart.series.Series", {
	mixins : {
		labels : "Ext.chart.Labels",
		highlights : "Ext.chart.Highlights",
		tips : "Ext.chart.Tips",
		callouts : "Ext.chart.Callouts"
	},
	type : null,
	title : null,
	showInLegend : true,
	renderer : function(f, a, d, e, b) {
		return d
	},
	shadowAttributes : null,
	constructor : function(a) {
		var b = this;
		if (a) {
			Ext.apply(b, a)
		}
		b.shadowGroups = [];
		b.mixins.labels.constructor.call(b, a);
		b.mixins.highlights.constructor.call(b, a);
		b.mixins.tips.constructor.call(b, a);
		b.mixins.callouts.constructor.call(b, a);
		b.chart.on({
			scope : b,
			itemmouseover : b.onItemMouseOver,
			itemmouseout : b.onItemMouseOut,
			itemmousedown : b.onItemMouseDown,
			itemmouseup : b.onItemMouseUp,
			mouseleave : b.onMouseLeave
		})
	},
	onAnimate : function(d, a) {
		var b = Ext.apply({}, this.chart.animate);
		return new Ext.fx.Anim(Ext.apply(b, {
			target : d
		}, a))
	},
	getGutters : function() {
		return [ 0, 0 ]
	},
	onItemMouseUp : Ext.emptyFn,
	onItemMouseDown : Ext.emptyFn,
	onItemMouseOver : function(b) {
		var a = this;
		if (b.series === a) {
			if (a.highlight) {
				a.highlightItem(b)
			}
			if (a.tooltip) {
				a.showTip(b)
			}
		}
	},
	onItemMouseOut : function(b) {
		var a = this;
		if (b.series === a) {
			a.unHighlightItem();
			if (a.tooltip) {
				a.hideTip(b)
			}
		}
	},
	onMouseLeave : function() {
		var a = this;
		a.unHighlightItem();
		if (a.tooltip) {
			a.hideTip()
		}
	},
	getItemForPoint : function(a, b) {
		return null
	},
	hideAll : function() {
		var g = this, b = g.items, f, a, e, d;
		g._prevShowMarkers = g.showMarkers;
		g.showMarkers = false;
		g.hideLabels(0);
		for (e = 0, a = b.length; e < a; e++) {
			f = b[e];
			d = f.sprite;
			if (d) {
				d.setAttributes({
					hidden : true
				}, true)
			}
		}
	},
	showAll : function() {
		var a = this, b = a.chart.animate;
		a.chart.animate = false;
		a.showMarkers = a._prevShowMarkers;
		a.drawSeries();
		a.chart.animate = b
	},
	getLegendColor : function(a) {
		var b = this, e, d;
		if (b.seriesStyle) {
			e = b.seriesStyle.fill;
			d = b.seriesStyle.stroke;
			if (e && e != "none") {
				return e
			}
			return d
		}
		return "#000"
	}
});
Ext.define("Ext.chart.series.Cartesian", {
	extend : "Ext.chart.series.Series",
	xField : null,
	yField : null,
	axis : "left"
});
Ext.define("Ext.chart.axis.Abstract", {
	requires : [ "Ext.chart.Chart" ],
	constructor : function(a) {
		a = a || {};
		var b = this, d = a.position || "left";
		d = d.charAt(0).toUpperCase() + d.substring(1);
		a.label = Ext.apply(a["axisLabel" + d + "Style"] || {}, a.label || {});
		a.axisTitleStyle = Ext.apply(a["axisTitle" + d + "Style"] || {},
				a.labelTitle || {});
		Ext.apply(b, a);
		b.fields = [].concat(b.fields);
		Ext.chart.axis.Abstract.superclass.constructor.call(b);
		b.labels = [];
		b.getId();
		b.labelGroup = b.chart.surface.getGroup(b.axisId + "-labels")
	},
	alignment : null,
	grid : false,
	steps : 10,
	x : 0,
	y : 0,
	minValue : 0,
	maxValue : 0,
	getId : function() {
		return this.axisId || (this.axisId = Ext.id(null, "ext-axis-"))
	},
	drawAxis : Ext.emptyFn,
	addDisplayAndLabels : Ext.emptyFn
});
Ext
		.define(
				"Ext.chart.axis.Axis",
				{
					extend : "Ext.chart.axis.Abstract",
					requires : [ "Ext.draw.Draw" ],
					dashSize : 3,
					position : "bottom",
					skipFirst : false,
					length : 0,
					width : 0,
					applyData : Ext.emptyFn,
					calcEnds : function() {
						var m = this, q = m.chart.store, f = m.chart.series.items, j = m.fields, k = j.length, g, b, p, e, d = isNaN(m.minimum) ? Infinity
								: m.minimum, o = isNaN(m.maximum) ? -Infinity
								: m.maximum, h = m.prevMin, r = m.prevMax, a = false, n = 0, s = [];
						for (g = 0, b = f.length; !a && g < b; g++) {
							a = a || f[g].stacked;
							s = f[g].__excludes || s
						}
						q.each(function(i) {
							if (a) {
								if (!isFinite(d)) {
									d = 0
								}
								for (p = 0, g = 0; g < k; g++) {
									if (s[g]) {
										continue
									}
									p += i.get(j[g])
								}
								o = Math.max(o, p);
								d = Math.min(d, p)
							} else {
								for (g = 0; g < k; g++) {
									if (s[g]) {
										continue
									}
									p = i.get(j[g]);
									o = Math.max(o, p);
									d = Math.min(d, p)
								}
							}
						});
						if (!isFinite(o)) {
							o = m.prevMax || 0
						}
						if (!isFinite(d)) {
							d = m.prevMin || 0
						}
						e = Ext.draw.Draw.snapEnds(d, o >> 0, m.steps);
						if (!isNaN(m.maximum)) {
							e.to = Math.max(e.to, m.maximum)
						}
						if (!isNaN(m.minimum)) {
							e.from = Math.min(e.from, m.minimum)
						}
						if (m.adjustMaximumByMajorUnit) {
							e.to += e.step
						}
						if (m.adjustMinimumByMajorUnit) {
							e.from -= e.step
						}
						m.prevMin = d;
						m.prevMax = o;
						return e
					},
					drawAxis : function(n) {
						var s = this, h = s.x, g = s.y, q = s.chart.maxGutter[0], p = s.chart.maxGutter[1], e = s.dashSize, a = s.length, t = s.position, f = [], i = false, b = s
								.applyData(), d = b.step, o, m, l, k, j, r;
						s.from = b.from;
						s.to = b.to;
						if (t == "left" || t == "right") {
							m = Math.floor(h) + 0.5;
							k = [ "M", m, g, "l", 0, -a ];
							o = a - (p * 2)
						} else {
							l = Math.floor(g) + 0.5;
							k = [ "M", h, l, "l", a, 0 ];
							o = a - (q * 2)
						}
						r = o / b.steps;
						if (s.type == "Numeric") {
							i = true;
							s.labels = [ b.from ]
						}
						if (t == "right" || t == "left") {
							l = g - p;
							m = h - ((t == "left") * e * 2);
							while (l >= g - p - o) {
								k = k.concat([ "M", m, Math.floor(l) + 0.5,
										"l", e * 2 + 1, 0 ]);
								f.push([ Math.floor(h), Math.floor(l) ]);
								l -= r;
								if (i) {
									s.labels.push(s.labels[s.labels.length - 1]
											+ d)
								}
							}
							if (Math.round(l + r - (g - p - o))) {
								k = k.concat([ "M", m,
										Math.floor(g - a + p) + 0.5, "l",
										e * 2 + 1, 0 ]);
								f.push([ Math.floor(h), Math.floor(l) ]);
								if (i) {
									s.labels.push(s.labels[s.labels.length - 1]
											+ d)
								}
							}
						} else {
							m = h + q;
							l = g - (!!(t == "top") * e * 2);
							while (m <= h + q + o) {
								k = k.concat([ "M", Math.floor(m) + 0.5, l,
										"l", 0, e * 2 + 1 ]);
								f.push([ Math.floor(m), Math.floor(g) ]);
								m += r;
								if (i) {
									s.labels.push(s.labels[s.labels.length - 1]
											+ d)
								}
							}
							if (Math.round(m - r - (h + q + o))) {
								k = k.concat([ "M",
										Math.floor(h + a - q) + 0.5, l, "l", 0,
										e * 2 + 1 ]);
								f.push([ Math.floor(m), Math.floor(g) ]);
								if (i) {
									s.labels.push(s.labels[s.labels.length - 1]
											+ d)
								}
							}
						}
						if (!s.axis) {
							s.axis = s.chart.surface.add(Ext.apply({
								type : "path",
								path : k
							}, s.axisStyle))
						}
						s.axis.setAttributes({
							path : k
						}, true);
						s.inflections = f;
						if (!n && s.grid) {
							s.drawGrid()
						}
						s.axisBBox = s.axis.getBBox();
						s.drawLabels()
					},
					drawGrid : function() {
						var u = this, o = u.chart.surface, b = u.grid, e = b.odd, f = b.even, h = u.inflections, k = h.length
								- ((e || f) ? 0 : 1), v = u.position, d = u.chart.maxGutter, n = u.width - 2, s = false, p, q, r = 1, m = [], g, a, j, l = [], t = [];
						if ((d[1] !== 0 && (v == "left" || v == "right"))
								|| (d[0] !== 0 && (v == "top" || v == "bottom"))) {
							r = 0;
							k++
						}
						for (; r < k; r++) {
							p = h[r];
							q = h[r - 1];
							if (e || f) {
								m = (r % 2) ? l : t;
								g = ((r % 2) ? e : f) || {};
								a = (g.lineWidth || g["stroke-width"] || 0) / 2;
								j = 2 * a;
								if (v == "left") {
									m.push("M", q[0] + 1 + a, q[1] + 0.5 - a,
											"L", q[0] + 1 + n - a, q[1] + 0.5
													- a, "L", p[0] + 1 + n - a,
											p[1] + 0.5 + a, "L", p[0] + 1 + a,
											p[1] + 0.5 + a, "Z")
								} else {
									if (v == "right") {
										m.push("M", q[0] - a, q[1] + 0.5 - a,
												"L", q[0] - n + a, q[1] + 0.5
														- a, "L", p[0] - n + a,
												p[1] + 0.5 + a, "L", p[0] - a,
												p[1] + 0.5 + a, "Z")
									} else {
										if (v == "top") {
											m.push("M", q[0] + 0.5 + a, q[1]
													+ 1 + a, "L", q[0] + 0.5
													+ a, q[1] + 1 + n - a, "L",
													p[0] + 0.5 - a, p[1] + 1
															+ n - a, "L", p[0]
															+ 0.5 - a, p[1] + 1
															+ a, "Z")
										} else {
											m.push("M", q[0] + 0.5 + a, q[1]
													- a, "L", q[0] + 0.5 + a,
													q[1] - n + a, "L", p[0]
															+ 0.5 - a, p[1] - n
															+ a, "L", p[0]
															+ 0.5 - a,
													p[1] - a, "Z")
										}
									}
								}
							} else {
								if (v == "left") {
									m = m.concat([ "M", p[0] + 0.5, p[1] + 0.5,
											"l", n, 0 ])
								} else {
									if (v == "right") {
										m = m.concat([ "M", p[0] - 0.5,
												p[1] + 0.5, "l", -n, 0 ])
									} else {
										if (v == "top") {
											m = m.concat([ "M", p[0] + 0.5,
													p[1] + 0.5, "l", 0, n ])
										} else {
											m = m.concat([ "M", p[0] + 0.5,
													p[1] - 0.5, "l", 0, -n ])
										}
									}
								}
							}
						}
						if (e || f) {
							if (l.length) {
								if (!u.gridOdd && l.length) {
									u.gridOdd = o.add({
										type : "path",
										path : l
									})
								}
								u.gridOdd.setAttributes(Ext.apply({
									path : l,
									hidden : false
								}, e || {}), true)
							}
							if (t.length) {
								if (!u.gridEven) {
									u.gridEven = o.add({
										type : "path",
										path : t
									})
								}
								u.gridEven.setAttributes(Ext.apply({
									path : t,
									hidden : false
								}, f || {}), true)
							}
						} else {
							if (m.length) {
								if (!u.gridLines) {
									u.gridLines = u.chart.surface.add({
										type : "path",
										path : m,
										"stroke-width" : u.lineWidth || 1,
										stroke : u.gridColor || "#ccc"
									})
								}
								u.gridLines.setAttributes({
									hidden : false,
									path : m
								}, true)
							} else {
								if (u.gridLines) {
									u.gridLines.hide(true)
								}
							}
						}
					},
					drawLabels : function() {
						var B = this, g = B.inflections, k = g.length, p = B.chart, C = B.position, z = B.labels, s = p.surface, q = B.labelGroup, v = 0, r = 0, w = B.chart.maxGutter[1], a, t, d, b, l, A, n, f, o, e, j, m, h, u;
						if (C == "left" || C == "right") {
							j = k;
							for (u = 0; u < j; u++) {
								t = g[u];
								o = B.label.renderer(z[u]);
								A = q.getAt(u);
								if (A) {
									if (o != A.attr.text) {
										A.setAttributes(Ext.apply({
											text : o
										}, B.label), true);
										A._bbox = A.getBBox()
									}
								} else {
									A = s.add(Ext.apply({
										group : q,
										type : "text",
										x : 0,
										y : 0,
										text : o
									}, B.label));
									s.renderItem(A);
									A._bbox = A.getBBox()
								}
								n = A.attr;
								a = A._bbox;
								v = Math.max(v, a.width + B.dashSize
										+ B.label.padding);
								h = t[1];
								if (w < a.height / 2) {
									if (u == j - 1
											&& p.axes.findIndex("position",
													"top") == -1) {
										h = B.y - B.length
												+ Math.ceil(a.height / 2)
									} else {
										if (u == 0
												&& p.axes.findIndex("position",
														"bottom") == -1) {
											h = B.y - Math.floor(a.height / 2)
										}
									}
								}
								if (C == "left") {
									m = t[0] - a.width - B.dashSize
											- B.label.padding - 2
								} else {
									m = t[0] + B.dashSize + B.label.padding + 2
								}
								if (m != n.x || h != n.y || n.hidden) {
									A.setAttributes(Ext.apply({
										hidden : false,
										x : m,
										y : h
									}, B.label), true)
								}
							}
						} else {
							j = k - 1;
							for (u = j; u >= 0; u--) {
								t = g[u];
								o = B.label.renderer(z[u]);
								A = q.getAt(j - u);
								if (A) {
									if (o != A.attr.text) {
										A.setAttributes({
											text : o
										}, true);
										A._bbox = A.getBBox()
									}
								} else {
									A = s.add(Ext.apply({
										group : q,
										type : "text",
										x : 0,
										y : 0,
										text : o
									}, B.label));
									s.renderItem(A);
									A._bbox = A.getBBox()
								}
								n = A.attr;
								a = A._bbox;
								r = Math.max(r, a.height + B.dashSize
										+ B.label.padding);
								m = Math.floor(t[0] - (a.width / 2));
								if (B.chart.maxGutter[0] == 0) {
									if (u == 0
											&& p.axes.findIndex("position",
													"left") == -1) {
										m = t[0]
									} else {
										if (u == j
												&& p.axes.findIndex("position",
														"right") == -1) {
											m = t[0] - a.width
										}
									}
								}
								f = m + a.width + B.label.padding;
								if (u != 0 && (u != j) && f > d) {
									if (!B.elipsis(A, o, d - m, 35, t[0])) {
										A.hide(true);
										continue
									}
								}
								if (u == 0 && d < f) {
									if (q.getCount() > 2) {
										l = q.getAt((j - u) - 1);
										B.elipsis(l, l.attr.text, q.getAt(
												(j - u) - 2).getBBox().x
												- f, 35, g[u + 1][0])
									}
								}
								d = m;
								if (C == "top") {
									h = t[1] - (B.dashSize * 2)
											- B.label.padding - (a.height / 2)
								} else {
									h = t[1] + (B.dashSize * 2)
											+ B.label.padding + (a.height / 2)
								}
								A.setAttributes({
									hidden : false,
									x : m,
									y : h
								}, true)
							}
						}
						k = q.getCount();
						u = g.length;
						for (; u < k; u++) {
							q.getAt(u).hide(true)
						}
						B.bbox = {};
						Ext.apply(B.bbox, B.axisBBox);
						B.bbox.height = r;
						B.bbox.width = v;
						if (Ext.isString(B.title)) {
							B.drawTitle(v, r)
						}
					},
					elipsis : function(e, h, d, f, b) {
						var g, a;
						if (d < f) {
							e.hide(true);
							return false
						}
						while (h.length > 4) {
							h = h.substr(0, h.length - 4) + "...";
							e.setAttributes({
								text : h
							}, true);
							g = e.getBBox();
							if (g.width < d) {
								if (typeof b == "number") {
									e.setAttributes({
										x : Math.floor(b - (g.width / 2))
									}, true)
								}
								break
							}
						}
						return true
					},
					drawTitle : function(j, k) {
						var g = this, f = g.position, b = g.chart.surface, e = (f == "left" || f == "right"), i = g.x, h = g.y, a, l, d;
						if (!g.displaySprite) {
							a = {
								type : "text",
								x : 0,
								y : 0,
								text : g.title
							};
							g.displaySprite = b.add(Ext.apply(a,
									g.axisTitleStyle, g.labelTitle));
							b.renderItem(g.displaySprite)
						}
						l = g.displaySprite.getBBox();
						d = g.dashSize + g.label.padding;
						if (e) {
							h -= ((g.length / 2) - (l.height / 2));
							if (f == "left") {
								i -= (j + d + (l.width / 2))
							} else {
								i += (j + d + l.width - (l.width / 2))
							}
							g.bbox.width += l.width + 10
						} else {
							i += (g.length / 2) - (l.width * 0.5);
							if (f == "top") {
								h -= (k + d + (l.height * 0.3))
							} else {
								h += (k + d + (l.height * 0.8))
							}
							g.bbox.height += l.height + 10
						}
						g.displaySprite.setAttributes({
							translate : {
								x : i,
								y : h
							}
						}, true)
					}
				});
Ext
		.define(
				"Ext.chart.series.Area",
				{
					extend : "Ext.chart.series.Cartesian",
					requires : [ "Ext.chart.axis.Axis", "Ext.fx.Anim" ],
					type : "area",
					style : {},
					constructor : function(d) {
						this.parent(arguments);
						var f = this, a = f.chart.surface, e, b;
						Ext.apply(f, d, {
							__excludes : [],
							highlightCfg : {
								lineWidth : 3,
								stroke : "#55c",
								opacity : 0.8,
								color : "#f00"
							}
						});
						if (f.highlight) {
							f.highlightSprite = a.add({
								type : "path",
								path : [ "M", 0, 0 ],
								zIndex : 1000,
								opacity : 0.3,
								lineWidth : 5,
								hidden : true,
								stroke : "#444"
							})
						}
						f.group = a.getGroup(f.seriesId)
					},
					shrink : function(b, n, o) {
						var k = b.length, m = Math.floor(k / o), h, g, e = 0, l = this.areas.length, a = [], f = [], d = [];
						for (g = 0; g < l; ++g) {
							a[g] = 0
						}
						for (h = 0; h < k; ++h) {
							e += b[h];
							for (g = 0; g < l; ++g) {
								a[g] += n[h][g]
							}
							if (h % m == 0) {
								f.push(e / m);
								for (g = 0; g < l; ++g) {
									a[g] /= m
								}
								d.push(a);
								e = 0;
								for (g = 0, a = []; g < l; ++g) {
									a[g] = 0
								}
							}
						}
						return {
							x : f,
							y : d
						}
					},
					getBounds : function() {
						var w = this, m = w.chart, h = m.substore || m.store, j = m.chartBBox, s = m.maxGutter[0], q = m.maxGutter[1], g = []
								.concat(w.yField), z = g.length, o = [], e = [], a, d, v, u, t, r, k, B, b, n, p, A, l, i, f;
						a = w.bbox = {};
						a.x = j.x + s;
						a.y = j.y + q;
						a.width = j.width - (s * 2);
						a.height = j.height - (q * 2);
						d = m.axes.get(w.axis);
						if (d) {
							if (d.position == "top" || d.position == "bottom") {
								v = d.from;
								u = d.to
							} else {
								t = d.from;
								r = d.to
							}
						} else {
							if (w.xField) {
								k = new Ext.chart.axis.Axis({
									chart : m,
									fields : [ w.xField ]
								}).calcEnds();
								v = k.from;
								u = k.to
							} else {
								if (g.length) {
									k = new Ext.chart.axis.Axis({
										chart : m,
										fields : [ g ]
									}).calcEnds();
									t = k.from;
									r = k.to
								}
							}
						}
						if (isNaN(v)) {
							v = 0;
							B = a.width / (h.getCount() - 1)
						} else {
							B = a.width / (u - v)
						}
						if (isNaN(t)) {
							t = 0;
							b = a.height / (h.getCount() - 1)
						} else {
							b = a.height / (r - t)
						}
						h.each(function(C, D) {
							if (D == 0) {
								u = 0;
								r = 0
							}
							n = C.get(w.xField);
							p = [];
							if (typeof n != "number") {
								n = D
							}
							o.push(n);
							l = 0;
							for (A = 0; A < z; A++) {
								areaElem = C.get(g[A]);
								l += areaElem;
								if (typeof areaElem == "number") {
									p.push(areaElem)
								} else {
									p.push(D)
								}
							}
							u = Math.max(u, n);
							r = Math.max(r, l);
							e.push(p)
						}, w);
						B = a.width / (u - v);
						b = a.height / (r - t);
						i = o.length;
						if ((i > a.width || i > a.height) && w.areas) {
							f = w.shrink(o, e, Math.min(a.width, a.height));
							o = f.x;
							e = f.y
						}
						return {
							bbox : a,
							minX : v,
							minY : t,
							xValues : o,
							yValues : e,
							xScale : B,
							yScale : b,
							areasLen : z
						}
					},
					getPaths : function() {
						var u = this, k = u.chart, b = k.substore || k.store, d = true, e = u
								.getBounds(), a = e.bbox, l = u.items = [], t = [], n = [], q, g, h, f, o, r, j, v, p, s, m;
						g = e.xValues.length;
						for (q = 0; q < g; q++) {
							o = e.xValues[q];
							r = e.yValues[q];
							h = a.x + (o - e.minX) * e.xScale;
							j = 0;
							for (v = 0; v < e.areasLen; v++) {
								if (u.__excludes[v]) {
									continue
								}
								if (!t[v]) {
									t[v] = []
								}
								s = r[v];
								j += s;
								f = a.y + a.height - (j - e.minY) * e.yScale;
								if (!n[v]) {
									n[v] = [ "M", h, f ];
									t[v].push([ "L", h, f ])
								} else {
									n[v].push("L", h, f);
									t[v].push([ "L", h, f ])
								}
								if (!l[v]) {
									l[v] = {
										pointsUp : [],
										pointsDown : [],
										series : u
									}
								}
								l[v].pointsUp.push([ h, f ])
							}
						}
						for (v = 0; v < e.areasLen; v++) {
							if (u.__excludes[v]) {
								continue
							}
							m = n[v];
							if (v == 0 || d) {
								d = false;
								m.push("L", h, a.y + a.height, "L", a.x, a.y
										+ a.height, "Z")
							} else {
								componentPath = t[p];
								componentPath.reverse();
								m.push("L", h, componentPath[0][2]);
								for (q = 0; q < g; q++) {
									m.push(componentPath[q][0],
											componentPath[q][1],
											componentPath[q][2]);
									l[v].pointsDown[g - q - 1] = [
											componentPath[q][1],
											componentPath[q][2] ]
								}
								m.push("L", a.x, m[2], "Z")
							}
							p = v
						}
						return {
							paths : n,
							areasLen : e.areasLen
						}
					},
					drawSeries : function() {
						var i = this, h = i.chart, j = h.substore || h.store, d = h.surface, b = h.animate, l = i.group, a = Ext
								.apply(i.seriesStyle, i.style), m = i.colorArrayStyle, o = m
								&& m.length || 0, f = i.seriesLabelStyle, e, g, n, k;
						i.unHighlightItem();
						i.cleanHighlights();
						paths = i.getPaths();
						if (!i.areas) {
							i.areas = []
						}
						for (e = 0; e < paths.areasLen; e++) {
							if (i.__excludes[e]) {
								continue
							}
							if (!i.areas[e]) {
								i.items[e].sprite = i.areas[e] = d.add(Ext
										.apply({}, {
											type : "path",
											group : l,
											path : paths.paths[e],
											stroke : a.stroke || m[e % o],
											fill : m[e % o]
										}, a || {}))
							}
							g = i.areas[e];
							n = paths.paths[e];
							if (b) {
								k = i.renderer(g, false, {
									path : n,
									fill : m[e % o],
									stroke : a.stroke || m[e % o]
								}, e, j);
								i.animation = animation = i.onAnimate(g, {
									to : k
								})
							} else {
								k = i.renderer(g, false, {
									path : n,
									hidden : false,
									fill : m[e % o],
									stroke : a.stroke || m[e % o]
								}, e, j);
								i.areas[e].setAttributes(k, true)
							}
						}
						i.renderLabels();
						i.renderCallouts()
					},
					onAnimate : function(b, a) {
						b.show();
						return this.parent(arguments)
					},
					onCreateLabel : function(e, k, d, f) {
						var g = this, h = g.labelsGroup, a = g.label, j = g.bbox, b = Ext
								.apply(a, g.seriesLabelStyle);
						return g.chart.surface.add(Ext.apply({
							type : "text",
							"text-anchor" : "middle",
							group : h,
							x : k.point[0],
							y : j.y + j.height / 2
						}, b || {}))
					},
					onPlaceLabel : function(g, k, s, p, o, d, f) {
						var u = this, l = u.chart, r = l.resizing, t = u.label, q = t.renderer, b = t.field, a = u.bbox, j = s.point[0], h = s.point[1], e, n, m;
						g.setAttributes({
							text : q(k.get(b[f])),
							hidden : true
						}, true);
						e = g.getBBox();
						n = e.width / 2;
						m = e.height / 2;
						j = j - n < a.x ? a.x + n : j;
						j = (j + n > a.x + a.width) ? (j - (j + n - a.x - a.width))
								: j;
						h = h - m < a.y ? a.y + m : h;
						h = (h + m > a.y + a.height) ? (h - (h + m - a.y - a.height))
								: h;
						if (u.chart.animate && !u.chart.resizing) {
							g.show(true);
							u.onAnimate(g, {
								to : {
									x : j,
									y : h
								}
							})
						} else {
							g.setAttributes({
								x : j,
								y : h
							}, true);
							if (r) {
								u.animation.on("afteranimate", function() {
									g.show(true)
								})
							} else {
								g.show(true)
							}
						}
					},
					onPlaceCallout : function(m, r, J, G, F, e, k) {
						var M = this, s = M.chart, D = s.surface, H = s.resizing, L = M.callouts, t = M.items, v = (G == 0) ? false
								: t[G - 1].point, z = (G == t.length - 1) ? false
								: t[G + 1].point, d = J.point, A, g, N, K, o, q, b = m.label
								.getBBox(), I = 30, C = 10, B = 3, h, f, j, w, u, E = M.clipRect, n, l;
						if (!v) {
							v = d
						}
						if (!z) {
							z = d
						}
						K = (z[1] - v[1]) / (z[0] - v[0]);
						o = (d[1] - v[1]) / (d[0] - v[0]);
						q = (z[1] - d[1]) / (z[0] - d[0]);
						g = Math.sqrt(1 + K * K);
						A = [ 1 / g, K / g ];
						N = [ -A[1], A[0] ];
						if (o > 0 && q < 0 && N[1] < 0 || o < 0 && q > 0
								&& N[1] > 0) {
							N[0] *= -1;
							N[1] *= -1
						} else {
							if (Math.abs(o) < Math.abs(q) && N[0] < 0
									|| Math.abs(o) > Math.abs(q) && N[0] > 0) {
								N[0] *= -1;
								N[1] *= -1
							}
						}
						n = d[0] + N[0] * I;
						l = d[1] + N[1] * I;
						h = n + (N[0] > 0 ? 0 : -(b.width + 2 * B));
						f = l - b.height / 2 - B;
						j = b.width + 2 * B;
						w = b.height + 2 * B;
						if (h < E[0] || (h + j) > (E[0] + E[2])) {
							N[0] *= -1
						}
						if (f < E[1] || (f + w) > (E[1] + E[3])) {
							N[1] *= -1
						}
						n = d[0] + N[0] * I;
						l = d[1] + N[1] * I;
						h = n + (N[0] > 0 ? 0 : -(b.width + 2 * B));
						f = l - b.height / 2 - B;
						j = b.width + 2 * B;
						w = b.height + 2 * B;
						m.lines.setAttributes({
							path : [ "M", d[0], d[1], "L", n, l, "Z" ]
						}, true);
						m.box.setAttributes({
							x : h,
							y : f,
							width : j,
							height : w
						}, true);
						m.label.setAttributes({
							x : n + (N[0] > 0 ? B : -(b.width + B)),
							y : l
						}, true);
						for (u in m) {
							m[u].show(true)
						}
					},
					getItemForPoint : function(k, h) {
						var D = this, n = D.items, q = Infinity, v = 20, o, f, j, r, m = Math.abs, a = D.bbox, l = null, B, A, e, s, z, t, g, w, d, u, b, C;
						if (k < a.x || k > a.x + a.width || h < a.y
								|| h > a.y + a.height) {
							return null
						}
						if (n && n.length) {
							for (t = 0, g = n.length; t < g; t++) {
								B = n[t];
								if (B) {
									j = B.pointsUp;
									pointsDown = B.pointsDown;
									q = Infinity;
									for (o = 0, f = j.length; o < f; o++) {
										r = [ j[o][0], j[o][1] ];
										if (q > m(k - r[0])) {
											q = m(k - r[0])
										} else {
											r = j[o - 1];
											if (h >= r[1]
													&& (!pointsDown.length || h <= (pointsDown[o - 1][1]))) {
												B.storeIndex = o - 1;
												B.storeField = D.yField[t];
												B.storeItem = D.chart.store
														.getAt(o - 1);
												B._points = pointsDown.length ? [
														r, pointsDown[o - 1] ]
														: [ r ];
												return B
											} else {
												break
											}
										}
									}
								}
							}
						}
						return null
					},
					highlightSeries : function() {
						var a, d, b;
						if (this._index !== undefined) {
							a = this.areas[this._index];
							if (a.__highlightAnim) {
								a.__highlightAnim.paused = true
							}
							a.__highlighted = true;
							a.__prevOpacity = a.__prevOpacity || a.attr.opacity
									|| 1;
							a.__prevFill = a.__prevFill || a.attr.fill;
							a.__prevLineWidth = a.__prevLineWidth
									|| a.attr.lineWidth;
							b = Ext.draw.Color.fromString(a.__prevFill);
							d = {
								lineWidth : (a.__prevLineWidth || 0) + 2
							};
							if (b) {
								d.fill = b.getLighter(0.2).toString()
							} else {
								d.opacity = Math.max(a.__prevOpacity - 0.3, 0)
							}
							if (this.chart.animate) {
								a.__highlightAnim = new Ext.fx.Anim(Ext.apply({
									target : a,
									to : d
								}, this.chart.animate))
							} else {
								a.setAttributes(d, true)
							}
						}
					},
					unHighlightSeries : function() {
						var a;
						if (this._index !== undefined) {
							a = this.areas[this._index];
							if (a.__highlightAnim) {
								a.__highlightAnim.paused = true
							}
							if (a.__highlighted) {
								a.__highlighted = false;
								a.__highlightAnim = new Ext.fx.Anim({
									target : a,
									to : {
										fill : a.__prevFill,
										opacity : a.__prevOpacity,
										lineWidth : a.__prevLineWidth
									}
								})
							}
						}
					},
					highlightItem : function(d) {
						var b = this, a, e;
						if (!d) {
							this.highlightSeries();
							return
						}
						a = d._points;
						e = a.length == 2 ? [ "M", a[0][0], a[0][1], "L",
								a[1][0], a[1][1] ] : [ "M", a[0][0], a[0][1],
								"L", a[0][0], b.bbox.y + b.bbox.height ];
						b.highlightSprite.setAttributes({
							path : e,
							hidden : false
						}, true)
					},
					unHighlightItem : function(a) {
						if (!a) {
							this.unHighlightSeries()
						}
						if (this.highlightSprite) {
							this.highlightSprite.hide(true)
						}
					},
					hideAll : function() {
						if (!isNaN(this._index)) {
							this.__excludes[this._index] = true;
							this.areas[this._index].hide(true);
							this.drawSeries()
						}
					},
					showAll : function() {
						if (!isNaN(this._index)) {
							this.__excludes[this._index] = false;
							this.areas[this._index].show(true);
							this.drawSeries()
						}
					},
					getLegendColor : function(a) {
						var b = this;
						return b.colorArrayStyle[a % b.colorArrayStyle.length]
					}
				});
Ext.define("Ext.tip.QuickTip", {
	extend : "Ext.tip.ToolTip",
	alias : "widget.quicktip",
	interceptTitles : false,
	tagConfig : {
		namespace : "ext",
		attribute : "qtip",
		width : "qwidth",
		target : "target",
		title : "qtitle",
		hide : "hide",
		cls : "qclass",
		align : "qalign",
		anchor : "anchor"
	},
	initComponent : function() {
		this.target = this.target || Ext.getDoc();
		this.targets = this.targets || {};
		Ext.tip.QuickTip.superclass.initComponent.call(this)
	},
	register : function(e) {
		var g = Ext.isArray(e) ? e : arguments;
		for (var f = 0, a = g.length; f < a; f++) {
			var k = g[f];
			var h = k.target;
			if (h) {
				if (Ext.isArray(h)) {
					for (var d = 0, b = h.length; d < b; d++) {
						this.targets[Ext.id(h[d])] = k
					}
				} else {
					this.targets[Ext.id(h)] = k
				}
			}
		}
	},
	unregister : function(a) {
		delete this.targets[Ext.id(a)]
	},
	cancelShow : function(b) {
		var a = this.activeTarget;
		b = Ext.get(b).dom;
		if (this.isVisible()) {
			if (a && a.el == b) {
				this.hide()
			}
		} else {
			if (a && a.el == b) {
				this.clearTimer("show")
			}
		}
	},
	getTipCfg : function(f) {
		var b = f.getTarget(), d, a;
		if (this.interceptTitles && b.title && Ext.isString(b.title)) {
			d = b.title;
			b.qtip = d;
			b.removeAttribute("title");
			f.preventDefault()
		} else {
			a = this.tagConfig;
			d = b.qtip || Ext.fly(b).getAttribute(a.attribute, a.namespace)
		}
		return d
	},
	onTargetOver : function(i) {
		if (this.disabled) {
			return
		}
		this.targetXY = i.getXY();
		var d = i.getTarget();
		if (!d || d.nodeType !== 1 || d == document || d == document.body) {
			return
		}
		if (this.activeTarget
				&& ((d == this.activeTarget.el) || Ext
						.fly(this.activeTarget.el).contains(d))) {
			this.clearTimer("hide");
			this.show();
			return
		}
		if (d && this.targets[d.id]) {
			this.activeTarget = this.targets[d.id];
			this.activeTarget.el = d;
			this.anchor = this.activeTarget.anchor;
			if (this.anchor) {
				this.anchorTarget = d
			}
			this.delayShow();
			return
		}
		var g, h = Ext.fly(d), b = this.tagConfig, f = b.namespace;
		if (g = this.getTipCfg(i)) {
			var a = h.getAttribute(b.hide, f);
			this.activeTarget = {
				el : d,
				text : g,
				width : +h.getAttribute(b.width, f),
				autoHide : a != "user" && a !== "false",
				title : h.getAttribute(b.title, f),
				cls : h.getAttribute(b.cls, f),
				align : h.getAttribute(b.align, f)
			};
			this.anchor = h.getAttribute(b.anchor, f);
			if (this.anchor) {
				this.anchorTarget = d
			}
			this.delayShow()
		}
	},
	onTargetOut : function(a) {
		if (this.activeTarget && a.within(this.activeTarget.el)
				&& !this.getTipCfg(a)) {
			return
		}
		this.clearTimer("show");
		if (this.autoHide !== false) {
			this.delayHide()
		}
	},
	showAt : function(b) {
		var a = this.activeTarget;
		if (a) {
			if (!this.rendered) {
				this.render(Ext.getBody());
				this.activeTarget = a
			}
			this.setTitle(a.title || "");
			this.body.update(a.text);
			this.autoHide = a.autoHide;
			this.dismissDelay = a.dismissDelay || this.dismissDelay;
			if (this.lastCls) {
				this.el.removeCls(this.lastCls);
				delete this.lastCls
			}
			if (a.cls) {
				this.el.addCls(a.cls);
				this.lastCls = a.cls
			}
			this.setWidth(a.width || null);
			if (this.anchor) {
				this.constrainPosition = false
			} else {
				if (a.align) {
					b = this.el.getAlignToXY(a.el, a.align);
					this.constrainPosition = false
				} else {
					this.constrainPosition = true
				}
			}
		}
		Ext.tip.QuickTip.superclass.showAt.call(this, b)
	},
	hide : function() {
		delete this.activeTarget;
		Ext.tip.QuickTip.superclass.hide.call(this)
	}
});
Ext.define("Ext.tip.QuickTips", function() {
	var b, a = false;
	return {
		requires : [ "Ext.tip.QuickTip" ],
		singleton : true,
		init : function(d) {
			if (!b) {
				if (!Ext.isReady) {
					Ext.onReady(function() {
						Ext.tip.QuickTips.init(d)
					});
					return
				}
				b = new Ext.tip.QuickTip({
					elements : "header,body",
					disabled : a,
					autoRender : d !== false
				})
			}
		},
		destroy : function() {
			if (b) {
				var d;
				b.destroy();
				b = d
			}
		},
		ddDisable : function() {
			if (b && !a) {
				b.disable()
			}
		},
		ddEnable : function() {
			if (b && !a) {
				b.enable()
			}
		},
		enable : function() {
			if (b) {
				b.enable()
			}
			a = false
		},
		disable : function() {
			if (b) {
				b.disable()
			}
			a = true
		},
		isEnabled : function() {
			return b !== undefined && !b.disabled
		},
		getQuickTip : function() {
			return b
		},
		register : function() {
			b.register.apply(b, arguments)
		},
		unregister : function() {
			b.unregister.apply(b, arguments)
		},
		tips : function() {
			b.register.apply(b, arguments)
		}
	}
}(), function() {
	Ext.QuickTips = this
});
Ext
		.define(
				"Ext.panel.Tool",
				{
					extend : "Ext.Component",
					requires : [ "Ext.tip.QuickTips" ],
					alias : "widget.tool",
					cls : Ext.baseCSSPrefix + "tool",
					disableCls : Ext.baseCSSPrefix + "tool-disabled",
					toolPressedCls : Ext.baseCSSPrefix + "tool-pressed",
					toolOverCls : Ext.baseCSSPrefix + "tool-over",
					ariaRole : "button",
					renderTpl : [ '<img src="{blank}" class="{cls}-{type}" role="presentation"/>' ],
					disabled : false,
					initComponent : function() {
						this.addEvents("click");
						this.type = this.type || this.id;
						Ext.applyIf(this.renderData, {
							cls : this.cls,
							blank : Ext.BLANK_IMAGE_URL,
							type : this.type
						});
						this.renderSelectors.toolEl = "." + this.cls + "-"
								+ this.type;
						Ext.panel.Tool.superclass.initComponent.call(this)
					},
					afterRender : function() {
						Ext.panel.Tool.superclass.afterRender.apply(this,
								arguments);
						if (this.qtip) {
							if (Ext.isObject(this.qtip)) {
								Ext.tip.QuickTips.register(Ext.apply({
									target : this.id
								}, this.qtip))
							} else {
								this.toolEl.dom.qtip = this.qtip
							}
						}
						this.mon(this.toolEl, {
							click : this.onClick,
							mousedown : this.onMouseDown,
							mouseover : this.onMouseOver,
							mouseout : this.onMouseOut,
							scope : this
						})
					},
					setType : function(a) {
						this.type = a;
						if (this.rendered) {
							this.toolEl.dom.className = this.cls + "-" + a
						}
					},
					enable : function() {
						this.toolEl.removeCls(this.disbledCls);
						this.disabled = false
					},
					disable : function() {
						this.toolEl.addCls(this.disbledCls);
						this.disabled = true
					},
					bindTo : function(a) {
						this.owner = a
					},
					onClick : function(f, d) {
						if (this.disabled) {
							return false
						}
						var b = this, a = b.owner || b.ownerCt;
						b.el.removeCls(b.toolPressedCls);
						b.el.removeCls(b.toolOverCls);
						if (b.stopEvent !== false) {
							f.stopEvent()
						}
						if (b.handler) {
							b.handler.call(b.scope || b, f, d, a, b)
						}
						this.fireEvent("click", b, f, d, a, b);
						return true
					},
					onMouseDown : function() {
						if (this.disabled) {
							return false
						}
						this.el.addCls(this.toolPressedCls)
					},
					onMouseOver : function() {
						this.el.addCls(this.toolOverCls)
					},
					onMouseOut : function() {
						this.el.removeCls(this.toolOverCls)
					}
				});
Ext
		.define(
				"Ext.chart.series.Bar",
				{
					extend : "Ext.chart.series.Cartesian",
					requires : [ "Ext.chart.axis.Axis", "Ext.fx.Anim" ],
					type : "bar",
					column : false,
					style : {},
					gutter : 38.2,
					groupGutter : 38.2,
					xpadding : 0,
					ypadding : 10,
					constructor : function(d) {
						this.parent(arguments);
						var f = this, a = f.chart.surface, g = f.chart.shadow, e, b;
						Ext.apply(f, d, {
							highlightCfg : {
								lineWidth : 3,
								stroke : "#55c",
								opacity : 0.8,
								color : "#f00"
							},
							shadowAttributes : [ {
								"stroke-width" : 6,
								"stroke-opacity" : 0.05,
								stroke : "rgb(200, 200, 200)",
								translate : {
									x : 1.2,
									y : 1.2
								}
							}, {
								"stroke-width" : 4,
								"stroke-opacity" : 0.1,
								stroke : "rgb(150, 150, 150)",
								translate : {
									x : 0.9,
									y : 0.9
								}
							}, {
								"stroke-width" : 2,
								"stroke-opacity" : 0.15,
								stroke : "rgb(100, 100, 100)",
								translate : {
									x : 0.6,
									y : 0.6
								}
							} ]
						});
						f.group = a.getGroup(f.seriesId + "-bars");
						if (g) {
							for (e = 0, b = f.shadowAttributes.length; e < b; e++) {
								f.shadowGroups.push(a.getGroup(f.seriesId
										+ "-shadows" + e))
							}
						}
					},
					getBarGirth : function() {
						var e = this, a = e.chart.store, b = e.column, d = a
								.getCount(), f = e.gutter / 100;
						return (e.chart.chartBBox[b ? "width" : "height"] - e[b ? "xpadding"
								: "ypadding"] * 2)
								/ (d * (f + 1) - f)
					},
					getGutters : function() {
						var b = this, a = b.column, d = Math
								.ceil(b[a ? "xpadding" : "ypadding"]
										+ b.getBarGirth() / 2);
						return b.column ? [ d, 0 ] : [ 0, d ]
					},
					getBounds : function() {
						var F = this, s = F.chart, k = s.substore || s.store, b = s.chartBBox, t = []
								.concat(F.yField), d = t.length, l = d, i = F.groupGutter / 100, D = s.maxGutter[0], A = s.maxGutter[1], g = F.column, n = F.xpadding, q = F.ypadding, B = F.stacked, r = F
								.getBarGirth(), h = Math, I = h.max, E = h.min, w = h.abs, p, C, z, a, f, G, o, H, m, u, v, e;
						if (F.__excludes) {
							for (u = 0, H = F.__excludes.length; u < H; u++) {
								if (F.__excludes[u]) {
									l--
								}
							}
						}
						if (F.yField) {
							p = new Ext.chart.axis.Axis({
								chart : s,
								fields : [].concat(F.yField)
							}).calcEnds();
							C = p.from;
							z = I(p.to, 0)
						}
						a = (g) ? {
							left : 1,
							right : 1
						} : {
							top : 1,
							bottom : 1
						};
						if (F.axis) {
							f = s.axes.get(F.axis);
							if (f && a.hasOwnProperty(f.position)) {
								C = f.from;
								z = I(f.to, 0)
							}
						}
						if (!isFinite(C)) {
							C = 0
						}
						if (!isFinite(z)) {
							z = 0
						}
						G = (g ? b.height - q * 2 : b.width - n * 2) / (z - C);
						groupBarWidth = r / ((B ? 1 : l) * (i + 1) - i);
						o = (g) ? b.y + b.height - q : b.x + n;
						if (B) {
							H = [ [], [] ];
							k.each(function(j, J) {
								H[0][J] = H[0][J] || 0;
								H[1][J] = H[1][J] || 0;
								for (u = 0; u < d; u++) {
									if (F.__excludes && F.__excludes[u]) {
										continue
									}
									m = j.get(t[u]);
									H[+(m > 0)][J] += w(m)
								}
							});
							v = I.apply(h, H[0]);
							e = I.apply(h, H[1]);
							G = (g ? b.height - q * 2 : b.width - n * 2)
									/ (v + e);
							o = o + v * G * (g ? -1 : 1)
						} else {
							if (C / z < 0) {
								o = o - C * G * (g ? -1 : 1)
							}
						}
						return {
							bars : t,
							bbox : b,
							barsLen : d,
							groupBarsLen : l,
							barWidth : r,
							groupBarWidth : groupBarWidth,
							scale : G,
							zero : o,
							xpadding : n,
							ypadding : q,
							signed : C / z < 0,
							minY : C,
							maxY : z
						}
					},
					getPaths : function() {
						var u = this, P = u.chart, b = P.substore || P.store, F = u.bounds = u
								.getBounds(), A = u.items = [], k = u.gutter / 100, d = u.groupGutter / 100, N = P.animate, I = u.column, w = u.group, l = P.shadow, L = u.shadowGroups, K = u.shadowAttributes, o = L.length, z = F.bbox, q = u.xpadding, t = u.ypadding, M = u.stacked, v = F.barsLen, J = u.colorArrayStyle, h = J
								&& J.length || 0, C = Math, m = C.max, G = C.min, s = C.abs, O, Q, f, H, D, a, i, r, p, n, g, e, E, B;
						b
								.each(
										function(j, S) {
											a = F.zero;
											i = F.zero;
											H = 0;
											D = 0;
											r = false;
											for (O = 0, g = 0; O < v; O++) {
												if (u.__excludes
														&& u.__excludes[O]) {
													continue
												}
												Q = j.get(F.bars[O]);
												f = ((Q - ((F.minY < 0) ? 0
														: F.minY)) * F.scale);
												p = {
													fill : J[(v > 1 ? O : 0)
															% h]
												};
												if (I) {
													Ext
															.apply(
																	p,
																	{
																		height : f,
																		width : m(
																				groupBarWidth,
																				0),
																		x : (z.x
																				+ q
																				+ S
																				* F.barWidth
																				* (1 + k) + g
																				* F.groupBarWidth
																				* (1 + d)
																				* !M),
																		y : a
																				- f
																	})
												} else {
													Ext
															.apply(
																	p,
																	{
																		height : m(
																				groupBarWidth,
																				0),
																		width : f,
																		x : a + 1,
																		y : (z.y
																				+ t
																				+ S
																				* F.barWidth
																				* (1 + k)
																				+ g
																				* F.groupBarWidth
																				* (1 + d)
																				* !M + 1)
																	})
												}
												if (f < 0) {
													if (I) {
														p.y = i;
														p.height = s(f)
													} else {
														p.x = i + f;
														p.width = s(f)
													}
												}
												if (M) {
													if (f < 0) {
														i += f * (I ? -1 : 1)
													} else {
														a += f * (I ? -1 : 1)
													}
													H += s(f);
													if (f < 0) {
														D += s(f)
													}
												}
												A
														.push({
															series : u,
															storeItem : j,
															value : [
																	j
																			.get(u.xField),
																	Q ],
															attr : p,
															point : I ? [
																	p.x
																			+ p.width
																			/ 2,
																	Q >= 0 ? p.y
																			: p.y
																					+ p.height ]
																	: [
																			Q >= 0 ? p.x
																					+ p.width
																					: p.x,
																			p.y
																					+ p.height
																					/ 2 ]
														});
												if (N && P.resizing) {
													n = I ? {
														x : p.x,
														y : F.zero,
														width : p.width,
														height : 0
													} : {
														x : F.zero,
														y : p.y,
														width : 0,
														height : p.height
													};
													if (l && (M && !r || !M)) {
														r = true;
														for (e = 0; e < o; e++) {
															E = L[e]
																	.getAt(M ? S
																			: (S
																					* v + O));
															if (E) {
																E
																		.setAttributes(
																				n,
																				true)
															}
														}
													}
													B = w.getAt(S * v + O);
													if (B) {
														B
																.setAttributes(
																		n, true)
													}
												}
												g++
											}
											if (M && A.length) {
												A[S * g].totalDim = H;
												A[S * g].totalNegDim = D
											}
										}, u)
					},
					renderShadows : function(u, v, A, l) {
						var B = this, p = B.chart, s = p.surface, g = p.animate, z = B.stacked, a = B.shadowGroups, w = B.shadowAttributes, o = a.length, h = p.substore
								|| p.store, d = B.column, r = B.items, b = [], m = l.zero, e, q, k, C, n, t, f;
						if ((z && (u % l.groupBarsLen === 0)) || !z) {
							t = u / l.groupBarsLen;
							for (e = 0; e < o; e++) {
								q = Ext.apply({}, w[e]);
								k = a[e].getAt(z ? t : u);
								Ext.copyTo(q, v, "x,y,width,height");
								if (!k) {
									k = s.add(Ext.apply({
										type : "rect",
										group : a[e]
									}, Ext.apply({}, A, q)))
								}
								if (z) {
									C = r[u].totalDim;
									n = r[u].totalNegDim;
									if (d) {
										q.y = m - n;
										q.height = C
									} else {
										q.x = m - n;
										q.width = C
									}
								}
								if (g) {
									if (!z) {
										rendererAttributes = B.renderer(k, h
												.getAt(t), q, u, h);
										B.onAnimate(k, {
											to : rendererAttributes
										})
									} else {
										rendererAttributes = B.renderer(k, h
												.getAt(t), Ext.apply(q, {
											hidden : true
										}), u, h);
										k.setAttributes(rendererAttributes,
												true)
									}
								} else {
									rendererAttributes = B.renderer(k, h
											.getAt(t), Ext.apply(q, {
										hidden : false
									}), u, h);
									k.setAttributes(rendererAttributes, true)
								}
								b.push(k)
							}
						}
						return b
					},
					drawSeries : function() {
						var F = this, r = F.chart, m = r.substore || r.store, v = r.surface, l = r.animate, D = F.stacked, f = F.column, d = r.shadow, b = F.shadowGroups, C = F.shadowAttributes, q = b.length, o = F.group, h = F.seriesStyle, a = F.colorArrayStyle, A = a
								&& a.length || 0, B = F.seriesLabelStyle, s, p, z, w, E, t, u, e, g, k, n;
						delete h.fill;
						endSeriesStyle = Ext.apply(h, this.style);
						F.unHighlightItem();
						F.cleanHighlights();
						F.getPaths();
						n = F.bounds;
						s = F.items;
						E = f ? {
							y : n.zero,
							height : 0
						} : {
							x : n.zero,
							width : 0
						};
						p = s.length;
						for (z = 0; z < p; z++) {
							t = o.getAt(z);
							barAttr = s[z].attr;
							if (d) {
								s[z].shadows = F
										.renderShadows(z, barAttr, E, n)
							}
							if (!t) {
								attrs = Ext.apply({}, E, barAttr);
								attrs = Ext.apply(attrs, endSeriesStyle || {});
								t = v.add(Ext.apply({}, {
									type : "rect",
									group : o
								}, attrs))
							}
							if (l) {
								e = F.renderer(t, m.getAt(z), barAttr, z, m);
								t._to = e;
								anim = F.onAnimate(t, {
									to : Ext.apply(e, endSeriesStyle)
								});
								if (d && D && (z % n.barsLen === 0)) {
									w = z / n.barsLen;
									for (g = 0; g < q; g++) {
										anim.on("afteranimate", function() {
											this.show(true)
										}, b[g].getAt(w))
									}
								}
							} else {
								e = F.renderer(t, m.getAt(z), Ext.apply(
										barAttr, {
											hidden : false
										}), z, m);
								t.setAttributes(Ext.apply(e, endSeriesStyle),
										true)
							}
							s[z].sprite = t
						}
						p = o.getCount();
						for (w = z; w < p; w++) {
							o.getAt(w).hide(true)
						}
						if (d) {
							for (g = 0; g < q; g++) {
								k = b[g];
								p = k.getCount();
								for (w = z; w < p; w++) {
									k.getAt(w).hide(true)
								}
							}
						}
						F.renderLabels()
					},
					onCreateLabel : function(f, l, e, g) {
						var h = this, a = h.chart.surface, k = h.labelsGroup, b = h.label, d = Ext
								.apply({}, b, h.seriesLabelStyle || {}), j;
						return a.add(Ext.apply({
							type : "text",
							group : k
						}, d || {}))
					},
					onPlaceLabel : function(h, n, I, B, w, e, f) {
						var M = this, a = M.bounds, L = a.groupBarWidth, d = a.column, p = M.chart, l = p.chartBBox, H = p.resizing, v = I.value[0], F = I.value[1], u = I.attr, K = M.label, A = K.orientation == "vertical", b = []
								.concat(K.field), C = K.renderer, o = C(n
								.get(b[f])), r = M.getLabelSize(o), t = r.width, q = r.height, m = a.zero, J = "outside", D = "insideStart", s = "insideEnd", G = 10, E = 6, g = a.signed, k, j, z;
						h.setAttributes({
							text : o
						});
						if (d) {
							if (w == J) {
								if (q + E + u.height > (F >= 0 ? m - l.y : l.y
										+ l.height - m)) {
									w = s
								}
							} else {
								if (q + E > u.height) {
									w = J
								}
							}
							k = u.x + L / 2;
							j = w == D ? (m + ((q / 2 + 3) * (F >= 0 ? -1 : 1)))
									: (F >= 0 ? (u.y + ((q / 2 + 3) * (w == J ? -1
											: 1)))
											: (u.y + u.height + ((q / 2 + 3) * (w === J ? 1
													: -1))))
						} else {
							if (w == J) {
								if (t + G + u.width > (F >= 0 ? l.x + l.width
										- m : m - l.x)) {
									w = s
								}
							} else {
								if (t + G > u.width) {
									w = J
								}
							}
							k = w == D ? (m + ((t / 2 + 5) * (F >= 0 ? 1 : -1)))
									: (F >= 0 ? (u.x + u.width + ((t / 2 + 5) * (w === J ? 1
											: -1)))
											: (u.x + ((t / 2 + 5) * (w === J ? -1
													: 1))));
							j = u.y + L / 2
						}
						z = {
							x : k,
							y : j
						};
						if (A) {
							z.rotate = {
								x : k,
								y : j,
								degrees : 270
							}
						}
						if (e && H) {
							if (d) {
								k = u.x + u.width / 2;
								j = m
							} else {
								k = m;
								j = u.y + u.height / 2
							}
							h.setAttributes({
								x : k,
								y : j
							}, true);
							if (A) {
								h.setAttributes({
									rotate : {
										x : k,
										y : j,
										degrees : 270
									}
								}, true)
							}
						}
						if (e) {
							M.onAnimate(h, {
								to : z
							})
						} else {
							h.setAttributes(Ext.apply(z, {
								hidden : false
							}), true)
						}
					},
					getLabelSize : function(g) {
						var k = this.testerLabel, a = this.label, e = Ext
								.apply({}, a, this.seriesLabelStyle || {}), b = a.orientation === "vertical", j, i, f, d;
						if (!k) {
							k = this.testerLabel = this.chart.surface.add(Ext
									.apply({
										type : "text",
										opacity : 0
									}, e))
						}
						k.setAttributes({
							text : g
						}, true);
						j = k.getBBox();
						i = j.width;
						f = j.height;
						return {
							width : b ? f : i,
							height : b ? i : f
						}
					},
					onAnimate : function(b, a) {
						b.show();
						return this.parent(arguments)
					},
					getItemForPoint : function(a, h) {
						var b = this.items, f = b.length, g, e, d;
						for (d = 0; d < f; d++) {
							e = b[d];
							g = e.sprite.getBBox();
							if (g.x <= a && g.y <= h && (g.x + g.width) >= a
									&& (g.y + g.height) >= h) {
								return e
							}
						}
						return null
					},
					hideAll : function() {
						var a = this.chart.axes;
						if (!isNaN(this._index)) {
							if (!this.__excludes) {
								this.__excludes = []
							}
							this.__excludes[this._index] = true;
							this.drawSeries();
							a.each(function(b) {
								b.drawAxis()
							})
						}
					},
					showAll : function() {
						var a = this.chart.axes;
						if (!isNaN(this._index)) {
							if (!this.__excludes) {
								this.__excludes = []
							}
							this.__excludes[this._index] = false;
							this.drawSeries();
							a.each(function(b) {
								b.drawAxis()
							})
						}
					},
					getLegendColor : function(a) {
						var b = this;
						return b.colorArrayStyle[a % b.colorArrayStyle.length]
					}
				});
Ext.define("Ext.chart.axis.Numeric", {
	extend : "Ext.chart.axis.Axis",
	type : "numeric",
	minimum : NaN,
	maximum : NaN,
	majorUnit : NaN,
	minorUnit : NaN,
	snapToUnits : true,
	alwaysShowZero : true,
	scale : "linear",
	roundMajorUnit : true,
	calculateByLabelSize : true,
	position : "left",
	adjustMaximumByMajorUnit : false,
	adjustMinimumByMajorUnit : false,
	applyData : function() {
		Ext.chart.axis.Numeric.superclass.applyData.call(this);
		return this.calcEnds()
	}
});
Ext.define("Ext.chart.series.Column", {
	extend : "Ext.chart.series.Bar",
	type : "column",
	column : true,
	xpadding : 10,
	ypadding : 0
});
Ext
		.define(
				"Ext.chart.series.Line",
				{
					extend : "Ext.chart.series.Cartesian",
					requires : [ "Ext.chart.axis.Axis", "Ext.chart.Shapes",
							"Ext.draw.Draw", "Ext.fx.Anim" ],
					type : "line",
					selectionTolerance : 20,
					showMarkers : true,
					markerCfg : {},
					style : {},
					dash : "",
					fill : false,
					constructor : function(d) {
						this.parent(arguments);
						var f = this, a = f.chart.surface, g = f.chart.shadow, e, b;
						Ext.apply(f, d, {
							highlightCfg : {
								lineWidth : 3
							},
							shadowAttributes : [ {
								"stroke-width" : 6,
								"stroke-opacity" : 0.05,
								stroke : "rgb(0, 0, 0)",
								translate : {
									x : 1,
									y : 1
								}
							}, {
								"stroke-width" : 4,
								"stroke-opacity" : 0.1,
								stroke : "rgb(0, 0, 0)",
								translate : {
									x : 1,
									y : 1
								}
							}, {
								"stroke-width" : 2,
								"stroke-opacity" : 0.15,
								stroke : "rgb(0, 0, 0)",
								translate : {
									x : 1,
									y : 1
								}
							} ]
						});
						f.group = a.getGroup(f.seriesId);
						if (f.showMarkers) {
							f.markerGroup = a.getGroup(f.seriesId + "-markers")
						}
						if (g) {
							for (e = 0, b = this.shadowAttributes.length; e < b; e++) {
								f.shadowGroups.push(a.getGroup(f.seriesId
										+ "-shadows" + e))
							}
						}
					},
					shrink : function(b, k, l) {
						var h = b.length, j = Math.floor(h / l), g = 1, e = 0, a = 0, f = [ b[0] ], d = [ k[0] ];
						for (; g < h; ++g) {
							e += b[g] || 0;
							a += k[g] || 0;
							if (g % j == 0) {
								f.push(e / j);
								d.push(a / j);
								e = 0;
								a = 0
							}
						}
						return {
							x : f,
							y : d
						}
					},
					drawSeries : function() {
						var u = this, an = u.chart, e = an.substore || an.store, aa = an.surface, P = an.chartBBox, B = {}, A = u.group, U = an.maxGutter[0], T = an.maxGutter[1], q = u.showMarkers, ao = u.markerGroup, l = an.shadow, ag = u.shadowGroups, ai, af = this.shadowAttributes, L, I, S, K, ar = ag.length, aj = [ "M" ], ae = [ "M" ], w, s, h, p, X, W, b, a, k = an.markerIndex, O, t, am, al, N, E, ak, ap, V, J, F, aq, o, Y = [], ac = [], r, ah, ab, D, Z, C, n, H = false, at, v = u.markerStyle, m = u.seriesStyle, d = u.seriesLabelStyle, g = u.colorArrayStyle, z = g
								&& g.length || 0, M = u.seriesIdx, f, ad, au, G, Q;
						f = Ext.apply(v, u.markerCfg);
						au = f.type;
						delete f.type;
						ad = Ext.apply(m, u.style);
						if (!ad["stroke-width"]) {
							ad["stroke-width"] = 0.5
						}
						if (k && ao && ao.getCount()) {
							for (am = 0; am < k; am++) {
								ap = ao.getAt(am);
								ao.remove(ap);
								ao.add(ap);
								V = ao.getAt(ao.getCount() - 2);
								ap.setAttributes({
									x : 0,
									y : 0,
									translate : {
										x : V.attr.translation.x,
										y : V.attr.translation.y
									}
								})
							}
						}
						u.unHighlightItem();
						u.cleanHighlights();
						u.bbox = B = {
							x : P.x + U,
							y : P.y + T,
							width : P.width - (U * 2),
							height : P.height - (T * 2)
						};
						u.clipRect = [ B.x, B.y, B.width, B.height ];
						E = an.axes.get(u.axis);
						if (E) {
							if (E.position == "top" || E.position == "bottom") {
								ab = E.from;
								D = E.to
							} else {
								Z = E.from;
								C = E.to
							}
						} else {
							if (u.xField) {
								ak = new Ext.chart.axis.Axis({
									chart : an,
									fields : [ u.xField ]
								}).calcEnds();
								ab = ak.from;
								D = ak.to
							}
							if (u.yField) {
								ak = new Ext.chart.axis.Axis({
									chart : an,
									fields : [ u.yField ]
								}).calcEnds();
								Z = ak.from;
								C = ak.to
							}
						}
						if (isNaN(ab)) {
							ab = 0;
							r = B.width / (e.getCount() - 1)
						} else {
							r = B.width / (D - ab)
						}
						if (isNaN(Z)) {
							Z = 0;
							ah = B.height / (e.getCount() - 1)
						} else {
							ah = B.height / (C - Z)
						}
						e.each(function(j, av) {
							F = j.get(u.xField);
							aq = j.get(u.yField);
							if (typeof F == "string" || typeof F == "object") {
								F = av
							}
							if (typeof aq == "string") {
								aq = av
							}
							Y.push(F);
							ac.push(aq)
						}, u);
						N = Y.length;
						if (N > B.width || N > B.height) {
							o = u.shrink(Y, ac, Math.min(B.width, B.height));
							Y = o.x;
							ac = o.y
						}
						u.items = [];
						N = Y.length;
						for (am = 0; am < N; am++) {
							F = Y[am];
							aq = ac[am];
							if (aq === false) {
								if (ae.length == 1) {
									ae = []
								}
								H = true;
								continue
							} else {
								X = (B.x + (F - ab) * r).toFixed(2);
								W = ((B.y + B.height) - (aq - Z) * ah)
										.toFixed(2);
								if (H) {
									H = false;
									ae.push("M")
								}
								ae = ae.concat([ X, W ])
							}
							if ((typeof O == "undefined")
									&& (typeof W != "undefined")) {
								O = W
							}
							if (!u.line || an.resizing) {
								aj = aj.concat([ X, B.y + B.height / 2 ])
							}
							if (an.animate && an.resizing && u.line) {
								u.line.setAttributes({
									path : aj
								}, true);
								if (u.fillPath) {
									u.fillPath.setAttributes({
										path : aj,
										opacity : 0.2
									}, true)
								}
								if (u.line.shadows) {
									I = u.line.shadows;
									for (al = 0, ar = I.length; al < ar; al++) {
										S = I[al];
										S.setAttributes({
											path : aj
										}, true)
									}
								}
							}
							if (q) {
								ap = ao.getAt(am);
								if (!ap) {
									ap = Ext.chart.Shapes[au](aa, Ext.apply({
										group : [ A, ao ],
										x : 0,
										y : 0,
										translate : {
											x : b || X,
											y : a || (B.y + B.height / 2)
										},
										value : '"' + F + ", " + aq + '"'
									}, f));
									ap._to = {
										translate : {
											x : X,
											y : W
										}
									}
								} else {
									ap.setAttributes({
										value : '"' + F + ", " + aq + '"',
										x : 0,
										y : 0,
										hidden : false
									}, true);
									ap._to = {
										translate : {
											x : X,
											y : W
										}
									}
								}
							}
							u.items.push({
								series : u,
								value : [ F, aq ],
								point : [ X, W ],
								sprite : ap,
								storeItem : e.getAt(am)
							});
							b = X;
							a = W
						}
						if (u.smooth) {
							ae = Ext.draw.Draw.smooth(ae, 6)
						}
						if (an.markerIndex && u.previousPath) {
							w = u.previousPath;
							w.splice(1, 2)
						} else {
							w = ae
						}
						if (!u.line) {
							u.line = aa.add(Ext.apply({
								type : "path",
								group : A,
								path : aj,
								stroke : ad.stroke || ad.fill
							}, ad || {}));
							u.line.setAttributes({
								fill : "none"
							});
							if (!ad.stroke && z) {
								u.line.setAttributes({
									stroke : g[M % z]
								}, true)
							}
							if (l) {
								I = u.line.shadows = [];
								for (K = 0; K < ar; K++) {
									L = af[K];
									L = Ext.apply({}, L, {
										path : aj
									});
									S = an.surface.add(Ext.apply({}, {
										type : "path",
										group : ag[K]
									}, L));
									I.push(S)
								}
							}
						}
						if (u.fill) {
							h = ae.concat([ [ "L", X, B.y + B.height ],
									[ "L", B.x, B.y + B.height ],
									[ "L", B.x, O ] ]);
							if (!u.fillPath) {
								u.fillPath = aa.add({
									group : A,
									type : "path",
									opacity : ad.opacity || 0.3,
									fill : g[M % z] || ad.fill,
									path : aj
								})
							}
						}
						t = q && ao.getCount();
						if (an.animate) {
							s = u.fill;
							n = u.line;
							p = u.renderer(n, false, {
								path : ae
							}, am, e);
							Ext.apply(p, ad || {}, {
								stroke : ad.stroke || ad.fill
							});
							delete p.fill;
							if (an.markerIndex && u.previousPath) {
								u.animation = at = u.onAnimate(n, {
									to : p,
									from : {
										path : w
									}
								})
							} else {
								u.animation = at = u.onAnimate(n, {
									to : p
								})
							}
							if (l) {
								I = n.shadows;
								for (al = 0; al < ar; al++) {
									if (an.markerIndex && u.previousPath) {
										u.onAnimate(I[al], {
											to : {
												path : ae
											},
											from : {
												path : w
											}
										})
									} else {
										u.onAnimate(I[al], {
											to : {
												path : ae
											}
										})
									}
								}
							}
							if (s) {
								u.onAnimate(u.fillPath, {
									to : Ext.apply({}, {
										path : h,
										fill : g[M % z] || ad.fill
									}, ad || {})
								})
							}
							if (q) {
								for (am = 0; am < N; am++) {
									J = ao.getAt(am);
									if (J) {
										p = u.renderer(J, e.getAt(am), J._to,
												am, e);
										u.onAnimate(J, {
											to : Ext.apply(p, f || {})
										})
									}
								}
								for (; am < t; am++) {
									J = ao.getAt(am);
									J.hide(true)
								}
							}
						} else {
							p = u.renderer(u.line, false, {
								path : ae,
								hidden : false
							}, am, e);
							Ext.apply(p, ad || {}, {
								stroke : ad.stroke || ad.fill
							});
							delete p.fill;
							u.line.setAttributes(p, true);
							if (l) {
								I = u.line.shadows;
								for (al = 0; al < ar; al++) {
									I[al].setAttributes({
										path : ae
									})
								}
							}
							if (u.fill) {
								u.fillPath.setAttributes({
									path : h
								}, true)
							}
							if (q) {
								for (am = 0; am < N; am++) {
									J = ao.getAt(am);
									if (J) {
										p = u.renderer(J, e.getAt(am), J._to,
												am, e);
										J.setAttributes(Ext.apply(f || {}, p
												|| {}), true)
									}
								}
								for (; am < t; am++) {
									J = ao.getAt(am);
									J.hide(true)
								}
								for (am = 0; am < (an.markerIndex || 0); am++) {
									J = ao.getAt(am);
									J.hide(true)
								}
							}
						}
						if (an.markerIndex) {
							ae.splice(1, 0, ae[1], ae[2]);
							u.previousPath = ae
						}
						u.renderLabels();
						u.renderCallouts()
					},
					onCreateLabel : function(e, k, d, f) {
						var g = this, h = g.labelsGroup, a = g.label, j = g.bbox, b = Ext
								.apply(a, g.seriesLabelStyle);
						return g.chart.surface.add(Ext.apply({
							type : "text",
							"text-anchor" : "middle",
							group : h,
							x : k.point[0],
							y : j.y + j.height / 2
						}, b || {}))
					},
					onPlaceLabel : function(g, k, s, p, o, e) {
						var u = this, l = u.chart, r = l.resizing, t = u.label, q = t.renderer, b = t.field, a = u.bbox, j = s.point[0], h = s.point[1], d = s.sprite.attr.radius, f, n, m;
						g.setAttributes({
							text : q(k.get(b)),
							hidden : true
						}, true);
						if (o == "rotate") {
							g.setAttributes({
								"text-anchor" : "start",
								rotation : {
									x : j,
									y : h,
									degrees : -45
								}
							}, true);
							f = g.getBBox();
							n = f.width;
							m = f.height;
							j = j < a.x ? a.x : j;
							j = (j + n > a.x + a.width) ? (j - (j + n - a.x - a.width))
									: j;
							h = (h - m < a.y) ? a.y + m : h
						} else {
							if (o == "under" || o == "over") {
								f = s.sprite.getBBox();
								f.width = f.width || (d * 2);
								f.height = f.height || (d * 2);
								h = h + (o == "over" ? -f.height : f.height);
								f = g.getBBox();
								n = f.width / 2;
								m = f.height / 2;
								j = j - n < a.x ? a.x + n : j;
								j = (j + n > a.x + a.width) ? (j - (j + n - a.x - a.width))
										: j;
								h = h - m < a.y ? a.y + m : h;
								h = (h + m > a.y + a.height) ? (h - (h + m
										- a.y - a.height)) : h
							}
						}
						if (u.chart.animate && !u.chart.resizing) {
							g.show(true);
							u.onAnimate(g, {
								to : {
									x : j,
									y : h
								}
							})
						} else {
							g.setAttributes({
								x : j,
								y : h
							}, true);
							if (r) {
								u.animation.on("afteranimate", function() {
									g.show(true)
								})
							} else {
								g.show(true)
							}
						}
					},
					highlightItem : function() {
						var a = this;
						a.parent(arguments);
						if (this.line && !this.highlighted) {
							this.line.__strokeWidth = this.line.attr["stroke-width"] || 0;
							if (this.line.__anim) {
								this.line.__anim.paused = true
							}
							this.line.__anim = new Ext.fx.Anim(
									{
										target : this.line,
										to : {
											"stroke-width" : this.line.__strokeWidth + 2
										}
									});
							this.highlighted = true
						}
					},
					unHighlightItem : function() {
						var a = this;
						a.parent(arguments);
						if (this.line && this.highlighted) {
							this.line.__anim = new Ext.fx.Anim({
								target : this.line,
								to : {
									"stroke-width" : this.line.__strokeWidth
								}
							});
							this.highlighted = false
						}
					},
					onPlaceCallout : function(m, r, J, G, F, e, k) {
						var M = this, s = M.chart, D = s.surface, H = s.resizing, L = M.callouts, t = M.items, v = G == 0 ? false
								: t[G - 1].point, z = (G == t.length - 1) ? false
								: t[G + 1].point, d = J.point, A, g, N, K, o, q, b = m.label
								.getBBox(), I = 30, C = 10, B = 3, h, f, j, w, u, E = M.clipRect, n, l;
						if (!v) {
							v = d
						}
						if (!z) {
							z = d
						}
						K = (z[1] - v[1]) / (z[0] - v[0]);
						o = (d[1] - v[1]) / (d[0] - v[0]);
						q = (z[1] - d[1]) / (z[0] - d[0]);
						g = Math.sqrt(1 + K * K);
						A = [ 1 / g, K / g ];
						N = [ -A[1], A[0] ];
						if (o > 0 && q < 0 && N[1] < 0 || o < 0 && q > 0
								&& N[1] > 0) {
							N[0] *= -1;
							N[1] *= -1
						} else {
							if (Math.abs(o) < Math.abs(q) && N[0] < 0
									|| Math.abs(o) > Math.abs(q) && N[0] > 0) {
								N[0] *= -1;
								N[1] *= -1
							}
						}
						n = d[0] + N[0] * I;
						l = d[1] + N[1] * I;
						h = n + (N[0] > 0 ? 0 : -(b.width + 2 * B));
						f = l - b.height / 2 - B;
						j = b.width + 2 * B;
						w = b.height + 2 * B;
						if (h < E[0] || (h + j) > (E[0] + E[2])) {
							N[0] *= -1
						}
						if (f < E[1] || (f + w) > (E[1] + E[3])) {
							N[1] *= -1
						}
						n = d[0] + N[0] * I;
						l = d[1] + N[1] * I;
						h = n + (N[0] > 0 ? 0 : -(b.width + 2 * B));
						f = l - b.height / 2 - B;
						j = b.width + 2 * B;
						w = b.height + 2 * B;
						if (s.animate) {
							M.onAnimate(m.lines, {
								to : {
									path : [ "M", d[0], d[1], "L", n, l, "Z" ]
								}
							});
							M.onAnimate(m.box, {
								to : {
									x : h,
									y : f,
									width : j,
									height : w
								}
							});
							M.onAnimate(m.label, {
								to : {
									x : n + (N[0] > 0 ? B : -(b.width + B)),
									y : l
								}
							})
						} else {
							m.lines.setAttributes({
								path : [ "M", d[0], d[1], "L", n, l, "Z" ]
							}, true);
							m.box.setAttributes({
								x : h,
								y : f,
								width : j,
								height : w
							}, true);
							m.label.setAttributes({
								x : n + (N[0] > 0 ? B : -(b.width + B)),
								y : l
							}, true)
						}
						for (u in m) {
							m[u].show(true)
						}
					},
					getItemForPoint : function(r, o) {
						var k = this, j = k.items, l = k.selectionTolerance, s = null, q, a, g, n, f, h, e, p, b, m, d;
						if (j && j.length) {
							for (f = 0, h = j.length; f < h; f++) {
								if (j[f].point[0] >= r) {
									a = j[f];
									q = f && j[f - 1];
									break
								}
							}
							if (f >= h) {
								q = j[h - 1]
							}
							g = q && q.point;
							n = a && a.point;
							e = q ? g[0] : n[0] - l;
							p = q ? g[1] : n[1];
							b = a ? n[0] : g[0] + l;
							m = a ? n[1] : g[1];
							if (r >= e && r <= b) {
								d = (m - p) / (b - e) * (r - e) + p;
								if (Math.abs(d - o) <= l) {
									s = (b - r < r - e) ? a : q
								}
							}
						}
						return s
					},
					toggleAll : function(a) {
						var f = this, b, e, g, d;
						if (!a) {
							Ext.chart.series.Line.superclass.hideAll.call(f)
						} else {
							Ext.chart.series.Line.superclass.showAll.call(f)
						}
						if (f.line) {
							f.line.setAttributes({
								hidden : !a
							}, true);
							if (f.line.shadows) {
								for (b = 0, d = f.line.shadows, e = d.length; b < e; b++) {
									g = d[b];
									g.setAttributes({
										hidden : !a
									}, true)
								}
							}
						}
						if (f.fillPath) {
							f.fillPath.setAttributes({
								hidden : !a
							}, true)
						}
					},
					hideAll : function() {
						this.toggleAll(false)
					},
					showAll : function() {
						this.toggleAll(true)
					}
				});
Ext.define("Ext.chart.axis.Category", {
	extend : "Ext.chart.axis.Axis",
	categoryNames : null,
	calculateCategoryCount : false,
	setLabels : function() {
		var b = this.chart.store, a = this.fields, e = a.length, d;
		this.labels = [];
		b.each(function(f) {
			for (d = 0; d < e; d++) {
				this.labels.push(f.get(a[d]))
			}
		}, this)
	},
	applyData : function() {
		Ext.chart.axis.Category.superclass.applyData.call(this);
		this.setLabels();
		var a = this.chart.store.getCount();
		return {
			from : 0,
			to : a,
			power : 1,
			step : 1,
			steps : a - 1
		}
	}
});
Ext
		.define(
				"Ext.chart.axis.Time",
				{
					extend : "Ext.chart.axis.Category",
					requires : [ "Ext.data.JsonStore" ],
					calculateByLabelSize : true,
					dateFormat : false,
					groupBy : "year,month,day",
					aggregateOp : "sum",
					fromDate : false,
					toDate : false,
					step : [ Ext.Date.DAY, 1 ],
					constrain : false,
					dateMethods : {
						year : function(a) {
							return a.getFullYear()
						},
						day : function(a) {
							return a.getDate()
						},
						month : function(a) {
							return a.getMonth() + 1
						}
					},
					aggregateFn : {
						sum : function(d) {
							var b = 0, a = d.length, e = 0;
							if (!d.length || isNaN(d[0])) {
								return d[0]
							}
							for (; b < a; b++) {
								e += d[b]
							}
							return e
						},
						max : function(a) {
							if (!a.length || isNaN(a[0])) {
								return a[0]
							}
							return Math.max.apply(Math, a)
						},
						min : function(a) {
							if (!a.length || isNaN(a[0])) {
								return a[0]
							}
							return Math.min.apply(Math, a)
						},
						avg : function(d) {
							var b = 0, a = d.length, e = 0;
							if (!d.length || isNaN(d[0])) {
								return d[0]
							}
							for (; b < a; b++) {
								e += d[b]
							}
							return e / a
						}
					},
					constrainDates : function() {
						var f = new Date(this.fromDate), e = new Date(
								this.toDate), b = this.step, g = this.fields, i = this.chart.store, d, h, k = [], a = new Ext.data.Store(
								{
									model : i.model
								});
						var j = (function() {
							var n = 0, m = i.getCount();
							return function(o) {
								var p, l;
								for (; n < m; n++) {
									p = i.getAt(n);
									l = new Date(p.get(g));
									if (+l > +o) {
										return false
									} else {
										if (+l == +o) {
											return p
										}
									}
								}
								return false
							}
						})();
						if (!this.constrain) {
							this.chart.filteredStore = this.chart.store;
							return
						}
						while (+f <= +e) {
							d = j(f);
							h = {};
							if (d) {
								a.add(d.data)
							} else {
								a.model.prototype.fields.each(function(l) {
									h[l.name] = false
								});
								h.date = f;
								a.add(h)
							}
							f = Ext.Date.add(f, b[0], b[1])
						}
						this.chart.filteredStore = a
					},
					aggregate : function() {
						var s = {}, o = [], u, n, j = this.aggregateOp, a = this.fields, q, m = this.groupBy
								.split(","), d, t = [], e = 0, k, f = [], r = [], p = m.length, b = this.dateMethods, h = this.aggregateFn, g = this.chart.filteredStore
								|| this.chart.store;
						g.each(function(i) {
							if (!t.length) {
								i.fields.each(function(l) {
									t.push(l.name)
								});
								e = t.length
							}
							n = new Date(i.get(a));
							for (q = 0; q < p; q++) {
								if (q == 0) {
									u = String(b[m[q]](n))
								} else {
									u += "||" + b[m[q]](n)
								}
							}
							if (u in s) {
								k = s[u]
							} else {
								k = s[u] = {};
								o.push(u);
								f.push(n)
							}
							for (q = 0; q < e; q++) {
								d = t[q];
								if (!k[d]) {
									k[d] = []
								}
								if (i.get(d) !== undefined) {
									k[d].push(i.get(d))
								}
							}
						});
						for (u in s) {
							k = s[u];
							for (q = 0; q < e; q++) {
								d = t[q];
								k[d] = h[j](k[d])
							}
							r.push(k)
						}
						this.chart.substore = new Ext.data.JsonStore({
							fields : t,
							data : r
						});
						this.dates = f
					},
					setLabels : function() {
						var b = this.chart.substore, a = this.fields, f = this.dateFormat, g, d, e = this.dates;
						formatFn = Ext.Date.format;
						this.labels = g = [];
						b.each(function(h, j) {
							if (!f) {
								g.push(h.get(a))
							} else {
								g.push(formatFn(e[j], f))
							}
						}, this)
					},
					applyData : function() {
						if (this.constrain) {
							this.constrainDates();
							this.aggregate();
							this.chart.substore = this.chart.filteredStore
						} else {
							this.aggregate()
						}
						this.setLabels();
						var a = this.chart.substore.getCount();
						return {
							from : 0,
							to : a,
							steps : a - 1
						}
					}
				});
Ext
		.define(
				"Ext.chart.series.Scatter",
				{
					extend : "Ext.chart.series.Cartesian",
					requires : [ "Ext.chart.axis.Axis", "Ext.chart.Shapes",
							"Ext.fx.Anim" ],
					type : "scatter",
					constructor : function(d) {
						this.parent(arguments);
						var f = this, g = f.chart.shadow, a = f.chart.surface, e, b;
						Ext.apply(f, d, {
							style : {},
							markerCfg : {},
							shadowAttributes : [ {
								"stroke-width" : 6,
								"stroke-opacity" : 0.05,
								stroke : "rgb(0, 0, 0)"
							}, {
								"stroke-width" : 4,
								"stroke-opacity" : 0.1,
								stroke : "rgb(0, 0, 0)"
							}, {
								"stroke-width" : 2,
								"stroke-opacity" : 0.15,
								stroke : "rgb(0, 0, 0)"
							} ]
						});
						f.group = a.getGroup(f.seriesId);
						if (g) {
							for (e = 0, b = f.shadowAttributes.length; e < b; e++) {
								f.shadowGroups.push(a.getGroup(f.seriesId
										+ "-shadows" + e))
							}
						}
					},
					drawSeries : function() {
						var n = this, S = n.chart, b = S.substore || S.store, I = S.surface, C = S.chartBBox, q = n.group, v = null, F = S.maxGutter[0], E = S.maxGutter[1], f = S.shadow, L = n.shadowGroups, K = n.shadowAttributes, U = L.length, o = n.markerStyle, h = n.seriesStyle, a = n.seriesLabelStyle, e = n.colorArrayStyle, p = e
								&& e.length || 0, A = n.seriesIdx, J = 0, H = 0, N, g, w, D, G, z, k, j = [], m, s, B, Q, u, P, T, l, M, t, r, d, O, V;
						d = Ext.apply(o, n.markerCfg);
						O = Ext.apply(h, n.style);
						V = d.type;
						delete d.type;
						n.unHighlightItem();
						n.cleanHighlights();
						n.bbox = bbox = {
							x : C.x + F,
							y : C.y + E,
							width : C.width - (F * 2),
							height : C.height - (E * 2)
						};
						n.clipRect = [ bbox.x, bbox.y, bbox.width, bbox.height ];
						u = S.axes.get(n.axis);
						if (u) {
							if (u.position == "top" || u.position == "bottom") {
								J = u.from;
								t = u.to
							} else {
								H = u.from;
								r = u.to
							}
						} else {
							if (n.xField) {
								P = new Ext.chart.axis.Axis({
									chart : S,
									fields : [ n.xField ]
								}).calcEnds();
								J = P.from;
								t = P.to
							}
							if (n.yField) {
								P = new Ext.chart.axis.Axis({
									chart : S,
									fields : [ n.yField ]
								}).calcEnds();
								H = P.from;
								r = P.to
							}
						}
						l = bbox.width / (t - J);
						M = bbox.height / (r - H);
						n.items = [];
						b
								.each(
										function(X, Z) {
											var aa = X.get(n.xField), Y = X
													.get(n.yField), W, ab;
											if (typeof aa == "string") {
												aa = Z;
												J = 0;
												l = bbox.width
														/ (b.getCount() - 1)
											}
											if (typeof Y == "string") {
												Y = Z;
												H = 0;
												M = bbox.height
														/ (b.getCount() - 1)
											}
											W = bbox.x + (aa - J) * l;
											ab = bbox.y + bbox.height - (Y - H)
													* M;
											j.push({
												x : W,
												y : ab
											});
											n.items.push({
												series : n,
												value : [ aa, Y ],
												point : [ W, ab ],
												storeItem : X
											});
											if (S.animate && S.resizing) {
												s = q.getAt(Z);
												if (s) {
													s
															.setAttributes(
																	{
																		translate : {
																			x : (bbox.x + bbox.width) / 2,
																			y : (bbox.y + bbox.height) / 2
																		}
																	}, true);
													if (f) {
														w = s.shadows;
														for (z = 0; z < U; z++) {
															g = Ext.apply({},
																	K[z]);
															if (g.translate) {
																g.translate = Ext
																		.apply(
																				{},
																				g.translate
																						|| {});
																g.translate.x += (bbox.x + bbox.width) / 2;
																g.translate.y += (bbox.y + bbox.height) / 2
															} else {
																Ext
																		.apply(
																				g,
																				{
																					translate : {
																						x : (bbox.x + bbox.width) / 2,
																						y : (bbox.y + bbox.height) / 2
																					}
																				})
															}
															w[z].setAttributes(
																	g, true)
														}
													}
												}
											}
										}, n);
						B = j.length;
						for (Q = 0; Q < B; Q++) {
							m = j[Q];
							s = q.getAt(Q);
							Ext.apply(m, d);
							if (!s) {
								s = Ext.chart.Shapes[V](S.surface, Ext.apply(
										{}, {
											x : 0,
											y : 0,
											group : q,
											translate : {
												x : (bbox.x + bbox.width) / 2,
												y : (bbox.y + bbox.height) / 2
											}
										}, m));
								if (f) {
									s.shadows = w = [];
									for (z = 0; z < U; z++) {
										g = Ext.apply({}, K[z]);
										if (g.translate) {
											g.translate = Ext.apply({},
													g.translate);
											g.translate.x += (bbox.x + bbox.width) / 2;
											g.translate.y += (bbox.y + bbox.height) / 2
										} else {
											Ext
													.apply(
															g,
															{
																translate : {
																	x : (bbox.x + bbox.width) / 2,
																	y : (bbox.y + bbox.height) / 2
																}
															})
										}
										Ext.apply(g, d);
										D = Ext.chart.Shapes[V](S.surface, Ext
												.apply({}, {
													x : 0,
													y : 0,
													group : L[z]
												}, g));
										w.push(D)
									}
								}
							}
							w = s.shadows;
							if (S.animate) {
								k = n.renderer(s, b.getAt(Q), {
									translate : m
								}, Q, b);
								s._to = k;
								n.animation = n.onAnimate(s, {
									to : k
								});
								for (z = 0; z < U; z++) {
									g = Ext.apply({}, K[z]);
									k = n
											.renderer(
													w[z],
													b.getAt(Q),
													Ext
															.apply(
																	{},
																	{
																		translate : {
																			x : m.x
																					+ (g.translate ? g.translate.x
																							: 0),
																			y : m.y
																					+ (g.translate ? g.translate.y
																							: 0)
																		}
																	}, g), Q, b);
									this.onAnimate(w[z], {
										to : k
									})
								}
							} else {
								k = n.renderer(s, b.getAt(Q), Ext.apply({
									translate : m
								}, {
									hidden : false
								}), Q, b);
								s.setAttributes(k, true);
								for (z = 0; z < U; z++) {
									g = K[z];
									k = n.renderer(w[z], b.getAt(Q), Ext.apply(
											{
												x : m.x,
												y : m.y
											}, g), Q, b);
									w[z].setAttributes(k, true)
								}
							}
							n.items[Q].sprite = s
						}
						B = q.getCount();
						for (Q = j.length; Q < B; Q++) {
							q.getAt(Q).hide(true)
						}
						n.renderLabels();
						n.renderCallouts()
					},
					onCreateLabel : function(e, k, d, f) {
						var g = this, h = g.labelsGroup, a = g.label, b = Ext
								.apply({}, a, g.seriesLabelStyle), j = g.bbox;
						return g.chart.surface.add(Ext.apply({
							type : "text",
							group : h,
							x : k.point[0],
							y : j.y + j.height / 2
						}, b))
					},
					onPlaceLabel : function(g, k, s, p, o, e) {
						var u = this, l = u.chart, r = l.resizing, t = u.label, q = t.renderer, b = t.field, a = u.bbox, j = s.point[0], h = s.point[1], d = s.sprite.attr.radius, f, n, m;
						g.setAttributes({
							text : q(k.get(b)),
							hidden : true
						}, true);
						if (o == "rotate") {
							g.setAttributes({
								"text-anchor" : "start",
								rotation : {
									x : j,
									y : h,
									degrees : -45
								}
							}, true);
							f = g.getBBox();
							n = f.width;
							m = f.height;
							j = j < a.x ? a.x : j;
							j = (j + n > a.x + a.width) ? (j - (j + n - a.x - a.width))
									: j;
							h = (h - m < a.y) ? a.y + m : h
						} else {
							if (o == "under" || o == "over") {
								f = s.sprite.getBBox();
								f.width = f.width || (d * 2);
								f.height = f.height || (d * 2);
								h = h + (o == "over" ? -f.height : f.height);
								f = g.getBBox();
								n = f.width / 2;
								m = f.height / 2;
								j = j - n < a.x ? a.x + n : j;
								j = (j + n > a.x + a.width) ? (j - (j + n - a.x - a.width))
										: j;
								h = h - m < a.y ? a.y + m : h;
								h = (h + m > a.y + a.height) ? (h - (h + m
										- a.y - a.height)) : h
							}
						}
						if (u.chart.animate && !u.chart.resizing) {
							g.show(true);
							u.onAnimate(g, {
								to : {
									x : j,
									y : h
								}
							})
						} else {
							g.setAttributes({
								x : j,
								y : h
							}, true);
							if (r) {
								if (u.animation) {
									u.animation.on("afteranimate", function() {
										g.show(true)
									})
								} else {
									g.show(true)
								}
							} else {
								g.show(true)
							}
						}
					},
					onPlaceCallout : function(k, m, B, z, w, d, h) {
						var E = this, n = E.chart, u = n.surface, A = n.resizing, D = E.callouts, o = E.items, b = B.point, F, a = k.label
								.getBBox(), C = 30, t = 10, s = 3, f, e, g, r, q, v = E.clipRect, l, j;
						F = [ Math.cos(Math.PI / 4), -Math.sin(Math.PI / 4) ];
						l = b[0] + F[0] * C;
						j = b[1] + F[1] * C;
						f = l + (F[0] > 0 ? 0 : -(a.width + 2 * s));
						e = j - a.height / 2 - s;
						g = a.width + 2 * s;
						r = a.height + 2 * s;
						if (f < v[0] || (f + g) > (v[0] + v[2])) {
							F[0] *= -1
						}
						if (e < v[1] || (e + r) > (v[1] + v[3])) {
							F[1] *= -1
						}
						l = b[0] + F[0] * C;
						j = b[1] + F[1] * C;
						f = l + (F[0] > 0 ? 0 : -(a.width + 2 * s));
						e = j - a.height / 2 - s;
						g = a.width + 2 * s;
						r = a.height + 2 * s;
						if (n.animate) {
							E.onAnimate(k.lines, {
								to : {
									path : [ "M", b[0], b[1], "L", l, j, "Z" ]
								}
							}, true);
							E.onAnimate(k.box, {
								to : {
									x : f,
									y : e,
									width : g,
									height : r
								}
							}, true);
							E.onAnimate(k.label, {
								to : {
									x : l + (F[0] > 0 ? s : -(a.width + s)),
									y : j
								}
							}, true)
						} else {
							k.lines.setAttributes({
								path : [ "M", b[0], b[1], "L", l, j, "Z" ]
							}, true);
							k.box.setAttributes({
								x : f,
								y : e,
								width : g,
								height : r
							}, true);
							k.label.setAttributes({
								x : l + (F[0] > 0 ? s : -(a.width + s)),
								y : j
							}, true)
						}
						for (q in k) {
							k[q].show(true)
						}
					},
					onAnimate : function(b, a) {
						b.show();
						return this.parent(arguments)
					},
					getItemForPoint : function(b, j) {
						var e = this.items, a, g = null, d = 10, f = e
								&& e.length;
						function h(k) {
							var i = Math.abs, m = i(k[0] - b), l = i(k[1] - j);
							return Math.sqrt(m * m + l * l)
						}
						while (f--) {
							a = e[f].point;
							if (a[0] - d <= b && a[0] + d >= b && a[1] - d <= j
									&& a[1] + d >= j) {
								if (!g || (h(a) < h(g.point))) {
									g = e[f]
								}
							} else {
								if (g) {
									break
								}
							}
						}
						return g
					}
				});
Ext
		.define(
				"Ext.chart.series.Pie",
				{
					extend : "Ext.chart.series.Series",
					requires : [ "Ext.fx.Anim" ],
					type : "pie",
					rad : Math.PI / 180,
					highlightDuration : 150,
					angleField : false,
					lengthField : false,
					donut : false,
					showInLegend : false,
					style : {},
					constructor : function(b) {
						this.parent(arguments);
						var h = this, g = h.chart, a = g.surface, j = g.store, k = g.shadow, e, d, f;
						Ext.applyIf(h, {
							highlightCfg : {
								segment : {
									margin : 20
								}
							}
						});
						Ext.apply(h, b, {
							shadowAttributes : [ {
								"stroke-width" : 6,
								"stroke-opacity" : 1,
								stroke : "rgb(200, 200, 200)",
								translate : {
									x : 1.2,
									y : 2
								}
							}, {
								"stroke-width" : 4,
								"stroke-opacity" : 1,
								stroke : "rgb(150, 150, 150)",
								translate : {
									x : 0.9,
									y : 1.5
								}
							}, {
								"stroke-width" : 2,
								"stroke-opacity" : 1,
								stroke : "rgb(100, 100, 100)",
								translate : {
									x : 0.6,
									y : 1
								}
							} ]
						});
						h.group = a.getGroup(h.seriesId);
						if (k) {
							for (e = 0, d = h.shadowAttributes.length; e < d; e++) {
								h.shadowGroups.push(a.getGroup(h.seriesId
										+ "-shadows" + e))
							}
						}
						a.customAttributes.segment = function(i) {
							return h.getSegment(i)
						};
						if (h.label.field && !h.yField) {
							h.yField = [];
							j.each(function(i) {
								h.yField.push(i.get(h.label.field))
							})
						}
					},
					getSegment : function(b) {
						var u = this, t = u.rad, d = Math.cos, a = Math.sin, i = Math.abs, g = u.centerX, f = u.centerY, p = x2 = x3 = x4 = 0, e = y2 = y3 = y4 = 0, q = 0.01, k = b.endRho
								- b.startRho, n = b.startAngle, m = b.endAngle, h = (n + m)
								/ 2 * t, j = b.margin || 0, o = i(m - n) > 180, v = Math
								.min(n, m)
								* t, s = Math.max(n, m) * t, l = false;
						g += j * d(h);
						f += j * a(h);
						p = g + b.startRho * d(v);
						e = f + b.startRho * a(v);
						x2 = g + b.endRho * d(v);
						y2 = f + b.endRho * a(v);
						x3 = g + b.startRho * d(s);
						y3 = f + b.startRho * a(s);
						x4 = g + b.endRho * d(s);
						y4 = f + b.endRho * a(s);
						if (i(p - x3) <= q && i(e - y3) <= q) {
							l = true
						}
						if (l) {
							return {
								path : [
										[ "M", p, e ],
										[ "L", x2, y2 ],
										[ "A", b.endRho, b.endRho, 0, +o, 1,
												x4, y4 ], [ "Z" ] ]
							}
						} else {
							return {
								path : [
										[ "M", p, e ],
										[ "L", x2, y2 ],
										[ "A", b.endRho, b.endRho, 0, +o, 1,
												x4, y4 ],
										[ "L", x3, y3 ],
										[ "A", b.startRho, b.startRho, 0, +o,
												0, p, e ], [ "Z" ] ]
							}
						}
					},
					calcMiddle : function(p) {
						var k = this, l = k.rad, o = p.slice, n = k.centerX, m = k.centerY, j = o.startAngle, f = o.endAngle, i = Math
								.max(("rho" in o) ? o.rho : k.radius,
										k.label.minMargin), h = +k.donut, b = Math
								.min(j, f)
								* l, a = Math.max(j, f) * l, e = -(b + (a - b) / 2), g = n
								+ (p.endRho + p.startRho) / 2 * Math.cos(e), d = m
								- (p.endRho + p.startRho) / 2 * Math.sin(e);
						p.middle = {
							x : g,
							y : d
						}
					},
					drawSeries : function() {
						var A = this, b = A.chart.substore || A.chart.store, F = A.group, ad = A.chart.animate, q = A.angleField
								|| A.field || A.xField, I = []
								.concat(A.lengthField), ac = 0, V = A.colorSet, ai = A.chart, S = ai.surface, O = ai.chartBBox, m = ai.shadow, aa = A.shadowGroups, Z = A.shadowAttributes, am = aa.length, h = A.rad, T = I.length, J = 0, e = +A.donut, ak = [], al = {}, aj, G = [], k = false, D = 0, W = 0, l = 9, an = true, C = 0, o = A.seriesStyle, a = A.seriesLabelStyle, g = A.colorArrayStyle, E = g
								&& g.length || 0, v, ab, ah, K, P, M, f, d, w, s = 0, z, u, H, U, L, ao, N, Q, af, ae, n, ag, B, r, X, Y, t;
						Ext.apply(o, A.style || {});
						if (A.colorSet) {
							g = A.colorSet;
							E = g.length
						}
						A.unHighlightItem();
						A.cleanHighlights();
						f = A.centerX = O.x + (O.width / 2);
						d = A.centerY = O.y + (O.height / 2);
						A.radius = Math.min(f - O.x, d - O.y);
						A.slices = u = [];
						A.items = G = [];
						b.each(function(j, p) {
							if (this.__excludes && this.__excludes[p]) {
								return
							}
							D += +j.get(q);
							if (I[0]) {
								for (ae = 0, ac = 0; ae < T; ae++) {
									ac += +j.get(I[ae])
								}
								ak[p] = ac;
								W = Math.max(W, ac)
							}
						}, this);
						b.each(function(j, p) {
							if (this.__excludes && this.__excludes[p]) {
								return
							}
							U = j.get(q);
							B = C - 360 * U / D / 2;
							if (!p || s == 0) {
								C = 360 - B;
								A.firstAngle = C;
								B = C - 360 * U / D / 2
							}
							ag = C - 360 * U / D;
							z = {
								series : A,
								value : U,
								startAngle : C,
								endAngle : ag,
								storeItem : j
							};
							if (I[0]) {
								ao = ak[p];
								z.rho = A.radius * (ao / W)
							} else {
								z.rho = A.radius
							}
							u[p] = z;
							if ((z.startAngle % 360) == (z.endAngle % 360)) {
								z.startAngle -= 0.0001
							}
							C = ag;
							s++
						}, A);
						if (m) {
							for (af = 0, N = u.length; af < N; af++) {
								if (this.__excludes && this.__excludes[af]) {
									continue
								}
								z = u[af];
								z.shadowAttrs = [];
								for (ae = 0, J = 0, K = []; ae < T; ae++) {
									H = F.getAt(af * T + ae);
									w = I[ae] ? b.getAt(af).get(I[ae]) / ak[af]
											* z.rho : z.rho;
									v = {
										segment : {
											startAngle : z.startAngle,
											endAngle : z.endAngle,
											margin : 0,
											rho : z.rho,
											startRho : J + (w * e / 100),
											endRho : J + w
										}
									};
									for (M = 0, K = []; M < am; M++) {
										ah = Z[M];
										P = aa[M].getAt(af);
										if (!P) {
											P = ai.surface.add(Ext.apply({}, {
												type : "path",
												group : aa[M],
												strokeLinejoin : "round"
											}, v, ah))
										}
										if (ad) {
											v = A.renderer(P, b.getAt(af), Ext
													.apply({}, v, ah), af, b);
											A.onAnimate(P, {
												to : v
											})
										} else {
											v = A.renderer(P, b.getAt(af), Ext
													.apply(ah, {
														hidden : false
													}), af, b);
											P.setAttributes(v, true)
										}
										K.push(P)
									}
									z.shadowAttrs[ae] = K
								}
							}
						}
						for (af = 0, N = u.length; af < N; af++) {
							if (this.__excludes && this.__excludes[af]) {
								continue
							}
							z = u[af];
							for (ae = 0, J = 0; ae < T; ae++) {
								H = F.getAt(af * T + ae);
								w = I[ae] ? b.getAt(af).get(I[ae]) / ak[af]
										* z.rho : z.rho;
								v = Ext.apply({
									segment : {
										startAngle : z.startAngle,
										endAngle : z.endAngle,
										margin : 0,
										rho : z.rho,
										startRho : J + (w * e / 100),
										endRho : J + w
									}
								}, Ext.apply(o, g && {
									fill : g[(T > 1 ? ae : af) % E]
								} || {}));
								L = Ext.apply({}, v.segment, {
									slice : z,
									series : A,
									storeItem : z.storeItem,
									index : af
								});
								A.calcMiddle(L);
								if (m) {
									L.shadows = z.shadowAttrs[ae]
								}
								G[af] = L;
								if (!H) {
									t = Ext.apply({
										type : "path",
										group : F,
										middle : L.middle
									}, Ext.apply(o, g && {
										fill : g[(T > 1 ? ae : af) % E]
									} || {}));
									H = S.add(Ext.apply(t, v))
								}
								z.sprite = z.sprite || [];
								L.sprite = H;
								z.sprite.push(H);
								z.point = [ L.middle.x, L.middle.y ];
								if (ad) {
									v = A.renderer(H, b.getAt(af), v, af, b);
									H._to = v;
									H._animating = true;
									A.animation = A.onAnimate(H, {
										to : v
									});
									A.animation.on("afteranimate",
											(function(i) {
												return function() {
													i._animating = false
												}
											})(H))
								} else {
									v = A.renderer(H, b.getAt(af), Ext.apply(v,
											{
												hidden : false
											}), af, b);
									H.setAttributes(v, true)
								}
								J += w
							}
						}
						N = F.getCount();
						for (af = 0; af < N; af++) {
							if (!u[(af / T) >> 0] && F.getAt(af)) {
								F.getAt(af).hide(true)
							}
						}
						if (m) {
							for (M = 0; M < am; M++) {
								ab = aa[M];
								N = ab.getCount();
								for (ae = af; ae < N; ae++) {
									ab.getAt(ae).hide(true)
								}
							}
						}
						A.renderLabels();
						A.renderCallouts()
					},
					onCreateLabel : function(g, l, f, h) {
						var j = this, k = j.labelsGroup, a = j.label, e = j.centerX, d = j.centerY, m = l.middle, b = Ext
								.apply(j.seriesLabelStyle || {}, a || {});
						return j.chart.surface.add(Ext.apply({
							type : "text",
							"text-anchor" : "middle",
							group : k,
							x : m.x,
							y : m.y
						}, b))
					},
					onPlaceLabel : function(k, p, w, s, r, f, g) {
						var A = this, q = A.chart, v = q.resizing, z = A.label, t = z.renderer, d = []
								.concat(z.field), m = A.centerX, l = A.centerY, B = w.middle, b = {
							x : B.x,
							y : B.y
						}, o = B.x - m, n = B.y - l, e = 1, j = Math.atan2(n,
								o || 1), u = j * 180 / Math.PI, h;
						function a(i) {
							if (i < 0) {
								i += 360
							}
							return i % 360
						}
						k.setAttributes({
							text : t(p.get(d[g])),
							hidden : true
						}, true);
						switch (r) {
						case "outside":
							e = Math.sqrt(o * o + n * n) * 2;
							b.x = e * Math.cos(j) + m;
							b.y = e * Math.sin(j) + l;
							break;
						case "rotate":
							u = a(u);
							u = (u > 90 && u < 270) ? u + 180 : u;
							h = k.attr.rotation.degrees;
							if (h != null && Math.abs(h - u) > 180) {
								if (u > h) {
									u -= 360
								} else {
									u += 360
								}
								u = u % 360
							} else {
								u = a(u)
							}
							b.rotate = {
								degrees : u,
								x : b.x,
								y : b.y
							};
							break;
						default:
							break
						}
						if (f && !v && (r != "rotate" || h != null)) {
							k.show(true);
							A.onAnimate(k, {
								to : b
							})
						} else {
							k.setAttributes(b, true);
							if (v && A.animation) {
								A.animation.on("afteranimate", function() {
									k.show(true)
								})
							} else {
								k.show(true)
							}
						}
					},
					onPlaceCallout : function(l, o, A, v, u, e, f) {
						var C = this, q = C.chart, w = q.resizing, B = C.callouts, j = C.centerX, h = C.centerY, D = A.middle, b = {
							x : D.x,
							y : D.y
						}, n = D.x - j, k = D.y - h, d = 1, m, g = Math.atan2(
								k, n || 1), a = l.label.getBBox(), z = 20, t = 10, s = 10, r;
						d = A.endRho + z;
						m = (A.endRho + A.startRho) / 2
								+ (A.endRho - A.startRho) / 3;
						b.x = d * Math.cos(g) + j;
						b.y = d * Math.sin(g) + h;
						n = m * Math.cos(g);
						k = m * Math.sin(g);
						if (q.animate) {
							C.onAnimate(l.lines, {
								to : {
									path : [ "M", n + j, k + h, "L", b.x, b.y,
											"Z", "M", b.x, b.y, "l",
											n > 0 ? t : -t, 0, "z" ]
								}
							});
							C.onAnimate(l.box, {
								to : {
									x : b.x
											+ (n > 0 ? t
													: -(t + a.width + 2 * s)),
									y : b.y
											+ (k > 0 ? (-a.height - s / 2)
													: (-a.height - s / 2)),
									width : a.width + 2 * s,
									height : a.height + 2 * s
								}
							});
							C.onAnimate(l.label, {
								to : {
									x : b.x
											+ (n > 0 ? (t + s)
													: -(t + a.width + s)),
									y : b.y
											+ (k > 0 ? -a.height / 4
													: -a.height / 4)
								}
							})
						} else {
							l.lines.setAttributes({
								path : [ "M", n + j, k + h, "L", b.x, b.y, "Z",
										"M", b.x, b.y, "l", n > 0 ? t : -t, 0,
										"z" ]
							}, true);
							l.box.setAttributes({
								x : b.x + (n > 0 ? t : -(t + a.width + 2 * s)),
								y : b.y
										+ (k > 0 ? (-a.height - s / 2)
												: (-a.height - s / 2)),
								width : a.width + 2 * s,
								height : a.height + 2 * s
							}, true);
							l.label.setAttributes(
									{
										x : b.x
												+ (n > 0 ? (t + s) : -(t
														+ a.width + s)),
										y : b.y
												+ (k > 0 ? -a.height / 4
														: -a.height / 4)
									}, true)
						}
						for (r in l) {
							l[r].show(true)
						}
					},
					onAnimate : function(b, a) {
						b.show();
						return this.parent(arguments)
					},
					getItemForPoint : function(m, k) {
						var j = this, e = j.centerX, d = j.centerY, q = Math.abs, p = q(m
								- e), o = q(k - d), h = j.items, n, f = h
								&& h.length, b, g, a, l = Math.sqrt(p * p + o
								* o);
						if (f && l <= j.radius) {
							b = Math.atan2(k - d, m - e) / j.rad + 360;
							if (b > j.firstAngle) {
								b -= 360
							}
							while (f--) {
								n = h[f];
								if (n) {
									g = n.startAngle;
									a = n.endAngle;
									if (b <= g && b > a && l >= n.startRho
											&& l <= n.endRho) {
										return n
									}
								}
							}
						}
						return null
					},
					hideAll : function() {
						var f, b, h, g, e, a, d;
						if (!isNaN(this._index)) {
							this.__excludes = this.__excludes || [];
							this.__excludes[this._index] = true;
							d = this.slices[this._index].sprite;
							for (e = 0, a = d.length; e < a; e++) {
								d[e].setAttributes({
									hidden : true
								}, true)
							}
							if (this.slices[this._index].shadowAttrs) {
								for (
										f = 0,
										g = this.slices[this._index].shadowAttrs,
										b = g.length; f < b; f++) {
									h = g[f];
									for (e = 0, a = h.length; e < a; e++) {
										h[e].setAttributes({
											hidden : true
										}, true)
									}
								}
							}
							this.drawSeries()
						}
					},
					showAll : function() {
						if (!isNaN(this._index)) {
							this.__excludes[this._index] = false;
							this.drawSeries()
						}
					},
					highlightItem : function(s) {
						var u = this, t = u.rad;
						s = s || this.items[this._index];
						if (!s || s.sprite && s.sprite._animating) {
							return
						}
						u.parent([ s ]);
						if (!u.highlight) {
							return
						}
						if ("segment" in u.highlightCfg) {
							var w = u.highlightCfg.segment, e = u.chart.animate, o, q, a, f, k, b, m, d;
							if (u.labelsGroup) {
								var g = u.labelsGroup, p = u.label.display, h = g
										.getAt(s.index), v = (s.startAngle + s.endAngle)
										/ 2 * t, n = w.margin || 0, l = n
										* Math.cos(v), j = n * Math.sin(v);
								if (e) {
									h._anim = new Ext.fx.Anim({
										to : {
											translate : {
												x : l,
												y : j
											}
										},
										target : h,
										duration : u.highlightDuration
									})
								} else {
									h.setAttributes({
										translate : {
											x : l,
											y : j
										}
									}, true)
								}
							}
							if (u.chart.shadow && s.shadows) {
								q = 0;
								a = s.shadows;
								k = a.length;
								for (; q < k; q++) {
									f = a[q];
									b = {};
									m = s.sprite._from.segment;
									for (d in m) {
										if (!(d in w)) {
											b[d] = m[d]
										}
									}
									o = {
										segment : Ext.apply(b,
												u.highlightCfg.segment)
									};
									if (e) {
										f._anim = new Ext.fx.Anim({
											target : f,
											to : o,
											duration : u.highlightDuration
										})
									} else {
										f.setAttributes(o, true)
									}
								}
							}
						}
					},
					unHighlightItem : function() {
						var w = this;
						if (!w.highlight) {
							return
						}
						if (("segment" in w.highlightCfg) && w.items) {
							var l = w.items, f = w.chart.animate, e = !!w.chart.shadow, k = w.labelsGroup, t = l.length, s = 0, r = 0, q = w.label.display, z, m, d, a, v, n, b, g, u, h, o;
							for (; s < t; s++) {
								u = l[s];
								if (!u) {
									continue
								}
								n = u.sprite;
								if (n && n._highlighted) {
									if (k) {
										h = k.getAt(u.index);
										o = {
											to : Ext
													.apply(
															{
																translate : {
																	x : 0,
																	y : 0
																}
															},
															q == "rotate" ? {
																rotate : {
																	x : h.attr.x,
																	y : h.attr.y,
																	degrees : h.attr.rotation.degrees
																}
															}
																	: {})
										};
										if (f) {
											h._anim.paused = true;
											h._anim = new Ext.fx.Anim({
												target : h,
												to : o.to,
												duration : w.highlightDuration
											})
										} else {
											h.setAttributes(o.to, true)
										}
									}
									if (e) {
										b = u.shadows;
										z = b.length;
										for (; r < z; r++) {
											d = {};
											a = u.sprite._to.segment;
											v = u.sprite._from.segment;
											Ext.apply(d, v);
											for (m in a) {
												if (!(m in v)) {
													d[m] = a[m]
												}
											}
											g = b[r];
											if (f) {
												g._anim.paused = true;
												g._anim = new Ext.fx.Anim(
														{
															target : g,
															to : {
																segment : d
															},
															duration : w.highlightDuration
														})
											} else {
												g.setAttributes({
													segment : d
												}, true)
											}
										}
									}
								}
							}
						}
						w.parent(arguments)
					},
					getLegendColor : function(a) {
						var b = this;
						return b.colorArrayStyle[a % b.colorArrayStyle.length]
					}
				});
Ext.define("Ext.fx.target.Sprite", {
	isAnimTarget : true,
	constructor : function(a) {
		this.target = a;
		Ext.fx.target.Sprite.superclass.constructor.call(this, a)
	},
	type : "draw",
	getId : function() {
		return this.target.id
	},
	getFromPrim : function(b, a) {
		var d;
		if (a == "translate") {
			d = {
				x : b.attr.translation.x || 0,
				y : b.attr.translation.y || 0
			}
		} else {
			if (a == "rotate") {
				d = {
					degrees : b.attr.rotation.degrees || 0,
					x : b.attr.rotation.x,
					y : b.attr.rotation.y
				}
			} else {
				d = b.attr[a]
			}
		}
		return d
	},
	getAttr : function(a, b) {
		return [ [ this.target,
				b != undefined ? b : this.getFromPrim(this.target, a) ] ]
	},
	setAttr : function(n) {
		var h = n.length, r, g, q, l = [], f, b, p, o, e, d, m, k, a;
		for (e = 0; e < h; e++) {
			r = n[e].attrs;
			for (g in r) {
				q = r[g];
				a = q.length;
				for (d = 0; d < a; d++) {
					b = q[d][0];
					f = q[d][1];
					if (g == "translate") {
						o = {
							x : f.x,
							y : f.y
						}
					} else {
						if (g == "rotate") {
							m = f.x;
							if (isNaN(m)) {
								m = null
							}
							k = f.y;
							if (isNaN(k)) {
								k = null
							}
							o = {
								degrees : f.degrees,
								x : m,
								y : k
							}
						} else {
							o = f
						}
					}
					p = Ext.Array.indexOf(l, b);
					if (p == -1) {
						l.push([ b, {} ]);
						p = l.length - 1
					}
					l[p][1][g] = o
				}
			}
		}
		h = l.length;
		for (e = 0; e < h; e++) {
			b = l[e];
			b[0].setAttributes(b[1])
		}
		this.target.redraw()
	}
});
Ext
		.define(
				"Ext.chart.series.Radar",
				{
					extend : "Ext.chart.series.Series",
					requires : [ "Ext.chart.Shapes", "Ext.fx.Anim" ],
					type : "pie",
					rad : Math.PI / 180,
					showInLegend : false,
					style : {},
					constructor : function(d) {
						this.parent(arguments);
						var f = this, a = f.chart.surface, e, b;
						f.group = a.getGroup(f.seriesId);
						if (f.showMarkers) {
							f.markerGroup = a.getGroup(f.seriesId + "-markers")
						}
					},
					drawSeries : function() {
						var J = this, m = J.chart.substore || J.chart.store, o = J.group, A, u = J.chart, k = u.animate, d = J.field
								|| J.yField, C = u.surface, t = u.chartBBox, g, q, p, v, h, H = 0, B = [], F = Math.max, f = Math.cos, a = Math.sin, z = Math.PI * 2, D = m
								.getCount(), I, w, s, r, e, E, b, j = J.seriesStyle, G = J.seriesLabelStyle, n = u.resizing
								|| !J.radar;
						Ext.apply(j, J.style || {});
						J.unHighlightItem();
						J.cleanHighlights();
						q = J.centerX = t.x + (t.width / 2);
						p = J.centerY = t.y + (t.height / 2);
						J.radius = h = Math.min(t.width, t.height) / 2;
						J.items = v = [];
						u.series.each(function(i) {
							B.push(i.yField)
						});
						m.each(function(l, K) {
							for (K = 0, b = B.length; K < b; K++) {
								H = F(+l.get(B[K]), H)
							}
						});
						I = [];
						w = [];
						m.each(function(l, K) {
							e = h * l.get(d) / H;
							s = e * f(K / D * z);
							r = e * a(K / D * z);
							if (K == 0) {
								w.push("M", s + q, r + p);
								I.push("M", 0.01 * s + q, 0.01 * r + p)
							} else {
								w.push("L", s + q, r + p);
								I.push("L", 0.01 * s + q, 0.01 * r + p)
							}
							v.push({
								sprite : false,
								point : [ q + s, p + r ]
							})
						});
						w.push("Z");
						if (!J.radar) {
							J.radar = C.add(Ext.apply({
								type : "path",
								group : o,
								path : I
							}, j || {}))
						}
						if (u.resizing) {
							J.radar.setAttributes({
								path : I
							}, true)
						}
						if (u.animate) {
							J.onAnimate(J.radar, {
								to : Ext.apply({
									path : w
								}, j || {})
							})
						} else {
							J.radar.setAttributes(Ext.apply({
								path : w
							}, j || {}), true)
						}
						J.showMarkers && J.drawMarkers();
						J.renderLabels();
						J.renderCallouts()
					},
					drawMarkers : function() {
						var m = this, j = m.chart, a = j.surface, b = Ext
								.apply({}, m.markerStyle || {}), h = Ext.apply(
								b, m.markerCfg), k = m.items, n = h.type, p = m.markerGroup, f = m.centerX, e = m.centerY, o, g, d;
						delete h.type;
						for (g = 0, d = k.length; g < d; g++) {
							o = k[g];
							marker = p.getAt(g);
							if (!marker) {
								marker = Ext.chart.Shapes[n](a, Ext.apply({
									group : p,
									x : 0,
									y : 0,
									translate : {
										x : f,
										y : e
									}
								}, h))
							} else {
								marker.setAttributes({
									x : 0,
									y : 0,
									hidden : false
								}, true)
							}
							if (j.resizing) {
								marker.setAttributes({
									x : 0,
									y : 0,
									translate : {
										x : f,
										y : e
									}
								}, true)
							}
							marker._to = {
								translate : {
									x : o.point[0],
									y : o.point[1]
								}
							};
							if (j.animate) {
								m.onAnimate(marker, {
									to : marker._to
								})
							} else {
								marker.setAttributes(Ext.apply(marker._to, h
										|| {}), true)
							}
						}
					},
					onCreateLabel : function(g, m, f, h) {
						var j = this, l = j.labelsGroup, a = j.label, e = j.centerX, d = j.centerY, k = m.point, b = Ext
								.apply(j.seriesLabelStyle || {}, a);
						return j.chart.surface.add(Ext.apply({
							type : "text",
							"text-anchor" : "middle",
							group : l,
							x : e,
							y : d
						}, a || {}))
					},
					onPlaceLabel : function(q, h, s, g, k, b) {
						var m = this, l = m.chart, j = l.resizing, d = m.label, r = d.renderer, p = d.field, f = m.centerX, e = m.centerY, a = {
							x : s.point[0],
							y : s.point[1]
						}, o = a.x - f, n = a.y - e;
						q.setAttributes({
							text : r(h.get(p)),
							hidden : true
						}, true);
						if (j) {
							q.setAttributes({
								x : f,
								y : e
							}, true)
						}
						if (b) {
							q.show(true);
							m.onAnimate(q, {
								to : a
							})
						} else {
							q.setAttributes(a, true);
							q.show(true)
						}
					},
					toggleAll : function(a) {
						var f = this, b, e, g, d;
						if (!a) {
							Ext.chart.series.Radar.superclass.hideAll.call(f)
						} else {
							Ext.chart.series.Radar.superclass.showAll.call(f)
						}
						if (f.radar) {
							f.radar.setAttributes({
								hidden : !a
							}, true);
							if (f.radar.shadows) {
								for (b = 0, d = f.radar.shadows, e = d.length; b < e; b++) {
									g = d[b];
									g.setAttributes({
										hidden : !a
									}, true)
								}
							}
						}
					},
					hideAll : function() {
						this.toggleAll(false);
						this.hideMarkers(0)
					},
					showAll : function() {
						this.toggleAll(true)
					},
					hideMarkers : function(a) {
						var e = this, d = e.markerGroup
								&& e.markerGroup.getCount() || 0, b = a || 0;
						for (; b < d; b++) {
							e.markerGroup.getAt(b).hide(true)
						}
					}
				});
Ext
		.define(
				"Ext.chart.axis.Radial",
				{
					extend : "Ext.chart.axis.Abstract",
					position : "radial",
					drawAxis : function(u) {
						var m = this.chart, a = m.surface, t = m.chartBBox, q = m.store, b = q
								.getCount(), f = t.x + (t.width / 2), d = t.y
								+ (t.height / 2), p = Math.min(t.width,
								t.height) / 2, k = [], r, o = this.steps, g, e, h = Math.PI * 2, s = Math.cos, n = Math.sin;
						if (this.sprites && !m.resizing) {
							this.drawLabels();
							return
						}
						if (!this.sprites) {
							for (g = 1; g <= o; g++) {
								r = a.add({
									type : "circle",
									x : f,
									y : d,
									radius : Math.max(p * g / o, 0),
									stroke : "#ccc"
								});
								r.setAttributes({
									hidden : false
								}, true);
								k.push(r)
							}
							q.each(function(l, j) {
								r = a.add({
									type : "path",
									path : [ "M", f, d, "L",
											f + p * s(j / b * h),
											d + p * n(j / b * h), "Z" ],
									stroke : "#ccc"
								});
								r.setAttributes({
									hidden : false
								}, true);
								k.push(r)
							})
						} else {
							k = this.sprites;
							for (g = 0; g < o; g++) {
								k[g].setAttributes({
									x : f,
									y : d,
									radius : Math.max(p * (g + 1) / o, 0),
									stroke : "#ccc"
								}, true)
							}
							q.each(function(l, i) {
								k[g + i].setAttributes({
									path : [ "M", f, d, "L",
											f + p * s(i / b * h),
											d + p * n(i / b * h), "Z" ],
									stroke : "#ccc"
								}, true)
							})
						}
						this.sprites = k;
						this.drawLabels()
					},
					drawLabels : function() {
						var r = this.chart, w = r.surface, b = r.chartBBox, h = r.store, m = b.x
								+ (b.width / 2), l = b.y + (b.height / 2), f = Math
								.min(b.width, b.height) / 2, C = Math.max, F = Math.round, s = [], k, u = [], d, v = [], g, E = 0, D = this.steps, B = 0, A, p, o, t = Math.PI * 2, e = Math.cos, a = Math.sin, z = this.label.display, n = z !== "none", q = 10;
						if (!n) {
							return
						}
						r.series.each(function(i) {
							u.push(i.yField);
							g = i.xField
						});
						h.each(function(j, G) {
							for (G = 0, d = u.length; G < d; G++) {
								E = C(+j.get(u[G]), E)
							}
							v.push(j.get(g))
						});
						if (!this.labelArray) {
							if (z != "categories") {
								for (B = 1; B <= D; B++) {
									k = w.add({
										type : "text",
										text : F(B / D * E),
										x : m,
										y : l - f * B / D,
										"text-anchor" : "middle",
										"stroke-width" : 0.1,
										stroke : "#333"
									});
									k.setAttributes({
										hidden : false
									}, true);
									s.push(k)
								}
							}
							if (z != "scale") {
								for (A = 0, D = v.length; A < D; A++) {
									p = e(A / D * t) * (f + q);
									o = a(A / D * t) * (f + q);
									k = w
											.add({
												type : "text",
												text : v[A],
												x : m + p,
												y : l + o,
												"text-anchor" : p * p <= 0.001 ? "middle"
														: (p < 0 ? "end"
																: "start")
											});
									k.setAttributes({
										hidden : false
									}, true);
									s.push(k)
								}
							}
						} else {
							s = this.labelArray;
							if (z != "categories") {
								for (B = 0; B < D; B++) {
									s[B].setAttributes({
										text : F((B + 1) / D * E),
										x : m,
										y : l - f * (B + 1) / D,
										"text-anchor" : "middle",
										"stroke-width" : 0.1,
										stroke : "#333"
									}, true)
								}
							}
							if (z != "scale") {
								for (A = 0, D = v.length; A < D; A++) {
									p = e(A / D * t) * (f + q);
									o = a(A / D * t) * (f + q);
									s[B + A]
											.setAttributes(
													{
														type : "text",
														text : v[A],
														x : m + p,
														y : l + o,
														"text-anchor" : p * p <= 0.001 ? "middle"
																: (p < 0 ? "end"
																		: "start")
													}, true)
								}
							}
						}
						this.labelArray = s
					}
				});