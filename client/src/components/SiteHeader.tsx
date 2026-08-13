import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="site-header"><Link href="/" className="brand" onClick={close}><span className="brand-mark"><span /></span><span>EasyPDF<span className="brand-accent">.</span></span></Link><nav className={`desktop-nav ${open ? "mobile-open" : ""}`}><Link href="/" onClick={close}>All tools</Link><Link href="/merge-pdf" onClick={close}>Merge</Link><Link href="/split-pdf" onClick={close}>Split</Link><Link href="/compress-pdf" onClick={close}>Compress</Link><Link href="/pdf-to-image" onClick={close}>Convert</Link><a href="#how-it-works" onClick={close}>How it works</a><a href="#security" onClick={close}>Security</a></nav><Button className="header-cta" asChild><Link href="/merge-pdf">Start converting <span>↗</span></Link></Button><button className="menu-button" onClick={() => setOpen(value => !value)} aria-label="Toggle menu" aria-expanded={open}>{open ? <X size={21} /> : <Menu size={21} />}</button></header>;
}
