import { Song } from "@/types";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getLikedSongs = async (): Promise<Song[]> => {
    const supabaseClient = createServerComponentClient({
        cookies: cookies,
    });

    const {
        data: {
            session
        }
    } = await supabaseClient.auth.getSession();

    const { data: songs, error } = await supabaseClient
        .from("liked_songs")
        .select("*, songs(*)")
        .eq("user_id", session?.user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.log("Something went wrong fetching songs!");
        return [];
    }

    if (!songs) {
        return [];
    }

    return songs.map((item) => ({
        ...item.songs,
    }));
}

export default getLikedSongs;