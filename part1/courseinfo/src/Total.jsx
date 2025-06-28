const Total = ({ parts }) => {
  const totalExercises = parts[0].exercises + parts[1].exercises + parts[2].exercises

  return (
    <div>
      <p>Number of exercises {totalExercises}</p>
    </div>
  )
}

export default Total
