import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import ShopProductCard from './DefaultUploadCard';
import DefaultUploadCard from './DefaultUploadCard';

// ----------------------------------------------------------------------

DefaultUploadList.propTypes = {
  // uploads: PropTypes.array.isRequired,
};

export default function DefaultUploadList({ uploads, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {uploads?.map((upload) => (
        <Grid key={upload.id} item xs={12} sm={6} md={3}>
          <DefaultUploadCard uploads={upload} />
        </Grid>
      ))
      }
    </Grid>
  );
}
