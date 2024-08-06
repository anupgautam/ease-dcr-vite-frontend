  // function to convert list of strings to list of dates
  function convertToDate(strList) {
    return strList.map(str => new Date(str));
  }
  
  function convertToArrayofDate(inputDict, key_value)
  {
    // convert the input dictionary to a new dictionary with dates
    const outputDict = {};
    for (const [key, value] of Object.entries(inputDict)) {
        if(key === key_value)
        {
            outputDict[key] = convertToDate(value);
        }
        else{
            outputDict[key] = value;
        }
    }
    return outputDict;
  }

  export default convertToArrayofDate;
  