import React from "react";
import { Card, Box } from "@mui/material";

const Gallery = ({ ImageData, width, height }) => {
  return (

    <Card elevation={0}
      style={{
        width: `${width}`,
        height: `${height}`,
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
      }}
    >
      {
        ImageData.image.map((key) =>
          <Box>
            <img
              src={key}
              alt="images"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
        )
      }
    </Card>
  )
}

export default Gallery;