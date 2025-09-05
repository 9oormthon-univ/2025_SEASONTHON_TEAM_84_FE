// FileUpload.tsx
"use client";

import React, { useState } from "react";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-csv", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("업로드 성공!");
      } else {
        const text = await response.text();
        setStatus(`업로드 실패: ${text}`);
      }
    } catch (error) {
      console.error(error);
      setStatus("업로드 중 오류 발생");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>CSV 파일 업로드</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        업로드
      </button>
      <p>{status}</p>
      {file && <p>선택된 파일: {file.name}</p>}
    </div>
  );
};

export default FileUpload;
