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

  return (
    <div className='shadow z-10 sticky top-0 bg-white px-4 py-2 border-b border-solid border-gray-400 flex items-center'>
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
          <div className='font-medium cursor-pointer text-xl text-gray-600 ml-4 hover:text-gray-900'>Focus</div>
        </Link>
        <div className='relative group ml-4 z-50'>
          <div className='font-medium cursor-pointer text-xl text-gray-600 hover:text-gray-900'>Todo</div>
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
        <Link href = '/todo/routine'>
          <div className='font-medium cursor-pointer text-xl text-gray-600 ml-4 hover:text-gray-900'>Routine</div>
        </Link>
      </div> : null
      }
    </div>
  );
};

export default Header;