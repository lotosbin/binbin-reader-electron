function open_in_detail(url) {
  document.getElementById('webview').src = url
}
var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
var msg;

db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id unique, log)');
  tx.executeSql('INSERT INTO LOGS (id, log) VALUES (1, "foobar")');
  tx.executeSql('INSERT INTO LOGS (id, log) VALUES (2, "logmsg")');
  msg = '<p>Log message created and row inserted.</p>';
  document.querySelector('#status').innerHTML = msg;
});

db.transaction(function (tx) {
  tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) {
    var len = results.rows.length, i;
    msg = "<p>Found rows: " + len + "</p>";
    document.querySelector('#status').innerHTML += msg;

    for (i = 0; i < len; i++) {
      msg = "<p><b>" + results.rows.item(i).log + "</b></p>";
      document.querySelector('#status').innerHTML += msg;
    }
  }, null);
});

var remote = require('electron').remote;
var dialog = remote.dialog;
var fs = require('fs');
var opmlToJSON = require('opml-to-json');
function onImport() {
  dialog.showOpenDialog(function (fileNames) {
    if (fileNames === undefined) return;
    var fileName = fileNames[0];
    fs.readFile(fileName, 'utf-8', function (err, data) {
      console.log(data)
      opmlToJSON(data,function (err, json ) {
        console.log(JSON.stringify(json))
      })
    });
  });
}
