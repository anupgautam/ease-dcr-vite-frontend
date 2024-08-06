import { BASE_URL } from "../../../../../baseURL";

const editWithoutImage = (noLoop, setNoLoop, editAPI, values, id, context = null) => {
  
  const formData = new FormData();
  let editValue = {};
  Object.assign(editValue, values)
  editValue['id'] = id;
  editValue['context'] = context;

  if (editValue.edit) {

    if (editValue) {
      
      
      editAPI({ 'data': editValue }).then((res) => {
        
        setNoLoop(false);

      })
        .catch((err) => {

        })
    }
  }
}

export default editWithoutImage;