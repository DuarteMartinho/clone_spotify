import { Song } from "@/types";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import toast from "react-hot-toast";

const getSongsByUserID = async (): Promise<Song[]> => {
    const supabaseClient = createServerComponentClient({
        cookies: cookies,
    });

    const {
        data: sessionData,
        error: sessionError
    } = await supabaseClient.auth.getSession();

    if (sessionError) {
        // toast.error("Something went wrong fetching songs!");
        return [];
    }

    const { data: songs, error } = await supabaseClient
        .from("songs")
        .select("*")
        .eq("user_id", sessionData.session?.user.id)
        .order("created_at", { ascending: false });

    if (error) {
        toast.error("Something went wrong fetching songs!");
        return [];
    }

    return songs;
}

export default getSongsByUserID;