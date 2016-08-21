import * as React from 'react';
import {Component} from 'react';
import  {
  FontIcon,
  Paper
} from 'material-ui';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';

const recentsIcon = <FontIcon className="material-icons">GitHub</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;
import {shell} from 'electron'

export interface BottomNavigationExampleSimpleProps {

}
/**
 * A simple example of `BottomNavigation`, with three labels and icons
 * provided. The selected `BottomNavigationItem` is determined by application
 * state (for instance, by the URL).
 */
export class BottomNavigationExampleSimple extends Component<BottomNavigationExampleSimpleProps,{}> {
  state = {
    selectedIndex: 0,
  };
  select = (index: number) => this.setState({selectedIndex: index});
  render() {
    return (
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label=""
            icon={recentsIcon}
            onTouchTap={() => {
              this.select(0)
              shell.openExternal("https://github.com/lotosbin/binbin-reader-electron")
            }}
          />
        </BottomNavigation>
      </Paper>
    );
  }
}

