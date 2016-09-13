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

var detail = (
  <MuiThemeProvider>
    <div style={{display:'flex',flexDirection:'column'}}>
      <div id="topbar" className="" style={{display: 'flex',flexDirection: 'row', flex:'none'}}>
        <TopBar />
      </div>
      <div className="content" style={{display:'flex'}}>
        <div id="divsideBar" className="column" style={{flexGrow: 0,flexBasis: '20%'}}>
          <SideBar></SideBar>
        </div>
        <div id="detail" className="column" style={{flex:1}}>
          <Detail></Detail>
        </div>
      </div>
      <div className="footer" id="status" name="status">
        <BottomNavigation></BottomNavigation>
        <div className="column" id="app" style={{display:'flex'}}>
          <div className="row" style={{justifyContent: 'flex-end'}}>
            <button style={{flex:'none'}} onClick="onImport()">import opml</button>
          </div>
        </div>
      </div>
    </div>
  </MuiThemeProvider>
);
ReactDOM.render(detail, document.getElementById("body"));

