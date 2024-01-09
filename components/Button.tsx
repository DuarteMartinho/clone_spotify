import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    children,
    disabled,
    type = 'button',
    ...props
}, ref) => {
    return (
        <button
            {...props}
            ref={ref}
            disabled={disabled}
            type={type}
            className={twMerge(`
                w-full
                rounded-full
                bg-green-500
                border
                border-transparent
                disabled:opacity-50
                disabled:cursor-not-allowed
                text-black
                font-bold
                hover:opacity-75
                transition
                px-3
                py-3
            `,
                className
            )}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;