import * as React from "react";
import {LinearProgress} from "material-ui";
import feedStorage from "../storage/feed";
import articleStorage from "../storage/article";
/**
 * Created by liubinbin on 9/20/2016.
 */
export class Dashboard extends React.Component<{},{}> {
  state = {
    value: 0,
    feedCount: 0,
    articleCount: 0,
    articleReadedCount: 0,
  }

  componentDidMount() {
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
      </div>
    );
  }
}
