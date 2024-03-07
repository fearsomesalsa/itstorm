import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { RouterModule } from '@angular/router';
import { ArticleCardType } from 'src/types/article-card.type';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
})
export class ArticleCardComponent {
  @Input() article!: ArticleCardType;

  serverStaticPath = environment.serverStaticPath;
}
