
export interface RegisterDTO {
    name: string,
    surname: string,
    email: string,
    password: string,
    role: string
}

export interface LoginDTO {
    email: string,
    password: string
}