import { Song } from "@/types";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getSongs from "./getSongs";

const getSongsByTitle = async (title: string): Promise<Song[]> => {
    const supabaseClient = createServerComponentClient({
        cookies: cookies,
    });

    if (!title) {
        const allSongs = await getSongs();
        return allSongs;
    }

    const {
        data: sessionData,
        error: sessionError
    } = await supabaseClient.auth.getSession();

    if (sessionError) {
        return [];
    }

    const { data: songs, error } = await supabaseClient
        .from("songs")
        .select("*")
        .ilike("title", `%${title}%`)
        .order("created_at", { ascending: false });

    if (error) {
        console.log("Something went wrong fetching songs!");
        return [];
    }

    return songs;
}

export default getSongsByTitle;