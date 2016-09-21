import * as React from "react";
import {LinearProgress} from "material-ui";
import feedStorage from "../storage/feed";
import articleStorage from "../storage/article";
import emitter from "../functions/emitter";
import {ArticleEvents} from "../storage/article";
/**
 * Created by liubinbin on 9/20/2016.
 */
export class Dashboard extends React.Component<{},{}> {
  state = {
    value: 0,
    feedCount: 0,
    articleCount: 0,
    articleReadedCount: 0,
    articleNeedParseCount: 0,
  }

  componentDidMount() {
    emitter.on(ArticleEvents.MarkReaded, () => this.loadData())
    emitter.on(ArticleEvents.MarkAdded, () => this.loadData())
    this.loadData();
  }

  private loadData() {
    feedStorage.FindAsync()
      .then((feeds: any[]) => {
        this.setState({feedCount: feeds.length})
      })
    articleStorage.FindAsync()
      .then((articles: any[]) => {
        this.setState({articleCount: articles.length})
      })
    articleStorage.ReadedCount()
      .then((count: number) => {
        this.setState({articleReadedCount: count})
      })
    var pversion = articleStorage.getPVersion()
    articleStorage.FindUnCalePromise(pversion)
      .then((articles: any[]) => {
        this.setState({articleNeedParseCount: articles.length})
      })
  }

  render() {
    return (
      <div>
        <h1>Feed</h1>
        <LinearProgress
          mode="determinate"
          max={this.state.feedCount}
          value={this.state.feedCount}/>
        <span>{this.state.feedCount}</span>
        <br/>
        <h1>Article</h1>
        <LinearProgress
          mode="determinate"
          max={this.state.articleCount}
          value={this.state.articleReadedCount}/>
        <span>{this.state.articleReadedCount}/{this.state.articleCount}</span>
        <h1>parse</h1>
        <span>{this.state.articleNeedParseCount}</span>

      </div>
    );
  }
}
