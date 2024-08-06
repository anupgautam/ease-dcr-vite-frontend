import React, { useState, useRef, useEffect } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import { canvasPreview } from "../utils/canvasPreview";
import { useDebounceEffect } from "../utils/useDebounceEffect";
import { Box, Grid, Typography } from "@mui/material";

import "react-image-crop/dist/ReactCrop.css";
import postCanvasToURL from "../utils/canvasToURL";

// Helper function to center and create an aspect crop
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function Image({ setFile, aspectRatio = 16 / 9 }) {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(aspectRatio);
  const [imageSize, setImageSize] = useState({});
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (previewCanvasRef.current && completedCrop) {
      const handleFile = async () => {
        const file = postCanvasToURL(previewCanvasRef.current);
        setFile([file]);
      };

      handleFile();
    }
  }, [completedCrop]);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const onImageLoad = (e) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      const divide = parseInt(height / 500) + 1;
      setImageSize({ width: width / divide, height: height / divide });
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  return (
    <>
      <Grid>
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={onSelectFile} />
        <label className="custom-file-upload">
          <input
            type="file"
            onChange={onSelectFile}
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
      <Grid>
        {!!imgSrc && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              style={{ height: imageSize.height, width: imageSize.width }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        )}
      </Grid>
      <Grid>
        {!!completedCrop && (
          <canvas
            ref={previewCanvasRef}
            style={{
              border: "1px solid black",
              objectFit: "contain",
              width: completedCrop.width,
              height: completedCrop.height,
            }}
          />
        )}
      </Grid>
    </>
  );
}
