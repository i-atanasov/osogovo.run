import React from 'react';
import { PopUpWrapper } from './styles';

function PopUp({showPopUp, closePopUp, children}: { showPopUp: boolean, closePopUp: React.Dispatch<React.SetStateAction<boolean>>, children: React.ReactNode}){
    // const [ showPopUpState, setShowPopUpState ] = React.useState(showPopUp);
    if (!showPopUp) {
        return null;
    }
    return (
        <PopUpWrapper >
            <button className="close-button" onClick={() => closePopUp(false)} >
                Затвори
            </button>
            {children}
        </PopUpWrapper>
    );
};

export default PopUp;
