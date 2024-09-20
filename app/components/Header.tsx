"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { NextIcon, RightArrowIcon } from '../icons';
import Link from 'next/link';
import Image from 'next/image';

const Header = ({
  btnText
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
    <div className='shadow z-10 sticky top-0 bg-white px-4 py-2 border-b border-solid border-gray-400 flex justify-between'>
      <Link href = '/'>
        <div className="flex items-center">
          <Image 
            width={40}
            height={40}
            src = "/icons/icon-192x192.png"
            alt = 'logo'
          />
          {/* <div className='font-bold  text-2xl text-blue-600 cursor-pointer'>Inertia</div> */}
        </div>
      </Link>
      {
        btnText ? 
        <button onClick={onButtonClick} className='flex items-center cursor-pointer'>
          <span className='mr-2 font-medium text-lg text-blue-600'>{btnText}</span>
          <NextIcon size = {"16px"} />
        </button> : null 
      } 
    </div>
  );
};

export default Header;
