const courses = [
    { subject: 'CSE', number: 110, title: 'Intro to Programming', credits: 2, completed: true },
    { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
    { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: true },
    { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: true },
    { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: true },
    { subject: 'WDD', number: 231, title: 'Web Frontend Development I', credits: 3, completed: false }
];

const container = document.querySelector('#course-container');
const creditsDisplay = document.querySelector('#total-credits');
const filters = document.querySelectorAll('[data-filter]');

function renderCourses(filteredList) {
    container.innerHTML = '';
    filteredList.forEach(course => {
        const card = document.createElement('div');
        card.className = `course-card ${course.completed ? 'completed' : ''}`;
        card.textContent = `${course.subject} ${course.number}`;
        container.appendChild(card);
    });
    const total = filteredList.reduce((sum, c) => sum + c.credits, 0);
    creditsDisplay.textContent = total;
}

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active-filter'));
        btn.classList.add('active-filter');
        const filterType = btn.getAttribute('data-filter');
        if (filterType === 'all') {
            renderCourses(courses);
        } else {
            renderCourses(courses.filter(c => c.subject.toLowerCase() === filterType));
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    renderCourses(courses);
});
