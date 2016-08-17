"use strict";
var provider = require("./components/provider");
var detail = require("./components/detail");
var feed_1 = require("./components/feed");
var emitter_1 = require("./components/emitter");
emitter_1.default.on("open_in_detail", function (entry) {
    open_in_detail(entry.link);
});
provider.UpdateFeeds(function () {
});
var updating = false;
function UpdateFeedsArticles() {
    if (!updating) {
        updating = true;
        provider.UpdateFeedsArticles(function () {
            updating = false;
        });
    }
}
setInterval(function () {
    UpdateFeedsArticles();
}, 1000 * 60 * 30); // 30 minus
UpdateFeedsArticles();
function open_in_detail(url) {
    detail.open_in_detail(url);
}
function open_in_list(url) {
    feed_1.default.open_in_list(url, function () {
    });
}
//# sourceMappingURL=index.js.map