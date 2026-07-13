export const courses = [
  {
    slug: 'thinking-in-systems',
    title: 'Thinking in Systems',
    description: 'Interactive course · Chapters 1–2 — from Donella H. Meadows’ primer',
    htmlPath: '/courses/thinking-in-systems.html',
  },
];

export function getCourseBySlug(slug) {
  return courses.find((c) => c.slug === slug) ?? null;
}
