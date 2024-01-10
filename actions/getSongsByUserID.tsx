import { Song } from "@/types";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongsByUserID = async (): Promise<Song[]> => {
    const supabaseClient = createServerComponentClient({
        cookies: cookies,
    });

    const {
        data: sessionData,
        error: sessionError
    } = await supabaseClient.auth.getSession();

    if (sessionError) {
        console.log("Something went wrong fetching songs!");
        return [];
    }

    const { data: songs, error } = await supabaseClient
        .from("songs")
        .select("*")
        .eq("user_id", sessionData.session?.user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.log("Something went wrong fetching songs!");
        return [];
    }

    return songs;
}

export default getSongsByUserID;