import { atom } from 'recoil';

export const dashboardMenu = atom({
    key: 'dashboardMenu',
    default: {
        page: '',
        params: {}
    }
});