import { Upload } from 'lucide-react';
import { useRef, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  onUpload: (file: File) => void;
  accept?: string;
  label?: string;
}

const FileUploader = ({ onUpload, accept = '.xlsx', label = 'Choisir un fichier' }: FileUploaderProps) => {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFileName(file.name);
      onUpload(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${
        isDragActive ? 'border-blue-600 bg-blue-100' : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2">
        <Upload size={28} className="text-blue-700" />
        <p className="text-sm text-blue-800 font-medium">
          {isDragActive ? 'Déposez votre fichier ici...' : 'Glissez-déposez un fichier Excel ici ou cliquez pour parcourir'}
        </p>
        <span className="text-xs text-gray-500">(Formats acceptés : .xlsx)</span>
      </div>
      {fileName && (
        <p className="mt-4 text-sm text-gray-600 italic">Fichier sélectionné : {fileName}</p>
      )}
    </div>
  );
};

export default FileUploader;
