import * as React from "react";
import { BackFrontAunt } from "./BackFrontAunt.tsx";

const BackFrontAuntContainer: React.FC = () => {
    const mathCount = 12;
    const [particleCount, setParticleCount] = React.useState(
        window.innerWidth / mathCount
    );

    React.useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const calcCount = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setParticleCount(window.innerWidth / mathCount);
            }, 250);
        };

        window.addEventListener("resize", calcCount);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("resize", calcCount);
        };
    }, []);

    return (
        <div>
            <BackFrontAunt particleCount={particleCount} />
        </div>
    );
};

export default BackFrontAuntContainer;