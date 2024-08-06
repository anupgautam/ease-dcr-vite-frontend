import dataURItoBlob from "./dataUriToBlob";

export default function postCanvasToURL(snap) {
    var img = snap.toDataURL('image/jpeg'); // Convert canvas image to Base64
    let file = dataURItoBlob(img); // Convert Base64 image to binary
    return file;
  }