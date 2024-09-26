import React, {useEffect, useState} from "react";
import "./CanvasComponentsMenu.scss"
import {
    Accordion,
    AccordionButton, AccordionIcon,
    AccordionItem,
    AccordionPanel,
    CircularProgress,
    Divider,
    Input
} from "@chakra-ui/react";
import {CanvasComponentCard} from "./CanvasComponentCard/CanvasComponentCard";
import {nodeComponents} from "./NodeComponents";
import {CanvasSubflowCard} from "./CanvasSubflowComponentCard/CanvasSubflowCard";
import {DesignComponentCardProps} from "../../interfaces";

export const CanvasComponentsMenu = () => {
    const [nodes, setNodes] = useState<any>(null);
    const [filtering, setFiltering] = useState<string>("");

    useEffect(() => {
        if (filtering === "") {
            setNodes(nodeComponents);
        } else {
            const filteredNodes = Object.keys(nodeComponents).reduce((result, moduleKey) => {
                const filteredSubmodules = Object.keys(nodeComponents[moduleKey]).reduce((subResult, submoduleKey) => {
                    // Filter components within each submodule
                    const filteredComponents = nodeComponents[moduleKey][submoduleKey].filter(component =>
                        component.componentName.toLowerCase().includes(filtering.toLowerCase()) ||
                        component.tags.some(tag => tag.toLowerCase().includes(filtering.toLowerCase()))
                    );

                    // If the submodule has filtered components, add it to the result
                    if (filteredComponents.length > 0) {
                        subResult[submoduleKey] = filteredComponents;
                    }

                    return subResult;
                }, {});

                // If the module has submodules with filtered components, add it to the result
                if (Object.keys(filteredSubmodules).length > 0) {
                    result[moduleKey] = filteredSubmodules;
                }

                return result;
            }, {});

            setNodes(filteredNodes);
        }
    }, [filtering]);


    const handleEditFiltering = (ev: React.ChangeEvent<HTMLInputElement>) => setFiltering(ev.target.value);

    const createArray = (num: number): number[] => {
        const numbers = [];
        for (let i = 0; i < num; i++)
            numbers.push(i);
        return numbers;
    }

    return (
        <div className="canvas-components-menu">
            <p className="h1">Components</p>
            <div className="filter-container">
                <p className={"p2"}>Filtering</p>
                <Input placeholder='Load balancer' size="sm" maxLength={40} defaultValue={""} onChange={handleEditFiltering} />
            </div>
            <Divider/>
            <div className="components-modules-wrapper custom-scrollbar">
                <div className="components-module subflow-module">
                    <p className={"h2"}>Subflow</p>
                    <CanvasSubflowCard />
                </div>
                {
                    !nodes
                        ? <CircularProgress isIndeterminate alignSelf={"center"} />
                        : Object.keys(nodes).length === 0
                            ? <p className={"p2 max-width-center"}>No nodes match your filtering condition</p>
                            : <>
                        {
                            Object.keys(nodes).map((module) => (
                                // @ts-ignore
                                <Accordion defaultIndex={!nodes ? [] : createArray(Object.keys(nodes).length)} allowMultiple key={module}>
                                    <div className={"components-module"}>
                                        <AccordionItem key={module}>
                                            <AccordionButton>
                                                <p className={"h2"}>{module.toUpperCase()}</p>
                                                <AccordionIcon />
                                            </AccordionButton>
                                            <AccordionPanel>
                                                {
                                                    Object.keys(nodes[module]).map((submodule) => (
                                                        <Accordion allowMultiple key={submodule}>
                                                            <div key={`${module}-${submodule}`} className={"components-submodule"}>
                                                                <AccordionItem>
                                                                    <AccordionButton>
                                                                        <p className={"h3"}>{submodule.charAt(0).toUpperCase() + submodule.slice(1)}</p>
                                                                        <AccordionIcon />
                                                                    </AccordionButton>
                                                                    <AccordionPanel>
                                                                        <div className={"components-list"}>
                                                                        {
                                                                            nodes[module][submodule].map((canvasComponent: DesignComponentCardProps) => (
                                                                                <CanvasComponentCard
                                                                                    imgSrc={canvasComponent.imgSrc}
                                                                                    componentName={canvasComponent.componentName}
                                                                                    tags={canvasComponent.tags}
                                                                                />
                                                                            ))
                                                                        }
                                                                        </div>
                                                                    </AccordionPanel>
                                                                </AccordionItem>
                                                            </div>
                                                        </Accordion>
                                                    ))
                                                }
                                            </AccordionPanel>
                                        </AccordionItem>
                                    </div>
                                </Accordion>
                            ))
                        }
                        </>
                }
            </div>
        </div>
    );
}