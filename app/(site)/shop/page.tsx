import { getWorks } from "@/sanity/lib/fetch";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shop — Emilie",
    description: "All art for sale",
}

const filterOptions = [
    { label: "All", value: "all" },
    { label: "Size", value: "size" },
    { label: "Type", value: "type" },
    { label: "Price", value: "price" },
    { label: "Year", value: "year" },
    { label: "Series", value: "series" },
]

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


        <div className="filterComp flex gap-2 items-center mb-4">
        {filterOptions.map((option => (
            <button key={option.value} className="">{option.label}</button>
        )))}
           
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"> <path fill="#888888" d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"/></svg>
            
        </div>
        <div className="grid grid-cols-3 gap-4">
        {products.map((product => (
            <div key={product.id} className="w-80 h-80">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                <div className="size flex justify-between items-center my-2">
                <h2 className="">{product.title}</h2>

                    {product.size}
                </div>
                
               
            </div>
        )))}
        </div>
        </div>
       </section>
    )
}