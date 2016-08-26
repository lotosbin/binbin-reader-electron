/**
 * Created by liubinbin on 16/08/2016.
 */
import emitter from "./emitter";
import * as React from "react";
import {IArticle} from "../../definitions/storage/article";
import * as HistoryStorage from "../storage/history"
import * as ArticleStorage from "../storage/article"
import History from "../storage/history"
import {IHistory} from "../storage/history";

export interface HistoryListProps {

}
export interface HistoryListState {
  entries: IArticle[];
}
export class HistoryList extends React.Component<HistoryListProps, {}> {
  state: HistoryListState = {
    entries: [],
  };

  componentWillMount() {
    emitter.on("open_in_detail", (entry: IArticle) => {
      History.AddAsync({id: 0, articleId: entry.id})
        .then(()=> {
          History.FindAsync()
            .then((data)=> {
              this.setState({
                entries: data
              });
            })
        })
    });
  }

  open_in_detail(link: string) {

  }

  styles = {
    columnReverse: {
      display: 'flex',
      flexDirection: 'column-reverse',
      overflow: 'scroll'
    }
  }
  renderItem = async(history: IHistory) => {
    var entry = await ArticleStorage.GetAsync(history.articleId)
    return (
      <li key={entry.id}><a onClick={this.open_in_detail.bind(this,entry.link)}>{entry.title}</a></li>
    );
  }

  render() {
    return (
      <ul style={this.styles.columnReverse}>
        {this.state.entries.map((entry: IHistory) => this.renderItem(entry))}
      </ul>
    );
  }
}
