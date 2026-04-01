import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
};

export const TempTodo: React.FC<Props> = ({ todo }) => (
  <div className="todo">
    <input type="checkbox" checked={false} readOnly />
    <span>{todo.title}</span>
    <button disabled>×</button>

    <div className="modal overlay is-active">
      <div className="modal-background" />
      <div className="loader" />
    </div>
  </div>
);
