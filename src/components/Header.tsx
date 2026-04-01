import React from 'react';

interface Props {
  query: string;
  setQuery: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  toggleAll: () => void;
  allCompleted: boolean;
  disabled: boolean;
}

export const Header: React.FC<Props> = ({
  query,
  setQuery,
  onSubmit,
  toggleAll,
  allCompleted,
  disabled,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        onClick={toggleAll}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={query}
          onChange={event => setQuery(event.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
