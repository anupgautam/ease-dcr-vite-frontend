import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import SearchUploadCard from './SearchUploadCard';

// ----------------------------------------------------------------------

SearchUploadList.propTypes = {
  // uploads: PropTypes.array.isRequired,
};

export default function SearchUploadList({ uploads, ...other }) {
  // 
  return (
    <>
      <Grid container spacing={3} {...other}>
        {uploads?.results?.map((upload) => (
          <Grid key={upload.id} item xs={12} sm={6} md={3}>
            <SearchUploadCard uploads={upload} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
