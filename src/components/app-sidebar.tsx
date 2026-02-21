"use client"

import * as React from "react"
import {
  Bot,
  Settings2,
  SquareTerminal,
  Image as ImageIcon,
  Users,
  Layout,
  BookOpen,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Visão Geral",
      url: "/",
      icon: Layout,
      isActive: false,
    },
    {
      title: "Planejamento",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Orçamentos",
          url: "/budgets",
        },
        {
          title: "Briefings",
          url: "/briefings",
        },
      ],
    },
    {
      title: "Administração",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Clientes",
          url: "/clients",
        },
        {
          title: "Custos Fixos",
          url: "/budgets/fixed-costs",
        },
        {
          title: "Custos Variáveis",
          url: "/budgets/variable-costs",
        },
        {
          title: "Faturas e Cobranças",
          url: "/invoices",
        },
      ],
    },
    {
      title: "Configurações Globais",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Tipos de Clientes",
          url: "/budgets/client-types",
        },
        {
          title: "Tipos de Imagens",
          url: "/budgets/image-types",
        },
        {
          title: "Dificuldades",
          url: "/budgets/difficulties",
        },
      ],
    },
  ],
  media: [
    {
      name: "Biblioteca de Mídia",
      url: "/library",
      icon: ImageIcon,
    },
    {
      name: "Portfólio",
      url: "/library/portfolio",
      icon: BookOpen,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="" className="w-10 h-auto" />
          <h1 className="font-bold text-lg group-data-[collapsible=icon]:hidden">Merali ERP</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.media} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
