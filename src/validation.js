function hasNumericValue(str) {
    let regex = /\d/;
    return regex.test(str);
}

function hasAlphanumericValue(str) {
    let regex = /^[a-zA-Z0-9]*$/;
    return regex.test(str);
}


function hasAlpaValue(str) {
    let regex = /^[a-zA-Z]*$/;
    return regex.test(str);
}


// function Email(str) {
//     let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return !regex.test(str);
// }


function Email(str) {
    if (str && str.trim() !== '') {
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return !regex.test(str);
    }
    return false;
}



function lessThan50(str) {
    let regex = /^[a-zA-Z]{50,}$/;
    return regex.test(str);
}


function lessThan200(str) {
    let regex = /^[a-zA-Z]{200,}$/;
    return regex.test(str);
}


function specialCharacter(str) {
    let regex = /^[a-zA-Z0-9]*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{1}[a-zA-Z0-9]*$/;
    return regex.test(str);
}


function phoneNumber(str) {
    let regex = /^(?:\d{1,9}|\d{11,})$/;
    return regex.test(str);
}


function passWord(str) {
    let regex = /^.{1,7}$/;
    return regex.test(str);
}


function isNumberEdit(str) {
    let regex = /^\d+$/;
    return regex.test(str);
}

function isNumber(str) {
    let regex = /^\d+$/;
    return regex.test(str);
}

function isNumberOnly(str) {
    let regex = /^[0-9]+(\.[0-9]+)?$/;
    return regex.test(str);
}

export const returnValidation = (validationType, validationField) => {
    let err = ""
    if (validationType.includes('number')) {
        if (hasNumericValue(validationField)) {
            err = "The value must not contain any numeric value."
        }
    }
    if (validationType.includes('null')) {
        if (validationField === '') {
            err = "The value cannot be null."
        }
    }
    if (validationType.includes('alphaNumeric')) {
        if (hasAlphanumericValue(validationField)) {
            err = "The value cannot contain a number."
        }
    }
    if (validationType.includes('lessThan50')) {
        if (lessThan50(validationField)) {
            err = "String should be less than 50 characters"
        }
    }
    if (validationType.includes('lessThan200')) {
        if (lessThan200(validationField)) {
            err = "Message should be less than 200 characters"
        }
    }
    if (validationType.includes('phonenumber')) {
        if (phoneNumber(validationField)) {
            err = "Enter a valid phone number of 10digits"
        }
    }
    if (validationType.includes('specialcharacter')) {
        if (specialCharacter(validationField)) {
            err = "No special Character"
        }
    }
    if (validationType.includes('password')) {
        if (passWord(validationField)) {
            err = "Password can't be less than 8 characters"
        }
    }
    if (validationType.includes('email')) {
        if (Email(validationField)) {
            err = "The value must contain alphanumeric values."
        }
    }
    if (validationType.includes('alpha')) {
        if (hasAlpaValue(validationField)) {
            err = "The value can't contain alphabet"
        }
    }
    if (validationType.includes('isNumber')) {
        if (isNumber(validationField)) {
            err = "The value should be a number"
        }
    }
    if (validationType.includes('isNumberEdit')) {
        if (isNumberEdit(validationField)) {
            err = "The value should be a number"
        }
    }
    if (validationType.includes('isNumberOnly')) {
        if (!isNumberOnly(validationField)) {
            err = "The value should be a number"
        }
    }
    return err;
}

