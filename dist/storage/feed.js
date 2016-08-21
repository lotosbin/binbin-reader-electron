"use strict";
/**
 * Created by liubinbin on 15/08/2016.
 */
const _ = require('lodash');
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
            tx.executeSql('INSERT INTO FEEDS (id, title,xmlurl) VALUES (? ,?,?)', [xmlurl, title, xmlurl], function (transaction, results) {
            }, function (transation, error) {
                console.log(error);
            });
        });
    }
    AddRange(items, callback) {
        _(items).forEach((value) => {
            this.Add({ title: value.title, xmlurl: value.xmlurl }, () => {
            });
        });
    }
    Find({  }, callback) {
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
//# sourceMappingURL=feed.js.map