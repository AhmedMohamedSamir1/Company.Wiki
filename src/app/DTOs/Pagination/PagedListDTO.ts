export interface PagedListDTO<T> {
    items: T[]; 
    currentPage: number; 
    totalPages: number; 
    pageSize: number; 
    totalCount: number; 
    hasNext: boolean,
    hasPrevious: boolean,
}