import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { cache, CACHE_TYPES } from '../../utils/cache';
// import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as NFTS_ROUTES_MAP } from './routes';
// import { getWalletName } from '../../utils/wallet';
import { isMoreThanOne, isCollection } from '../../utils/nfts';

import { globalStyles } from '../../component-library/Global/theme';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalNftList from '../../component-library/Global/GlobalNftList';
import GlobalText from '../../component-library/Global/GlobalText';
import Header from '../../component-library/Layout/Header';

// import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
// import { SECTIONS_MAP } from '../../utils/tracking';

const NftsListPage = ({ t }) => {
  // useAnalyticsEventTracker(SECTIONS_MAP.NFT_LIST); // m17
  const navigate = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [nftsGroup, setNftsGroup] = useState([]);
  const [listedInfo, setListedInfo] = useState([]);

  const [{ activeWallet, config }] = useContext(AppContext);
  useEffect(() => {
    if (activeWallet) {
      cache(
        `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
        CACHE_TYPES.NFTS,
        // MI, simplify
        () => activeWallet.getAllNftsGrouped(),
        // () => activeWallet.getAllNfts(),
      ).then(async nfts => {
        setNftsGroup(nfts);
        const listed = await activeWallet.getListedNfts();
        setListedInfo(listed);
        setLoaded(true);
      });
    }
  }, [activeWallet]);
  // const goToBack = () => {
  //   navigate(APP_ROUTES_MAP.WALLET);
  // };
  const onClick = nft => {
    if (isMoreThanOne(nft)) {
      navigate(NFTS_ROUTES_MAP.NFTS_COLLECTION, { id: nft.collection });
    } else if (isCollection(nft)) {
      // MI
      console.log(
        `nft.items[0].mint.address: '${nft?.items?.[0].mint?.address}'`,
      );
      navigate(NFTS_ROUTES_MAP.NFTS_DETAIL, {
        id: nft?.items?.[0].mint?.address,
      });
    } else {
      console.log(
        `nft.mint.address: '${nft?.mint?.address}' nft.address: '${nft?.address}'`,
      );
      console.log(`nft.json.image: '${nft?.json?.image}'`);
      navigate(NFTS_ROUTES_MAP.NFTS_DETAIL, {
        // id: nft?.mint || nft?.items?.[0].mint, // m17: better for production
        id: nft?.mint?.address || nft?.address,
      });
    }
  };

  return (
    (
      <GlobalLayout>
        {loaded && (
          <GlobalLayout.Header>
            <Header activeWallet={activeWallet} config={config} t={t} />
            <View style={globalStyles.centered}>
              <GlobalText type="headline2">{t(`wallet.my_nfts`)}</GlobalText>
            </View>
            <GlobalNftList
              nonFungibleTokens={nftsGroup}
              listedInfo={listedInfo}
              onClick={onClick}
            />
          </GlobalLayout.Header>
        )}
        {!loaded && <GlobalSkeleton type="NftListScreen" />}
      </GlobalLayout>
    ) || null
  );
};

export default withTranslation()(NftsListPage);
