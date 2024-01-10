"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Song } from "@/types";
import { useUser } from "@/hooks/useUser";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";

interface LikedContentProps {
    songs: Song[];
};

const LikedContent: React.FC<LikedContentProps> = ({
    songs
}) => {
    const router = useRouter();
    const { isLoading, user } = useUser();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/");
        }
    }, [isLoading, user, router]);

    if (songs.length === 0) {
        return (
            <div
                className="flex flex-col items-center text-neutral-400 w-full gap-y-2 px-6 py-4"
            >
                <h1
                    className="text-neural-400 text-3xl font-semibold"
                >
                    No songs liked
                </h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-2 w-full p-6">
            {
                songs.map((song) => (
                    <div
                        key={song.id}
                        className="flex items-center gap-x-4 w-full"
                    >
                        <div
                            className="flex-1"
                        >
                            <MediaItem
                                song={song}
                                onClick={() => { }}
                            />
                        </div>
                        <LikeButton
                            songID={song.id}
                        />
                    </div>
                ))
            }
        </div>
    );
}

export default LikedContent;