import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import { Box, Card, Typography, Stack, IconButton, Badge, Button } from '@mui/material';
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
import { Route, useParams, Link } from 'react-router-dom'
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { toast } from 'react-toastify';

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

DefaultUploadCard.propTypes = {
  uploads: PropTypes.object,
};

export default function DefaultUploadCard({ uploads }) {

  //! Dialogue 
  const [openDialogue, setOpenDialogue] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = useCallback(() => {
    setOpenDialogue(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpenDialogue(false)
  }, [])
  const [selectedId, setSelectedId] = useState(null);

  //! Delete Uploads 
  const [deleteUpload] = useDeleteUploadByIdMutation();
  const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]
  const { upload, upload_name, upload_type } = uploads || {};
  const encodedURL = encodeURI(upload);

  const handleDelete = async (id) => {
    try {
      const response = await deleteUpload(id);
      console.log(response)
      if (response?.data) {
        toast.success(`${response?.data?.message}`)
      } else if (response?.error) {
        toast.error(`Error: ${response.error.data?.message || "Failed to delete Doctor Specilization"}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred during deletion.");
    } finally {
      handleClose();
    }
  };

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
                <img alt={upload_name} src={upload} />
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
                <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(uploads.id); handleClickOpen() }}>
                  <Badge>
                    <Iconify icon="eva:trash-2-outline" />
                  </Badge>
                </IconButton>
              </Stack>
            </Stack>
          </Card>

          <Dialog
            fullScreen={fullScreen}
            open={openDialogue}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {"Are you sure want to delete?"}
            </DialogTitle>
            <DialogActions>
              <Button autoFocus onClick={() => { handleDelete(selectedId); handleClose() }}>
                Yes
              </Button>
              <Button
                onClick={handleClose}
                autoFocus>
                No
              </Button>
            </DialogActions>
          </Dialog>
        </>
      }

    </>
  );
}