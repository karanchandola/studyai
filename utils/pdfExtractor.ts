// import * as pdfjsLib from 'pdfjs-dist';

// // Set up the worker - using a more reliable CDN
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.min.js`;

// export interface ExtractedPDFData {
//   text: string;
//   pageCount: number;
//   metadata?: {
//     title?: string;
//     author?: string;
//     subject?: string;
//     creator?: string;
//     producer?: string;
//     creationDate?: Date;
//     modificationDate?: Date;
//   };
// }

// export async function extractTextFromPDF(file: File): Promise<ExtractedPDFData> {
//   try {
//     // Convert file to ArrayBuffer
//     const arrayBuffer = await file.arrayBuffer();
    
//     // Load the PDF document
//     const pdf = await pdfjsLib.getDocument({ 
//       data: arrayBuffer,
//       // Disable font loading to speed up processing
//       disableFontFace: true,
//       // Enable text extraction optimizations
//       useSystemFonts: true
//     }).promise;
    
//     // Extract metadata
//     // let metadata;
//     // try {
//     //   const pdfMetadata = await pdf.getMetadata();
//     //   metadata = {
//     //     title: pdfMetadata.info?.Title || undefined,
//     //     author: pdfMetadata.info?.Author || undefined,
//     //     subject: pdfMetadata.info?.Subject || undefined,
//     //     creator: pdfMetadata.info?.Creator || undefined,
//     //     producer: pdfMetadata.info?.Producer || undefined,
//     //     creationDate: pdfMetadata.info?.CreationDate ? new Date(pdfMetadata.info.CreationDate) : undefined,
//     //     modificationDate: pdfMetadata.info?.ModDate ? new Date(pdfMetadata.info.ModDate) : undefined,
//     //   };
//     // } catch (metadataError) {
//     //   console.warn('Could not extract PDF metadata:', metadataError);
//     //   metadata = {};
//     // }
    
//     let fullText = '';
//     const pageCount = pdf.numPages;
    
//     // Extract text from each page
//     for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
//       try {
//         const page = await pdf.getPage(pageNum);
//         const textContent = await page.getTextContent();
        
//         // Combine text items from the page with better formatting
//         const pageTextItems = textContent.items
//           .filter((item: any) => item.str && item.str.trim()) // Filter out empty strings
//           .map((item: any) => {
//             // Handle text positioning for better formatting
//             const str = item.str.trim();
//             return str;
//           });
        
//         if (pageTextItems.length > 0) {
//           const pageText = pageTextItems.join(' ');
//           fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
//         }
        
//         // Clean up page resources
//         page.cleanup();
//       } catch (pageError) {
//         console.warn(`Error extracting text from page ${pageNum}:`, pageError);
//         fullText += `\n--- Page ${pageNum} ---\n[Error extracting text from this page]\n`;
//       }
//     }
    
//     // Clean up the text
//     const cleanedText = fullText
//       .replace(/\s+/g, ' ') // Replace multiple spaces with single space
//       .replace(/\n\s*\n/g, '\n\n') // Clean up multiple newlines
//       .replace(/\n--- Page \d+ ---\n/g, '\n\n--- Page $& ---\n\n') // Better page separation
//       .trim();
    
//     // Clean up PDF resources
//     pdf.destroy();
    
//     return {
//       text: cleanedText,
//       pageCount,
//     };
//   } catch (error) {
//     console.error('Error extracting text from PDF:', error);
    
//     // Provide more specific error messages
//     if (error instanceof Error) {
//       if (error.message.includes('Invalid PDF')) {
//         throw new Error('Invalid PDF file. Please ensure the file is not corrupted.');
//       } else if (error.message.includes('password')) {
//         throw new Error('This PDF is password-protected. Please provide an unlocked version.');
//       } else if (error.message.includes('network')) {
//         throw new Error('Network error while loading PDF processing library. Please check your connection.');
//       } else {
//         throw new Error(`Failed to extract text from PDF: ${error.message}`);
//       }
//     } else {
//       throw new Error('Failed to extract text from PDF: Unknown error occurred');
//     }
//   }
// }

// export function validatePDFFile(file: File): boolean {
//   return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
// }

// export function formatFileSize(bytes: number): string {
//   if (bytes === 0) return '0 Bytes';
  
//   const k = 1024;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
  
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// }