import * as React from "react";
import {remote}  from "electron";
let dialog = remote.dialog;
import * as fs  from "fs";
import * as opmlToJSON from "opml-to-json";
import * as jsonPath from "json-path";
import feedStorage from "../storage/feed";
import feedService from "./feed";
import * as Vue from "vue";
import * as _ from "lodash";
import emitter from "./emitter";
import {Drawer} from "material-ui";
import {List} from "material-ui";
import {ListItem} from "material-ui";
import {IFeed} from "../../definitions/storage/feed";


let feedsVue = new Vue({
  el: "#app",
  data: {
    feeds: [],
  },
  methods: {
    updateFeeds: function (feeds) {
      this.feeds = feeds;
    },
    onImport: function () {
      dialog.showOpenDialog(function (fileNames) {
        if (fileNames === undefined) return;
        let fileName = fileNames[0];
        fs.readFile(fileName, "utf-8", function (err, data) {
          opmlToJSON(data, function (err, json) {
            let rss = jsonPath.resolve(json, "/children[*]/children[*]");
            feedStorage.AddRange(rss, () => {

            });
            provider.UpdateFeeds(() => {
            });
          });
        });
      });
    },
  },
});
feedStorage.Init();
class Provider {
  public UpdateFeeds(callback) {
    feedStorage.Find({}, function (error, results) {
      feedsVue.updateFeeds(results.rows);
      if (callback)callback(null, results.rows);
    });
  }

  public UpdateFeedsArticles(callback) {
    this.UpdateFeeds(function (error, feeds) {
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
    feedStorage.Find({}, (error, results: any[]) => {
      var d: IFeed[] = [];
      for (var i = 0; i < results.rows.length; i++) {
        d.push(results.rows.item(i))
      }
      this.setState({
        data: d
      })
    });
  }

  onOpenInList(feed: IFeed) {
    emitter.emit('open_in_list', feed)
  }

  listItem = (feed: IFeed)=> {
    return <ListItem key={feed.id} primaryText={feed.title} onClick={this.onOpenInList(feed)}/>
  }

  render() {
    return (
      <div>
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <List>
            {this.state.data.map(this.listItem)}
          </List>
        </Drawer>
      </div>
    );
  }
}
let provider = new Provider();
export  default provider;
