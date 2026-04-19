export class DoctorApprovedEvent {
  constructor(
    public readonly doctorId: string,
    public readonly userId: string,
  ) {}
}

export class DoctorRejectedEvent {
  constructor(
    public readonly doctorId: string,
    public readonly userId: string,
    public readonly reason: string,
  ) {}
}
