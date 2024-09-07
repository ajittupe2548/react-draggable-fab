import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CloseBoldSvg } from './svg-icons';

import './draggable-button.css';

const propTypes = {
    /* Delay before applying the grayed-out (blurred) button style, in milliseconds. */
    blurDelay: PropTypes.number,
    /** CSS `bottom` property value for the close button. */
    closeButtonBottom: PropTypes.string,
    /** Additional CSS class for the close button. */
    closeButtonClassName: PropTypes.string,
    /** If `true`, the button will be visible. */
    isVisible: PropTypes.bool,
    /** Callback function triggered when the button is clicked. */
    onClick: PropTypes.func,
    /* Callback function triggered when the draggable button is dropped onto the close button.  */
    onClose: PropTypes.func,
    /* Additional CSS class for the overlay (background blackout).  */
    overlayClassName: PropTypes.string,
    /* Threshold value for vertical positioning. The component will not stick above or below this threshold. */
    verticalThreshold: PropTypes.number,
    /** Horizontal position (CSS `left` or `right`) of the component relative to the window. */
    xPosition: PropTypes.string,
    /** Vertical position (CSS `top`) of the component relative to the window. */
    yPosition: PropTypes.string,
    /** Additional CSS class for the component wrapper. */
    className: PropTypes.string,
    /** The edge of the screen where the button will stick (`left` or `right`). */
    stickyEdge: PropTypes.oneOf(['left', 'right']),
    /** Content inside the draggable button. */
    children: PropTypes.node,
};

function DraggableButton({
    blurDelay = 3000,
    closeButtonBottom = '100px',
    closeButtonClassName = '',
    isVisible: isVisibleProp,
    onClick = () => {},
    onClose = () => {},
    overlayClassName = '',
    verticalThreshold = 50,
    xPosition = '0',
    yPosition = '400px',
    className = '',
    stickyEdge = 'left',
    children,
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [isVisible, setIsVisible] = useState(isVisibleProp ?? true);

    const buttonElemRef = useRef();
    const closeButtonElemRef = useRef();
    const dataRef = useRef({
        isCloseButtonHovered: false,
        isMouseDown: false,
        isTouchEvent: false,
    })

    useEffect(() => {
        buttonElemRef.current.style.opacity = 0.5;
        window.addEventListener('mousemove', handleMove);

        return () => {
            document.body.style.height = 'auto';
            document.body.style.overflow = 'auto';
            window.removeEventListener('mousemove', handleMove);
        };
    }, []);

    useEffect(() => {
        if(isVisibleProp !== undefined) {
            setIsVisible(isVisibleProp);
        }
    }, [isVisibleProp]);

    const handleStart = useCallback((event) => {
        dataRef.current.isTouchEvent = event.type === 'touchstart';
        if(event.type !== 'touchstart') {
            dataRef.current.isMouseDown = true;
        }
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
        buttonElemRef.current.style.opacity = 1;
    }, []);

    const handleMove = useCallback((event) => {
        event.stopPropagation();
        if(!dataRef.current.isTouchEvent && !dataRef.current.isMouseDown) return;
        const clientX = dataRef.current.isTouchEvent ? event.changedTouches[0].clientX : event.clientX;
        const clientY = dataRef.current.isTouchEvent ? event.changedTouches[0].clientY : event.clientY;

        const { left, right, top, bottom } = closeButtonElemRef.current.getBoundingClientRect();

        const { clientWidth, clientHeight, style } = buttonElemRef.current;

        let topPosition = clientY - clientHeight / 2;
        let leftPosition = clientX - clientWidth / 2;
        let bottomPosition = clientY + clientHeight / 2;
        let rightPosition = clientX + clientWidth / 2;

        const maxTop = window.innerHeight - clientHeight;
        const maxLeft = window.innerWidth - clientWidth;

        if (topPosition < 0) topPosition = 0;
        if (topPosition > maxTop) topPosition = maxTop;
        if (leftPosition < 0) {
            leftPosition = 0;
            rightPosition = clientWidth;
        }
        if (leftPosition > maxLeft) {
            rightPosition = window.innerWidth;
            leftPosition = maxLeft;
        };

        const closeButtonHovered =
            bottomPosition > top &&
            topPosition < bottom &&
            rightPosition > left &&
            leftPosition < right;

        if (closeButtonHovered) {
            closeButtonElemRef.current.style.transform = 'translate(-50%, 0) scale(1.2)';
            dataRef.current.isCloseButtonHovered = true;
        } else {
            closeButtonElemRef.current.style.transform = 'translate(-50%, 0)';
            dataRef.current.isCloseButtonHovered = false;
        }

        style.top = `${topPosition}px`;
        style.left = `${leftPosition}px`;
        style.right = `${window.innerWidth - rightPosition}px`;

        if (!isDragging) {
            style.transition = null;
            setIsDragging(true);
        }
    }, [isDragging]);

    const handleEnd = useCallback((event) => {
        if(!dataRef.current.isTouchEvent) {
            dataRef.current.isMouseDown = false;
        }
        const clientX = dataRef.current.isTouchEvent ? event.changedTouches[0].clientX : event.clientX;
        const clientY = dataRef.current.isTouchEvent ? event.changedTouches[0].clientY : event.clientY;
        const { clientHeight, style } = buttonElemRef.current;
        const windowHeight = window.innerHeight;

        if (isDragging) {
            const shouldStickonLeft = clientX < window.innerWidth / 2;

            let yPosition;
            if (windowHeight - clientY < verticalThreshold) {
                yPosition = windowHeight - (verticalThreshold + clientHeight / 2);
            } else if (windowHeight - clientY > windowHeight - verticalThreshold) {
                yPosition = (verticalThreshold + clientHeight / 2);
            } else {
                yPosition = clientY;
            }

            style.top = `${yPosition - clientHeight / 2}px`;
            style.left = shouldStickonLeft ? xPosition : null;
            style.right = !shouldStickonLeft ? xPosition : null;
            buttonElemRef.current.style.opacity = 0.5;
            style.transition = `inset 0.5s, opacity 0.2s linear ${blurDelay / 1000}s`;

            if (dataRef.current.isCloseButtonHovered && onClose) {
                onClose();
                if(isVisibleProp === undefined) {
                    setIsVisible(false);
                }
            }
            setIsDragging(false);
        } else if (onClick) {
            onClick(event);
        }

        document.body.style.height = 'auto';
        document.body.style.overflow = 'auto';
    }, [isDragging, verticalThreshold, blurDelay, onClose, onClick]);

    const initialPositionStyles = {
        top: yPosition,
        transition: `opacity 0.2s linear ${blurDelay / 1000}s`,
        ...(stickyEdge === 'right' ? { right: xPosition } : { left: xPosition }),
    };

    const wrapperClass = `container ${className} ${isVisible ? '' : 'display-none'}`.trim();
    const closeButtonClass = `close-button ${closeButtonClassName}`.trim();
    const overlayClass = `overlay ${overlayClassName}`.trim();

    return (
        <>
            <div
                style={initialPositionStyles}
                className={wrapperClass}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                onMouseDown={handleStart}
                onMouseUp={handleEnd}
                ref={buttonElemRef}
            >
                {children}
            </div>
            <div
                className={closeButtonClass}
                style={{
                    bottom: isDragging ? closeButtonBottom : -100,
                }}
                ref={closeButtonElemRef}
            >
                <CloseBoldSvg />
            </div>
            {isDragging && <div className={overlayClass} />}
        </>
    );
}

DraggableButton.propTypes = propTypes;

export default DraggableButton;
