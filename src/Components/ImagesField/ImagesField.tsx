import React, { useEffect, useRef } from "react";
import { ImagesFieldWrapper } from "./styles";

function shuffle(array: any[]) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

const renderImages = (count: number) => {
    const images = [];
    for (let i = 1; i < count; i++) {
        images.push(<img key={i} src={`https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/${i}.jpg`} alt={`Image ${i}`} />);
    }
    shuffle(images);
    return images;
}

const ImagesField: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        let direction = 1; // 1 for forward, -1 for backward

        const scroll = () => {
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            const nextScroll = scrollContainer.scrollLeft + (direction * 4);

            if (nextScroll >= maxScroll) {
                direction = -1;
                scrollContainer.scrollLeft = maxScroll;
            } else if (nextScroll <= 0) {
                direction = 1;
                scrollContainer.scrollLeft = 0;
            } else {
                scrollContainer.scrollLeft = nextScroll;
            }
        };

        const interval = setInterval(scroll, 30);
        return () => clearInterval(interval);
    }, []);
    
    return (
        <ImagesFieldWrapper ref={scrollContainerRef}>
            {renderImages(11)}
        </ImagesFieldWrapper>
    );
};

export default ImagesField;
