import * as React from "react"
import  * as Vue from 'vue'
import  * as reader from 'feed-reader'
import articleStorage from '../storage/article'
import emitter from './emitter'
import {IArticle} from "../../definitions/storage/article";
import {IFeed} from "../../definitions/storage/feed";
import {RaisedButton} from "material-ui";
import {ToolbarSeparator} from "material-ui";
import {ToolbarGroup} from "material-ui";
import {Toolbar} from "material-ui";
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import {List, ListItem} from "material-ui/List"
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
export class Feed {
  async UpdateList() {
    articleStorage.Find({}, (error, results)=> {
      var d: IFeed[] = [];
      for (var i = 0; i < results.rows.length; i++) {
        d.push(results.rows.item(i))
      }
      emitter.emit('update_feed_list', d)
    })
  }


  async open_in_list(xmlurl: string, callback) {
    // entryVue.UpdateProgress(50)
    try {
      this.GrabAndUpdateArticles(xmlurl, ()=> {
      });
      // entryVue.UpdateProgress(80)
      await this.UpdateList()
      // entryVue.UpdateProgress(100)
      if (callback)callback(null)
    } catch (error) {
      console.error(JSON.stringify(error))
      // entryVue.UpdateProgress(100)
      if (callback)callback(error)
    }
  }

  async GrabAndUpdateArticles(xmlurl: string, callback) {
    let feed = await reader.parse(xmlurl)
    articleStorage.AddRange(feed.entries, xmlurl, ()=> {
    })
    if (callback)callback();
  }
}
export var feed = new Feed()
export interface FeedListProps {

}
export interface FeedListState {
  progress: number,
  entries: IFeed[]
}
export class FeedList extends React.Component<FeedListProps,{}> {
  state: FeedListState = {
    progress: 0,
    entries: []
  }

  componentWillMount() {
    emitter.on('open_in_list', (f: IFeed)=> {
      feed.open_in_list(f.xmlurl, ()=> {
      })
    })
    emitter.on('refresh_list', (f: IFeed)=> {
      feed.UpdateList()
    })
    emitter.on('update_feed_list', (feeds: IFeed[])=> {
      this.setState({
        entries: feeds
      })
    })
  }

  on_open_in_detail(entry: IFeed) {
    emitter.emit('open_in_detail', entry)
  }

  onRefresh() {
    feed.UpdateList()
  }

  renderItem(entry: IFeed) {
    return (
      <ListItem key={entry.id}
                onClick={()=>this.on_open_in_detail(entry)}
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
      <div style={this.styles.column}>
        <Toolbar style={{flex:'none'}}>
          <ToolbarGroup>
            <ToolbarSeparator />
            <RaisedButton label="Refresh" primary={true} onClick={()=>this.onRefresh()}/>
          </ToolbarGroup>
        </Toolbar>
        <progress style={{display:'flex',flex:'none'}}
                  id="entryListProgress"
                  max="100"
                  value={ this.state.progress }>
        </progress>
        <List style={this.styles.columnScroll}>
          <Subheader>待读列表</Subheader>
          {this.state.entries.map((feed)=>this.renderItem(feed))}
        </List>
      </div>
    );
  }
}
export default feed
