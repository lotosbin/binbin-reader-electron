/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// ReactDOM.render(
	//     <Hello compiler="TypeScript" framework="React" />,
	//     document.getElementById("example")
	// );
	const detail_1 = __webpack_require__(3);
	const history_1 = __webpack_require__(10);
	const provider_1 = __webpack_require__(11);
	provider_1.default.UpdateFeeds(() => {
	});
	let updating = false;
	function UpdateFeedsArticles() {
	    if (!updating) {
	        updating = true;
	        provider_1.default.UpdateFeedsArticles(() => {
	            updating = false;
	        });
	    }
	}
	setInterval(() => {
	    UpdateFeedsArticles();
	}, 1000 * 60 * 30); // 30 minus
	// UpdateFeedsArticles();
	detail_1.default.Init();
	history_1.default.Init();


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * Created by liubinbin on 16/08/2016.
	 */
	const electron_1 = __webpack_require__(4);
	const Vue = __webpack_require__(5);
	const emitter_1 = __webpack_require__(6);
	const article_1 = __webpack_require__(8);
	var vue = new Vue({
	    el: '#detail',
	    data: {
	        url: 'http://www.yuanjingtech.com',
	        progress: 0
	    },
	    methods: {
	        UpdateUrl: function (url) {
	            this.url = url;
	        },
	        UpdateProgress: function (progress) {
	            this.progress = progress;
	        },
	        OnOpenInBrowser: function (event) {
	            electron_1.shell.openExternal(this.url);
	        },
	        MarkReaded: function () {
	            article_1.default.Read({ id: this.url }, () => {
	            });
	        }
	    }
	});
	var webview = document.getElementById('webview');
	webview.addEventListener('did-start-loading', function () {
	    vue.UpdateProgress(20);
	});
	webview.addEventListener('did-stop-loading', function () {
	    vue.UpdateProgress(100);
	    vue.MarkReaded();
	    emitter_1.default.emit('refresh_list', {});
	});
	class Detail {
	    Init() {
	    }
	}
	emitter_1.default.on("open_in_detail", (entry) => {
	    var url = entry.link;
	    vue.UpdateUrl(url);
	    webview.src = url;
	});
	var detail = new Detail();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = detail;


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("electron");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("vue");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * Created by liubinbin on 17/08/2016.
	 */
	const events_1 = __webpack_require__(7);
	var emitter = new events_1.EventEmitter();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = emitter;


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("events");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * Created by liubinbin on 15/08/2016.
	 */
	
	const _ = __webpack_require__(9);
	const ArticleTableName = "ARTICLES3";
	class ArticleStorage {
	    Add({ title, link, feed_xmlurl }, callback) {
	        var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
	        var msg;
	        db.transaction(function (tx) {
	            tx.executeSql(`INSERT INTO ${ ArticleTableName }  (id, title,link,feed_xmlurl,readed) VALUES (? ,?,?,?,?)`, [link, title, link, feed_xmlurl, 0], function (transaction, results) {}, function (transation, error) {
	                console.log(error);
	            });
	        });
	    }
	    Read({ id }, callback) {
	        var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
	        var msg;
	        db.transaction(function (tx) {
	            tx.executeSql(`UPDATE ${ ArticleTableName } SET readed = 1 WHERE id=? `, [id], function (transaction, results) {}, function (transation, error) {
	                console.log(error);
	            });
	        });
	    }
	    Init() {
	        var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
	        var msg;
	        db.transaction(function (tx) {
	            tx.executeSql(`CREATE TABLE IF NOT EXISTS ${ ArticleTableName } (id UNIQUE, title, link, feed_xmlurl,readed)`);
	            msg = '<p>created </p>';
	            console.log(msg);
	        });
	    }
	    AddRange(items, feed_xmlurl, callback) {
	        _(items).forEach(value => {
	            this.Add({ title: value.title, link: value.link, feed_xmlurl: feed_xmlurl }, () => {});
	        });
	    }
	    Find({}, callback) {
	        var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
	        var msg;
	        db.transaction(function (tx) {
	            tx.executeSql(`SELECT * FROM ${ ArticleTableName }  ORDER BY readed,rowid DESC LIMIT 100`, [], function (tx, results) {
	                callback(null, results);
	            }, null);
	        });
	    }
	}
	var articleStorage = new ArticleStorage();
	articleStorage.Init();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = articleStorage;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * Created by liubinbin on 16/08/2016.
	 */
	const emitter_1 = __webpack_require__(6);
	const Vue = __webpack_require__(5);
	var vm = new Vue({
	    el: '#readHistory',
	    data: {
	        histories: []
	    },
	    methods: {
	        AddHistory: function (article) {
	            this.histories.unshift(article);
	        }
	    }
	});
	emitter_1.default.on('open_in_detail', (entry) => {
	    console.log('addhistory');
	    vm.AddHistory(entry);
	});
	class History {
	    Init() {
	    }
	}
	var history = new History();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = history;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const electron_1 = __webpack_require__(4);
	let dialog = electron_1.remote.dialog;
	const fs = __webpack_require__(12);
	const opmlToJSON = __webpack_require__(13);
	const jsonPath = __webpack_require__(14);
	const feed_1 = __webpack_require__(15);
	const feed_2 = __webpack_require__(16);
	const Vue = __webpack_require__(5);
	const _ = __webpack_require__(9);
	const emitter_1 = __webpack_require__(6);
	let feedsVue = new Vue({
	    el: "#app",
	    data: {
	        feeds: [],
	    },
	    methods: {
	        updateFeeds: function (feeds) {
	            this.feeds = feeds;
	        },
	        on_open_in_list: function (feed) {
	            emitter_1.default.emit("open_in_list", feed);
	        },
	        onImport: function () {
	            dialog.showOpenDialog(function (fileNames) {
	                if (fileNames === undefined)
	                    return;
	                let fileName = fileNames[0];
	                fs.readFile(fileName, "utf-8", function (err, data) {
	                    opmlToJSON(data, function (err, json) {
	                        let rss = jsonPath.resolve(json, "/children[*]/children[*]");
	                        feed_1.default.AddRange(rss, () => {
	                        });
	                        provider.UpdateFeeds(() => {
	                        });
	                    });
	                });
	            });
	        },
	    },
	});
	feed_1.default.Init();
	class Provider {
	    UpdateFeeds(callback) {
	        feed_1.default.Find({}, function (error, results) {
	            feedsVue.updateFeeds(results.rows);
	            if (callback)
	                callback(null, results.rows);
	        });
	    }
	    UpdateFeedsArticles(callback) {
	        this.UpdateFeeds(function (error, feeds) {
	            Promise.all(_.map(feeds, (feed) => new Promise((resolve) => {
	                feed_2.default.GrabAndUpdateArticles(feed.xmlurl, function (error) {
	                    resolve({});
	                });
	            })))
	                .then(() => {
	                if (callback)
	                    callback(null);
	            });
	        });
	    }
	}
	let provider = new Provider();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = provider;


/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("opml-to-json");

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("json-path");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * Created by liubinbin on 15/08/2016.
	 */
	
	const _ = __webpack_require__(9);
	class FeedStorage {
	    Init() {
	        var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
	        var msg;
	        db.transaction(function (tx) {
	            tx.executeSql('CREATE TABLE IF NOT EXISTS FEEDS (id UNIQUE, title, xmlurl)');
	            msg = '<p>created </p>';
	            console.log(msg);
	        });
	    }
	    Add({ title, xmlurl }, callback) {
	        var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
	        var msg;
	        db.transaction(function (tx) {
	            tx.executeSql('INSERT INTO FEEDS (id, title,xmlurl) VALUES (? ,?,?)', [xmlurl, title, xmlurl], function (transaction, results) {}, function (transation, error) {
	                console.log(error);
	            });
	        });
	    }
	    AddRange(items, callback) {
	        _(items).forEach(value => {
	            this.Add({ title: value.title, xmlurl: value.xmlurl }, () => {});
	        });
	    }
	    Find({}, callback) {
	        var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
	        var msg;
	        db.transaction(function (tx) {
	            tx.executeSql('SELECT * FROM FEEDS', [], function (tx, results) {
	                callback(null, results);
	            }, null);
	        });
	    }
	}
	var feedStorage = new FeedStorage();
	feedStorage.Init();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = feedStorage;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
	    });
	};
	const Vue = __webpack_require__(5);
	const reader = __webpack_require__(17);
	const article_1 = __webpack_require__(8);
	const emitter_1 = __webpack_require__(6);
	var entryVue = new Vue({
	    el: '#entryList',
	    data: {
	        progress: 0,
	        entries: []
	    },
	    methods: {
	        UpdateEntries: function (entires) {
	            this.entries = entires;
	        },
	        UpdateProgress: function (progress) {
	            this.progress = progress;
	        },
	        on_open_in_detail: function (event, entry) {
	            event.preventDefault();
	            emitter_1.default.emit('open_in_detail', entry);
	            console.log('emit');
	        }
	    }
	});
	class Feed {
	    UpdateList() {
	        return __awaiter(this, void 0, void 0, function* () {
	            article_1.default.Find({}, (error, results) => {
	                console.log(results.rows.length);
	                entryVue.UpdateEntries(results.rows);
	            });
	        });
	    }
	    open_in_list(xmlurl, callback) {
	        return __awaiter(this, void 0, void 0, function* () {
	            entryVue.UpdateProgress(50);
	            try {
	                this.GrabAndUpdateArticles(xmlurl, () => {
	                });
	                entryVue.UpdateProgress(80);
	                yield this.UpdateList();
	                entryVue.UpdateProgress(100);
	                if (callback)
	                    callback(null);
	            }
	            catch (error) {
	                console.error(JSON.stringify(error));
	                entryVue.UpdateProgress(100);
	                if (callback)
	                    callback(error);
	            }
	        });
	    }
	    GrabAndUpdateArticles(xmlurl, callback) {
	        return __awaiter(this, void 0, void 0, function* () {
	            let feed = yield reader.parse(xmlurl);
	            article_1.default.AddRange(feed.entries, xmlurl, () => {
	            });
	            if (callback)
	                callback();
	        });
	    }
	}
	exports.Feed = Feed;
	var feed = new Feed();
	emitter_1.default.on('open_in_list', (f) => {
	    feed.open_in_list(f.xmlurl, () => {
	    });
	});
	emitter_1.default.on('refresh_list', (f) => {
	    feed.UpdateList();
	});
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = feed;


/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("feed-reader");

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map