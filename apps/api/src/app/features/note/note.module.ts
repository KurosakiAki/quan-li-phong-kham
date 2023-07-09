import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './node.entity';
import { NoteService } from './note.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note]),
  ],
  providers: [NoteService],
  controllers: [],
  exports: [NoteService]
})
export class NoteModule { }
