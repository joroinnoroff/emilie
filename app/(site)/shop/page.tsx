import ProductFilter from "@/components/ProductFilter";
import { getWorks } from "@/sanity/lib/fetch";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Shop — Emilie",
    description: "All art for sale",
}

export default async function ShopPage() {
    const products = await getWorks();

    if (products.length === 0) {
        return (
            <section className="page-hero">
                <div className="wrap">
                    <h1>No products found</h1>
                </div>
            </section>
        )
    }
    return ( 
       <section className="page-hero">
        <div className="wrap">
      <div className="flex justify-between items-center">
      <h1>All art for sale</h1>
      ( {products.length})
      </div>


        <ProductFilter products={products}/>
        <div className="grid items-center justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 min-h-full mb-10">
        {products.map((product => (
            <Link href={`/shop/${product.id}`} key={product.id} className="w-full h-full">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                <div className="size flex justify-between items-center my-2">
                <h2 className="">{product.title}</h2>

                    {product.size}
                </div>
            
               
            </Link>
        )))}
        </div>
        </div>
       </section>
    )
}