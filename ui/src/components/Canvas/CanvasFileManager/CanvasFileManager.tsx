import React, { useState, useEffect } from "react";
import "./CanvasFileManager.scss";
import { IconButton, Tab, TabList, Tabs } from "@chakra-ui/react";
import { SmallCloseIcon, SmallAddIcon } from "@chakra-ui/icons";

interface CanvasFileManagerProps {
    openedFiles: string[],
    onNewFileOpen: () => void,
    setSelectedFileName: React.Dispatch<React.SetStateAction<string>>
}

export const CanvasFileManager = (props: CanvasFileManagerProps) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);

    const handleCloseFile = (fileName: string) => {
        localStorage.removeItem(fileName);
        localStorage.removeItem(fileName + "_timestamp");
        window.dispatchEvent(new Event('local-storage-change'));
    };

    // Effect to update the selected tab index when openedFiles change
    useEffect(() => {
        if (props.openedFiles.length > 0) {
            setSelectedTabIndex(props.openedFiles.length - 1); // Select the last tab
        } else {
            setSelectedTabIndex(0); // Reset to the first tab if no files are open
        }
    }, [props.openedFiles]);

    // Handle tab selection changes
    const handleTabChange = (index: number) => {
        setSelectedTabIndex(index);
        props.setSelectedFileName(props.openedFiles[index]);
    }

    return (
        <Tabs
            variant="enclosed"
            className="canvas-file-manager"
            size="sm"
            index={selectedTabIndex}
            onChange={handleTabChange}
        >
            <TabList>
                {props.openedFiles.map((file) => (
                    <Tab key={file}>
                        <p className="p2">{file}</p>
                        <SmallCloseIcon onClick={() => handleCloseFile(file)} />
                    </Tab>
                ))}
                <IconButton
                    className="add-button"
                    size="xs"
                    aria-label="Add File"
                    fontSize="0.9em"
                    onClick={props.onNewFileOpen}
                    icon={<SmallAddIcon />}
                />
                <div className="right-spacer">X</div>
            </TabList>
        </Tabs>
    );
};
