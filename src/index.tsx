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
import {SideBar} from "./layouts/sidebar";
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import emitter from "./functions/emitter";
import feedService from "./services/feed"
class Main extends React.Component<{},{}> {
  state = {
    currentTheme: getMuiTheme(lightBaseTheme)
  }

  componentWillMount() {
    emitter.on('toggle_theme', (nightmode: boolean) => {
      console.log('toggle_theme' + nightmode)
      if (nightmode)
        this.setState({
          currentTheme: getMuiTheme(darkBaseTheme)
        })
      else {
        this.setState({
          currentTheme: getMuiTheme(lightBaseTheme)
        })
      }
    });
  }

  componentDidMount() {
    setInterval(() => {
      feedService.UpdateFeedsArticles(() => {
      })
    }, 1000 * 30)
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={this.state.currentTheme}>
        <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
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
  }
}
ReactDOM.render(<Main></Main>, document.getElementById("body"));

