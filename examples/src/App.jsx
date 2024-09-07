import React, { useState } from 'react';
import DraggableButton from '../../src/DraggableButton';

const App = () => {
    const [isVisible, setIsVisible] = useState(true);

    const props = {
        blurDelay: 2000,
        closeButtonBottom: '150px',
        closeButtonClassName: 'custom-close-btn-class',
        onClick: () => console.log('Clicked!'),
        onClose: () => console.log('Closed!'),
        overlayClassName: 'custom-overlay-class',
        verticalThreshold: 50,
        xPosition: '4px',
        yPosition: '200px',
        className: 'custom-class',
        stickyEdge: 'left',
    }

    const controlledProps = {
        ...props,
        blurDelay: 4000,
        closeButtonBottom: '50px',
        verticalThreshold: 10,
        yPosition: '300px',
        stickyEdge: 'right',
    }

    return (
        <>
            <DraggableButton {...props}>UNCONTROLLED</DraggableButton>
            <DraggableButton {...controlledProps} isVisible={isVisible} onClose={() => setIsVisible(false)}>CONTROLLED</DraggableButton>
        </>
    )
}

export default App;