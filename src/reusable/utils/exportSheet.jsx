import React from "react";
import * as ExcelJS from "exceljs";
import { Button } from "@mui/material";
import Iconify from "../../components/iconify/Iconify";

const ExportToExcel = ({ headers, data, fileName }) => {
    const exportExcelFile = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("My Sheet");
        sheet.properties.defaultRowHeight = 15;
        // sheet.properties.defaultColWidth = 30;

        const excelColor = { argb: 'FF2e8960' };
        const fontSize = 9; // Decreased font size

        headers.forEach((header, index) => {
            const cell = sheet.getCell(1, index + 1);
            cell.value = header.label;
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: header.backgroundColor || "FFFFFF" },
            };
            cell.font = {
                // name: 'Times New Roman',
                size: fontSize, // Set font size
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

        // Add data
        data.forEach((row, rowIndex) => {
            headers.forEach((header, colIndex) => {
                const cell = sheet.getCell(rowIndex + 2, colIndex + 1);
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

        //Adjust column widths to fit content
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
