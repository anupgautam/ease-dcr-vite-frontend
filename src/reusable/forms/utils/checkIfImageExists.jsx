function checkIfImageExists(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

export default checkIfImageExists;