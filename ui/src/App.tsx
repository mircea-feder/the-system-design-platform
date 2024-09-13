import React from 'react';
import {DesignCanvas} from "./components/DesignCanvas/DesignCanvas";
import {SidebarMenu} from "./components/SidebarMenu/SidebarMenu";
import "./App.scss";
import {DesignComponentsMenu} from "./components/DesignComponentsMenu/DesignComponentsMenu";

function App() {
  return (
    <div className="App">
        <SidebarMenu></SidebarMenu>
        <DesignComponentsMenu></DesignComponentsMenu>
        <DesignCanvas></DesignCanvas>
    </div>
  );
}

export default App;
