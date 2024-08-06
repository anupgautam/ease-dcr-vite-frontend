export default function getDatesByDayList(dayList, month) {
    
    const year = new Date().getFullYear();
    const dates = [];
      for (let day = 1; day <= 31; day++) {
        const date = new Date(year, month, day);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  
        if (date.getFullYear() === year && dayList.includes(dayName.toLowerCase())) {
          dates.push(date);
          
        }
      }
  
    return dates;
  }