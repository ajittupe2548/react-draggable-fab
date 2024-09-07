import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CloseBoldSvg } from './svg-icons';

import './draggable-button.css';

const propTypes = {
    /* Delay to add grayed out button style. */
    blurredBtnDelay: PropTypes.number,
    /** Bottom style value for close btn */
    closeBtnBottomValue: PropTypes.string,
    /** Custom className for the close btn */
    closeBtnClassName: PropTypes.string,
    /** If `true`, It will be visible */
    isVisible: PropTypes.bool,
    /** Callback fired when user click on component */
    onClick: PropTypes.func,
    /* Callback fired when user drops draggable btn on close btn  */
    onClose: PropTypes.func,
    /* Custom classes for overlay(Blackout window)  */
    overlayClassName: PropTypes.string,
    /* Vertical threshold value for position, component will not stick below/above threshold value */
    threshold: PropTypes.number,
    /** Horizontal left position value of component from the window */
    xPositionValue: PropTypes.string,
    /** Vertical top position value of component from the window */
    yPositionValue: PropTypes.string,
    /** Custom class for the component wrapper. */
    className: PropTypes.string,
    /**Align button to left or right */
    align: PropTypes.oneOf(['left', 'right']),
};

function DraggableButton({
    blurredBtnDelay = 3000,
    closeBtnBottomValue = '100px',
    closeBtnClassName = '',
    isVisible: isVisibleProp,
    onClick = () => {},
    onClose = () => {},
    overlayClassName = '',
    threshold = 50,
    xPositionValue = '0',
    yPositionValue = '400px',
    className = '',
    align = 'left',
    children,
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [isTouch, setIsTouch] = useState(false);
    const [isVisible, setIsVisible] = useState(isVisibleProp ?? true);
    const isMouseDownRef = useRef(false);

    const draggableBtnRef = useRef();
    const closeBtnRef = useRef();
    const isCloseButtonHoveredRef = useRef(false);

    useEffect(() => {
        draggableBtnRef.current.style.opacity = 0.5;
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
        setIsTouch(event.type === 'touchstart');
        if(event.type !== 'touchstart') {
            isMouseDownRef.current = true;
        }
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
        draggableBtnRef.current.style.opacity = 1;
    }, []);

    const handleMove = useCallback((event) => {
        event.stopPropagation();
        if(!isTouch && !isMouseDownRef.current) return;
        const clientX = isTouch ? event.changedTouches[0].clientX : event.clientX;
        const clientY = isTouch ? event.changedTouches[0].clientY : event.clientY;

        const { left, right, top, bottom } = closeBtnRef.current.getBoundingClientRect();

        const { clientWidth, clientHeight, style } = draggableBtnRef.current;

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
            closeBtnRef.current.style.transform = 'translate(-50%, 0) scale(1.2)';
            isCloseButtonHoveredRef.current = true;
        } else {
            closeBtnRef.current.style.transform = 'translate(-50%, 0)';
            isCloseButtonHoveredRef.current = false;
        }

        style.top = `${topPosition}px`;
        style.left = `${leftPosition}px`;
        style.right = `${window.innerWidth - rightPosition}px`;

        if (!isDragging) {
            style.transition = null;
            setIsDragging(true);
        }
    }, [isDragging, isTouch]);

    const handleEnd = useCallback((event) => {
        if(!isTouch) {
            isMouseDownRef.current = false;
        }
        const clientX = isTouch ? event.changedTouches[0].clientX : event.clientX;
        const clientY = isTouch ? event.changedTouches[0].clientY : event.clientY;
        const { clientHeight, style } = draggableBtnRef.current;
        const windowHeight = window.innerHeight;

        if (isDragging) {
            const shouldStickonLeft = clientX < window.innerWidth / 2;

            let yPosition;
            if (windowHeight - clientY < threshold) {
                yPosition = windowHeight - (threshold + clientHeight / 2);
            } else if (windowHeight - clientY > windowHeight - threshold) {
                yPosition = (threshold + clientHeight / 2);
            } else {
                yPosition = clientY;
            }

            style.top = `${yPosition - clientHeight / 2}px`;
            style.left = shouldStickonLeft ? xPositionValue : null;
            style.right = !shouldStickonLeft ? xPositionValue : null;
            draggableBtnRef.current.style.opacity = 0.5;
            style.transition = `inset 0.5s, opacity 0.2s linear ${blurredBtnDelay / 1000}s`;

            if (isCloseButtonHoveredRef.current && onClose) {
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
    }, [isDragging, isTouch, threshold, blurredBtnDelay, onClose, onClick]);

    const initialPositionStyles = {
        top: yPositionValue,
        transition: `opacity 0.2s linear ${blurredBtnDelay / 1000}s`,
        ...(align === 'right' ? { right: xPositionValue } : { left: xPositionValue }),
    };

    return (
        <>
            <div
                style={initialPositionStyles}
                className={`container ${isVisible ? '' : 'display-none'} ${className}`}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                onMouseDown={handleStart}
                onMouseUp={handleEnd}
                ref={draggableBtnRef}
            >
                {children}
            </div>
            <div
                className={`closeButton ${closeBtnClassName}`}
                style={{
                    bottom: isDragging ? closeBtnBottomValue : -100,
                }}
                ref={closeBtnRef}
            >
                <CloseBoldSvg />
            </div>
            {isDragging && <div className={`overlay ${overlayClassName}`} />}
        </>
    );
}

DraggableButton.propTypes = propTypes;

export default DraggableButton;
