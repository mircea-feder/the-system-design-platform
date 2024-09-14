import React from 'react';
import "./DesignComponentCard.scss"
import {DesignComponentCardProps} from "../../../interfaces";

export const DesignComponentCard = (props: DesignComponentCardProps) => {
    return (
        <div className="design-component-card">
            <img src={props.imgSrc} alt="failed to load img" />
            <div className="name-tags-container">
                <p className="p1">{props.componentName}</p>
                {
                    (props.tags.length > 0) ? (
                        <div className="tags-wrapper">
                            {
                                props.tags.map((tag, i) => (
                                    <p className="p3" key={i}>{tag}</p>
                                ))
                            }
                        </div>
                    ) : <></>
                }
            </div>
        </div>
    );
}