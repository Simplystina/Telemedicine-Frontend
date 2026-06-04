import { Link } from 'react-router-dom';

type Props = {
    variant?: "primary" | "secondary";
    className?: string;
    children?: React.ReactNode;
    to?: string;
};

const SignUpButton = ({ variant = "primary", className = "", children, to = "/auth/signup" }: Props) => {
    const base = "inline-flex items-center justify-center h-10 px-3 rounded-md text-sm font-medium font-inter transition";
    const variants = {
        primary: "font-semibold bg-primary-500 text-white shadow-[0px_0px_2px_rgba(99,106,232,0.3),0px_2px_5px_rgba(99,106,232,0.3)] hover:bg-primary-600",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    };
    return (
        <Link to={to} className={`${base} ${variants[variant]} ${className}`}>
            {children}
        </Link>
    );
};

export default SignUpButton;
