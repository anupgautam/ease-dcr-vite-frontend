import { BASE_URL } from "../../../../constant/baseURL";
import BlobToBase64 from "../blobToBase64";
import getBase64URL from "../urlToBase64";

const editWithImage = (noLoop, setNoLoop, editAPI, imageJSON, values, id, context=null) =>{
    const formData = new FormData();
    let editValue = {};
    Object.assign(editValue, values)
    editValue['id'] = id;
    
    
    if(editValue.edit && noLoop)
    {
     
        if(editValue)
        {
          
          
          for (let i=0; i<imageJSON.length; i++)
          {
            
          if(editValue[imageJSON[i].imageName] && typeof(editValue[imageJSON[i].imageName]) === 'string' && editValue[imageJSON[i].imageName].split('.').pop() !== 'None')
          {
            
            // getBase64URL(editValue[imageJSON[i].imageName]).then(base64 => {
            //     editValue['context'] = context;
            //     editValue[imageJSON[i].imageName] = base64;
            //     
                
            //     editAPI({'data': editValue}).then((res)=>{
            //         setNoLoop(false);
            //     })
            //     .catch((err)=>{
                  
            //     })
            // })
              editValue['context'] = context;
              editValue[imageJSON[i].imageName] = editValue[imageJSON[i].imageName]
           
            }
            else if(editValue[imageJSON[i].imageName] instanceof Blob){

                BlobToBase64(imageJSON[i].imageFile).then(res=>{
                    editValue['context'] = context;
                    editValue[imageJSON[i].imageName] = res;
                    formData.append("data", JSON.stringify(editValue)); 
                    editAPI({'data': editValue}).then((res)=>{
                      setNoLoop(false);
                        
                    })
                  .catch((err)=>{
                    
                  })  
                  })
            }
          else{
            
            editValue['context'] = context
            editValue[imageJSON[i].imageName] = null;
            
  
        }
        
          }
          
          editAPI({'data': editValue}).then((res)=>{
            setNoLoop(false);
              
          })
        .catch((err)=>{
          
        })
        }
    }
}

export default editWithImage;