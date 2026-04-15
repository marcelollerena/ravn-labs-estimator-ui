import { LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

interface UserMenuProps {
  user: { name: string; avatarUrl?: string };
  collapsed?: boolean;
  onLogout?: () => void;
  onSettings?: () => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function UserMenu({ user, collapsed = false, onLogout, onSettings }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`
            flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors
            hover:bg-zinc-800/50
            ${collapsed ? 'justify-center px-2' : ''}
          `}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-[11px] font-semibold text-zinc-200">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              getInitials(user.name)
            )}
          </div>
          {!collapsed && (
            <span className="truncate text-[13px] font-medium text-zinc-300">{user.name}</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-48">
        <DropdownMenuItem onClick={onSettings}>
          <Settings size={14} className="mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut size={14} className="mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
