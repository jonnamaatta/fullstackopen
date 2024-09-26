const Course = ({ course }) => {

    const totalAmount = () => {
      return course.parts.reduce((sum, part) => sum + part.exercises, 0);
    }
    
    return (
      <div key={ course.id }>
        <h1>{ course.name }</h1>
        <div>
          {course.parts.map(part => 
            <p key={ part.id }>
              { part.name } { part.exercises }
            </p>
            
          )}
        </div>
        <div>
           <p>
             <strong>total of {totalAmount()} exercises</strong>
            </p>
        </div>
      </div>
    )
  }

  export default Course