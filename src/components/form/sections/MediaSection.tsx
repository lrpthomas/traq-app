'use client';

import { useState } from 'react';
import { Camera, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMedia } from '@/hooks/useMedia';
import type { MediaAttachment } from '@/types/traq';

interface Props {
  assessmentId: string;
}

export function MediaSection({ assessmentId }: Props) {
  const {
    media,
    isLoading,
    isUploading,
    capturePhoto,
    pickFile,
    updateCaption,
    deleteMedia,
    getMediaUrl,
  } = useMedia(assessmentId);

  const [selectedMedia, setSelectedMedia] = useState<MediaAttachment | null>(null);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);

  const handleCapturePhoto = async () => {
    await capturePhoto();
  };

  const handlePickFile = async () => {
    await pickFile();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this attachment?')) {
      await deleteMedia(id);
    }
  };

  const handleCaptionSave = async (id: string, caption: string) => {
    await updateCaption(id, caption);
    setEditingCaption(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Media Attachments</h3>
          <p className="text-xs text-muted-foreground">
            Add photos, videos, or documents to your assessment
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCapturePhoto}
            disabled={isUploading}
          >
            <Camera className="h-4 w-4 mr-1" />
            Camera
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePickFile}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </div>
      </div>

      {media.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-gray-400">
            <ImageIcon className="h-12 w-12 mb-2" />
            <p className="text-sm">No attachments yet</p>
            <p className="text-xs">Use the buttons above to add photos or files</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {media.map((item) => (
            <MediaThumbnail
              key={item.id}
              item={item}
              getMediaUrl={getMediaUrl}
              onView={() => setSelectedMedia(item)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}

      {/* View Media Dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedMedia?.filename}</DialogTitle>
          </DialogHeader>
          {selectedMedia && (
            <div className="space-y-4">
              {selectedMedia.type === 'photo' && (
                /* eslint-disable-next-line @next/next/no-img-element -- blob URL from IndexedDB, not suitable for next/image optimization */
                <img
                  src={getMediaUrl(selectedMedia)}
                  alt={selectedMedia.caption || selectedMedia.filename}
                  className="max-h-[60vh] w-auto mx-auto rounded-lg"
                />
              )}
              {selectedMedia.type === 'video' && (
                <video
                  src={getMediaUrl(selectedMedia)}
                  controls
                  className="max-h-[60vh] w-auto mx-auto rounded-lg"
                />
              )}
              {selectedMedia.type === 'document' && (
                <div className="flex flex-col items-center py-8">
                  <p className="text-lg font-medium">{selectedMedia.filename}</p>
                  <a
                    href={getMediaUrl(selectedMedia)}
                    download={selectedMedia.filename}
                    className="mt-4 text-blue-600 hover:underline"
                  >
                    Download File
                  </a>
                </div>
              )}
              {selectedMedia.caption && (
                <p className="text-sm text-gray-600 text-center">
                  {selectedMedia.caption}
                </p>
              )}
              {selectedMedia.location && (
                <p className="text-xs text-gray-400 text-center">
                  Location: {selectedMedia.location.latitude.toFixed(6)},{' '}
                  {selectedMedia.location.longitude.toFixed(6)}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Caption Dialog */}
      <Dialog open={!!editingCaption} onOpenChange={() => setEditingCaption(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Caption</DialogTitle>
          </DialogHeader>
          {editingCaption && (
            <EditCaptionForm
              initialCaption={media.find((m) => m.id === editingCaption)?.caption || ''}
              onSave={(caption) => handleCaptionSave(editingCaption, caption)}
              onCancel={() => setEditingCaption(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface MediaThumbnailProps {
  item: MediaAttachment;
  getMediaUrl: (item: MediaAttachment) => string;
  onView: () => void;
  onDelete: () => void;
}

function MediaThumbnail({
  item,
  getMediaUrl,
  onView,
  onDelete,
}: MediaThumbnailProps) {
  return (
    <div className="relative group">
      <button
        onClick={onView}
        className="w-full aspect-square rounded-lg overflow-hidden bg-muted hover:ring-2 hover:ring-green-500 transition-all"
      >
        {item.type === 'photo' ? (
          /* eslint-disable-next-line @next/next/no-img-element -- blob URL from IndexedDB, not suitable for next/image optimization */
          <img
            src={getMediaUrl(item)}
            alt={item.caption || item.filename}
            className="w-full h-full object-cover"
          />
        ) : item.type === 'video' ? (
          <video
            src={getMediaUrl(item)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-8 w-8 mx-auto text-gray-400" />
              <p className="text-xs text-muted-foreground mt-1 px-2 truncate">
                {item.filename}
              </p>
            </div>
          </div>
        )}
      </button>

      {/* Overlay buttons */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={onDelete}
          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      {/* Caption */}
      {item.caption && (
        <p className="text-xs text-gray-600 mt-1 truncate">{item.caption}</p>
      )}
    </div>
  );
}

interface EditCaptionFormProps {
  initialCaption: string;
  onSave: (caption: string) => void;
  onCancel: () => void;
}

function EditCaptionForm({ initialCaption, onSave, onCancel }: EditCaptionFormProps) {
  const [caption, setCaption] = useState(initialCaption);

  return (
    <div className="space-y-4">
      <Input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Enter caption..."
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(caption)} className="bg-primary hover:bg-primary/90">
          Save
        </Button>
      </div>
    </div>
  );
}
