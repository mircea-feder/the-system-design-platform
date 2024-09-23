import React from 'react';
import {ReactFlowProvider} from "@xyflow/react";

import '@xyflow/react/dist/style.css';
import './CanvasFlowProvider.scss';
import {CanvasFlow} from "../CanvasFlow/CanvasFlow";
import {HistoryProvider} from "../../../contexts/HistoryContext";

export const CanvasFlowProvider = () => {
    return (
        <div className="canvas-flow-provider">
            <ReactFlowProvider>
                <HistoryProvider>
                    <CanvasFlow />
                </HistoryProvider>
            </ReactFlowProvider>
        </div>
    );
}