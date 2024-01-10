"use client";

import { useEffect, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import useSound from "use-sound";

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";

interface PlayerContentProps {
    song: Song;
    songUrl: string;
    volume: number;
    setVolume: (value: number) => void;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
    volume,
    setVolume,
    song,
    songUrl,
}) => {
    const player = usePlayer();
    const [isPlaying, setIsPlaying] = useState(false);
    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

    const onPlayNext = () => {
        if (player.ids.length === 0) return;

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const nextSong = player.ids[currentIndex + 1];

        if (!nextSong) {
            return player.setId(player.ids[0]);;
        }

        player.setId(nextSong);
    }

    const onPlayPrevious = () => {
        if (player.ids.length === 0) return;

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const previousSong = player.ids[currentIndex - 1];

        if (!previousSong) {
            return player.setId(player.ids[player.ids.length - 1]);;
        }

        player.setId(previousSong);
    }

    const [play, { pause, sound }] = useSound(
        songUrl,
        {
            volume: volume,
            onpause: () => setIsPlaying(false),
            onplay: () => setIsPlaying(true),
            onend: () => {
                setIsPlaying(false);
                onPlayNext();
            },
            format: ["mp3"],
        }
    );

    useEffect(() => {
        sound?.play();

        return () => {
            sound?.pause();
        }
    }, [sound]);

    const handlePlay = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }

    const toggleMute = () => {
        if (volume === 0) {
            setVolume(1);
        } else {
            setVolume(0);
        }
    }

    return (
        <div
            className="grid grid-cols-2 md:grid-cols-3 h-full"
        >
            <div
                className="flex w-full justify-start"
            >
                <div
                    className="flex items-center gax-x-4"
                >
                    <MediaItem
                        song={song}
                        onClick={handlePlay}
                    />
                    <LikeButton
                        songID={song.id}
                    />
                </div>

            </div>
            <div
                className="flex md:hidden col-auto w-full justify-end items-center"
            >
                <div
                    onClick={handlePlay}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
                >
                    <Icon
                        size={30}
                        className="text-black"
                    />
                </div>
            </div>

            <div
                className="hidden md:flex h-full justify-center items-center w-full max-w-[722px] gap-x-6"
            >
                <AiFillStepBackward
                    onClick={onPlayPrevious}
                    size={30}
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                />
                <div
                    onClick={handlePlay}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
                >
                    <Icon
                        size={30}
                        className="text-black"
                    />
                </div>
                <AiFillStepForward
                    onClick={onPlayNext}
                    size={30}
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                />
            </div>

            <div
                className="hidden md:flex w-full justify-end items-center pr-2"
            >
                <div
                    className="flex items-center gap-x-2 w-[120px]"
                >
                    <VolumeIcon
                        onClick={toggleMute}
                        size={34}
                        className="text-neutral-400 cursor-pointer hover:text-white transition"
                    />
                    <Slider
                        value={volume}
                        onChange={(value: number) => setVolume(value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default PlayerContent;