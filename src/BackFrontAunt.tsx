import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
}

interface BackFrontAuntProps {
    particleCount?: number;
    particleColors?: string[];
    baseColor?: string;
    connectionDistance?: number;
    particleSize?: { min: number; max: number };
    speed?: { min: number; max: number };
    mouseInteraction?: boolean;
}

export function BackFrontAunt({
    //Самые важные ТТХ этих пропсов!! Можно просто забить и прописывать их в JS (не уверен, что можно в JSX)
                                  particleCount = 250, // кол-во объектов?? максимум 500 (более нагрузит пк)
                                  particleColors = [], // есть пустой массив, то рандомный цвет будет
                                  baseColor='rgba(0, 0, 0, 0.5)' , //3 цвета и ласт прозрачность объектов движения
                                  connectionDistance = 15, // расстояния отрисовки сетей между объектами
                                  particleSize = { min: 2, max: 5 }, // Размерность объектов
                                  speed = { min: -2, max: 2 }, // Движение объекта лево-право??право-лево
                                             //Тут обязательно нужно смотреть в ТТХ, чтобы сделать правильное направление
                                  mouseInteraction = true // Реакция на курсор
                              }: BackFrontAuntProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        console.log("BackFrontAunt component mounted");
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("Canvas not found");
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("Context not found");
            return;
        }

        // Установим размеры canvas
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();

        const particles: Particle[] = [];
        let mouseX = -9999;
        let mouseY = -9999;
        const mouseRadius = 150;

        // Создаем частицы
        for (let i = 0; i < particleCount; i++) {
            let color: string;

            if (particleColors.length > 0) {
                color = particleColors[Math.floor(Math.random() * particleColors.length)];
            } else {
                const hue = Math.random() * 360;
                const saturation = 70 + Math.random() * 30;
                const lightness = 50 + Math.random() * 20;
                color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            }

            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * (particleSize.max - particleSize.min) + particleSize.min,
                speedX: Math.random() * (speed.max - speed.min) + speed.min,
                speedY: Math.random() * (speed.max - speed.min) + speed.min,
                color: color
            });
        }

        let animationFrameId: number;

        // Обработчики мыши
        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const handleMouseLeave = () => {
            mouseX = -9999;
            mouseY = -9999;
        };

        if (mouseInteraction) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseleave', handleMouseLeave);
        }

        function animate() {
            if (!ctx || !canvas) return;

            ctx.fillStyle = baseColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                // Взаимодействие с мышью
                if (mouseInteraction) {
                    const dx = particle.x - mouseX;
                    const dy = particle.y - mouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Придаем ускорение частиц, когда идет взаимодействие с курсором
                    // Тут есть прикол, что все перемножается между собой, и нужно бдить
                    // Так же меняется их движение через atan(любое) лево-право??право-лево
                    if (distance < mouseRadius) {
                        const force = (mouseRadius - distance) / mouseRadius;
                        const angle = Math.atan2(dy, dx);
                        particle.x += Math.cos(angle) * force * 10;
                        particle.y += Math.sin(angle) * force * 10;
                    }
                }

                // Обычное движение
                // Тут главное правильно рассчитать начальную скорость, ибо она пойдет в умножение далее
                // Более 2 нельзя ставить, в этом случаи
                // Отрицательные значения недопустимы, ибо будет кататься без отклонений ровно право/лево - вниз/вверх
                particle.x += particle.speedX //* 2;
                particle.y += particle.speedY //* 2;

                // Управление скоростью, когда сталкиваются с границей на X and Y
                // Все значения обязаны быть отрицательные, чтобы они отталкивались от стен
                // Если будет положительные значения будет ходить по границе Y and X (Не делать так)
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -2;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -2;

                // Ограничиваем позиции, чтобы они бились об границы экрана,
                // Можно и убрать, тогда просто уйдут за границу.
                // Если так сделать, тогда нужно прописывать рендер их или время жизни (гемор)
                particle.x = Math.max(0, Math.min(canvas.width, particle.x));
                particle.y = Math.max(0, Math.min(canvas.height, particle.y));

                // Рисуем частицу кол-во
                // Начальная точка
                ctx.beginPath();
                // Рисуем круг: центр в точке (x,y), радиус R, от 0 до 360 градусов
                // Тут главная фишка состоит в том, что Math.PI = 180 градусов, а чтобы поменять его
                // Math.PI * 2 = 360 ?? Более 2 не может быть (вроде как(точно))
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                // Обычный выбор цветовая палитра.
                ctx.fillStyle = particle.color;
                // Закрасить
                ctx.fill();
            });

            // Рисуем линии между близкими частицами
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    // Тут просто меняем соединения, dx * dy + dy * dy, тут на свое усмотрение, как лучше сделать
                    // Эксперимент dx * dy + dy * dx, как пример красивых соед.
                    const distance = Math.sqrt(dx * dy + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / connectionDistance)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        // Обработчик изменения размера окна
        const handleResize = () => {
            setCanvasSize();
        };

        window.addEventListener('resize', handleResize);

        // Очистка
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            if (mouseInteraction) {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [particleCount, particleColors, baseColor, connectionDistance, particleSize, speed, mouseInteraction]);


    // Вообще можно забить на настройки отдельные, прописные истины, что делаешь выше.
    // Можно просто писать их в голом JS
    //<BackFrontAunt
    //particleCount={40}
    //speed={{ min: -0.8, max: 0.8 }}
    //particleSize={{ min: 1.5, max: 3 }}
    //particleColors={['#FF69B4', '#FF1493', '#FFB6C1', '#DB7093']}
    // baseColor="rgba(75, 0, 30, 0.04)"
    //   connectionDistance={130}
   // />
//Это как пример, как можно поменять, почитал по инструкциям, лучше так не делать, ибо будут непонятки в алгл. урав.
    return (
        <canvas
            ref={canvasRef}
            id="BackFrontAunt"
            className="BackFrontAunt"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
            }}
        />
    );
}