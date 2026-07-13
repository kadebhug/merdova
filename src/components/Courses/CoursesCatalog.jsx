import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courses } from '../../courses/registry';
import './Courses.css';

export default function CoursesCatalog() {
  useEffect(() => {
    document.title = 'Courses — Merdova';
    return () => {
      document.title = '';
    };
  }, []);

  return (
    <div className="courses-page">
      <header className="courses-header">
        <h1>Courses</h1>
        <p className="courses-intro">
          Self-paced interactive lessons. Pick a course to start learning.
        </p>
      </header>

      <ul className="courses-list">
        {courses.map((course) => (
          <li key={course.slug}>
            <Link to={`/courses/${course.slug}`} className="course-card">
              <h2>{course.title}</h2>
              <p>{course.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
