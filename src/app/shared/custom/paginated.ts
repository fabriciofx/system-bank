import { Observable } from "rxjs/internal/Observable";
import { PageResult } from "./page-result";

export interface Paginated<T> {
  paginas(num: number, size: number): Observable<PageResult<T>>;
}
