import * as React from "react";
import {Slot} from "@radix-ui/react-slot";
import {cva, type VariantProps} from "class-variance-authority";

import {cn} from '~/utils';


export type ButtonVariantsProps = VariantProps<typeof buttonVariants>;

const buttonVariants = cva<ButtonVariantsProps>( 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50', {
    variants: {
        variant: {
            default:
                'bg-primary text-primary-foreground shadow hover:bg-primary/90',
            destructive:
                'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
            outline:
                'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
            secondary:
                'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 hover:underline',
        },
        size: {
            sm: ["h-8", "rounded-md", "px-3", "text-xs"],
            medium: ["h-9", "px-4", "py-2"],
            lg: ["h-10", "rounded-md", "px-8"],
            icon: ["h-9", "w-9"],
        },
        color: {
            success: ['text-green-800', 'bg-green-100', 'hover:bg-green-200'],
            danger: ['text-red-800', 'bg-red-100', 'hover:bg-red-200'],
            base: ['text-blue-800', 'bg-blue-100', 'hover:bg-blue-200'],
        }
    },
    defaultVariants: {
        variant: "default",
        size: "medium",
        color: "base",
    },
});

export interface Buttonprops
                extends React.ButtonHTMLAttributes<HTMLButtonElement>,
                    Omit<ButtonVariants, "requiredVariant">,
                    Required<Pick<ButtonVariants, "requiredVariant">> {
    asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, Buttonprops>(
    ({className, variant, size,color, asChild = false, ...props}, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp className={cn(buttonVariants({variant, size, color, className}))}
            ref={ref}
                  {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants};