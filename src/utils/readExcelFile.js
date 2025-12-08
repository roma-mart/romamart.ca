import * as XLSX from 'xlsx';

// Reads a File object, returns a promise that resolves to an array of objects
export function readExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      // Use first worksheet
      const wsname = workbook.SheetNames[0];
      const ws = workbook.Sheets[wsname];
      // Convert to JSON: header row = keys
      const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
      resolve(data);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
}
