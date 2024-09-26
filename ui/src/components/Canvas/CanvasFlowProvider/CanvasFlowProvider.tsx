import React from 'react';
import {ReactFlowProvider} from "@xyflow/react";

import '@xyflow/react/dist/style.css';
import './CanvasFlowProvider.scss';
import {CanvasFlow} from "../CanvasFlow/CanvasFlow";
import {HistoryProvider} from "../../../contexts/HistoryContext";
import {CanvasFileManager} from "../CanvasFileManager/CanvasFileManager";

export const CanvasFlowProvider = () => {
    return (
        <div className="canvas-flow-provider">
            <ReactFlowProvider>
                <CanvasFileManager />
                <HistoryProvider>
                    <div className={"canvas-flow-wrapper"}>
                        <CanvasFlow/>
                    </div>
                </HistoryProvider>
            </ReactFlowProvider>
        </div>
    );
}