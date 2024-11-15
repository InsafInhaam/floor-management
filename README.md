# Restaurant Floor Plan Management Application

This web application allows restaurant managers to create custom seating arrangements with a drag-and-drop interface. Users can select, resize, rotate, duplicate, and delete tables (both circular and square) on a customizable restaurant floor plan. It’s designed for flexibility and precision in floor plan management.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Drag-and-Drop Mechanism](#drag-and-drop-mechanism)

---

## Features

- **Drag-and-Drop**: Easily place tables on a virtual floor.
- **Rotation**: Rotate tables to customize the layout.
- **Resize**: Adjust the size of tables as needed.
- **Duplicate and Delete**: Create duplicates or remove tables.
- **Customizable Floor Plan**: Design the floor layout for any restaurant space.

---

## Technologies Used

- **React**: Frontend framework for building user interfaces.
- **Redux**: Manages application state and facilitates table data management.
- **React DnD**: Handles drag-and-drop functionality within React components.
- **React RND**: Enables resizable and draggable functionality on tables.
- **Tailwind CSS**: Provides styling for a responsive and modern UI.
- **Axios**: Handles HTTP requests for backend communication.
- **SVG Icons & React Icons**: Used for icons throughout the application, such as action buttons.

---

## Getting Started

To get the application running on your local machine, follow these steps.

### Frontend Setup

1. Navigate to the project root directory.
2. Run the following commands to install dependencies and start the frontend:

   ```bash
   npm install
   npm start


### Backend Setup
1. Navigate to the api directory:

   ```bash
   cd api

2. Install dependencies and start the backend server:

   ```bash
   npm install
   npm start

The backend server should now be running on http://localhost:8080.



## Drag-and-Drop Mechanism
The application utilizes React DnD and React RND for its drag-and-drop and resizing functionality. Here’s a breakdown of the drag-and-drop mechanism:

1. Initial Placement: Users drag tables onto the floor plan using React DnD.
Position Calculation: Table coordinates are calculated through monitor.getClientOffset() in React DnD, ensuring accurate placement within the floor bounds.
2. Resizing: The React RND library is used to allow tables to be resized directly within the floor plan.
3. Rotation: Custom code calculates table rotation by tracking the mouse position relative to the table center.
4. State Management: All table data (position, size, rotation) is stored in a Redux store, allowing precise control over re-rendering and table selection.

Justification: This approach, combining React DnD and React RND, provides flexibility, ease of implementation, and reliability for handling complex drag, drop, and resize events. It allows users to create an accurate restaurant floor layout quickly.