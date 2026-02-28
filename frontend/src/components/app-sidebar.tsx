import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";

export default function AppSidebar() {
  const navigations = [
    {
      title: "Dashboard",
      link: "/dashboard",
      submenus: null,
    },
    {
      title: "Housing",
      link: null,
      submenus: [
        {
          title: "Rumah",
          link: "/houses",
        },
        {
          title: "Penghuni",
          link: "/residents",
        },
        {
          title: "Pembayaran Kontrak",
          link: "/house-payments",
        },
      ],
    },
    {
      title: "Finansial",
      link: null,
      submenus: [
        {
          title: "Pembayaran Iuran",
          link: "/due-payment",
        },
        {
          title: "Pembayaran Pengeluaran",
          link: "/spending",
        },
      ],
    },
    {
      title: "Data Master",
      link: null,
      submenus: [
        {
          title: "Tipe Iuran",
          link: "/due-type",
        },
        {
          title: "Tipe Pengeluaran",
          link: "/spending-type",
        },
      ],
    },
  ];
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="font-bold text-2xl cursor-pointer">.Home</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navigations.map((menu, index) => {
          return menu.submenus !== null ? (
            <SidebarGroup key={`m-${index}`}>
              <SidebarGroupLabel>{menu.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                {menu.submenus?.map((submenu, subIndex) => (
                  <SidebarMenu key={`s-${subIndex}`}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to={submenu.link ?? null}>{submenu.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            <SidebarGroup key={`m-${index}`}>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to={menu.link ?? null}>{menu.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to='/' className="font-bold">Logout</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
