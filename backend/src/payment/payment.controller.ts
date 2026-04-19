import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create-session')
  createSession(@Body() body: { appointmentId: string }) {
    return this.paymentService.createCheckoutSession(body.appointmentId);
  }
  @Post('webhook')
  handleWebhook(@Req() req: any, @Res() res: any) {
    return this.paymentService.handleWebhook(req, res);
  }
}
