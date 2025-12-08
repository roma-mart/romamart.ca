import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

// path: where your Excel file is (e.g. '/data/rocafe_menu.xlsx')
export function useExcelMenu(path = "./rocafe_menu.xlsx") {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false; // to avoid setState after unmount
  
    const fetchExcel = async () => {
      try {
        if (!cancelled) setLoading(true);
        const res = await fetch(path);
        if (!res.ok) throw new Error("Failed to fetch Excel file");
        const arrayBuffer = await res.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const ws = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
        if (!cancelled) setMenuItems(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load Excel file");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
  
    fetchExcel();
  
    return () => { cancelled = true; };
    }, [path]);
  

  return { menuItems, loading, error };
}
