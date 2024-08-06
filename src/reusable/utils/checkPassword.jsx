import React from 'react'
import { containsSpecialChars } from './checkSpecialCharacters';

export const CheckPassword = (password) => {
    var returnValue = false;
    if(password.length >=8 && containsSpecialChars(password))
        returnValue = true;

    return returnValue;
  
}
