'use client';

import * as React from 'react';
import Link from 'next/link';

export default function FooterNavigation() {
  return (
    <footer className="bg-gray-900 py-6 text-gray-200">
      <div className="mx-auto flex flex-col items-center space-y-4">
        <div className="flex space-x-4">
          <Link href={'/'} className="text-gray-400 hover:text-gray-200">
            Home
          </Link>
          <Link href={'/chat/1'} className="text-gray-400 hover:text-gray-200">
            Chats
          </Link>
          <Link href={'/'} className="text-gray-400 hover:text-gray-200">
            Source
          </Link>
          <Link href={'/'} className="text-gray-400 hover:text-gray-200">
            Stripe
          </Link>
          <Link href={'/'} className="text-gray-400 hover:text-gray-200">
            Contact
          </Link>
          <Link href={'/'} className="text-gray-400 hover:text-gray-200">
            About Us
          </Link>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} NextGenPDF by Nawodya Ishan</p>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm"> v0.1.3</p>
        </div>
      </div>
    </footer>
  );
}
