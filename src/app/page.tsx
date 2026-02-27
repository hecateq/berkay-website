export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default async function Home() {
  const contents = await prisma.contentBlock.findMany();
  const products = await prisma.product.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { images: true }
  });

  const contentMap = contents.reduce((acc, content) => {
    acc[`${content.pageSlug}_${content.section}`] = content;
    return acc;
  }, {} as Record<string, any>);

  const getVal = (slug: string, section: string, defaultVal: string) => {
    const item = contentMap[`${slug}_${section}`];
    return item ? (item.contentJson as any)?.text || defaultVal : defaultVal;
  };

  const heroTitle = getVal("home", "hero_title", "Harika Ürünler Sizi Bekliyor");
  const heroDesc = getVal("home", "hero_desc", "En kaliteli ürünleri en uygun fiyata bulun.");

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b flex items-center justify-between">
        <div className="text-xl font-bold">Berkay Website</div>
        <nav className="flex gap-4">
          <Link href="/" className="hover:underline">Ana Sayfa</Link>
          <Link href="/products" className="hover:underline">Ürünler</Link>
          <Link href="/login" className="hover:underline">Giriş</Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-50 py-20 px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">{heroTitle}</h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">{heroDesc}</p>
          <Button size="lg" asChild>
            <Link href="/products">Ürünleri İncele</Link>
          </Button>
        </section>

        {/* Featured Products */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Yeni Ürünler</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col">
                <div className="relative h-64 bg-slate-100">
                  {product.images.length > 0 ? (
                    <img 
                      src={product.images[0].url} 
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">Görsel Yok</div>
                  )}
                </div>
                <CardContent className="p-6 flex-1">
                  <h3 className="font-semibold text-xl mb-2">{product.name}</h3>
                  <p className="text-slate-600 line-clamp-2">{product.description}</p>
                </CardContent>
                <CardFooter className="px-6 pb-6 flex justify-between items-center">
                  <span className="text-xl font-bold">{product.price.toFixed(2)} ₺</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/products/${product.id}`}>Detay</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-200 py-8 text-center">
        <p>&copy; {new Date().getFullYear()} Berkay Website. Tüm Hakları Saklıdır.</p>
      </footer>
    </div>
  );
}
