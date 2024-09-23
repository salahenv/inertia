"use client"
import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import Spinner from "@/shared/components/Spinner";


export default function Register() {
  const[name, setName] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onRegister = async () => {
    try {
      setIsLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({name, username: email, password})
        });
        router.push('/login', { scroll: false });
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-neutral-200 p-4 min-h-screen">
       <div className="flex justify-center">
        <div className="w-full p-0 shadow-none md:w-1/3 md:shadow md:p-4 md:bg-neutral-100">
          <div className="flex flex-col mb-16">
            <div className="mb-4 text-gray-800">Create Account</div>
            <input required type='text' className="py-2 px-4 mb-2 text-gray-800" placeholder="name" value={name} onChange={(e) => setName(e.target.value)}></input>
            <input required type='email' className="py-2 px-4 mb-2 text-gray-800" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            <input required type="password" className='py-2 px-4 mb-2 text-gray-800' placeholder="password" value = {password} onChange={(e) => setPassword(e.target.value)}></input>
            <button disabled={!name || !email || !password} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick = {() => onRegister()}>
            {isLoading ? <div className="flex justify-center"><Spinner /></div> : "Register"}
            </button>
          </div> 
          <div className="flex flex-col mb-4">
            <div className='mb-2 text-gray-800'>Already Account? Login</div>
            <button onClick = {() => router.push('/login', { scroll: false })} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </button>
          </div>
        </div>
       </div>   
    </div>
  );
}
