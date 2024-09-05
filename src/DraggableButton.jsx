import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CompareSvg, CloseBoldSvg } from './svg-icons';

import './draggable-button.css';

const propTypes = {
    /* Delay to add grayed out button style. It needs to be plus 1s since it starts when transition of text starts. */
    blurredBtnDelay: PropTypes.number,
    /** Bottom style value for close btn */
    closeBtnBottomValue: PropTypes.string,
    /** Custom className for the close btn */
    closeBtnClassName: PropTypes.string,
    /* Count subtext on collapsed state */
    count: PropTypes.number,
    /** If `true`, It will be visible */
    isVisible: PropTypes.bool,
    /** Callback fired when user click on component */
    onClick: PropTypes.func,
    /* Callback fired when user drops draggable btn on close btn  */
    onClose: PropTypes.func,
    /* Custom classes for overlay(Blackout window)  */
    overlayClassName: PropTypes.string,
    /* Initial text value to show with icon */
    text: PropTypes.string,
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
    count = 0,
    isVisible = false,
    onClick = () => {},
    onClose = () => {},
    overlayClassName = '',
    text = '',
    threshold = 50,
    xPositionValue = '6px',
    yPositionValue = '400px',
    className = '',
    align = 'left',
}) {
    const [isDragging, setIsDragging] = useState(false);

    const draggableBtnRef = useRef();
    const closeBtnRef = useRef();
    const isCloseButtonHoveredRef = useRef(false);
    const currentTextRef = useRef({ currentText: text, isTextVisible: !!text });

    useEffect(() => {
        if (text !== '') {
            currentTextRef.current.currentText = text;
        } else if (!isDragging && currentTextRef.current.isTextVisible) {
            currentTextRef.current.isTextVisible = false;
        }
    }, [text, isDragging]);

    useEffect(() => {
        const { style } = draggableBtnRef.current;
        style.opacity = 1;
        style.transition = null;
        const timeoutId = setTimeout(() => {
            style.transition = `opacity .2s linear`;
            style.opacity = null;
        }, blurredBtnDelay);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [count]);

    const handleTouchStart = (event) => {
        event.preventDefault();

        document.body.style.overflow = 'hidden';
        document.body.style.height = '100%';

        return false;
    };

    const handleTouchMove = (event) => {
        event.stopPropagation();

        const { clientX, clientY } = event.changedTouches[0];
        const { isTextVisible } = currentTextRef.current;

        const closePositionObj = closeBtnRef.current.getBoundingClientRect();
        const { left, right, top, bottom } = closePositionObj;

        const { clientWidth, clientHeight, style } = draggableBtnRef.current;
        const topPosition = clientY - clientHeight / 2;
        const leftPosition = clientX - clientWidth / 2;
        const bottomPosition = clientY + clientHeight / 2;
        const rightPosition = clientX + clientWidth / 2;

        const closeButtonHovered =
            bottomPosition > top &&
            topPosition < bottom &&
            rightPosition > left &&
            leftPosition < right;

        if (closeButtonHovered) {
            closeBtnRef.current.style.transform =
                'translate(-50%, 0) scale(1.2)';
            isCloseButtonHoveredRef.current = true;
        } else {
            closeBtnRef.current.style.transform = 'translate(-50%, 0)';
            isCloseButtonHoveredRef.current = false;
        }

        style.top = `${topPosition}px`;
        style.left = `${leftPosition}px`;
        style.right = !isTextVisible
            ? `${window.innerWidth - rightPosition}px`
            : null;

        if (!isDragging) {
            style.transition = null;
            setIsDragging(true);
        }

        return false;
    };

    const handleTouchEnd = (e) => {
        const { clientX, clientY } = e.changedTouches[0];
        const { clientHeight, style } = draggableBtnRef.current;
        const { isTextVisible } = currentTextRef.current;
        const windowHeight = window.innerHeight;

        if (isDragging) {
            const shouldStickonLeft = clientX < window.innerWidth / 2;

            let yPosition;
            if (windowHeight - clientY < threshold) {
                yPosition = windowHeight - threshold;
            } else if (windowHeight - clientY > windowHeight - threshold) {
                yPosition = threshold;
            } else {
                yPosition = clientY;
            }

            style.top = `${yPosition - clientHeight / 2}px`;
            style.left = shouldStickonLeft ? '6px' : null;
            style.right = !shouldStickonLeft ? '6px' : null;
            style.transition = `inset 0.5s, opacity 0.2s linear ${
                blurredBtnDelay / 1000
            }s`;

            if (isCloseButtonHoveredRef.current && onClose) {
                onClose();
            }
            if (text === '' && isTextVisible) {
                currentTextRef.current.isTextVisible = false;
            }
            setIsDragging(false);
        } else if (onClick) {
            onClick(e);
        }

        document.body.style.height = 'auto';
        document.body.style.overflow = 'auto';

        return false;
    };

    const initialPositionStyles = {
        top: yPositionValue,
        transition: `opacity 0.2s linear ${blurredBtnDelay / 1000}s`,
        right: `${align === 'right' ? xPositionValue : null}`,
        left: `${align !== 'right' ? xPositionValue : null}`,
    };
    return (
        <>
            <div
                style={initialPositionStyles}
                className={`container ${isVisible ? '' : 'visibility-hidden'} ${!currentTextRef.current.isTextVisible && !isDragging ? 'opacity-50' : ''} ${className}`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                ref={draggableBtnRef}
            >
                <p
                    className={`text ${currentTextRef.current.isTextVisible ? 'textTransitionStyle' : ''}`}
                >
                    {text || currentTextRef.current.currentText}
                </p>
                <CompareSvg />
                <span
                    className={`count ${currentTextRef.current.isTextVisible ? 'opacity-0' : 'countTransition'}`}
                >
                    {count}
                </span>
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
