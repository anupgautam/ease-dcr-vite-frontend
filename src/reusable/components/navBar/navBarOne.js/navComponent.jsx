import React from "react";
import { List, Box } from "@mui/material";
import ActiveSingle from "./navItems/activeSingle";
import ActiveMultiple from "./navItems/activeMultiple";
import InactiveSingle from "./navItems/inactiveSingle";
import InactiveMultiple from "./navItems/inactiveMultiple";

const NavComponent = ({ navComponent, buttonColor, bgColor }) => {

    return (
        <>
            <Box style={{ paddingTop: ".5rem" }}>
                <List style={{ textAlign: "start" }}>
                    {navComponent.map((key) => (
                        <>
                            {key.isActive ?
                                <>
                                    {key.subComponentName.length === 0 ?
                                        <ActiveSingle
                                            route={key.route}
                                            componentName={key.componentName}
                                            buttonColor={buttonColor} /> :
                                        <>
                                            <ActiveMultiple
                                                route={key.route}
                                                componentName={key.componentName}
                                                subComponentName={key.subComponentName}
                                                buttonColor={buttonColor} />
                                        </>
                                    }
                                </>
                                : <>
                                    {key.subComponentName.length === 0 ?
                                        <InactiveSingle
                                            route={key.route}
                                            componentName={key.componentName}
                                            buttonColor={buttonColor}
                                            bgColor={bgColor} /> :
                                        <InactiveMultiple
                                            route={key.route}
                                            componentName={key.componentName}
                                            subComponentName={key.subComponentName}
                                            buttonColor={buttonColor}
                                            bgColor={bgColor} />
                                    }
                                </>}

                        </>
                    ))}
                </List>
            </Box>
        </>
    )
}

export default NavComponent;