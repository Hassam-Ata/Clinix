export class AppointmentAcceptedEvent {
  constructor(
    public readonly appointmentId: string,
    public readonly patientId: string,
    public readonly doctorId: string,
    public readonly meetingLink: string,
  ) {}
}

export class AppointmentRejectedEvent {
  constructor(
    public readonly appointmentId: string,
    public readonly patientId: string,
  ) {}
}

export class AppointmentPaidEvent {
  constructor(
    public readonly appointmentId: string,
    public readonly patientId: string,
    public readonly doctorId: string,
    public readonly meetingLink: string | null,
  ) {}
}
