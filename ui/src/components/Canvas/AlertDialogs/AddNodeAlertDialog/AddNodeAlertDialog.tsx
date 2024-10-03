import React, {useEffect, useRef, useState} from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay, Button,
    Divider,
    Input, Textarea
} from "@chakra-ui/react";
import "./AddNodeAlertDialog.scss"
import {DesignComponentCardProps} from "../../../../interfaces";
import {useReactFlow, XYPosition} from "@xyflow/react";
import {useHistory} from "../../../../contexts/HistoryContext";

interface AddComponentAlertDialogProps {
    id: string,
    nodeData: DesignComponentCardProps,
    pos: XYPosition,
    isAddComponentOpen: boolean,
    onAddComponentClose: () => void,
}

export const AddNodeAlertDialog = (props: AddComponentAlertDialogProps) => {
    const cancelRef = useRef();
    const { setNodes, getNodes, getEdges } = useReactFlow();

    const [nodeName, setNodeName] = useState("");
    const [nodeDescription, setNodeDescription] = useState("");

    useEffect(() => {
        if (props.isAddComponentOpen) {
            setNodeName("");
            setNodeDescription("");
        }
    }, [props.isAddComponentOpen]);

    // @ts-ignore
    const { addToHistory } = useHistory();

    const handleSave = () => {
        addToHistory(getNodes(), getEdges());
        setNodes((nodes) => [
            ...nodes,
            {
                id: props.id,
                type: 'canvasNode',
                position: {
                    x: Math.floor(props.pos.x / 12) * 12,
                    y: Math.floor(props.pos.y / 12) * 12,
                },
                selected: false,
                data: {
                    imgSrc: props.nodeData.imgSrc,
                    componentName: props.nodeData.componentName,
                    tags: props.nodeData.tags,
                    name: nodeName,
                    description: nodeDescription,
                }
            }
        ]);
        props.onAddComponentClose();
    }

    const handleEditNodeName = (ev: React.ChangeEvent<HTMLInputElement>) => setNodeName(ev.target.value);
    const handleEditNodeDescription = (ev: React.ChangeEvent<HTMLTextAreaElement>) => setNodeDescription(ev.target.value);

    return(
        <AlertDialog
            isOpen={props.isAddComponentOpen}
            leastDestructiveRef={cancelRef}
            onClose={props.onAddComponentClose}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent bg={"#1E1E1E"}>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Add node
                    </AlertDialogHeader>
                    <AlertDialogBody style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}>
                        <div className={"component-to-add"}>
                            <img src={props.nodeData.imgSrc} alt={"cannot load img"}/>
                            <p className={"h2"}>{props.nodeData.componentName}</p>
                            <p className={"p2"}>{props.nodeData.tags.join(", ")}</p>
                            <Divider />
                        </div>
                        <div className={"add-dialog-content"}>
                            <p className={"p1"}>Node name *</p>
                            <Input
                                maxLength={20} placeholder={props.nodeData.componentName}
                                onChange={handleEditNodeName}
                                defaultValue={""}
                            />
                            <p className={"p1"} style={{marginTop: "8px"}}>Description</p>
                            <Textarea
                                className={"custom-scrollbar"}
                                onChange={handleEditNodeDescription}
                                defaultValue={""}
                                contentEditable={"true"}
                                resize={"vertical"} size={"sm"}
                                maxLength={400}
                                placeholder={"Node descriptions provide a detailed explanation of the component"}  />
                        </div>
                        <Divider />
                        <p className={"p3"} style={{ width: '100%', textAlign: "center" }}>You will be able to edit this information in the future</p>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={props.onAddComponentClose}>
                            Cancel
                        </Button>
                        <Button isDisabled={nodeName.trim().length === 0} ml={3} colorScheme={"telegram"} onClick={handleSave}>
                            Save
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}