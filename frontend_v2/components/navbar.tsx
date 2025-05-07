"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full text-white" style={{ backgroundColor: "#2E2E2E" }}>
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-zinc-900 text-white">
              <div className="flex flex-col gap-6 pt-6">
                <div className="mb-4">
                  <Image
                    src="/images/zeitzeugen-logo.png"
                    alt="ZEITZEUGEN"
                    width={200}
                    height={40}
                    className="h-auto"
                  />
                </div>
                <Link href="/" className="text-xl font-bold" onClick={() => setIsMenuOpen(false)}>
                  HOME
                </Link>
                <Link href="/timeline" className="text-xl font-bold" onClick={() => setIsMenuOpen(false)}>
                  TIMELINE
                </Link>
                <Link href="/witnesses" className="text-xl font-bold" onClick={() => setIsMenuOpen(false)}>
                  WITNESSES
                </Link>
                <div className="flex flex-col gap-2">
                  <div className="text-xl font-bold">UPLOAD</div>
                  <Link href="/upload/photos" className="pl-4 text-lg" onClick={() => setIsMenuOpen(false)}>
                    Photos
                  </Link>
                  <Link href="/upload/documents" className="pl-4 text-lg" onClick={() => setIsMenuOpen(false)}>
                    Documents
                  </Link>
                  <Link href="/upload/videos" className="pl-4 text-lg" onClick={() => setIsMenuOpen(false)}>
                    Videos
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center">
            <Image src="/images/zeitzeugen-logo.png" alt="ZEITZEUGEN" width={150} height={30} className="h-auto" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="font-medium hover:text-gray-300">
            HOME
          </Link>
          <Link href="/timeline" className="font-medium hover:text-gray-300">
            TIMELINE
          </Link>
          <Link href="/witnesses" className="font-medium hover:text-gray-300">
            WITNESSES
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="font-medium hover:text-gray-300 flex items-center gap-1 p-0">
                UPLOAD <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-800 text-white border-zinc-700">
              <DropdownMenuItem className="hover:bg-zinc-700">
                <Link href="/upload/photos" className="w-full">
                  Photos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-zinc-700">
                <Link href="/upload/documents" className="w-full">
                  Documents
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-zinc-700">
                <Link href="/upload/videos" className="w-full">
                  Videos
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/subscribe" className="hidden md:block text-sm font-medium hover:text-gray-300">
            Subscribe
          </Link>
          <Link href="/login" className="hidden md:block text-sm font-medium hover:text-gray-300">
            Login
          </Link>
          <Button variant="ghost" size="icon" className="text-white">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
