import React, {useRef, useState} from "react";
import "./CanvasSubflow.scss"
import {Handle, NodeProps, NodeResizer, Position, ResizeParams, useReactFlow} from "@xyflow/react";
import {SubflowColor} from "../../../interfaces";
import {IconButton, useDisclosure} from "@chakra-ui/react";
import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {EditCanvasSubflowAlertDialog} from "./EditCanvasSubflowAlertDialog/EditCanvasSubflowAlertDialog";
import {useHistory} from "../../../contexts/HistoryContext";

const handlePositions: Position[] = [Position.Top, Position.Right, Position.Bottom, Position.Left];

export const CanvasSubflow = ({id, data}: NodeProps) => {
    const { setNodes, setEdges, getNodes, getEdges, getNode } = useReactFlow();
    // @ts-ignore
    const { addToHistory } = useHistory();
    const titleRef = useRef();
    const [displayActionsMenu, setDisplayActionsMenu] = useState<boolean>(false);

    const handleOnMouseOver = () => {
        if (!displayActionsMenu && getNodes().filter(x => x.type === 'canvasNode' && x.selected).length === 0)
            setDisplayActionsMenu(true);
        else if (displayActionsMenu && getNodes().filter(x => x.type === 'canvasNode' && x.selected).length > 0)
            setDisplayActionsMenu(false);
    }

    const getColorSchemeClass = (): string => {
        let sb = "subflow-";
        switch (data.colorScheme) {
            case SubflowColor.GREEN:
                sb += "green"; break;
            case SubflowColor.BLUE:
                sb += "blue"; break;
            case SubflowColor.RED:
                sb += "red"; break;
            case SubflowColor.PURPLE:
                sb += "purple"; break;
        }
        return sb;
    };

    const getColor = (): string => {
        switch (data.colorScheme) {
            case SubflowColor.GREEN:
                return "#00FF7F";
            case SubflowColor.BLUE:
                return "#00BFFF";
            case SubflowColor.RED:
                return "#FF6347";
            case SubflowColor.PURPLE:
                return "#9370DB";
        }
    }

    const MIN_HEIGHT: number = 204;
    const MIN_WIDTH: number = 408;
    const MAX_HEIGHT: number = 1494;
    const MAX_WIDTH: number = 2988;

    const [nodeSize, setNodeSize] = useState<number[]>([MIN_WIDTH, MIN_HEIGHT]);

    const handleOnResize = (params: ResizeParams & { direction: number[]; }) => setNodeSize([params.width, params.height]);

    const handleDelete = () => {
        addToHistory(getNodes(), getEdges());
        setEdges((edges) => edges.filter((edge) => !edge.id.startsWith(id) && !edge.id.slice(0, -6).endsWith(id)));
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
    }

    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    return (
        <div
            className={"canvas-subflow-wrapper"}
            onMouseLeave={(ev) => setDisplayActionsMenu(false)}
            onMouseMove={(ev) => handleOnMouseOver()}
            style={{
                width: `${getNode(id) && getNode(id).width > MIN_WIDTH ? getNode(id).width : nodeSize[0]}px`,
                height: `${getNode(id) && getNode(id).height > MIN_HEIGHT ? getNode(id).height : nodeSize[1]}px`,
            }
        }>
            <NodeResizer
                onResize={(ev, params) => handleOnResize(params)}
                handleStyle={{
                    backgroundColor: getColor(),
                }}
                minHeight={MIN_HEIGHT} minWidth={MIN_WIDTH}
                maxHeight={MAX_HEIGHT} maxWidth={MAX_WIDTH}
            />
            <p className={"subflow-title h3"} ref={titleRef}>{data!.title as string}</p>
            <div className={`actions-menu ${displayActionsMenu ? "visible" : ""}`} >
                <IconButton
                    className={"action-button edit-button"}
                    aria-label={"Edit button"}
                    fontSize={"0.75em"}
                    icon={<EditIcon/>}
                    size={"xs"}
                    onClick={onEditOpen}
                />
                <IconButton
                    className={"action-button delete-button"}
                    aria-label={"Delete button"}
                    fontSize={"0.75em"}
                    icon={<DeleteIcon/>}
                    size={"xs"}
                    onClick={handleDelete}
                />
            </div>
            <div className={`canvas-subflow ${getColorSchemeClass()}`}>
                {
                    handlePositions.map((item, index) =>
                        <>
                            <Handle
                                type="target"
                                position={item}
                                isConnectable={true}
                                id={`trg-${index}`}
                            />
                            <Handle
                                type="source"
                                position={item}
                                isConnectable={true}
                                id={`src-${index}`}
                            />
                        </>
                    )
                }
                <div className={"canvas-subflow-interior nodrag"} />
            </div>
            <EditCanvasSubflowAlertDialog
                nodeId={id}
                isEditOpen={isEditOpen}
                onEditClose={onEditClose}
            />
        </div>
    );
}