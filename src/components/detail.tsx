/**
 * Created by liubinbin on 16/08/2016.
 */
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import {IArticle} from "../../definitions/storage/article";
import * as React from 'react'
import {shell} from 'electron'
import emitter from "./emitter";
import articleStorage from '../storage/article'
import {doSegment} from "../functions/segment";


export interface DetailWebViewProps {

}
export class DetailWebView extends React.Component<DetailWebViewProps,{}> {
  state = {
    url: "http://www.yuanjingtech.com"
  }

  componentWillMount() {
    emitter.on("open_in_detail", (entry: IArticle) => {
      console.log('bind webview events')
      var detialwebview = document.getElementById('webview');
      detialwebview.addEventListener('did-start-loading', ()=> {
        console.log('did-start-loading')
        emitter.emit('detail:did-start-loading')
      })
      detialwebview.addEventListener('did-stop-loading', () => {
        console.log('did-stop-loading')

        articleStorage.Read({id: this.state.url}, ()=> {
        })
        emitter.emit('detail:did-stop-loading')
        emitter.emit('refresh_list', {})
      });
      this.setState({
        url: entry.link
      })
      articleStorage.Read({id: this.state.url}, ()=> {
      })
    });
  }

  componentDidMount() {

  }

  styles = {
    webview: {
      display: 'flex',
      flex: 1
    }
  }

  render() {
    return (
      <webview id="webview"
               style={this.styles.webview}
               src={this.state.url}
      >
      </webview>
    );
  }
}
export interface DetailProps {

}
export class Detail extends React.Component<DetailProps,{}> {
  public Init() {

  }
}


export interface DetailToolBarProps {

}
export class DetailToolBar extends React.Component<DetailToolBarProps,{}> {
  state = {
    url: "",
    title: ""
  }

  componentWillMount() {
    emitter.on('open_in_detail', (entry: IArticle)=> {
      var segments: string[] = doSegment(entry.title);
      console.log('segments:' + JSON.stringify(segments))
      this.setState({
        url: entry.link,
        title: entry.title,
        segments: segments
      })
    })
  }

  onOpenInBrowser() {
    shell.openExternal(this.state.url)
  }

  render() {
    return (
      <Toolbar>
        <ToolbarGroup firstChild={true}>
          <ToolbarTitle text={this.state.title}/>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarSeparator />
          <RaisedButton label="Open In Browser" primary={true} onClick={this.onOpenInBrowser.bind(this)}/>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
export interface DetailProgressProps {

}
export class DetailProgress extends React.Component<DetailProgressProps,{}> {
  state = {
    value: 0
  }

  componentWillMount() {
    emitter.on('detail:did-start-loading', ()=> {
      this.setState({
        value: 20
      })
    })
    emitter.on('detail:did-stop-loading', ()=> {
      this.setState({
        value: 100
      })
    })
  }

  render() {
    return (
      <LinearProgress
        mode="determinate"
        value={this.state.value}/>
    );
  }
}

var detail = new Detail();
export default detail
