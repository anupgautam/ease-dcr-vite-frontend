import React, { useEffect } from 'react'

import { useGetAllVisitedDoctorsOptionsQuery } from '@/api/MPOSlices/DoctorSlice';
import { useGetAllCompanyAreasQuery } from '@/api/CompanySlices/companyAreaSlice';
import { useGetAllCompanyProductsWithoutPaginationQuery } from '@/api/productSlices/companyProductSlice';
import { useGetAllRewardsQuery } from '@/api/DCRs Api Slice/rewardsAPISlice';
import { useGetAllCompanyRolesQuery } from '@/api/CompanySlices/companyRolesSlice';
import { useGetAllShiftsQuery } from '@/api/MPOSlices/shiftSlice';
import { useGetAllStockistsWithoutPaginationQuery } from '@/api/MPOSlices/StockistSlice';
import { useGetUpperCompanyRolesMutation } from '@/api/CompanySlices/companyUserRoleSlice';
import { useGetChemistsWithoutPaginationQuery } from '@/api/MPOSlices/ChemistSlice';

import {
    addCompanyAreas,
    addCompanyProducts,
    addCompanyRoles,
    addRewards,
    addShifts,
    addVisitedDoctors,
    addStockist,
    addChemist
} from '@/reducers/dcrSelectData';

import { useDispatch } from 'react-redux';

const SelectDataDCR = () => {
    const dispatch = useDispatch();
    const doctorData = useGetAllVisitedDoctorsOptionsQuery();
    useEffect(() => {
        const intermediateDoctors = []
        if (doctorData.data) {
            doctorData.data.forEach((key) => {
                intermediateDoctors.push({ id: key.id, title: key.doctor_name.doctor_name })
            })
            dispatch(addVisitedDoctors(intermediateDoctors));
        }
    }, [doctorData])

    const areaData = useGetAllCompanyAreasQuery();
    useEffect(() => {
        const intermediateAreas = []
        if (areaData.data) {
            areaData.data.forEach((key) => {
                intermediateAreas.push({ id: key.id, title: key.company_area.area_name })
            })
            dispatch(addCompanyAreas(intermediateAreas));
        }
    }, [areaData])

    const productData = useGetAllCompanyProductsWithoutPaginationQuery();
    useEffect(() => {
        const intermediateProducts = [];
        const intermediateMultiProducts = [];
        if (productData.data) {
            productData.data.forEach((key) => {
                intermediateProducts.push({ id: key.id, title: key.product_name.product_name + " " + key.product_name.product_molecular_name })
                intermediateMultiProducts.push(key.product_name.product_name + " " + key.product_name.product_molecular_name);
            })
            dispatch(addCompanyProducts(intermediateProducts));
        }
    }, [productData])

    const rewardData = useGetAllRewardsQuery();
    useEffect(() => {
        const intermediateRewards = []
        const intermediateMultiRewards = []
        if (rewardData.data) {
            rewardData.data.forEach((key) => {
                intermediateRewards.push({ id: key.id, title: key.reward });
                intermediateMultiRewards.push(key.reward);
            })
            dispatch(addRewards(intermediateRewards))
        }
    }, [rewardData])

    const rolesData = useGetAllCompanyRolesQuery();
    useEffect(() => {
        const intermediateRoles = [];
        const intermediateMultiRoles = [];
        if (rolesData.data) {
            rolesData.data.forEach((key) => {
                intermediateRoles.push({ id: key.id, title: key.role_name.role_name })
                intermediateMultiRoles.push(key.role_name.role_name)
            })
            dispatch(addCompanyRoles(intermediateRoles));
        }
    }, [rolesData])

    const shiftData = useGetAllShiftsQuery();
    useEffect(() => {
        const shift = [];
        if (shiftData.data) {
            shiftData.data.forEach((key) => {
                shift.push({ id: key.id, title: key.shift })
            })
            dispatch(addShifts(shift))
        }
    }, [shiftData])

    const stockistData = useGetAllStockistsWithoutPaginationQuery();
    useEffect(() => {
        const stockist = [];
        if (stockistData.data) {
            stockistData.data.forEach((key) => {

                stockist.push({ id: key.id, title: key.stockist_name.stockist_name })
            })
            dispatch(addStockist(stockist))
        }
    }, [stockistData])

    const chemistData = useGetChemistsWithoutPaginationQuery();
    
    useEffect(() => {
        const chemist = [];
        if (chemistData.data) {
            chemistData.data.forEach((key) => {

                chemist.push({ id: key.id, title: key.chemist_name.chemist_name })
            })
            dispatch(addChemist(chemist))
        }
    }, [chemistData])

    return (
        <></>
    )
}

export default React.memo(SelectDataDCR)