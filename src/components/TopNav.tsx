'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { UserButton } from '@clerk/nextjs';

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Chat',
    href: '/chat/1',
    description: 'Start chatting with PDF documents.',
  },
];

export type TopNavBarProps = {
  isUserSignedIn: boolean;
};

export default function TopNavBar(props: TopNavBarProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="ml-2 text-xl font-bold text-gray-900">NextGenPDF</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-4">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[300px] lg:w-[400px] lg:grid-cols-2">
                      {props.isUserSignedIn ? (
                        <>
                          <ListItem key={'Chat'} title={'Chat'} href={'/chat/1'}>
                            View previous chats with PDF documents
                          </ListItem>
                        </>
                      ) : (
                        <>
                          <ListItem key={'Sign-In'} title={'Sign In'} href={'/sign-in'}>
                            Login to your account
                          </ListItem>
                          <ListItem key={'Sign-Up'} title={'Sign Up'} href={'/sign-up'}>
                            Create your account
                          </ListItem>
                          <ListItem key={'profile'} title={'Profile'}>
                            <UserButton />
                          </ListItem>
                        </>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900',
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-gray-500">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = 'ListItem';
