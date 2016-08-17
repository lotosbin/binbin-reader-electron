import * as detail from "./components/detail";
import emitter from "./components/emitter";
import feed from "./components/feed";
import * as ReadHistory from "./components/history";
import * as provider from "./components/provider";
emitter.on("open_in_detail", (entry) => {
  open_in_detail(entry.link);
});
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
function open_in_detail(url) {
  detail.open_in_detail(url);
}
function open_in_list(url) {
  feed.open_in_list(url, () => {
  });
}

