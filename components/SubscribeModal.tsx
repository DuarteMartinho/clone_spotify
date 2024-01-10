"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";

import Modal from "./Modal";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { Price, ProductWithPrice } from "@/types";
import Button from "./Button";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { postData } from "@/libs/helpers";
import { getStripeJs } from "@/libs/stripeClient";

interface SubscribeModalProps {
    products: ProductWithPrice[];
}

const formatPrice = (price: Price) => {
    const numberFormat = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currency,
        currencyDisplay: 'symbol'
    }).format((price?.unit_amount || 0) / 100);

    return numberFormat;
}


const SubscribeModal: React.FC<SubscribeModalProps> = ({
    products
}) => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const { session } = useSessionContext();
    const { onClose, isOpen } = useSubscribeModal();
    const { user, isLoading, subscription } = useUser();
    const [priceIdLoading, setPriceIdLoading] = useState<string>();

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }

    const handleCheckout = async (price: Price) => {
        setPriceIdLoading(price.id);

        if (!user) {
            setPriceIdLoading(undefined);
            return toast.error('You must be logged in to subscribe!');
        }

        if (subscription) {
            setPriceIdLoading(undefined);
            return toast.error('You are already subscribed!');
        }

        try {
            const { sessionId } = await postData({
                url: '/api/create-checkout-session',
                data: { price }
            });

            const stripe = await getStripeJs();
            await stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
            console.log(error);
            setPriceIdLoading(undefined);
            toast.error((error as Error)?.message);
        }
    }

    let content = (
        <div
            className="text-center"
        >
            No products avialable!
        </div>
    );

    if (products.length > 0) {
        content = (
            <div>
                {
                    products.map((product) => {
                        if (!product.prices?.length) {
                            return (
                                <div
                                    key={product.id}
                                >
                                    No prices available!
                                </div>
                            );
                        }

                        return product.prices.map((price) => (
                            <Button
                                key={price.id}
                                onClick={() => {
                                    handleCheckout(price);
                                }}
                                disabled={isLoading || price.id === priceIdLoading}
                            >
                                {`Subscribe for ${formatPrice(price)} / ${price.interval}`}
                            </Button>
                        ));
                    })
                }
            </div>
        );
    }

    if (subscription) {
        content = (
            <div
                className="text-center"
            >
                You are already subscribed!
            </div>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onChange={onChange}
            title="Only for premium users"
            description="Subscribe to get access to all features"
        >
            {content}
        </Modal>
    );
};

export default SubscribeModal;