import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeListingComponent } from './recipe-listing.component';

describe('RecipeListingComponent', () => {
  let component: RecipeListingComponent;
  let fixture: ComponentFixture<RecipeListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
