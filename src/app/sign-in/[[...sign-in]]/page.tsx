import { SignIn } from '@clerk/nextjs';

export default async function Home() {
  return <SignIn path="/sign-in" />;
}
