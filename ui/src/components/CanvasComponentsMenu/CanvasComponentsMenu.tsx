import React from "react";
import "./CanvasComponentsMenu.scss"
import {Divider, Input} from "@chakra-ui/react";
import {CanvasComponentCard} from "./CanvasComponentCard/CanvasComponentCard";
import {aws} from "./DesignComponents";
import {CanvasSubflowCard} from "./CanvasSubflowComponentCard/CanvasSubflowCard";

export const CanvasComponentsMenu = () => {
    return (
        <div className="canvas-components-menu">
            <p className="h1">Components</p>
            <div className="filter-container">
                <p className={"p2"}>Filtering</p>
                <Input placeholder='Load balancer' size="sm" maxLength={40} />
            </div>
            <Divider/>
            <div className="components-modules-wrapper custom-scrollbar">
                <div className="components-module subflow-module">
                    <p className={"h2"}>Subflow</p>
                    <CanvasSubflowCard />
                </div>
                <div className="components-module generic-module">
                    <p className={"h2"}>Generic</p>
                </div>
                <div className="components-module">
                    <p className={"h2"}>AWS</p>
                    <div className="components-submodule aws-analytics">
                        <p className={"h3"}>Analytics</p>
                        <div className={"components-list"}>
                            {
                                aws.analytics.map((item) => (
                                    <CanvasComponentCard imgSrc={item.imgSrc} componentName={item.componentName}
                                                         tags={item.tags}/>
                                ))
                            }
                            {
                                aws.analytics.map((item) => (
                                    <CanvasComponentCard imgSrc={item.imgSrc} componentName={item.componentName}
                                                         tags={item.tags}/>
                                ))
                            }
                            {
                                aws.analytics.map((item) => (
                                    <CanvasComponentCard imgSrc={item.imgSrc} componentName={item.componentName}
                                                         tags={item.tags}/>
                                ))
                            }
                        </div>
                    </div>
                    <div className="components-submodule aws-compute">
                        <p className={"h3"}>Compute</p>
                        <div className={"components-list"}>
                            {
                                aws.compute.map((item) => (
                                    <CanvasComponentCard imgSrc={item.imgSrc} componentName={item.componentName}
                                                         tags={item.tags}/>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="components-module gcp-module">
                    <p className={"h2"}>GCP</p>
                </div>
                <div className="components-module azure-module">
                    <p className={"h2"}>Azure</p>
                </div>
            </div>
        </div>
    );
}