export type LmsProfile = {
  id: string;
  full_name: string;
  email: string;
  role: "student" | "mentor";
};
export type LmsCourse = {
  id: string;
  mentor_id: string;
  program_slug: string;
  title: string;
  description: string;
  published: boolean;
  created_at: string;
};
export type LmsEnrollment = {
  id: string;
  course_id: string;
  student_id: string;
  status: "active" | "revoked";
  created_at: string;
};
export type LmsLesson = {
  id: string;
  course_id: string;
  title: string;
  module_title: string;
  content: string;
  recording_url: string | null;
  position: number;
  published: boolean;
};
export type LmsProgress = {
  student_id: string;
  lesson_id: string;
  completed_at: string;
};
export type LmsSession = {
  id: string;
  course_id: string;
  title: string;
  starts_at: string;
  duration_minutes: number;
  join_url: string;
  notes: string;
  cancelled: boolean;
};
export type LmsAssignment = {
  id: string;
  course_id: string;
  title: string;
  instructions: string;
  due_at: string | null;
  published: boolean;
};
export type LmsSubmission = {
  id: string;
  assignment_id: string;
  student_id: string;
  answer: string;
  attachment_url: string | null;
  submitted_at: string;
  score: number | null;
  feedback: string | null;
  graded_at: string | null;
};
export type LmsAnnouncement = {
  id: string;
  course_id: string;
  title: string;
  body: string;
  created_at: string;
};
export type LmsResource = {
  id: string;
  course_id: string;
  title: string;
  url: string;
};
export type LmsData = {
  profile: LmsProfile;
  profiles: LmsProfile[];
  courses: LmsCourse[];
  enrollments: LmsEnrollment[];
  lessons: LmsLesson[];
  progress: LmsProgress[];
  sessions: LmsSession[];
  assignments: LmsAssignment[];
  submissions: LmsSubmission[];
  announcements: LmsAnnouncement[];
  resources: LmsResource[];
};
