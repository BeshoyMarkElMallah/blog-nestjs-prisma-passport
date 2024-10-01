import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) { }


  async create(createArticleDto: CreateArticleDto) {
    return new ArticleEntity(await this.prisma.article.create({ data: createArticleDto }));
  }

  async findAll() {
    const articles = await this.prisma.article.findMany({ include: { author: true } })
    return articles.map((article) => new ArticleEntity(article));
  }

  async findOne(id: number) {
    const article = await this.prisma.article.findUnique({ where: { id }, include: { author: true } })
    if (!article) {
      throw new NotFoundException(`Article with ${id} does not exist`);
    }
    return new ArticleEntity(article);
  }
  async findDrafts() {
    const drafts = await this.prisma.article.findMany({ where: { published: false } });
    return drafts.map((draft) => new ArticleEntity(draft));
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    return new ArticleEntity(await this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    }));
  }

  async remove(id: number) {
    return new ArticleEntity(await this.prisma.article.delete({ where: { id } }));
  }
}
