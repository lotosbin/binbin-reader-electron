/**
 * Created by liubinbin on 16/08/2016.
 */
import * as React from 'react'
import {shell} from 'electron'
import * as Vue from 'vue'
import emitter from "./emitter";
import articleStorage from '../storage/article'
var vue = new Vue({
  el: '#detail',
  data: {
    url: 'http://www.yuanjingtech.com',
    progress: 0
  },
  methods: {
    UpdateUrl: function (url: string) {
      this.url = url
    },
    UpdateProgress: function (progress: number) {
      this.progress = progress
    },
    OnOpenInBrowser: function () {
      shell.openExternal(this.url)
    },
    MarkReaded: function () {
      articleStorage.Read({id: this.url}, ()=> {
      })
    }
  }
})
var webview = document.getElementById('webview');
webview.addEventListener('did-start-loading', function () {
  vue.UpdateProgress(20)
})
webview.addEventListener('did-stop-loading', function () {
  vue.UpdateProgress(100)
  vue.MarkReaded()
  emitter.emit('refresh_list', {})
})

emitter.on("open_in_detail", (entry) => {
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
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';


export interface DetailToolBarProps {

}
export class DetailToolBar extends React.Component<DetailToolBarProps,{}> {
  onOpenInBrowser() {
    shell.openExternal(vue.$data.url)
  }

  render() {
    return (
      <Toolbar>
        <ToolbarGroup firstChild={true}>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarSeparator />
          <RaisedButton label="Open In Browser" primary={true} onClick={this.onOpenInBrowser.bind(this)}/>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
var detail = new Detail();
export default detail
