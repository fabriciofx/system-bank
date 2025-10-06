// Se sua API ainda não retorna este formato, ajuste o service para retornar {
// items, total }.
export interface PageResult<T> {
  items: T[];
  total: number;
}
