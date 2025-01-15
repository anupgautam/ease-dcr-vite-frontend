import React from "react";
import * as ExcelJS from "exceljs";
import { Button } from "@mui/material";
import Iconify from "../../components/iconify/Iconify";

const ChatExpenses = () => {
    const exportExcelFile = () => {
        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("May Expenses");

        // Add header row
        worksheet.addRow([
            "Date",
            "Morning",
            "",
            "Evening",
            "",
            "D.A",
            "Ex stat'n allwc",
            "N.S Allwc",
            "K.M",
            "Fare @/km",
            "Postage",
            "Tel. Exp.",
            "Misc",
            "Total",
        ]);

        // Merge relevant header cells
        worksheet.mergeCells("B1:C1"); // Morning
        worksheet.mergeCells("D1:E1"); // Evening

        // Add sub-header row
        worksheet.addRow([
            "",
            "From",
            "To",
            "From",
            "To",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ]);

        // Add data rows
        const data = [
            ["2", "NTHC", "TUTH", "off", "Gongyl", "", "380", "", "", "500", "", "", "1250", "2130"],
            ["3", "off", "TUTH", "off", "Swayambhu", "", "380", "", "", "500", "", "", "", "880"],
            ["4", "off", "TUTH", "off", "Tripureshwar", "", "380", "", "", "440", "", "", "", "820"],
            ["5", "", "", "", "", "Holiday", "", "", "", "", "", "", "", ""],
            ["6", "off", "TUTH", "off", "G.City", "", "380", "", "", "460", "", "", "", "840"],
            ["7", "off", "Teka", "off", "Kotesh", "", "380", "", "", "900", "", "", "", "1280"],
            ["8", "off", "Swyambu", "off", "Puslak", "", "380", "", "", "390", "", "", "", "770"],
            ["9", "off", "TUTH", "off", "Gongyl", "", "380", "", "", "500", "", "", "", "880"],
            ["10", "off", "TUTH", "off", "Swayambhu", "", "380", "", "", "500", "", "", "", "880"],
            ["11", "off", "TUTH", "off", "Tripureshwar", "", "380", "", "", "440", "", "", "", "820"],
            ["12", "", "", "", "", "Saturday", "", "", "", "", "", "", "", ""],
        ];

        // Add each data row to the worksheet
        data.forEach((row) => {
            worksheet.addRow(row);
        });

        // Adjust column widths
        worksheet.columns = [
            { width: 5 },  // Date
            { width: 10 }, // Morning From
            { width: 10 }, // Morning To
            { width: 10 }, // Evening From
            { width: 10 }, // Evening To
            { width: 15 }, // D.A
            { width: 15 }, // Ex stat'n allwc
            { width: 10 }, // N.S Allwc
            { width: 10 }, // K.M
            { width: 10 }, // Fare @/km
            { width: 10 }, // Postage
            { width: 10 }, // Tel. Exp.
            { width: 10 }, // Misc
            { width: 10 }, // Total
        ];

        // Generate Excel file and trigger download
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "MPOWala.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        });
    };

    return (
        <Button
            color="success"
            variant="contained"
            startIcon={<Iconify icon="mdi:microsoft-excel" />}
            onClick={exportExcelFile}
        >
            Export
        </Button>
    );
};

export default ChatExpenses;
