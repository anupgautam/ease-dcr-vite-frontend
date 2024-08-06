import React, {useState} from "react"
import { GiConsoleController } from "react-icons/gi";

const urlToBlob= async(dataURI, setBlob)=>{
    var file = [];

    const url = dataURI

    try {
        const response = await fetch(url, { method: 'GET', mode: 'same-origin' });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.blob();
      } catch (error) {
        console.error('Error:', error);
      }
    // const fileName = 'services.jpg'
    // const response = await fetch(url);
    // const data = await response.blob();
    // 
    // return data;
  
    // 
    // const xhr = new XMLHttpRequest();
    // 
    // if(dataURI.split('.').pop() !== 'None')
    // {
    //     xhr.open('GET', dataURI, true);
    // }
    // xhr.responseType = 'blob';
    // xhr.onload = function(e) {
    //     if (this.status === 200) {
    //         var blob = new Blob([this.response], {type: 'image/jpeg'});
    //         setBlob(blob);
    // do something with the blob
    //     }
    //     };
    // xhr.send();
}

export default urlToBlob;