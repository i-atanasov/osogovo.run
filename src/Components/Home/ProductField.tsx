import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";
import { products, fullRoute } from "../../config/constants";
import { AnimatedSign, InfoSign, ProductFieldWrapper, ProductBoxContainer, ProductFieldContainer, AnimationWrapper, ScrollPrompt } from "./styles";
import ProductBox from "../ProductBox/ProductBox";

export const RenderFullRoute = () => {
    const { t } = useTranslation();
    // Intersection observer to detect when the component is in view
    const { ref, inView, entry } = useInView({
        threshold: 0.1, // Trigger when 10% of the component is visible
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
                    if (distanceRef.current && (distance <= totalDistance)) {
                        distanceRef.current.textContent = t('home:route.distance', { distance: Math.floor(distance) });
                    }
                }, 7000/totalDistance);
            }
            if (!elevationTimer) {
                elevationTimer = setInterval(() => {
                    elevation += 2; 
                    if (elevationRef.current && (elevation <= totalElevation)) {
                        elevationRef.current.textContent = t('home:route.elevation', { elevation: Math.floor(elevation) });
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

    return (<>
            <InfoSign inView={inView} className="product-field"><span ref={distanceRef}>{t('home:route.distance', { distance: 0 })}</span><br/> <span ref={elevationRef}>{t('home:route.elevation', { elevation: 0 })}</span></InfoSign>
            <AnimatedSign inView={inView} delay="4s" top="25%" left="32.5%" dangerouslySetInnerHTML={{ __html: `${t('home:route.coldSpring.name')} <span>${t('home:route.coldSpring.altitude')}</span>` }} />
            <AnimatedSign inView={inView} delay="5s" top="21%" left="49.5%" color="white" dangerouslySetInnerHTML={{ __html: `${t('home:route.hut.name')} <span>${t('home:route.hut.altitude')}</span>` }} />
            <AnimatedSign inView={inView} delay="6s" top="19%" left="70%" dangerouslySetInnerHTML={{ __html: `${t('home:route.begBunar.name')} <br/><span>${t('home:route.begBunar.altitude')}</span>` }} />
            <AnimatedSign inView={inView} delay="7s" top="10%" left="93%" color="white" dangerouslySetInnerHTML={{ __html: `${t('home:route.ruen.name')} <br/> <span>${t('home:route.ruen.altitude')}</span>` }} />
            <AnimationWrapper ref={ref} inView={inView} className="route-svg" dangerouslySetInnerHTML={{ __html: fullRoute }} />
        </>
    );
}

const ProductField = () => {
    const { t } = useTranslation();
    const scrollPromptRef = React.useRef<HTMLAnchorElement>(null);
    const productTranslationKeys = ['osogovoRun14', 'ruenRun26'];
    const translatedProducts = products.map((product, index) => {
        const productKey = productTranslationKeys[index];

        return {
            ...product,
            elevation: `<b>${t('home:products.elevation')}:</b> ${t(`home:products.${productKey}.elevation`)}`,
            name: t(`home:products.${productKey}.name`),
            startingPoint: `<b>${t('home:products.start')}:</b> ${t(`home:products.${productKey}.start`)}`,
            final: `<b>${t('home:products.finish')}:</b> ${t(`home:products.${productKey}.finish`)}`,
            startingTime: `<b>${t('home:products.startTime')}:</b> ${t(`home:products.${productKey}.startTime`)}`,
            totalDistance: `<b>${t('home:products.totalDistance')}:</b> ${t(`home:products.${productKey}.totalDistance`)}`,
            cutOffTime: `<b>${t('home:products.cutOffTime')}:</b> ${t(`home:products.${productKey}.cutOffTime`)}`,
            description: t(`home:products.${productKey}.description`),
        };
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (scrollPromptRef.current) {
                scrollPromptRef.current.style.opacity = '0';
                scrollPromptRef.current.style.pointerEvents = 'none';
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <ProductFieldWrapper>
            <ProductFieldContainer>                
                <ScrollPrompt href="#product-box-container" ref={scrollPromptRef}>
                    <span>{t('home:route.scrollPrompt')}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 3v10M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </ScrollPrompt>                <RenderFullRoute />
                <img
                    src='https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/product-box-image.png'
                    alt="Route"
                />
            </ProductFieldContainer>
            <ProductBoxContainer id="product-box-container">
                {translatedProducts.map((product, index) => (
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