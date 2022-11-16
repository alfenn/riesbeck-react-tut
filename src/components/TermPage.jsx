import React, { useState } from 'react';
import CourseList from './CourseList'
import TermSelector from './TermSelector'
import Modal from './Modal'
import Schedule from './Schedule'
import './TermPage.css'
import { hasOverlap } from '../utilities/checkConflicts';


const terms = {
  Fall: 'Fall',
  Winter: 'Winter',
  Spring: 'Spring'
};

const TermPage = ({ courses }) => {
  const [selection, setSelection] = useState(() => Object.keys(terms)[0]);
  const [selected, setSelected] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const openModal = () => setIsVisible(true);
  const closeModal = () => setIsVisible(false);

  // console.log(courses);

  const toggleSelected = (id) => {
    setSelected(
      selected.includes(id)
        ? selected.filter(selectedCourseId => selectedCourseId !== id)
        : [...selected, id]
    );
  }

  const doesCourseOverlapWtihSelectedCourses = (course, courseId, selectedCourseIds) => {
    return selectedCourseIds.reduce((prev, selectedCourseId) => {
      const selectedCourse = courses[selectedCourseId];
      return (
        (hasOverlap(selectedCourse.meets, course.meets) 
                    && (selectedCourse.term === course.term) 
                    && !selectedCourseIds.includes(courseId)
        ) || prev
      );
    }, false);
  }

  const coursesWithInfo = Object.entries(courses).map(([id, course]) => {
    return ({
      doesOverlap: doesCourseOverlapWtihSelectedCourses(course, id, selected),
      isSelected: selected.includes(id),
      id,
      ...course
    })
  });

  const displayedCourses = coursesWithInfo.filter(course => course.term===selection)
  const selectedCourses = coursesWithInfo.filter(course => course.isSelected===true)

  return (
    <div>
      <nav>
        <TermSelector terms={terms} selection={selection} setSelection={setSelection} />
        <button className="btn btn-outline-dark" onClick={openModal}><i className="bi bi-cart4"></i></button>
      </nav>
      <CourseList termCourses={displayedCourses}
                  selected={selected}
                  toggleSelected={toggleSelected} />
      <Modal isVisible={isVisible} closeModal={closeModal}>
        <Schedule selectedCourses={selectedCourses} toggleSelected={() => {}} />
      </Modal>
      {/* <CourseList courses={Object.values(data).filter(course => course.term === selection)} /> */}
    </div>
  );
}

export default TermPage;
