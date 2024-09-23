import React, {useEffect, useRef, useState} from "react";
import "./AddSubflowAlertDialog.scss";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Divider,
    Input
} from "@chakra-ui/react";
import {SubflowColor} from "../../../../interfaces";
import {useReactFlow, XYPosition} from "@xyflow/react";
import {useHistory} from "../../../../contexts/HistoryContext";

interface AddSubflowAlertDialogProps {
    id: string,
    pos: XYPosition,
    isAddSubflowOpen: boolean,
    onAddSubflowClose: () => void,
}

export const AddSubflowAlertDialog = (props: AddSubflowAlertDialogProps) => {
    const cancelRef = useRef();
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

    const { setNodes, getNodes, getEdges } = useReactFlow();
    // @ts-ignore
    const { addToHistory } = useHistory();

    const [subflowName, setSubflowName] = useState("");
    const [subflowColor, setSubflowColor] = useState<SubflowColor>(SubflowColor.GREEN);

    const handleOnClose = () => {
        setSubflowColor(SubflowColor.GREEN);
        props.onAddSubflowClose();
    }

    useEffect(() => {
        if (props.isAddSubflowOpen) {
            setSubflowName("");
            setSubflowColor(SubflowColor.GREEN);
        }
    }, [props.isAddSubflowOpen])

    const handleSave = () => {
        addToHistory(getNodes(), getEdges());
        setNodes(nodes => [
            ...nodes,
            {
                id: props.id,
                type: 'canvasSubflow',
                position: {
                    x: Math.floor(props.pos.x / 12) * 12,
                    y: Math.floor(props.pos.y / 12) * 12,
                },
                selected: false,
                data: {
                    colorScheme: subflowColor,
                    title: subflowName,
                },
            }
        ]);
        handleOnClose();
    }

    const handleEditSubflowName = (ev: React.ChangeEvent<HTMLInputElement>) => setSubflowName(ev.target.value);

    return (
        <AlertDialog
            isOpen={props.isAddSubflowOpen}
            isCentered
            leastDestructiveRef={cancelRef}
            onClose={handleOnClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent bg={"#1E1E1E"}>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Add subflow
                    </AlertDialogHeader>
                    <AlertDialogBody style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}>
                        <div className={"add-subflow-content"}>
                            <div className={`subflow-imitation ${getColorCode(subflowColor)}`}>
                                <div className={"mini-node"}>
                                    <img src={"assets/images/aws-icons/analytics/aws_athena.png"}
                                         alt={"cannot load img"}/>
                                    <p className={"p2"}>Athena</p>
                                </div>
                                <div className={"mini-node"}>
                                    <img src={"assets/images/aws-icons/analytics/aws_athena.png"}
                                         alt={"cannot load img"}/>
                                    <p className={"p2"}>Athena</p>
                                </div>
                                <div className={"mini-node"}>
                                    <img src={"assets/images/aws-icons/analytics/aws_athena.png"}
                                         alt={"cannot load img"}/>
                                    <p className={"p2"}>Athena</p>
                                </div>
                            </div>
                            <div className={"checkbox-container"}>
                                {
                                    colors.map((item) => <div
                                        className={`checkbox ${getColorCode(item)} ${subflowColor === item ? "visible" : ""}`}
                                        onClick={() => setSubflowColor(item)}
                                    />)
                                }
                            </div>
                            <Divider />
                            <div style={{width:'100%'}}>
                                <p className={"p1"}>Subflow title *</p>
                                <Input
                                    maxLength={20} placeholder={"Server cluster"}
                                    onChange={handleEditSubflowName}
                                    defaultValue={""}
                                />
                            </div>
                            <Divider />
                            <p className={"p3"}>You will be able to edit this information in the future</p>
                        </div>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={handleOnClose}>
                            Cancel
                        </Button>
                        <Button isDisabled={subflowName.trim().length === 0} ml={3}
                                colorScheme={"telegram"} onClick={handleSave}>
                            Save
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}