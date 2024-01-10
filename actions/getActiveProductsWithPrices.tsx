import { ProductWithPrice } from "@/types";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
    const supabaseClient = createServerComponentClient({
        cookies: cookies,
    });

    const { data: products, error } = await supabaseClient
        .from("products")
        .select("*, prices(*)")
        .eq('active', true)
        .eq('prices.active', true)
        .order('metadata->index')
        .order("unit_amount", { foreignTable: 'prices' });

    if (error) {
        console.log("Something went wrong fetching songs!");
        return [];
    }

    return products;
}

export default getActiveProductsWithPrices;