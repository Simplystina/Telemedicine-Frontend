import type { ReactNode } from "react";

/** One shared container so every section's edges line up with the navbar and footer. */
export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
    return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

/** Section wrapper: owns vertical rhythm, background and the in-page anchor offset for the fixed navbar. */
export function Section({
    id,
    className = "",
    containerClassName = "",
    children,
}: {
    id?: string;
    className?: string;
    containerClassName?: string;
    children: ReactNode;
}) {
    return (
        <section id={id} className={`scroll-mt-14 py-10 sm:scroll-mt-16 sm:py-14 lg:py-20 ${className}`}>
            <Container className={containerClassName}>{children}</Container>
        </section>
    );
}

/** Centered (or left on desktop) heading block with an optional short intro line. */
export function SectionHeading({
    title,
    description,
    align = "center",
    className = "mb-6 sm:mb-8 lg:mb-12",
}: {
    title: string;
    description?: string;
    align?: "center" | "left";
    className?: string;
}) {
    return (
        <div className={`space-y-2 ${align === "center" ? "text-center" : "text-center lg:text-left"} ${className}`}>
            <h2 className="font-archivo text-2xl font-bold leading-tight text-neutral-900 sm:text-3xl lg:text-4xl">
                {title}
            </h2>
            {description && (
                <p
                    className={`max-w-2xl font-inter text-sm leading-relaxed text-neutral-500 sm:text-base ${align === "center" ? "mx-auto" : "mx-auto lg:mx-0"
                        }`}
                >
                    {description}
                </p>
            )}
        </div>
    );
}
