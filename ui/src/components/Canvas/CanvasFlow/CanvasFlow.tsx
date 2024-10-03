import React, {useEffect, useMemo, useRef, useState} from "react";
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
import {DesignComponentCardProps} from "../../../interfaces";
import "./CanvasFlow.scss";
import {
    useDisclosure
} from "@chakra-ui/react";
import {CanvasSubflow} from "../CanvasSubflow/CanvasSubflow";
import {AddNodeAlertDialog} from "../AlertDialogs/AddNodeAlertDialog/AddNodeAlertDialog";
import {AddSubflowAlertDialog} from "../AlertDialogs/AddSubflowAlertDialog/AddSubflowAlertDialog";
import {useHistory} from "../../../contexts/HistoryContext";
import {DownloadIcon} from "@chakra-ui/icons";
import {SaveDiagramAlertDialog} from "../AlertDialogs/SaveDiagramAlertDialog/SaveDiagramAlertDialog";

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

const useKeyboardShortcuts = (onDel: () => void, onCtrlS: () => void) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Delete")
                onDel();
            else if (event.ctrlKey && event.key === 's') {
                event.preventDefault();
                onCtrlS();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onCtrlS, onDel]);
};

interface CanvasFlowProps {
    selectedFileName: string,
}

export const CanvasFlow = (props: CanvasFlowProps) => {
    const reactFlowInstance = useReactFlow();
    const { isOpen: isAddComponentOpen, onOpen: onAddComponentOpen, onClose: onAddComponentClose } = useDisclosure();
    const { isOpen: isAddSubflowOpen, onOpen: onAddSubflowOpen, onClose: onAddSubflowClose } = useDisclosure();
    const { isOpen: isSaveDiagramOpen, onOpen: onSaveDiagramOpen, onClose: onSaveDiagramClose } = useDisclosure();

    const getInitialState = () => {
        if (props.selectedFileName) {
            const fileContent = localStorage.getItem(props.selectedFileName);
            if (fileContent) {
                try {
                    const parsedContent = JSON.parse(fileContent);
                    if (Array.isArray(parsedContent.nodes) && Array.isArray(parsedContent.edges)) {
                        return { nodes: parsedContent.nodes, edges: parsedContent.edges };
                    }
                } catch (error) {
                    console.error('Error parsing JSON from localStorage:', error);
                }
            }
        }
        // Default to empty arrays if no data is found
        return { nodes: [], edges: [] };
    };

    const { nodes: initialNodes, edges: initialEdges } = getInitialState();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // @ts-ignore
    const { addToHistory, stateHistory, setStateHistory, stateHistoryPos } = useHistory();

    // TODO: to be fixed
    // const handleCtrlZ = () => {
    //     if (stateHistoryPos.current !== 0) {
    //         if (stateHistoryPos.current === stateHistory.length) {
    //             stateHistory.push([[...nodes], [...edges]]);
    //             setStateHistory([...stateHistory]);
    //         }
    //         setNodes(stateHistory[-- stateHistoryPos.current][0]);
    //         setEdges(stateHistory[stateHistoryPos.current][1]);
    //     }
    // }

    // TODO: to be fixed
    // const handleCtrlY = () => {
    //     if (stateHistoryPos.current + 1 < stateHistory.length) {
    //         setNodes(stateHistory[++ stateHistoryPos.current][0]);
    //         setEdges(stateHistory[stateHistoryPos.current][1]);
    //     }
    // }

    const handleOnDel = () => {
        if (nodes.find(x => x.selected) || edges.find(x => x.selected)) {
            addToHistory(nodes, edges);

            setNodes((nodes) => {
                const updatedNodes = nodes.filter((node) => !node.selected);
                const remainingNodeIds = new Set(updatedNodes.map((node) => node.id));

                setEdges((edges) =>
                    edges.filter((edge) => {
                        const [sourcePart, targetPart] = edge.id.split('->');
                        const sourceNodeId = sourcePart.split(':')[0];
                        const targetNodeId = targetPart.split(':')[0];
                        return (
                            !edge.selected &&
                            remainingNodeIds.has(sourceNodeId) &&
                            remainingNodeIds.has(targetNodeId)
                        );
                    })
                );

                return updatedNodes;
            });
        }
    }

    const handleCtrlS = () => {
        if (!isSaveDiagramOpen)
            onSaveDiagramOpen();
    }

    useKeyboardShortcuts(handleOnDel, handleCtrlS);
    //----------

    const [dropCanvasNodeData, setDropCanvasNodeData] = useState<DesignComponentCardProps>({
        imgSrc: "",
        componentName: "",
        tags: [],
    });
    const [dropPos, setDropPos] = useState<XYPosition>(null);

    const previousFileName = useRef(props.selectedFileName);
    useEffect(() => {
        console.log(`{"nodes":${JSON.stringify(nodes)},"edges":${JSON.stringify(edges)}}`);
        if (props.selectedFileName && previousFileName.current === props.selectedFileName) {
            localStorage.setItem(
                props.selectedFileName,
                JSON.stringify({ nodes, edges })
            );
        }
    }, [nodes, edges, props.selectedFileName])

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

    useEffect(() => {
        if (props.selectedFileName) {
            previousFileName.current = props.selectedFileName;

            const fileContent = localStorage.getItem(props.selectedFileName);

            if (fileContent) {
                try {
                    const parsedContent = JSON.parse(fileContent);

                    // Check if nodes and edges are present in the content
                    if (Array.isArray(parsedContent.nodes) && Array.isArray(parsedContent.edges)) {
                        setNodes(parsedContent.nodes);
                        setEdges(parsedContent.edges);
                    } else {
                        console.error('Invalid file structure. Expected "nodes" and "edges" arrays.');
                    }
                } catch (error) {
                    console.error('Error parsing JSON from localStorage:', error);
                }
            }
        }
    }, [props.selectedFileName, setNodes, setEdges]);

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
                <ControlButton onClick={onSaveDiagramOpen}>
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

            <SaveDiagramAlertDialog
                isSaveDiagramOpen={isSaveDiagramOpen}
                onSaveDiagramClose={onSaveDiagramClose}
                selectedFileName={props.selectedFileName}
            />

        </ReactFlow>
    )
}