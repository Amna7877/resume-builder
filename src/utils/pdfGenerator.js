// src/utils/pdfGenerator.js
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (elementRef, filename = 'resume.pdf') => {
  if (!elementRef || !elementRef.current) {
    console.error('Element reference not found');
    return false;
  }

  try {
    const element = elementRef.current;
    
    // Save original styles
    const originalOverflow = element.style.overflow;
    const originalBackground = element.style.background;
    
    // Set PDF-friendly styles
    element.style.overflow = 'visible';
    element.style.background = '#ffffff';
    
    // Add a4 paper size styling
    const originalWidth = element.style.width;
    const originalHeight = element.style.height;
    element.style.width = '210mm';
    element.style.minHeight = '297mm';
    element.style.padding = '20mm';
    
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      removeContainer: true,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(element.id);
        if (clonedElement) {
          clonedElement.style.background = '#ffffff';
          clonedElement.style.width = '210mm';
          clonedElement.style.minHeight = '297mm';
          clonedElement.style.padding = '20mm';
          clonedElement.style.overflow = 'visible';
        }
      }
    });

    // Restore original styles
    element.style.overflow = originalOverflow;
    element.style.background = originalBackground;
    element.style.width = originalWidth;
    element.style.height = originalHeight;
    element.style.padding = '';
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, '', 'FAST');
    
    // Save the PDF
    pdf.save(filename);
    return true;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

export const previewPDF = async (elementRef) => {
  if (!elementRef || !elementRef.current) {
    return null;
  }

  try {
    const canvas = await html2canvas(elementRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    });

    return canvas.toDataURL('image/png');
    
  } catch (error) {
    console.error('Error generating preview:', error);
    return null;
  }
};