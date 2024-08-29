import React, { useState, useCallback } from 'react';
import { Container } from '@mui/material';
import { DefaultUploadList } from '../../../sections/@dashboard/uploads';
import { useGetUploadQuery } from '../../../api/Uploads/uploadApiSlice'
import 'react-loading-skeleton/dist/skeleton.css'
import { useSelector } from 'react-redux';

const DefaultList = () => {

    //!Pagination logic
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    //! GET Uploads 
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);
    const { data } = useGetUploadQuery({ page: page, id: company_id });

    return (
        <>
            <Container sx={{ pt: 4 }}>
                <DefaultUploadList uploads={data} />
            </Container>
        </>
    );
}

export default React.memo(DefaultList);
