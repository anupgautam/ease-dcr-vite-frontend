import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack, IconButton, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import { ColorPreview } from '../../../components/color-utils';
import Iconify from '../../../components/iconify/Iconify';
import { useDeleteUploadByIdMutation, useGetUploadByIdQuery } from '../../../api/Uploads/uploadApiSlice'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useParams } from 'react-router-dom';
// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
});

// ----------------------------------------------------------------------

UploadsDetail.propTypes = {
    uploads: PropTypes.object,
};

export default function UploadsDetail({ uploads }) {
    const slug = useParams();
    const newSlug = slug['id'];

    //! Get uploads by id 
    const uploadById = useGetUploadByIdQuery(newSlug);
    

    //! Delete Uploads 
    const [deleteUpload] = useDeleteUploadByIdMutation();
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    return (
        <>
            {uploadById?.data === undefined ?
                <>{
                    eightArrays.map((key) => (
                        <Card>
                            <Box sx={{ pt: '100%', position: 'relative' }}>
                                <Skeleton />
                            </Box>

                            <Stack spacing={2} sx={{ p: 3 }}>
                                <Link color="inherit" underline="hover">
                                    <Typography variant="subtitle2" noWrap>
                                        <Skeleton />
                                    </Typography>
                                </Link>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Typography variant="subtitle1">
                                        <Typography
                                            component="span"
                                            variant="body1"
                                            sx={{
                                                color: 'text.disabled',
                                                textDecoration: 'line-through',
                                            }}
                                        >
                                        </Typography>
                                        &nbsp;
                                        <Skeleton />
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Card>
                    ))}
                </> :
                <>
                    {
                        <Card>
                            <Box sx={{ pt: '100%', position: 'relative' }}>
                                <StyledProductImg alt={uploadById?.data?.upload_name} src={uploadById?.data?.upload} />
                            </Box>
                        </Card>
                    }
                </>
            }

        </>
    );
}
