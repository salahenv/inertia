"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { NextIcon, RightArrowIcon } from '../icons';
import Link from 'next/link';

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
    <div className='shadow z-10 sticky top-0 bg-neutral-100 px-4 py-2 border-b border-solid border-gray-400 flex justify-between'>
      <Link href = '/'>
        <div className="font-bold  text-2xl text-blue-600 cursor-pointer">Inertia</div>
      </Link>
      {
        btnText ? 
        <div className='flex items-center cursor-pointer'>
          <div onClick={onButtonClick} className='mr-2 font-medium text-lg text-blue-600'>{btnText}</div>
          <NextIcon size = {"16px"} />
        </div> : null 
      } 
    </div>
  );
};

export default Header;
