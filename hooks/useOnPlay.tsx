import { Song } from "@/types";
import usePlayer from "./usePlayer"
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";

const useOnPlay = (songs: Song[]) => {
    const player = usePlayer();
    const authModal = useAuthModal();
    const { user } = useUser();

    const onPlay = (id: string) => {
        if (!user) {
            authModal.onOpen();
            return;
        }

        const ids = songs.map((song) => song.id);
        player.setId(id);
        player.setIds(ids);
    }

    return onPlay;
}

export default useOnPlay;