import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getCourseBySlug } from '../../courses/registry';
import './Courses.css';

export default function CourseViewer() {
  const { slug } = useParams();
  const course = getCourseBySlug(slug);

  useEffect(() => {
    if (!course) return undefined;

    document.title = `${course.title} — Merdova`;
    return () => {
      document.title = '';
    };
  }, [course]);

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  return (
    <div className="course-viewer">
      <Link to="/courses" className="course-back">
        ← Courses
      </Link>
      <iframe
        className="course-frame"
        src={course.htmlPath}
        title={course.title}
        allow="fullscreen"
      />
    </div>
  );
}
