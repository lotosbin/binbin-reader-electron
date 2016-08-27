import provider from "./components/provider";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {TopBar} from "./components/topbar"
import * as injectTapEventPlugin from "react-tap-event-plugin";
import {BottomNavigationExampleSimple as BottomNavigation} from "./components/bottomnav"
import {Detail} from "./components/detail"
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {SideBar} from "./components/sidebar";

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
var detail = (
  <MuiThemeProvider>
    <Detail></Detail>
  </MuiThemeProvider>
);

ReactDOM.render(detail, document.getElementById("detail"));
var sideBar = (
  <MuiThemeProvider>
    <SideBar></SideBar>
  </MuiThemeProvider>

);
ReactDOM.render(sideBar, document.getElementById("divsideBar"));

