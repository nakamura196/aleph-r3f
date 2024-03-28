import { Copy, FileInput } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import useStore from '@/Store';
import { copyText, parseAnnotations } from '@/lib/utils';
import { createRef, useEffect, useState } from 'react';

export function AnnotationsDialog() {
  const [open, setOpen] = useState(false);
  const { annotations, setAnnotations } = useStore();

  function stringifyJson(value: any) {
    return JSON.stringify(value, null, 2);
  }

  const [json, setJson] = useState<string>('');

  useEffect(() => {
    setJson(stringifyJson(annotations));
  }, [annotations]);

  const jsonRef = createRef<HTMLTextAreaElement>();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <Button variant="link" className="p-0">
            <FileInput />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Annotations</DialogTitle>
          {/* <DialogDescription></DialogDescription> */}
        </DialogHeader>
        <div className="flex items-start space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="json" className="sr-only">
              JSON
            </Label>
            <Textarea
              id="json"
              ref={jsonRef}
              defaultValue={json}
              onChange={(value) => {
                setJson(value.target.value);
              }}
            />
          </div>
          <Button
            type="button"
            size="sm"
            className="px-3"
            onClick={() => {
              jsonRef.current?.focus();
              jsonRef.current?.select();
              copyText(json);
            }}>
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4 text-black" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="default"
            className="text-black"
            onClick={() => {
              try {
                const annos = parseAnnotations(json);
                setAnnotations(annos);
                setOpen(false);
              } catch (e) {
                console.error(e);
              }
            }}>
            Update
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="text-black">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
