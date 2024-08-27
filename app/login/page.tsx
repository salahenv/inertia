"use client"
import { useState } from "react";
import { useRouter } from 'next/navigation'


export default function Login() {
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const onLogin = async () => {
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
        alert(resData.message);
      }
        
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <div className="bg-neutral-100 p-4 min-h-screen">
        <div className="flex flex-col mb-16">
          <div className="mb-4 text-gray-800">Login to continue</div>
          <input className="py-2 px-4 mb-2" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
          <input className='py-2 px-4 mb-2' placeholder="password" value = {password} onChange={(e) => setPassword(e.target.value)}></input>
          <button disabled ={!email || !password} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick = {() => onLogin()}>
            Login
          </button>
        </div> 
    
        <div className="flex flex-col mb-4">
          <div className='mb-2 text-gray-800'>Dont have account? Create one</div>
          <button onClick = {() => router.push('/register', { scroll: false })} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Register
          </button>
        </div>
    </div>
  );
}
