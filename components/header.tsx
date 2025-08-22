"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    BotIcon,
  DatabaseIcon,
  HomeIcon,
  MenuIcon,
  SparklesIcon,
} from "lucide-react"

export function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <header className="sticky top-0 border-b border-border/40 bg-background z-10 shadow-sm">
      <div className="flex items-center justify-between px-6 h-12">
        {/* Logo and Navigation */}
        <div className="flex items-center">
          <div className="flex items-center mr-10">
            {/* Fake logo images  */}
            <img
              src="https://placehold.co/24x24/8b5cf6/ffffff?text=M"
              alt="Logo"
              className="h-6 w-6 rounded-md object-contain mr-2"
            />
          </div>
          {/* Non-clickable navigation labels */}
          <nav className="hidden md:flex items-center space-x-6">
            <span className="text-sm text-muted-foreground flex items-center">
                <HomeIcon className="h-4 w-4 mr-1" />
                Dashboard</span>
            <span className="text-sm text-muted-foreground flex items-center">
                <DatabaseIcon className="h-4 w-4 mr-1" />
                Data Sources</span>
            <span className="text-sm text-muted-foreground flex items-center">
                <BotIcon className="h-4 w-4 mr-1" />
                Agents</span>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-5">
          <Button
            size="sm"
            className="h-8 px-3 bg-black text-white hover:bg-zinc-900"
            onClick={() => router.push("/generate-workflow")}
          >
            <SparklesIcon className="h-4 w-4 mr-2" />
            Create Agent
          </Button>
          {/* User avatar with fake initials */}
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full font-medium bg-orange-400"
            aria-label="User menu"
          >
            JD
          </Button>
          {/* <div className="flex items-center gap-x-1">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8">
              <HelpCircleIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground h-8 w-8">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </div> */}
        </div>
      </div>
    </header>
  )
}
export default AppHeader;
