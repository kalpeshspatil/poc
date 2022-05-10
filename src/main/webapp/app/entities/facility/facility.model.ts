import { IRoom } from 'app/entities/room/room.model';

export interface IFacility {
  id?: number;
  facilityName?: string;
  room?: IRoom | null;
}

export class Facility implements IFacility {
  constructor(public id?: number, public facilityName?: string, public room?: IRoom | null) {}
}

export function getFacilityIdentifier(facility: IFacility): number | undefined {
  return facility.id;
}
