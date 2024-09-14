import React from "react";
import "./CustomEdge.scss"
import {BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, useReactFlow} from "@xyflow/react";
import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {IconButton} from "@chakra-ui/react";

export const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
    markerEnd,
    selected
}: EdgeProps) => {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const handleEdit = () => {
        console.log("handle edit")
    }
    const handleDelete = () => {
        console.log("handle delete")
    }

    return (
        <>
            <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />
            <EdgeLabelRenderer>
                <>
                    {
                        selected ? <div className={"actions-menu"} style={{
                            position: 'absolute',
                            left: ` ${labelX + 8}px`, // Set X position
                            top: `${labelY - 32}px`,  // Set Y position
                            transform: 'translate(-50%, -50%)', // Center the label over its X and Y positions
                        }}>
                            <IconButton
                                className={"action-button edit-button"}
                                aria-label={"Edit component"}
                                fontSize={"0.75em"}
                                icon={<EditIcon/>}
                                size={"xs"}
                                onClick={handleEdit}
                            />
                            <IconButton
                                className={"action-button delete-button"}
                                aria-label={"Edit component"}
                                fontSize={"0.75em"}
                                icon={<DeleteIcon/>}
                                size={"xs"}
                                onClick={handleDelete}
                            />
                        </div> : <></>
                    }
                    {
                        (data && data.label) ? <div className={"text-wrapper"} style={{
                            position: 'absolute',
                            left: `${labelX}px`, // Set X position
                            top: `${labelY}px`,  // Set Y position
                            transform: 'translate(-50%, -50%)', // Center the label over its X and Y positions
                        }}>
                            <p className={"p2"}>
                                {String(data?.label)}
                            </p>
                        </div> : <></>
                    }
                </>

            </EdgeLabelRenderer>
        </>
    );
}