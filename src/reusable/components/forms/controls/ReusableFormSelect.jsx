import React, { useState } from "react";
import TextButton from "../../button/buttonicon";
import RoundButton from "../../button/roundbutton";
import { FaPlus } from "react-icons/fa";
import { useEffect } from "react";
import Controls from "./Controls";
import { useForm1 } from "../useForm";
import useDebounce from "../utils/debounce";
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import {
  Drawer,
  Modal,
  Typography,
  Popover,
  Box
} from '@mui/material';

const ReusableFormsSelect = ({
  originalId,
  getApi,
  editApi,
  fieldName,
  mappedData,
  postAPI,
  defaultValue,
  deleteAPI,
  fieldList,
  context,
  isUpdate,
  updateComponent
}) => {
  // 
  // 
  const data = getApi(originalId);
  // 
  const [thisData, setThisData] = useState([]);
  const [showSelect, setShowSelect] = useState(false);
  const [addData] = postAPI();
  const [deleteThis] = deleteAPI();
  const [originalData, setOriginalData] = useState({});
  const [editThis] = editApi();

  // 
  useEffect(() => {
    if (data?.data) {
      setOriginalData(data.data);
      setThisData(data.data[fieldName]);
    }
  }, [data?.data]);

  const addSelectData = (e) => {
    e.preventDefault();
    // const data = {
    //   id: originalId,
    //   hotel_room: [
    //     {
    //       id: e.target.value,
    //     },
    //   ],
    // };
    // const data1 = addData(data);
    addObject(e, setOriginalData, originalData, fieldName);
    addData(originalData);
    setShowSelect(false);
  };

  const addForm = (e) => {
    e.preventDefault();
    setShowSelect(true);
  };

  function updateObject(id, e, setData, data, fieldName) {
    const index = data[fieldName].findIndex(item => item.id === id);
    const newQux = [...data[fieldName]];
    newQux[index] = { ...newQux[index], [e.target.name]: e.target.value };
    setData({ ...data, [fieldName]: [...newQux], context: context })
  }

  function addObject(e, setData, data, fieldName) {
    const newValue = {
      id: parseInt(originalId),
      [fieldName]: [{
        id: [e.target.value]
      }],
    }
    setData(newValue);
  }


  const deleteForm = (e, key) => {
    e.preventDefault();
    let data = {};
    data['id'] = originalId;
    data['context'] = context;
    fieldList.forEach((key1) => {
      if (key1 === fieldName) {
        data[key1] = [{ 'id': key.id }];
      }
      else {
        data[key1] = [];
      }
    })


    deleteThis(data);
  }
  // 

  const thisEdit = (e, key) => {
    updateObject(key.id, e, setOriginalData, originalData, fieldName)

  }

  const thisEditNew = (e) => {
    const vals = { [e.target.name]: e.target.value }
    addData({ id: originalId, [fieldName]: [vals] })
  }

  useEffect(() => {
    const formData = new FormData();

    formData.append("data", JSON.stringify(originalData));

    if (originalData["context"] !== undefined) {
      editThis({ data: originalData });
    }
  }, [useDebounce(originalData[fieldName], 3000)]);




  return (
    <>
      <>
        {thisData.map((key) => (
          <>
            <Box style={{ background: 'white', marginTop: '1rem', marginBottom: '1rem', borderRadius: "5px" }}>
              <TransitionGroup>
                {mappedData.map((key1) => (
                  <CSSTransition
                    key={key1}
                    timeout={500}
                    classNames="item">
                    <>
                      {isUpdate ?
                        <>
                          <Typography className="add-product-design" onClick={(e) => updateComponent(e, key[key1["field_name"]])}>Add Product</Typography>
                        </> : <></>}
                      <Controls.Select
                        name={key1["field_name"]}
                        value={key[key1["field_name"]]}
                        label={key1["label_name"]}
                        options={defaultValue}
                        onChange={(e) => thisEdit(e, key)}
                      />
                    </>
                  </CSSTransition>
                ))}

              </TransitionGroup>
            </Box>
            <RoundButton
              classname=""
              buttonText={"Delete"}
              handleClick={(e) => deleteForm(e, key)}
              backgroundColor="#ab0403"
              color="white"
            />
          </>

        ))}
        {showSelect === true ? (
          <>
            {mappedData.map((key1) => (
              <Box style={{ marginBottom: '15px' }}>
                <Controls.Select
                  name={key1["field_name"]}
                  label={key1["label_name"]}
                  options={defaultValue}
                  onChange={(e) => thisEditNew(e)}
                />
              </Box>
            ))}
          </>
        ) : (
          <></>
        )}
        {'        '}
        {' '}
      </>
      <RoundButton
        classname="add-btn-design"
        buttonIcon={FaPlus}
        buttonText={"Add"}
        backgroundColor="rgb(32, 101, 209)"
        color="white"
        handleClick={(e) => addForm(e)}
      />
    </>
  );
};

export default ReusableFormsSelect;