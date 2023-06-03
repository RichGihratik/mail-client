import { TextField } from "@mui/material";
import { ChangeEvent, useState } from 'react';

export function EnterNameView() {
  const [name, setName] = useState('');

  function onChange(e: ChangeEvent<HTMLInputElement>) {

  }

  return (
    <div className=''>
      <TextField onChange={onChange}/>
    </div>
  );
}
