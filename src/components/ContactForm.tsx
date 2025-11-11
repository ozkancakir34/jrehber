import { useState, useEffect } from "react";
import { Contact } from "@/types/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface ContactFormProps {
  contact?: Contact;
  open: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
}

export const ContactForm = ({ contact, open, onClose, onSave }: ContactFormProps) => {
  const [formData, setFormData] = useState<Partial<Contact>>({
    name: "",
    role: "",
    phone: "",
    company: "",
    email: "",
  });

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    } else {
      setFormData({
        name: "",
        role: "",
        phone: "",
        company: "",
        email: "",
      });
    }
  }, [contact, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.role && formData.phone) {
      onSave({
        id: contact?.id || Date.now().toString(),
        name: formData.name,
        role: formData.role,
        phone: formData.phone,
        company: formData.company,
        email: formData.email,
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{contact ? "Kişiyi Düzenle" : "Yeni Kişi Ekle"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">İsim *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Ahmet Yılmaz"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rol *</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
              placeholder="Proje Yöneticisi"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              placeholder="+905551234567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Şirket</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="ABC Şirketi"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ahmet@example.com"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              {contact ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
