import * as React from "react";
import {remote}  from "electron";
let dialog = remote.dialog;
import * as fs  from "fs";
import * as opmlToJSON from "opml-to-json";
import * as jsonPath from "json-path";
import feedStorage from "../storage/feed";
import feedService from "./feed";
import * as _ from "lodash";
import emitter from "./emitter";
import {Drawer} from "material-ui";
import {List} from "material-ui";
import {ListItem} from "material-ui";
import {IFeed} from "../../definitions/storage/feed";


class Provider {

  public UpdateFeedsArticles(callback) {
    feedStorage.Find({}, function (error, feeds) {
      Promise.all(_.map(feeds, (feed) => new Promise((resolve) => {
        feedService.GrabAndUpdateArticles(feed.xmlurl, function (error) {
          resolve({});
        });
      })))
        .then(() => {
          if (callback)callback(null);
        });
    });
  }
}
export interface ProviderProps {

}
export interface ProviderState {
  open: boolean,
  data: IFeed[]
}
export class ProviderReact extends React.Component<ProviderProps,{}> {
  state: ProviderState = {
    open: false,
    data: []
  }

  componentWillMount() {
    emitter.on('on_show_provider_list', ()=> {
      this.setState({
        open: true,
      })
    })
    feedStorage.Find({}, (error: any, results: any[]) => {
      this.setState({
        data: results
      })
    });

    setInterval(() => {
      this.UpdateFeedsArticles();
    }, 1000 * 60 * 30); // 30 minus
  }

  componentDidMount() {
  }

  updating = false;

  UpdateFeedsArticles() {
    if (!this.updating) {
      this.updating = true;
      feedStorage.Find({}, function (error, feeds) {
        var promises = _.map(feeds, (feed) => new Promise((resolve) => {
          feedService.GrabAndUpdateArticles(feed.xmlurl, (error)=> {
            resolve({});
          });
        }));
        Promise.all(promises)
          .then(() => {
            this.updating = true
          });
      });
    }
  }

  onImport() {
    dialog.showOpenDialog(function (fileNames) {
      if (fileNames === undefined) return;
      let fileName = fileNames[0];
      fs.readFile(fileName, "utf-8", function (err, data) {
        opmlToJSON(data, function (err, json) {
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

  renderItem = (feed: IFeed)=> {
    return <ListItem key={feed.id} primaryText={feed.title} onClick={this.onOpenInList(feed)}/>
  }

  render() {
    return (
      <List>
        {this.state.data.map(this.renderItem)}
      </List>
    );
  }
}
let provider = new Provider();


export  default provider;
