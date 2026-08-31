import React from 'react';
import { useTranslation } from 'react-i18next';
import { PopUpWrapper } from './styles';

function PopUp({showPopUp, closePopUp, children}: { showPopUp: boolean, closePopUp: React.Dispatch<React.SetStateAction<boolean>>, children: React.ReactNode}){
    const { t } = useTranslation();
    // const [ showPopUpState, setShowPopUpState ] = React.useState(showPopUp);
    if (!showPopUp) {
        return null;
    }
    return (
        <PopUpWrapper >
            <button className="close-button" onClick={() => closePopUp(false)} >
                {t('actions.close')}
            </button>
            {children}
        </PopUpWrapper>
    );
};

export default PopUp;
