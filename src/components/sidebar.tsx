import * as React from "react";
import {Component} from 'react';

import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
import {FeedList} from "./feed";
import {HistoryList} from "./history";
import {ProviderReact} from "./provider";
const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  }
};
export interface ISideBarProps {

}
export class SideBar extends Component<ISideBarProps,{}> {
  state = {
    slideIndex: 0,
  }

  handleChange = (value: number) => {
    this.setState({
      slideIndex: value,
    });
  };

  render() {
    return (
      <div style={styles.column}>
        <Tabs
          onChange={(value:number)=>this.handleChange(value)}
          value={this.state.slideIndex}
        >
          <Tab label="Unread" value={0}/>
          <Tab label="History" value={1}/>
          <Tab label="Provider" value={2}/>
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={(value:number)=>this.handleChange(value)}
        >
          <div style={styles.column}>
            <FeedList></FeedList>
          </div>
          <div style={styles.column}>
            <HistoryList></HistoryList>
          </div>
          <div style={styles.column}>
            <ProviderReact></ProviderReact>
          </div>
        </SwipeableViews>
      </div>
    );
  }
}