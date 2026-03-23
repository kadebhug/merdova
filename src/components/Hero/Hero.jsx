import React, { useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '../Layout/ScrollManager';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const heroRef = React.useRef(null);
    const contentRef = React.useRef(null);
    const blob1Ref = React.useRef(null);
    const blob2Ref = React.useRef(null);
    const highlightRef = React.useRef(null);
    const lenis = useLenis();

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Pin the hero section
            ScrollTrigger.create({
                trigger: heroRef.current,
                start: "top top",
                end: "+=100%", // Pin for 100% of viewport height
                pin: true,
                pinSpacing: false, // Allow next section to overlap
                scrub: true,
            });

            // Animate content out
            gsap.to(contentRef.current, {
                y: -100,
                opacity: 0,
                scale: 0.9,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                }
            });

            // Parallax blobs
            gsap.to([blob1Ref.current, blob2Ref.current], {
                y: 200,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                }
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    React.useEffect(() => {
        const hero = heroRef.current;
        const blob1 = blob1Ref.current;
        const blob2 = blob2Ref.current;

        if (!hero || !blob1 || !blob2) return;

        // Mouse position state
        let mouseX = -1000;
        let mouseY = -1000;

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const rect = hero.getBoundingClientRect();
            mouseX = clientX - rect.left;
            mouseY = clientY - rect.top;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Animation state
        let time = 0;

        // Configuration for each blob
        const blobs = [
            {
                element: blob1,
                floatSpeed: 0.01,
                floatRadius: 50,
                floatPhase: 0,
                magnetStrength: 0.3,
                magnetRadius: 300,
                x: 0,
                y: 0
            },
            {
                element: blob2,
                floatSpeed: 0.008,
                floatRadius: 70,
                floatPhase: Math.PI,
                magnetStrength: 0.2,
                magnetRadius: 350,
                x: 0,
                y: 0
            }
        ];

        const tick = () => {
            time += 1;

            blobs.forEach(blob => {
                const floatX = Math.sin(time * blob.floatSpeed + blob.floatPhase) * blob.floatRadius;
                const floatY = Math.cos(time * blob.floatSpeed + blob.floatPhase) * blob.floatRadius;

                const rect = blob.element.getBoundingClientRect();
                const heroRect = hero.getBoundingClientRect();

                const blobCenterX = (rect.left - heroRect.left) + rect.width / 2;
                const blobCenterY = (rect.top - heroRect.top) + rect.height / 2;

                const dx = mouseX - blobCenterX;
                const dy = mouseY - blobCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                let magnetX = 0;
                let magnetY = 0;

                if (distance < blob.magnetRadius) {
                    const force = 1 - (distance / blob.magnetRadius);
                    magnetX = dx * force * blob.magnetStrength;
                    magnetY = dy * force * blob.magnetStrength;
                }

                const targetX = floatX + magnetX;
                const targetY = floatY + magnetY;

                blob.x += (targetX - blob.x) * 0.1;
                blob.y += (targetY - blob.y) * 0.1;

                gsap.set(blob.element, { x: blob.x, y: blob.y });
            });
        };

        gsap.ticker.add(tick);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            gsap.ticker.remove(tick);
        };
    }, []);

    const underlineRef = React.useRef(null);

    const handleHighlightHover = () => {
        gsap.to(highlightRef.current, {
            backgroundSize: "200% 100%",
            duration: 0.5,
            ease: "power2.out"
        });

        if (underlineRef.current) {
            gsap.fromTo(underlineRef.current,
                { strokeDasharray: 300, strokeDashoffset: 300 },
                { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" }
            );
        }
    };

    const handleHighlightLeave = () => {
        gsap.to(highlightRef.current, {
            backgroundSize: "100% 100%",
            duration: 0.5,
            ease: "power2.out"
        });

        if (underlineRef.current) {
            gsap.to(underlineRef.current,
                { strokeDashoffset: 300, duration: 0.4, ease: "power2.in" }
            );
        }
    };

    const handleStartProjectClick = (e) => {
        e.preventDefault();
        const surveyElement = document.getElementById('survey');
        if (surveyElement && lenis) {
            lenis.scrollTo(surveyElement, { offset: -100 });
        }
    };

    const handleExploreServicesClick = (e) => {
        e.preventDefault();
        const servicesElement = document.getElementById('services');
        if (servicesElement && lenis) {
            lenis.scrollTo(servicesElement, { offset: -100 });
        }
    };

    return (
        <section id="hero" className="hero-section" ref={heroRef}>
            <div className="hero-background">
                <div className="blob blob-1" ref={blob1Ref}></div>
                <div className="blob blob-2" ref={blob2Ref}></div>
            </div>

            <div className="hero-content" ref={contentRef}>
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    We Build <span className="highlight-container">
                        <span
                            className="highlight"
                            ref={highlightRef}
                            onMouseEnter={handleHighlightHover}
                            onMouseLeave={handleHighlightLeave}
                        >AI-Powered Solutions</span>
                        <svg
                            className="underline-svg"
                            viewBox="0 0 300 15"
                            preserveAspectRatio="none"
                        >
                            <path
                                ref={underlineRef}
                                d="M5 8 Q 75 15 150 8 T 295 8"
                                stroke="url(#underline-gradient)"
                                strokeWidth="3"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <defs>
                                <linearGradient id="underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#C0A062" />
                                    <stop offset="100%" stopColor="#EAB308" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    Merdova helps businesses implement and integrate AI to drive real outcomes — from intelligent platforms to automated workflows and data-driven growth.
                </motion.p>

                <motion.div
                    className="hero-buttons"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                    <a href="#survey" className="btn btn-primary" onClick={handleStartProjectClick}>Start Your Journey</a>
                    <a href="#services" className="btn btn-secondary" onClick={handleExploreServicesClick}>Explore Solutions</a>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
