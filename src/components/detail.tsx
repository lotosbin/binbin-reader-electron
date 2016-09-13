/**
 * Created by liubinbin on 16/08/2016.
 */
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from "material-ui/Toolbar";
import RaisedButton from "material-ui/RaisedButton";
import LinearProgress from "material-ui/LinearProgress";
import {IArticle} from "../../definitions/storage/article";
import * as React from "react";
import {shell} from "electron";
import emitter from "./emitter";
import articleStorage from "../storage/article";
import {doSegment} from "../functions/segment";
import {View} from "react"
import {Toggle} from "material-ui";


export interface DetailWebViewProps {
  style: any
}
export class DetailWebView extends React.Component<DetailWebViewProps, {}> {
  state = {
    url: "http://www.yuanjingtech.com",
  };

  public componentWillMount() {

  }


}
export interface IDetailProps {

}
export class Detail extends React.Component<IDetailProps, {}> {
  state = {
    url: "http://www.yuanjingtech.com",
    title: "",
    value: 0,
    nightMode: false,
  }
  styles = {
    webview: {
      display: "flex",
      flex: 1,
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    }
  };

  componentWillMount() {
    emitter.on("open_in_detail", (entry: IArticle) => {
      let segments: string[] = doSegment(entry.title);
      console.log("segments:" + JSON.stringify(segments));
      this.setState({
        url: entry.link,
        title: entry.title,
        segments: segments,
      });
    });
    emitter.on("detail:did-start-loading", () => {
      this.setState({
        value: 20,
      });
    });
    emitter.on("detail:did-stop-loading", () => {
      this.setState({
        value: 100,
      });
    });
    emitter.on("open_in_detail", (entry: IArticle) => {
      this.setState({
        url: entry.link,
      });
      articleStorage.Read({id: this.state.url}, () => {
      });
    });
  }

  public componentDidMount() {
    let detialwebview = document.getElementById("webview");
    detialwebview.addEventListener("did-start-loading", () => {
      console.log("did-start-loading");
      emitter.emit("detail:did-start-loading");
    });
    detialwebview.addEventListener("did-stop-loading", () => {
      console.log("did-stop-loading");

      articleStorage.Read({id: this.state.url}, () => {
      });
      emitter.emit("detail:did-stop-loading");
    });
  }

  onOpenInBrowser() {
    shell.openExternal(this.state.url);
  }

  onToggleTheme() {
    this.setState({
      nightMode: !this.state.nightMode
    }, () => {
      emitter.emit('toggle_theme', this.state.nightMode)
    })
  }

  render() {
    return (
      <div style={this.styles.column}>
        <Toolbar>
          <ToolbarGroup firstChild={true}>
            <ToolbarTitle text={this.state.title}/>
          </ToolbarGroup>
          <ToolbarGroup>
            <Toggle
              label="Night Mode"
              toggled={this.state.nightMode}
              onToggle={this.onToggleTheme.bind(this)}
            />
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarSeparator />
            <RaisedButton label="Open In Browser" primary={true} onClick={this.onOpenInBrowser.bind(this)}/>
          </ToolbarGroup>
        </Toolbar>
        <LinearProgress
          mode="determinate"
          value={this.state.value}/>
        <webview id="webview"
                 style={this.styles.webview}
                 src={this.state.url}
        >
        </webview>
      </div>
    );
  }
}
