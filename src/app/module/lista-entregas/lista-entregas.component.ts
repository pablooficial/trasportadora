import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith, catchError } from 'rxjs/operators';
import { DataService } from '../../shared/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-lista-entregas',
  templateUrl: './lista-entregas.component.html',
  styleUrls: ['./lista-entregas.component.scss'],
})
export class ListaEntregasComponent implements OnInit {
  entregas$: Observable<any[]> = of([]);
  dataSource = new MatTableDataSource<any>([]);
  motoristaFilter = new FormControl('');
  statusFilter = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.entregas$ = this.dataService.getDados().pipe(
      catchError(error => {
        console.error('Erro ao obter dados', error);
        return of([]);
      })
    );

    const motoristaFilter$ = this.motoristaFilter.valueChanges.pipe(
      startWith(this.motoristaFilter.value)
    );
    const statusFilter$ = this.statusFilter.valueChanges.pipe(
      startWith(this.statusFilter.value)
    );

    combineLatest([this.entregas$, motoristaFilter$, statusFilter$]).pipe(
      map(([entregas, motorista, status]) =>
        entregas.filter(entrega =>
          (motorista ? entrega.motorista.nome.toLowerCase().includes(motorista.toLowerCase()) : true) &&
          (status ? entrega.status_entrega === status : true)
        )
      )
    ).subscribe(filteredEntregas => {
      this.dataSource.data = filteredEntregas;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
