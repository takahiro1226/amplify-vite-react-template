import { useEffect, useState } from "react";
import { TodoForm } from './components/TodoForm';
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [editingTodo, setEditingTodo] = useState<Schema["Todo"]["type"] | null>(null);
  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  
 
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  function handleEditTodo(todo: Schema["Todo"]["type"]) {
    setEditingTodo(todo);
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <TodoForm editTodo={editingTodo} onCancel={() => setEditingTodo(null)} />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span style={{ marginRight: '1rem' }}>{todo.content}</span>
            <button onClick={() => handleEditTodo(todo)}>Edit</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted with edit functionality.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
