"use client";

import qs from "query-string";
import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Input from "./Input";

interface SearchInputProps {
    searchParam?: string
};

const SearchInput: React.FC<SearchInputProps> = ({
    searchParam
}) => {
    const router = useRouter();
    const [value, setValue] = useState(searchParam || "");
    const debouncedValue = useDebounce<string>(value, 500);

    useEffect(() => {
        const query = {
            title: debouncedValue,
        };

        const url = qs.stringifyUrl({
            url: "/search",
            query,
        });

        router.push(url);
    }, [debouncedValue, router]);

    useEffect(() => {
        setValue(searchParam || "");
    }, [searchParam]);

    return (
        <Input
            className="w-full"
            placeholder="What are you looking for?"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}

export default SearchInput;