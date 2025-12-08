import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

// path: where your Excel file is (e.g. '/data/rocafe_menu.xlsx')
export function useExcelMenu(path = "./rocafe_menu.xlsx") {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(path)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch Excel file");
        return res.arrayBuffer();
      })
      .then(arrayBuffer => {
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
        setMenuItems(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to load Excel file");
        setLoading(false);
      });
  }, [path]);

  return { menuItems, loading, error };
}
