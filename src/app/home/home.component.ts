import { Component, OnInit } from '@angular/core';
import { TodoComponent } from '../todo/todo.component';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  todos: any = [];
  filterTodos: any[] = [];

  constructor(private ApiService: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.ApiService.getAllTodos().subscribe((todos) => {
      this.todos = todos;
      this.filterTodos = this.todos;
    });
  }

  filterChanged(ev: MatSelectChange) {
    const value = ev.value;
    this.filterTodos = this.todos;
    if (value) {
      this.filterTodos = this.filterTodos.filter((t) => t.status === value);
      console.log(this.filterTodos);
    } else {
      this.filterTodos = this.todos;
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(TodoComponent, {
      width: '500px',
      hasBackdrop: true,
      role: 'dialog',
      height: '500px',
    });

    dialogRef.afterClosed().subscribe((data) => {
      this.ApiService.createTodo(data.title, data.description).subscribe(
        (result: any) => {
          console.log(result);
          this.todos.push(result);
          this.filterTodos = this.todos;
        }
      );
    });
  }

  statusChanged(ev: MatSelectChange, todoId: number, index: number) {
    const value = ev.value;
    this.ApiService.updateStatus(value, todoId).subscribe((todo) => {
      this.todos[index] = todo;
      this.filterTodos = this.todos;
    });
  }

  delete(id: number) {
    if (confirm('Do you want to remove this Todo ?')) {
      this.ApiService.deleteTodo(id).subscribe((res) => {
        // @ts-ignore
        if (res.success) {
          this.todos = this.todos.filter((t: any) => t.d !== id);
          this.filterTodos = this.todos;
        }
      });
    }
  }
}
