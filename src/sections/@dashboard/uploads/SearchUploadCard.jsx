import PropTypes from 'prop-types';
// @mui
import { Box, Card, Typography, Stack, IconButton, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import { ColorPreview } from '../../../components/color-utils';
import Iconify from '../../../components/iconify/Iconify';
import { useDeleteUploadByIdMutation } from '../../../api/Uploads/uploadApiSlice'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from 'react-router-dom'
// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

SearchUploadCard.propTypes = {
  uploads: PropTypes.object,
};

export default function SearchUploadCard({ uploads }) {

  //! Delete Uploads 
  const [deleteUpload] = useDeleteUploadByIdMutation();
  const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]
  const { upload, upload_name, upload_type } = uploads || {};

  if (!uploads) {
    return null; // Add a check to handle the case when uploads is undefined or null
  }
  return (
    <>
      {uploads === undefined ?
        <>{
          eightArrays.map((key) => (
            <Card>
              <Box sx={{ pt: '100%', position: 'relative' }}>
                <Skeleton />
              </Box>

              <Stack spacing={2} sx={{ p: 3 }}>
                {/* <Link color="inherit" underline="hover"> */}
                <Typography variant="subtitle2" noWrap>
                  <Skeleton />
                </Typography>
                {/* </Link> */}
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
          <Card>
            <Box sx={{ pt: '100%', position: 'relative' }}>
              <Link to={`/uploadnewtab/${uploads.id}`} target="_blank">
                <StyledProductImg alt={upload_name} src={upload} />
              </Link>
            </Box>

            <Stack spacing={2} sx={{ p: 3 }}>
              {/* <Link color="inherit" underline="hover"> */}
              <Typography variant="subtitle2" noWrap>
                {upload_type}
              </Typography>
              {/* </Link> */}

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
                  {upload_name}
                </Typography>
                {/* //! Delete  */}
                <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => deleteUpload(uploads.id)}>
                  <Badge>
                    <Iconify icon="eva:trash-2-outline" />
                  </Badge>
                </IconButton>
              </Stack>
            </Stack>
          </Card>

        </>
      }

    </>
  );
}
