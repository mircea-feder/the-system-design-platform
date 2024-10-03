import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './CanvasFlowProvider.scss';
import { CanvasFlow } from '../CanvasFlow/CanvasFlow';
import { HistoryProvider } from '../../../contexts/HistoryContext';
import { CanvasFileManager } from '../CanvasFileManager/CanvasFileManager';
import {NoFilesOpen} from "../NoFilesOpen/NoFilesOpen";
import {useDisclosure} from "@chakra-ui/react";
import {NewFileAlertDialog} from "../AlertDialogs/NewFileAlertDialog/NewFileAlertDialog";
import {CreateNewFileAlertDialog} from "../AlertDialogs/CreateNewFileAlertDialog/CreateNewFileAlertDialog";


// Function to get all JSON keys from localStorage
const getAllKeysFromLocalStorage = (): string[] => {
    const keys: string[] = [];
    const keysTs: { [key: string]: number } = {};

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) as string;

        if (key.endsWith(".json")) {
            keys.push(key);
        } else if (key.endsWith("_timestamp")) {
            const baseKey = key.split("_")[0];
            keysTs[baseKey] = Number.parseInt(localStorage.getItem(key) || "0");
        }
    }

    return keys.sort((a, b) => (keysTs[a] || 0) - (keysTs[b] || 0));
};


export const CanvasFlowProvider = () => {
    const initialFiles = getAllKeysFromLocalStorage();
    const [openedFiles, setOpenedFiles] = useState<string[]>(getAllKeysFromLocalStorage());
    const { isOpen: isNewFileOpen, onOpen: onNewFileOpen, onClose: onNewFileClose } = useDisclosure();
    const { isOpen: isCreateNewFileOpen, onOpen: onCreateNewFileOpen, onClose: onCreateNewFileClose } = useDisclosure();
    const [selectedFileName, setSelectedFileName] = useState<string>(initialFiles[initialFiles.length - 1]);

    useEffect(() => {
        const updateOpenedFiles = () => {
            const keys: string[] = getAllKeysFromLocalStorage();
            setSelectedFileName(keys[keys.length - 1]);
            setOpenedFiles(keys);
        }

        window.addEventListener('storage', updateOpenedFiles);
        window.addEventListener('local-storage-change', updateOpenedFiles);

        return () => {
            window.removeEventListener('storage', updateOpenedFiles);
            window.removeEventListener('local-storage-change', updateOpenedFiles);
        };
    }, []);

    return (
        <div className="canvas-flow-provider">
            {
                openedFiles.length === 0
                    ? <NoFilesOpen
                        isCreateNewFileOpen={isCreateNewFileOpen}
                        onCreateNewFileOpen={onCreateNewFileOpen}
                    />
                    : <ReactFlowProvider>
                    <CanvasFileManager
                        openedFiles={openedFiles}
                        onNewFileOpen={onNewFileOpen}
                        setSelectedFileName={setSelectedFileName}
                    />
                    <HistoryProvider>
                        <div className="canvas-flow-wrapper">
                            <CanvasFlow
                                selectedFileName={selectedFileName}
                            />
                        </div>
                    </HistoryProvider>
                </ReactFlowProvider>
            }
            <NewFileAlertDialog
                isNewFileOpen={isNewFileOpen}
                onNewFileClose={onNewFileClose}
                isCreateNewFileOpen={isCreateNewFileOpen}
                onCreateNewFileOpen={onCreateNewFileOpen}
            />
            <CreateNewFileAlertDialog
                isCreateNewFileOpen={isCreateNewFileOpen}
                onCreateNewFileClose={onCreateNewFileClose}
            />
        </div>
    );
};
