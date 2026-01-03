"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="max-w-md text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Your App</h1>
          <p className="text-lg text-muted-foreground">
            A modern, minimal application built with Next.js, Supabase, and Zustand.
          </p>
        </div>

        <div className="flex gap-3 flex-col">
          <Link href="/login" className="w-full">
            <Button className="w-full" size="lg">
              Sign In
            </Button>
          </Link>
          <Link href="/signup" className="w-full">
            <Button variant="outline" className="w-full bg-transparent" size="lg">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
