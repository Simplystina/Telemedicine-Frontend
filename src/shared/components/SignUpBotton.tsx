import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary";
};

const SignUpButton = ({ variant = "primary", className = "", ...props }: ButtonProps) => {
    const baseStyles = "inline-flex items-center justify-center h-10 px-3 rounded-md text-sm font-medium font-inter transition disabled:opacity-40 disabled:cursor-not-allowed";

    const variantStyles = {
        primary: "font-inter font-semibold bg-primary-500 text-white shadow-[0px_0px_2px_rgba(99,106,232,0.3),0px_2px_5px_rgba(99,106,232,0.3)] hover:bg-primary-600",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            {...props}
        />
    );
};

export default SignUpButton;
