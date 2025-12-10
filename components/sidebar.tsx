"use client"

import Link from "next/link"

export function Sidebar() {
  return (
    <aside className="w-80 flex-shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-6">
        {/* Info Section */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-3">
            Confessions good for the soul!
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Confess your deepest, darkest secrets without worrying about anyone finding out your true ego. Be honest to strangers, we're all here to revel in our questionable life choices.
          </p>
        </div>

        {/* Links Section */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <Link 
                href="/user-agreement"  
                className="block text-gray-400 hover:text-white transition-colors"
              >
                User Agreement       
              </Link>
              <Link 
                href="/privacy-policy" 
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
            <div className="space-y-2">
              <Link 
                href="/contact" 
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
              <Link 
                href="/about" 
                className="block text-gray-400 hover:text-white transition-colors"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-500 text-center">
          © sayitlpu. All rights reserved.
        </div>
      </div>
    </aside>
  )
}

