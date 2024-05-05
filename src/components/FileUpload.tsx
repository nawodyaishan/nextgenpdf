'use client';

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Inbox, Loader2 } from 'lucide-react';
import { FileHelpers } from '@/helpers/file-helpers';
import { AwsUtilsLib } from '@/lib/aws-utils';
import { Bounce, toast } from 'react-toastify';
import { Progress } from '@/components/ui/progress';
import useDataStore from '@/stores/data-store';

function FileUpload() {
  const [progress, setProgress] = useState<number>(0);
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const { createChat, isLoading } = useDataStore();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      setIsFileUploading(true);
      console.log('📁 - Accept Files:', acceptedFiles);
      const file = acceptedFiles[0];
      if (!FileHelpers.validateFileSize(file, 10 * 1024 * 1024)) {
        setIsFileUploading(false);
        return;
      }

      const onProgressUpdate = (progress: React.SetStateAction<number>) => {
        setProgress(progress);
      };

      const data = await AwsUtilsLib.uploadToAwsS3(file, onProgressUpdate);
      const response = await createChat(data);
      if (!response) {
        setIsFileUploading(false);
        return;
      }
      console.log(`File Upload Success! : ${data.fileName}`);
      toast.success(`File Upload Success! : ${data.fileName}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });

      setIsFileUploading(false);
    },
  });
  return (
    <div className={'rounded-xl bg-white p-2'}>
      <div
        {...getRootProps({
          className:
            'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col',
        })}
      >
        <input {...getInputProps()} />
        {isLoading && (
          <>
            <Loader2 className={'anima h-10 w-10 animate-spin text-blue-500'} />
            <p className={'mt-2 text-sm '}>Processing data with GPT...</p>
          </>
        )}
        {!isFileUploading && !isLoading ? (
          <>
            <Inbox className={'h-10 w-10 text-blue-500'} />
            <p className={'mt-2 text-sm text-slate-400'}>Drop PDF Here</p>
          </>
        ) : (
          <Progress value={progress} className="w-[60%]" />
        )}
      </div>
    </div>
  );
}

export default FileUpload;
