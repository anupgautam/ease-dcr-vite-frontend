import React from "react";
import Carousel from 'react-material-ui-carousel'
import { Box } from "@mui/material";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

//This is the simple carousel component with autoplay
// here the props are 
//imagedata where we can pass the images
// width and height is for passing the image width and height 

const SimpleCarousel = ({ ImageData, width, height }) => {

    return (
        <>
            {ImageData.image.length !== 0 ?
                <Carousel >
                    {
                        ImageData.image.map((key) =>
                            <Box>
                                <img src={key}
                                    alt=""
                                    style={{
                                        width: `${width}`,
                                        height: `${height}`,
                                    }}
                                />
                            </Box>
                        )
                    }
                </Carousel> :
                <Carousel autoPlay>
                    <Box>
                        <SkeletonTheme baseColor="#eeeeee" height={'400px'} highlightColor="#444">
                            <p>
                                <Skeleton count={1} />
                            </p>
                        </SkeletonTheme>
                    </Box>
                </Carousel>
            }
        </>
    )
}
export default SimpleCarousel;
