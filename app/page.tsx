import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { EventsProvider } from '@/context/eventsContext';

import {
  Zap,
  ArrowRight,
  Github,
  Linkedin,
  MapPin,
  Phone,
  Mail
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header
        className="sticky top-0 z-50 w-full border-b text-white"
        style={{
          backgroundColor: '#000',
          backgroundImage: 'radial-gradient(circle at center, rgba(0,102,255,0.4) 0%, black 60%)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="container flex h-16 items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-2">
            <Zap className="ml-4 h-10 w-10 text-primary" />
            <span className="text-3xl font-extrabold ml-1">Areeb Events</span>
          </div>

          {/* Navigation Actions */}
          <div className="hidden md:flex items-center gap-6 mr-4">
            <a href="" className="hover:text-blue-400 transition">Events</a>
            <a href="https://www.areebtechnology.com/internship2025" className="relative text-white after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">About</a>
            <a href="#contact" className="relative text-white after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">Contact
            </a>

            {/* Profile or Login */}
            <a
              href="/auth/login"
              className="bg-areeb.primary text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}

        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 text-white" style={{
          backgroundColor: '#000',
          backgroundImage: 'radial-gradient(circle at center, rgba(0,102,255,0.4) 0%, black 60%)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-10 w-10 text-primary" />
                  <span className="text-3xl font-extrabold ml-1 no-underline">Areeb Events</span>
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Event Booking Made Easy
                  </h1>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className=" text-white px-4 py-2 hover:bg-blue-700 transition">
                    <Link href="/auth/register" className="flex items-center">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" className=" text-white px-4 py-2 hover:bg-blue-700 transition">
                    <Link href="/auth/login">Sign in</Link>
                  </Button>
                </div>
              </div>
              <img
                src="/areeb-intern.png"
                width={350}
                height={350}
                alt="Hero Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Powerful Features for Booking Events
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Everything you need to attend: tech, educative, comedy, and more.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-700 bg-black text-white pt-16 pb-24" id="contact">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-extrabold">Areeb Events</h2>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                Simplify your booking experience with our all-in-one platform.
              </p>
            </div>

            {/* Contact Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Me</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:abdullah.abduljalil.zaky@gmail.com" className="hover:text-primary transition ">abdullah.abduljalil.zaky@gmail.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Cairo, Egypt</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href="tel:01151625051" className="hover:text-primary transition">01151625051</a>
                </li>
              </ul>
            </div>

            {/* Social Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Me</h3>
              <div className="flex gap-4">
                <Link href="https://www.linkedin.com/in/abdullah-abdulgalil-aa583a285" target="_blank" className="hover:text-primary transition">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="https://github.com/AbdullahAbdelglil" target="_blank" className="hover:text-primary transition">
                  <Github className="h-5 w-5" />
                </Link>
                {/* Add more socials if needed */}
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Areeb Events. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
