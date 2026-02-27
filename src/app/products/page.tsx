export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PublicProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: true }
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/"><h1 className="text-xl font-bold">Berkay Website</h1></Link>
          <nav className="space-x-4">
            <Link href="/" className="text-sm font-medium hover:underline">Ana Sayfa</Link>
            <Link href="/products" className="text-sm font-medium hover:underline">Ürünler</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Tüm Ürünlerimiz</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="border rounded-lg overflow-hidden group">
              <div className="aspect-square bg-gray-100 relative">
                {product.images[0] ? (
                  <img src={product.images[0].url} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Görsel Yok</div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-lg">{product.name}</h4>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-lg">{product.price.toFixed(2)} ₺</span>
                  <Button size="sm">Satın Al</Button>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Şu an gösterilecek ürün bulunmuyor.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
