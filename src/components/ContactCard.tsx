import { Contact } from "@/types/contact";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Pencil, Trash2, Building2, Mail } from "lucide-react";

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export const ContactCard = ({ contact, onEdit, onDelete }: ContactCardProps) => {
  const handleWhatsAppClick = () => {
    if (contact.phone && contact.phone.trim()) {
      // Telefon numarasından tüm boşlukları, tireleri ve özel karakterleri temizle, sadece + ve rakamları bırak
      const cleanPhone = contact.phone.replace(/[^\d+]/g, "");
      const whatsappUrl = `https://wa.me/${cleanPhone}`;
      console.log("WhatsApp URL:", whatsappUrl); // Debug için
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground mb-1">{contact.name}</h3>
            <p className="text-sm text-primary font-medium mb-2">{contact.role}</p>
            {contact.company && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Building2 className="w-4 h-4" />
                <span>{contact.company}</span>
              </div>
            )}
            {contact.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="break-all">{contact.email}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(contact)}
              className="hover:bg-secondary"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(contact.id)}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {contact.phone && contact.phone.trim() && (
          <Button
            onClick={handleWhatsAppClick}
            className="w-full bg-whatsapp hover:bg-whatsapp-hover text-white gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp: {contact.phone}
          </Button>
        )}
      </div>
    </Card>
  );
};
