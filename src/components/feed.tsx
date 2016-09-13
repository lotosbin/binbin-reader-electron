import * as React from "react"
import  * as reader from 'feed-reader'
import articleStorage from '../storage/article'
import emitter from './emitter'
import {IFeed} from "../../definitions/storage/feed";
import {RaisedButton} from "material-ui";
import {ToolbarSeparator} from "material-ui";
import {ToolbarGroup} from "material-ui";
import {Toolbar} from "material-ui";
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import {List, ListItem} from "material-ui/List"
import Subheader from 'material-ui/Subheader';

export class Feed {
  async UpdateList() {
    articleStorage.Find({}, (error, results) => {
      var d: IFeed[] = [];
      for (var i = 0; i < results.rows.length; i++) {
        d.push(results.rows.item(i))
      }
      emitter.emit('update_feed_list', d)
    })
  }


  async open_in_list(xmlurl: string, callback) {
    try {
      this.GrabAndUpdateArticles(xmlurl, () => {
      });
      await this.UpdateList()
      if (callback)callback(null)
    } catch (error) {
      if (callback)callback(error)
    }
  }

  async GrabAndUpdateArticles(xmlurl: string, callback) {
    let feed = await reader.parse(xmlurl)
    articleStorage.AddRange(feed.entries, xmlurl, () => {
      if (callback)callback();
    })
  }
}
export var feed = new Feed()
export interface FeedListProps {

}
export interface FeedListState {
  progress: number,
  entries: IFeed[],
  slideIndex: number
}
export class FeedList extends React.Component<FeedListProps,{}> {
  state: FeedListState = {
    progress: 0,
    entries: [],
    slideIndex: 0,
  }

  componentWillMount() {
    emitter.on('open_in_list', (f: IFeed) => {
      feed.open_in_list(f.xmlurl, () => {
      })
    })
    emitter.on('refresh_list', (f: IFeed) => {
      feed.UpdateList()
    })
    emitter.on('update_feed_list', (feeds: IFeed[]) => {
      this.setState({
        entries: feeds
      })
    })
  }

  async on_open_in_detail(entry: IFeed) {
    var index = this.state.entries.indexOf(entry)
    var readeds = this.state.entries.filter((v, i) => i < index);
    articleStorage.MarkReadedMultiAsync(readeds.map((v) => v.id), (error) => {
      console.log(error)
    });
    emitter.emit('mark_as_readed', readeds)
    emitter.emit('open_in_detail', entry)
  }

  onRefresh() {
    feed.UpdateList()
  }

  renderItem(entry: IFeed) {
    return (
      <ListItem key={entry.id}
                onClick={async ()=>await this.on_open_in_detail(entry)}
                primaryText={entry.title}
      />
    );
  }

  styles = {
    column: {
      display: 'flex',
      flexDirection: 'column'
    },
    columnScroll: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'scroll'
    },
  }

  render() {
    return (
      <List style={this.styles.columnScroll}>
        {this.state.entries.map((feed) => this.renderItem(feed))}
      </List>
    );
  }
}
export default feed
