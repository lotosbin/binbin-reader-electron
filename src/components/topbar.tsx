/**
 * Created by liubinbin on 2016/8/21.
 */
import * as React from "react";
import {
  AppBar
} from "material-ui";
import emitter from "./emitter";

export interface TopBarProps {
}

export class TopBar extends React.Component<TopBarProps, {}> {

  onShowProviderList() {
    emitter.emit('on_show_provider_list', {})
  }

  render() {
    return (
      <AppBar title="BinbinReader"
              iconClassNameRight="muidocs-icon-navigation-expand-more"
              onTitleTouchTap={this.onShowProviderList.bind(this)}
      />
    );
  }
}
