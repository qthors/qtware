import React, { useContext } from 'react';

import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation, withParams } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP as ROUTES_WALLET_MAP } from '../Wallet/routes';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalAvatarList from '../../component-library/Global/GlobalAvatarList';

import { AppContext } from '../../AppProvider';

const AccountEditProfileAvatarsPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [{ activeWallet }, { editWalletAvatar }] = useContext(AppContext);

  const onBack = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_PROFILE, {
      address: params.address,
    });
  const onClick = id => {
    editWalletAvatar(
      activeWallet.getReceiveAddress(),
      // `http://static.salmonwallet.io/avatar/${id}.png`,
      // `https://www.arcaps.com/shared/qtware/Avatar.png`,
      `https://www.arcaps.com/shared/qtware/avatar/${id}.png`,
    );
    navigate(ROUTES_WALLET_MAP.WALLET_OVERVIEW);
  };
  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t(`settings.wallets.set_profile_picture`)}
        />
        <GlobalAvatarList onClick={onClick} />
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(AccountEditProfileAvatarsPage));
