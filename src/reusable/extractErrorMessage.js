import { toast } from 'react-toastify';


export const extractErrorMessage = (error) => {
    const defaultErrorMessage = "Internal Server Error";
    const authErrorMessage = "Error Failed";

    if (error?.response?.status >= 401) return authErrorMessage;

    const deepSearch = (obj) => {
        for (const key in obj) {
            const value = obj[key];
            if (Array.isArray(value) && value.length > 0) {
                const firstElement = value[0];

                if (typeof firstElement === "object") {
                    return deepSearch(firstElement);
                } else {
                    return firstElement;
                }
            } else if (typeof value === "object" && value !== null) {
                return deepSearch(value);
            } else if (typeof value === "string") {
                return value;
            }
        }
        return null;
    };

    let errorMessage = defaultErrorMessage;

    if (error?.response?.data) {
        errorMessage = deepSearch(error.response.data) || defaultErrorMessage;
        // errorMessage = deepSearch(error.response.data) || (defaultErrorMessage);
    } else if (error?.data) {
        errorMessage = deepSearch(error.data) || (defaultErrorMessage);
    }

    return errorMessage;
};

