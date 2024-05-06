'use client';

import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Inbox, Loader2 } from 'lucide-react';
import { FileHelpers } from '@/helpers/file-helpers';
import { Bounce, toast } from 'react-toastify';
import { Progress } from '@/components/ui/progress';
import useDataStore from '@/stores/data-store';
import { AwsUtilsLib } from '@/lib/aws-utils-lib';
import { useAuth } from '@clerk/nextjs';
import { FileUploadingMode } from '@/types/file-uploading-mode';
import { useRouter } from 'next/navigation';

function FileUpload() {
  const { push } = useRouter();
  const [progress, setProgress] = useState<number>(0);
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const { createChat, isLoading, chatResponse } = useDataStore();
  const { userId } = useAuth();
  const [fileUploadingMode, setFileUploadingMode] = useState<FileUploadingMode>(
    FileUploadingMode.idle,
  );

  useEffect(() => {
    const updateFileUploadingMode = () => {
      setFileUploadingMode(FileHelpers.getFileUploadingMode(isLoading, isFileUploading));
    };

    updateFileUploadingMode();
  }, [isFileUploading, isLoading]);

  const setFileUploadingState = () => {
    const fileUploadingState = <Progress value={progress} className="w-[60%]" />;
    const neutralState = (
      <>
        <Inbox className={'h-10 w-10 text-blue-500'} />
        <p className={'mt-2 text-sm text-slate-400'}>Drop PDF Here</p>
      </>
    );
    const fileLoadingState = (
      <>
        <Loader2 className={'anima h-10 w-10 animate-spin text-blue-500'} />
        <p className={'mt-2 text-sm '}>Processing data with GPT...</p>
      </>
    );
    switch (fileUploadingMode) {
      case FileUploadingMode.fileLoading:
        return fileLoadingState;
      case FileUploadingMode.idle:
        return neutralState;
      case FileUploadingMode.fileUploading:
        return fileUploadingState;
      default:
        return neutralState;
    }
  };

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

      if (!userId) {
        console.error('User not authenticated:');
        return;
      }
      const data = await AwsUtilsLib.uploadToAwsS3(file, onProgressUpdate);
      setIsFileUploading(false);
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
      toast.info(`Starting file processing...! : ${data.fileName}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
      await createChat({ ...data, userId: userId });
      if (!chatResponse) {
        return;
      }
      console.log(`File Processing Success! Chat Creation Success! : ${data.fileName}`);
      toast.success(`File Processing Success! Chat Creation in progress... : ${data.fileName}`, {
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
      push(`/chat/${chatResponse.chatId}`);
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
        <>{setFileUploadingState()}</>
      </div>
    </div>
  );
}

export default FileUpload;
