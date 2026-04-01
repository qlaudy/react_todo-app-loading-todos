/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  getTodos,
  removeTodoApi,
  updateTodoApi,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { Status } from './types/Status';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { TempTodo } from './components/tempTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filter, setFilter] = useState<Status>(Status.All);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filter === Status.Active) {
      return !todo.completed;
    }

    if (filter === Status.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => todo.completed === false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setErrorMessage(ErrorMessage.Title);

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedQuery,
      completed: false,
      userId: USER_ID,
    });

    setIsLoading(true);

    createTodo({ title: query, userId: USER_ID, completed: false })
      .then(todoFromServer => {
        setTodos(prev => [...prev, todoFromServer]);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);

        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setErrorMessage(null);
    setDeletingIds(prev => [...prev, todoId]);

    return removeTodoApi(todoId)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);

        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setDeletingIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const toggleTodo = (todo: Todo) => {
    setDeletingIds(prev => [...prev, todo.id]);

    return updateTodoApi(todo.id, { completed: !todo.completed })
      .then(updateTodo => {
        setTodos(prev => prev.map(t => (t.id === todo.id ? updateTodo : t)));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setDeletingIds(prev => prev.filter(id => id !== todo.id));
      });
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const promises = completedTodos.map(todo => deleteTodo(todo.id));

    Promise.all(promises).catch(() => {
      setErrorMessage(ErrorMessage.Delete);
    });
  };

  const toggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = areAllCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    const promises = todosToUpdate.map(todo => toggleTodo(todo));

    Promise.all(promises).catch(() => {
      setErrorMessage(ErrorMessage.Update);
    });
  };

  const updateTitle = (event: React.FormEvent) => {
    event.preventDefault();

    if (!editingTodo) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === editingTodo.title) {
      setEditingTodo(null);

      return;
    }

    if (!trimmedTitle) {
      deleteTodo(editingTodo.id);

      return;
    }

    setDeletingIds(prev => [...prev, editingTodo.id]);

    updateTodoApi(editingTodo.id, { title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
        setEditingTodo(null);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .finally(() => {
        setDeletingIds(prev => prev.filter(id => id !== editingTodo.id));
      });
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditingTodo(null);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          setQuery={setQuery}
          onSubmit={handleSubmit}
          toggleAll={toggleAll}
          allCompleted={todos.every(t => t.completed)}
          disabled={isLoading}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              deletingIds={deletingIds}
              onDelete={deleteTodo}
              onToggle={toggleTodo}
              editingTodo={editingTodo}
              setEditingTodo={setEditingTodo}
              newTitle={newTitle}
              setNewTitle={setNewTitle}
              updateTitle={updateTitle}
              handleKeyUp={handleKeyUp}
            />

            {tempTodo && <TempTodo todo={tempTodo} />}
          </>
        )}
        {/* Hide the footer if there are no todos */}

        {todos.length > 0 && (
          <Footer
            count={activeTodosCount.length}
            hasCompleted={todos.some(t => t.completed)}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
