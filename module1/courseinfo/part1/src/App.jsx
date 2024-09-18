const Header = ({ course }) => {
  return (
    <h1>{course}</h1>
  );
};

const Part = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  return (
    <div>
      <Part key={0} name={parts[0].name} exercises={parts[0].exercises} />
      <Part key={1} name={parts[1].name} exercises={parts[1].exercises} />
      <Part key={2} name={parts[2].name} exercises={parts[2].exercises} />
    </div>
  );
};


const Total = ({ parts }) => {
  const sumExercises = parts[0].exercises + parts[1].exercises + parts[2].exercises;
  return <p>Number of exercises {sumExercises}</p>;
};


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default App;