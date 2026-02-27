"use server";

import { prisma } from "@/lib/prisma";
import { uploadFileToS3, deleteFileFromS3 } from "@/lib/s3";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  
  const product = await prisma.product.create({
    data: { name, description, price, stock },
  });

  const files = formData.getAll("images") as File[];
  for (const file of files) {
    if (file.size > 0) {
      const filename = `${Date.now()}-${file.name}`;
      const url = await uploadFileToS3(file, filename);
      await prisma.productImage.create({
        data: { productId: product.id, url, isPrimary: false },
      });
    }
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  
  await prisma.product.update({
    where: { id },
    data: { name, description, price, stock },
  });

  const files = formData.getAll("images") as File[];
  for (const file of files) {
    if (file.size > 0) {
      const filename = `${Date.now()}-${file.name}`;
      const url = await uploadFileToS3(file, filename);
      await prisma.productImage.create({
        data: { productId: id, url, isPrimary: false },
      });
    }
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const images = await prisma.productImage.findMany({ where: { productId: id } });
  
  for (const image of images) {
    // extract filename from url assuming format .../bucket/filename
    const filename = image.url.split("/").pop();
    if (filename) {
      await deleteFileFromS3(filename).catch(console.error);
    }
  }

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}
