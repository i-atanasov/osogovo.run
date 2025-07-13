import React from "react";
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
    
    return (
        <ImagesFieldWrapper>
            {renderImages(11)}
        </ImagesFieldWrapper>
    );
};

export default ImagesField;
