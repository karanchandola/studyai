'use client';

import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { useSession } from 'next-auth/react';

// Important: Set workerSrc correctly for Next.js
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export default function PdfTextExtractor() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  if (!session) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Please log in to access the PDF Text Extractor</h1>
      </div>
    );
  }
  const extractTextFromPDF = async (file) => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = async function () {
      try {
        const typedarray = new Uint8Array(this.result);
        const loadingTask = pdfjsLib.getDocument({ data: typedarray });
        const pdf = await loadingTask.promise;
        let text = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map(item => item.str).join(' ');
          text += pageText + '\n\n';
        }

        resolve(text);
      } catch (err) {
        reject(err);
      }
    };

    fileReader.readAsArrayBuffer(file);
  });
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!file) return;
  setLoading(true);
  try {
    const rawText = await extractTextFromPDF(file);
    const formatted = formatExtractedText(rawText).join('\n\n');
    setExtractedText(formatted);
    localStorage.setItem('extractedPDFText', formatted);
  } catch (err) {
    console.error('Error extracting PDF:', err);
    setExtractedText('❌ Failed to extract text.');
  } finally {
    setLoading(false);
  }
};


  const loadFromStorage = () => {
    const stored = localStorage.getItem('extractedPDFText');
    if (stored) {
      setExtractedText(stored);
    } else {
      alert("No data found in localStorage!");
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📝 PDF Text Extractor (Frontend Only)</h1>

      <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          {loading ? 'Processing...' : 'Extract Text'}
        </button>
      </form>

      <button onClick={loadFromStorage} className="px-4 py-2 bg-green-500 text-white rounded mb-4">
        Load from Local Storage
      </button>

      {extractedText && (
        <>
          <h2 className="text-xl font-semibold mb-2">Extracted Text:</h2>
          <div className="bg-gray-100 p-4 rounded max-h-[400px] overflow-y-auto whitespace-pre-wrap">
            {extractedText}
          </div>
        </>
      )}
    </div>
  );
}


function formatExtractedText(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return ['No text extracted.'];
  }

  // Remove HTML tags if present (sometimes PDFs may contain embedded tags)
  let cleaned = rawText.replace(/<[^>]*>/g, '');

  // Remove multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ');

  // Handle isolated period lines (PDF sometimes splits period onto next line)
  cleaned = cleaned.replace(/(\. )?[\n\r]+\s*\./g, '. ');

  // Handle newlines after period into normal space
  cleaned = cleaned.replace(/\. *[\n\r]+/g, '. ');

  // Remove random leftover line breaks entirely
  cleaned = cleaned.replace(/[\n\r]+/g, ' ');

  // Remove multiple spaces again after all replacements
  cleaned = cleaned.replace(/\s{2,}/g, ' ');

  // Finally split into small chunks if you want paragraph style
  const paragraphs = cleaned
    .split(/(?<=[.?!])\s+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return paragraphs.length > 0 ? paragraphs : ['No paragraphs found.'];
}


