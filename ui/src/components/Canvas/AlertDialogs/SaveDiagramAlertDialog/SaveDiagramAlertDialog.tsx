import React, {useRef} from "react";
import "./SaveDiagramAlertDialog.scss";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogOverlay, CloseButton
} from "@chakra-ui/react";
import {getNodesBounds, getViewportForBounds, useReactFlow} from "@xyflow/react";
import {toPng} from "html-to-image";
import {useWindowSize} from "react-use";

interface SaveDiagramAlertDialog {
    isSaveDiagramOpen: boolean;
    onSaveDiagramClose: () => void;
    selectedFileName: string
}

export const SaveDiagramAlertDialog = (props: SaveDiagramAlertDialog) => {
    const { width, height } = useWindowSize();
    const cancelRef = useRef();
    const { getNodes, fitView, setNodes, setEdges} = useReactFlow();

    const handleDownloadJson = () => {
        const fileContent = localStorage.getItem(props.selectedFileName);

        if (fileContent) {
            const fileBlob = new Blob([fileContent], { type: 'application/json' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(fileBlob);
            link.download = props.selectedFileName;

            link.click();

            URL.revokeObjectURL(link.href);
        } else {
            console.error('No file found in localStorage with the specified key:', props.selectedFileName);
        }

        props.onSaveDiagramClose();
    }

    const downloadImg = (dataUrl) => {
        const a = document.createElement('a');

        a.setAttribute('download', `${props.selectedFileName.slice(0, -5)}.png`);
        a.setAttribute('href', dataUrl);
        a.click();
    }

    const handleDownloadImg = () => {
        const imageWidth = width * 0.85;
        const imageHeight = height * 0.95;
        const nodesBounds = getNodesBounds(getNodes());

        setNodes((nodes) =>
            nodes.map((node) => ({
                ...node,
                selected: false,
            }))
        );

        setEdges((edges) =>
            edges.map((edge) => ({
                ...edge,
                selected: false,
            }))
        );

        // @ts-ignore
        const viewport = getViewportForBounds(
            nodesBounds,
            imageWidth,
            imageHeight,
            0.5,
            2,
        );

        fitView({duration: 0})
            // @ts-ignore
            .then(r => toPng(document.querySelector('.react-flow__viewport'), {
                backgroundColor: '#141414',
                width: imageWidth,
                height: imageHeight,
                style: {
                    width: imageWidth,
                    height: imageHeight,
                    transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
                },
            }).then(downloadImg));

        props.onSaveDiagramClose();
    }

    return (
        <AlertDialog
            isOpen={props.isSaveDiagramOpen}
            onClose={props.onSaveDiagramClose}
            isCentered
            leastDestructiveRef={cancelRef}
        >
            <AlertDialogOverlay>
                <AlertDialogContent className={"save-diagram-alert-dialog"} bg={"#1E1E1E"}>
                    <AlertDialogHeader id={"header"} fontSize={"lg"} fontWeight={"bold"}>
                        <p className={"h3"}>Save diagram</p>
                        <CloseButton ref={cancelRef} onClick={props.onSaveDiagramClose} />
                    </AlertDialogHeader>
                    <AlertDialogBody style={{
                        display: "flex",
                        gap: "64px",
                        justifyContent: "center",
                    }}>
                        <div className={"download-button"} draggable={false} onClick={handleDownloadJson}>
                            <img src={"download-json.png"} draggable={false} alt={""}/>
                            <p className={"p2"}>Download JSON</p>
                        </div>
                        <div className={"download-button"} draggable={false} onClick={handleDownloadImg}>
                            <img src={"download-img.png"} draggable={false} alt={""}/>
                            <p className={"p2"}>Download PNG</p>
                        </div>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}