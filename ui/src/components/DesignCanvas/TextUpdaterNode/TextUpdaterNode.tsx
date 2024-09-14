import React, {useCallback} from "react"
import "./TextUpdaterNode.scss"
import '@xyflow/react/dist/style.css'
import {Handle, Position} from "@xyflow/react";

const handleStyle = { left: 10 };

interface TextUpdaterProps {
    data: any;
    isConnectable: boolean;
}

export const TextUpdaterNode = (props: TextUpdaterProps) => {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);

    return (
        <div className="text-updater-node">
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={props.isConnectable}
            />
            <div>
                <label htmlFor="text">Text:</label>
                <input id="text" name="text" onChange={onChange} className="nodrag"/>
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                id="a"
                style={handleStyle}
                isConnectable={props.isConnectable}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                isConnectable={props.isConnectable}
            />
        </div>
    )
}