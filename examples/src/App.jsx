import React, { useState } from 'react';
import DraggableButton from '../../src/DraggableButton';

const App = () => {
    const [isVisible, setIsVisible] = useState(true);
    return (
        <DraggableButton isVisible={isVisible} onClose={() => setIsVisible(false)}>Expanded Text</DraggableButton>
    )
}

export default App;