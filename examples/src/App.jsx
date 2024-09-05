import React, { useState } from 'react';
import DraggableButton from '../../src/DraggableButton';

const App = () => {
    const [isVisible, setIsVisible] = useState(true);
    return (
        <DraggableButton isVisible={isVisible} onClose={() => setIsVisible(false)} text='Expanded Text' />
    )
}

export default App;