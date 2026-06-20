import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUser } from './create-user';
import { User } from '../services/user';
import { of } from 'rxjs';

describe('CreateUser', () => {
  let component: CreateUser;
  let fixture: ComponentFixture<CreateUser>;

  const mockUserService = {
    getUsers: () => of({ users: [] }),
    createUser: () => of({ message: 'User created successfully' }),
    updateUser: () => of({ message: 'User updated successfully' }),
    deleteUser: () => of({ message: 'User status updated successfully' }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUser],
      providers: [
        { provide: User, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});