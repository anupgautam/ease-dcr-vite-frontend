const DateToString = (date) =>{

// Extract the individual date components
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');

// Combine the components into the desired format
const formattedDate = `${year}-${month}-${day}`
return formattedDate
}

export default DateToString