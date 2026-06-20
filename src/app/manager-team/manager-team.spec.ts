import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerTeam } from './manager-team';

describe('ManagerTeam', () => {
  let component: ManagerTeam;
  let fixture: ComponentFixture<ManagerTeam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerTeam],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerTeam);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
