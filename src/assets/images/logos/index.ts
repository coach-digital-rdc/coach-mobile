import TabletLogoSL from './tablet_logo_sl.png';
import LoginLogoSL from './login_logo_sl.png';
import TabletLogoNP from './tablet_logo_np.png';
import LoginLogoNP from './login_logo_np.png';
import TabletLogoCD from './tablet_logo_cd.png';
import LoginLogoCD from './login_logo_cd.png';

import {COUNTRY} from '@env';

const TabletLogos = {cd: TabletLogoCD, np: TabletLogoNP, sl: TabletLogoSL};
const LoginLogos = {cd: LoginLogoCD, np: LoginLogoNP, sl: LoginLogoSL};

export const TabletLogo = TabletLogos[COUNTRY] ?? TabletLogoSL;
export const LoginLogo = LoginLogos[COUNTRY] ?? LoginLogoSL;

export {default as SessionDefault} from './session_default.png';
