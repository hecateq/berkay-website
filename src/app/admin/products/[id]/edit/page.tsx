import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "../../actions";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: true }
  });

  if (!product) notFound();

  const updateAction = updateProduct.bind(null, product.id);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Ürünü Düzenle</h1>
      <form action={updateAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ürün Adı</Label>
          <Input id="name" name="name" defaultValue={product.name} required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Açıklama</Label>
          <Textarea id="description" name="description" defaultValue={product.description || ""} rows={4} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Fiyat (₺)</Label>
            <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stok</Label>
            <Input id="stock" name="stock" type="number" defaultValue={product.stock} required />
          </div>
        </div>

        {product.images.length > 0 && (
          <div className="space-y-2">
            <Label>Mevcut Görseller</Label>
            <div className="flex gap-4 overflow-x-auto py-2">
              {product.images.map(img => (
                <div key={img.id} className="relative h-24 w-24 flex-shrink-0 border rounded-md overflow-hidden">
                  <img src={img.url} alt={product.name} className="object-cover h-full w-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="images">Yeni Görseller Ekle</Label>
          <Input id="images" name="images" type="file" accept="image/*" multiple />
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit">Güncellemeleri Kaydet</Button>
        </div>
      </form>
    </div>
  );
}
