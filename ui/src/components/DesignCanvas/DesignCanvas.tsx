import React, {useCallback, useMemo} from 'react';
import {
    addEdge,
    Background,
    BackgroundVariant,
    Controls,
    ReactFlow,
    useEdgesState,
    useNodesState
} from "@xyflow/react";

import '@xyflow/react/dist/style.css';
import './DesignCanvas.scss';
import {TextUpdaterNode} from "./TextUpdaterNode/TextUpdaterNode";
import {CanvasNode} from "./CanvasNode/CanvasNode";

export const DesignCanvas = () => {
    const initialNodes = [
        {
            id: '5',
            type: 'canvasNode',
            position: { x: 200, y: 400 },
            data: {
                imgSrc: "assets/images/aws-icons/analytics/aws_athena.png",
                componentName: "Athena",
                tags: ["aws", "analytics", "query", "sql", "serverless", "data"],
                name: "Event Queue EU",
                description: "Some description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla bla Some description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla bla Some description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla bla Some description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla bla Some description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla bla Some description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla blaSome description here bla bla bla"
            },
        },
        {
            id: '6',
            type: 'canvasNode',
            position: { x: 400, y: 400 },
            data: {
                imgSrc: "assets/images/aws-icons/analytics/aws_datapipeline.png",
                componentName: "Datapipeline",
                tags: ["aws", "analytics", "query", "sql", "serverless", "data"],
                name: "Data Pipeline",
                description: "Some description here bla bla bla"
            },
        }
    ];

    const initialEdges = [];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const nodeTypes = useMemo(() => ({
        textUpdater: TextUpdaterNode,
        canvasNode: CanvasNode,
    }), []);

    return (
        <div className="design-canvas">
            <ReactFlow
                className="canvas-flow"
                colorMode="dark"
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
            >
                <Controls />
                {/*<MiniMap />*/}
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}