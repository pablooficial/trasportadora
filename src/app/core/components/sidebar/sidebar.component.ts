import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class SidebarComponent {
  isClosed = false;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  toggleSidebar() {
    this.isClosed = !this.isClosed;
  }

  logout(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Você realmente deseja sair?',
      header: 'Sair',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.router.navigate(['/auth/login']);
      },
    });
  }

  goToRoute(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
