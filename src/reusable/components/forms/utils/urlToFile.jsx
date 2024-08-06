import React from "react"

const urlToFile = (dataURI, setFile)=>{

    var file = [];

    const url = dataURI
    const fileName = 'services.jpg'
    
    fetch(url)
      .then(async response => {
        const contentType = response.headers.get('content-type')
        const blob = await response.blob()
        file = new File([blob], fileName, { contentType })
        
        setFile(file);
      })

}

export default urlToFile;