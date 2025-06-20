'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { useSession, signOut, signIn } from "next-auth/react"
import { Button } from '@/components/ui/button';
import { useFlashcardStore } from '@/stores/flashcard-store';
import { useToast } from "@/hooks/use-toast";
import { Toast } from '@/components/ui/toast';

const AuthForm = () => {
  const { fetchData } = useFlashcardStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { logout } = useFlashcardStore();
  const route = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();



  const handleLogin = async (e) => {
    e.preventDefault();
    
      const res = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password
      })
      console.log(res);
      if(res?.error){
      toast({
        title: "Login Failed",
        description: `${res.error}`,
        variant: "destructive",
      });
      } 

      if (res.status === 200) {
        setEmail('');
        setPassword('');
        toast({
        title: "Success",
        description: `Login Succesfull`,
        variant: "success",
      });
        await fetchData(toast);
      }
      if (res?.url) {
        route.replace('/dashboard');
      }

  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', {
        name: username, email: email, password: password,
      })
      console.log(res);
      toast({
        title: "Succes",
        description: `User Added Succesfully`,
        variant: "succes",
      });
      if (res.data.status === '201') {
        // here provide a implemention for user to fill extra details
        setIslogin(true)
        setEmail('');
        setUsername('');
        setPassword('');
        route.refresh();
      }
    } catch (e) {
      toast({
        title: "Error",
        description: `Error adding User : ${error.message}`,
        variant: "destructive",
      });
      console.error(e);
    }

    console.log({ username, email, password });
  };

  const handleLogout = async () => {
    logout();
    // Call the signOut function from next-auth
    await signOut({ redirect: false });

  }

  const [islogin, setIslogin] = useState(false);

  const toggleForm = () => {
    setIslogin(!islogin)
  }



  if (session) {

    return (
      <div className="pt-16">
        Signed in as {session.user.email} <br />
        <button onClick={handleLogout}>Sign out</button>
      </div>
    )
  }
  return (
    <div className="">
      {islogin ?
        (<div className=" flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">

            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900" id="formTitle">Welcome Back!</h2>

            </div>

            <form className="mt-8 space-y-6" id="authForm">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="you@example.com" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="••••••••" />
              </div>


              <Button
                onClick={handleLogin}
              >
                Login in
              </Button>
            </form>
            <div className="text-center mt-4">
              <button onClick={toggleForm} className="text-sm text-indigo-600 hover:text-indigo-500">
                Don't have an account? Register
              </button>
            </div>
          </div>
        </div>
        ) : (
          <div className=" flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">

              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900" id="formTitle">Create Account</h2>
                <p className="mt-2 text-sm text-gray-600" id="formDescription">Register for a new account</p>
              </div>

              <form className="mt-8 space-y-6" id="authForm">

                <div id="nameField">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    placeholder="John Doe" />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    placeholder="you@example.com" />
                </div>


                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    placeholder="••••••••" />
                </div>


                <Button
                  onClick={handleRegister}
                >
                  Register
                </Button>
              </form>



              <div className="text-center mt-4">
                <button onClick={toggleForm} className="text-sm text-indigo-600 hover:text-indigo-500">
                  Already have an account? Sign In
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>

  )


};

export default AuthForm;
