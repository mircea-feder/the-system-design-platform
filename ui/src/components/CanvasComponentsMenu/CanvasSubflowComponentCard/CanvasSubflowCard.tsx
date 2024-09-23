import React from "react";
import "./CanvasSubflowCard.scss"

export const CanvasSubflowCard = () => {
    const handleDragStart = (event) => event.dataTransfer.setData("text/plain", "{}");

    return (
        <div className="canvas-subflow-card" draggable onDragStart={handleDragStart}>
            <div className="canvas-subflow-icon">
                <p className={"p1"}>Subflow</p>
            </div>
        </div>
    );
}