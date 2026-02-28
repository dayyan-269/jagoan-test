import type { FC, ReactElement } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface BaseSheetProps {
  open: boolean;
  onOpenChange: () => void;
  title?: string;
  children?: ReactElement;
  footer?: ReactElement;
  onSubmit?: () => void;
}

const BaseSheet: FC<BaseSheetProps> = ({
  open,
  onOpenChange,
  title,
  children,
  footer,
  onSubmit
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-2/3">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <form onSubmit={onSubmit}>
          <ScrollArea className="h-full">
            <div className="flex flex-col px-4">{children}</div>
          </ScrollArea>
          {footer ? <SheetFooter>{footer}</SheetFooter> : null}
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default BaseSheet;
