export default function BlobToFile(blob, fileName) {
    if (blob && !blob.name) {
        if (!blob.lastModifiedDate) {
            blob.lastModifiedDate = new Date();
        }
        return new File([blob], fileName, { lastModified: blob.lastModifiedDate });
    }
    return blob;
}
