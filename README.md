# E-Learning Platform

A role-based dashboard for Students, Instructors, and Admins to manage courses, track analytics, and manage sessions. Built with **Next.js**, **Redux**, and **TailwindCSS** for a seamless and responsive user experience.

## 🔗 Live Demo
**[E-Learning Dashboard](https://e-learning-dashboard-pied.vercel.app/)**

---

## 🚀 Features
### **Student Dashboard**
- View completed and upcoming sessions.
- Track weekly performance trends using bar and line charts.
- Get a course overview and progress tracking.

### **Instructor Dashboard**
- Manage courses (Add, Edit, Delete).
- View student distribution by course through a pie chart.
- Monitor course progress and manage students.

### **Admin Dashboard**
- Manage users (Add, Edit, Delete).
- Filter users by roles: Student, Instructor, Admin.
- Search users and implement pagination for better navigation.

---

## 🛠️ Tech Stack
- **Frontend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Charts**: [Chart.js](https://www.chartjs.org/) (Pie, Bar, Line Charts)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📁 Folder Structure
```plaintext
src/
├── app/
│   ├── dashboard/
│   │   ├── student/
│   │   ├── instructor/
│   │   ├── admin/
│   ├── api/
├── components/
│   ├── Common/
│   ├── Student/
│   ├── Instructor/
│   ├── Admin/
├── store/
├── styles/
├── utils/
│   ├── commonUtilities.ts

## 🔄 State Management with Redux

This application leverages **Redux Toolkit** for efficient global state management. The following key features are managed:

- **Upcoming Sessions**: Manages student session data.
- **Courses**: Handles instructor course data.
- **User Management**: Admin-related user data.

Each feature is modularized with a dedicated slice located in `src/store/features/`.

---

## 📊 Analytics with Charts

The application provides insightful analytics through visualizations using **react-chartjs-2** and **Chart.js**:

- **Bar Chart**: Weekly performance trends for students.
- **Pie Chart**: Student distribution across instructors.
- **Line Chart**: Weekly improvement analysis.

---

## 🌍 Deployment

The application is deployed on **Vercel** for seamless hosting and continuous integration:

1. Push your code to a **GitHub repository**.
2. Connect the repository to **Vercel**.
3. Ensure the following environment variable is configured in Vercel:
   - `API_URL` set to `/`.

---

## 📜 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it as needed.

---

## 📧 Contact

For any questions or assistance, reach out to:

- **Name**: Venkatesh S  
- **Email**: [techvenkats@gmail.com](mailto:techvenkats@gmail.com)  
- **GitHub**: [https://github.com/venkat-ui-dev](https://github.com/venkat-ui-dev)  