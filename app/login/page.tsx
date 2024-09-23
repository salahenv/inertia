"use client"
import { useState } from "react";
import { useRouter } from 'next/navigation'
import Spinner from "@/shared/components/Spinner";


export default function Login() {
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({username: email, password}),
            credentials: 'include'
        }
      );
      const resData = await res.json();
      if(resData.success) {
        router.push('/');
      }
      else {
        router.push('/login');
      }
        
    } catch (error) {
      alert(JSON.stringify(error))
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-neutral-200 p-4 min-h-screen">
      <div className="flex justify-center">
        <div className="w-full p-0 shadow-none md:w-1/3 md:shadow md:p-4 md:bg-neutral-100">
          <div className="flex flex-col mb-16">
            <div className="mb-4 text-gray-800">Login to continue</div>
            <input type='email'  required className="py-2 px-4 mb-2 text-gray-800" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            <input type='password' required className='py-2 px-4 mb-2 text-gray-800' placeholder="password" value = {password} onChange={(e) => setPassword(e.target.value)}></input>
            <button disabled ={!email || !password} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick = {() => onLogin()}>
              {isLoading ? <div className="flex justify-center"><Spinner/></div> : "Login"}
            </button>
          </div> 
          <div className="flex flex-col mb-4">
            <div className='mb-2 text-gray-800'>Dont have account? Create one</div>
            <button onClick = {() => router.push('/register', { scroll: false })} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
