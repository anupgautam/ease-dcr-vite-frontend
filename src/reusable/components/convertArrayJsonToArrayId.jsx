const ConverArrayJsonToArrayId = (data) => {
    if (data && data.length > 0) { // Add a null check for data
        const returningValue = [];
        for (let i = 0; i < data.length; i++) {
            returningValue.push(data[i].id);
        }
        return returningValue;
    } else {
        return [];
    }
}

export default ConverArrayJsonToArrayId;