import React, { useState, useCallback } from 'react';
import { Container} from '@mui/material';
import { DefaultUploadList } from '../../../sections/@dashboard/uploads';
import { useGetUploadQuery } from '../../../api/Uploads/uploadApiSlice'
import 'react-loading-skeleton/dist/skeleton.css'
import Cookies from 'js-cookie'

const DefaultList = () => {

    //!Pagination logic
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    //! GET Uploads 
    const { data } = useGetUploadQuery({ page: page, id: Cookies.get('company_id') });

    return (
        <>
            <Container>
                <DefaultUploadList uploads={data} />
            </Container>
        </>
    );
}

export default React.memo(DefaultList);
