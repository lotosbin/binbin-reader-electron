/**
 * Created by liubinbin on 2016/8/21.
 */
import * as React from "react";
import {
  AppBar
} from "material-ui";

export interface TopBarProps {
}

export class TopBar extends React.Component<TopBarProps, {}> {
  render() {
    return <AppBar title="BinbinReader"
                   iconClassNameRight="muidocs-icon-navigation-expand-more"
    />
  }
}
