import { Module } from '@nestjs/common';
import { EditorService } from './editor.service';
import { EditorGateway } from './editor.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './schemas/session.schema';
import { EditorController } from './editor.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }])],
  controllers: [EditorController],
  providers: [EditorGateway, EditorService],
})
export class EditorModule {}
