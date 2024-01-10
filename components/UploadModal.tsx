"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import { FieldValues, SubmitHandler, set, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import uniqid from "uniqid";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";

import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";

const UploadModal = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const { session } = useSessionContext();
    const { onClose, isOpen } = useUploadModal();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            title: "",
            author: "",
            song: null,
            image: null,
        }
    });

    useEffect(() => {
        if (!session) {
            router.refresh();
            onClose();
            reset();
        }
    }, [session, router, onClose, reset]);

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
            reset();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);
            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if (!imageFile) {
                toast.error("Please select an image!");
                return;
            }

            if (!songFile) {
                toast.error("Please select a song!");
                return;
            }

            if (!user || !session) {
                toast.error("Please login!");
                return;
            }

            const uniqueID = uniqid();

            const {
                data: songData,
                error: songError
            } = await supabaseClient.storage.from("songs").upload(
                `song-${values.title}-${uniqueID}`,
                songFile,
                {
                    cacheControl: '3600',
                    upsert: false,
                }
            );

            if (songError) {
                setIsLoading(false);
                toast.error("Something went wrong uploading a song!");
                return;
            };

            const {
                data: imageData,
                error: imageError
            } = await supabaseClient.storage.from("images").upload(
                `image-${values.title}-${uniqueID}`,
                imageFile,
                {
                    cacheControl: '3600',
                    upsert: false,
                }
            );

            if (imageError) {
                setIsLoading(false);
                toast.error("Something went wrong uploading an image!");
                return;
            };

            const {
                error: insertError
            } = await supabaseClient.from("songs").insert([
                {
                    user_id: user.id,
                    title: values.title,
                    author: values.author,
                    song_path: songData.path,
                    image_path: imageData.path,
                }
            ]);

            if (insertError) {
                setIsLoading(false);
                toast.error("Something went wrong inserting a song!");
                return;
            };

            router.refresh();
            setIsLoading(false);
            toast.success("Song uploaded!");
            reset();
            onClose();
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onChange={onChange}
            title="Add a new song"
            description="Upload an mp3 file"
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4"
            >
                <Input
                    id="title"
                    disabled={isLoading}
                    type="text"
                    {...register("title", { required: true })}
                    placeholder="Song Title"
                />
                <Input
                    id="author"
                    disabled={isLoading}
                    type="text"
                    {...register("author", { required: true })}
                    placeholder="Song Author"
                />
                <div>
                    <div
                        className="pb-1"
                    >
                        Select a song file
                    </div>
                    <Input
                        id="song"
                        disabled={isLoading}
                        type="file"
                        {...register("song", { required: true })}
                        accept=".mp3"
                    />
                </div>
                <div>
                    <div
                        className="pb-1"
                    >
                        Select an image
                    </div>
                    <Input
                        id="image"
                        disabled={isLoading}
                        type="file"
                        accept="image/*"
                        {...register("image", { required: true })}
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="text-white"
                >
                    Upload
                </Button>

            </form>
        </Modal >
    );
};

export default UploadModal;