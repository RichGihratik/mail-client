import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useState, Fragment, useEffect, ChangeEvent } from 'react';

import { getUsers } from '@/api';

type Props = {
  onChange: (value: string) => void;
};

export function UserAutocomplete({ onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const users = await getUsers();

      if (active && users.result) {
        setOptions(users.result);
      }
    })();

    return () => {
      active = false;
    };
  });

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  function handleInput({ target: { value } }: ChangeEvent<HTMLInputElement>) {
    onChange(value);
  }

  return (
    <Autocomplete
      freeSolo
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option === value}
      getOptionLabel={(option) => option}
      options={options}
      loading={loading}
      onInputChange={(__, newInputValue) => onChange(newInputValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label="User"
          variant="standard"
          onChange={handleInput}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
}
