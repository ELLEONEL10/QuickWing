"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

export function Newsletter() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // This would normally connect to a backend service
    toast({
      title: "Subscribed!",
      description: "You've successfully subscribed to our newsletter.",
    })

    setEmail("")
  }

  return (
    <section className="py-16 bg-rose-500 text-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Stay Updated with the Best Deals</h2>
          <p className="mt-4">
            Subscribe to our newsletter and never miss out on exclusive flight deals and travel tips.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2 mt-8">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
            <Button type="submit" variant="secondary">
              Subscribe
            </Button>
          </form>

          <p className="mt-4 text-sm text-white/80">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  )
}
