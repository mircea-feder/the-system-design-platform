import React from 'react';
import {CanvasFlowProvider} from "./components/Canvas/CanvasFlowProvider/CanvasFlowProvider";
import {SidebarMenu} from "./components/SidebarMenu/SidebarMenu";
import {CanvasComponentsMenu} from "./components/CanvasComponentsMenu/CanvasComponentsMenu";

function App() {
  return (
    <div className="App">
        <SidebarMenu></SidebarMenu>
        <CanvasComponentsMenu></CanvasComponentsMenu>
        <CanvasFlowProvider></CanvasFlowProvider>
    </div>
  );
}

export default App;
