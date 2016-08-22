import detail from "./components/detail";
import provider from "./components/provider";
import {ProviderReact} from "./components/provider";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {TopBar} from "./components/topbar"
import * as injectTapEventPlugin from "react-tap-event-plugin";
import {BottomNavigationExampleSimple as BottomNavigation} from "./components/bottomnav"
import {DetailToolBar, DetailProgress} from "./components/detail"
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {FeedList} from "./components/feed";
import {DetailWebView} from "./components/detail";
import {HistoryList} from "./components/history";

ReactDOM.render(
  <MuiThemeProvider>
    <TopBar />
  </MuiThemeProvider>
  , document.getElementById("topbar"));
// var bottomNavigation = <div>
//   <a href="https://github.com/lotosbin/binbin-reader-electron" target="_blank">GitHub</a>
// </div>;
var bottomNavigation =
  <MuiThemeProvider>
    <BottomNavigation></BottomNavigation>
  </MuiThemeProvider>;
ReactDOM.render(bottomNavigation, document.getElementById("status"));
var detailToolBar = (
  <MuiThemeProvider>
    <DetailToolBar></DetailToolBar>
  </MuiThemeProvider>
);
ReactDOM.render(detailToolBar, document.getElementById("detailToolBar"));
var detailProgress = (
  <MuiThemeProvider>
    <DetailProgress></DetailProgress>
  </MuiThemeProvider>
);
// ReactDOM.render(detailProgress, document.getElementById("detailProgress"));
// var providerList = (
//   <MuiThemeProvider>
//     <ProviderReact></ProviderReact>
//   </MuiThemeProvider>
//
// );
// ReactDOM.render(providerList, document.getElementById("providerList"));
var feedList = (
  <MuiThemeProvider>
    <FeedList></FeedList>
  </MuiThemeProvider>

);
ReactDOM.render(feedList, document.getElementById("entryList"));
var detailWebView = (
  <MuiThemeProvider>
    <DetailWebView></DetailWebView>
  </MuiThemeProvider>

);
ReactDOM.render(detailWebView, document.getElementById("detailWebView"));

var historyList = (
  <MuiThemeProvider>
    <HistoryList></HistoryList>
  </MuiThemeProvider>
);
ReactDOM.render(historyList, document.getElementById("readHistory"));
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
