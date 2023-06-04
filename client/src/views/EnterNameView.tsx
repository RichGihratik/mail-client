import { TextField, Button, Typography } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import val from 'validator';
import { useNavigate } from 'react-router-dom';

export const EnterNameView = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  function onChange({ target: { value } }: ChangeEvent<HTMLInputElement>) {
    setName(value);
  }

  function login() {
    if (name !== '' && val.isAlpha(name)) {
      navigate(`/${name}`);
    }
  }

  return (
    <div className="flex flex-col gap-4 h-100 flex-1 max-w-lg self-center justify-center">
      <Typography variant="h6">Enter name:</Typography>
      <TextField variant="standard" onChange={onChange} label="Name" />
      <Button
        disabled={name === '' || !val.isAlpha(name)}
        variant="contained"
        color="primary"
        onClick={login}
      >
        Login
      </Button>
    </div>
  );
};
