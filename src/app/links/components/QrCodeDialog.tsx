'use client';

import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Link } from 'lucide-react';
import type { ShortLink } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type QrCodeDialogProps = {
  link: ShortLink | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getFullShortUrl: (path: string, slug: string) => string;
};

export function QrCodeDialog({ link, open, onOpenChange, getFullShortUrl }: QrCodeDialogProps) {
  const { toast } = useToast();
  const qrRef = useRef<HTMLDivElement>(null);

  if (!link) return null;

  const url = `${window.location.origin}${getFullShortUrl(link.path || 'links', link.slug)}`;

  const downloadQRCode = () => {
    if (qrRef.current) {
        const canvas = qrRef.current.querySelector('canvas');
        if (canvas) {
            const pngUrl = canvas
                .toDataURL('image/png')
                .replace('image/png', 'image/octet-stream');
            let downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `${link.slug}-qrcode.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            toast({ title: 'QR Code Downloaded' });
        }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>
            Scan this code to visit your short link.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4 gap-4">
          <div ref={qrRef} className="p-4 bg-white rounded-lg border">
            <QRCodeCanvas
              value={url}
              size={256}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"H"}
              includeMargin={true}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-muted rounded-md w-full justify-center">
            <Link className='h-4 w-4' />
            <span className='font-mono truncate'>{url}</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={downloadQRCode} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download PNG
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
