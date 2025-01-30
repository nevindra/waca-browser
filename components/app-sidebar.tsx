"use client";

import * as React from "react";
import {
  Book,
  Command,
  Frame,
  LifeBuoy,
  Map,
  Notebook,
  PieChart,
  Send,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

import { useSession } from "@/hooks/use-session";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const user = useSession() || {
    name: "Guest",
    email: "",
  };

  const data = {
    navMain: [
      {
        title: "Library",
        url: "#",
        icon: Book,
        isActive: true,
        items: [
          {
            title: "All",
            url: "/",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Finished",
            url: "#",
          },
        ],
      },
      {
        title: "Notes",
        url: "#",
        icon: Notebook,
        items: [
          {
            title: "All",
            url: "#",
          },
          {
            title: "Explore",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Waca Browser</span>
                  <span className="truncate text-xs">Personal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="mb-2">
          <SidebarMenuItem>
            <div className="flex items-center justify-between w-full px-2 py-1.5">
              <span className="text-sm">Dark mode</span>
              <Switch
                checked={resolvedTheme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
