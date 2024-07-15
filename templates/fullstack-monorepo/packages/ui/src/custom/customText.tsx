import { cn } from "@ui/lib/utils";

export const CustomText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "normal-case",
        "font-normal md:font-medium",
        // "hover:scale-110 hover:text-secondary-foreground duration-200",
        "hover:scale-110 duration-200",
        className,
      )}
    >
      {children}
    </div>
  );
};
