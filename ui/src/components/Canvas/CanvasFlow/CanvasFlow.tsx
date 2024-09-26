import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    addEdge,
    Background,
    BackgroundVariant, ControlButton,
    Controls, MarkerType,
    ReactFlow,
    useEdgesState,
    useNodesState,
    useReactFlow,
    XYPosition
} from "@xyflow/react";
import {CanvasNode} from "../CanvasNode/CanvasNode";
import {CustomEdge} from "../CustomEdge/CustomEdge";
import {DesignComponentCardProps, SubflowColor} from "../../../interfaces";
import "./CanvasFlow.scss";
import {
    useDisclosure
} from "@chakra-ui/react";
import {CanvasSubflow} from "../CanvasSubflow/CanvasSubflow";
import {AddNodeAlertDialog} from "../AlertDialogs/AddNodeAlertDialog/AddNodeAlertDialog";
import {AddSubflowAlertDialog} from "../AlertDialogs/AddSubflowAlertDialog/AddSubflowAlertDialog";
import {useHistory} from "../../../contexts/HistoryContext";
import {CanvasFileManager} from "../CanvasFileManager/CanvasFileManager";
import {DownloadIcon} from "@chakra-ui/icons";

const idGen = (): string => {
    const charactersArray = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ];
    let sb = '';
    for (let i = 0; i < 6; i++)
        sb += charactersArray[Math.floor(Math.random() * 62)];
    return sb;
}

const useKeyboardShortcuts = (onCtrlZ: () => void, onCtrlY: () => void, onDel: () => void) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Delete")
                onDel();
            else if (event.ctrlKey && event.key === 'z')
                onCtrlZ();
            else if (event.ctrlKey && event.key === 'y')
                onCtrlY();
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onCtrlZ, onCtrlY, onDel]);
};

export const CanvasFlow = () => {
    const initialNodes = [];
    const initialEdges = [];

    const reactFlowInstance = useReactFlow();
    const { isOpen: isAddComponentOpen, onOpen: onAddComponentOpen, onClose: onAddComponentClose } = useDisclosure();
    const { isOpen: isAddSubflowOpen, onOpen: onAddSubflowOpen, onClose: onAddSubflowClose } = useDisclosure();

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // @ts-ignore
    const { addToHistory, stateHistory, setStateHistory, stateHistoryPos } = useHistory();

    const handleCtrlZ = () => {
        if (stateHistoryPos.current !== 0) {
            if (stateHistoryPos.current === stateHistory.length) {
                stateHistory.push([[...nodes], [...edges]]);
                setStateHistory([...stateHistory]);
            }
            setNodes(stateHistory[-- stateHistoryPos.current][0]);
            setEdges(stateHistory[stateHistoryPos.current][1]);
        }
    }
    const handleCtrlY = () => {
        if (stateHistoryPos.current + 1 < stateHistory.length) {
            setNodes(stateHistory[++ stateHistoryPos.current][0]);
            setEdges(stateHistory[stateHistoryPos.current][1]);
        }
    }
    const handleOnDel = () => {
        if (edges.find(x => x.selected)) {
            addToHistory(nodes, edges);
            setEdges((edges) => edges.filter((edge) => !edge.selected));
        }
    }
    useKeyboardShortcuts(handleCtrlZ, handleCtrlY, handleOnDel);
    //----------

    const [dropCanvasNodeData, setDropCanvasNodeData] = useState<DesignComponentCardProps>({
        imgSrc: "",
        componentName: "",
        tags: [],
    });
    const [dropPos, setDropPos] = useState<XYPosition>(null);

    useEffect(() => {
        const errorHandler = (e: any) => {
            if (
                e.message.includes(
                    "ResizeObserver loop completed with undelivered notifications" ||
                    "ResizeObserver loop limit exceeded"
                )
            ) {
                const resizeObserverErr = document.getElementById(
                    "webpack-dev-server-client-overlay"
                );
                if (resizeObserverErr) {
                    resizeObserverErr.style.display = "none";
                }
            }
        };
        window.addEventListener("error", errorHandler);

        return () => {
            window.removeEventListener("error", errorHandler);
        };
    }, []);

    const onConnect = (params) => {
        const { source, target, sourceHandle, targetHandle } = params;
        const edgeId = `${source}:${sourceHandle}->${target}:${targetHandle}`;

        setEdges((eds) =>
            addEdge(
                {
                    ...params,
                    id: edgeId,
                    type: 'customEdge',
                    data: { label: '' },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 24,
                        height: 24,
                    },
                },
                eds
            )
        );

        addToHistory(nodes, edges);
    };

    const nodeTypes = useMemo(() => ({
        canvasNode: CanvasNode,
        canvasSubflow: CanvasSubflow,
    }), []);
    const edgeTypes = useMemo(() => ({
        customEdge: CustomEdge,
    }), []);

    const handleDrop = (ev) => {
        ev.preventDefault();
        const props = JSON.parse(ev.dataTransfer.getData("text/plain"));
        setDropPos(reactFlowInstance.screenToFlowPosition({
            x: ev.clientX,
            y: ev.clientY,
        }));

        if (JSON.stringify(props) === "{}")
            onAddSubflowOpen();
        else {
            setDropCanvasNodeData(props);
            onAddComponentOpen();
        }
    };

    const handleNodeDragStop = (ev, node) => {
        let _nodes = nodes.map(n => n.id === node.id && n.type === 'canvasSubflow' ? { ...n, selected: false } : n);
        _nodes = [..._nodes].sort((a, b) => {
            if (a.type === 'canvasNode' && b.type === 'canvasSubflow') return 1;
            if (a.type === 'canvasSubflow' && b.type === 'canvasNode') return -1;
            return 0;
        });
        setNodes(_nodes);
    };

    const onNodeClick = (event, node) => {
        if (node.type === "canvasSubflow") {
            handleNodeDragStop(event, node);
        }
    }

    return(
        <ReactFlow
            className="canvas-flow"
            colorMode="dark"
            snapToGrid={true}
            snapGrid={[12, 12]}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onDragOver={(ev) => ev.preventDefault()}
            onNodeDragStop={handleNodeDragStop}
            onDrop={handleDrop}
        >
            <Controls>
                <ControlButton onClick={() => alert('Something magical just happened. ✨')}>
                    <DownloadIcon />
                </ControlButton>
            </Controls>
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

            <AddNodeAlertDialog
                nodeData={dropCanvasNodeData}
                id={idGen()}
                pos={dropPos}
                isAddComponentOpen={isAddComponentOpen}
                onAddComponentClose={onAddComponentClose}
            />

            <AddSubflowAlertDialog
                id={idGen()}
                pos={dropPos}
                isAddSubflowOpen={isAddSubflowOpen}
                onAddSubflowClose={onAddSubflowClose}
            />

        </ReactFlow>
    )
}