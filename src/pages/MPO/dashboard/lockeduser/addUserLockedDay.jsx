import { Close } from "@mui/icons-material";
import { Box, Button, Drawer, Grid, IconButton, Stack, Typography } from "@mui/material";
import React, { useState, useCallback } from "react";
import Controls from "@/reusable/forms/controls/Controls";
import { Form } from "@/reusable/forms/useForm";

const AddUserLockedDay = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const onClose = useCallback(() => {
        setIsDrawerOpen(false)
    }, [])

    const handleSubmit = useCallback((e) => {

    }, [])

    return (
        <>
            <Box style={{ textAlign: "right" }}>
            </Box>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                padding="16px"
                sx={{
                    width: 400, // Set the desired width of the Drawer
                    flexShrink: 0,
                    boxSizing: "border-box",
                    '& .MuiDrawer-paper': {
                        width: 400 // Set the same width for the paper inside the Drawer
                    }
                }}
            >
                <Box style={{ padding: "20px" }}>
                    <Box
                        p={1}
                        textAlign="center"
                        role="presentation"
                        className="drawer-box"
                        style={{ marginBottom: "40px" }}
                    >
                        <IconButton
                            className="close-button"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Edit User Locked Time Period
                        </Typography>

                        <Form onSubmit={handleSubmit}>
                            <Grid container spacing>
                                <Grid item xs={12}>
                                    <Box marginTop={4} marginBottom={2}>
                                        <Controls.Input
                                            name="locked_period"
                                        // label="Locked Period*"
                                        // value={values.last_name}
                                        // onChange={handleInputChange}
                                        // error={errors.last_name}
                                        />
                                    </Box>
                                </Grid>
                                <Stack spacing={1} style={{ marginLeft: '10px' }} direction="row">
                                    <Button
                                        variant="contained"
                                        className="summit-button"
                                        onClick={(e) => { handleSubmit(e); onClose() }}
                                    >
                                        Submit{" "}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        className="cancel-button"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </Grid>
                        </Form>
                    </Box>
                </Box>
            </Drawer>
        </>
    )
}

export default React.memo(AddUserLockedDay);