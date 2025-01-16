import React from "react";
import * as ExcelJS from "exceljs";
import { Button } from "@mui/material";
import Iconify from "../../components/iconify/Iconify";

const ExportToExcel = ({ headers, data, fileName }) => {
    const exportExcelFile = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("My Sheet");
        sheet.properties.defaultRowHeight = 15;

        const excelColor = { argb: 'FF2e8960' };
        const fontSize = 9; // Decreased font size

        // Add additional fields above headers
        const additionalFields = [
            { label: 'Name', value: 'Anup Gautam' },
            { label: 'Territory', value: 'ktm' },
            { label: 'From', value: 'May 01' },
            { label: 'To', value: 'May 31' },
            { label: 'Month', value: 'May 018' },
        ];

        additionalFields.forEach((field, index) => {
            const row = sheet.getRow(index + 1);
        
            // Merge cells to increase the width of the label
            sheet.mergeCells(index + 1, 1, index + 1, 2); // Merges cells from column 1 to 2 for the label
        
            // Add label
            row.getCell(1).value = `${field.label}:`;
            row.getCell(1).font = {
                size: fontSize + 2,
                bold: true,
            };
            row.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
        
            // Merge cells to increase the width of the value
            sheet.mergeCells(index + 1, 3, index + 1, 6); // Merges cells from column 3 to 6 for the value
        
            // Add value
            row.getCell(3).value = field.value;
            row.getCell(3).font = {
                size: fontSize + 2,
            };
            row.getCell(3).alignment = { vertical: 'middle', horizontal: 'left' };
        
            // Remove borders for merged cells
            row.getCell(1).border = {};
            row.getCell(3).border = {};
        
            // Adjust row height for better spacing
            row.height = 20;
        });
        
        // Optional: Hide gridlines for the entire sheet
        sheet.properties.showGridLines = false;
        

        // Adjust header starting position after additional fields
        const headerStartRow = additionalFields.length + 1;

        headers.forEach((header, index) => {
            const cell = sheet.getCell(headerStartRow, index + 1);
            cell.value = header.label;
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: header.backgroundColor || "FFFFFF" },
            };
            cell.font = {
                size: fontSize,
                color: excelColor,
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centering the header cell
            cell.border = {
                top: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } },
            };
        });

        // Add data starting from row after headers
        data.forEach((row, rowIndex) => {
            headers.forEach((header, colIndex) => {
                const cell = sheet.getCell(rowIndex + headerStartRow + 1, colIndex + 1);
                cell.value = row[header.key];
                cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centering the data cell
                cell.font = {
                    size: fontSize,
                };
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } },
                };
            });
        });

        // Adjust column widths to fit content
        headers.forEach((header, index) => {
            const column = sheet.getColumn(index + 1);
            let maxLength = header.label.length;

            data.forEach(row => {
                const cellValue = String(row[header.key] || '');
                if (cellValue.length > maxLength) {
                    maxLength = cellValue.length;
                }
            });

            column.width = maxLength + 1;
        });

        workbook.xlsx.writeBuffer().then(function (buffer) {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `${fileName}.xlsx`;
            anchor.click();
            window.URL.revokeObjectURL(url);
        });
    };

    return (
        <Button color="success" variant="contained" startIcon={<Iconify icon="mdi:microsoft-excel" />} onClick={exportExcelFile} >Export</Button>
    );
};

export default ExportToExcel;
