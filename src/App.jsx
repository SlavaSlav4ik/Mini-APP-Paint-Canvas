import { useEffect } from 'react';
import './App.css'
import { initPaint } from "./Canvas";

function App() {
    useEffect(() => {
        //Рендер после создания DOM с тайм лагом в 5 сек
        initPaint();
    }, []);

    return (
        <div className="wrapper">
            <div className="wrapper-v2">
                <canvas
                    id="paint"
                    className="paint"
                    width={800}
                    height={600}
                    style={{
                        border: '1px solid #000',
                        cursor: 'crosshair'
                    }}
                ></canvas>
                <div className="tools">
                    <div className="color-picker">
                        <input
                            type="color"
                            id="color"
                            className="color-input"
                            defaultValue="#ff0000"
                        />
                    </div>
                    <div className="brush-controls">
                        <label htmlFor="brushSize">Толщина кисти:</label>
                        <input
                            type="range"
                            id="brushSize"
                            min="1"
                            max="50"
                            defaultValue="10"
                        />
                        <span id="brushSizeValue">10</span>
                    </div>
                    <div className="buttons">
                        <button id="clear">Очистить</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App