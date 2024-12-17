"use client";

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from './ui/navigation-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { LogoCiDi, LogoSanJuanGob } from "./icons"
import { Button } from '@/components/ui/button'
import { Menu } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import React from 'react';

const linksBoletin = [
    { title: "Leyes y Decretos oficiales", href: "/boletin-oficial/leyes-decretos-oficiales" },
    { title: "Normas y Ordenanzas", href: "/boletin-oficial/normas-y-ordenanzas" },
    { title: "Edictos y Licitaciones", href: "/boletin-oficial/edictos-y-licitaciones" },
    { title: "Convocatorias y otros", href: "/boletin-oficial/convocatorias-y-otros" }
]

const linksCrear = [
    { title: "Publicar en el boletin ofical", href: "/cargar-boletin" },
    { title: "Requisitos", href: "/requisitos" },
    { title: "Crear un aviso", href: "/" }
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <header className="sticky top-0 z-50 flex justify-center items-center w-full bg-background h-16 py-2 px-8 shadow-md">
            <nav className="flex items-center justify-between gap-4 w-full max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link href="/" className="">
                        <LogoSanJuanGob height={42} width={109} />
                    </Link>
                </div>
                <div className="hidden md:flex items-center gap-4 w-full">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className='text-grisPrincipal font-semibold hover:text-naranjaPrincipal'>Boletín Oficial</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        {linksBoletin.map((item) => (
                                            <ListItem
                                                key={item.title}
                                                title={item.title}
                                                href={item.href}
                                            />
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className='text-grisPrincipal font-semibold hover:text-naranjaPrincipal'>Publicar</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        {linksCrear.map((item) => (
                                            <ListItem
                                                key={item.title}
                                                title={item.title}
                                                href={item.href}
                                            />
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="flex items-center gap-4">
                    <LogoCiDi height={39} width={109} />
                </div>
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Abrir menú</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                            <VisuallyHidden>
                                <SheetTitle>Menú de navegación</SheetTitle>
                            </VisuallyHidden>
                            <nav className="flex flex-col space-y-4 mt-4">
                                {
                                    linksBoletin.map((item) => (
                                        <Link key={item.title} href={item.href} className="hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium" onClick={() => setIsOpen(false)}>
                                            {item.title}
                                        </Link>
                                    ))
                                }
                                {
                                    linksCrear.map((item) => (
                                        <Link key={item.title} href={item.href} className="hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium" onClick={() => setIsOpen(false)}>
                                            {item.title}
                                        </Link>
                                    ))
                                }
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>

        </header>
    )
}
const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
