import { Dialog, DialogContent, IconButton } from '@mui/material';
import Image from 'next/image';
import { MdClose, MdChevronLeft, MdChevronRight } from 'react-icons/md';

interface ImageDialogProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  caption?: string;
  onNext?: () => void;   
  onPrevious?: () => void;
}

export default function ImageDialog({ open, onClose, imageUrl, caption, onPrevious, onNext }: ImageDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          m: {
            xs: 1.5,
            sm: 2
          },
          width: {
            xs: 'calc(100% - 12px)',
            sm: 'lg'
          },
          height: {
            xs: 'auto',
            sm: 'auto'
          },
          maxHeight: {
            xs: 'calc(100% - 12px)',
            sm: '90vh'
          },
          position: 'relative',
          overflow: 'hidden'
        }
      }}
    >
      <IconButton 
    onClick={onClose}
    className="!absolute !top-2 !right-2 !z-50 !w-10 !h-10 bg-white hover:bg-gray-100"
    size="small"
  >
    <MdClose className="!text-2xl text-gray-800" />
  </IconButton>

  {/* Navigation Buttons */}
  <IconButton 
    onClick={onPrevious}
    className="!absolute !left-2 !top-1/2 !transform !-translate-y-1/2 !z-50 !w-10 !h-10 !bg-gray-200 hover:bg-gray-100"
    size="small"
  >
    <MdChevronLeft className="!text-2xl text-gray-800" />
  </IconButton>

  <IconButton 
    onClick={onNext}
    className="!absolute !right-2 !top-1/2 !transform !-translate-y-1/2 !z-50 !w-10 !h-10 !bg-gray-200 hover:bg-gray-100"
    size="small"
  >
    <MdChevronRight className="!text-2xl text-gray-800" />
  </IconButton>


      <DialogContent className="!p-6 !pt-10 font-inter">
        <div className="flex flex-col">
          <div className="relative aspect-video w-full">
            <Image
              src={imageUrl}
              alt={caption || 'Image'}
              fill
              className="object-contain md:px-10 px-4"
              unoptimized
            />
          </div>

          {caption && (
            <div className="p-4">
              <p className="text-center font-inter">
                {caption}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
