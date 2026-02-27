export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProductsListPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: true }
  });
  
  const settings = await prisma.siteSetting.findMany();
  const getSetting = (key: string, def: string) => settings.find(s => s.key === key)?.value || def;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            <Link href="/">{getSetting("site_title", "Berkay Website")}</Link>
          </h1>
          <nav className="space-x-4">
            <Link href="/" className="text-sm font-medium hover:underline">Ana Sayfa</Link>
            <Link href="/products" className="text-sm font-medium hover:underline">Ürünler</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold mb-10">Tüm Ürünlerimiz</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Henüz ürün bulunmuyor.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <div key={product.id} className="border rounded-lg overflow-hidden group flex flex-col">
                <div className="aspect-square bg-gray-100 relative">
                  {product.images[0] ? (
                    <img src={product.images[0].url} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Görsel Yok</div>
                  )}
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h4 className="font-semibold text-lg">{product.name}</h4>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="font-bold text-lg">{product.price.toFixed(2)} ₺</div>
                    <Button variant="outline" size="sm">İncele</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <footer className="border-t py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} {getSetting("site_title", "Berkay Website")}.</p>
      </footer>
    </div>
  );
}
