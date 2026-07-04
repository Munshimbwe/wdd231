const menuButton = document.querySelector('#menu-toggle');
const navMenu = document.querySelector('#nav-menu');

menuButton.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    menuButton.classList.toggle('open');
    
    if (menuButton.classList.contains('open')) {
        menuButton.textContent = 'X';
    } else {
        menuButton.textContent = '☰';
    }
});

const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces the development of world-class software.',
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces the tools and techniques for web publishing.',
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students write programs with functions.',
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Students will learn to create dynamic websites.',
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces encapsulation, inheritance, and polymorphism.',
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Web Frontend Development I',
        credits: 3,
        certificate: 'Web and Computer Programming',
        description: 'This course focuses on user experience and front-end development.',
        completed: false
    }
];

const courseContainer = document.querySelector('#course-container');
const totalCreditsDisplay = document.querySelector('#total-credits');
const filterButtons = document.querySelectorAll('.filter-btn');

function displayCourses(filteredCourses) {
    courseContainer.innerHTML = '';
    
    filteredCourses.forEach(course => {
        const card = document.createElement('div');
        card.classList.add('course-card');
        if (course.completed) {
            card.classList.add('completed');
        }
        card.textContent = `${course.subject} ${course.number}`;
        courseContainer.appendChild(card);
    });

    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    totalCreditsDisplay.textContent = totalCredits;
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active-filter'));
        button.classList.add('active-filter');
        
        const filterValue = button.getAttribute('data-filter').toUpperCase();
        
        if (filterValue === 'ALL') {
            displayCourses(courses);
        } else {
            const dynamicFilteredList = courses.filter(course => course.subject === filterValue);
            displayCourses(dynamicFilteredList);
        }
    });
});

displayCourses(courses);

document.querySelector('#currentyear').textContent = new Date().getFullYear();
document.querySelector('#lastModified').textContent = `Last Modification: ${document.lastModified}`;
