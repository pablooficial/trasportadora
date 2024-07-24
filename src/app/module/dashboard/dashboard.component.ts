import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DataService } from '../../shared/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  entregas$: Observable<any[]> = of([]);
  entregasPorMotoristaDataSource = new MatTableDataSource<any>([]);
  insucessoPorMotoristaDataSource = new MatTableDataSource<any>([]);
  entregasPorBairroDataSource = new MatTableDataSource<any>([]);

  @ViewChild('motoristaPaginator') motoristaPaginator!: MatPaginator;
  @ViewChild('insucessoPaginator') insucessoPaginator!: MatPaginator;
  @ViewChild('bairroPaginator') bairroPaginator!: MatPaginator;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.entregas$ = this.dataService.getDados().pipe(
      catchError((error) => {
        console.error('Erro ao obter dados', error);
        return of([]);
      })
    );

    this.entregas$
      .pipe(
        map((entregas) =>
          entregas.reduce((acc, entrega) => {
            const motorista = acc.find(
              (item: any) => item.nome === entrega.motorista.nome
            ) || { nome: entrega.motorista.nome, total: 0, realizadas: 0 };
            motorista.total += 1;
            if (entrega.status_entrega === 'ENTREGUE') {
              motorista.realizadas += 1;
            }
            return [
              ...acc.filter(
                (item: any) => item.nome !== entrega.motorista.nome
              ),
              motorista,
            ];
          }, [])
        )
      )
      .subscribe((data) => (this.entregasPorMotoristaDataSource.data = data));

    this.entregas$
      .pipe(
        map((entregas) =>
          entregas.reduce((acc, entrega) => {
            if (entrega.status_entrega === 'INSUCESSO') {
              const motorista = acc.find(
                (item: any) => item.nome === entrega.motorista.nome
              ) || { nome: entrega.motorista.nome, insucessos: 0 };
              motorista.insucessos += 1;
              return [
                ...acc.filter(
                  (item: any) => item.nome !== entrega.motorista.nome
                ),
                motorista,
              ];
            }
            return acc;
          }, [])
        )
      )
      .subscribe((data) => (this.insucessoPorMotoristaDataSource.data = data));

    this.entregas$
      .pipe(
        map((entregas) =>
          entregas.reduce((acc, entrega) => {
            const bairro = acc.find(
              (item: any) => item.bairro === entrega.cliente_destino.bairro
            ) || {
              bairro: entrega.cliente_destino.bairro,
              total: 0,
              realizadas: 0,
            };
            bairro.total += 1;
            if (entrega.status_entrega === 'ENTREGUE') {
              bairro.realizadas += 1;
            }
            return [
              ...acc.filter(
                (item: any) => item.bairro !== entrega.cliente_destino.bairro
              ),
              bairro,
            ];
          }, [])
        )
      )
      .subscribe((data) => (this.entregasPorBairroDataSource.data = data));
  }

  ngAfterViewInit() {
    this.entregasPorMotoristaDataSource.paginator = this.motoristaPaginator;
    this.insucessoPorMotoristaDataSource.paginator = this.insucessoPaginator;
    this.entregasPorBairroDataSource.paginator = this.bairroPaginator;
  }
}
