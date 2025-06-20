"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Github, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-orange-200/20 dark:border-orange-800/20">
      <div className="bg-gradient-to-t from-background to-orange-50/25 dark:to-orange-950/10">
        <div className="container px-12 py-9 ">


          {/* Social Links & Copyright */}
          <div className="mt-12 pt-8  ">
            <div className="flex md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                © 2025 UNI-ED. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;