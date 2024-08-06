export function isFile(input) {
    if ('File' in window && input instanceof File)
       return true;
    else return false;
 }
 
export function isBlob(input) {
     if ('Blob' in window && input instanceof Blob)
         return true;
     else return false;
 }