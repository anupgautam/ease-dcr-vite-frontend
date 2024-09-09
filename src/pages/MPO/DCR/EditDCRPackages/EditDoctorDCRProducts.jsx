import { Box, Grid, Typography } from "@mui/material";
import React, { useState, useMemo } from "react";
import {
  useGetPromotedProductByDcrIdQuery
} from "../../../../api/DCRs Api Slice/doctorDCR/DoctorDCRAllSlice";
import { useTransition } from 'react-transition-state';
import RoundButton from "@/reusable/components/button/roundbutton";
import { FaPlus } from "react-icons/fa";
import { useGetAllProductsOptionsWithDivisionQuery, usePostProductPromotionsMutation } from "@/api/MPOSlices/productApiSlice";
import { useGetProductForDcrByIdQuery } from "@/api/MPOSlices/ProductSlice";
import Controls from "@/reusable/forms/controls/Controls";
import { useSelector } from 'react-redux';
import { useGetAllCompanyProductsWithoutPaginationQuery } from "@/api/productSlices/companyProductSlice";


const EditDoctorDCRProducts = ({ id, context, editApi, division }) => {
  const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

  const [state, toggle] = useTransition({ timeout: 750, preEnter: true });
  // const companyProducts = useSelector(state => state.dcrData.company_products);
  const { data } = useGetPromotedProductByDcrIdQuery(id);

  const { data: productData } = useGetAllProductsOptionsWithDivisionQuery({ company_name: company_id, division_name: division?.id })

  const productList = useMemo(() => {
    if (productData !== undefined) {
      return productData.map((key) => ({
        id: key.id,
        title: key.product_name.product_name
      }))
    }
    return [];
  }, [productData])

  const [ProductPromotions, setProductPromotion] = useState('');
  const [ProductNotListed, setProductListed] = useState(null);

  const { data: newProductList } = useGetProductForDcrByIdQuery(ProductNotListed?.company_product_id);

  const onProductPromotion = e => setProductPromotion(e.target.value);

  const [PostProductPromotions] = usePostProductPromotionsMutation();

  const handleProductPromotion = () => {
    const data = { dcr_id: id, company_product_id: ProductPromotions }
    PostProductPromotions(data)
      .then((res) => {
        if (res.data) {
          setProductListed(res.data);
          setProductPromotion('');
        }
      })
      .catch((err) => {
      })
  }


  return (
    <Grid item xs={12}>
      <Box className="box-design-service">
        <Grid
          container
          spacing={0}
          // className="box-design-service1"
          onClick={
            () => toggle()}
        >
          <Grid item xs={11}>
            <Typography className="form-label-design">
              Promoted Product Details
            </Typography>
          </Grid>
          <Grid item xs={1}>
            {/* <Box style={{ float: 'right' }}>
              {state.status == "entered" ? (
                <FontAwesomeIcon icon={faChevronDown} size={14} />
              ) : (
                <FontAwesomeIcon icon={faChevronUp} size={14} />
              )}
            </Box> */}
          </Grid>
        </Grid>
        <Box className={`box-form-design example ${state.status}`}>
          {
            data !== undefined ?
              <Box style={{ marginTop: '15px' }}>
                {
                  data?.length !== 0 ?
                    <Grid container spacing={1}>
                      {
                        data?.map((key, index) => (
                          <Grid item xs={4}>
                            <ProductData id={key.company_product_id} key={index} />
                          </Grid>
                        ))
                      }
                      {
                        ProductNotListed !== null ?
                          <Grid item xs={4}>
                            <Typography className="add-product-design">{newProductList?.product_name?.product_name}</Typography>
                          </Grid> : null
                      }
                    </Grid> : null
                }
              </Box> : null
          }

          <Box style={{ marginTop: '10px' }}>
            <Box style={{ marginBottom: '20px' }}>
              <Controls.Select
                name="company_product_id"
                label="Promoted Product*"
                value={ProductPromotions}
                onChange={onProductPromotion}
                options={productList}
              />
            </Box>
          </Box>
          <Box style={{ marginTop: "5px" }}>
            <RoundButton
              classname="add-btn-design"
              buttonIcon={FaPlus}
              buttonText={"Add Product"}
              backgroundColor="rgb(32, 101, 209)"
              color="white"
              handleClick={handleProductPromotion}
            />
          </Box>
          {/* <ReusableFormsSelect
            originalId={id}
            context={context}
            editApi={editApi}
            getApi={useGetDoctorAllDCRByIdQuery}
            fieldName="company_product"
            fieldList={[
              'company_product',
              'company_roles',
              'rewards']}
            postAPI={useAddDoctorsAllDCRMutation}
            deleteAPI={useDeleteDoctorsAllDCRByIdMutation}
            mappedData={[
              {
                field_name: "id",
                field_form: "select",
                label: "Products",
                debounce_time: 0,
                default: null,
              },
            ]}
            defaultValue={companyProducts}
            defaultValueList={true}
          /> */}
        </Box>
      </Box>
    </Grid>
  )
}

const ProductData = ({ id }) => {
  const { data } = useGetProductForDcrByIdQuery(id);
  return (
    <Box>
      <Typography className="add-product-design">{data?.product_name?.product_name}</Typography>
    </Box>
  )
}

export default React.memo(EditDoctorDCRProducts);