import { Dialog, DialogContent, DialogTitle, DialogActions, IconButton, Typography, Button } from '@mui/material';
import { Close as CloseIcon, LocationOn, AccessTime, CalendarToday, PictureAsPdf } from '@mui/icons-material';
import Image from 'next/image';

interface Notice {
  _id: string;
  title?: string;
  description: string;
  imageUrl?: string;
  pdfUrl?: string;
  location?: string;
  time?: string;
  date?: string;
  createdAt: string;
}

interface NoticeDialogProps {
  notice: Notice | null;
  open: boolean;
  onClose: () => void;
}

export default function NoticeDialog({ notice, open, onClose }: NoticeDialogProps) {
  if (!notice) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '15px',
          maxHeight: '90vh',
        },
        '& .MuiDialogContent-root': {
          overflowY: 'auto',
          maxHeight: 'calc(90vh - 200px)', // Adjust based on title and actions height
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f3f4f6',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#4CB6D4',
            borderRadius: '4px',
          },
        },
      }}
    >
      <DialogTitle className="flex justify-between items-center pr-4">
        <Typography variant="h5" component="h2" className="font-medium">
          {notice.title || 'Notice'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {notice.imageUrl && (
          <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
            <Image
              src={notice.imageUrl}
              alt={notice.title || 'Notice image'}
              fill
              className="object-cover"
            />
          </div>
        )}

        <Typography variant="body1" className="mb-6 whitespace-pre-line">
          {notice.description}
        </Typography>

        <div className="flex flex-wrap gap-4 text-gray-600 mt-4">
          {notice.location && (
            <div className="flex items-center gap-1">
              <LocationOn className="text-gray-400" />
              <Typography variant="body2">{notice.location}</Typography>
            </div>
          )}
          {notice.date && (
            <div className="flex items-center gap-1">
              <CalendarToday className="text-gray-400" />
              <Typography variant="body2">{notice.date}</Typography>
            </div>
          )}
          {notice.time && (
            <div className="flex items-center gap-1">
              <AccessTime className="text-gray-400" />
              <Typography variant="body2">{notice.time}</Typography>
            </div>
          )}
          <Typography variant="body2" className="ml-auto text-gray-400">
            Posted on {formatDate(notice.createdAt)}
          </Typography>
        </div>
      </DialogContent>
      
      {/* PDF Download Button */}
      {notice.pdfUrl && (
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            href={notice.pdfUrl}
            className='!md:text-sm !text-xs'
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<PictureAsPdf />}
            sx={{
              backgroundColor: '#4CB6D4',
              '&:hover': {
                backgroundColor: '#C0C0C0',
              },
              textTransform: 'none',
              borderRadius: '0.75rem',
              padding: '0.5rem 1rem',
              fontWeight: 500,
            }}
          >
            Download PDF
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
