import React, {useRef} from "react";
import "./NewFileAlertDialog.scss";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogOverlay, CloseButton, useToast
} from "@chakra-ui/react";

interface NewFileAlertDialogProps {
    isNewFileOpen: boolean;
    onNewFileClose: () => void;
    isCreateNewFileOpen: boolean;
    onCreateNewFileOpen: () => void;
}

export const NewFileAlertDialog = (props: NewFileAlertDialogProps) => {
    const cancelRef = useRef();
    const fileInputRef = useRef(null);
    const toast = useToast();

    const handleOpenFile = () => fileInputRef.current.click();

    const handleCreateNewFile = () => {
        if (!props.isCreateNewFileOpen)
            props.onCreateNewFileOpen();
        props.onNewFileClose();
    }

    const handleFileChange = (ev) => {
        const file = ev.target.files[0];

        if (file) {
            const fileName = file.name;

            if (localStorage.getItem(fileName)) {
                toast({
                    title: "File already exists.",
                    description: `The file "${fileName}" has already been uploaded.`,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                ev.target.value = null;
                props.onNewFileClose();
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonContent = JSON.parse(e.target.result as string);

                    if (
                        !jsonContent.hasOwnProperty('nodes') ||
                        !jsonContent.hasOwnProperty('edges') ||
                        !Array.isArray(jsonContent.nodes) ||
                        !Array.isArray(jsonContent.edges) ||
                        Object.keys(jsonContent).length !== 2
                    ) {
                        throw new Error('Invalid JSON structure. JSON must have only "nodes" and "edges" keys, both being arrays');
                    }

                    localStorage.setItem(fileName, JSON.stringify(jsonContent));
                    localStorage.setItem(fileName + "_timestamp", Date.now().toString());
                    window.dispatchEvent(new Event('local-storage-change'));
                    toast({
                        title: "File loaded successfully",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                } catch (error) {
                    toast({
                        title: "Invalid JSON file",
                        description: error.message,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                    props.onNewFileClose();
                }
            };
            reader.readAsText(file);

            ev.target.value = null;
            props.onNewFileClose();
        }
    };

    return (
        <AlertDialog
            isCentered
            leastDestructiveRef={cancelRef}
            isOpen={props.isNewFileOpen}
            onClose={props.onNewFileClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent className={"new-file-alert-dialog"} bg={"#1E1E1E"}>
                    <AlertDialogHeader id={"header"} fontSize={"lg"} fontWeight={"bold"}>
                        <p className={"h3"}>Add new diagram</p>
                        <CloseButton ref={cancelRef} onClick={props.onNewFileClose} />
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <div className={"actions-menu-nfo"}>
                            <div className={"action-button"} onClick={handleCreateNewFile}>
                                <img src={"add-folder.png"} alt="cannot load img"/>
                                <p className={"p2"}>Create a new file</p>
                            </div>
                            <div className={"action-button"} onClick={handleOpenFile}>
                                <img src={"open-folder.png"} alt="cannot load img"/>
                                <p className={"p2"}>Open an existing file</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{display: 'none'}}
                                    accept="application/json"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}