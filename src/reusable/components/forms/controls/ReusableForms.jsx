import React, { useState } from "react";
import TextButton from "../../button/buttonicon";
import RoundButton from "../../button/roundbutton";
import { FaPlus } from "react-icons/fa";
import { useEffect } from "react";
import Controls from "./Controls";
import useDebounce from "../utils/debounce";
import BlobToBase64 from "../utils/blobToBase64";
import { Grid, Tooltip, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const ReusableForms = ({
  isUpdate = false,
  updateLink,
  originalId,
  getApi,
  fieldName,
  mappedData,
  postAPI,
  fieldList,
  deleteAPI,
  initialAdd = [],
  context,
  editApi,
  imageField = {},
}) => {


  const data = getApi(originalId);





  const [thisData, setThisData] = useState([]);
  const [originalData, setOriginalData] = useState({});
  const [valueArray, setValueArray] = useState([]);
  const [addData] = postAPI();
  const [deleteThis] = deleteAPI();
  const [editThis] = editApi();
  const [editorValue, setEditorValue] = useState("");



  const getAllSetValues = (imageField) => {
    Object.keys(imageField).forEach((key) => {
      setValueArray((valueArray) => [
        ...valueArray,
        imageField[key]["imageFieldValue"],
      ]);
    });
  };

  useEffect(() => {
    getAllSetValues(imageField);
  }, [imageField]);

  useEffect(() => { }, [valueArray]);

  useEffect(() => {
    if (data.data) {

      setOriginalData(data.data);


      setThisData(data.data[fieldName]);
    }
  }, [data.data]);

  const addForm = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const data = {};
    data['id'] = originalId;
    context['request'] = 'POST';
    data['context'] = context
    data[fieldName] = [{}];
    initialAdd.forEach((key) => {
      data[fieldName][0][key['key']] = key['value'];
    })
    mappedData.forEach((key) => {
      data[fieldName][0][key.fieldName] = key.default;
    })
    addData(data).then((res) => {

    });
  };

  const imageConfirm = (e, key) => {
    BlobToBase64(imageField[e.target.name]["imageFieldValue"]).then((res) => {
      updateObject(
        key.id,
        { target: { name: e.target.name, value: res } },
        setOriginalData,
        originalData,
        fieldName
      );
    });
  };

  const deleteForm = (e, key) => {

    e.preventDefault();
    let data = {};
    data["id"] = originalId;


    fieldList.forEach((key1) => {
      if (key1 === fieldName) {
        data[key1] = [{ id: key.id }];
      } else {
        data[key1] = [];
      }
    });
    data['context'] = context

    deleteThis(data);
  };

  const [changeImmediate, setChangeImmediate] = useState(false);
  function updateObject(id, e, setData, data, fieldName) {
    const index = data[fieldName].findIndex((item) => item.id === id);
    const newQux = [...data[fieldName]];
    newQux[index] = { ...newQux[index], [e.target.name]: e.target.value };
    setData({ ...data, [fieldName]: [...newQux], context: context });
  }

  const editChange = (e, b, immediateChange) => {
    updateObject(b.id, e, setOriginalData, originalData, fieldName);
    if (immediateChange) {
      if (changeImmediate) {
        setChangeImmediate(false);
      } else {
        setChangeImmediate(true);
      }
    }
  };

  useEffect(() => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(originalData));
    if (originalData["context"] !== undefined) {
      editThis({ data: originalData });
    }
  },
    [useDebounce(originalData[fieldName], 3000), changeImmediate]);


  return (
    <>
      <>
        {thisData.map((key) => (
          <Box
            style={{
              background: "white",
              borderRadius: "5px",
              // margin: "1rem",
              marginTop: "1.5rem",
            }}
            className="hover-to-delete-display"
          >
            {/* <Grid item xs={10}></Grid> */}
            {/* <span
                      className="delete-icon-hover-design"
                      onClick={(e) => deleteForm(e, key)}
                    // data-aos="fade-up"
                    >
                      <Tooltip title="Delete Member">
                        <FontAwesomeIcon
                          className="icon-display"
                          icon={faTrashAlt}
                          style={{ fontSize: "22px", color: "red" }}
                        />
                      </Tooltip>
                    </span> */}
            <Box style={{}}>
              {mappedData.map((key1) => (
                <>
                  {key1["field_form"] === "input" ? (
                    <Box style={{ marginBottom: "20px" }}>
                      <Controls.Input
                        name={key1["field_name"]}
                        defaultValue={key[key1["field_name"]]}
                        label={key1["label"]}
                        onChange={(e) => editChange(e, key)}
                      />
                    </Box>
                  ) : (
                    <></>
                  )}
                  {/* {key1["field_form"] === "editor" ? (
                        <Box style={{ marginBottom: "20px" }}>
                          <Controls.Editor
                            name={key1["field_name"]}
                            label={key1["label"]}
                            onChange={(e) => editEditor(e, key)}
                          />
                        </Box>
                      ) : (
                        <></>
                      )} */}
                  {key1["field_form"] === "time" ? (
                    <Box style={{ marginBottom: "20px" }}>
                      <Controls.TimePickerReact
                        name={key1["field_name"]}
                        defaultValue={key[key1["field_name"]]}
                        label={key1["label"]}
                        value={key[key1["field_name"]]}
                        onChange={(e) => editChange(e, key)}
                      />
                    </Box>
                  ) : (
                    <></>
                  )}
                  {key1["field_form"] === "date" ? (
                    <Box style={{ marginBottom: "20px" }}>
                      <Controls.DatePickerWithYear
                        name={key1["field_name"]}
                        defaultValue={key[key1["field_name"]]}
                        label={key1["label"]}
                        onChange={(e) => editChange(e, key)}
                      />
                    </Box>
                  ) : (
                    <></>
                  )}
                  {key1["field_form"] === "checkbox" ? (
                    <Box style={{ marginBottom: "20px" }}>
                      <Controls.Checkbox
                        name={key1["field_name"]}
                        value={key[key1["field_name"]]}
                        label={key1["label"]}
                        onChange={(e) => editChange(e, key, true)}
                      />
                    </Box>
                  ) : (
                    <></>
                  )}
                  {key1["field_form"] === "select" ? (
                    <>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <Box style={{ marginBottom: "20px" }}>
                            <Controls.Select
                              name={key1["field_name"]}
                              value={key[key1["field_name"]]}
                              label={key1["label"]}
                              options={key1.options}
                              onChange={(e) => editChange(e, key)}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    <></>
                  )}
                  {key1["field_form"] === "image" ? (
                    <>
                      <Controls.Image
                        name={key1["field_name"]}
                        setFile={
                          imageField[key1["field_name"]][
                          "imageSetFieldValue"
                          ]
                        }
                        aspectRatio={key1['aspect_ratio']}
                      />
                      <Box style={{ marginTop: "10px" }}>
                        <Grid container spacing={1}>
                          <Grid item xs={4}>
                            <TextButton
                              onClick={(e) => imageConfirm(e, key)}
                              name={key1["field_name"]}
                              buttonText="Confrim Image"
                            />
                          </Grid>

                        </Grid>
                      </Box>
                    </>
                  ) : (
                    <></>
                  )}

                </>
              ))}
              <Box style={{ float: "left" }}>
                <RoundButton
                  classname=""
                  buttonText={"Delete"}
                  handleClick={(e) => deleteForm(e, key)}
                  backgroundColor="#ab0403"
                  color="white"
                />
              </Box>
              {isUpdate ?
                <Link to={`${updateLink}/${key.id}`}>
                  <TextButton
                    buttonText={<FontAwesomeIcon
                      icon={faEdit}
                      style={{ fontSize: "20px", color: "white" }} />}
                  /></Link> : <></>
              }
            </Box>
          </Box>
        ))}
      </>
      <Box style={{ float: 'right' }}>
        <RoundButton
          classname="add-btn-design"
          buttonIcon={FaPlus}
          buttonText={"Add"}
          backgroundColor="rgb(32, 101, 209)"
          color="white"
          handleClick={(e) => addForm(e)}
        />
      </Box>
    </>
  );
};

export default ReusableForms;
