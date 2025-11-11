import { useState, useEffect } from "react";
import { Contact } from "@/types/contact";
import { ContactCard } from "@/components/ContactCard";
import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users } from "lucide-react";
import { initialContacts } from "@/data/initialContacts";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();

  useEffect(() => {
    const stored = localStorage.getItem("contacts");
    if (stored) {
      setContacts(JSON.parse(stored));
    } else {
      setContacts(initialContacts);
      localStorage.setItem("contacts", JSON.stringify(initialContacts));
    }
  }, []);

  const saveContacts = (newContacts: Contact[]) => {
    setContacts(newContacts);
    localStorage.setItem("contacts", JSON.stringify(newContacts));
  };

  const handleSaveContact = (contact: Contact) => {
    if (editingContact) {
      const updated = contacts.map((c) => (c.id === contact.id ? contact : c));
      saveContacts(updated);
      toast({
        title: "Başarılı",
        description: "Kişi güncellendi",
      });
    } else {
      saveContacts([...contacts, contact]);
      toast({
        title: "Başarılı",
        description: "Yeni kişi eklendi",
      });
    }
    setEditingContact(undefined);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleDeleteContact = (id: string) => {
    if (confirm("Bu kişiyi silmek istediğinizden emin misiniz?")) {
      saveContacts(contacts.filter((c) => c.id !== id));
      toast({
        title: "Başarılı",
        description: "Kişi silindi",
      });
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Kişiler</h1>
              <p className="text-muted-foreground">Production Team İletişim Listesi</p>
            </div>
          </div>
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="İsim, rol, telefon veya şirket ile ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => {
              setEditingContact(undefined);
              setIsFormOpen(true);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Plus className="w-5 h-5" />
            Yeni Kişi Ekle
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 p-4 bg-card rounded-lg border">
          <p className="text-sm text-muted-foreground">
            Toplam <span className="font-semibold text-foreground">{filteredContacts.length}</span> kişi gösteriliyor
            {searchQuery && ` (${contacts.length} kişiden)`}
          </p>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
            />
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "Aramanıza uygun kişi bulunamadı" : "Henüz kişi eklenmemiş"}
            </p>
          </div>
        )}

        {/* Form Dialog */}
        <ContactForm
          contact={editingContact}
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingContact(undefined);
          }}
          onSave={handleSaveContact}
        />
      </div>
    </div>
  );
};

export default Index;
