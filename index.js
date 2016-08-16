var provider = require('./components/provider')
var detail = require('./components/detail.js')
var feed = require('./components/feed.js')

provider.UpdateFeeds();
var updating = false
function UpdateFeedsArticles() {
  if (!updating) {
    updating = true
    provider.UpdateFeedsArticles(function () {
      updating = false
    })
  }
}
setInterval(() => {
  UpdateFeedsArticles()
}, 1000 * 60 * 30); // 30 minus
UpdateFeedsArticles()
function open_in_detail(url) {
  detail.open_in_detail(url)
}
function open_in_list(url) {
  feed.open_in_list(url)
}

 
