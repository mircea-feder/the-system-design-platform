import React from 'react';
import "./CanvasComponentCard.scss"
import {DesignComponentCardProps} from "../../../interfaces";

export const CanvasComponentCard = (props: DesignComponentCardProps) => {
    const handleDragStart = (event) => event.dataTransfer.setData("text/plain", JSON.stringify(props));

    return (
        <div className="canvas-component-card" draggable onDragStart={handleDragStart}>
            <img src={props.imgSrc} alt="failed to load img" draggable={false} />
            <p className="p1 component-name">{props.componentName}</p>
            {
                props.tags.length > 0 ? (
                    <p className="p3 tags">{props.tags.join(', ')}</p>
                ) : <></>
            }
        </div>
    );
}