"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import { Song } from "@/types";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import toast from "react-hot-toast";
import useSubscribeModal from "@/hooks/useSubscribeModal";

interface LibraryProps {
    songs: Song[];
}

const Library: React.FC<LibraryProps> = ({
    songs
}) => {
    const authModal = useAuthModal();
    const subscriptionModal = useSubscribeModal();
    const uploadModal = useUploadModal();
    const { user, subscription } = useUser();
    const onPlay = useOnPlay(songs);

    const onClick = () => {
        if (!user) return authModal.onOpen();

        if (!subscription) {
            subscriptionModal.onOpen();
            return toast.error('You must be subscribed to upload songs!');
        }

        return uploadModal.onOpen();
    };

    return (
        <div
            className="flex flex-col"
        >
            <div
                className="flex items-center justify-between px-5 pt-4"
            >
                <div
                    className="inline-flex items-center gap-x-2"
                >
                    <TbPlaylist
                        className="text-neutral-400"
                        size={26}
                    />
                    <p
                        className="text-neutral-400 font-medium text-md"
                    >
                        Your Library
                    </p>
                </div>
                <AiOutlinePlus
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                    size={20}
                    onClick={onClick}
                />
            </div>
            <div
                className="flex flex-col gap-y-2 mt-4 px-3"
            >
                {
                    songs.map((song: Song) => (
                        <MediaItem
                            key={song.id}
                            onClick={(id: string) => onPlay(id)}
                            song={song}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default Library;