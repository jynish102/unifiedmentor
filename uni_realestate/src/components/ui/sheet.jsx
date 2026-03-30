"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "../../lib/utils"; // adjust path if needed

// Root
const Sheet = Dialog.Root;

// Trigger
const SheetTrigger = Dialog.Trigger;

// Close
const SheetClose = Dialog.Close;

// Portal
const SheetPortal = Dialog.Portal;

// Overlay
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/50 backdrop-blur-sm", className)}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

// Content
const SheetContent = React.forwardRef(
  ({ side = "right", className, children, ...props }, ref) => {
    const sideStyles = {
      top: "inset-x-0 top-0 border-b",
      bottom: "inset-x-0 bottom-0 border-t",
      left: "inset-y-0 left-0 h-full w-64 border-r",
      right: "inset-y-0 right-0 h-full w-64 border-l",
    };

    return (
      <SheetPortal>
        <SheetOverlay />

        <Dialog.Content
          ref={ref}
          className={cn(
            "fixed z-50 bg-white shadow-lg transition ease-in-out duration-300",
            sideStyles[side],
            className,
          )}
          {...props}
        >
          {children}

          {/* Close Button */}
          <SheetClose className="absolute top-4 right-4 p-1 rounded-md hover:bg-gray-100">
            <X className="h-4 w-4" />
          </SheetClose>
        </Dialog.Content>
      </SheetPortal>
    );
  },
);
SheetContent.displayName = "SheetContent";

export { Sheet, SheetTrigger, SheetContent, SheetClose };
