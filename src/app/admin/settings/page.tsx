export const dynamic = 'force-dynamic';
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { revalidatePath } from "next/cache";

export default async function SettingsPage() {
  const settings = await prisma.siteSetting.findMany();

  const getSetting = (key: string, defaultVal: string) => {
    const s = settings.find(s => s.key === key);
    return s ? s.value : defaultVal;
  };

  async function saveSettings(formData: FormData) {
    "use server";
    
    const fields = ["site_title", "contact_email", "phone", "address"];

    for (const key of fields) {
      const value = formData.get(key) as string;
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/settings");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Genel Ayarlar</h1>

      <form action={saveSettings} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Site Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Site Başlığı (Title)</Label>
              <Input name="site_title" defaultValue={getSetting("site_title", "Berkay Website")} />
            </div>
            <div className="space-y-2">
              <Label>İletişim E-posta</Label>
              <Input type="email" name="contact_email" defaultValue={getSetting("contact_email", "info@berkay.com")} />
            </div>
            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input name="phone" defaultValue={getSetting("phone", "+90 555 555 55 55")} />
            </div>
            <div className="space-y-2">
              <Label>Adres</Label>
              <Input name="address" defaultValue={getSetting("address", "İstanbul, Türkiye")} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Ayarları Kaydet</Button>
        </div>
      </form>
    </div>
  );
}
