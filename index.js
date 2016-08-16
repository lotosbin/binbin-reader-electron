
var provider = require('./components/provider.js')
var detail = require('./components/detail.js')
var feed = require('./components/feed.js')

provider.UpdateFeeds();
function open_in_detail(url) {
  detail.open_in_detail(url)
}
function open_in_list(url) {
  feed.open_in_list(url)
}

 
