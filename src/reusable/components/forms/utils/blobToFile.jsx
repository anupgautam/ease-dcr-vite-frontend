import { isFile} from "./checkFile";

const BlobToFile = (blob, fileName) =>{
    if (!isFile(blob))
    {
        blob.lastModifiedDate = new Date();
        blob.name = fileName;
        return blob;
    }
    else{
        return blob;
    }
}

export default BlobToFile;