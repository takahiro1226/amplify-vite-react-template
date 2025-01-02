import { Button, Flex, TextField } from '@aws-amplify/ui-react';
import { useState, useEffect } from 'react';
import { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/api';

const client = generateClient<Schema>();

interface TodoFormProps {
  editTodo?: Schema['Todo']['type'] | null;
  onCancel?: () => void;
}

export function TodoForm({ editTodo, onCancel }: TodoFormProps) {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editTodo) {
      setContent(editTodo.content ?? '');
    } else {
      setContent('');
    }
  }, [editTodo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editTodo) {
        await client.models.Todo.update({
          id: editTodo.id,
          content
        });
        if (onCancel) onCancel();
      } else {
        await client.models.Todo.create({
          content
        });
      }
      setContent(''); // Clear form after submission
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  return (
    <Flex as="form" direction="row" gap="1rem" onSubmit={handleSubmit}>
      <TextField
        label="Todo Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your todo"
        required
      />
      <Button type="submit">{editTodo ? 'Update Todo' : 'Add Todo'}</Button>
      {editTodo && (
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </Flex>
  );
}