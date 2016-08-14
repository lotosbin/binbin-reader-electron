/**
 * Created by liubinbin on 15/08/2016.
 */
var _ = require('lodash')
function Add({title, xmlurl},callback) {
  var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
  var msg;
  db.transaction(function (tx) {
    tx.executeSql('INSERT INTO FEEDS (id, title,xmlurl) VALUES (? ,?,?)',[xmlurl,title,xmlurl],function (transaction,results) {

    },function (transation,error) {
      console.log(error)
    });
  });
}
module.exports =  {
  Init: function () {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    var msg;

    db.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS FEEDS (id UNIQUE, title, xmlurl)');
      msg = '<p>created </p>';
      console.log(msg)
    });
  },
  Add: Add,
  AddRange:function (items, callback) {
    _(items).forEach(function (value) {
      Add({title:value.title,xmlurl:value.xmlurl})
    })
  },
  Find:function ({},callback) {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    var msg;

    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM FEEDS', [], function (tx, results) {
        callback(null,results)
      }, null);
    });
  }
}
