import { Observable } from "rxjs";
import { PageResult } from "./page-result";

export interface Paginated<T> {
  pages(num: number, size: number): Observable<PageResult<T>>;
}
