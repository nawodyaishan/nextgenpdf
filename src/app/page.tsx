'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SignOutButton } from '@clerk/nextjs';

export default async function Home() {
  const router = useRouter();

  const navigateToSignUp = () => {
    router.push('/sign-up');
  };

  const navigateToSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <div
      className={
        'min-h-screen w-screen bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600'
      }
    >
      <div className={'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}>
        <Button onClick={navigateToSignUp}>Sign Up</Button>
        <Button onClick={navigateToSignUp}>Sign In</Button>
        <Button>
          <SignOutButton />
        </Button>
      </div>
    </div>
  );
}
