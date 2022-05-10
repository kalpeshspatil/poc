import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RoomService } from '../service/room.service';
import { IRoom, Room } from '../room.model';
import { IResident } from 'app/entities/resident/resident.model';
import { ResidentService } from 'app/entities/resident/service/resident.service';

import { RoomUpdateComponent } from './room-update.component';

describe('Room Management Update Component', () => {
  let comp: RoomUpdateComponent;
  let fixture: ComponentFixture<RoomUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let roomService: RoomService;
  let residentService: ResidentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RoomUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(RoomUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RoomUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    roomService = TestBed.inject(RoomService);
    residentService = TestBed.inject(ResidentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Resident query and add missing value', () => {
      const room: IRoom = { id: 456 };
      const resident: IResident = { id: 54028 };
      room.resident = resident;

      const residentCollection: IResident[] = [{ id: 85427 }];
      jest.spyOn(residentService, 'query').mockReturnValue(of(new HttpResponse({ body: residentCollection })));
      const additionalResidents = [resident];
      const expectedCollection: IResident[] = [...additionalResidents, ...residentCollection];
      jest.spyOn(residentService, 'addResidentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ room });
      comp.ngOnInit();

      expect(residentService.query).toHaveBeenCalled();
      expect(residentService.addResidentToCollectionIfMissing).toHaveBeenCalledWith(residentCollection, ...additionalResidents);
      expect(comp.residentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const room: IRoom = { id: 456 };
      const resident: IResident = { id: 64329 };
      room.resident = resident;

      activatedRoute.data = of({ room });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(room));
      expect(comp.residentsSharedCollection).toContain(resident);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Room>>();
      const room = { id: 123 };
      jest.spyOn(roomService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ room });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: room }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(roomService.update).toHaveBeenCalledWith(room);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Room>>();
      const room = new Room();
      jest.spyOn(roomService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ room });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: room }));
      saveSubject.complete();

      // THEN
      expect(roomService.create).toHaveBeenCalledWith(room);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Room>>();
      const room = { id: 123 };
      jest.spyOn(roomService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ room });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(roomService.update).toHaveBeenCalledWith(room);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackResidentById', () => {
      it('Should return tracked Resident primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackResidentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
