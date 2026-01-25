'use client';

import Lottie from 'lottie-react'
import learning from '@/public/lottie/Learning.json';


interface LearningLottieProps {
    className?: string;
    style?: React.CSSProperties;
}

export function LearningLottie({ className, style } : LearningLottieProps){
    return (
        <div className={className} style={style}>
            <Lottie
                animationData={learning}
                loop
                autoPlay
                style={{ width: '100%', height: '100%'}}
                />
        </div>
    )
}