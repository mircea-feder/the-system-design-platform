import React, {useState} from "react";
import "./CanvasNode.scss"
import '@xyflow/react/dist/style.css';
import {Handle, Position} from "@xyflow/react";
import {CanvasNodeInfoTooltip} from "./CanvasNodeInfoTooltip/CanvasNodeInfoTooltip";
import {DeleteIcon, EditIcon, InfoOutlineIcon} from "@chakra-ui/icons";
import {IconButton} from "@chakra-ui/react";

const handlePositions: Position[] = [Position.Top, Position.Bottom, Position.Left, Position.Right];

export const CanvasNode = ({ data }) => {
    const [detailsVisible, setDetailsVisible] = useState(false);

    const handleEdit = () => {}

    const handleDetails = () => setDetailsVisible(!detailsVisible);

    const handleDelete = () => {}

    return (
        <div className="canvas-node">
            {
                handlePositions.map((item, index) =>
                    <>
                        <Handle
                            type="source"
                            position={item}
                            isConnectable={true}
                            id={`src-${index}`}
                        />
                        <Handle
                            type="target"
                            position={item}
                            isConnectable={true}
                            id={`trg-${index}`}
                        />
                    </>
                )
            }
            <div className="content-wrapper">
                <img src={data.imgSrc} alt={"cannot load img"} />
                <p className={"h3"}>{data.name}</p>
            </div>

            <div className={"actions-menu"}>
                <IconButton
                    className={"action-button edit-button"}
                    aria-label={"Edit component"}
                    fontSize={"0.75em"}
                    icon={<EditIcon />}
                    size={"xs"}
                    onClick={handleEdit}
                />
                <IconButton
                    className={"action-button details-button"}
                    aria-label={"Edit component"}
                    fontSize={"0.75em"}
                    icon={<InfoOutlineIcon />}
                    size={"xs"}
                    onClick={handleDetails}
                />
                <IconButton
                    className={"action-button delete-button"}
                    aria-label={"Edit component"}
                    fontSize={"0.75em"}
                    icon={<DeleteIcon />}
                    size={"xs"}
                    onClick={handleDelete}
                />
            </div>

            <div className={"tooltip-wrapper"}>
                {
                    detailsVisible ? <CanvasNodeInfoTooltip imgSrc={data.imgSrc} componentName={data.componentName} tags={data.tags} description={data.description} /> : <></>
                }
            </div>
        </div>
    );
}