# Portfolio Web App

This is a comprehensive portfolio web application built with Next.js, Firebase, and Tailwind CSS. It features a dynamic, interactive, and visually appealing frontend to showcase projects, skills, and experiences, along with a powerful admin dashboard to manage the content of the entire website.

## Features

### Public-Facing Portfolio

The main portfolio is designed as an interactive flipbook, providing a unique and engaging user experience.

- **Flipbook Interface:** The portfolio is presented as a realistic flipbook, allowing users to navigate through pages with a flipping animation.
- **Cover Page:** A visually appealing cover page that serves as the entry point to the portfolio.
- **Table of Contents:** An interactive table of contents that allows for quick navigation to different sections of the portfolio.
- **About Page:** A section to introduce yourself and provide a brief overview of your background and skills.
- **Skills Page:** Showcase your skills with details and proficiency levels.
- **Projects Page:** Display your projects with descriptions, technologies used, and links to live demos or source code.
- **Experience Page:** Detail your professional experience and work history.
- **Education Page:** List your educational qualifications and achievements.
- **Achievements Page:** Highlight your awards, certifications, and other accomplishments.
- **Contact Page:** A form for visitors to get in touch with you.
- **Private Info Page:** A section that can be protected and only accessible to authorized users.
- **Back Cover Page:** A concluding page for the flipbook.

### Admin Dashboard

The admin dashboard is a secure area where you can manage all the content of your portfolio.

- **Authentication:** Secure login for the admin user.
- **Dashboard Overview:** A central dashboard to get an overview of the portfolio content.
- **Content Management:**
    - **Profile Management:** Update your personal information, bio, and profile picture.
    - **Skills Management:** Add, edit, and delete skills.
    - **Projects Management:** Manage your project listings, including descriptions, images, and links.
    - **Experience Management:** Add, edit, and delete your work experiences.
    - **Education Management:** Manage your educational background.
    - **Achievements Management:** Add, edit, and delete your achievements.
    - **Contact Management:** View and manage messages sent through the contact form.
    - **Private Info Management:** Manage the content of the private info page.
- **Sequence Management:** Reorder the sections of your portfolio to customize the flipbook's page order.
- **Security Settings:** Manage security-related configurations.

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Database:** [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Deployment:** [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v20 or later)
- npm

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your_username/your_project.git
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
3.  **Set up environment variables**

    Create a `.env.local` file in the root of your project and add the following Firebase configuration variables:

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXTPUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server**
    ```sh
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Available Scripts

-   `npm run dev`: Runs the app in development mode.
-   `npm run build`: Builds the app for production.
-   `npm run start`: Starts a production server.
-   `npm run lint`: Lints the code.
-   `npm run typecheck`: Checks for TypeScript errors.
-   `npm run seed`: Seeds the database with initial data.
-   `npm run reset-password`: Resets the admin password.
-   `npm run genkit:dev`: Starts the Genkit development server.
-   `npm run genkit:watch`: Starts the Genkit development server in watch mode.

## Deployment

### Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Netlify

You can also deploy your Next.js app to [Netlify](https://www.netlify.com/).

1.  Push your code to a GitHub repository.
2.  Go to the Netlify dashboard and click on "New site from Git".
3.  Connect your GitHub account and select the repository.
4.  Configure the build settings:
    -   **Build command:** `npm run build`
    -   **Publish directory:** `.next`
5.  Add your environment variables in the Netlify UI.
6.  Click "Deploy site".