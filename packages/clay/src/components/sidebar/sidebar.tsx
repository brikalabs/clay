/**
 * Sidebar surface for the Clay component library. Composed of several
 * smaller modules so each file stays under 300 lines:
 *
 *   - `sidebar-context.tsx`  : `SidebarProvider` + `useSidebar` hook +
 *                              cookie-backed state + keyboard shortcut.
 *   - `sidebar-shell.tsx`    : `Sidebar`, `SidebarTrigger`,
 *                              `SidebarRail`, `SidebarInset`.
 *   - `sidebar-sections.tsx` : `SidebarHeader`, `SidebarFooter`,
 *                              `SidebarContent`, `SidebarGroup` /
 *                              `Label` / `Action` / `Content`,
 *                              `SidebarInput`, `SidebarSeparator`.
 *   - `sidebar-menu.tsx`     : `SidebarMenu` + items + button (with
 *                              cva variants + tooltip when collapsed)
 *                              + action / badge / skeleton + sub.
 *
 * Public surface (re-exports) is unchanged; consumers continue to
 * import from `@brika/clay/components/sidebar`.
 */

export { SidebarProvider, useSidebar } from './sidebar-context';
export {
  Sidebar,
  SidebarInset,
  SidebarRail,
  SidebarTrigger,
} from './sidebar-shell';
export {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarSeparator,
} from './sidebar-sections';
export {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from './sidebar-menu';
