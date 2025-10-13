import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { LoginTemplate } from './login-template';
import { provideHttpClient } from '@angular/common/http';

describe('LoginTemplate', () => {
  let component: LoginTemplate;
  let fixture: ComponentFixture<LoginTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginTemplate],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
