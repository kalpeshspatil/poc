import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRoom, Room } from '../room.model';
import { RoomService } from '../service/room.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IResident } from 'app/entities/resident/resident.model';
import { ResidentService } from 'app/entities/resident/service/resident.service';

@Component({
  selector: 'jhi-room-update',
  templateUrl: './room-update.component.html',
})
export class RoomUpdateComponent implements OnInit {
  isSaving = false;

  residentsSharedCollection: IResident[] = [];

  editForm = this.fb.group({
    id: [],
    roomTitle: [null, [Validators.required]],
    roomDescription: [null, [Validators.required]],
    roomType: [null, [Validators.required]],
    resident: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected roomService: RoomService,
    protected residentService: ResidentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ room }) => {
      this.updateForm(room);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('pocApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const room = this.createFromForm();
    if (room.id !== undefined) {
      this.subscribeToSaveResponse(this.roomService.update(room));
    } else {
      this.subscribeToSaveResponse(this.roomService.create(room));
    }
  }

  trackResidentById(_index: number, item: IResident): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRoom>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(room: IRoom): void {
    this.editForm.patchValue({
      id: room.id,
      roomTitle: room.roomTitle,
      roomDescription: room.roomDescription,
      roomType: room.roomType,
      resident: room.resident,
    });

    this.residentsSharedCollection = this.residentService.addResidentToCollectionIfMissing(this.residentsSharedCollection, room.resident);
  }

  protected loadRelationshipsOptions(): void {
    this.residentService
      .query()
      .pipe(map((res: HttpResponse<IResident[]>) => res.body ?? []))
      .pipe(
        map((residents: IResident[]) =>
          this.residentService.addResidentToCollectionIfMissing(residents, this.editForm.get('resident')!.value)
        )
      )
      .subscribe((residents: IResident[]) => (this.residentsSharedCollection = residents));
  }

  protected createFromForm(): IRoom {
    return {
      ...new Room(),
      id: this.editForm.get(['id'])!.value,
      roomTitle: this.editForm.get(['roomTitle'])!.value,
      roomDescription: this.editForm.get(['roomDescription'])!.value,
      roomType: this.editForm.get(['roomType'])!.value,
      resident: this.editForm.get(['resident'])!.value,
    };
  }
}
