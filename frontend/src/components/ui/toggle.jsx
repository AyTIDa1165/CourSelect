import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "flex w-full h-8 items-center justify-start rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "bg-transparent",
      },
      size: {
        default: "", sm: "", lg: ""
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef((props, ref) => {
  const { className, variant, size, ...rest } = props
  return (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(toggleVariants({ variant, size, className }))}
      {...rest}
    />
  )
})

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
