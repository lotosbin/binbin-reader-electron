import * as React from "react"
import  * as reader from 'feed-reader'
import articleStorage from '../storage/article'
import emitter from '../functions/emitter'
import {IFeed} from "../../definitions/storage/feed";
import {List, ListItem} from "material-ui/List"
import * as _ from 'lodash'
import {Toolbar} from "material-ui";
import {ToolbarGroup} from "material-ui";
import {RaisedButton} from "material-ui";
import feedService from "../services/feed";
import {IArticle} from "../../definitions/storage/article";
import {Divider} from "material-ui";
import {Subheader} from "material-ui";
import * as moment from "moment"
export interface FeedListProps {

}
export interface FeedListState {
  current: IFeed,
  progress: number,
  entries: IFeed[],
  slideIndex: number
}
export class FeedList extends React.Component<FeedListProps,{}> {
  state: FeedListState = {
    current: null,
    progress: 0,
    entries: [],
    slideIndex: 0,
  }

  componentWillMount() {
    emitter.on('open_in_list', (f: IFeed) => {
      this.open_in_list(f.xmlurl, () => {
      })
    })
    emitter.on('article_readed', (id: any) => {
      this.removeFromList(id);
    })
    emitter.on('article_markreaded', (id: any) => {
      this.removeFromList(id);
    })
    setInterval(() => {
      articleStorage.CalcPrimary()
    }, 1000 * 5);
  }

  private removeFromList(id: any) {
    var a = this.state.entries.find((v) => v.id === id)
    if (a) {
      this.setState({
        entries: _.without(this.state.entries, a)
      }, () => {
        if (this.state.entries.length <= 0) {
          this.UpdateList()
        }
      })
    }
  }

  async open_in_list(xmlurl: string, callback) {
    try {
      feedService.GrabAndUpdateArticles(xmlurl, () => {
      });
      await this.UpdateList()
      if (callback)callback(null)
    } catch (error) {
      if (callback)callback(error)
    }
  }

  async UpdateList() {
    articleStorage.FindUnreadPromise()
      .then(results => this.setState({
        entries: results
      }))
  }


  async on_open_in_detail(entry: IFeed) {
    var index = this.state.entries.indexOf(entry)
    var readeds = this.state.entries.filter((v, i) => i < index);
    articleStorage.MarkReadedMultiAsync(readeds.map((v) => v.id), (error) => {
      console.log(error)
    });
    emitter.emit('mark_as_readed', readeds)
    emitter.emit('open_in_detail', entry)
    this.setState({current: entry})
  }

  onRefresh() {
    this.UpdateList()
  }

  renderItem(entry: IFeed) {
    return (
      <ListItem key={entry.id}
                onClick={async ()=>await this.on_open_in_detail(entry)}
                primaryText={entry.title}
                secondaryText={`${moment(entry.update_time).fromNow()} ${entry.p.toString()}`}
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

  onMarkReaded() {
    articleStorage.MarkReadedMultiAsync(this.state.entries.map((v) => v.id), (error) => {
      console.log(error)
    });
    emitter.emit('mark_as_readed', this.state.entries)
  }

  onCalcPrimary() {
    articleStorage.CalcPrimary()
  }

  render() {
    return (
      <div className="column">
        <Toolbar>
          <ToolbarGroup>
            <RaisedButton label="Refresh" primary={true} onClick={this.onRefresh.bind(this)}/>
            <RaisedButton label="Mark Readed(this page)" primary={true} onClick={this.onMarkReaded.bind(this)}/>
            <RaisedButton label="Calc Primary" primary={true} onClick={this.onCalcPrimary.bind(this)}/>
          </ToolbarGroup>
        </Toolbar>
        <List>
          <Subheader>Current</Subheader>
          {this.state.current ? this.renderItem(this.state.current) : null}
          <Divider />
          <Subheader>Priority</Subheader>
          {this.state.entries.map((feed) => this.renderItem(feed))}
        </List>
      </div>
    );
  }
}
export default feed
