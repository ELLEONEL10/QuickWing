import Link from "next/link"
import { Plane, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Plane className="w-6 h-6 text-rose-500" />
          <span className="text-xl font-bold">SkyWay</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/flights" className="text-sm font-medium hover:text-rose-500 transition-colors">
            Flights
          </Link>
          <Link href="/destinations" className="text-sm font-medium hover:text-rose-500 transition-colors">
            Destinations
          </Link>
          <Link href="/deals" className="text-sm font-medium hover:text-rose-500 transition-colors">
            Deals
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-rose-500 transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-rose-500 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/account" className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>

          <Link href="/login" className="hidden md:block">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>

          <Link href="/register" className="hidden md:block">
            <Button size="sm" className="bg-rose-500 hover:bg-rose-600">
              Sign Up
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/flights" className="text-sm font-medium hover:text-rose-500 transition-colors">
                  Flights
                </Link>
                <Link href="/destinations" className="text-sm font-medium hover:text-rose-500 transition-colors">
                  Destinations
                </Link>
                <Link href="/deals" className="text-sm font-medium hover:text-rose-500 transition-colors">
                  Deals
                </Link>
                <Link href="/about" className="text-sm font-medium hover:text-rose-500 transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-sm font-medium hover:text-rose-500 transition-colors">
                  Contact
                </Link>
                <Link href="/login" className="mt-4">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full bg-rose-500 hover:bg-rose-600">Sign Up</Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
