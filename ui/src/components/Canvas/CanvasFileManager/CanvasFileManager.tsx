import React from "react";
import "./CanvasFileManager.scss";
import {IconButton, Tab, TabList, Tabs} from "@chakra-ui/react";
import {SmallCloseIcon, SmallAddIcon} from "@chakra-ui/icons";

export const CanvasFileManager = () => {
    const handleCloseIconClick = () => {

    }

    const handleAddIconClick = () => {}

    return (
        <Tabs variant={"enclosed"} className={'canvas-file-manager'} size={"sm"}>
            <TabList>
                <Tab>
                    <p className={"p2"}>One</p>
                    <SmallCloseIcon onClick={handleCloseIconClick} />
                </Tab>
                <Tab>
                    <p className={"p2"}>regnology regnology regnology regnology regnology regnology regnology regnology regnology regnology regnology .json</p>
                    <SmallCloseIcon onClick={handleCloseIconClick}/>
                </Tab>
                <IconButton
                    className={"add-button"}
                    size={"xs"}
                    aria-label='Call Sage'
                    fontSize='0.9em'
                    onClick={handleAddIconClick}
                    icon={<SmallAddIcon />}
                />
                <div className={"right-spacer"}>
                    X
                </div>
            </TabList>
        </Tabs>
    );
}