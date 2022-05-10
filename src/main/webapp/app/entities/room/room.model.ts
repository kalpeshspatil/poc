import { IFacility } from 'app/entities/facility/facility.model';
import { IResident } from 'app/entities/resident/resident.model';

export interface IRoom {
  id?: number;
  roomTitle?: string;
  roomDescription?: string;
  roomType?: string;
  facilities?: IFacility[] | null;
  resident?: IResident | null;
}

export class Room implements IRoom {
  constructor(
    public id?: number,
    public roomTitle?: string,
    public roomDescription?: string,
    public roomType?: string,
    public facilities?: IFacility[] | null,
    public resident?: IResident | null
  ) {}
}

export function getRoomIdentifier(room: IRoom): number | undefined {
  return room.id;
}
