import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { products, fullRoute } from "../../config/constants";
import { AnimatedSign, InfoSign, ProductFieldWrapper, ProductBoxContainer, ProductFieldContainer, AnimationWrapper } from "./styles";
import ProductBox from "../ProductBox/ProductBox";

const ProductField = () => {
    // Intersection observer to detect when the component is in view
    const { ref, inView, entry } = useInView({
        threshold: 1,   
        triggerOnce: true, // Only trigger once when it comes into view
    });

    const distanceRef = useRef<HTMLDivElement>(null);
    const elevationRef = useRef<HTMLDivElement>(null);
    let distance = 0;
    let elevation = 0;
    const totalDistance = 26;
    const totalElevation = 1701;
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        let distanceTimer: NodeJS.Timeout | null = null;
        let elevationTimer: NodeJS.Timeout | null = null;

        const tick = () => {
            const remainingDistance = Math.min(
                totalDistance,
                distance
            );
            
            if (!distanceTimer) {
                distanceTimer = setInterval(() => {
                    distance += 1;
                    if (distanceRef.current) {
                        distanceRef.current.textContent = `${Math.floor(distance)}km`;
                    }
                }, 7000/totalDistance);
            }
            if (!elevationTimer) {
                elevationTimer = setInterval(() => {
                    elevation += 2; 
                    if (elevationRef.current && (elevation <= totalElevation)) {
                        elevationRef.current.textContent = `${Math.floor(elevation)}m D+`;
                    }
                }, 8);
            }
            if (remainingDistance < 26 || elevation < totalElevation) {
                frameRef.current =
                    requestAnimationFrame(tick);
            } else {
                if (distanceTimer) {
                    clearInterval(distanceTimer);
                    distanceTimer = null;
                }
                if (elevationTimer) {
                    clearInterval(elevationTimer);
                    elevationTimer = null;
                }
            }
        };
        
        frameRef.current = requestAnimationFrame(tick);

        return () => {
            if (frameRef.current)
                cancelAnimationFrame(frameRef.current);
            if (distanceTimer) {
                clearInterval(distanceTimer);
                distanceTimer = null;
            }
            if (elevationTimer) {
                clearInterval(elevationTimer);
                elevationTimer = null;
            }
        };
    }, [inView]);

    return (
        <ProductFieldWrapper>
            <ProductFieldContainer  >
                <InfoSign inView={inView} className="product-field"><span ref={distanceRef}>0 km</span><br/> <span ref={elevationRef}>0 m D+</span></InfoSign>
                <AnimatedSign inView={inView} delay="4s" top="25%" left="33%">Студен<br/> Кладенец <span>1340 м</span></AnimatedSign>
                <AnimatedSign inView={inView} delay="5s" top="20%" left="50%" color="white">хижа<br/> Осогово <span>1640 м</span></AnimatedSign>
                <AnimatedSign inView={inView} delay="6s" top="19%" left="70%">Бег Бунар <br/><span>1842 м</span></AnimatedSign>
                <AnimatedSign inView={inView} delay="7s" top="10%" left="93%" color="white">Руен <br/> <span>2251 м</span></AnimatedSign>
                <AnimationWrapper ref={ref} inView={inView} className="route-svg" dangerouslySetInnerHTML={{ __html: fullRoute }} />
                <img
                    src='https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/product-box-image.png'
                    alt="Route"
                />
            </ProductFieldContainer>
            <ProductBoxContainer>
                {products.map((product, index) => (
                    <ProductBox
                        key={index}
                        {...product}
                    />
                ))}
            </ProductBoxContainer>
        </ProductFieldWrapper>
    );
};

export default ProductField;