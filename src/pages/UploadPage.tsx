import FileUpload from "../components/FileUpload";

export default function UploadPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <h1 className="text-2xl font-bold mb-6">착한가격업소 데이터 업로드</h1>
      <FileUpload />
    </div>
  );
}
