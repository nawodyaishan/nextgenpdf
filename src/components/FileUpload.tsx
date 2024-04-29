'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Inbox } from 'lucide-react';

function FileUpload() {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      console.log('📁 - Accept Files:', acceptedFiles);
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
        <>
          <Inbox className={'h-10 w-10 text-blue-500'} />
          <p className={'mt-2 text-sm text-slate-400'}>Drop PDF Here</p>
        </>
      </div>
    </div>
  );
}

export default FileUpload;
