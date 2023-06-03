import { selector } from 'recoil';
import { listenAsName } from './messages';
import { connect } from '@/api';

export const socket = selector({
  key: 'messageSocket',
  get: ({ get }) => {
    const socket = connect(get(listenAsName));
    return socket;
  },
});

export const socketLoading = selector({
  key: 'socketLoading',
  get: ({ get }) => {
    const result = get(socket);
    return result ? result.loading : false;
  },
});
