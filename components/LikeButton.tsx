"use client";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikeButtonProps {
    songID: string;
};

const LikeButton: React.FC<LikeButtonProps> = ({
    songID
}) => {
    const router = useRouter();
    const { supabaseClient } = useSessionContext();

    const authModal = useAuthModal();
    const { user } = useUser();

    const [isLiked, setIsLiked] = useState(false);

    const handleLike = async () => {
        if (!user?.id) {
            authModal.onOpen();
            return;
        }

        if (isLiked) {
            const { error } = await supabaseClient
                .from("liked_songs")
                .delete()
                .eq("user_id", user.id)
                .eq("song_id", songID);

            if (error) {
                toast.error(error.message);
            } else {
                setIsLiked(false);
            }
        } else {
            const { error } = await supabaseClient
                .from("liked_songs")
                .insert({
                    user_id: user.id,
                    song_id: songID
                });

            if (error) {
                toast.error(error.message);
            } else {
                setIsLiked(true);
                toast.success("Liked song");
            }
        }

        router.refresh();
    }

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        const fetchIsLiked = async () => {
            const { data, error } = await supabaseClient
                .from("liked_songs")
                .select("*")
                .eq("user_id", user.id)
                .eq("song_id", songID)
                .single();

            if (!error && data) {
                setIsLiked(true);
            }
        };

        fetchIsLiked();
    }, [user?.id, supabaseClient, songID]);

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

    return (
        <button
            onClick={handleLike}
            className="hover:opacity-75 transition"
        >
            <Icon
                size={24}
                color={isLiked ? "#22c55e" : "white"}
            />
        </button>
    );
}

export default LikeButton;