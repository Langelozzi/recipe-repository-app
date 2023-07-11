import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityRecipeListingComponent } from './community-recipe-listing.component';

describe('CommunityRecipeListingComponent', () => {
  let component: CommunityRecipeListingComponent;
  let fixture: ComponentFixture<CommunityRecipeListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityRecipeListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityRecipeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
