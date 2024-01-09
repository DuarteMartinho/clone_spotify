import { Song } from "@/types";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import toast from "react-hot-toast";

const getSongs = async (): Promise<Song[]> => {
    const supabaseClient = createServerComponentClient({
        cookies: cookies,
    });

    const { data: songs, error } = await supabaseClient
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        toast.error("Something went wrong fetching songs!");
        return [];
    }

    return songs;
}

export default getSongs;