import { Component, OnInit, Pipe } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, map, shareReplay } from 'rxjs/operators';
import { DbService } from '../services/db.service';
import { ModalController } from '@ionic/angular';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {
  todos;
  filtered;

  filter = new BehaviorSubject(null);

  constructor(
    public db: DbService,
    public auth: AuthService,
    public modal: ModalController
    ) { }

  ngOnInit() {
    this.todos = this.auth.user$.pipe(
      switchMap(user =>
        this.db.collection$('todos', ref =>
        ref
          .where('uid', '==', user.uid)
          .orderBy('createdAt', 'desc')
          .limit(25)
        )
      ),
      shareReplay(1)
    );

    this.filtered = this.filter.pipe(
      switchMap(filter => {
        return this.todos.pipe(
          map(arr =>
            obj => (status ? obj.status === status : true)
          )
        );
      })
    );
  }

  deleteTodo(todo) {
    this.db.delete(`todos/${todo.id}`);
  }

  toggleStatus(todo) {
    const status = todo.status === 'complete' ? 'pending' : 'complete';
      this.db.updateAt(`todos/${todo.id}`, { status });
  }

  updateFilter(val) {
    this.filter.next(val);
  }

  async presentTodoForm(todo?: any) {
    const modal = await this.modal.create({
      component: TodoFormComponent,
      componentProps: { todo }
    });
    return await modal.present();
  }

  trackbyId(idx, todo) {
    return todo.id;
  }

}
