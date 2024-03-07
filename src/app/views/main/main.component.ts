import {
  Component, OnDestroy, OnInit, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { SafeHtmlPipe } from 'src/app/shared/pipes/safe-html.pipe';
import { ArticleCardComponent } from 'src/app/shared/components/article-card/article-card.component';
import { ArticleCardType } from 'src/types/article-card.type';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RequestTypeType } from 'src/types/request-type.type';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    SafeHtmlPipe,
    ArticleCardComponent,
    FormsModule,
    ModalComponent,
    RouterModule,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  articleService = inject(ArticleService);

  route = inject(ActivatedRoute);

  articleServiceSubscription: Subscription | null = null;

  routeFragmentSubscription: Subscription | null = null;

  serverStaticPath = environment.serverStaticPath;

  popularArticles!: ArticleCardType[];

  customOptionsMain: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
    },
    nav: false,
  };

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
    },
    nav: false,
    margin: 24,
  };

  mainCarouselSlides = [
    {
      title: 'Продвижение в Instagram для вашего бизнеса <span style="color: #709fdc">-15%</span>',
      type: 'Предложение месяца',
      image: 'slide-promotion.png',
      service: 'Продвижение',
    },
    {
      title: 'Нужен грамотный <span style="color: #709fdc">копирайтер?</span>',
      info: 'Весь декабрь у нас действует акция на работу копирайтера.',
      type: 'Акция',
      image: 'slide-copywriting.png',
      service: 'Копирайтинг',
    },
    {
      title: '<span style="color: #709fdc">6 место</span> в ТОП-10 SMM-агенств Москвы!',
      info: 'Мы благодарим каждого, кто голосовал за нас!',
      type: 'Новость дня',
      image: 'slide-ad.png',
      service: 'Реклама',
    },
  ];

  services = [
    {
      title: 'Создание сайтов',
      info: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 'От 7 500₽',
      image: 'services-site.png',
    },
    {
      title: 'Продвижение',
      info: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 'От 3 500₽',
      image: 'services-promotion.png',
    },
    {
      title: 'Реклама',
      info: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 'От 1 000₽',
      image: 'services-ad.png',
    },
    {
      title: 'Копирайтинг',
      info: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 'От 750₽',
      image: 'services-copywriting.png',
    },
  ];

  advantages = [
    {
      number: 1,
      text: '<span style="font-weight: 500;">Мастерски вовлекаем аудиторию&nbsp;в процесс.</span> Мы увеличиваем процент вовлечённости за короткий промежуток времени.',
    },
    {
      number: 2,
      text: '<span style="font-weight: 500;">Разрабатываем бомбическую визуальную концепцию.</span> Наши специалисты знают как создать уникальный образ вашего проекта.',
    },
    {
      number: 3,
      text: '<span style="font-weight: 500;">Создаём мощные воронки с помощью текстов.</span> Наши копирайтеры создают не только вкусные текста, но и классные воронки.',
    },
    {
      number: 4,
      text: '<span style="font-weight: 500;">Помогаем продавать больше.</span> Мы не только помогаем разработать стратегию по продажам, но также корректируем её под нужды заказчика.',
    },
  ];

  reviews = [
    {
      image: 'review1.png',
      name: 'Станислав',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.',
    },
    {
      image: 'review2.png',
      name: 'Алёна',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
    },
    {
      image: 'review3.png',
      name: 'Мария',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
    },
    {
      image: 'review4.jpg',
      name: 'Артур',
      text: 'Специалисты АйтиШторма разработали сайт для нашей компании в срок. Все условия по тех.заданию были выполнены. Порадовала коммуникация с командой и отделом дизайна.',
    },
    {
      image: 'review5.jpg',
      name: 'Наталья',
      text: 'Спасибо веб-студии АйтиШторм. Быстро. Качественно. Составили грамотное тех.задание на разработку сайта, где все детально прописали, реализовали все точно и в срок. Я довольна результатом. Рекомендую!',
    },
  ];

  requestModalIsShown = false;

  selectedService = '';

  requestType: RequestTypeType = RequestTypeType.order;

  serviceTitles: string[] = [];

  fragment: string | null = null;

  ngOnInit(): void {
    this.services.forEach((service) => {
      this.serviceTitles.push(service.title);
    });

    this.articleServiceSubscription = this.articleService.getPopularArticles()
      .subscribe((response : ArticleCardType[]) => {
        this.popularArticles = response;
      });

    this.routeFragmentSubscription = this.route.fragment
      .subscribe((fragment) => { this.fragment = fragment; });
  }

  openRequestModal(service: string) {
    this.selectedService = service;
    this.requestModalIsShown = true;
  }

  closeRequestModal() {
    this.requestModalIsShown = false;
  }

  ngOnDestroy(): void {
    this.articleServiceSubscription?.unsubscribe();
    this.routeFragmentSubscription?.unsubscribe();
  }
}
