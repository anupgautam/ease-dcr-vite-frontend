import { BASE_URL } from "../../../constant/baseURL";
async function getBase64URL(url) {
    try {
      const response = await fetch(BASE_URL+url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

export default getBase64URL;