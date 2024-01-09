import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import Image from "next/image";

interface MediaItemProps {
    onClick?: (id: string) => void;
    song: Song;
}

const MediaItem: React.FC<MediaItemProps> = ({
    onClick,
    song
}) => {
    const imageUrl = useLoadImage(song);

    const handleClick = () => {
        if (!onClick) return;
        onClick(song.id);
    }

    return (
        <div
            className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md"
            onClick={handleClick}
        >
            <div
                className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden"
            >
                <Image
                    src={imageUrl || '/images/placeholder.png'}
                    fill
                    className="object-cover"
                    alt="Song Image"
                />
            </div>
            <div
                className="flex flex-col gap-y-1 overflow-hidden"
            >
                <p
                    className="text-white truncate"
                >
                    {song.title}
                </p>
                <p
                    className="text-neutral-400 truncate"
                >
                    {song.author}
                </p>
            </div>
        </div>
    );
}

export default MediaItem;