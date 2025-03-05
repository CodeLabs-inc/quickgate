"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InputAnimatedProps {
  onSend: (text: string) => void
  style?: any
}

export default function InputAnimated({onSend, style}: InputAnimatedProps) {
  const [prompt, setPrompt] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      setPrompt("")
      onSend(prompt)
    }

  }

  return (
    <div className="relative mx-auto h-[180px] flex items-end justify-center" style={{width: '100%', ...style}}>


      {/* Animated background balls */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-[50%] h-[20px] rounded-full bg-purple-500/50 blur-2xl animate-float"
          style={{
            top: "calc(80% - 25px)",
            left: "calc(50% - 25%)",
            animationDelay: "0s",
            animationDuration: "5s",
          }}
        />
        <div
          className="absolute w-[50%] h-[40px] rounded-full bg-blue-500/50 blur-2xl animate-float-delayed"
          style={{
            top: "calc(80% - 45px)",
            left: "calc(50% - 25%)",
            animationDelay: "2s",
            animationDuration: "3s",
          }}
        />
        <div
          className="absolute w-[50%] h-[20px] rounded-full bg-pink-500/50 blur-2xl animate-float-reverse"
          style={{
            top: "calc(80% - 25px)",
            left: "calc(50% - 25%)",
            animationDelay: "1s",
            animationDuration: "4s",
          }}
        />
      </div>

      <div
        style={{
            position: 'absolute',
            bottom: '0px',
            background: 'linear-gradient(0,#1a1a1a,rgba(0, 0, 0, 0))',
            height: '80px',
            width: '100%'
        }}
      />

      



      {/* Chat input bar */}
      <form onSubmit={handleSubmit} className="relative w-2/4 mb-10 z-10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter'){
                handleSubmit(e)
              }
            }}
            placeholder="Escribir un mensaje.."
            className="w-full px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg text-white text-[14px] placeholder:text-white/30 placeholder:text-[14px] focus:outline-none focus:ring-white/30 focus:ring-2  transition-all duration-300"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
            disabled={!prompt.trim()}
            
          >
            <Send className="h-5 w-5 text-white cursor-pointer" />
          </Button>
        </div>
      </form>
    </div>
  )
}

