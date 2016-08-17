"use strict";
/**
 * Created by liubinbin on 15/08/2016.
 */
const _ = require('lodash');
class ArticleStorage {
    Add({ title, link, feed_xmlurl }, callback) {
        var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
        var msg;
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO ARTICLES2 (id, title,link,feed_xmlurl) VALUES (? ,?,?,?)', [link, title, link, feed_xmlurl], function (transaction, results) {
            }, function (transation, error) {
                console.log(error);
            });
        });
    }
    Init() {
        var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
        var msg;
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ARTICLES2 (id UNIQUE, title, link, feed_xmlurl)');
            msg = '<p>created </p>';
            console.log(msg);
        });
    }
    AddRange(items, feed_xmlurl, callback) {
        _(items).forEach((value) => {
            this.Add({ title: value.title, link: value.link, feed_xmlurl: feed_xmlurl }, () => {
            });
        });
    }
    Find({  }, callback) {
        var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
        var msg;
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM ARTICLES2 ORDER BY rowid DESC ', [], function (tx, results) {
                callback(null, results);
            }, null);
        });
    }
}
var articleStorage = new ArticleStorage();
articleStorage.Init();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = articleStorage;
//# sourceMappingURL=article.js.map