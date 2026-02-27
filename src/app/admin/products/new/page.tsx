import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProduct } from "../actions";

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Yeni Ürün Ekle</h1>
      <form action={createProduct} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ürün Adı</Label>
          <Input id="name" name="name" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Açıklama</Label>
          <Textarea id="description" name="description" rows={4} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Fiyat (₺)</Label>
            <Input id="price" name="price" type="number" step="0.01" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stok</Label>
            <Input id="stock" name="stock" type="number" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="images">Görseller</Label>
          <Input id="images" name="images" type="file" accept="image/*" multiple />
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit">Ürünü Kaydet</Button>
        </div>
      </form>
    </div>
  );
}
