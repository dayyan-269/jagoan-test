import type { FC, ReactElement } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface BaseDialogProps {
  open?: boolean;
  onOpenChange?: () => void;
  title?: string;
  description?: string;
  children?: ReactElement;
  trigger?: ReactElement;
  footer?: ReactElement;
  className?: string;
  onSubmit?: () => void;
}

interface MainDialogProps {
  open?: boolean;
  onOpenChange?: () => void;
  children: ReactElement;
}

const MainDialog: FC<MainDialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <>
      {open && onOpenChange ? (
        <Dialog open={open} onOpenChange={onOpenChange}>
          {children}
        </Dialog>
      ) : (
        <Dialog>{children}</Dialog>
      )}
    </>
  );
};

const BaseDialog: FC<BaseDialogProps> = ({
  open = false,
  onOpenChange,
  title,
  description,
  children,
  trigger,
  footer,
  className,
  onSubmit,
}) => {
  return (
    <MainDialog open={open} onOpenChange={onOpenChange}>
      <>
        {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
        <DialogContent className={className}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit}>
            {children}

            {footer ? (
              footer
            ) : (
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Kembali</Button>
                </DialogClose>
              </DialogFooter>
            )}
          </form>
        </DialogContent>
      </>
    </MainDialog>
  );
};

export default BaseDialog;
