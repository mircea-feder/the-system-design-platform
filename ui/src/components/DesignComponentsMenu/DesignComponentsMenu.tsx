import React from "react";
import "./DesignComponentsMenu.scss"

export const DesignComponentsMenu = () => {
    return (
        <div className="design-components-menu">
            <p className="menu-title">Components</p>
            <div className="components-module generic-module">
                <p className={"module-title"}>Generic</p>
            </div>
            <div className="components-module aws-module">
                <p className={"module-title"}>AWS</p>
            </div>
            <div className="components-module gcp-module">
                <p className={"module-title"}>GCP</p>
            </div>
            <div className="components-module azure-module">
                <p className={"module-title"}>Azure</p>
            </div>
        </div>
    );
}