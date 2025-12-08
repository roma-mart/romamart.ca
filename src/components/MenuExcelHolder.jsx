import React, { useState } from "react";
import { readExcelFile } from "../utils/readExcelFile"; // wherever you put the function above

export default function MenuExcelLoader({ onLoad }) {
  const [menuItems, setMenuItems] = useState([]);
  const [filename, setFilename] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFilename(file.name);
    try {
      const data = await readExcelFile(file);
      setMenuItems(data);
      if (onLoad) onLoad(data); // parent callback
    } catch (err) {
      alert("Error loading Excel file: " + err.message);
    }
  };

  return (
    <div style={{ margin: "2rem 0" }}>
      <label>
        <b>Upload Excel Menu:</b>{" "}
        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      </label>
      {filename && <div>Loaded: <b>{filename}</b></div>}
      {menuItems.length > 0 && (
        <pre style={{ maxHeight: 200, overflow: "auto", fontSize: 12 }}>
          {JSON.stringify(menuItems, null, 2)}
        </pre>
      )}
    </div>
  );
}
