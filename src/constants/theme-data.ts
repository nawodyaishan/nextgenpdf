import { Themes } from '@/types/themes';

export const themes: Themes[] = [
  {
    name: 'morning',
    bgGradient: 'from-yellow-300 via-red-300 to-pink-500',
    textColor: 'text-gray-800',
    buttonColor: 'bg-blue-200',
  },
  {
    name: 'late morning',
    bgGradient: 'from-orange-300 via-yellow-500 to-green-500',
    textColor: 'text-gray-700',
    buttonColor: 'bg-yellow-300',
  },
  {
    name: 'noon',
    bgGradient: 'from-light-green-200 via-cyan-500 to-blue-700',
    textColor: 'text-white',
    buttonColor: 'bg-light-blue-200',
  },
  {
    name: 'afternoon',
    bgGradient: 'from-green-300 via-blue-500 to-purple-600',
    textColor: 'text-white',
    buttonColor: 'bg-indigo-200',
  },
  {
    name: 'late afternoon',
    bgGradient: 'from-purple-400 via-blue-500 to-red-600',
    textColor: 'text-gray-300',
    buttonColor: 'bg-pink-200',
  },
  {
    name: 'evening',
    bgGradient: 'from-purple-600 via-blue-500 to-red-500',
    textColor: 'text-gray-300',
    buttonColor: 'bg-red-200',
  },
  {
    name: 'night',
    bgGradient: 'from-gray-900 via-gray-700 to-gray-500',
    textColor: 'text-gray-100',
    buttonColor: 'bg-gray-200',
  },
  {
    name: 'late night',
    bgGradient: 'from-black via-gray-800 to-gray-900',
    textColor: 'text-gray-100',
    buttonColor: 'bg-black',
  },
];
