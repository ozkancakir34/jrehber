import { useState, useEffect } from "react";
import { Contact } from "@/types/contact";
import { ContactCard } from "@/components/ContactCard";
import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { initialContacts } from "@/data/initialContacts";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const Index = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
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
        title: "Success",
        description: "Contact updated",
      });
    } else {
      saveContacts([...contacts, contact]);
      toast({
        title: "Success",
        description: "New contact added",
      });
    }
    setEditingContact(undefined);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleDeleteContact = (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      saveContacts(contacts.filter((c) => c.id !== id));
      toast({
        title: "Success",
        description: "Contact deleted",
      });
    }
  };

  const companyOptions = Array.from(
    new Set(
      contacts
        .map((c) => (c.company || "").trim())
        .filter((v) => v.length > 0)
    )
  ).sort((a, b) => a.localeCompare(b));

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCompany = !selectedCompany || (contact.company && contact.company === selectedCompany);
    return matchesSearch && matchesCompany;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="DEF Media Logo" className="h-16 w-auto object-contain" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">Contacts</h1>
              <p className="text-muted-foreground">All Contacts</p>
            </div>
          </div>
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, role, phone or company..."
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
            Add New Contact
          </Button>
        </div>
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {companyOptions.map((company) => (
            <Button
              key={company}
              variant={selectedCompany === company ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCompany(company)}
            >
              {company}
            </Button>
          ))}
          {companyOptions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCompany(null)}
              className="ml-2"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="mb-6 p-4 bg-card rounded-lg border">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredContacts.length}</span> contacts
            {searchQuery && ` (out of ${contacts.length})`}
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
              {searchQuery ? "No contacts found matching your search" : "No contacts added yet"}
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
