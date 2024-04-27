import { SignUp } from '@clerk/nextjs';

export default async function Home() {
  return <SignUp path="/sign-up" />;
}
