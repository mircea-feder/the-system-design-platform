import React, {useRef} from "react";
import "./NoFilesOpen.scss";
import {useToast} from "@chakra-ui/react";

interface NoFilesOpenProps {
    isCreateNewFileOpen: boolean;
    onCreateNewFileOpen: () => void;
}

export const NoFilesOpen = (props: NoFilesOpenProps) => {
    const fileInputRef = useRef(null);
    const toast = useToast();

    const handleOpenFile = () => fileInputRef.current.click();

    const handleCreateNewFile = () => {
        if (!props.isCreateNewFileOpen)
            props.onCreateNewFileOpen();
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const fileName = file.name;

            // Check if the file name already exists in localStorage
            if (localStorage.getItem(fileName)) {
                toast({
                    title: "File already exists.",
                    description: `The file "${fileName}" has already been uploaded.`,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                // Clear the file input value to allow re-uploading the same file
                event.target.value = null;
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonContent = JSON.parse(e.target.result as string);

                    // Validate the JSON structure
                    if (
                        !jsonContent.hasOwnProperty('nodes') ||
                        !jsonContent.hasOwnProperty('edges') ||
                        !Array.isArray(jsonContent.nodes) ||
                        !Array.isArray(jsonContent.edges) ||
                        Object.keys(jsonContent).length !== 2
                    ) {
                        throw new Error('Invalid JSON structure. JSON must have only "nodes" and "edges" keys, both being arrays.');
                    }

                    // Store the validated JSON in localStorage with the file name as the key
                    localStorage.setItem(fileName, JSON.stringify(jsonContent));
                    localStorage.setItem(fileName + "_timestamp", Date.now().toString());
                    window.dispatchEvent(new Event('local-storage-change'));
                    console.log('JSON content successfully stored:', jsonContent);

                } catch (error) {
                    console.error('Error processing JSON:', error);
                    toast({
                        title: "Invalid JSON file.",
                        description: error.message,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            };
            reader.readAsText(file);

            event.target.value = null;
        }
    };

    return (
        <div className="no-files-open">
            <div className={"actions-menu-nfo"}>
                <div className={"actions-button"} onClick={handleCreateNewFile}>
                    <img src={"add-folder.png"} alt="cannot load img"/>
                    <p className={"p2"}>Create a new file</p>
                </div>
                <div className={"actions-button"} onClick={handleOpenFile}>
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
        </div>
    );
}