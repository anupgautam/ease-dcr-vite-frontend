const GetTitleFromId = (list, id) =>{
    const item = list.find((obj) => obj.id === id);
    return item ? item.title : null;
}

export default GetTitleFromId;