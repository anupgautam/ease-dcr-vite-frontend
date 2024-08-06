import React, { useEffect, useState } from "react";
import TextButton from "../../button/buttonicon";
// import { FaPlus } from "react-icons/fa";
import ButtonCmp from "../../button/button";

const RepeatableForm = ({
    repeatableFormData,
    EditForm,
    AddForm,
    originalId,
    deleteAPI,
    initialAPI,
    postFormAPI,
    postFormMapAPI,
    mappingButtonName, }) => {
    const [createValue, setCreateValue] = useState(false);
    const [IsCreate, setIsCreate] = useState(false);
    const [deleteItem] = deleteAPI();

    const [Id, setId] = useState([]);
    if (originalId) {
        var { data } = initialAPI(originalId);
    }

    useEffect(() => {
        if (Id.length === 0) {
            var arr = []
            if (data) {
                data.ids.map((key) => {
                    arr.push(data.entities[key][repeatableFormData[0].mapIDName]);
                })
            }
            setId([...Id, ...arr])
        }

    }, [data])

    const clickQuantity = (e) => {
        setIsCreate(true);
    }

    const thisFunction = (keys) => {
        deleteItem(keys);
        setId(current =>
            current.filter(key => {
                return key !== keys;
            }),);
    }

    return (
        <>


            {Id.map((keys) => (
                <>
                    <EditForm
                        repeatableFormData={repeatableFormData}
                        index={keys}
                        originalId={originalId}
                        createValue={createValue}
                        setCreateValue={setCreateValue}
                        setId={setId}
                        idList={Id}
                    />
                    <ButtonCmp backgroundColor="red"
                        buttonText="Delete"
                        onClick={() => thisFunction(keys)} />
                </>

            ))}
            {IsCreate === true ?
                <>
                    <AddForm
                        repeatableFormData={repeatableFormData}
                        originalId={originalId}
                        createValue={createValue}
                        setCreateValue={setCreateValue}
                        setId={setId}
                        idList={Id}
                        index={0}
                        setIsCreate={setIsCreate}
                        postFormAPI={postFormAPI}
                        postFormMapAPI={postFormMapAPI} />
                    <ButtonCmp backgroundColor="red"
                        buttonText="Delete" />
                </>
                : <></>}

            {/* <TextButton buttonIcon={FaPlus}
                onClick={clickQuantity}
                buttonText={mappingButtonName}
            /> */}
        </>
    )
}

export default RepeatableForm;