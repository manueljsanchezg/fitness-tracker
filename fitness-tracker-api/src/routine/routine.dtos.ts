

export interface RoutineExerciseDTO {
    exercise: string
    sets: number
    reps: number
    duration?: number
}

export interface CreateRoutineDTO {
    name: string
    exercises: RoutineExerciseDTO[]
}