import * as React from "react";
import {remote}  from "electron";
let dialog = remote.dialog;
import * as fs  from "fs";
import * as opmlToJSON from "opml-to-json";
import * as jsonPath from "json-path";
import feedStorage from "../storage/feed";
import feedService from "../services/feed";
import * as _ from "lodash";
import emitter from "../functions/emitter";
import {List} from "material-ui";
import {ListItem} from "material-ui";
import {IFeed} from "../../definitions/storage/feed";
import {ICallback} from "../../definitions/common"

export interface IProviderProps {

}
export interface IProviderState {
  open: boolean,
  data: IFeed[]
}
export class ProviderList extends React.Component<IProviderProps,{}> {
  state: IProviderState = {
    data: [],
    open: false,
  }

  public componentWillMount() {
    emitter.on('on_show_provider_list', () => {
      this.setState({
        open: true,
      });
    })
    feedStorage.Find({}, (error: any, results: any[]) => {
      this.setState({
        data: results
      })
    });
  }

  componentDidMount() {
  }

  onImport() {
    dialog.showOpenDialog( (fileNames:string[]) => {
      if (fileNames === undefined) return;
      let fileName = fileNames[0];
      fs.readFile(fileName, "utf-8",  (err, data) => {
        opmlToJSON(data,  (err, json) => {
          let rss = jsonPath.resolve(json, "/children[*]/children[*]");
          feedStorage.AddRange(rss, () => {

          });
        });
      });
    });
  }

  onOpenInList(feed: IFeed) {
    emitter.emit('open_in_list', feed)
  }

  renderItem = (feed: IFeed) => {
    return <ListItem key={feed.id} primaryText={feed.title} onClick={this.onOpenInList(feed)}/>
  }
  
  style = {
    margin: 12,
  };

  public render() {
    return (
      <List>
        {this.state.data.map(this.renderItem)}
      </List>
    );
  }
}
