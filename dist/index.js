"use strict";
// ReactDOM.render(
//     <Hello compiler="TypeScript" framework="React" />,
//     document.getElementById("example")
// );
const detail_1 = require("./components/detail");
const history_1 = require("./components/history");
const provider_1 = require("./components/provider");
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
//# sourceMappingURL=index.js.map