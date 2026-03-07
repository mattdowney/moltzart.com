import { fetchProductsDb } from "@/lib/db";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { ProductsView } from "@/components/products-view";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await fetchProductsDb({ includeArchived: true });

  return (
    <div className="space-y-6">
      <AdminPageIntro title="Products" />

      <ProductsView products={products} />
    </div>
  );
}
