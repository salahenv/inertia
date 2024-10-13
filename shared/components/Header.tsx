"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { NextIcon, RightArrowIcon } from '../icons';
import Link from 'next/link';
import Image from 'next/image';

const Header = ({
  btnText,
  showMenu = false
  } : any) => {

    const router = useRouter();
    const onButtonClick = () => {
      if(btnText === 'Todo') {
        router.push('/todo');
      }
      if(btnText === 'Focus') {
        router.push('/focus');
      }
    }

    const [selectedMenu, setSelectedMenu] = useState('');

    useEffect(() => {
      const url  = window.location.href;
      console.log(url);
      if( url.includes('/focus')){
        setSelectedMenu('focus');
      } else if(url.includes('/routine')) {
        setSelectedMenu('routine');
      } else if(url.includes('/todo')) {
        setSelectedMenu('todo');
      }
    }, []);

  return (
    <div className='shadow z-10 sticky top-0 bg-white px-4 py-2 border-b border-solid border-gray-400 flex items-center justify-between'>
      <Link href = '/'>
        <div className="flex items-center mr-8">
          <Image 
            width={40}
            height={40}
            src = "/icons/icon-192x192.png"
            alt = 'logo'
          />
          {/* <div className='font-bold  text-2xl text-blue-600 cursor-pointer'>Inertia</div> */}
        </div>
      </Link>
      { showMenu ?
      <div className='flex'>
        <Link href = '/focus'>
          <div className={
            `font-medium cursor-pointer text-xl ml-4 hover:text-blue-500 ${selectedMenu === 'focus' ? 'text-blue-600 border-b-4 border-blue-600': 'text-gray-600'}`
          }>Focus</div>
        </Link>
        <div className='relative group ml-4 z-50'>
          <div  className={
            `font-medium cursor-pointer text-xl hover:text-blue-500 ${selectedMenu === 'todo' ? 'text-blue-600 border-b-4 border-blue-600': 'text-gray-600'}`
          }>Todo</div>
          <div className='absolute hidden group-hover:block bg-white shadow p-2 rounded'>
            <Link href = '/todo'>
              <div className='text-gray-600 mb-1'>Today</div>
            </Link>
            <Link href = '/todo/completed'>
              <div className='text-gray-600 mb-1'>Completed</div>
            </Link>
            <Link href = '/todo/archived'>
              <div className='text-gray-600'>Archived</div>
            </Link>
          </div>
        </div>
        <Link href = '/routine'>
          <div className={
            `font-medium ml-4 cursor-pointer text-xl hover:text-blue-500 ${selectedMenu === 'routine' ? 'text-blue-600 border-blue-600 border-b-4': 'text-gray-600'}`
          }>Routine</div>
        </Link>
      </div> : null
      }
    </div>
  );
};

export default Header;