import React, { useState } from 'react';
import DraggableButton from '../../src/DraggableButton';

const App = () => {
    const [isVisible, setIsVisible] = useState(true);

    const props = {
        blurredBtnDelay: 2000,
        closeBtnBottomValue: '150px',
        closeBtnClassName: 'custom-close-btn-class',
        onClick: () => console.log('Clicked!'),
        onClose: () => console.log('Closed!'),
        overlayClassName: 'custom-overlay-class',
        threshold: 50,
        xPositionValue: '4px',
        yPositionValue: '200px',
        className: 'custom-class',
        align: 'left',
    }

    const controlledProps = {
        ...props,
        blurredBtnDelay: 4000,
        closeBtnBottomValue: '50px',
        threshold: 10,
        yPositionValue: '300px',
        align: 'right',
    }

    return (
        <>
            <DraggableButton {...props}>UNCONTROLLED</DraggableButton>
            <DraggableButton {...controlledProps} isVisible={isVisible} onClose={() => setIsVisible(false)}>CONTROLLED</DraggableButton>
        </>
    )
}

export default App;