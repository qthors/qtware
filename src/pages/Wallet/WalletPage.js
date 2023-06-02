import React from 'react';

import { useNavigation } from '../../routes/hooks';
import RoutesBuilder from '../../routes/RoutesBuilder';
import routes from './routes';
import { ROUTES_TYPES } from '../../routes/constants';

import GlobalTabBarLayout from '../../component-library/Global/GlobalTabBarLayout';

import { withParams } from '../../routes/hooks'; // MI
import { withTranslation } from '../../hooks/useTranslations'; // MI

const WalletPage = ({ t }) => {
  const navigate = useNavigation();
  // const [{ activeWallet }] = useContext(AppContext);

  return (
    <GlobalTabBarLayout
      t={t}
      tabs={routes
        .filter(r => !!r.icon)
        .map(r => ({
          title: t(`routes.${r.name}`), // MI, vanilla: title: r.name
          onClick: () => navigate(r.key),
          icon: r.icon,
          route: r.route,
        }))}>
      <RoutesBuilder routes={routes} type={ROUTES_TYPES.TABS} />
    </GlobalTabBarLayout>
  );
};

// MI
// export default WalletPage;
export default withParams(withTranslation()(WalletPage));
