import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const links = [
  { name: "About", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "News", href: "/news" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
  { name: "Donate", href: "/donate" },
  { name: "Volunteer", href: "/volunteer" },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Lionista Foundation"
              width={56}
              height={56}
              className="h-14 w-14"
            />
            <span className="font-serif text-xl font-bold">
              Lionista Foundation
            </span>
          </Link>

          <p className="mt-4 max-w-md text-sm opacity-80">
            Empowering underserved communities across East Africa through
            sustainable development.
          </p>

          {/* Navigation */}
          <nav className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm opacity-80 hover:opacity-100"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Contact */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm opacity-80">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Nairobi, Kenya
            </span>
            <a
              href="tel:+254700000000"
              className="flex items-center gap-2 hover:opacity-100"
            >
              <Phone className="h-4 w-4" />
              +254 700 000 000
            </a>
            <a
              href="mailto:info@lionista.org"
              className="flex items-center gap-2 hover:opacity-100"
            >
              <Mail className="h-4 w-4" />
              info@lionista.org
            </a>
          </div>

          {/* Social */}
          <div className="mt-6 flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-full bg-background/10 p-2 hover:bg-background/20"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="rounded-full bg-background/10 p-2 hover:bg-background/20"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full bg-background/10 p-2 hover:bg-background/20"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          {/* Copyright */}
          <p className="mt-8 text-sm opacity-60">
            &copy; {new Date().getFullYear()} Lionista Foundation. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
