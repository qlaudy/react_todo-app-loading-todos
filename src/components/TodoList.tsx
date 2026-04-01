import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deletingIds: number[];
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  editingTodo: Todo | null;
  setEditingTodo: (todo: Todo | null) => void;
  newTitle: string;
  setNewTitle: (value: string) => void;
  updateTitle: (e: React.FormEvent) => void;
  handleKeyUp: (e: React.KeyboardEvent) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deletingIds,
  onDelete,
  onToggle,
  editingTodo,
  setEditingTodo,
  newTitle,
  setNewTitle,
  updateTitle,
  handleKeyUp,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isDeleting={deletingIds.includes(todo.id)}
        onDelete={onDelete}
        onToggle={onToggle}
        editingTodo={editingTodo}
        setEditingTodo={setEditingTodo}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        updateTitle={updateTitle}
        handleKeyUp={handleKeyUp}
      />
    ))}
  </section>
);
