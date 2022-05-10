import { IRoom } from 'app/entities/room/room.model';

export interface IResident {
  id?: number;
  residentName?: string;
  residentAddress?: string;
  rooms?: IRoom[] | null;
}

export class Resident implements IResident {
  constructor(public id?: number, public residentName?: string, public residentAddress?: string, public rooms?: IRoom[] | null) {}
}

export function getResidentIdentifier(resident: IResident): number | undefined {
  return resident.id;
}
