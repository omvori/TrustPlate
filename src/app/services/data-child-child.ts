import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class DataChildChild {
  private dataSource = new BehaviorSubject<any>('Sono qui');
  currentData = this.dataSource.asObservable();

  changeData(data: any){
    this.dataSource.next(data)
  }

}
