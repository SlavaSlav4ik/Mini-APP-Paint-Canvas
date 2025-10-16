// Немного грязно получилось, но что поделать.
import { useEffect } from 'react';
import './App.css'
import { initPaint } from "./Canvas";
import BackFrontAunt from "./BackFrontAuntContainer"



function App() {
    useEffect(() => {
        initPaint();
    }, []);

    return (
        <div className="wrapper">
            <BackFrontAunt />

            <div className="wrapper-v2">

                <div className="paint-header">
                    <h1 className="paint-title">Paint</h1>
                </div>

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