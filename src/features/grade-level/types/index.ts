export interface GradeLevel {
    id: string;
    name: string;
    description: string;
    level: 'secundaria' | 'primaria'
    createdAt: Date;
    updateAt: Date;
}