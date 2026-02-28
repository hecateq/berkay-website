export const dynamic = 'force-dynamic';
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { revalidatePath } from "next/cache";

export default async function ContentPage() {
  const contents = await prisma.contentBlock.findMany();

  // Create dictionary for easy access
  const contentMap = contents.reduce((acc, content) => {
    acc[`${content.pageSlug}_${content.section}`] = content;
    return acc;
  }, {} as Record<string, any>);

  const getVal = (slug: string, section: string, defaultVal: string) => {
    const item = contentMap[`${slug}_${section}`];
    return item ? (item.contentJson as any)?.text || defaultVal : defaultVal;
  };

  async function saveContent(formData: FormData) {
    "use server";
    
    const updates = [
      { slug: "home", section: "hero_title", text: formData.get("hero_title") as string },
      { slug: "home", section: "hero_desc", text: formData.get("hero_desc") as string },
      { slug: "about", section: "main_text", text: formData.get("about_text") as string },
    ];

    for (const update of updates) {
      const existing = await prisma.contentBlock.findFirst({
        where: { pageSlug: update.slug, section: update.section }
      });

      if (existing) {
        await prisma.contentBlock.update({
          where: { id: existing.id },
          data: { contentJson: { text: update.text } }
        });
      } else {
        await prisma.contentBlock.create({
          data: {
            pageSlug: update.slug,
            section: update.section,
            contentJson: { text: update.text }
          }
        });
      }
    }
    revalidatePath("/");
    revalidatePath("/admin/content");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">İçerik Yönetimi</h1>

      <form action={saveContent} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Ana Sayfa (Hero Alanı)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Ana Başlık (H1)</Label>
              <Input name="hero_title" defaultValue={getVal("home", "hero_title", "Hoş Geldiniz")} />
            </div>
            <div className="space-y-2">
              <Label>Açıklama Metni</Label>
              <Textarea name="hero_desc" defaultValue={getVal("home", "hero_desc", "En iyi ürünler burada.")} rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hakkımızda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Ana Metin</Label>
              <Textarea name="about_text" defaultValue={getVal("about", "main_text", "Biz kimiz...")} rows={6} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Değişiklikleri Kaydet</Button>
        </div>
      </form>
    </div>
  );
}
