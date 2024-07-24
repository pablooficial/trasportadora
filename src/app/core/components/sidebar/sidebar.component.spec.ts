import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let router: Router;
  let confirmationService: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SidebarComponent],
      providers: [
        { provide: ConfirmationService, useFactory: () => new ConfirmationService() },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    confirmationService = TestBed.inject(ConfirmationService);
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`isClosed has default value`, () => {
    expect(component.isClosed).toEqual(false);
  });

  it('should toggle sidebar', () => {
    component.isClosed = false;
    component.toggleSidebar();
    expect(component.isClosed).toBe(true);
  });

  it('should logout', () => {
    const confirmSpy = spyOn(confirmationService, 'confirm').and.callFake((options: any) => {
      if (options.accept) {
        options.accept();
      }
      return confirmationService;
    });
    const navigateSpy = spyOn(router, 'navigate');
    component.logout({ target: {} } as Event); // Pass an object with target property
    expect(confirmSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should go to route', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goToRoute('dashboard');
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });
});
