# Front-End Developer Task: Mini Telegram App

## Objective

Create a mini Telegram-like application using Next.js that allows users to submit forms and view
registered data. The application should include basic form handling and a simple database to
store user-submitted data.

## 1. Tech Stack

```
● Next.js: For the front-end and API routes.
● Material-UI (MUI): For styling and UI components.
● React-Hook-Form: For form management.
● Basic Database: Use any simple database solution (e.g., SQLite, JSON file, or a
cloud-based solution like Firebase).
```

## 2. Core Features

#### 
    Form Handling

```
● Create a form where users can submit items (e.g., messages, posts, or other data).
● The form should include fields like:
○ Title (required, max 100 characters)
○ Description (required, max 500 characters)
○ Category (dropdown with at least 3 options)
○ Image URL (optional, must be a valid URL if provided)
● Use React-Hook-Form for form management.
```

#### Data Submission

```
● The data should be sent to the backend and stored in the database upon form
submission.
```

#### Data Display

```
● After successful submission, the user should be able to view all registered data (e.g., in
a table or list format) somewhere in the application.
```

## 3. Backend

```
● Create API routes in Next.js to handle:
○ Form submission and data storage.
○ Fetching and displaying registered data.
● Use a simple database to store form submissions.
```

### 4. Bonus Points

#### Authentication

```
● Implement a basic authentication system (e.g., login/signup) using JWT or
session-based authentication.
● Users should be able to register and log in.
```

#### Form Validation

```
● Use Zod for advanced form validation.
```

#### Real-Time Updates

```
● Implement real-time updates using WebSockets or polling to show new submissions
without refreshing the page.
```

#### Pagination or Infinite Scrolling

```
● Add pagination or infinite scrolling for the list of registered data.
```

#### Role-Based Access Control

```
● Implement role-based access control (e.g., admin vs. regular user).
```

## Deliverables

### 1. Source Code

```
● A GitHub repository containing the complete Next.js application.
● Include a README file with instructions on how to set up and run the project locally.
```

### 2. Live Demo

```
● Deploy the application on a platform like Vercel or Netlify and provide a live demo link.
● * Make a Telegram Mini App.
```

## Evaluation Criteria

```
● Code Quality: Clean, modular, and well-organized code.
● Functionality: All features should work as expected.
● UI/UX: The application should be visually appealing and user-friendly.
● Database Integration: Properly store and retrieve data from the database.
● Error Handling: Graceful handling of errors (e.g., form validation errors, API errors).
```
