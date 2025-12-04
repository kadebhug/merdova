'use client';

import React, { useEffect, useLayoutEffect, useRef, createContext, useContext, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);

export const useLenis = () => useContext(LenisContext);

const ScrollManager = ({ children }) => {
    const [lenis, setLenis] = useState(null);

    useLayoutEffect(() => {
        const lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        setLenis(lenisInstance);

        // Synchronize Lenis with GSAP ScrollTrigger
        lenisInstance.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenisInstance.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        return () => {
            lenisInstance.destroy();
            gsap.ticker.remove((time) => {
                lenisInstance.raf(time * 1000);
            });
        };
    }, []);

    return (
        <LenisContext.Provider value={lenis}>
            <div className="scroll-container">
                {children}
            </div>
        </LenisContext.Provider>
    );
};

export default ScrollManager;
