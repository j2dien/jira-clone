"use client";

import { MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Sidebar } from "./sidebar";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          aria-label="Open sidebar"
          variant={"secondary"}
          className="lg:hidden"
        >
          <MenuIcon className="size-4 text-neutral-500" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
