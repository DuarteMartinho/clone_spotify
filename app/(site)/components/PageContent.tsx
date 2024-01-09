"use client";

import { Song } from "@/types";
import SongItem from "@/components/SongItem";

interface PageContentProps {
    songs: Song[];
}

const PageContent: React.FC<PageContentProps> = ({
    songs
}) => {
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
                            onClick={() => { }}
                            data={song}
                        />
                    ))
                }
            </div>
    );
}

export default PageContent;