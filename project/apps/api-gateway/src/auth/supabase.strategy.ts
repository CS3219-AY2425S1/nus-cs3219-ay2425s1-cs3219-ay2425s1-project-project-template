import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { SupabaseAuthStrategy } from './passport-supabase.strategy';
import { Request } from 'express';
import { SupabaseService } from '../supabase/supabase.service';
import { CustomJwtExtractor } from './custom-jwt-extractor';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(
  SupabaseAuthStrategy,
  'supabase',
) {
  public constructor(private readonly supabaseService: SupabaseService) {
    super({
      supaBase: supabaseService,
      extractor: CustomJwtExtractor,
    });
  }

  async validate(payload: any): Promise<any> {
    super.validate(payload);
  }

  authenticate(req: Request) {
    super.authenticate(req);
  }
}
