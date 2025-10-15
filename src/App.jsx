//Знаю, грязно можно было бы сделать нормально

import { useEffect } from 'react';
import './App.css'
import { initPaint } from "./Canvas";
import { BackFrontAunt } from "./BackFrontAunt";

function App() {
    useEffect(() => {
        initPaint();
    }, []);

    return (
        <div className="wrapper">
            <BackFrontAunt />

            <div className="wrapper-v2">
                <canvas
                    id="paint"
                    className="paint"
                    width={800}
                    height={600}
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