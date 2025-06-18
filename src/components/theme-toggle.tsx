"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full">
        <span className="sr-only">Toggle theme</span>
        <div className="w-5 h-5" />
      </Button>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0 rounded-full relative overflow-hidden bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm hover:shadow-md group"
        >
          {/* 背景光晕效果 */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-pink-400/20 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
          
          {/* 太阳图标 */}
          <Sun className="h-5 w-5 absolute inset-2 rotate-0 scale-100 transition-all duration-700 ease-in-out dark:-rotate-90 dark:scale-0 text-yellow-500 group-hover:text-yellow-600 drop-shadow-sm" />
          
          {/* 月亮图标 */}
          <Moon className="h-5 w-5 absolute inset-2 rotate-90 scale-0 transition-all duration-700 ease-in-out dark:rotate-0 dark:scale-100 text-blue-500 group-hover:text-blue-400 drop-shadow-sm" />
          
          {/* 装饰性光点 */}
          <div className="absolute top-1 right-1 w-1 h-1 bg-yellow-400 rounded-full opacity-0 dark:opacity-100 dark:bg-blue-300 transition-all duration-500 animate-pulse"></div>
          
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-48 p-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl" align="end">
        <div className="space-y-1">
          <Button
            variant={theme === "light" ? "default" : "ghost"}
            className="w-full justify-start text-sm font-medium transition-all duration-200 hover:scale-105"
            onClick={() => setTheme("light")}
          >
            <Sun className="mr-2 h-4 w-4 text-yellow-500" />
            Light
            {theme === "light" && (
              <div className="ml-auto w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            )}
          </Button>
          
          <Button
            variant={theme === "dark" ? "default" : "ghost"}
            className="w-full justify-start text-sm font-medium transition-all duration-200 hover:scale-105"
            onClick={() => setTheme("dark")}
          >
            <Moon className="mr-2 h-4 w-4 text-blue-500" />
            Dark
            {theme === "dark" && (
              <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            )}
          </Button>
          
          <Button
            variant={theme === "system" ? "default" : "ghost"}
            className="w-full justify-start text-sm font-medium transition-all duration-200 hover:scale-105"
            onClick={() => setTheme("system")}
          >
            <div className="mr-2 h-4 w-4 relative">
              <Sun className="h-3 w-3 absolute top-0 left-0 text-yellow-400" />
              <Moon className="h-3 w-3 absolute bottom-0 right-0 text-blue-400" />
            </div>
            System
            {theme === "system" && (
              <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            )}
          </Button>
        </div>
        
        {/* 底部装饰 */}
        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium">
            Choose your preference
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
} 