# react-draggable-fab

A simple and customizable draggable button component for the web. Users can easily move the button around the screen, and it will snap to an edge  upon release.

- **Customizable**: Easily configure button state, appearance to suit your needs.
- **Lightweight**: Minimal dependencies—only `prop-types` is required.
- **Responsive**: Works seamlessly across different screen sizes and devices.
- **Smooth Interaction**: Provides a smooth dragging experience with snap-to-edge  functionality.

## Features

- **Draggable**: Move the button freely around the screen.
- **Snap-to-Edge**: Automatically aligns the button to an edge when released.
- **Custom Styling**: Apply your own styles and customize the button's look and feel.
- **Touch and Mouse Support**: Fully functional with both touch and mouse interactions.

## Demo

[Demo Link](https://react-draggable-fab.vercel.app/)

## Installation

To get started, install the component using npm:

```bash
npm install react-draggable-fab
```

## Usage

```js
import React from 'react';
import DraggableButton from 'react-draggable-fab';

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
