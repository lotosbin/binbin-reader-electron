"use strict";
const detail_1 = require("./components/detail");
const history_1 = require("./components/history");
const provider = require("./components/provider");
provider.UpdateFeeds(() => {
});
let updating = false;
function UpdateFeedsArticles() {
    if (!updating) {
        updating = true;
        provider.UpdateFeedsArticles(() => {
            updating = false;
        });
    }
}
setInterval(() => {
    UpdateFeedsArticles();
}, 1000 * 60 * 30); // 30 minus
UpdateFeedsArticles();
detail_1.default.Init();
history_1.default.Init();
//# sourceMappingURL=index.js.map