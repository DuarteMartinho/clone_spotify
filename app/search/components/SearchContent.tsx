"use client";

import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";

interface SearchContentProps {
    songs: Song[];
};

const SearchContent: React.FC<SearchContentProps> = ({
    songs
}) => {
    const onPlay = useOnPlay(songs);

    if (songs.length === 0) {
        return (
            <div
                className="flex flex-col items-center h-full gap-y-2 px-6"
            >
                <h1
                    className="text-neural-400 text-3xl font-semibold"
                >
                    No songs found
                </h1>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col gap-y-2 w-full px-6"
        >
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
                                onClick={(id: string) => onPlay(id)}
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

export default SearchContent;