// Базовые настройки для переменных
let myColor = "red"; // Первичный цвет
let brushSize = 10; // -- -- -- размер
let canvas: HTMLCanvasElement | null = null; // Ссылка на canvas элемент (чтобы его вообще видели)
let ctx: CanvasRenderingContext2D | null = null; // Контекст для рисования
let isDrawing = false; // Флаг рисования

export function initPaint() {
    console.log("Initializing paint...");

    canvas = document.getElementById("paint") as HTMLCanvasElement | null; //Нали переменную

    if (!canvas) {
        console.error("Canvas not found");
        return;
    }

    ctx = canvas.getContext("2d"); // Определили переменную ctx для дальнейшей работы

    if (!ctx) {
        console.error("Context not found");
        return;
    }

    initializeControls(); // Настройки управления слайдером и кнопками
                        // Вариации работы с холстом

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
    // Управление всеми элементами. Це логика
    // Тут вроде все понятно, нет смысла описывать
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

function draw(e: MouseEvent) { // Само рисования
    if (!ctx || !canvas) return;
// Координаты мыши в пространстве
    const x = e.offsetX;
    const y = e.offsetY;
// Начальный цвет
    ctx.fillStyle = myColor;
    // Расстояние от нач. точки до конца
    ctx.beginPath();
    // Главный мем, как понял, можно сделать разные фигуры. Но делать этого не будет
    // А вообще тут arc(x, y, радиус, начальный угол, конечный угол)
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    //Закрасить
    ctx.fill();
}

function clearCanvas() {  // Сбор всех пропсов рисования
    if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}