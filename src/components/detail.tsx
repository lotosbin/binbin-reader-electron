/**
 * Created by liubinbin on 16/08/2016.
 */
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import {IArticle} from "../../definitions/storage/article";
import * as React from 'react'
import {shell} from 'electron'
import * as Vue from 'vue'
import emitter from "./emitter";
import articleStorage from '../storage/article'
var vue = new Vue({
  el: '#detail',
  data: {
    url: 'http://www.yuanjingtech.com'
  },
  methods: {
    UpdateUrl: function (url: string) {
      this.url = url
    },
    MarkReaded: function () {
      articleStorage.Read({id: this.url}, ()=> {
      })
    }
  }
})
var webview = document.getElementById('webview');
webview.addEventListener('did-start-loading', function () {
  emitter.emit('detail:did-start-loading')
})
webview.addEventListener('did-stop-loading', function () {
  vue.MarkReaded()
  emitter.emit('detail:did-stop-loading')
  emitter.emit('refresh_list', {})
})

emitter.on("open_in_detail", (entry: IArticle) => {
  var url = entry.link
  vue.UpdateUrl(url)
  webview.src = url
});

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
      this.setState({
        url: entry.link,
        title: entry.title
      })
    })
  }

  onOpenInBrowser() {
    shell.openExternal(vue.$data.url)
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
