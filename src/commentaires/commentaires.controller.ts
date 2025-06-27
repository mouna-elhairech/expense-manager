import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentairesService } from './commentaires.service';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';

@UseGuards(JwtAuthGuard)
@Controller('commentaires')
export class CommentairesController {
  constructor(
    private readonly commentairesService: CommentairesService,
  ) {}

  @Post()
  async create(
    @Body() body: CreateCommentaireDto,
    @Request() req,
  ) {
    const userId = req.user?.id;
    return this.commentairesService.create(body, userId); 
  }

  @Get()
  async findByEntity(
    @Query('entityId') entityId: string,
    @Query('entityType') entityType?: 'EXPENSE' | 'REIMBURSEMENT_REQUEST',
  ) {
    if (!entityId) throw new NotFoundException('entityId requis');
    return this.commentairesService.findByEntityId(entityId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    const commentaire = await this.commentairesService.findById(id);

    if (!commentaire) throw new NotFoundException('Commentaire introuvable');
    if (commentaire.utilisateur?.id !== userId)
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres commentaires');

    await this.commentairesService.delete(id);
    return { message: 'Commentaire supprimé' };
  }
}
