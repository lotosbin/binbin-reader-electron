/**
 * Created by liubinbin on 16/08/2016.
 */
import emitter from "./emitter";
import * as React from "react";
import {IArticle} from "../../definitions/storage/article";


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
      this.setState({
        entries: this.state.entries.concat(entry),
      });
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
  renderItem = (entry: IArticle) => {
    return (
      <li key={entry.id}><a onClick={this.open_in_detail.bind(this,entry.link)}>{entry.title}</a></li>
    );
  }

  render() {
    return (
      <ul style={this.styles.columnReverse}>
        {this.state.entries.map((entry: IArticle) => this.renderItem(entry))}
      </ul>
    );
  }
}
