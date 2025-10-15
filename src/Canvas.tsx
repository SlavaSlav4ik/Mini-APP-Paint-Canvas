let myColor = "red";
let brushSize = 10;
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let isDrawing = false;

export function initPaint() {
    console.log("Initializing paint...");

    canvas = document.getElementById("paint") as HTMLCanvasElement | null;

    if (!canvas) {
        console.error("Canvas not found");
        return;
    }

    ctx = canvas.getContext("2d");

    if (!ctx) {
        console.error("Context not found");
        return;
    }

    initializeControls();

    canvas.onmousedown = (e) => {
        isDrawing = true;
        draw(e);
    };

    canvas.onmousemove = (e) => {
        if (isDrawing) {
            draw(e);
        }
    };

    canvas.onmouseup = () => {
        isDrawing = false;
        ctx!.beginPath();
    };

    canvas.onmouseout = () => {
        isDrawing = false;
        ctx!.beginPath();
    };
}

function initializeControls() {
    const colorInput = document.getElementById('color') as HTMLInputElement;
    if (colorInput) {
        colorInput.addEventListener('input', (e) => {
            myColor = (e.target as HTMLInputElement).value;
        });
    }

    const clearButton = document.getElementById('clear') as HTMLButtonElement;
    if (clearButton) {
        clearButton.addEventListener('click', clearCanvas);
    }

    const brushSizeSlider = document.getElementById('brushSize') as HTMLInputElement;
    const brushSizeValue = document.getElementById('brushSizeValue') as HTMLSpanElement;

    if (brushSizeSlider && brushSizeValue) {
        brushSizeSlider.value = brushSize.toString();
        brushSizeValue.textContent = brushSize.toString();

        brushSizeSlider.addEventListener('input', (e) => {
            brushSize = parseInt((e.target as HTMLInputElement).value);
            brushSizeValue.textContent = brushSize.toString();
        });
    }
}

function draw(e: MouseEvent) {
    if (!ctx || !canvas) return;

    const x = e.offsetX;
    const y = e.offsetY;

    ctx.fillStyle = myColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
}

function clearCanvas() {
    if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}