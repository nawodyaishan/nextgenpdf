import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import React from 'react';
import useDynamicTheme from '@/hooks/use-dynamic-theme';

export default async function Home() {
  const { userId } = auth();
  const { bgGradient } = useDynamicTheme();

  return (
    <div className={`min-h-screen w-screen bg-gradient-to-tr ${bgGradient}`}>
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}>
        <div className={'flex flex-col items-center text-center'}>
          <div className={'spa flex items-center space-x-4'}>
            <h1 className={'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl '}>
              Chat with any PDF
            </h1>
            <UserButton afterSignOutUrl="/sign-up" />
          </div>
          <div className={'mt-2 flex space-x-4'}>
            {userId && (
              <>
                <Button className={`text-white`}>Go to chats</Button>
              </>
            )}
          </div>
          <p className={'mt-2 max-w-xl text-lg text-slate-600'}>
            Connect with millions of students, researchers, and professionals instantly to ask
            questions and comprehend research effortlessly with our AI-powered RAG app. Gain
            insights and understanding from PDF documents with unprecedented ease, unlocking the
            full potential of your research endeavors.
          </p>
          <div className={'mt-4 w-full'}>
            {!!userId ? (
              <FileUpload />
            ) : (
              <Link href={'/sign-in'}>
                <Button className={`text-white`} variant={'default'}>
                  Login to Get Started
                  <LogIn className={'ml-2 mr-2 h-4 w-4'} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
