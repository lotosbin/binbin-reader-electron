var ws = require("nodejs-websocket")

var client = ws.connect("ws://localhost:8001", function (conn) {
  console.log("New connection")
  conn.on("text", function (str) {
    console.log("Received " + str)
    conn.sendText(str.toUpperCase() + "!!!")
  })
  conn.on("close", function (code, reason) {
    console.log("Connection closed")
  })

})
client.sendText('lkl', (code, reason) => {

})
