import React, {useRef, useState} from "react";
import "./CreateNewFileAlertDialog.scss";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay, Button, Input
} from "@chakra-ui/react";

interface CreateNewFileAlertDialogProps {
    isCreateNewFileOpen: boolean,
    onCreateNewFileClose: () => void;
}

export const CreateNewFileAlertDialog = (props: CreateNewFileAlertDialogProps) => {
    const cancelRef = useRef();
    const [fileName, setFileName] = useState<string>('');
    const handleEditFileName = (ev: React.ChangeEvent<HTMLInputElement>) => setFileName(ev.target.value);

    const handleCreateNewFile = () => {
        localStorage.setItem(fileName + ".json", JSON.stringify({
            nodes: [],
            edges: []
        }));
        localStorage.setItem(fileName + ".json_timestamp", Date.now().toString());
        window.dispatchEvent(new Event('local-storage-change'));
        props.onCreateNewFileClose();
    }

    return (
        <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={props.isCreateNewFileOpen}
            onClose={props.onCreateNewFileClose}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent bg={"#1E1E1E"}>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Create new diagram file
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <div>
                            <Input
                                maxLength={40} placeholder={"my-diagram"}
                                onChange={handleEditFileName}
                                defaultValue={""}
                            />
                        </div>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={props.onCreateNewFileClose}>
                            Cancel
                        </Button>
                        <Button isDisabled={fileName.trim().length === 0} ml={3}
                                colorScheme={"telegram"} onClick={handleCreateNewFile}>
                            Save
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}