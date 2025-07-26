import jsPDF from 'jspdf';
import { GridRow } from '../types/grid';

export const exportToPDF = async (data: GridRow[]) => {
  const pdf = new jsPDF();

  pdf.setFontSize(16);
  pdf.text('Data Grid Export', 14, 22);
  
  pdf.setFontSize(10);
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  let yPosition = 45;
  
  data.forEach((row, index) => {
    if (yPosition > 280) {
      pdf.addPage();
      yPosition = 20;
    }
    
    const rowText = Object.entries(row)
      .filter(([key]) => key !== 'id')
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    
    pdf.text(rowText.substring(0, 100), 14, yPosition);
    yPosition += 10;
  });
  
  pdf.save('data-grid-export.pdf');
};

export const exportToCSV = (data: GridRow[], filename = 'data-export.csv') => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]).filter(key => key !== 'id');
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const printGrid = () => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const gridElement = document.querySelector('[data-grid-container]');
  if (!gridElement) return;
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Data Grid Print</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${gridElement.innerHTML}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.print();
};