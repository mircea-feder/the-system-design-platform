import React from "react";
import "./DesignComponentsMenu.scss"
import {Input} from "@chakra-ui/react";
import {DesignComponentCard} from "./DesignComponentCard/DesignComponentCard";
import {aws} from "./DesignComponents";

export const DesignComponentsMenu = () => {
    return (
        <div className="design-components-menu">
            <p className="h1">Components</p>
            <div className="filter-container">
                <p className={"p2"}>Filtering</p>
                <Input placeholder='Load balancer' size="sm" maxLength={40} />
            </div>
            <div className="components-modules-wrapper">
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
                                    <DesignComponentCard imgSrc={item.imgSrc} componentName={item.componentName}
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
                                    <DesignComponentCard imgSrc={item.imgSrc} componentName={item.componentName}
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