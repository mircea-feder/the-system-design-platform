import React, {useEffect, useState} from "react";
import "./CanvasNode.scss"
import '@xyflow/react/dist/style.css';
import {Handle, NodeProps, Position, useReactFlow} from "@xyflow/react";
import {CanvasNodeInfoTooltip} from "./CanvasNodeInfoTooltip/CanvasNodeInfoTooltip";
import {DeleteIcon, EditIcon, InfoOutlineIcon} from "@chakra-ui/icons";
import {
    IconButton,
    useDisclosure
} from "@chakra-ui/react";
import {EditCanvasNodeAlertDialog} from "./EditCanvasNodeAlertDialog/EditCanvasNodeAlertDialog";
import {useHistory} from "../../../contexts/HistoryContext";

const handlePositions: Position[] = [Position.Top, Position.Right, Position.Bottom, Position.Left];

export const CanvasNode = ({ id, selected, data }: NodeProps) => {
    const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();
    // @ts-ignore
    const { addToHistory } = useHistory();

    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const [displayDetails, setDisplayDetails] = useState(false);

    const handleDelete = () => {
        addToHistory(getNodes(), getEdges());
        setEdges((edges) => edges.filter((edge) => !edge.id.startsWith(id) && !edge.id.slice(0, -6).endsWith(id)));
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
    }

    useEffect(() => { selected || setDisplayDetails(false); }, [selected]);

    return (
        <div className="canvas-node">
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
            <div className="content-wrapper">
                <img src={data.imgSrc as string} alt={"cannot load img"} />
                <p className={"title h3"}>{data.name as string}</p>
            </div>
            {
                selected ? <div className={"actions-menu"}>
                    <IconButton
                        className={"action-button edit-button"}
                        aria-label={"Edit button"}
                        fontSize={"0.75em"}
                        icon={<EditIcon/>}
                        size={"xs"}
                        onClick={onEditOpen}
                    />
                    <IconButton
                        className={"action-button details-button"}
                        aria-label={"Info button"}
                        fontSize={"0.75em"}
                        icon={<InfoOutlineIcon/>}
                        size={"xs"}
                        onClick={() => setDisplayDetails(!displayDetails)}
                    />
                    <IconButton
                        className={"action-button delete-button"}
                        aria-label={"Delete button"}
                        fontSize={"0.75em"}
                        icon={<DeleteIcon/>}
                        size={"xs"}
                        onClick={handleDelete}
                    />

                    {
                        displayDetails ? <CanvasNodeInfoTooltip imgSrc={data.imgSrc as string} componentName={data.componentName as string}
                            tags={data.tags as string[]} description={data.description as string} /> : <></>
                    }
                </div> : <></>
            }

            <EditCanvasNodeAlertDialog
                isEditOpen={isEditOpen}
                nodeId={id}
                onEditClose={onEditClose}
            />
        </div>
    );
}