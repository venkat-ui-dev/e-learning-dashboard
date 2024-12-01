# E-Learning Platform

A role-based dashboard for Students, Instructors, and Admins to manage courses, track analytics, and manage sessions. Built with **Next.js**, **Redux**, and **TailwindCSS** for a seamless and responsive user experience.

## 🔗 Live Demo
**[E-Learning Dashboard](https://your-vercel-app-url.vercel.app/)**

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
