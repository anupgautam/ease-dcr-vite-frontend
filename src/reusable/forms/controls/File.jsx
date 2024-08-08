import React, { useState } from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const File = ({ setFile }) => {
    const [imgSrc, setImgSrc] = useState("");
    const [fileName, setFileName] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
        }
        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () =>
                setImgSrc(reader.result?.toString() || "")
            );
            reader.readAsDataURL(event.target.files[0]);
            setFileName(event.target.files[0].name);
        }
    };

    return (

        <Grid>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            <label className="custom-file-upload">
                <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ width: "100%" }}
                />
                <Box>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <Typography className="choose-file-text">
                                Choose File
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            {fileName === "" ? (
                                <Typography className="file-name-display-design">
                                    No File Uploaded
                                </Typography>
                            ) : (
                                <Typography className="file-name-display-design">
                                    {fileName}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </label>
        </Grid>
    );
};

export default File;
