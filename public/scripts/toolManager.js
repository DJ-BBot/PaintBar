import { PencilTool, EraserTool, FillTool, TextTool, SelectionTool } from './basicTools.js';
import { RectangleTool, CircleTool, LineTool, TriangleTool } from './objectTools.js';

export class ToolManager {
    constructor(paintBar) {
        this.paintBar = paintBar;
        this.activeTool = null;
        
        // Initialize all tools
        this.tools = {
            // Basic tools
            pencil: new PencilTool(paintBar),
            eraser: new EraserTool(paintBar),
            fill: new FillTool(paintBar),
            text: new TextTool(paintBar),
            select: new SelectionTool(paintBar),
            
            // Object tools
            rectangle: new RectangleTool(paintBar),
            circle: new CircleTool(paintBar),
            line: new LineTool(paintBar),
            triangle: new TriangleTool(paintBar)
        };
        
        // Set default tool
        this.setActiveTool('pencil');
    }

    setActiveTool(toolName) {
        const prevTool = this.activeTool;
        if (prevTool) {
            prevTool.deactivate();
        }
        
        this.activeTool = this.tools[toolName];
        if (this.activeTool) {
            this.activeTool.activate();
        }

        // Update UI state
        this.updateToolButtons(toolName);
        this.updateCursor(toolName);
        this.updateOverlayVisibility(toolName);
        this.updateTriangleTypeVisibility(toolName);
    }

    updateToolButtons(toolName) {
        // Reset all tool buttons
        const toolButtons = document.querySelectorAll('.submenu-content button');
        toolButtons.forEach(btn => btn.classList.remove('active'));

        // Set the active button
        const buttonId = `${toolName}Btn`;
        const activeBtn = document.getElementById(buttonId);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    updateCursor(toolName) {
        if (toolName === 'text') {
            this.paintBar.canvas.style.cursor = 'text';
        } else if (toolName === 'eyedropper') {
            this.paintBar.canvas.style.cursor = 'crosshair';
        } else {
            this.paintBar.canvas.style.cursor = 'crosshair';
        }
    }

    updateOverlayVisibility(toolName) {
        const overlayCanvas = this.paintBar.overlayCanvas;
        const isShapeTool = ['rectangle', 'circle', 'line', 'triangle'].includes(toolName);
        
        if (toolName === 'select' || isShapeTool) {
            overlayCanvas.classList.add('active');
            overlayCanvas.style.pointerEvents = 'auto';
        } else {
            overlayCanvas.classList.remove('active');
            overlayCanvas.style.pointerEvents = 'none';
        }
    }

    updateTriangleTypeVisibility(toolName) {
        const triangleTypeSelect = document.getElementById('triangle-type');
        if (triangleTypeSelect) {
            if (toolName === 'triangle') {
                triangleTypeSelect.classList.remove('hidden');
            } else {
                triangleTypeSelect.classList.add('hidden');
            }
        }
    }

    handleMouseDown(point) {
        if (this.activeTool) {
            this.activeTool.onMouseDown(point);
        }
    }

    handleMouseMove(point) {
        if (this.activeTool) {
            this.activeTool.onMouseMove(point);
        }
    }

    handleMouseUp(point) {
        if (this.activeTool) {
            this.activeTool.onMouseUp(point);
        }
    }
}
