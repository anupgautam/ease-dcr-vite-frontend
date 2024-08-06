
import { isFile } from "./checkFile";

const BlobToFile = (blob, fileName) => {
    if (blob && !isFile(blob)) {
        blob.lastModifiedDate = new Date();
        blob.name = fileName;
        return new File([blob], fileName, { type: blob.type, lastModified: new Date() });
    } else {
        return blob;
    }
}

export default BlobToFile;
