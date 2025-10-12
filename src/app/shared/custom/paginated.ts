import { Observable } from "rxjs";
import { PageResult } from "./page-result";

export interface Paginated<T> {
  paginas(num: number, size: number): Observable<PageResult<T>>;
}
