import * as React from "react";
import {remote}  from "electron";
let dialog = remote.dialog;
import feedStorage from "../storage/feed";
import feedService from "../services/feed";
import emitter from "../functions/emitter";
import {List} from "material-ui";
import {ListItem} from "material-ui";
import {IFeed} from "../../definitions/storage/feed";

export interface IProviderProps {

}
export interface IProviderState {
  data: IFeed[]
}
export class ProviderList extends React.Component<IProviderProps,{}> {
  state: IProviderState = {
    data: []
  }

  componentWillMount() {
  }

  componentDidMount() {
    feedStorage.Find({}, (error: any, results: any[]) => {
      this.setState({
        data: results
      })
    });
  }

  onImport() {
    dialog.showOpenDialog((fileNames: string[]) => {
      if (fileNames === undefined) return;
      let fileName = fileNames[0];
      feedService.importFromFile(fileName);
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
