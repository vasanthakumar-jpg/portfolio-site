import { Children, useState, type ReactElement, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useAnimationPreferences } from "./preferences";
import { cinema } from "./settings";
import { motionEase } from "./variants";

/** Radix owns focus, Escape, dismissal and scroll locking; Motion owns the surface. */
export function ModalExpand({ id, trigger, children, className = "" }: { id: string; trigger: ReactElement; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const { reducedMotion } = useAnimationPreferences();
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
    <AnimatePresence>
      {open && <Dialog.Portal forceMount>
        <Dialog.Overlay forceMount asChild><motion.div className="modal-expand-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0.15 : 0.35 }} /></Dialog.Overlay>
        <Dialog.Content forceMount asChild>
          <motion.div layoutId={reducedMotion ? undefined : id} data-lenis-prevent className={`modal-expand ${className}`}
            initial={{ opacity: reducedMotion ? 0 : 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.15 : cinema.modal, ease: motionEase }}>
            <motion.div className="modal-expand-body" initial="hidden" animate="visible" exit="hidden"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : cinema.stagger, delayChildren: reducedMotion ? 0 : 0.15 } } }}>
              {Children.map(children, child => child && <motion.div variants={{ hidden: { opacity: 0, y: reducedMotion ? 0 : 12 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: reducedMotion ? 0.15 : 0.4, ease: motionEase }}>{child}</motion.div>)}
            </motion.div>
            <Dialog.Close className="modal-expand-close" aria-label="Close"><X aria-hidden="true" className="h-4 w-4" /></Dialog.Close>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>}
    </AnimatePresence>
  </Dialog.Root>;
}
