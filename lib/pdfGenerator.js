import { pdf } from '@react-pdf/renderer';
import DynamicPDFDocument from './DynamicPDFDocument';

/**
 * Generate and open PDF in browser
 * @param {Object} config - PDF configuration object
 */
export const generatePDF = async (config) => {
  try {
    const blob = await pdf(<DynamicPDFDocument config={config} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');

    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Download PDF file
 * @param {Object} config - PDF configuration object
 * @param {string} filename - Optional custom filename
 */
export const downloadPDF = async (config, filename) => {
  try {
    const finalFilename = filename || config.metadata?.filename || 'document.pdf';
    
    const blob = await pdf(<DynamicPDFDocument config={config} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};

/**
 * Get PDF as blob
 * @param {Object} config - PDF configuration object
 * @returns {Promise<Blob>}
 */
export const getPDFBlob = async (config) => {
  try {
    return await pdf(<DynamicPDFDocument config={config} />).toBlob();
  } catch (error) {
    console.error('Error creating PDF blob:', error);
    throw error;
  }
};
