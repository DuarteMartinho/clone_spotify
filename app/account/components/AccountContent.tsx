"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import useSubscribeModal from "@/hooks/useSubscribeModal";
import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";
import Button from "@/components/Button";

const AccountContent = () => {
    const router = useRouter();
    const subscriptModal = useSubscribeModal();
    const { isLoading, subscription, user } = useUser();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/');
        }
    }, [isLoading, user, router]);

    const redirectToCustomerPortal = async () => {
        setLoading(true);
        try {
            const { url, error } = await postData({
                url: '/api/create-portal-link'
            });
            window.location.assign(url);
        } catch (error) {
            if (error) {
                toast.error((error as Error)?.message);
            }
        }
        setLoading(false);
    }

    return (
        <div
            className="mb-7 px-6"
        >
            {
                !subscription && (
                    <div
                        className="flex flex-col items-center gap-y-4"
                    >
                        <p
                            className="text-white text-lg font-semibold"
                        >
                            No active plan!
                        </p>
                        <Button
                            onClick={subscriptModal.onOpen}
                            className="bg-green-500 hover:bg-green-600 w-[300px]"
                        >
                            {`Subscribe`}
                        </Button>
                    </div>
                )
            }
            {
                subscription && (
                    <div
                        className="flex flex-col items-center gap-y-4"
                    >
                        <p
                            className="text-white text-lg font-semibold"
                        >
                            Active Plan: {subscription?.prices?.products?.name} plan
                        </p>
                        <Button
                            onClick={redirectToCustomerPortal}
                            className="bg-red-500 hover:bg-red-600 w-[300px]"
                            disabled={loading || isLoading}
                        >
                            Manage Subscription
                        </Button>
                    </div>
                )
            }
        </div>
    );
}

export default AccountContent;