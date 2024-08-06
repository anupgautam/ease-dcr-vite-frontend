export const NameFromOptions = (id, options) =>{
    
    const result = options.find(item => item.id === id);
    if (result) {
        return result.title; // Outputs: two
    }
    else{
        return null;
    }
    }

export const GetNameListFromOptions = (dataArray, dataArrayField, options) =>{
    let thisArray = []
    dataArray.forEach((key)=>{
        if(NameFromOptions(key[dataArrayField], options)!== null)
        {
            thisArray.push(NameFromOptions(key[dataArrayField], options))
        }
    })
    
    return thisArray;
}