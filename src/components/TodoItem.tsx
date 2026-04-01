/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isDeleting: boolean;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  editingTodo: Todo | null;
  setEditingTodo: (todo: Todo | null) => void;
  newTitle: string;
  setNewTitle: (value: string) => void;
  updateTitle: (e: React.FormEvent) => void;
  handleKeyUp: (e: React.KeyboardEvent) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isDeleting,
  onDelete,
  onToggle,
  editingTodo,
  setEditingTodo,
  newTitle,
  setNewTitle,
  updateTitle,
  handleKeyUp,
}) => (
  <div className={`todo ${todo.completed ? 'completed' : ''}`}>
    <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
      <input
        id={`todo-${todo.id}`}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
      />
    </label>

    <span
      className="todo__title"
      onDoubleClick={() => {
        setEditingTodo(todo);
        setNewTitle(todo.title);
      }}
    >
      {editingTodo?.id === todo.id ? (
        <form onSubmit={updateTitle}>
          <input
            autoFocus
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={updateTitle}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        todo.title
      )}
    </span>

    <button onClick={() => onDelete(todo.id)}>×</button>

    <div className={`modal overlay ${isDeleting ? 'is-active' : ''}`}>
      <div className="modal-background" />
      <div className="loader" />
    </div>
  </div>
);
