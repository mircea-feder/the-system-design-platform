import React from "react";
import "./CanvasNodeInfoTooltip.scss"
import {Divider} from "@chakra-ui/react";

interface CanvasNodeInfoTooltipProps {
    imgSrc: string;
    componentName: string;
    tags: string[];
    description?: string;
}

export const CanvasNodeInfoTooltip = (props: CanvasNodeInfoTooltipProps) => {
    return (
        <div className="canvas-node-info-tooltip">
            <div className="container">
                <div className="title-container">
                    <p className={"h2"}>Component</p>
                    <Divider />
                </div>
                <div className="component-info">
                    <img src={props.imgSrc} alt={"cannot load img"} />
                    <div>
                        <p className={"h3"}>{props.componentName}</p>
                        {
                            (props.tags.length > 0) ? <div className={"tags-wrapper"}>
                                {
                                    props.tags.map(tag => <p className={"p3"}>{tag}</p>)
                                }
                            </div> : <></>
                        }
                    </div>
                </div>
            </div>
            {
                props.description ? <div className={"container"}>
                    <div className="title-container">
                        <p className={"h2"}>Description</p>
                        <Divider/>
                    </div>
                    <p className={"p3"}>{props.description}</p>
                </div> : <></>
            }
        </div>
    );
}