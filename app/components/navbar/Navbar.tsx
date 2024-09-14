'use client';

import { SafeUser } from '@/app/types';
import Image from 'next/image';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';

import Categories from './Categories';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import useSetupBusiness from '@/app/hooks/useSetupBusiness';
import UserMenu from './UserMenu';
import Search from './Search';
import Link from 'next/link';

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const bussinessModal = useSetupBusiness();
  const loginModal = useLoginModal();
  const navBarItems = [
    { id: 0, name: 'Home', link: '/' },
    { id: 1, name: 'About', link: '/about' },
    { id: 2, name: 'Contact', link: '/contact' },
  ];

  return (
    <div className="w-full z-10 fixed border-none outline-none text-gray-400 shadow-sm mb-8">
      <div className="flex flex-row justify-between items-center py-3 px-4 sm:px-20 bg-[#000000]">
        <Link className="cursor-pointer" 
        href={"https://www.thexpresssalon.com/"}>
          <Image
            onClick={() => router.push('/')}
            className=" md:block cursor-pointer"
            src="/images/companylogo.png"
            height="200"
            width="60"
            alt="Logo"
          /> 
        </Link>

        <UserMenu currentUser={currentUser} />
      </div>
    </div>
  );
};

export default Navbar;
