import React from 'react';

const CsvHeader = ({ headers }) => {
  return (
    <div style={{ backgroundColor: '#eee', padding: '5px', display: 'flex' }}>
      {headers.map((header) => (
        <span key={header.key} style={{ flex: 1, padding: '5px' }}>
          {header.label}
        </span>
      ))}
    </div>
  );
};

export default CsvHeader;