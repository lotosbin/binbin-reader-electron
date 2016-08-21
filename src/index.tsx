import * as React from "react";
import * as ReactDOM from "react-dom";
import {TopBar} from "./components/topbar"
import * as injectTapEventPlugin from "react-tap-event-plugin";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
  <MuiThemeProvider>
    <TopBar />
  </MuiThemeProvider>
  , document.getElementById("topbar"));
ReactDOM.render(
  <div>    <a href="https://github.com/lotosbin/binbin-reader-electron" target="_blank">GitHub</a></div>
  , document.getElementById("status")
);
import detail from "./components/detail";
import feed from "./components/feed";
import history from "./components/history";
import provider from "./components/provider";
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
// UpdateFeedsArticles();

detail.Init()
history.Init()
