import { Grid } from '@mui/material';
import TargetPage from "./TargetPage";

const TargetController = () => {

    return (
        <>
            <Grid item xs={12} md={6} lg={8}>
                <TargetPage/>
            </Grid>
        </>
    );
}

export default TargetController;