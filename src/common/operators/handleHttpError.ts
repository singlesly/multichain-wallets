import { catchError, Observable, throwError } from 'rxjs';

export function handleHttpError<T>(source: Observable<T>): Observable<T> {
  return source.pipe(
    catchError((err) => {
      console.log(err?.response?.data);

      return throwError(() => err);
    }),
  );
}
