'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Pencil,
  Eraser,
  RotateCcw,
  Download,
  Circle,
  Square,
  Minus,
  TreeDeciduous,
  Undo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Point {
  x: number;
  y: number;
}

interface DrawAction {
  type: 'path' | 'circle' | 'rectangle' | 'line' | 'text';
  points: Point[];
  color: string;
  width: number;
  text?: string;
}

interface TreeSketchProps {
  initialData?: string; // Base64 image data
  onSave?: (imageData: string) => void;
  height?: number;
}

const COLORS = [
  { name: 'Black', value: '#1a1d21' },
  { name: 'Gold', value: '#B4975A' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Orange', value: '#ea580c' },
];

const BRUSH_SIZES = [2, 4, 8, 12];

export function TreeSketch({ initialData, onSave, height = 400 }: TreeSketchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'circle' | 'rectangle' | 'line'>('pen');
  const [color, setColor] = useState('#1a1d21');
  const [brushSize, setBrushSize] = useState(4);
  const [actions, setActions] = useState<DrawAction[]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = height;

    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load initial data if provided
    if (initialData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = initialData;
    }
  }, [height, initialData]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw all actions
    actions.forEach((action) => {
      ctx.strokeStyle = action.color;
      ctx.fillStyle = action.color;
      ctx.lineWidth = action.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      switch (action.type) {
        case 'path':
          if (action.points.length < 2) return;
          ctx.beginPath();
          ctx.moveTo(action.points[0].x, action.points[0].y);
          action.points.forEach((point) => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
          break;

        case 'circle':
          if (action.points.length < 2) return;
          const [center, edge] = action.points;
          const radius = Math.sqrt(
            Math.pow(edge.x - center.x, 2) + Math.pow(edge.y - center.y, 2)
          );
          ctx.beginPath();
          ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case 'rectangle':
          if (action.points.length < 2) return;
          const [start, end] = action.points;
          ctx.strokeRect(
            start.x,
            start.y,
            end.x - start.x,
            end.y - start.y
          );
          break;

        case 'line':
          if (action.points.length < 2) return;
          ctx.beginPath();
          ctx.moveTo(action.points[0].x, action.points[0].y);
          ctx.lineTo(action.points[1].x, action.points[1].y);
          ctx.stroke();
          break;
      }
    });
  }, [actions]);

  // Redraw canvas when actions change
  useEffect(() => {
    redrawCanvas();
  }, [actions, redrawCanvas]);

  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const point = getCanvasPoint(e);

    if (tool === 'pen' || tool === 'eraser') {
      setCurrentPath([point]);
    } else {
      setStartPoint(point);
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const point = getCanvasPoint(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    if (tool === 'pen' || tool === 'eraser') {
      setCurrentPath((prev) => [...prev, point]);

      // Draw in real-time
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (currentPath.length > 0) {
        ctx.beginPath();
        ctx.moveTo(currentPath[currentPath.length - 1].x, currentPath[currentPath.length - 1].y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    } else if (startPoint) {
      // Preview shape
      redrawCanvas();
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.setLineDash([5, 5]);

      switch (tool) {
        case 'circle':
          const radius = Math.sqrt(
            Math.pow(point.x - startPoint.x, 2) + Math.pow(point.y - startPoint.y, 2)
          );
          ctx.beginPath();
          ctx.arc(startPoint.x, startPoint.y, radius, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case 'rectangle':
          ctx.strokeRect(
            startPoint.x,
            startPoint.y,
            point.x - startPoint.x,
            point.y - startPoint.y
          );
          break;

        case 'line':
          ctx.beginPath();
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
          break;
      }
      ctx.setLineDash([]);
    }
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const point = getCanvasPoint(e);

    if (tool === 'pen' || tool === 'eraser') {
      if (currentPath.length > 0) {
        setActions((prev) => [
          ...prev,
          {
            type: 'path',
            points: [...currentPath, point],
            color: tool === 'eraser' ? '#ffffff' : color,
            width: tool === 'eraser' ? brushSize * 3 : brushSize,
          },
        ]);
      }
      setCurrentPath([]);
    } else if (startPoint) {
      setActions((prev) => [
        ...prev,
        {
          type: tool,
          points: [startPoint, point],
          color,
          width: brushSize,
        },
      ]);
      setStartPoint(null);
    }
  };

  const handleUndo = () => {
    setActions((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    setActions([]);
    setShowClearConfirm(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onSave) return;

    const imageData = canvas.toDataURL('image/png');
    onSave(imageData);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'tree-sketch.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const drawTemplate = (template: 'deciduous' | 'conifer' | 'palm') => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const centerX = canvas.width / 2;
    const baseY = canvas.height - 50;

    ctx.strokeStyle = '#B4975A';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    switch (template) {
      case 'deciduous':
        // Trunk
        ctx.beginPath();
        ctx.moveTo(centerX - 15, baseY);
        ctx.lineTo(centerX - 10, baseY - 100);
        ctx.lineTo(centerX + 10, baseY - 100);
        ctx.lineTo(centerX + 15, baseY);
        ctx.stroke();

        // Crown (ellipse-like shape)
        ctx.beginPath();
        ctx.ellipse(centerX, baseY - 180, 80, 100, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'conifer':
        // Trunk
        ctx.beginPath();
        ctx.moveTo(centerX - 10, baseY);
        ctx.lineTo(centerX - 8, baseY - 80);
        ctx.lineTo(centerX + 8, baseY - 80);
        ctx.lineTo(centerX + 10, baseY);
        ctx.stroke();

        // Triangular crown
        ctx.beginPath();
        ctx.moveTo(centerX, baseY - 280);
        ctx.lineTo(centerX - 70, baseY - 80);
        ctx.lineTo(centerX + 70, baseY - 80);
        ctx.closePath();
        ctx.stroke();
        break;

      case 'palm':
        // Trunk (curved)
        ctx.beginPath();
        ctx.moveTo(centerX - 12, baseY);
        ctx.quadraticCurveTo(centerX - 20, baseY - 150, centerX, baseY - 200);
        ctx.quadraticCurveTo(centerX + 20, baseY - 150, centerX + 12, baseY);
        ctx.stroke();

        // Fronds
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(centerX, baseY - 200);
          ctx.quadraticCurveTo(
            centerX + Math.cos(angle) * 60,
            baseY - 200 + Math.sin(angle) * 30,
            centerX + Math.cos(angle) * 100,
            baseY - 200 + Math.sin(angle) * 80
          );
          ctx.stroke();
        }
        break;
    }

    setShowTemplateMenu(false);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TreeDeciduous className="h-5 w-5 text-accent" />
          Tree Sketch
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b">
          {/* Tools */}
          <div className="flex gap-1" role="toolbar" aria-label="Drawing tools">
            <Button
              variant={tool === 'pen' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool('pen')}
              className={tool === 'pen' ? 'bg-primary' : ''}
              aria-label="Pen tool"
              aria-pressed={tool === 'pen'}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant={tool === 'eraser' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool('eraser')}
              className={tool === 'eraser' ? 'bg-primary' : ''}
              aria-label="Eraser tool"
              aria-pressed={tool === 'eraser'}
            >
              <Eraser className="h-4 w-4" />
            </Button>
            <Button
              variant={tool === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool('line')}
              className={tool === 'line' ? 'bg-primary' : ''}
              aria-label="Line tool"
              aria-pressed={tool === 'line'}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant={tool === 'circle' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool('circle')}
              className={tool === 'circle' ? 'bg-primary' : ''}
              aria-label="Circle tool"
              aria-pressed={tool === 'circle'}
            >
              <Circle className="h-4 w-4" />
            </Button>
            <Button
              variant={tool === 'rectangle' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool('rectangle')}
              className={tool === 'rectangle' ? 'bg-primary' : ''}
              aria-label="Rectangle tool"
              aria-pressed={tool === 'rectangle'}
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-border" />

          {/* Colors */}
          <div className="flex gap-1" role="radiogroup" aria-label="Color selection">
            {COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={cn(
                  'w-6 h-6 rounded-full border-2 transition-all',
                  color === c.value ? 'border-accent scale-110' : 'border-transparent'
                )}
                style={{ backgroundColor: c.value }}
                title={c.name}
                aria-label={`${c.name} color`}
                aria-checked={color === c.value}
                role="radio"
              />
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-border" />

          {/* Brush Size */}
          <div className="flex gap-1 items-center" role="radiogroup" aria-label="Brush size">
            {BRUSH_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={cn(
                  'flex items-center justify-center w-6 h-6 rounded border transition-all',
                  brushSize === size ? 'border-accent bg-accent/10' : 'border-border'
                )}
                title={`${size}px`}
                aria-label={`${size} pixel brush`}
                aria-checked={brushSize === size}
                role="radio"
              >
                <div
                  className="rounded-full bg-foreground"
                  style={{ width: size, height: size }}
                />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-border" />

          {/* Actions */}
          <div className="flex gap-1" role="toolbar" aria-label="Canvas actions">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={actions.length === 0}
              aria-label="Undo last action"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              aria-label="Clear canvas"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Templates */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplateMenu(!showTemplateMenu)}
            >
              <TreeDeciduous className="h-4 w-4 mr-1" />
              Template
            </Button>
            {showTemplateMenu && (
              <div className="absolute top-full mt-1 left-0 bg-popover border rounded-md shadow-lg z-10 p-2 space-y-1">
                <button
                  onClick={() => drawTemplate('deciduous')}
                  className="w-full px-3 py-1.5 text-sm text-left hover:bg-muted rounded"
                >
                  Deciduous Tree
                </button>
                <button
                  onClick={() => drawTemplate('conifer')}
                  className="w-full px-3 py-1.5 text-sm text-left hover:bg-muted rounded"
                >
                  Conifer
                </button>
                <button
                  onClick={() => drawTemplate('palm')}
                  className="w-full px-3 py-1.5 text-sm text-left hover:bg-muted rounded"
                >
                  Palm Tree
                </button>
              </div>
            )}
          </div>

          <div className="flex-1" />

          {/* Save/Download */}
          <div className="flex gap-1">
            {onSave && (
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90"
              >
                Save
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            className="w-full cursor-crosshair touch-none"
            style={{ height }}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Draw tree defects, crown shape, or annotate areas of concern. Use templates for quick outlines.
        </p>
      </CardContent>

      {/* Clear Confirmation Dialog */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Clear Sketch</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear the entire sketch? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmClear}>
              Clear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
