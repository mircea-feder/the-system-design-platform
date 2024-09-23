import React, {useEffect, useRef, useState} from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay, Button,
    Input,
    Textarea
} from "@chakra-ui/react";
import "./EditCanvasNodeAlertDialog.scss"
import {useReactFlow} from "@xyflow/react";
import {useHistory} from "../../../../contexts/HistoryContext";

interface EditCanvasNodeAlertDialogProps {
    nodeId: string;
    isEditOpen: boolean,
    onEditClose: () => void;
}

export const EditCanvasNodeAlertDialog = (props: EditCanvasNodeAlertDialogProps) => {
    const cancelRef = useRef();
    const { setNodes, getNode, getNodes, getEdges } = useReactFlow();
    // @ts-ignore
    const { addToHistory } = useHistory();
    
    const [newNodeName, setNewNodeName] = useState("");
    const [newNodeDescription, setNewNodeDescription] = useState("");

    useEffect(() => {
        if (props.isEditOpen) {
            setNewNodeName(getNode(props.nodeId).data.name as string);
            setNewNodeDescription(getNode(props.nodeId).data.description as string);
        }
    }, [props.isEditOpen]);


    const handleEditNodeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewNodeName(event.target.value);
    const handleEditDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => setNewNodeDescription(event.target.value);

    const handleEditSave = () => {
        if (newNodeName !== getNode(props.nodeId).data.name as string ||
            newNodeDescription !== getNode(props.nodeId).data.description as string) {
            addToHistory(getNodes(), getEdges());
            setNodes((nodes) => nodes.map(node => node.id !== props.nodeId ? node : {
                ...node,
                data: {
                    ...node.data,
                    name: newNodeName,
                    description: newNodeDescription,
                }
            }));
        }
        props.onEditClose();
    }

    return (<AlertDialog
        isOpen={props.isEditOpen}
        leastDestructiveRef={cancelRef}
        onClose={props.onEditClose}
        isCentered
    >
        <AlertDialogOverlay>
            <AlertDialogContent bg={"#1E1E1E"}>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Edit node
                </AlertDialogHeader>
                <AlertDialogBody>
                    <div className={"edit-dialog-content"}>
                        <p className={"p2"}>Node name *</p>
                        <Input
                            maxLength={20} placeholder={"SQL Database"}
                            onChange={handleEditNodeNameChange}
                            defaultValue={getNode(props.nodeId).data.name as string}
                        />
                        <p className={"p2"} style={{marginTop: "8px"}}>Description</p>
                        <Textarea
                            className={"custom-scrollbar"}
                            onChange={handleEditDescriptionChange}
                            defaultValue={getNode(props.nodeId).data.description as string}
                            contentEditable={"true"}
                            resize={"vertical"} size={"sm"}
                            maxLength={400}
                            placeholder={"Node descriptions provide a detailed explanation of the component"}  />
                    </div>
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={props.onEditClose}>
                        Cancel
                    </Button>
                    <Button isDisabled={newNodeName.trim().length === 0} ml={3} colorScheme={"telegram"} onClick={handleEditSave}>
                        Save
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogOverlay>
    </AlertDialog>
    );
}