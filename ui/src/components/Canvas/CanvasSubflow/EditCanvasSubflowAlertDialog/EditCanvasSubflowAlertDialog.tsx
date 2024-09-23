import React, {useEffect, useRef, useState} from "react";
import "./EditCanvasSubflowAlertDialog.scss";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Input
} from "@chakra-ui/react";
import {SubflowColor} from "../../../../interfaces";
import {useReactFlow} from "@xyflow/react";
import {useHistory} from "../../../../contexts/HistoryContext";

interface EditCanvasSubflowAlertDialogProps {
    nodeId: string,
    isEditOpen: boolean,
    onEditClose: () => void;
}

export const EditCanvasSubflowAlertDialog = (props: EditCanvasSubflowAlertDialogProps) => {
    const cancelRef = useRef();
    const { setNodes, getNode, getNodes, getEdges } = useReactFlow();
    // @ts-ignore
    const { addToHistory } = useHistory();

    const colors: SubflowColor[] = [SubflowColor.GREEN, SubflowColor.BLUE, SubflowColor.RED, SubflowColor.PURPLE];

    const getColorCode = (c: SubflowColor): string => {
        switch (c) {
            case SubflowColor.GREEN:
                return "g";
            case SubflowColor.BLUE:
                return "b";
            case SubflowColor.RED:
                return "r";
            case SubflowColor.PURPLE:
                return "p";
        }
    }

    const [newSubflowName, setNewSubflowName] = useState<string>("");
    const [newSubflowColor, setNewSubflowColor] = useState<SubflowColor>(SubflowColor.GREEN);

    useEffect(() => {
        if (props.isEditOpen) {
            setNewSubflowName(getNode(props.nodeId).data.title as string);
            setNewSubflowColor(getNode(props.nodeId).data.colorScheme as SubflowColor);
        }
    }, [props.isEditOpen]);

    const handleEditSubflowNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewSubflowName(event.target.value as string);
    const handleEditSave = () => {
        if (newSubflowName !== getNode(props.nodeId).data.title as string || newSubflowColor !== getNode(props.nodeId).data.colorScheme as SubflowColor) {
            addToHistory(getNodes(), getEdges());
            setNodes(nodes => nodes.map(node => node.id !== props.nodeId ? node : {
                ...node,
                data: {
                    ...node.data,
                    title: newSubflowName,
                    colorScheme: newSubflowColor,
                }
            }));
        }
        props.onEditClose();
    }

    const handleOnClose = () => {
        setNewSubflowColor(getNode(props.nodeId).data.colorScheme as SubflowColor);
        props.onEditClose();
    }

    return (
        <AlertDialog
            isOpen={props.isEditOpen}
            leastDestructiveRef={cancelRef}
            onClose={handleOnClose}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent bg={"#1E1E1E"}>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Edit subflow
                    </AlertDialogHeader>
                    <AlertDialogBody style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}>
                        <div className={"edit-canvas-subflow-content"}>
                            <div className={"checkbox-container"}>
                                {
                                    colors.map((item) => <div
                                        className={`checkbox ${getColorCode(item)} ${newSubflowColor === item ? "visible" : ""}`}
                                        onClick={() => setNewSubflowColor(item)}
                                    />)
                                }
                            </div>
                            <div className={"title-input-container"}>
                                <p className={"p2"}>Subflow name *</p>
                                <Input
                                    maxLength={20} placeholder={"SQL Database"}
                                    onChange={handleEditSubflowNameChange}
                                    defaultValue={getNode(props.nodeId).data.title as string}
                                />
                            </div>
                        </div>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={handleOnClose}>
                            Cancel
                        </Button>
                        <Button isDisabled={newSubflowName.trim().length === 0} ml={3} colorScheme={"telegram"}
                                onClick={handleEditSave}>
                            Save
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}