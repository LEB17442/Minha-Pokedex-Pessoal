import { Component, inject, OnInit, Renderer2 } from '@angular/core';
// 1. ChildrenOutletContexts é importado do @angular/router
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { NotificationComponent } from './components/notification/notification.component';
// 2. As ferramentas de animação são importadas do @angular/animations
import { trigger, transition, style, query, animate } from '@angular/animations';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent],
  template: `
    <div [@routeAnimations]="getRouteAnimationData()">
      <router-outlet></router-outlet>
    </div>
    <app-notification></app-notification>
  `,
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 })
        ], { optional: true }),
        query(':leave', [
          animate('200ms ease-out', style({ opacity: 0 }))
        ], { optional: true }),
        query(':enter', [
          animate('200ms ease-in', style({ opacity: 1 }))
        ], { optional: true }),
      ])
    ])
  ]
})
export class AppComponent implements OnInit{

  private contexts = inject(ChildrenOutletContexts);
  private themeService = inject(ThemeService);
  private renderer = inject(Renderer2);
  // O construtor agora reconhecerá ChildrenOutletContexts

  ngOnInit(): void {
    // Escuta as mudanças de tema e aplica a classe ao <body>
    this.themeService.currentTheme$.subscribe(theme => {
      if (theme === 'light') {
        this.renderer.addClass(document.body, 'theme-light');
        this.renderer.removeClass(document.body, 'theme-dark');
      } else {
        this.renderer.addClass(document.body, 'theme-dark');
        this.renderer.removeClass(document.body, 'theme-light');
      }
    });
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}