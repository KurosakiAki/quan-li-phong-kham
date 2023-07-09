import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Note } from "./node.entity";
import { CreateNoteDto } from "./note.dto";

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private repository: Repository<Note>,
  ) {}

  async create(data: CreateNoteDto) {
    const note = this.repository.create({
      content: data.content
    })
    return await note.save();
  }

  async update(id: number, data: CreateNoteDto) {
    await this.repository.update({
      id
    }, {
      content: data.content
    })
  }
}
