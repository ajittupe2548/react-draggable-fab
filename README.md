# react-draggable-button

A simple and customizable draggable button component for the web, allowing users to move it around the screen with it snapping to a corner on release.

-   **Customizable** - Easy to customize button state and text.
-   **Lightweight** - No dependencies other than _prop-types_.

## Installation

```bash
npm install react-draggable-button
```

## Usage

> Important: Make sure to include the [css file](https://github.com/ajittupe2548/react-draggable-button/blob/master/src/draggable-button.css).

```js
import React from 'react';
import DraggableButton from 'react-draggable-button';

const App = () => {
    return <DraggableButton {...props}>UNCONTROLLED</DraggableButton>;
};
```

## API

| Prop                 | Type   | Default     | Description                                                                                           |
| -------------------- | ------ | ----------- | ----------------------------------------------------------------------------------------------------- |
| blurDelay            | number | `3000`      | Delay before applying the grayed-out (blurred) button style, in milliseconds.                         |
| children             | string | `''`        | Content inside the draggable button.                                                                  |
| className            | string | `''`        | Additional CSS class for the component wrapper.                                                       |
| closeButtonBottom    | string | `100px`     | CSS `bottom` property value for the close button.                                                     |
| closeButtonClassName | string | `''`        | Additional CSS class for the close button.                                                            |
| isVisible            | bool   | `undefined` | If `true`, the button will be visible.                                                                |
| overlayClassName     | string | `''`        | Additional CSS class for the overlay (background blackout).                                           |
| stickyEdge           | string | `left`      | The edge of the screen where the button will stick (`left` or `right`).                               |
| verticalThreshold    | number | `50`        | Threshold value for vertical positioning. The component will not stick above or below this threshold. |
| xPosition            | string | `0`         | Horizontal position (CSS `left` or `right`) of the component relative to the window.                  |
| yPosition            | string | `400px`     | Vertical position (CSS `top`) of the component relative to the window.                                |
| onClick              | func   | `() => {}`  | Callback function triggered when the button is clicked.                                               |
| onClose              | func   | `() => {}`  | Callback function triggered when the draggable button is dropped onto the close button.               |

## License

MIT
