import React from 'react';
import { Box, Pagination, Typography, TableRow, TableCell } from '@mui/material';

const PaginationControl = ({ totalPages, page, handleChangePage, loading }) => {
    return (
        <TableRow>
            <TableCell colSpan={6}>
                <Box justifyContent="center" alignItems="center" display="flex" margin="8px 0px">
                    {loading ? (
                        <Typography variant="body1">In Search</Typography>
                    ) : (
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handleChangePage}
                        />
                    )}
                </Box>
            </TableCell>
        </TableRow>
    );
};

export default React.memo(PaginationControl);
