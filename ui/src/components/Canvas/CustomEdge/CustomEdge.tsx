import React, {useState} from "react";
import "./CustomEdge.scss"
import {
    BaseEdge,
    EdgeLabelRenderer,
    EdgeProps,
    getSmoothStepPath,
    useReactFlow
} from "@xyflow/react";
import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {
    Divider,
    IconButton, Input,
    Popover,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger, useDisclosure,
} from "@chakra-ui/react";
import {useHistory} from "../../../contexts/HistoryContext";

export const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    markerEnd,
    selected
}: EdgeProps) => {
    const { setEdges, getNodes, getEdges } = useReactFlow();
    const { isOpen, onOpen, onClose } = useDisclosure();
    // @ts-ignore
    const { addToHistory } = useHistory()

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const [newLabel, setNewLabel] = useState(data.label as string);
    const handleEditLabelInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => setNewLabel(ev.target.value);

    const handleDelete = (ev: React.MouseEvent) => {
        ev.stopPropagation();    // don't remove this line
        addToHistory(getNodes(), getEdges());
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    }

    const handleOnClose = () => {
        if (newLabel !== data.label as string) {
            addToHistory(getNodes(), getEdges());
            setEdges((edges) => edges.map(edge => edge.id !== id ? edge : {
                ...edge,
                data: {
                    ...edge.data,
                    label: newLabel
                }
            }));
        }
        onClose();
    }

    const handleEnterKeyPress = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === 'Enter')
            handleOnClose();
    };

    return (
        <>
            <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />
            <EdgeLabelRenderer>
                <>
                    {
                        selected ? <div className={"actions-menu"} style={{
                            position: 'absolute',
                            left: ` ${labelX + 8}px`,
                            top: `${labelY - 32}px`,
                            transform: 'translate(-50%, -50%)',
                        }}>
                            <Popover placement={"top"} isOpen={isOpen} onClose={handleOnClose}>
                                <PopoverTrigger>
                                    <IconButton
                                        className={"action-button edit-button"}
                                        aria-label={"Edit component"}
                                        fontSize={"0.75em"}
                                        icon={<EditIcon/>}
                                        size={"xs"}
                                        onClick={onOpen}
                                    />
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverCloseButton />
                                    <div className={"edit-label-wrapper"}>
                                        <p className={"h3"}>Edge label</p>
                                        <Divider />
                                        <Input
                                            placeholder='Add label value' size="sm" maxLength={40}
                                            defaultValue={data.label as string}
                                            onChange={handleEditLabelInputChange}
                                            onKeyDown={handleEnterKeyPress}
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <IconButton
                                className={"action-button delete-button"}
                                aria-label={"Edit component"}
                                fontSize={"0.75em"}
                                icon={<DeleteIcon/>}
                                size={"xs"}
                                onClick={handleDelete}
                            />
                        </div> : <></>
                    }
                    {
                        (data && data.label) ? <div className={"text-wrapper"} style={{
                            position: 'absolute',
                            left: `${labelX}px`, // Set X position
                            top: `${labelY}px`,  // Set Y position
                            transform: 'translate(-50%, -50%)', // Center the label over its X and Y positions
                            maxWidth: '200px',
                            textAlign: "center"
                        }}>
                            <p className={"p2"}>
                                {String(data?.label)}
                            </p>
                        </div> : <></>
                    }
                </>
            </EdgeLabelRenderer>
        </>
    );
}