"use client";

import { Song } from "@/types";
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";

interface PageContentProps {
    songs: Song[];
}

const PageContent: React.FC<PageContentProps> = ({
    songs
}) => {
    const onPlay = useOnPlay(songs);

    return (
        songs.length === 0 ?
            <div
                className="flex justify-center items-center"
            >
                <p
                    className="mt-4 text-neural-400 text-lg font-medium"
                >
                    No songs found
                </p>
            </div>
            :
            <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mt-4"
            >
                {
                    songs.map((song: Song) => (
                        <SongItem
                            key={song.id}
                            onClick={(id: string) => onPlay(id)}
                            data={song}
                        />
                    ))
                }
            </div>
    );
}

export default PageContent;