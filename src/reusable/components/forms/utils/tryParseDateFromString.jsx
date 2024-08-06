export function tryParseDateFromString(dateStringCandidateValue, format = "ymd") {
    const candidate = (dateStringCandidateValue || ``)
      .split(/[ :\-\/]/g).map(Number).filter(v => !isNaN(v));
    const toDate = () => {
      format = [...format].reduce((acc, val, i) => ({ ...acc,  [val]: i }), {});
      const parts = 
        [candidate[format.y], candidate[format.m] - 1, candidate[format.d] ]
          .concat(candidate.length > 3 ? candidate.slice(3) : []);
      const checkDate = d => d.getDate && 
        ![d.getFullYear(), d.getMonth(), d.getDate()]
          .find( (v, i) => v !== parts[i] ) && d || undefined;
      
      return checkDate( new Date(Date.UTC(...parts)) );
    };
  
    return candidate.length < 3 ? undefined : toDate();
  }