import React, { useState, useRef } from "react";
import { useEffect } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import { canvasPreview } from "../utils/canvasPreview";
import { useDebounceEffect } from "../utils/useDebounceEffect";
import { Box, Grid, Typography } from "@mui/material";

import "react-image-crop/dist/ReactCrop.css";
import postCanvasToURL from "../utils/canvasToURL";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
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
  const [thisFile, setThisFile] = useState([]);
  const [FileName, setFileName] = useState("");

  useEffect(() => {
    if (previewCanvasRef.current) {
      setTimeout(() => {
        let file = postCanvasToURL(previewCanvasRef.current);
        setFile(file);
        setThisFile(file);
      }, [500]);
    }
  }, [previewCanvasRef, completedCrop]);

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
      var filesArray = [].slice.call(e.target.files);
      filesArray.forEach((e) => {
        setFileName(e.name);
      });
    }
  }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      const divide = parseInt(height / 500) + 1;
      setImageSize({ width: width / divide, height: height / divide });
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
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
              <Grid item xs={9}>
                {FileName === "" ? (
                  <Typography className="file-name-display-design">
                    Choose File...
                  </Typography>
                ) : (
                  <Typography className="file-name-display-design">
                    {FileName}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={3}>
                <Typography className="choose-file-text">
                  Browse
                </Typography>
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
