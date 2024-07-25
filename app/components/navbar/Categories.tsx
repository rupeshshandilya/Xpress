'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import {
  GiHairStrands,
} from 'react-icons/gi';

import { menu } from './menu';
import MenuItems from './MenuItem';

export const categories = [
  { label: 'Hair Salon', icon: GiHairStrands, description: 'Hair Salon' },
];

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get('category');
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  if (!isMainPage) {
    return null;
  }

  return (
    <div className="w-full bg-[#72959A] sm:block hidden">
      <div className="flex w-full items-center justify-center gap-20  list-none py-4">
        {/* {menu.map((men, index) => {
          const depthLevel = 0;
          return (
            <MenuItems
              items={men}
              key={index}
              depthLevel={depthLevel}
              selected={category === men.title}
            />
          );
        })} */}
      </div>
    </div>
  );
};

export default Categories;
