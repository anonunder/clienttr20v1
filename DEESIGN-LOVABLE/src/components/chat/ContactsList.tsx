import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  online: boolean;
  lastMessage?: string;
  unread?: number;
}

interface ContactsListProps {
  contacts: Contact[];
  selectedContact: Contact;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onContactSelect: (contact: Contact) => void;
}

export const ContactsList = ({
  contacts,
  selectedContact,
  searchQuery,
  onSearchChange,
  onContactSelect,
}: ContactsListProps) => {
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Contacts List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => onContactSelect(contact)}
              className={`w-full p-3 rounded-lg hover:bg-secondary/50 transition-colors text-left ${
                selectedContact.id === contact.id ? "bg-secondary" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground truncate">{contact.name}</p>
                    {contact.unread && (
                      <Badge className="bg-primary text-primary-foreground h-5 min-w-5 px-1.5">
                        {contact.unread}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{contact.role}</p>
                  {contact.lastMessage && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{contact.lastMessage}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </>
  );
};
