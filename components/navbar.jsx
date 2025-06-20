'use client'
import * as React from "react";
import { ModeToggle } from "./modetoggle";
import Link from 'next/link';
import Image from 'next/image';


import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { Button } from './ui/button';
import { NavigationMenuDemo } from './navigationmenu';
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {

  const { data: session} = useSession();

  const LogOut = async () => {
    await signOut({ redirect: false });
  }
  


  return (
    <div className='fixed w-full z-50 top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50'>
      <div className=' border-b  flex justify-between items-center p-3'>
        <div className="logo">
          <Link href={'/'} className='text-3xl font-[Alternity]'>UNI-ED</Link>
        </div>
        <div>
          <NavigationMenuDemo />
        </div>

        <div>
          <ul className='flex gap-x-4 items-center'>
            <li className='inline-flex items-center justify-centertransition-colors '>
              <Button variant="outlined" size="icon">
                <Link href={'/chatai'}>
                  <Image
                    className="dark:invert"
                    src="/Message.svg"
                    alt="message"
                    width={20}
                    height={20}
                  />
                </Link>
              </Button>
            </li>
            <li>
              <ModeToggle />
            </li>
            <li>
              {
                session ? (
                  <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>User</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="flex flex-col gap-y-5">
                        
                        <li title="Dashboard">
                          <Link href="/dashboard">Dashboard</Link>
                        </li>
                        <li onClick={LogOut} title="Logout" className="text-red-700 cursor-pointer">
                          LogOut
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
                ):(
                  <Button variant="outlined" size="icon">
                <Link href={'/AuthForm'}>
                  <Image
                    className="dark:invert"
                    src="/adduser.svg"
                    alt="Vercel logomark"
                    width={20}
                    height={20}
                  />
                </Link>
              </Button>
                )
              }
              
              
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar


