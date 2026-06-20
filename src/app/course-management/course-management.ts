import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../layout/sidebar/sidebar';
import { Course } from '../services/course';

@Component({
  selector: 'app-course-management',
  imports: [FormsModule, Sidebar],
  templateUrl: './course-management.html',
  styleUrl: './course-management.css',
})
export class CourseManagement implements OnInit {
  title = '';
  code = '';
  description = '';
  category = '';
  durationHours: number | null = null;

  courses: any[] = [];

  successMessage = '';
  errorMessage = '';

  isEditMode = false;
  selectedCourseId = '';

  searchText = '';
  selectedCategory = 'all';

  constructor(private courseService: Course) {}

  ngOnInit() {
  this.loadCourses();
}

loadCourses() {
  this.courseService.getCourses().subscribe({
    next: (res: any) => {
      this.courses = res.courses;
    },
    error: (err) => {
      console.log(err);
    },
  });
}

createCourse() {
  const courseData = {
    title: this.title,
    code: this.code,
    description: this.description,
    category: this.category,
    durationHours: this.durationHours,
  };

  if (this.isEditMode) {
    this.courseService.updateCourse(this.selectedCourseId, courseData).subscribe({
      next: (res: any) => {
        this.successMessage = res.message;
        this.errorMessage = '';

        this.resetForm();
        this.loadCourses();
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage =
          err.error?.message || 'Something went wrong';
      },
    });
  } else {
    this.courseService.createCourse(courseData).subscribe({
      next: (res: any) => {
        this.successMessage = res.message;
        this.errorMessage = '';

        this.resetForm();
        this.loadCourses();
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage =
          err.error?.message || 'Something went wrong';
      },
    });
  }
}

editCourse(course: any) {
  this.isEditMode = true;
  this.selectedCourseId = course._id;

  this.title = course.title;
  this.code = course.code;
  this.description = course.description;
  this.category = course.category;
  this.durationHours = course.durationHours;
}

deleteCourse(course: any) {
  if (
    confirm(
      course.isActive
        ? `Deactivate ${course.title}?`
        : `Activate ${course.title}?`
    )
  ) {
    this.courseService.deleteCourse(course._id).subscribe({
      next: (res: any) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        this.loadCourses();
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage =
          err.error?.message || 'Something went wrong';
      },
    });
  }
}

resetForm() {
  this.title = '';
  this.code = '';
  this.description = '';
  this.category = '';
  this.durationHours = null;
  this.isEditMode = false;
  this.selectedCourseId = '';
}

get filteredCourses() {
  return this.courses.filter((course) => {
    const search = this.searchText.toLowerCase();

    const matchesSearch =
      course.title?.toLowerCase().includes(search) ||
      course.code?.toLowerCase().includes(search) ||
      course.category?.toLowerCase().includes(search);

    const matchesCategory =
      this.selectedCategory === 'all' ||
      course.category === this.selectedCategory;

    return matchesSearch && matchesCategory;
  });
}
}