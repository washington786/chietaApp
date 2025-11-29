export interface Step {
    title: string;
    date: string;
    status: 'completed' | 'failed' | 'pending' | 'rejected';
}