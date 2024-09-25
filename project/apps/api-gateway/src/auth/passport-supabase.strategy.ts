import { Request } from 'express';
import { JwtFromRequestFunction } from 'passport-jwt';
import { Strategy } from 'passport-strategy';

import { Logger } from '@nestjs/common';
import { AuthUser } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';

export interface SupabaseAuthStrategyOptions {
  supaBase: SupabaseService;
  extractor: JwtFromRequestFunction;
}

const UNAUTHORIZED = 'Unauthorized';
const SUPABASE_AUTH = 'SUPABASE_AUTH';
export class SupabaseAuthStrategy extends Strategy {
  readonly name = SUPABASE_AUTH;
  private supabase: SupabaseService;
  private extractor: JwtFromRequestFunction;
  private readonly logger = new Logger(SupabaseAuthStrategy.name);
  success: (user: any, info: any) => void;
  fail: Strategy['fail'];

  constructor(options: SupabaseAuthStrategyOptions) {
    super();
    if (!options.extractor) {
      throw new Error(
        '\n Extractor is not a function. You should provide an extractor. \n Read the docs: https://github.com/tfarras/nestjs-firebase-auth#readme',
      );
    }

    this.supabase = options.supaBase;
    this.extractor = options.extractor;
  }

  async validate(payload: AuthUser | null): Promise<AuthUser | null> {
    if (!!payload) {
      this.success(payload, {});

      return payload;
    }
    this.fail(UNAUTHORIZED, 401);

    return null;
  }

  authenticate(req: Request): void {
    const idToken = this.extractor(req);
    if (!idToken) {
      this.fail(UNAUTHORIZED, 401);
      return;
    }
    this.supabase
      .getClient()
      .auth.getUser(idToken)
      .then(({ data: { user } }) => this.validate(user))
      .catch((err) => {
        this.fail(err.message, 401);
      });
  }
}
