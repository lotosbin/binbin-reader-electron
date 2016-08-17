import detail from "./components/detail";
import emitter from "./components/emitter";
import feed from "./components/feed";
import history from "./components/history";
import * as provider from "./components/provider";
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

detail.Init()
history.Init()
