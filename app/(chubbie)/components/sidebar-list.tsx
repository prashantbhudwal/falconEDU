import { getChats, removeChat } from "../actions";
import { SidebarActions } from "../components/sidebar-actions";
import { SidebarItem } from "../components/sidebar-item";
export interface SidebarListProps {
  userId?: string;
}

export async function SidebarList({ userId }: SidebarListProps) {
  const chats = await getChats(userId);
  // console.log("chats", chats);
  // console.log(userId);

  return (
    <div className="flex-1 overflow-auto custom-scrollbar">
      {chats?.length ? (
        <div className="space-y-2 px-2">
          {chats.map(
            (chat) =>
              chat && (
                <SidebarItem key={chat?.id} chat={chat}>
                  <SidebarActions chat={chat} removeChat={removeChat} />
                </SidebarItem>
              )
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-muted-foreground text-sm">No chat history</p>
        </div>
      )}
    </div>
  );
}
